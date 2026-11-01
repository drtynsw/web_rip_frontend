import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { AttackVector } from '../modules/types'
import { getAttackVectors } from '../modules/attackVectorsApi'
import { AttackVectorCard } from '../components/AttackVectorCard'
import { YearFilter } from '../components/YearFilter'
import { ROUTES } from '../Routes'

export const TilesPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const appliedDate = searchParams.get('date') ?? ''
  const [date, setDate] = useState(appliedDate)               // значение в поле календаря
  const [vectors, setVectors] = useState<AttackVector[]>([])  // карточки
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const year = appliedDate ? Number(appliedDate.slice(0, 4)) : undefined
    setLoading(true)
    getAttackVectors(year)
      .then(setVectors)
      .finally(() => setLoading(false))
  }, [appliedDate])

  const handleSearch = () => setSearchParams(date ? { date } : {})
  const handleReset = () => {
    setDate('')
    setSearchParams({})
  }

  return (
    <div className="tiles-page">
      <h1>Векторы атак</h1>
      <YearFilter value={date} onChange={setDate} onSearch={handleSearch} onReset={handleReset} loading={loading} />

      {loading && <div className="loader"><Spinner animation="border" variant="primary" /></div>}
      {!loading && !vectors.length && <p className="tiles-empty">Ничего не найдено на выбранный год.</p>}
      {!loading && !!vectors.length && (
        <Row xs={2} className="g-2">
          {vectors.map((v) => (
            <Col key={v.id}>
              <AttackVectorCard vector={v} onClick={(id) => navigate(`${ROUTES.FEED}/${id}`)} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
