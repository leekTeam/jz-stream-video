import EventEmitter2 from 'eventemitter2'
import { keyBy, noop } from 'lodash-es'
import { DOWNLOAD_STATUS } from '@/constant/download'
import { EBOOK_DOWNLOAD_KEY, MOVIE_DOWNLOAD_KEY, MUSIC_DOWNLOAD_KEY, SOUND_DOWNLOAD_KEY } from '@/constant/storage'
import { replaceUrlHost } from '@/utils'

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
  private static instanceMap: { [rid: string]: DownloadMusic } = {}
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
      DownloadMusic.storageList = storageList
    }, task)
    DownloadMusic.instanceMap[options.rid] = this
    this.options = options as TMusicDownloadStorage
    if (!task)
      this.setStorage()

    this.start()
  }

  public static get storageList(): TMusicDownloadStorage[] {
    return uni.getStorageSync(MUSIC_DOWNLOAD_KEY) || []
  }

  public static set storageList(list: TMusicDownloadStorage[]) {
    uni.setStorageSync(MUSIC_DOWNLOAD_KEY, list)
  }

  private setStorage() {
    DownloadMusic.storageList = [...DownloadMusic.storageList, { ...this.options, downloadId: this.task.id! }]
  }

  public static getStorageInfo(rid: string) {
    return DownloadMusic.storageList.find(item => item.rid === rid)
  }

  public static getMusicTask(rid: string) {
    if (!DownloadMusic.instanceMap[rid]) {
      const storageInfo = DownloadMusic.getStorageInfo(rid)
      if (storageInfo) {
        const task = Download.getDownloadTask(storageInfo.downloadId)
        if (task)
          // eslint-disable-next-line no-new
          new DownloadMusic(storageInfo, task)
      }
    }

    return DownloadMusic.instanceMap[rid]
  }
}

export class DownloadEbook extends Download {
  private static instanceMap: { [rid: string]: DownloadEbook } = {}
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
      DownloadEbook.storageList = storageList
    }, task)
    DownloadEbook.instanceMap[options.rid] = this
    this.options = options as TEbookDownloadStorage
    if (!task)
      this.setStorage()

    this.start()
  }

  public static get storageList(): TEbookDownloadStorage[] {
    return uni.getStorageSync(EBOOK_DOWNLOAD_KEY) || []
  }

  public static set storageList(list: TEbookDownloadStorage[]) {
    uni.setStorageSync(EBOOK_DOWNLOAD_KEY, list)
  }

  private setStorage() {
    DownloadEbook.storageList = [...DownloadEbook.storageList, { ...this.options, downloadId: this.task.id! }]
  }

  public static getStorageInfo(rid: string) {
    return DownloadEbook.storageList.find(item => item.rid === rid)
  }

  public static getEbookTask(rid: string) {
    if (!DownloadEbook.instanceMap[rid]) {
      const storageInfo = DownloadEbook.getStorageInfo(rid)
      if (storageInfo) {
        const task = Download.getDownloadTask(storageInfo.downloadId)
        if (task)
          // eslint-disable-next-line no-new
          new DownloadEbook(storageInfo, task)
      }
    }
    return DownloadEbook.instanceMap[rid]
  }
}

export class DownloadMovie extends Download {
  private static instanceMap: { [rid: string]: DownloadMovie } = {}
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
            storage.fileName = this.getFilenameUrl()
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
            storage.downloadId = this.task.id || ''
          }
        }
      }

      DownloadMovie.storageList = storageList
    }, task)

    DownloadMovie.instanceMap[options.rid] = this
    this.options = options as TMovieDownloadStorage
    if (!task)
      this.setStorage()

    this.start()
  }

  public static get storageList(): TMovieDownloadStorage[] {
    return uni.getStorageSync(MOVIE_DOWNLOAD_KEY) || []
  }

  public static set storageList(list: TMovieDownloadStorage[]) {
    uni.setStorageSync(MOVIE_DOWNLOAD_KEY, list)
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
    const storageList = DownloadMovie.storageList
    const index = storageList.findIndex((item) => {
      const { episodesList = [] } = item
      return episodesList.some(item => item.rid === this.options.rid)
    })
    if (index > -1) {
      const episodesIndex = storageList[index].episodesList.findIndex((item) => {
        return item.rid === this.options.rid
      })
      if (episodesIndex > -1)
        storageList[index].episodesList.push(data)
      else
        storageList[index].episodesList[episodesIndex] = data
    }
    else {
      storageList.push({
        ...options,
        episodesList: [data],
      })
    }
    DownloadMovie.storageList = storageList
  }

  public static getStorageInfo(rid: string) {
    return DownloadMovie.storageList.find(item => item.rid === rid)
  }

  public static getMovieTask(rid: string) {
    if (!DownloadMovie.instanceMap[rid]) {
      const storageInfo = DownloadMovie.getStorageInfo(rid)
      if (storageInfo) {
        const task = Download.getDownloadTask(storageInfo.downloadId)
        if (task)
          // eslint-disable-next-line no-new
          new DownloadMovie(storageInfo, task)
      }
    }

    return DownloadMovie.instanceMap[rid]
  }
}

export class DownloadSound extends Download {
  private static instanceMap: { [rid: string]: DownloadSound } = {}
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
            storage.fileName = this.getFilenameUrl()
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
            storage.downloadId = this.task.id || ''
          }
        }
      }
      DownloadSound.storageList = storageList
    }, task)

    DownloadSound.instanceMap[options.rid] = this
    this.options = options as TSoundDownloadStorage

    if (!task)
      this.setStorage()

    this.start()
  }

  public static get storageList(): TSoundDownloadStorage[] {
    return uni.getStorageSync(SOUND_DOWNLOAD_KEY) || []
  }

  public static set storageList(list: TSoundDownloadStorage[]) {
    uni.setStorageSync(SOUND_DOWNLOAD_KEY, list)
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
    const storageList = DownloadSound.storageList
    const index = storageList.findIndex((item) => {
      const { episodesList = [] } = item
      return episodesList.some(item => item.rid === this.options.rid)
    })
    if (index > -1) {
      const episodesIndex = storageList[index].episodesList.findIndex((item) => {
        return item.rid === this.options.rid
      })
      if (episodesIndex > -1)
        storageList[index].episodesList.push(data)
      else
        storageList[index].episodesList[episodesIndex] = data
    }
    else {
      storageList.push({
        ...options,
        episodesList: [data],
      })
    }
    DownloadSound.storageList = storageList
  }

  public static getStorageInfo(rid: string) {
    return DownloadSound.storageList.find(item => item.rid === rid)
  }

  public static getSoundTask(rid: string) {
    if (!DownloadSound.instanceMap[rid]) {
      const storageInfo = DownloadSound.getStorageInfo(rid)
      if (storageInfo) {
        const task = Download.getDownloadTask(storageInfo.downloadId)
        if (task)
          // eslint-disable-next-line no-new
          new DownloadSound(storageInfo, task)
      }
    }

    return DownloadSound.instanceMap[rid]
  }
}

function getStorageList<T extends Record<string, any>, K extends keyof T>(download: T, getTaskField: K) {
  return {
    storageMap: keyBy<T['storageList'][0]>(download.storageList, 'downloadId'),
    getTask: download[getTaskField],
  }
}

export const getDownloadingList = async () => {
  const res = await Download.getDownloadTasks()
  const storageMapList = [getStorageList(DownloadEbook, 'getEbookTask'), getStorageList(DownloadMovie, 'getMovieTask'), getStorageList(DownloadMusic, 'getMusicTask'), getStorageList(DownloadSound, 'getSoundTask')]
  return res.reduce((list, item) => {
    const storag = storageMapList.find(storageItem => !!storageItem.storageMap[item.id!])
    if (storag) {
      const { name, currentSize, rid, totalSize, status } = storag.storageMap[item.id!]
      list.push({
        status,
        name,
        rid,
        totalSize,
        currentSize,
        download: storag.getTask(rid),
      })
    }
    return list
  }, [] as { name: string; rid: string; totalSize: number;status: DOWNLOAD_STATUS; currentSize: number; download: DownloadEbook | DownloadMovie | DownloadMusic | DownloadSound }[])
}
