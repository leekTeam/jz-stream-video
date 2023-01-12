<script setup lang="ts">
import { replaceUrlHost } from '@/utils'
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
  summary: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  years: {
    type: String,
    default: '',
  },
  tolnum: {
    type: Number,
    required: true,
  },
})

const hanldeClick = () => {
  const {
    name,
    rid,
    poster,
  } = props
  const params = {
    name,
    rid,
    poster,
  }
  uni.navigateTo({
    url: `/pages/sound/detail?soundInfo=${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  })
}
</script>

<template>
  <view class="sound-box" @click="hanldeClick">
    <u-image
      width="240rpx"
      height="100%"
      class="sound-box-poster"
      :src="replaceUrlHost(poster)"
    />
    <view class="sound-box-content">
      <view class="sound-box-top">
        <view class="sound-box-top-title">
          {{ name }}
        </view>
        <view class="sound-box-top-summary">
          {{ summary }}
        </view>
      </view>
      <view class="sound-box-info">
        <view>{{ label }}</view>
        <view>{{ years }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.sound-box {
  height: 250rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid $uni-border-color;
  border-radius: 12rpx;

  &-poster {
    margin-right: 24rpx;
  }

  &-content {
    display: flex;
    flex: 1;
    flex-shrink: 0;
    height: 100%;
    align-self: flex-start;
    flex-direction: column;
  }

  &-top {
    flex: 1;
    &-title {
      font-weight: 700;
    }
    &-summary {
      color: $uni-text-color-placeholder;
    }
  }

  &-info {
    display: flex;
    justify-content: space-between;
    color: $uni-text-color-placeholder;
  }
}
</style>
