import qs from 'qs'
const wechatApi = 'https://api.weixin.qq.com/'

function buildUrl(url: string) {
  return `${wechatApi}${url}`
}

function buildRequestOptions(options: UniApp.RequestOptions) {
  const { url, method, data = {} } = options
  let urlVal = buildUrl(url)
  if (method === 'GET' && data)
    urlVal += `?${qs.stringify(data)}`

  return {
    ...options,
    url: urlVal,
    method,
    data: method === 'POST' ? data : undefined,
  }
}

function request<T>(options: Omit<UniApp.RequestOptions, 'success' | 'fail'>) {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...buildRequestOptions(options),
      success: (res) => {
        if (!(res.data as any).errcode) {
          resolve(res.data as T)
        }
        else {
          uni.showToast({
            title: (res.data as any).errmsg || '接口请求失败',
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
