export const DEFAULT_IMAGE = '/DefaultImage.jpg'
export const DEFAULT_VIDEO = '/DefaultVideo.mp4'

const MINIO_ORIGIN = /^https?:\/\/[^/]+:9000\//
export const s3Url = (url: string): string => url.replace(MINIO_ORIGIN, '/minio/')

export const imageOrDefault = (url: string | null | undefined): string => (url ? s3Url(url) : DEFAULT_IMAGE)
export const videoOrDefault = (url: string | null | undefined): string => (url ? s3Url(url) : DEFAULT_VIDEO)
