<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { resMediaGet } from '@/api/movie'
import { useThemeStore } from '@/store'
import { useTheme } from '@/composables'

const themeStore = useThemeStore()
useTheme()

const mediaDetailInfo = ref({
  playurl: '',
  name: '',
})
const active = ref(1)
const getMediaData = (rid: string) => {
  resMediaGet({ rid }).then((res) => {
    const { dataObject } = res as any
    mediaDetailInfo.value = dataObject[0]
    active.value = dataObject[0].number
  })
}

const handleClick = (currentValue: number) => {
  active.value = currentValue
}

const detailInfo = ref({
  label: '',
  country: '',
  years: '',
  score: '',
  tolnum: 1,
  summary: '',
})
const currentScore = ref(0)
onLoad((options = {}) => {
  const item = JSON.parse(decodeURIComponent(options.item))
  const { name: title, rid, ...args } = item
  currentScore.value = item.score / 2
  uni.setNavigationBarTitle({ title })
  detailInfo.value = args
  getMediaData(rid)
})
</script>

<template>
  <view class="media-detail-box" :style="themeStore.themeStyles">
    <video class="video-box" :src="mediaDetailInfo.playurl" />
    <view class="detail-box">
      <view class="title-box">
        <text>{{ mediaDetailInfo.name }}</text>
        <view class="down-box">
          <u-icon name="download" size="40" />
          <text>下载</text>
        </view>
      </view>
      <view class="sub-title-box">
        <text>{{ detailInfo.label }}</text>
        <text>{{ detailInfo.country }}</text>
        <text>{{ detailInfo.years }}</text>
      </view>
      <view class="score-box mb_20">
        <u-rate
          class="rate"
          :current="currentScore"
          active-color="#fe9a00"
          disabled
          size="20"
        />
        <text>{{ detailInfo.score }}</text>
      </view>
      <view class="mb_20 title">
        选集
      </view>
      <view class="anthology-btn-box mb_20">
        <u-button
          v-for="item in detailInfo.tolnum"
          :key="item"
          :class="{ active: item === active }"
          size="default"
          @click="handleClick(item)"
        >
          {{ item }}
        </u-button>
      </view>
      <view class="mb_20 title">
        介绍
      </view>
      <view class="summary-box">
        {{ detailInfo.summary }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.video-box {
  width: 100%;
}

.detail-box {
  padding: 0 20rpx;
}

.title-box {
  display: flex;
  justify-content: space-between;

  .down-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text {
      margin-top: 10rpx;
      font-size: 12px;
    }
  }
}

.sub-title-box {
  font-size: 14px;
  color: $uni-text-color-placeholder;
  margin-bottom: 20rpx;

  text {
    margin-right: 20rpx;
  }
}

.score-box {
  .rate {
    :deep(.u-icon:first-child) {
      padding: 0 3px 0 0 !important;
    }
  }

  text {
    font-size: 12px;
    color: $uni-text-color-placeholder;
  }
}

.anthology-btn-box {
  :deep(.u-btn) {
    display: inline-block;
    margin-right: 20rpx;
    background-color: $uni-bg-color-grey;
  }
}

.active {
  color: $u-type-primary;
}

.mb_20 {
  margin-bottom: 20rpx;
}

.title {
  font-weight: 700;
}

.summary-box {
  color: $uni-text-color-placeholder;
}
</style>
