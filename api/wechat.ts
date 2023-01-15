import request from '@/utils/wechatRequest'

export const login = () => {
  return new Promise((resolve, reject) => {
    uni.getProvider({
      service: 'oauth',
      success: ({ provider }) => {
        if ((provider as string[]).includes('weixin')) {
          uni.login({
            provider: 'weixin',
            success(data) {
              resolve(data.authResult)
            },
          })
        }
        else {
          reject(new Error('请先安装微信'))
        }
      },
      fail() {
        reject(new Error('登陆失败'))
      },
    })
  })
}

export const getUserInfo = (data: { access_token: string; openid: string }) => {
  return request<TWechatUserInfo>({
    url: 'sns/userinfo',
    data,
    method: 'GET',
  })
}
