import { useEffect, useState } from 'react'
import type { FC, SyntheticEvent } from 'react'
import { Alert, Badge, Button, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DEFAULT_VIDEO, imageOrDefault, videoOrDefault } from '../modules/media'
import { ROUTES } from '../Routes'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getFeedItem, getNextFeedItem } from '../store/feedSlice'
import { toggleLike } from '../store/attackVectorsSlice'

export const FeedPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { current: vector, loading, nextLoading, isLast, isMock, error } = useAppSelector((state) => state.feed)
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  const likePending = useAppSelector((state) => !!vector && state.attackVectors.pendingIds.includes(vector.id))
  const [expanded, setExpanded] = useState(false)   // описание: «больше / меньше» — локальное состояние UI

  const routeId = id ? Number(id) : undefined
  const preloaded = !!(location.state as { preloaded?: boolean } | null)?.preloaded
  const alreadyLoaded = preloaded && routeId !== undefined && vector?.id === routeId

  useEffect(() => {
    setExpanded(false)
    if (!alreadyLoaded) dispatch(getFeedItem(routeId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, routeId, isAuthenticated])

  const handleNext = async () => {
    if (!vector) return
    const result = await dispatch(getNextFeedItem(vector.id))
    if (getNextFeedItem.fulfilled.match(result) && result.payload.vector) {
      navigate(`${ROUTES.FEED}/${result.payload.vector.id}`, { state: { preloaded: true } })
    }
  }

  const handleVideoError = (e: SyntheticEvent<HTMLVideoElement>) => {
    if (!e.currentTarget.src.endsWith(DEFAULT_VIDEO)) e.currentTarget.src = DEFAULT_VIDEO
  }

  if (loading) return <div className="loader full"><Spinner animation="border" variant="primary" /></div>
  if (error && !vector) return <div className="feed-empty">{error}</div>
  if (!vector) return <div className="feed-empty">Услуга не найдена или не опубликована.</div>

  const canLike = isAuthenticated && !isMock

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
        {error && <Alert variant="danger" className="py-1 feed-error">{error}</Alert>}
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
            {canLike ? (
              <button
                type="button"
                className={`like-badge like-btn ${vector.is_liked ? 'liked' : ''}`}
                onClick={() => dispatch(toggleLike(vector))}
                disabled={likePending}
                title={vector.is_liked ? 'Убрать лайк' : 'Поставить лайк'}
              >
                <span className="heart">{vector.is_liked ? '♥' : '♡'}</span>{vector.likes_count}
              </button>
            ) : (
              <div className="like-badge"><span className="heart">♥</span>{vector.likes_count}</div>
            )}
            <Button className="next-btn" onClick={handleNext} disabled={isLast || nextLoading} title="Следующая услуга">
              {nextLoading ? <Spinner size="sm" animation="border" /> : '›'}
            </Button>
          </div>
        </div>
        {isLast && <div className="feed-last">Это последняя услуга в ленте</div>}
      </div>
    </div>
  )
}
