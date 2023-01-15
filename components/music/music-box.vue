<script setup lang="ts">
import { ref } from 'vue'
import Histogram from '../histogram/index.vue'
import Progress from '../progress/index.vue'
import { useMusicStore } from '@/store'
import { downloadFile } from '@/utils/downloadFile'
import { resMediaGet } from '@/api/music'
import { MUSIC_DOWNLOAD_KEY } from '@/constant/storage'

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

const { playMusic, activeMusicInfo } = useMusicStore()

const percentage = ref(0)
const downloadMusic = async () => {
  const { rid, name, mainauthor, score } = props
  let downloadurl = activeMusicInfo.downloadurl
  if (!downloadurl) {
    try {
      const { dataObject } = await resMediaGet({ rid })
      downloadurl = dataObject[0].downloadurl
      const params = {
        url: downloadurl,
        key: MUSIC_DOWNLOAD_KEY,
        data: {
          rid,
          name,
          mainauthor,
          score,
        },
      }
      downloadFile(params, {
        progress: (download: any) => {
          const { downloadedSize, totalSize } = download
          percentage.value = (downloadedSize / totalSize) * 100
        },
      })
    }
    catch (e) {
      uni.showToast({
        title: '获取音乐信息失败',
        icon: 'error',
      })
    }
  }
}
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
