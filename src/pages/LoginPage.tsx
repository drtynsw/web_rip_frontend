import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setUser } from '../store/userSlice'
import { login } from '../modules/authApi'
import { httpStatus } from '../modules/errors'

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Вход: POST /api/users/login через axios (без кодогенерации и thunk).
  // Браузер сохраняет cookie sessionId, в Redux вручную передаётся имя пользователя.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login({ username: username.trim(), password })
      dispatch(setUser(user.username))
      navigate(ROUTES.TILES)
    } catch (err) {
      const status = httpStatus(err)
      setError(status === 401 || status === 400 ? 'Неверный логин или пароль' : 'Сервис недоступен')
      setLoading(false)
    }
  }

  if (isAuthenticated) return <Navigate to={ROUTES.TILES} replace />

  return (
    <div className="form-page">
      <h1>Вход</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login-username">
          <Form.Label>Логин</Form.Label>
          <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" className="w-100" disabled={loading || !username.trim() || !password}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Вход'}
        </Button>
      </Form>
    </div>
  )
}
