import type { AttackVector } from './types'
import { ATTACK_VECTORS_MOCK } from './mock'

const TIMEOUT_MS = 3000

async function request<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export async function getAttackVectors(year?: number): Promise<AttackVector[]> {
  const query = year ? `?discovered_year=${year}` : ''
  try {
    return await request<AttackVector[]>(`/api/attack_vectors${query}`)
  } catch {
    return ATTACK_VECTORS_MOCK.filter((v) => !year || v.discovered_year === year)
  }
}

export async function getFeed(id?: number, next = false): Promise<AttackVector | null> {
  const params = new URLSearchParams()
  if (id) params.set('id', String(id))
  if (next) params.set('next', 'true')
  const query = params.toString() ? `?${params}` : ''
  try {
    return await request<AttackVector>(`/api/attack_vectors/feed${query}`)
  } catch {
    return feedFromMock(id, next)
  }
}

function feedFromMock(id?: number, next = false): AttackVector | null {
  const list = [...ATTACK_VECTORS_MOCK].sort((a, b) => a.id - b.id)
  if (!id) return list[0] ?? null
  if (next) return list.find((v) => v.id > id) ?? null
  return list.find((v) => v.id === id) ?? null
}
