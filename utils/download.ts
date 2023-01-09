import EventEmitter2 from 'eventemitter2'
import { keyBy } from 'lodash-es'
import { DOWNLOAD_STATUS } from '@/constant/download'
import { DOWNLOAD_KEY } from '@/constant/storage'
interface DownloadStorage {
  rid: string
  name: string
  url: string
  cover: string
  coverSize: number
  totalSize: number
  coverStatus: DOWNLOAD_STATUS
  status: DOWNLOAD_STATUS
  coverFilename: string
  urlFilename: string
  coverDownloadId: string
  urlDownloadId: string
}

export class DownloadTask extends EventEmitter2 {
  private static taskMap: Map<string, DownloadTask> = new Map()
  public rid: string
  public coverTask?: PlusDownloaderDownload
  public urlTask?: PlusDownloaderDownload
  public name: string
  public coverSize = 0
  public totalSize = 0
  public currentSize = 0
  public coverStatus: DOWNLOAD_STATUS = DOWNLOAD_STATUS.WAIT
  public status: DOWNLOAD_STATUS = DOWNLOAD_STATUS.WAIT
  public url: string
  public cover: string

  constructor(name: string, rid: string, url: string, cover: string, urlDownTask?: PlusDownloaderDownload, coverDownloadTask?: PlusDownloaderDownload) {
    super()
    this.name = name
    this.rid = rid
    this.cover = cover
    this.url = url
    this.createDownload(urlDownTask, coverDownloadTask)
    DownloadTask.taskMap.set(this.rid, this)
  }

  private updateDownloadInfo(info: Omit<Partial<DownloadStorage>, 'rid' | 'coverStatus' | 'status'> = {}) {
    const downloadList: DownloadStorage[] = uni.getStorageSync(DOWNLOAD_KEY) || []
    const downloadInfo = downloadList.find(item => item.rid = this.rid)

    if (downloadInfo) {
      Object.assign(downloadInfo, {
        rid: this.rid,
        coverStatus: this.coverStatus,
        status: this.status,
        url: this.url,
        cover: this.cover,
        name: this.name,
      }, info)
    }
    else {
      downloadList.push({
        rid: this.rid,
        coverStatus: this.coverStatus,
        status: this.status,
        url: this.url,
        cover: this.cover,
        name: this.name,
        coverSize: this.coverSize,
        totalSize: this.totalSize,
        ...info,
      } as DownloadStorage)
    }
    uni.setStorageSync(DOWNLOAD_KEY, downloadList)
  }

  public static recoverDownloadTask() {
    return new Promise<PlusDownloaderDownload[]>((resolve) => {
      plus.downloader.enumerate((res) => {
        const downloadingList: DownloadStorage[] = (uni.getStorageSync(DOWNLOAD_KEY) || []).filter((item: DownloadStorage) => {
          return item.status !== DOWNLOAD_STATUS.SUCCESS
        })
        const downloadingMap = keyBy(res, 'id')

        downloadingList.forEach((item) => {
          if (item.status !== DOWNLOAD_STATUS.SUCCESS) {
            const coverDownloadTask = downloadingMap[item.coverDownloadId]
            const urlDownloadTask = downloadingMap[item.urlDownloadId]
            /* eslint-disable no-new */
            new DownloadTask(item.name, item.rid, item.url, item.cover, coverDownloadTask, urlDownloadTask)
          }
        })

        resolve(res)
      })
    })
  }

  public static getDownloadList() {
    return [...DownloadTask.taskMap.values()]
  }

  private createDownload(urlDownTask?: PlusDownloaderDownload, coverDownloadTask?: PlusDownloaderDownload) {
    if (this.cover)
      this.coverTask = coverDownloadTask || plus.downloader.createDownload(this.cover)

    else
      this.coverStatus = DOWNLOAD_STATUS.SUCCESS

    this.urlTask = urlDownTask || plus.downloader.createDownload(this.url)

    this.updateDownloadInfo({
      coverDownloadId: this.coverTask?.id,
      urlDownloadId: this.urlTask.id,
    })
  }

  private onProgress() {
    this.updateDownloadInfo()
    this.emit(DOWNLOAD_STATUS.PROGRESS, this, this.currentSize)
  }

  private onSuccess() {
    this.status = DOWNLOAD_STATUS.SUCCESS
    this.updateDownloadInfo()
    this.emit(DOWNLOAD_STATUS.SUCCESS, this)
  }

  private onError() {
    this.status = DOWNLOAD_STATUS.ERROE
    this.updateDownloadInfo()
    this.emit(DOWNLOAD_STATUS.ERROE, this)
  }

  private startDownloadUrl() {
    if (this.urlTask) {
      this.urlTask.addEventListener('statechanged', (download, status) => {
        switch (download.state) {
          case 3:
            this.totalSize = this.coverSize + (download.totalSize || 0)
            this.currentSize = (this.coverTask?.downloadedSize || 0) + (download.downloadedSize || 0)
            this.onProgress()

            break

          case 4:
            if (status === 200) {
              this.onSuccess()
              this.updateDownloadInfo({
                urlFilename: download.filename,
              })
            }
            else {
              this.onError()
            }
            break
        }
        this.updateDownloadInfo()
      })
      this.urlTask.start()
    }
  }

  public start() {
    this.status = DOWNLOAD_STATUS.PROGRESS
    if (this.coverStatus === DOWNLOAD_STATUS.WAIT) {
      this.coverTask!.addEventListener('statechanged', (download, status) => {
        switch (download.state) {
          case 3:
            this.coverSize = download.totalSize || 0
            this.currentSize = download.downloadedSize || 0
            this.onProgress()
            break

          case 4:
            if (status === 200) {
              this.updateDownloadInfo({
                coverFilename: download.filename,
              })
              this.coverStatus = DOWNLOAD_STATUS.SUCCESS
              this.startDownloadUrl()
            }
            else {
              this.coverStatus = DOWNLOAD_STATUS.ERROE
              this.onError()
            }

            break
        }
      })
      this.coverTask!.start()
      this.coverStatus = DOWNLOAD_STATUS.PROGRESS
    }
    else {
      this.startDownloadUrl()
    }
  }

  public pause() {
    if (this.coverStatus === DOWNLOAD_STATUS.PROGRESS) {
      this.coverStatus = DOWNLOAD_STATUS.WAIT
      this.coverTask!.pause()
    }
    else {
      this.urlTask?.pause()
    }
    this.status = DOWNLOAD_STATUS.WAIT
  }

  public resume() {
    if (this.coverStatus === DOWNLOAD_STATUS.WAIT) {
      this.coverStatus = DOWNLOAD_STATUS.PROGRESS
      this.coverTask!.resume()
    }
    else {
      this.urlTask?.resume()
    }
    this.status = DOWNLOAD_STATUS.PROGRESS
  }

  public destory() {
    DownloadTask.taskMap.delete(this.rid)

    if (this.urlTask)
      this.urlTask.abort()

    if (this.coverTask)
      this.coverTask.abort()

    const downloadList: DownloadStorage[] = uni.getStorageSync(DOWNLOAD_KEY) || []
    downloadList.splice(downloadList.findIndex(item => item.rid === this.rid), 1)
    uni.setStorageSync(DOWNLOAD_KEY, downloadList)
  }

  public static getTask(rid: string) {
    return DownloadTask.taskMap.get(rid)
  }
}
