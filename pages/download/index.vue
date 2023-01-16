<script lang="ts" setup>
import { onLoad, onNavigationBarButtonTap, onUnload } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useThemeStore } from '@/store'
import { bytesUnitFormat } from '@/utils'
import { Download, DownloadEbook, DownloadMovie, DownloadMusic, DownloadSound } from '@/utils/download'
import { DOWNLOAD_STATUS, DOWNLOAD_STATUS_TEXT } from '@/constant/download'
import { EBOOK_DOWNLOAD_KEY, MOVIE_DOWNLOAD_KEY, MUSIC_DOWNLOAD_KEY, SOUND_DOWNLOAD_KEY } from '@/constant/storage'

const themeStore = useThemeStore()

interface DownloadItem {
  rid: string
  name: string
  totalSize: number
  currentSize: number
  status: DOWNLOAD_STATUS
}
const downloadTasks = ref<PlusDownloaderDownload[]>([])

const getStatusText = (status: DOWNLOAD_STATUS) => {
  return DOWNLOAD_STATUS_TEXT[status]
}

const updateDownloadProgress = (currentSize: number) => {
  console.log('inde')

  // const index = downloadTaskIndexMap.value[task.rid]
  // downloadTasks.value[index].currentSize = size
  // downloadTasks.value[index].totalSize = task.totalSize
}

const downloadKeyMap = {
  EBOOK_DOWNLOAD_KEY: {
    getTask: DownloadEbook.getEbookTask,
  },
  MOVIE_DOWNLOAD_KEY: {
    getTask: DownloadMovie.getMovieTask,
  },
  MUSIC_DOWNLOAD_KEY: {
    getTask: DownloadMusic.getMusicTask,
  },
  SOUND_DOWNLOAD_KEY: {
    getTask: DownloadSound.getSoundTask,
  },

}
const getDownloadDataMap = () => {
  return Object.keys(downloadKeyMap).reduce((obj, downloadKey) => {
    const downloadList = uni.getStorageSync(downloadKey) || []
    downloadList.forEach((item) => {
      const { downloadId } = item
      obj[downloadId] = {
        ...item,
        type: downloadKey,
      }
    })
    return obj
  }, {})
}
const downloadDataMap = ref()
const getDownloadTaskList = (res) => {
  return res.map((item) => {
    const { id } = item
    return {
      ...downloadDataMap.value[id],
      ...item,
    }
  })
}
const getDownloadTasks = () => {
  Download.getDownloadTasks().then((res) => {
    downloadDataMap.value = getDownloadDataMap()
    downloadTasks.value = getDownloadTaskList(res)

    downloadTasks.value.forEach((item) => {
      const { type, rid } = item
      downloadKeyMap[type].getTask(rid).on(DOWNLOAD_STATUS.PROGRESS, updateDownloadProgress)
    })
  })
}

onLoad(() => {
  getDownloadTasks()
})

onUnload(() => {
  downloadTasks.value.forEach((item) => {
    const { type, rid } = item
    downloadKeyMap[type].getTask.off(DOWNLOAD_STATUS.PROGRESS, updateDownloadProgress)
  })
})

const onPause = (item: DownloadItem) => {
  const { type, rid } = item
  const task = downloadKeyMap[type].getTask(rid)
  if (task.status === DOWNLOAD_STATUS.WAIT)
    task.resume()
  else
    task.pause()
}

onNavigationBarButtonTap((options) => {
  if (options.index === 0 && downloadTasks.value.length) {
    downloadTasks.value.forEach((item) => {
      const { type, rid } = item
      downloadKeyMap[type].getTask(rid)!.pause()
    })
  }
})

const onDeleteTask = (item: DownloadItem, index: number) => {
  const { type, rid } = item
  const task = downloadKeyMap[type].getTask(item.rid)!
  task.off(DOWNLOAD_STATUS.PROGRESS, updateDownloadProgress)
  task.destory()
  downloadTasks.value.splice(
    index,
    1,
  )
}
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view :style="themeStore.themeStyles" class="page-container">
    <view v-for="(item, index) in downloadTasks" :key="item.rid" class="download-task">
      <view class="download-task-container">
        <view class="download-task-name">
          {{ item.name }}
        </view>
        <u-line-progress
          :height="20"
          :active-color="themeStore.primaryColor"
          :percent="(item.currentSize / item.totalSize) * 100"
          striped
          striped-active
        />
        <view class="download-task-info">
          <view>{{ bytesUnitFormat(item.currentSize) }}</view>
          <view>{{ getStatusText(item.status) }}</view>
          <view>{{ bytesUnitFormat(item.totalSize) }}</view>
        </view>
      </view>
      <u-icon
        :name="item.status === DOWNLOAD_STATUS.PAUSE ? 'pause' : 'play-right'" :size="48"
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
