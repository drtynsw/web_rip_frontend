export const DEFAULT_IMAGE = '/DefaultImage.jpg'
export const DEFAULT_VIDEO = '/DefaultVideo.mp4'

export const imageOrDefault = (url: string | null | undefined): string => url || DEFAULT_IMAGE
export const videoOrDefault = (url: string | null | undefined): string => url || DEFAULT_VIDEO
