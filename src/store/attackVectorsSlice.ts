import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api'
import type { AttackVector } from '../modules/types'
import { listFromMock } from '../modules/mock'
import { errorMessage, isServiceDown } from '../modules/errors'
import { logout } from './userSlice'
import type { RootState } from './index'

// Плитка услуг: фильтр по дате фиксации, список, загрузка, удаление и лайки
interface AttackVectorsState {
  filterDate: string            // значение календаря, ГГГГ-ММ-ДД (используется год)
  list: AttackVector[]
  loading: boolean
  isMock: boolean               // список взят из mock (бэкенд недоступен, режим гостя)
  pendingIds: number[]          // услуги, для которых идёт удаление/лайк — кнопки блокируются
  error: string | null
}

const initialState: AttackVectorsState = {
  filterDate: '',
  list: [],
  loading: false,
  isMock: false,
  pendingIds: [],
  error: null,
}

const yearOf = (date: string): number | undefined => (date ? Number(date.slice(0, 4)) : undefined)

export const getAttackVectorsList = createAsyncThunk<
  { list: AttackVector[]; isMock: boolean },
  void,
  { state: RootState; rejectValue: string }
>('attackVectors/getList', async (_, { getState, rejectWithValue }) => {
  const { attackVectors, user } = getState()
  const year = yearOf(attackVectors.filterDate)
  try {
    const { data } = await api.attackVectors.list(year ? { discovered_year: String(year) } : undefined)
    return { list: data, isMock: false }
  } catch (e) {
    // mock — только в режиме гостя
    if (!user.isAuthenticated && isServiceDown(e)) return { list: listFromMock(year), isMock: true }
    return rejectWithValue(errorMessage(e))
  }
})

export const deleteAttackVector = createAsyncThunk<number, number, { rejectValue: string }>(
  'attackVectors/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.attackVectors.remove(id)
      return id
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

// Лайк ставит/снимает текущий пользователь; ответ — обновлённая услуга (его слушает и лента)
export const toggleLike = createAsyncThunk<AttackVector, AttackVector, { rejectValue: string }>(
  'attackVectors/toggleLike',
  async (vector, { rejectWithValue }) => {
    try {
      const { data } = await api.attackVectors.like(vector.id, { like: vector.is_liked ? 0 : 1 })
      return data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

const removePending = (state: AttackVectorsState, id: number) => {
  state.pendingIds = state.pendingIds.filter((p) => p !== id)
}

const attackVectorsSlice = createSlice({
  name: 'attackVectors',
  initialState,
  reducers: {
    setFilterDate(state, { payload }: PayloadAction<string>) {
      state.filterDate = payload
    },
    resetFilter(state) {
      state.filterDate = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttackVectorsList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAttackVectorsList.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload.list
        state.isMock = payload.isMock
      })
      .addCase(getAttackVectorsList.rejected, (state, { payload }) => {
        state.loading = false
        state.list = []
        state.error = payload ?? 'Ошибка загрузки'
      })
      .addCase(deleteAttackVector.pending, (state, { meta }) => {
        state.pendingIds.push(meta.arg)
        state.error = null
      })
      .addCase(deleteAttackVector.fulfilled, (state, { payload }) => {
        removePending(state, payload)
        state.list = state.list.filter((v) => v.id !== payload)
      })
      .addCase(deleteAttackVector.rejected, (state, { meta, payload }) => {
        removePending(state, meta.arg)
        state.error = payload ?? 'Ошибка удаления'
      })
      .addCase(toggleLike.pending, (state, { meta }) => {
        state.pendingIds.push(meta.arg.id)
        state.error = null
      })
      .addCase(toggleLike.fulfilled, (state, { payload }) => {
        removePending(state, payload.id)
        state.list = state.list.map((v) => (v.id === payload.id ? payload : v))
      })
      .addCase(toggleLike.rejected, (state, { meta, payload }) => {
        removePending(state, meta.arg.id)
        state.error = payload ?? 'Ошибка'
      })
      // При выходе фильтр сбрасывается
      .addCase(logout, (state) => {
        state.filterDate = ''
        state.error = null
      })
  },
})

export const { setFilterDate, resetFilter } = attackVectorsSlice.actions
export default attackVectorsSlice.reducer
