declare global {
  interface TWechatUserInfo {
    city: string
    country: string
    headimgurl: string
    language: string
    nickname: string
    openid: string
    privilege: string[]
    province: string
    sex: 0 | 1 | 2
    unionid: string
  }
}

export {}
