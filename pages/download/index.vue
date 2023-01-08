<script lang="ts" setup>
import { onLoad, onNavigationBarButtonTap, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useTheme } from '@/composables'
import { useThemeStore } from '@/store'
import { bytesUnitFormat } from '@/utils'

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
  // plus.downloader.enumerate((res) => {
  //   console.log(res)
  // })
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
</script>

<template>
  <view :style="themeStore.themeStyles" class="page-container">
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
