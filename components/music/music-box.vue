<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import Histogram from '../histogram/index.vue'
import Progress from '../progress/index.vue'
import { useMusicStore } from '@/store'
import { DownloadMusic } from '@/utils/download'

const props = defineProps({
  rid: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  mainauthor: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    default: '0',
  },
  showDownload: {
    type: Boolean,
    default: true,
  },
})

const { playMusic, activeMusicInfo, getMediaInfo } = useMusicStore()

const downloadTask = shallowRef<DownloadMusic>()

const percentage = ref(0)

const onProgress = async (currentSize: number) => {
  percentage.value = (currentSize / (await getMediaInfo(props.rid)).size) * 100
}

const downloadMusic = async () => {
  const { rid, name, mainauthor, score } = props
  getMediaInfo(rid).then((res) => {
    const { downloadurl, size } = res
    downloadTask.value = new DownloadMusic({
      rid,
      originUrl: downloadurl,
      name,
      score,
      mainauthor,
      totalSize: size,
    })

    downloadTask.value.on('progress', onProgress)
  })
}

onMounted(() => {
  const storageInfo = DownloadMusic.getStorageInfo(props.rid)
  if (storageInfo) {
    percentage.value = ((storageInfo.currentSize || 0) / (storageInfo.totalSize || 0)) * 100
    const download = DownloadMusic.getMusicTask(props.rid)
    if (percentage.value !== 100 && download) {
      downloadTask.value = download
      downloadTask.value.on('progress', onProgress)
    }
  }
})

onUnmounted(() => {
  downloadTask.value?.off('progress', onProgress)
})
</script>

<template>
  <view class="music-box" @click="playMusic(rid)">
    <view class="music-box-index" :class="{ active: activeMusicInfo.rid === rid }">
      {{ index }}
    </view>
    <view class="music-box-content">
      <view class="music-box-content-title" :class="{ active: activeMusicInfo.rid === rid }">
        {{ name }}
      </view>
      <view class="music-box-content-singer">
        {{ mainauthor }}
      </view>
      <view class="music-box-content-score">
        <u-rate
          class="music-box-content-score-rate"
          :current="(Number(score) / 2).toFixed(1)"
          active-color="#fe9a00"
          disabled
          size="20"
        />
        <view>{{ (Number(score) / 2).toFixed(1) }}</view>
      </view>
    </view>
    <view class="music-box-icon">
      <Histogram
        v-if="activeMusicInfo.rid === rid"
        class="music-box-icon-histogram"
        :paused="activeMusicInfo.paused"
      />
      <view v-if="showDownload" @click.stop="downloadMusic">
        <u-icon
          v-if="percentage === 0"
          name="download"
          size="40"
        />
        <u-icon
          v-if="percentage === 100"
          color="#42b935"
          name="checkmark-circle-fill"
          size="40"
        />
        <Progress
          v-if="percentage > 0 && percentage < 100"
          :percent="percentage"
          placement="bottom"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.music-box {
  display: flex;
  align-items: center;
  padding: 20rpx;
  box-sizing: border-box;
  &:first-child {
    border-bottom: 1px solid $uni-border-color;
  }
  &:not(:last-child) {
    border-bottom: 1px solid $uni-border-color;
  }

  &-index {
    width: 50rpx;
    margin-right: 10rpx;
    text-align: center;
    @include ellipsis;
  }

  &-content {
    flex: 1;
    &-singer {
      color: $uni-text-color-placeholder;
    }
    &-score {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: $uni-text-color-placeholder;
      &-rate {
        margin-right: 20rpx;
      }
    }
  }

  &-icon {
    display: flex;
    &-histogram {
      margin-right: 10rpx;
    }
  }
}
.active {
  color: #fe9a00;
}
</style>
