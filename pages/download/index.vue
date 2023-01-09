<script lang="ts" setup>
import { onLoad, onNavigationBarButtonTap } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useTheme } from '@/composables'
import { useThemeStore } from '@/store'
import { bytesUnitFormat } from '@/utils'
import { DownloadTask } from '@/utils/download'
import { DOWNLOAD_STATUS } from '@/constant/download'

useTheme()

const themeStore = useThemeStore()

const downloadTasks = ref<DownloadTask[]>([])

const getDownloadTasks = () => {
  downloadTasks.value = DownloadTask.getDownloadList()
}

onLoad(() => {
  getDownloadTasks()
})

const onPause = (task: DownloadTask) => {
  task.pause()
}

onNavigationBarButtonTap((options) => {
  if (options.index === 0 && downloadTasks.value.length) {
    downloadTasks.value.forEach((item) => {
      item.pause()
    })
  }
})

const onDeleteTask = (task: DownloadTask, index: number) => {
  task.destory()
  downloadTasks.value.splice(
    index,
    1,
  )
}

const task = ref<DownloadTask>()

const testDownloadTest = () => {
  const url = 'https://down.360safe.com/se/360se13.1.6380.0.exe'
  const cover = 'https://down.360safe.com/se/360se13.1.6380.0.exe'
  const taskId = '123'
  task.value = new DownloadTask('test', taskId, url, cover)
  task.value.start()
  task.value.on(DOWNLOAD_STATUS.SUCCESS, () => {
    console.log('DOWNLOAD_STATUS.SUCCESS')
  })
  task.value.on(DOWNLOAD_STATUS.PROGRESS, () => {
    console.log('DOWNLOAD_STATUS.PROGRESS')
  })
  task.value.on(DOWNLOAD_STATUS.ERROE, () => {
    console.log('DOWNLOAD_STATUS.ERROE')
  })
  getDownloadTasks()
}

const onTestPause = () => {
  task.value!.pause()
}

const cleartestDownloadTest = () => {
  plus.downloader.clear()
}
</script>

<template>
  <view :style="themeStore.themeStyles" class="page-container">
    <u-button @click="testDownloadTest">
      download-test
    </u-button>
    <u-button @click="onTestPause">
      download-puase
    </u-button>
    <u-button @click="cleartestDownloadTest">
      download-clear
    </u-button>
    <view
      v-for="(item, index) in downloadTasks"
      :key="item.rid"
      class="download-task"
    >
      <view class="download-task-container">
        <view class="download-task-name">
          {{ item.name }}
        </view>
        <u-line-progress
          :height="20"
          :active-color="themeStore.primaryColor"
          :percent="70"
          striped
          striped-active
        />
        <view class="download-task-info">
          <view>{{ bytesUnitFormat(item.currentSize) }}</view>
          <view>{{ item.statueText }}</view>
          <view>{{ bytesUnitFormat(item.totalSize) }}</view>
        </view>
      </view>
      <u-icon
        :name="item.status === DOWNLOAD_STATUS.PAUSE ? 'pause' : 'play-right'"
        :size="48"
        @click="onPause(item)"
      />
      <u-icon
        name="close-circle-fill"
        :size="48"
        @click="onDeleteTask(item, index)"
      />
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
    .u-icon {
      color: $u-type-primary;
      margin-left: 24rpx;
    }
  }
}
</style>
