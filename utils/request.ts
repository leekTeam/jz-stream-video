import { BASE_URL_KEY } from '@/constant/storage'

function buildUrl(url: string) {
  const baseUrl = uni.getStorageSync(BASE_URL_KEY)
  return `${baseUrl}${url}`
}

function buildRequestOptions(options: UniApp.RequestOptions) {
  const { url, method, data } = options
  const urlVal = buildUrl(url)
  return {
    ...options,
    url: urlVal,
    method,
    data: data ? JSON.stringify(data) : undefined,
  }
}

interface SuccessResult<T> {
  dataObject: T
  errorCode: number
  errorInfo: string
}

function request<T>(options: Omit<UniApp.RequestOptions, 'success' | 'fail'>) {
  return new Promise<SuccessResult<T>>((resolve, reject) => {
    uni.request({
      ...buildRequestOptions(options),
      success: (res) => {
        if ((res.data as SuccessResult<T>).errorCode === 0) {
          resolve(res.data as T & SuccessResult<T>)
        }
        else {
          uni.showToast({
            title: (res.data as SuccessResult<T>).errorInfo || '接口请求失败',
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
  })
}

export default request
