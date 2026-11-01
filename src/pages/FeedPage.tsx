import { useEffect, useState } from 'react'
import type { FC, SyntheticEvent } from 'react'
import { Badge, Button, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import type { AttackVector } from '../modules/types'
import { getFeed } from '../modules/attackVectorsApi'
import { DEFAULT_VIDEO, imageOrDefault, videoOrDefault } from '../modules/media'
import { ROUTES } from '../Routes'

export const FeedPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vector, setVector] = useState<AttackVector | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)   // описание: «больше / меньше»
  const [isLast, setIsLast] = useState(false)       // следующей услуги нет

  useEffect(() => {
    setLoading(true)
    setExpanded(false)
    setIsLast(false)
    getFeed(id ? Number(id) : undefined)
      .then(setVector)
      .finally(() => setLoading(false))
  }, [id])

  const handleNext = async () => {
    if (!vector) return
    const next = await getFeed(vector.id, true)
    if (next) navigate(`${ROUTES.FEED}/${next.id}`)
    else setIsLast(true)
  }

  const handleVideoError = (e: SyntheticEvent<HTMLVideoElement>) => {
    if (!e.currentTarget.src.endsWith(DEFAULT_VIDEO)) e.currentTarget.src = DEFAULT_VIDEO
  }

  if (loading) return <div className="loader full"><Spinner animation="border" variant="primary" /></div>
  if (!vector) return <div className="feed-empty">Услуга не найдена или не опубликована.</div>

  return (
    <div className="feed-screen">
      <video
        key={vector.id}
        className="feed-video"
        src={videoOrDefault(vector.video_url)}
        poster={imageOrDefault(vector.image_url)}
        onError={handleVideoError}
        autoPlay muted loop playsInline
      />
      <div className="feed-overlay">
        <div className="feed-bottom-row">
          <div className="feed-desc-block">
            <Badge bg="" className="feed-category">вектор атаки</Badge>
            <div className="feed-title">{vector.title}</div>
            <div className={`feed-desc-text ${expanded ? 'expanded' : ''}`}>{vector.short_description}</div>
            <button type="button" className="desc-toggle" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'меньше' : 'больше'}
            </button>
          </div>
          <div className="feed-side-actions">
            <div className="feed-field">Опасность<b>{vector.severity ?? '—'} / 10</b></div>
            <div className="feed-field">Год фиксации<b>{vector.discovered_year ?? '—'}</b></div>
            <div className="like-badge"><span className="heart">♥</span>{vector.likes_count}</div>
            <Button className="next-btn" onClick={handleNext} disabled={isLast} title="Следующая услуга">›</Button>
          </div>
        </div>
        {isLast && <div className="feed-last">Это последняя услуга в ленте</div>}
      </div>
    </div>
  )
}
