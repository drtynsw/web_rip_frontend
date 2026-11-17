import type { AttackVectorResponse } from '../api/Api'

export type AttackVector = Omit<AttackVectorResponse, 'image_url' | 'video_url'> & {
  image_url: string | null
  video_url: string | null
}
