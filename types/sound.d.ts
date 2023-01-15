declare global {
  interface TSound {
    // 自增ID
    id: string
    // 资源ID
    rid: string
    // 资源类型，见附录
    restype: number
    // 组织形式，0：单集，1：多集
    orgtype: number
    // 节目号
    programid: string
    // 资源状态
    status: number
    // 提供者
    provider: string
    // 数据源
    source: string
    // 名称
    name: string
    // 拼音名称
    pinyin: string
    // 标签
    label: string
    // 年代
    years: string
    // 国家
    country: string
    // 语言
    language: string
    // 海报地址
    poster: string
    // 简介
    summary: string
    // 主创者(导演)
    mainauthor: string
    // 参与者(演员)
    otherauthor: string
    // 总集数
    tolnum: number
    // 是否付费
    paytype: number
    // 评分
    score: string
    // 备注
    tips: string
    // 其他属性
    attrstr: string
    // 其他属性
    attrint: number
    // 分类ID
    cid: string
    // 预留
    reserve: string
  }

  interface TSoundTopClass {
    id: number
    cid: string
    level: number
    name: string
    poster: string
    precid: number
    resnum: number
    restype: number
    shownum: number
    tips: string
  }

  interface TSoundMedia {
    attrint: number
    attrstr: string
    details: string
    downloadurl: string
    duration: string
    id: number
    mediatype: number
    mid: number
    name: number
    number: number
    playurl: string
    rid: string
    size: number
    status: number
  }

  interface TSoundEpisodes {
    rid: string
    currentNum: number
    downloadId: string
    state: number
    totalSize: number
    currentSize: number
    originUrl: string
    fileName: string
    coverOriginUrl: string
    coverUrl: string
  }

  interface TSoundDownloadStorage {
    rid: string
    name: string
    label: string
    years: number
    summary: string
    type: string
    episodesList: TSoundEpisodes[]
  }
}

export {}
