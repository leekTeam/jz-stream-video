// 创建下载任务
export function createDownload(url: string) {
  const dtask = plus.downloader.createDownload(
    url,
    {},
    (d, status) => {
      // 下载完成
      if (status === 200)
        console.log(`Download success: ${d.filename}`)
      else console.log(`Download failed: ${status}`)
    },
  )
  // dtask.addEventListener("statechanged", onStateChanged, false);
  dtask.start()
}

export default Download
