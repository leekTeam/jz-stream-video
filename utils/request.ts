const BASE_URL = 'http://127.0.0.1:3006'

function request(options: UniApp.RequestOptions) {
  return new Promise((resolve, reject) => {
    const { url, ...args } = options
    uni.request({
      url: `${BASE_URL}${url}`,
      ...args,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

export default request
