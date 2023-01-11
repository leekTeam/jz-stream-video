<script setup lang="ts">
import Histogram from '../histogram/index.vue'
import { useMusicStore } from '@/store'

defineProps({
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
})

const { playMusic, activeMusicInfo } = useMusicStore()
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
      <u-icon name="download" size="40" />
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
