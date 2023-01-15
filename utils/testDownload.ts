import EventEmitter2 from 'eventemitter2'
import { noop } from 'lodash-es'
import { replaceUrlHost } from '.'
import { DOWNLOAD_STATUS } from '@/constant/download'
import { EBOOK_DOWNLOAD_KEY, MOVIE_DOWNLOAD_KEY, MUSIC_DOWNLOAD_KEY, SOUND_DOWNLOAD_KEY } from '@/constant/storage'

export class Download extends EventEmitter2 {
  public static tasks: PlusDownloaderDownload[] = []
  public task: PlusDownloaderDownload
  public downloadStatus: DOWNLOAD_STATUS = DOWNLOAD_STATUS.WAIT
  public updateStorageInfo: () => void
  constructor(url: string, updateStorageInfo: () => void = noop, downloadTask?: PlusDownloaderDownload) {
    super()
    this.updateStorageInfo = updateStorageInfo
    this.task = downloadTask || plus.downloader.createDownload(replaceUrlHost(url))

    this.task.addEventListener('statechanged', (download, status) => {
      switch (download.state) {
        case 3:
          this.onProgress()
          break
        case 4:
          if (status === 200)
            this.onSuccess()

          else
            this.onError()

          break
      }
    })
  }

  public start() {
    this.task.start()
  }

  private onProgress() {
    this.downloadStatus = DOWNLOAD_STATUS.PROGRESS
    this.emit('progress', this.task.downloadedSize || 0)
    this.updateStorageInfo()
  }

  private onError() {
    this.downloadStatus = DOWNLOAD_STATUS.ERROE
    this.destory()
    this.emit('error')
    this.onFinally()
  }

  private onSuccess() {
    this.downloadStatus = DOWNLOAD_STATUS.SUCCESS
    this.emit('success')
    this.onFinally()
  }

  private onFinally() {
    this.emit('finally')
    this.updateStorageInfo()
  }

  public destory() {
    // 移除事件的订阅
    this.removeAllListeners()
    // 取消下载
    this.task.abort()
  }

  public static getDownloadTask(downloadId: string) {
    return Download.tasks.find(item => item.id === downloadId)
  }

  public static getDownloadTasks() {
    return new Promise<PlusDownloaderDownload[]>((resolve) => {
      plus.downloader.enumerate((res) => {
        Download.tasks = res
        resolve(res)
      })
    })
  }

  public getFilenameUrl() {
    return `file://${plus.io.convertLocalFileSystemURL(this.task.filename!)}`
  }
}

export class DownloadMusic extends Download {
  public static storageList: TMusicDownloadStorage[] = uni.getStorageSync(MUSIC_DOWNLOAD_KEY) || []
  private options: TMusicDownloadStorage
  constructor(options: Omit<TMusicDownloadStorage, 'status' | 'downloadId' | 'currentSize' | 'fileName'>, task?: PlusDownloaderDownload) {
    super(options.originUrl, () => {
      const storageList = DownloadMusic.storageList
      const index = storageList.findIndex(item => item.rid === this.options.rid)
      const storage = storageList[index]
      storage.status = this.downloadStatus
      if (this.downloadStatus === DOWNLOAD_STATUS.SUCCESS) {
        storage.fileName = this.getFilenameUrl()
      }
      else if (this.downloadStatus === DOWNLOAD_STATUS.ERROE) {
      // 删除下载任务
        storageList.splice(index, 1)
      }
      else if (this.downloadStatus === DOWNLOAD_STATUS.PROGRESS) {
        storage.currentSize = this.task.downloadedSize || 0
      }

      this.updateStorage(storageList)
    }, task)

    this.options = options as TMusicDownloadStorage
    if (!task)
      this.setStorage()

    this.start()
  }

  private setStorage() {
    DownloadMusic.storageList.push(this.options)
    this.updateStorage(DownloadMusic.storageList)
  }

  public static getStorageInfo(rid: string) {
    return DownloadMusic.storageList.find(item => item.rid === rid)
  }

  private updateStorage(list: TMusicDownloadStorage[]) {
    DownloadMusic.storageList = list
    return uni.setStorageSync(MUSIC_DOWNLOAD_KEY, list)
  }

  public static getMusicTask(rid: string) {
    const storageInfo = DownloadMusic.getStorageInfo(rid)
    if (storageInfo) {
      const task = Download.getDownloadTask(storageInfo.downloadId)
      if (task)
        return new DownloadMusic(storageInfo, task)
    }
  }
}

export class DownloadEbook extends Download {
  public static storageList: TEbookDownloadStorage[] = uni.getStorageSync(EBOOK_DOWNLOAD_KEY) || []
  private options: TEbookDownloadStorage
  constructor(options: Omit<TEbookDownloadStorage, 'status' | 'downloadId' | 'currentSize' | 'fileName'>, task?: PlusDownloaderDownload) {
    super(options.originUrl, () => {
      const storageList = DownloadEbook.storageList
      const index = storageList.findIndex(item => item.rid === this.options.rid)
      const storage = storageList[index]

      storage.status = this.downloadStatus
      if (this.downloadStatus === DOWNLOAD_STATUS.SUCCESS) {
        storage.fileName = this.getFilenameUrl()
      }
      else if (this.downloadStatus === DOWNLOAD_STATUS.ERROE) {
      // 删除下载任务
        storageList.splice(index, 1)
      }
      else if (this.downloadStatus === DOWNLOAD_STATUS.PROGRESS) {
        storage.currentSize = this.task.downloadedSize || 0
      }
      this.updateStorage(storageList)
    }, task)
    this.options = options as TEbookDownloadStorage
    if (!task)
      this.setStorage()

    this.start()
  }

  private setStorage() {
    DownloadEbook.storageList.push(this.options)
    this.updateStorage(DownloadEbook.storageList)
  }

  public static getStorageInfo(rid: string) {
    return DownloadEbook.storageList.find(item => item.rid === rid)
  }

  private updateStorage(list: TEbookDownloadStorage[]) {
    DownloadEbook.storageList = list
    return uni.setStorageSync(EBOOK_DOWNLOAD_KEY, list)
  }

  public static geEbookTask(rid: string) {
    const storageInfo = DownloadEbook.getStorageInfo(rid)
    if (storageInfo) {
      const task = Download.getDownloadTask(storageInfo.downloadId)
      if (task)

        return new DownloadEbook(storageInfo, task)
    }
  }
}

export class DownloadMovie extends Download {
  public static storageList: TMovieDownloadStorage[] = uni.getStorageSync(MOVIE_DOWNLOAD_KEY) || []
  private options: TMovieDownloadStorage
  constructor(options: Omit<TMovieDownloadStorage, 'status' | 'downloadId' | 'fileName' | 'episodesList' | 'currentSize'>, task?: PlusDownloaderDownload) {
    super(options.originUrl, () => {
      const storageList = DownloadMovie.storageList
      const index = storageList.findIndex((item) => {
        const { episodesList = [] } = item
        return episodesList.some(item => item.rid === this.options.rid)
      })
      if (index > -1) {
        const episodesIndex = storageList[index].episodesList.findIndex((item) => {
          return item.rid === this.options.rid
        })
        if (episodesIndex > -1) {
          const episodesStorageList = storageList[index].episodesList
          const storage = episodesStorageList[episodesIndex]
          storage.status = this.downloadStatus

          if (this.downloadStatus === DOWNLOAD_STATUS.SUCCESS) {
            storage.fileName = this.task.filename!
          }
          else if (this.downloadStatus === DOWNLOAD_STATUS.ERROE) {
          // 删除下载任务
            if (episodesStorageList.length)
              episodesStorageList.splice(episodesIndex, 1)
            else
              storageList.splice(index, 1)
          }
          else if (this.downloadStatus === DOWNLOAD_STATUS.PROGRESS) {
            storage.currentSize = this.task.downloadedSize || 0
          }
        }
      }

      this.updateStorage(storageList)
    }, task)
    this.options = options as TMovieDownloadStorage
    if (!task)
      this.setStorage()

    this.start()
  }

  private setStorage() {
    const { options } = this
    const {
      rid,
      episodesId,
      status,
      currentSize,
      downloadId,
      currentNum,
      originUrl,
      totalSize,
    } = options
    const data = {
      rid,
      id: episodesId,
      currentNum,
      downloadId,
      totalSize,
      currentSize,
      originUrl,
      fileName: this.task.filename || '',
      status,
    }
    const index = DownloadMovie.storageList.findIndex((item) => {
      const { episodesList = [] } = item
      return episodesList.some(item => item.rid === this.options.rid)
    })
    if (index > -1) {
      const episodesIndex = DownloadMovie.storageList[index].episodesList.findIndex((item) => {
        return item.rid === this.options.rid
      })
      if (episodesIndex > -1)
        DownloadMovie.storageList[index].episodesList.push(data)
      else
        DownloadMovie.storageList[index].episodesList[episodesIndex] = data
    }
    else {
      DownloadMovie.storageList.push({
        ...options,
        episodesList: [data],
      })
    }
    this.updateStorage(DownloadMovie.storageList)
  }

  public static getStorageInfo(rid: string) {
    return DownloadMovie.storageList.find(item => item.rid === rid)
  }

  private updateStorage(list: TMovieDownloadStorage[]) {
    DownloadMovie.storageList = list
    return uni.setStorageSync(MOVIE_DOWNLOAD_KEY, list)
  }

  public static getMovieTask(rid: string) {
    const storageInfo = DownloadMovie.getStorageInfo(rid)
    if (storageInfo) {
      const task = Download.getDownloadTask(storageInfo.downloadId)
      if (task)
        return new DownloadMovie(storageInfo, task)
    }
  }
}

export class DownloadSound extends Download {
  public static storageList: TSoundDownloadStorage[] = uni.getStorageSync(SOUND_DOWNLOAD_KEY) || []
  private options: TSoundDownloadStorage
  constructor(options: Omit<TSoundDownloadStorage, 'status' | 'downloadId' | 'fileName' | 'episodesList' | 'currentSize'>, task?: PlusDownloaderDownload) {
    super(options.originUrl, () => {
      const storageList = DownloadSound.storageList
      const index = storageList.findIndex((item) => {
        const { episodesList = [] } = item
        return episodesList.some(item => item.rid === this.options.rid)
      })
      if (index > -1) {
        const episodesIndex = storageList[index].episodesList.findIndex((item) => {
          return item.rid === this.options.rid
        })
        if (episodesIndex > -1) {
          const episodesStorageList = storageList[index].episodesList
          const storage = episodesStorageList[episodesIndex]
          storage.status = this.downloadStatus

          if (this.downloadStatus === DOWNLOAD_STATUS.SUCCESS) {
            storage.fileName = this.task.filename!
          }
          else if (this.downloadStatus === DOWNLOAD_STATUS.ERROE) {
          // 删除下载任务
            if (episodesStorageList.length)
              episodesStorageList.splice(episodesIndex, 1)
            else
              storageList.splice(index, 1)
          }
          else if (this.downloadStatus === DOWNLOAD_STATUS.PROGRESS) {
            storage.currentSize = this.task.downloadedSize || 0
          }
        }
      }

      this.updateStorage(storageList)
    }, task)
    this.options = options as TSoundDownloadStorage

    if (!task)
      this.setStorage()

    this.start()
  }

  private setStorage() {
    const { options } = this
    const {
      rid,
      episodesId,
      status,
      currentSize,
      downloadId,
      currentNum,
      originUrl,
      totalSize,
    } = options
    const data = {
      rid,
      id: episodesId,
      currentNum,
      downloadId,
      totalSize,
      currentSize,
      originUrl,
      fileName: this.task.filename || '',
      status,
    }
    const index = DownloadSound.storageList.findIndex((item) => {
      const { episodesList = [] } = item
      return episodesList.some(item => item.rid === this.options.rid)
    })
    if (index > -1) {
      const episodesIndex = DownloadSound.storageList[index].episodesList.findIndex((item) => {
        return item.rid === this.options.rid
      })
      if (episodesIndex > -1)
        DownloadSound.storageList[index].episodesList.push(data)
      else
        DownloadSound.storageList[index].episodesList[episodesIndex] = data
    }
    else {
      DownloadSound.storageList.push({
        ...options,
        episodesList: [data],
      })
    }
    this.updateStorage(DownloadSound.storageList)
  }

  public static getStorageInfo(rid: string) {
    return DownloadSound.storageList.find(item => item.rid === rid)
  }

  private updateStorage(list: TSoundDownloadStorage[]) {
    DownloadSound.storageList = list
    return uni.setStorageSync(SOUND_DOWNLOAD_KEY, list)
  }

  public static getSoundTask(rid: string) {
    const storageInfo = DownloadSound.getStorageInfo(rid)
    if (storageInfo) {
      const task = Download.getDownloadTask(storageInfo.downloadId)
      if (task)

        return new DownloadSound(storageInfo, task)
    }
  }
}
