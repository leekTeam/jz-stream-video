declare global {
  interface TEbook {
    // 自增ID
    id: number
    // 资源ID
    rid: number
    // 媒体类型
    mediatype: number
    // 媒体状态
    status: number
    // 名称
    name: number
    // 详细
    details: string
    // 第几集
    number: number
    // 时长
    duration: number
    // 文件大小
    size: number
    // 下载路径
    downloadurl: string
    // 播放地址
    playurl: string
    // 其他属性
    attrstr: string
    // 其他属性
    attrint: number
  }
}

export {}
