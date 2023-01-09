import { BASE_URL_KEY } from '@/constant/storage'

const mockModules = import.meta.glob('../mock/**/*.ts', { eager: true })

const mockPathMap = Object.entries(mockModules).reduce((obj, [path, module]) => {
  if (!path.includes('_utils')) {
    (module as any).default.forEach((item: any) => {
      obj[item.url] = item
    })
  }
  return obj
}, {} as any)

function mockRequest(options: UniApp.RequestOptions, callback: (...args: any) => void) {
  const { response, timeout } = mockPathMap[options.url] || {}
  setTimeout(() => {
    callback(response(options.data))
  }, timeout)
}

function buildUrl(url: string) {
  const baseUrl = uni.getStorageSync(BASE_URL_KEY)
  return `${baseUrl}${url}`
}

interface SuccessResult {
  errorCode: number
  errorInfo: string
}

function request<T>(options: UniApp.RequestOptions) {
  return new Promise<T & SuccessResult>((resolve, reject) => {
    const { url, ...args } = options
    if (import.meta.env.DEV) {
      mockRequest(options, resolve)
    }
    else {
      uni.request({
        url: buildUrl(url),
        ...args,
        success: (res) => {
          if ((res.data as SuccessResult).errorCode === 0) {
            resolve(res.data as T & SuccessResult)
          }
          else {
            uni.showToast({
              title: (res.data as SuccessResult).errorInfo || '接口请求失败',
              icon: 'error',
            })
            reject(res.data)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg || '接口请求失败',
            icon: 'error',
          })
          reject(err)
        },
      })
    }
  })
}

export default request
