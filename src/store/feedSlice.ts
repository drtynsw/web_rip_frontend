import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api'
import type { AttackVector } from '../modules/types'
import { feedFromMock } from '../modules/mock'
import { errorMessage, httpStatus, isServiceDown } from '../modules/errors'
import { toggleLike } from './attackVectorsSlice'
import type { RootState } from './index'

// Лента: текущая услуга, признак последней, загрузка
interface FeedState {
  current: AttackVector | null
  loading: boolean
  nextLoading: boolean
  isLast: boolean
  isMock: boolean
  error: string | null
}

const initialState: FeedState = {
  current: null,
  loading: false,
  nextLoading: false,
  isLast: false,
  isMock: false,
  error: null,
}

type FeedResult = { vector: AttackVector | null; isMock: boolean }
type ThunkConfig = { state: RootState; rejectValue: string }

// GET /api/attack_vectors/feed?id=&next= ; 404 — услуги нет (null)
const loadFeed = async (id: number | undefined, next: boolean, isGuest: boolean): Promise<FeedResult> => {
  try {
    const { data } = await api.attackVectors.feed({
      ...(id ? { id: String(id) } : {}),
      ...(next ? { next: 'true' } : {}),
    })
    return { vector: data, isMock: false }
  } catch (e) {
    if (httpStatus(e) === 404) return { vector: null, isMock: false }
    // mock — только в режиме гостя
    if (isGuest && isServiceDown(e)) return { vector: feedFromMock(id, next), isMock: true }
    throw e
  }
}

export const getFeedItem = createAsyncThunk<FeedResult, number | undefined, ThunkConfig>(
  'feed/getItem',
  async (id, { getState, rejectWithValue }) => {
    try {
      return await loadFeed(id, false, !getState().user.isAuthenticated)
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

export const getNextFeedItem = createAsyncThunk<FeedResult, number, ThunkConfig>(
  'feed/getNext',
  async (id, { getState, rejectWithValue }) => {
    try {
      return await loadFeed(id, true, !getState().user.isAuthenticated)
    } catch (e) {
      return rejectWithValue(errorMessage(e))
    }
  },
)

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedItem.pending, (state) => {
        state.loading = true
        state.isLast = false
        state.error = null
      })
      .addCase(getFeedItem.fulfilled, (state, { payload }) => {
        state.loading = false
        state.current = payload.vector
        state.isMock = payload.isMock
      })
      .addCase(getFeedItem.rejected, (state, { payload }) => {
        state.loading = false
        state.current = null
        state.error = payload ?? 'Ошибка загрузки'
      })
      .addCase(getNextFeedItem.pending, (state) => {
        state.nextLoading = true
        state.error = null
      })
      .addCase(getNextFeedItem.fulfilled, (state, { payload }) => {
        state.nextLoading = false
        if (payload.vector) {
          state.current = payload.vector
          state.isMock = payload.isMock
        } else {
          state.isLast = true
        }
      })
      .addCase(getNextFeedItem.rejected, (state, { payload }) => {
        state.nextLoading = false
        state.error = payload ?? 'Ошибка загрузки'
      })
      // лайк из ленты обновляет текущую услугу
      .addCase(toggleLike.fulfilled, (state, { payload }) => {
        if (state.current?.id === payload.id) state.current = payload
      })
  },
})

export default feedSlice.reducer
