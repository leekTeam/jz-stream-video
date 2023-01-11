<script setup lang="ts">
import Progress from '../progress/index.vue'
import { replaceUrlHost } from '@/utils'
defineProps({
  poster: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <view class="ebook-box">
    <view class="ebook-box-cover">
      <u-image
        width="100%"
        height="250rpx"
        :src="replaceUrlHost(poster)"
      />
      <u-icon
        v-if="percentage === 0"
        class="ebook-box-cover-down-icon"
        color="#ffffff"
        name="download"
        size="40"
      />
      <u-icon
        v-if="percentage === 100"
        class="ebook-box-cover-success-icon"
        color="#42b935"
        name="checkmark-circle-fill"
        size="40"
      />
      <Progress
        v-if="percentage > 0 && percentage < 100"
        class="ebook-box-cover-progress"
        :percentage="percentage"
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
