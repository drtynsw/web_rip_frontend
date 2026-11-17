import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import attackVectorsReducer from './attackVectorsSlice'
import feedReducer from './feedSlice'
import draftReducer from './draftSlice'

// configureStore подключает redux-thunk middleware и Redux DevTools по умолчанию
export const store = configureStore({
  reducer: combineReducers({
    user: userReducer,
    attackVectors: attackVectorsReducer,
    feed: feedReducer,
    draft: draftReducer,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
