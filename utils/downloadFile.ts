import { replaceUrlHost } from '@/utils'

export const updateDownloadInfo = (key: string, info: any) => {
  const downloadList = uni.getStorageSync(key) || []
  let downloadInfo = {}
  if (info?.episodesList) {
    downloadInfo = downloadList.find((item) => {
      const { episodesList } = item
      return episodesList.some(episodesItem => episodesItem.rid === info.rid)
    })
  }
  downloadInfo = downloadList.find(item => item.rid = info.rid)

  if (downloadInfo)
    Object.assign(downloadInfo, info)

  else
    downloadList.push(info)

  uni.setStorageSync(key, downloadList)
}

export const clearDownloadInfo = (key: string, info: any) => {
  const downloadList = uni.getStorageSync(key) || []
  let index = -1
  if (info?.episodesList) {
    index = downloadList.findIndex((item) => {
      const { episodesList } = item
      return episodesList.some(episodesItem => episodesItem.rid === info.rid)
    })
  }
  index = downloadList.findIndex(item => item.rid === info.rid)

  if (index > -1) {
    downloadList.splice(index, 1)
    uni.setStorageSync(key, downloadList)
  }
}

/**
 *
 * @param params object
 * {
 *  url: string,  下载地址
 *  key: string, 本地存储key
 *  data: object, 本地存储数据
 *  fileName: string filename别名
 * }
 * @param callbackMap 回调
 * progress: 进度回调
 * success: 成功回调
 * fail: 失败回调
 */
export const downloadFile = (params, callbackMap) => {
  const { url, key, data, fileName = 'fileName' } = params
  const { progress, success, fail } = callbackMap
  const downloadUrl = replaceUrlHost(url)
  const downloadTask = plus.downloader.createDownload(downloadUrl)

  downloadTask.addEventListener('statechanged', (download, status) => {
    if (download.state === 3) {
      progress && progress(download, status)
      if (data) {
        const { id: downloadId, filename, state, totalSize, downloadedSize: currentSize } = download
        updateDownloadInfo(key, {
          downloadId,
          [fileName]: filename,
          state,
          totalSize,
          currentSize,
          ...data,
        })
      }
    }
    else if (download.state === 4) {
      if (status === 200) {
        if (data) {
          const { id: downloadId, filename, state, totalSize, downloadedSize: currentSize } = download
          updateDownloadInfo(key, {
            downloadId,
            [fileName]: filename,
            state,
            totalSize,
            currentSize,
            ...data,
          })
        }
        success && success(download)
      }
      else {
        uni.showToast({
          title: '下载失败',
          icon: 'error',
        })
        downloadTask.abort()
        clearDownloadInfo(key, data)
        fail && fail()
      }
    }
  })
  downloadTask.start()
}
