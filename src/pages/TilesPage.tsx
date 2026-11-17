import { useEffect } from 'react'
import type { FC } from 'react'
import { Alert, Badge, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AttackVectorCard } from '../components/AttackVectorCard'
import { YearFilter } from '../components/YearFilter'
import { ROUTES } from '../Routes'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  deleteAttackVector, getAttackVectorsList, resetFilter, setFilterDate, toggleLike,
} from '../store/attackVectorsSlice'
import type { AttackVector } from '../modules/types'

export const TilesPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { filterDate, list, loading, isMock, pendingIds, error } = useAppSelector((state) => state.attackVectors)
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)

  useEffect(() => {
    dispatch(getAttackVectorsList())
  }, [dispatch, isAuthenticated])

  const handleSearch = () => dispatch(getAttackVectorsList())
  const handleReset = () => {
    dispatch(resetFilter())
    dispatch(getAttackVectorsList())
  }
  const handleDelete = (v: AttackVector) => {
    if (window.confirm(`Удалить «${v.title}»?`)) dispatch(deleteAttackVector(v.id))
  }

  return (
    <div className="tiles-page">
      <h1>
        Векторы атак
        {isMock && <Badge bg="secondary" className="mock-badge">демо-данные</Badge>}
      </h1>
      <YearFilter
        value={filterDate}
        onChange={(value) => dispatch(setFilterDate(value))}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />

      {error && <Alert variant="danger" className="py-2">{error}</Alert>}
      {loading && <div className="loader"><Spinner animation="border" variant="primary" /></div>}
      {!loading && !error && !list.length && <p className="tiles-empty">Ничего не найдено на выбранный год.</p>}
      {!loading && !!list.length && (
        <Row xs={2} className="g-2">
          {list.map((v) => (
            <Col key={v.id}>
              <AttackVectorCard
                vector={v}
                onClick={(id) => navigate(`${ROUTES.FEED}/${id}`)}
                canAct={isAuthenticated && !isMock}
                pending={pendingIds.includes(v.id)}
                onLike={(vector) => dispatch(toggleLike(vector))}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
