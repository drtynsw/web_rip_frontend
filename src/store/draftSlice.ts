import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'
import type { PublishRequest } from '../api/Api'
import type { AttackVector } from '../modules/types'
import { errorMessage, httpStatus } from '../modules/errors'
import { logout } from './userSlice'

// Добавление услуги: шаг 1 — черновик (название + файлы), шаг 2 — публикация
interface DraftState {
  draft: AttackVector | null
  loading: boolean
  error: string | null
}

const initialState: DraftState = {
  draft: null,
  loading: false,
  error: null,
}

export interface NewDraft {
  title: string
  image: File
  video: File
}

type ThunkConfig = { rejectValue: string }

// GET /api/attack_vectors/draft ; 404 — черновика нет (null)
const fetchDraft = async (): Promise<AttackVector | null> => {
  try {
    const { data } = await api.attackVectors.draft()
    return data
  } catch (e) {
    if (httpStatus(e) === 404) return null
    throw e
  }
}

export const getDraft = createAsyncThunk<AttackVector | null, void, ThunkConfig>(
  'draft/get',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDraft()
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

export const createDraft = createAsyncThunk<AttackVector, NewDraft, ThunkConfig>(
  'draft/create',
  async (fields, { rejectWithValue }) => {
    try {
      // файлы загружаются в MinIO через бэкенд, поэтому таймаут больше обычного
      const { data } = await api.attackVectors.create(fields, { timeout: 60000 })
      return data
    } catch (e) {
      // 409: черновик уже есть, продолжаем с ним
      if (httpStatus(e) === 409) {
        const existing = await fetchDraft().catch(() => null)
        if (existing) return existing
      }
      return rejectWithValue(errorMessage(e))
    }
  },
)

export const publishDraft = createAsyncThunk<AttackVector, PublishRequest, ThunkConfig>(
  'draft/publish',
  async (fields, { rejectWithValue }) => {
    try {
      const { data } = await api.attackVectors.publish(fields)
      return data
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

export const deleteDraft = createAsyncThunk<void, number, ThunkConfig>(
  'draft/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.attackVectors.remove(id)
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const pending = (state: DraftState) => {
      state.loading = true
      state.error = null
    }
    const rejected = (state: DraftState, action: { payload?: string }) => {
      state.loading = false
      state.error = action.payload ?? 'Ошибка'
    }
    builder
      .addCase(getDraft.pending, pending)
      .addCase(getDraft.fulfilled, (state, { payload }) => {
        state.loading = false
        state.draft = payload
      })
      .addCase(getDraft.rejected, rejected)
      .addCase(createDraft.pending, pending)
      .addCase(createDraft.fulfilled, (state, { payload }) => {
        state.loading = false
        state.draft = payload
      })
      .addCase(createDraft.rejected, rejected)
      .addCase(publishDraft.pending, pending)
      .addCase(publishDraft.fulfilled, () => initialState)
      .addCase(publishDraft.rejected, rejected)
      .addCase(deleteDraft.pending, pending)
      .addCase(deleteDraft.fulfilled, () => initialState)
      .addCase(deleteDraft.rejected, rejected)
      .addCase(logout, () => initialState)
  },
})

export default draftSlice.reducer
