import axios from 'axios'
import type { UserResponse } from '../api/Api'

export interface Credentials {
  username: string
  password: string
}

export async function login(credentials: Credentials): Promise<UserResponse> {
  const { data } = await axios.post<UserResponse>('/api/users/login', credentials, { withCredentials: true })
  return data
}

export async function logout(): Promise<void> {
  await axios.post('/api/users/logout', null, { withCredentials: true })
}
