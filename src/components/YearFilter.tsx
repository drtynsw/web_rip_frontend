import type { FC, FormEvent } from 'react'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'

interface Props {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
  loading: boolean
}

export const YearFilter: FC<Props> = ({ value, onChange, onSearch, onReset, loading }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <Form className="filter-form" onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Год первой массовой фиксации"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Найти'}
        </Button>
        {value && (
          <Button variant="outline-secondary" onClick={onReset} disabled={loading}>×</Button>
        )}
      </InputGroup>
      {value && <Form.Text className="filter-hint">Год фиксации: {value.slice(0, 4)}</Form.Text>}
    </Form>
  )
}
