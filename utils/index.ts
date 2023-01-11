import { BASE_URL_KEY } from '@/constant/storage'

export const bytesUnitFormat = (bytes: number) => {
  if (!bytes)
    return '0 KB'

  if (bytes >= 1024 ** 3)
    return `${parseFloat((bytes / 1024 ** 3).toFixed(2))} GB`

  if (bytes >= 1024 ** 2)
    return `${parseFloat((bytes / 1024 ** 2).toFixed(2))} MB`

  return `${parseFloat((bytes / 1024).toFixed(2))} KB`
}

// 为了调试使用后续可以移除
export const replaceUrlHost = (url = '') => {
  if (import.meta.env.DEV)
    return url.replace(/^http:\/\/.*?\//, uni.getStorageSync(BASE_URL_KEY))

  return url
}

export function timeUnitFormat(diffTime: number) {
  diffTime ||= 0
  const day = parseInt(`${diffTime / 60 / 60 / 24}`)
  const hour = parseInt(`${(diffTime / 60 / 60) % 24}`)
  const min = parseInt(`${(diffTime / 60) % 60}`)
  const sec = parseInt(`${diffTime % 60}`)
  const dayStr = diffTime > 24 * 60 * 60 ? `${day}:` : ''
  const hourStr = diffTime > 60 * 60 ? `${`${hour}`.padStart(2, '0')}:` : ''
  const minStr = diffTime > 60 ? `${`${min}`.padStart(2, '0')}:` : '00:'
  const secStr = `${`${sec}`.padStart(2, '0')}`

  return `${dayStr}${hourStr}${minStr}${secStr}`
}
