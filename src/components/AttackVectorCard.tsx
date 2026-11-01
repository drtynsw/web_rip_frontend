import type { FC, SyntheticEvent } from 'react'
import { Card } from 'react-bootstrap'
import type { AttackVector } from '../modules/types'
import { DEFAULT_IMAGE, imageOrDefault } from '../modules/media'

interface Props {
  vector: AttackVector
  onClick: (id: number) => void
}

export const AttackVectorCard: FC<Props> = ({ vector, onClick }) => {
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (!e.currentTarget.src.endsWith(DEFAULT_IMAGE)) e.currentTarget.src = DEFAULT_IMAGE
  }

  return (
    <Card className="tile-card" onClick={() => onClick(vector.id)}>
      <div className="tile-image-wrap">
        <Card.Img src={imageOrDefault(vector.image_url)} alt={vector.title} onError={handleError} />
      </div>
      <Card.Body className="tile-info">
        <Card.Title className="tile-title">{vector.title}</Card.Title>
        <div className="tile-likes"><span className="heart">♥</span> {vector.likes_count}</div>
      </Card.Body>
    </Card>
  )
}
