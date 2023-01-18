<script setup lang="ts">
import { nextTick } from 'vue'
import { CLEAR_STORAGE } from '@/constant/event'
import { replaceUrlHost } from '@/utils'
import { DownloadSound } from '@/utils/download'
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
    type: Number,
    required: true,
  },
  tolnum: {
    type: Number,
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const onDelete = () => {
  uni.showLoading({ title: '删除中', mask: true })
  DownloadSound.clearStorage(props.rid).finally(() => {
    emit('close')
    uni.$emit(CLEAR_STORAGE)
    uni.hideLoading()
  })
}

const hanldeClick = () => {
  uni.navigateTo({
    url: `/pages/sound/detail?soundInfo=${encodeURIComponent(
      JSON.stringify(props),
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
    <view v-if="closable" class="sound-box-close" @click.stop="onDelete">
      <u-icon
        class="ebook-box-cover-down-icon"
        color="#ffffff"
        name="download"
        size="40"
      />
    </view>
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
  position: relative;

  &-close {
    position: absolute;
    top: 24rpx;
    right: 24rpx;
    width: 40rpx;
  }

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
      @include text-multi-ellipsis(3);
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
