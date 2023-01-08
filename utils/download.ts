import EventEmitter2 from 'eventemitter2'
import { DOWNLOAD_STATUS } from '@/constant/download'
const downloadTaskMap: Map<string, PlusDownloaderDownload> = new Map()

// 创建下载任务
export function createDownload(url: string) {
  const task = plus.downloader.createDownload(
    url,
    {},
    (d, status) => {
      // 下载完成
      if (status === 200)
        downloadTaskMap.delete(d.id!)
    },
  )
  task.start()
  downloadTaskMap.set(task.id!, task)
}

export const getTask = (id: string) => {
  return downloadTaskMap.get(id)
}

export const getTasks = () => {
  return [...downloadTaskMap.values()]
}

export class Download extends EventEmitter2 {
  public url: string
  public totalSize = 0
  public currentSize = 0
  public task: PlusDownloaderDownload
  public status: DOWNLOAD_STATUS = DOWNLOAD_STATUS.PROGRESS

  constructor(url: string) {
    super()
    this.url = url
    this.task = plus.downloader.createDownload(url)
  }

  public start() {
    this.task.addEventListener('statechanged', (download, status) => {
      switch (download.state) {
        case 3:
          this.currentSize = download.downloadedSize || 0
          this.emit(DOWNLOAD_STATUS.PROGRESS, this.currentSize)
          break

        case 4:
          if (status === 200) {
            this.status = DOWNLOAD_STATUS.SUCCESS
            this.emit(DOWNLOAD_STATUS.SUCCESS)
          }
          else {
            this.status = DOWNLOAD_STATUS.ERROE
            this.emit(DOWNLOAD_STATUS.ERROE)
          }
          break
      }
    })
    this.task.start()
  }
}

export class DownloadTask extends EventEmitter2 {
  public static tasks: Map<string, DownloadTask> = new Map()
  public taskId: string
  public coverTask?: PlusDownloaderDownload
  public urlTask?: PlusDownloaderDownload
  public name: string
  public totalSize = 0
  public currentSize = 0
  public coverStatus: DOWNLOAD_STATUS = DOWNLOAD_STATUS.PROGRESS
  public status: DOWNLOAD_STATUS = DOWNLOAD_STATUS.PROGRESS

  constructor(name: string, taskId: string, url: string, cover?: string) {
    super()
    this.name = name
    this.taskId = taskId
    DownloadTask.tasks.set(this.taskId, this)
    this.createDownload(url, cover)
    this.startDownloadCover()
  }

  private createDownload(url: string, cover?: string) {
    if (cover) {
      this.coverTask = plus.downloader.createDownload(cover)
      this.totalSize = this.coverTask.totalSize || 0
    }
    else {
      this.coverStatus = DOWNLOAD_STATUS.SUCCESS
    }

    this.urlTask = plus.downloader.createDownload(url)
    this.totalSize += this.urlTask.totalSize || 0
  }

  private onProgress() {
    this.emit(DOWNLOAD_STATUS.PROGRESS, this.currentSize)
  }

  private onSuccess() {
    this.status = DOWNLOAD_STATUS.SUCCESS
    this.emit(DOWNLOAD_STATUS.SUCCESS)
  }

  private onError() {
    this.status = DOWNLOAD_STATUS.ERROE
    this.emit(DOWNLOAD_STATUS.ERROE)
  }

  private startDownloadUrl() {
    if (this.urlTask) {
      this.urlTask.addEventListener('statechanged', (download, status) => {
        switch (download.state) {
          case 3:
            this.currentSize = (this.coverTask?.downloadedSize || 0) + (download.downloadedSize || 0)
            this.onProgress()
            break

          case 4:
            if (status === 200)
              this.onSuccess()
            // 保存下载信息storage
            else
              this.onError()

            break
        }
      })
      this.urlTask.start()
    }
  }

  private startDownloadCover() {
    if (this.coverTask) {
      this.coverTask.addEventListener('statechanged', (download, status) => {
        switch (download.state) {
          case 3:
            this.currentSize = download.downloadedSize || 0
            this.onProgress()
            break

          case 4:
            if (status === 200)
              this.startDownloadUrl()
            // 保存封面信息到storage
            else
              this.onError()

            break
        }
      })
      this.coverTask.start()
    }
    else {
      this.startDownloadUrl()
    }
  }
}
