<script lang="ts" setup>
import { onLoad, onNavigationBarButtonTap, onUnload } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useThemeStore } from '@/store'
import { bytesUnitFormat } from '@/utils'
import type { DownloadEbook, DownloadMovie, DownloadMusic, DownloadSound } from '@/utils/download'
import { getDownloadingList } from '@/utils/download'
import { DOWNLOAD_STATUS, DOWNLOAD_STATUS_TEXT } from '@/constant/download'

const themeStore = useThemeStore()

interface DownloadItem {
  rid: string
  name: string
  totalSize: number
}

interface ProgressMap {
  [rid: string]: {
    download: DownloadEbook | DownloadMovie | DownloadMusic | DownloadSound
    onProgress: (currentSize: number) => void
    currentSize: number
    status: DOWNLOAD_STATUS
    currentDownload: any
  }
}

const downloadList = ref<DownloadItem[]>([])
const downloadProgressMap = ref<ProgressMap>({})

const getStatus = (rid: string) => {
  return downloadProgressMap.value[rid].status
}

const getStatusText = (rid: string) => {
  const status = getStatus(rid)
  return DOWNLOAD_STATUS_TEXT[status]
}

const getCurrentSize = (rid: string) => {
  return downloadProgressMap.value[rid].currentSize || 0
}

const getPercent = (item: DownloadItem) => {
  return Number((getCurrentSize(item.rid) / item.totalSize).toFixed(2)) * 100
}

const onPause = (item: DownloadItem) => {
  const row = downloadProgressMap.value[item.rid]

  if (row.status === DOWNLOAD_STATUS.PROGRESS) {
    row.status = DOWNLOAD_STATUS.PAUSE
    row.download.task.pause()
  }
  else {
    row.status = DOWNLOAD_STATUS.PROGRESS
    row.download.task.resume()
  }
}

const onDeleteTask = (item: DownloadItem, index: number) => {
  const { rid } = item
  const { download, onProgress, currentDownload } = downloadProgressMap.value[rid]
  download.off(DOWNLOAD_STATUS.PROGRESS, onProgress)
  download.destory()
  currentDownload.clearStorage(rid)
  downloadList.value.splice(
    index,
    1,
  )
  delete downloadProgressMap.value[rid]
}

const updateDownloadProgress = (rid: string) => (currentSize: number) => {
  downloadProgressMap.value[rid].currentSize = currentSize
}

const getDownloadList = () => {
  uni.showLoading({ title: '加载中', mask: true })
  getDownloadingList().then((res) => {
    const downloadMap: ProgressMap = {}
    const result: DownloadItem[] = []
    res.forEach((item) => {
      const { name, rid, totalSize, currentSize, status, download, currentDownload } = item

      result.push({
        name,
        rid,
        totalSize,
      })

      const onProgress = updateDownloadProgress(rid)
      downloadMap[rid] = {
        download,
        onProgress,
        currentSize,
        status,
        currentDownload,
      }
      download.on(DOWNLOAD_STATUS.PROGRESS, onProgress)
    })
    downloadProgressMap.value = downloadMap
    downloadList.value = result
  }).finally(() => {
    uni.hideLoading()
  })
}

onLoad(() => {
  getDownloadList()
})

onNavigationBarButtonTap((options) => {
  if (options.index === 0) {
    downloadList.value.forEach((item) => {
      const row = downloadProgressMap.value[item.rid]
      row.status = DOWNLOAD_STATUS.PAUSE
      const { download } = row
      download.task.pause()
    })
  }
})

onUnload(() => {
  downloadList.value.forEach((item) => {
    const row = downloadProgressMap.value[item.rid]
    if (row) {
      const { download, onProgress } = row
      download.off(DOWNLOAD_STATUS.PROGRESS, onProgress)
    }
  })
})
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view :style="themeStore.themeStyles" class="page-container">
    <view v-for="(item, index) in downloadList" :key="item.rid" class="download-task">
      <view class="download-task-container">
        <view class="download-task-name">
          {{ item.name }}
        </view>
        <u-line-progress
          :height="20"
          :active-color="themeStore.primaryColor"
          :percent="getPercent(item)"
          striped
          striped-active
        />
        <view class="download-task-info">
          <view>{{ bytesUnitFormat(getCurrentSize(item.rid)) }}</view>
          <view>{{ getStatusText(item.rid) }}</view>
          <view>{{ bytesUnitFormat(item.totalSize) }}</view>
        </view>
      </view>
      <u-icon
        :name="getStatus(item.rid) === DOWNLOAD_STATUS.PAUSE ? 'play-right' : 'pause'" :size="48"
        @click="onPause(item)"
      />
      <u-icon name="close-circle-fill" :size="48" @click="onDeleteTask(item, index)" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  padding: 24rpx;

  .download-task {
    display: flex;
    align-items: center;
    border: 1rpx solid $u-border-color;
    border-radius: 12rpx;
    padding: 24rpx;
    box-sizing: border-box;

    &+.download-task {
      margin-top: 24rpx;
    }

    &-container {
      flex: 1;
    }

    &-name {
      @include ellipsis;
    }

    &-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .u-icon {
      color: $u-type-primary;
      margin-left: 24rpx;
    }
  }
}
</style>
