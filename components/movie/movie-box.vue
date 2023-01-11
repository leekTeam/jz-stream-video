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
})

const goDetail = () => {
  const { name, rid, label, country, years, tolnum, summary, score }
    = props
  const params = {
    name,
    rid,
    label,
    country,
    years,
    tolnum,
    summary,
    score,
  }
  uni.navigateTo({
    url: `/pages/movie/detail?item=${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  })
}
</script>

<template>
  <view class="movie-box" @click="goDetail">
    <u-image
      width="240rpx"
      height="100%"
      class="movie-box-poster"
      :src="replaceUrlHost(poster)"
    />
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
