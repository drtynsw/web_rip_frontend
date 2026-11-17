import { useState } from 'react'
import type { FC } from 'react'
import { Nav, Spinner } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES, ROUTE_LABELS } from '../Routes'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/userSlice'
import { logout as logoutRequest } from '../modules/authApi'

export const TabBar: FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, username } = useAppSelector((state) => state.user)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutRequest()
    } catch {
    } finally {
      dispatch(logout())
      setLoggingOut(false)
      navigate(ROUTES.TILES)
    }
  }

  return (
    <Nav className="tabbar" as="nav">
      <Nav.Link as={Link} to={ROUTES.FEED} active={pathname.startsWith(ROUTES.FEED)} className="tabbar-item">
        <span className="tab-icon">▶</span>{ROUTE_LABELS.FEED}
      </Nav.Link>
      {isAuthenticated ? (
        <Nav.Link as={Link} to={ROUTES.ADD} active={pathname === ROUTES.ADD} className="tabbar-item">
          <span className="tab-icon">+</span>{ROUTE_LABELS.ADD}
        </Nav.Link>
      ) : (
        <Nav.Link disabled className="tabbar-item" title="Доступно после входа">
          <span className="tab-icon">+</span>{ROUTE_LABELS.ADD}
        </Nav.Link>
      )}
      <Nav.Link as={Link} to={ROUTES.TILES} active={pathname === ROUTES.TILES} className="tabbar-item">
        <span className="tab-icon">▦</span>{ROUTE_LABELS.TILES}
      </Nav.Link>
      {isAuthenticated ? (
        <Nav.Link as="button" className="tabbar-item tabbar-login" onClick={handleLogout} disabled={loggingOut} title={username}>
          <span className="tab-icon">{loggingOut ? <Spinner size="sm" animation="border" /> : '⏻'}</span>
          Выход
          <span className="tab-user">{username}</span>
        </Nav.Link>
      ) : (
        <Nav.Link as={Link} to={ROUTES.LOGIN} active={pathname === ROUTES.LOGIN} className="tabbar-item tabbar-login">
          <span className="tab-icon">⎆</span>{ROUTE_LABELS.LOGIN}
        </Nav.Link>
      )}
    </Nav>
  )
}
