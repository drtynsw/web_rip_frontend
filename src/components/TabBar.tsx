import type { FC } from 'react'
import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES, ROUTE_LABELS } from '../Routes'

export const TabBar: FC = () => {
  const { pathname } = useLocation()
  const isFeed = pathname.startsWith(ROUTES.FEED)
  const isTiles = pathname === ROUTES.TILES

  return (
    <Nav className="tabbar" as="nav">
      <Nav.Link as={Link} to={ROUTES.FEED} active={isFeed} className="tabbar-item">
        <span className="tab-icon">▶</span>{ROUTE_LABELS.FEED}
      </Nav.Link>
      <Nav.Link disabled className="tabbar-item" title="Будет доступно после авторизации">
        <span className="tab-icon">+</span>{ROUTE_LABELS.ADD}
      </Nav.Link>
      <Nav.Link as={Link} to={ROUTES.TILES} active={isTiles} className="tabbar-item">
        <span className="tab-icon">▦</span>{ROUTE_LABELS.TILES}
      </Nav.Link>
      <Nav.Link disabled className="tabbar-item tabbar-login" title="Недоступно">
        <span className="tab-icon">⎆</span>{ROUTE_LABELS.LOGIN}
      </Nav.Link>
    </Nav>
  )
}
