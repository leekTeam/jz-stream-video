export enum DOWNLOAD_STATUS {
  WAIT = 'wait',
  PROGRESS = 'progress',
  PAUSE = 'pause',
  ERROE = 'error',
  SUCCESS = 'success',
}

export enum DOWNLOAD_STATUS_TEXT {
  wait = '等待下载',
  progress = '正在下载',
  pause = '暂停中',
  error = '下载出错',
  success = '下载完成',
}
