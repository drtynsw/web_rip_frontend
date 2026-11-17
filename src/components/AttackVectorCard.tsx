import type { FC, MouseEvent, SyntheticEvent } from 'react'
import { Button, Card } from 'react-bootstrap'
import type { AttackVector } from '../modules/types'
import { DEFAULT_IMAGE, imageOrDefault } from '../modules/media'

interface Props {
  vector: AttackVector
  onClick: (id: number) => void
  canAct: boolean                       // авторизованный пользователь: лайк и удаление своей услуги
  pending: boolean                      // идёт запрос по этой услуге — кнопки заблокированы
  onLike: (vector: AttackVector) => void
  onDelete: (vector: AttackVector) => void
}

export const AttackVectorCard: FC<Props> = ({ vector, onClick, canAct, pending, onLike, onDelete }) => {
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (!e.currentTarget.src.endsWith(DEFAULT_IMAGE)) e.currentTarget.src = DEFAULT_IMAGE
  }
  const stop = (action: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    action()
  }

  return (
    <Card className="tile-card" onClick={() => onClick(vector.id)}>
      <div className="tile-image-wrap">
        <Card.Img src={imageOrDefault(vector.image_url)} alt={vector.title} onError={handleError} />
      </div>
      <Card.Body className="tile-info">
        <Card.Title className="tile-title">{vector.title}</Card.Title>
        <div className="tile-actions">
          {canAct ? (
            <button
              type="button"
              className={`like-btn ${vector.is_liked ? 'liked' : ''}`}
              onClick={stop(() => onLike(vector))}
              disabled={pending}
              title={vector.is_liked ? 'Убрать лайк' : 'Поставить лайк'}
            >
              <span className="heart">{vector.is_liked ? '♥' : '♡'}</span> {vector.likes_count}
            </button>
          ) : (
            <div className="tile-likes"><span className="heart">♥</span> {vector.likes_count}</div>
          )}
          {canAct && !!vector.is_mine && (
            <Button size="sm" variant="outline-danger" className="delete-btn" onClick={stop(() => onDelete(vector))} disabled={pending} title="Удалить">
              Удалить
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
