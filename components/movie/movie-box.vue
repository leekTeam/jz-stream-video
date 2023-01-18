<script setup lang="ts">
import { nextTick } from 'vue'
import { replaceUrlHost } from '@/utils'
import { DownloadMovie } from '@/utils/download'
import { CLEAR_STORAGE } from '@/constant/event'
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
    required: true,
  },
  years: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    default: '',
  },
  tolnum: {
    type: Number,
    required: true,
  },
  score: {
    type: String,
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
  DownloadMovie.clearStorage(props.rid).finally(() => {
    emit('close')
    uni.$emit(CLEAR_STORAGE)
    uni.hideLoading()
  })
}

const goDetail = () => {
  uni.navigateTo({
    url: `/pages/movie/detail?movieInfo=${encodeURIComponent(
      JSON.stringify(props),
    )}`,
  })
}
</script>

<template>
  <view class="movie-box" @click="goDetail">
    <u-image width="240rpx" height="100%" class="movie-box-poster" :src="replaceUrlHost(poster)" />
    <view v-if="closable" class="movie-box-close" @click.stop="onDelete">
      <u-icon
        class="ebook-box-cover-down-icon"
        color="#ffffff"
        name="download"
        size="40"
      />
    </view>
    <view class="movie-box-content">
      <view class="movie-box-title">
        {{ name }}
      </view>
      <view class="movie-box-summary">
        {{ summary }}
      </view>
      <view class="movie-box-info">
        <view>{{ label }}</view>
        <view>{{ years }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.movie-box {
  height: 250rpx;
  padding: 20rpx;
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
    margin-right: 20rpx;
  }

  &-content {
    display: flex;
    flex: 1;
    flex-shrink: 0;
    align-self: flex-start;
    flex-direction: column;
  }

  &-title {
    font-weight: 700;
  }

  &-summary {
    @include text-multi-ellipsis(3);
  }

  &-info {
    display: flex;
    justify-content: space-between;
  }
}
</style>
