import { Api } from './Api'

export const api = new Api({
  baseURL: '',
  timeout: 3000,
  withCredentials: true,
})
