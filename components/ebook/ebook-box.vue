<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import Progress from '../progress/index.vue'
import { replaceUrlHost } from '@/utils'
import { resMediaGet } from '@/api/ebook'
import { Download, DownloadEbook } from '@/utils/download'

const props = defineProps({
  rid: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])
const coverDownloadTask = shallowRef<Download>()
const downloadTask = shallowRef<DownloadEbook>()
const ebookMediaInfo = shallowRef<TEbookMedia>()
const percentage = ref(0)
const totalSize = ref(0)

const onProgress = (currentSize: number) => {
  percentage.value = currentSize / (totalSize.value) * 100
}

const downloadEbook = async () => {
  uni.showLoading({ title: '加载中', mask: true })
  const {
    name,
    rid,
    poster,
  } = props
  resMediaGet({ rid: props.rid }).then((res) => {
    const { dataObject } = res
    const [row] = dataObject
    const { downloadurl, size } = row
    ebookMediaInfo.value = row
    coverDownloadTask.value = new Download(props.poster)
    coverDownloadTask.value.on('success', () => {
      totalSize.value = size
      downloadTask.value = new DownloadEbook({
        rid,
        name,
        coverOriginUrl: poster,
        originUrl: downloadurl,
        coverUrl: coverDownloadTask.value!.getFilenameUrl(),
        totalSize: size,
      })
      downloadTask.value.on('progress', onProgress)
      downloadTask.value.once('progress', () => {
        uni.hideLoading()
      })
    })
    coverDownloadTask.value.on('error', () => {
      uni.showToast({
        title: '下载失败',
        icon: 'error',
      })
    })
    coverDownloadTask.value.start()
  }).catch(() => {
    uni.hideLoading()
  })
}

const goDetail = () => {
  if (!downloadTask.value) {
    downloadEbook()
  }
  else if (percentage.value === 100) {
    const { rid } = props
    uni.navigateTo({
      url: `/pages/ebook/detail?rid=${rid}`,
    })
  }
}

const onDelete = () => {
  const storageList = DownloadEbook.storageList
  const index = storageList.findIndex(item => item.rid === props.rid)
  storageList.splice(index, 1)
  DownloadEbook.storageList = storageList
  nextTick(() => {
    emit('close')
  })
}

onMounted(() => {
  const storageInfo = DownloadEbook.getStorageInfo(props.rid)
  if (storageInfo) {
    totalSize.value = storageInfo.totalSize
    onProgress(storageInfo.currentSize)
    const download = DownloadEbook.getEbookTask(props.rid)
    if (percentage.value !== 100 && download) {
      downloadTask.value = download
      downloadTask.value.on('progress', onProgress)
    }
  }
})

onUnmounted(() => {
  downloadTask.value?.off('progress', onProgress)
  coverDownloadTask.value?.destory()
})
</script>

<template>
  <view class="ebook-box" @click="goDetail">
    <view class="ebook-box-cover">
      <u-image
        width="100%"
        height="250rpx"
        :src="replaceUrlHost(poster)"
      />
      <view v-if="closable" @click.stop="onDelete">
        <u-icon
          class="ebook-box-cover-down-icon"
          color="#ffffff"
          name="download"
          size="40"
        />
      </view>
      <view v-else-if="!downloadTask && percentage === 0">
        <u-icon
          class="ebook-box-cover-down-icon"
          color="#ffffff"
          name="download"
          size="40"
        />
      </view>
      <u-icon
        v-else-if="percentage === 100"
        class="ebook-box-cover-success-icon"
        color="#42b935"
        name="checkmark-circle-fill"
        size="40"
      />
      <Progress
        v-else
        class="ebook-box-cover-progress"
        color="#ffffff"
        :percent="percentage"
      />
    </view>
    <view class="ebook-box-title">
      <text>{{ name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ebook-box {
  display: inline-block;
  width: calc(100% / 3);
  padding: 0 10rpx;

  &-cover {
    position: relative;
    &-down-icon, &-success-icon {
      position: absolute;
      right: 10rpx;
      bottom: 10rpx;
    }
    &-progress {
      position: absolute;
      right: 10rpx;
      left: 10rpx;
      bottom: 10rpx;
    }
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    height: 80rpx;
    text {
      @include text-multi-ellipsis(2);
    }
  }
}
</style>
