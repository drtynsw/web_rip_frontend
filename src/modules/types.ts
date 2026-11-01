export interface AttackVector {
  id: number
  title: string
  short_description: string | null
  image_url: string | null
  video_url: string | null
  severity: number | null
  discovered_year: number | null
  likes_count: number
  is_liked: 0 | 1
  is_mine: 0 | 1
}
