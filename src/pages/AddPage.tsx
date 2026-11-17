import { useEffect, useState } from 'react'
import type { ChangeEvent, FC, FormEvent } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createDraft, deleteDraft, getDraft, publishDraft } from '../store/draftSlice'
import { imageOrDefault } from '../modules/media'

const CURRENT_YEAR = new Date().getFullYear()
const fileOf = (e: ChangeEvent<HTMLInputElement>): File | null => e.target.files?.[0] ?? null

export const AddPage: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
  const { draft, loading, error } = useAppSelector((state) => state.draft)

  // Поля форм — локальное состояние; черновик и статус запросов — в Redux
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('')
  const [year, setYear] = useState('')

  // Если черновик уже создан ранее — сразу второй шаг
  useEffect(() => {
    if (isAuthenticated) dispatch(getDraft())
  }, [dispatch, isAuthenticated])

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    if (image && video) dispatch(createDraft({ title: title.trim(), image, video }))
  }

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(publishDraft({
      short_description: description.trim(),
      severity: Number(severity),
      discovered_year: Number(year),
    }))
    if (publishDraft.fulfilled.match(result)) navigate(`${ROUTES.FEED}/${result.payload.id}`)
  }

  const handleDelete = () => {
    if (draft && window.confirm('Удалить черновик?')) dispatch(deleteDraft(draft.id))
  }

  const severityNum = Number(severity)
  const yearNum = Number(year)
  const canPublish = !!description.trim()
    && Number.isInteger(severityNum) && severityNum >= 1 && severityNum <= 10
    && Number.isInteger(yearNum) && yearNum >= 1900 && yearNum <= CURRENT_YEAR

  return (
    <div className="form-page">
      <h1>Добавление вектора атаки</h1>
      <div className="form-step">Шаг {draft ? 2 : 1} из 2</div>
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}

      {!draft ? (
        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3" controlId="add-title">
            <Form.Label>Название</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="add-image">
            <Form.Label>Изображение</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(fileOf(e))} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="add-video">
            <Form.Label>Короткое видео</Form.Label>
            <Form.Control type="file" accept="video/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setVideo(fileOf(e))} required />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading || !title.trim() || !image || !video}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Далее'}
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handlePublish}>
          <div className="draft-preview">
            <img src={imageOrDefault(draft.image_url)} alt={draft.title} />
            <div>
              <div className="draft-label">Черновик</div>
              <div className="draft-title">{draft.title}</div>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="add-description">
            <Form.Label>Краткая характеристика</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="add-severity">
            <Form.Label>Базовая опасность (1–10)</Form.Label>
            <Form.Control type="number" min={1} max={10} value={severity} onChange={(e) => setSeverity(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="add-year">
            <Form.Label>Год первой массовой фиксации</Form.Label>
            <Form.Control type="number" min={1900} max={CURRENT_YEAR} value={year} onChange={(e) => setYear(e.target.value)} required />
          </Form.Group>
          <Button type="submit" className="w-100 mb-2" disabled={loading || !canPublish}>
            {loading ? <Spinner size="sm" animation="border" /> : 'Опубликовать'}
          </Button>
          <Button variant="outline-danger" className="w-100" onClick={handleDelete} disabled={loading}>
            Удалить черновик
          </Button>
        </Form>
      )}
    </div>
  )
}
