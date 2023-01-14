import { replaceUrlHost } from '@/utils'

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
export const downloadFile = (params, callbackMap ) => {
  const { url, key, data, fileName='filename' } = params;
  const { progress, success, fail } = callbackMap;
  const downloadUrl = replaceUrlHost(url)
  const downloadTask = plus.downloader.createDownload(downloadUrl)

  downloadTask.addEventListener('statechanged', (download, status) => {
    console.log("fileName",fileName);
    
    if(download.state === 3){
      progress && progress(download, status);
      console.log("download",download);
      
      const { id, filename, state, totalSize, downloadedSize } = download
      updateDownloadInfo(key, {
        id,
        [fileName]: filename,
        state,
        totalSize,
        downloadedSize,
        ...data,
      });
    }else if(download.state === 4){
      if(status === 200){
        const { id, filename, state, totalSize, downloadedSize } = download
        updateDownloadInfo(key, {
          id,
          [fileName]: filename,
          state,
          totalSize,
          downloadedSize,
          ...data,
        })
        success && success();
      }else{
        uni.showToast({
          title: '下载失败',
          icon: 'error',
        })
        downloadTask.abort();
        clearDownloadInfo(key, data);
        fail && fail();
      }
    }
  })
  downloadTask.start()
}

export const updateDownloadInfo = (key: string, info: any) => {
  const downloadList = uni.getStorageSync(key) || []
  const downloadInfo = downloadList.find(item => item.rid = info.rid)

  if (downloadInfo) {
    Object.assign(downloadInfo, info)
  }
  else {
    downloadList.push(info)
  }
  uni.setStorageSync(key, downloadList)
}

export const clearDownloadInfo = (key: string, info: any) => {
  const downloadList = uni.getStorageSync(key) || []
  const index = downloadList.findIndex(item => item.rid === info.rid)
  if(index > -1){
    downloadList.splice(index, 1)
    uni.setStorageSync(key, downloadList)
  }
}