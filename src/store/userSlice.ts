import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Состояние авторизации. Заполняется вручную после axios-запроса входа/выхода.
// После F5 сбрасывается в гостя (cookie sessionId при этом остаётся в браузере).
interface UserState {
  username: string
  isAuthenticated: boolean
}

const initialState: UserState = {
  username: '',
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<string>) {
      state.username = payload
      state.isAuthenticated = true
    },
    logout() {
      return initialState
    },
  },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
