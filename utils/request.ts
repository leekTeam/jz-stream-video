import { TEST_BASE_URL } from '@/config/app'
import { BASE_URL_KEY } from '@/constant/storage'

function buildUrl(url: string) {
  const baseUrl = uni.getStorageSync(BASE_URL_KEY) || TEST_BASE_URL
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

interface SuccessResult {
  errorCode: number
  errorInfo: string
}

function request<T>(options: Omit<UniApp.RequestOptions, 'success' | 'fail'>) {
  return new Promise<T & SuccessResult>((resolve, reject) => {
    uni.request({
      ...buildRequestOptions(options),
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
  })
}

export default request
