import { TEST_BASE_URL } from '@/config/app'

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
export const replaceUrlHost = (url: string) => {
  if (import.meta.env.DEV)
    return url.replace(/^http:\/\/.*?\//, TEST_BASE_URL)

  return url
}
