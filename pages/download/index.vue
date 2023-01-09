<script lang="ts" setup>
import { onLoad, onNavigationBarButtonTap, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useTheme } from '@/composables'
import { useThemeStore } from '@/store'
import { bytesUnitFormat } from '@/utils'
import { DownloadTask } from '@/utils/download'
import { DOWNLOAD_STATUS } from '@/constant/download'

useTheme()

const themeStore = useThemeStore()

const downloadTasks = ref([
  {
    name: '123',
    taskId: 1,
    totalSize: 1000,
    currentSize: 10,
    statueText: '正在下载',
    isPause: false,
  },
  {
    name: '123',
    taskId: 2,
    totalSize: 1000,
    currentSize: 10,
    statueText: '正在下载',
    isPause: true,
  },
])

const getDownloadTasks = () => {
  plus.downloader.enumerate((res) => {
    console.log(res)
  })
}

const getTask = (id: number) => {
  return 1 as unknown as PlusDownloaderDownload
}

onLoad(() => {
  getDownloadTasks()
})

const onPause = (id: number) => {
  const task = getTask(id)
  task.pause()
}

onNavigationBarButtonTap((options) => {
  if (options.index === 0 && downloadTasks.value.length) {
    downloadTasks.value.forEach((item) => {
      onPause(item.taskId)
    })
  }
})

const onDeleteTask = (id: number) => {
  const task = getTask(id)
  task.abort()
  downloadTasks.value.splice(downloadTasks.value.findIndex(item => item.taskId === id), 1)
}

const testDownloadTest = () => {
  const url = 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed8c2069849744f299b6c551600ac310~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?'
  const cover = 'https://img2.baidu.com/it/u=1395980100,2999837177&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675'
  const taskId = '123'
  const task = new DownloadTask('test', taskId, url, cover)
  task.on(DOWNLOAD_STATUS.SUCCESS, () => {
    console.log('DOWNLOAD_STATUS.SUCCESS')
  })
  task.on(DOWNLOAD_STATUS.PROGRESS, () => {
    console.log('DOWNLOAD_STATUS.PROGRESS')
  })
  task.on(DOWNLOAD_STATUS.ERROE, () => {
    console.log('DOWNLOAD_STATUS.ERROE')
  })
}

const cleartestDownloadTest = () => {
  plus.downloader.clear()
}
</script>

<template>
  <view :style="themeStore.themeStyles" class="page-container">
    <view @click="testDownloadTest">
      download-test
    </view>
    <view @click="cleartestDownloadTest">
      download-clear
    </view>
    <view v-for="item in downloadTasks" :key="item.taskId" class="download-task">
      <view class="download-task-container">
        <view class="download-task-name">
          {{ item.name }}
        </view>
        <u-line-progress :height="20" :active-color="themeStore.primaryColor" :percent="70" striped striped-active />
        <view class="download-task-info">
          <view>{{ bytesUnitFormat(item.currentSize) }}</view>
          <view>{{ item.statueText }}</view>
          <view>{{ bytesUnitFormat(item.totalSize) }}</view>
        </view>
      </view>
      <u-icon :name="item.isPause ? 'pause' : 'play-right'" :size="48" @click="onPause(item.taskId)" />
      <u-icon name="close-circle-fill" :size="48" @click="onDeleteTask(item.taskId)" />
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

    & + .download-task {
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
    .u-icon  {
      color: $u-type-primary;
      margin-left: 24rpx;
    }
  }
}
</style>
