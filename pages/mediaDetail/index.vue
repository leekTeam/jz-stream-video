<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { resMediaGet } from '@/api/movie'

const mediaDetailInfo = ref({})
const active = ref(1)
const getMediaData = (rid: string) => {
  resMediaGet({ rid }).then((res) => {
    console.log('res', res)
    const { dataObject } = res
    mediaDetailInfo.value = dataObject[0]
    active.value = dataObject[0].number
  })
}

const detailInfo = ref({})
const currentScore = ref(0)
onLoad((options) => {
  console.log('options', options)
  const { title, rid, ...args } = options
  currentScore.value = options.score / 2
  uni.setNavigationBarTitle({
    title,
  })
  detailInfo.value = args
  getMediaData(rid)
})
</script>

<template>
  <view class="media-detail-box">
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
      <view class="score-box">
        <u-rate class="rate" :current="currentScore" active-color="#fe9a00" disabled size="20" />
        <text>{{ detailInfo.score }}</text>
      </view>
      <view class="mb_20">
        选集
      </view>
      <view class="anthology-btn-box">
        <u-button v-for="item in 5" :key="item" :class="{ active: item === active }" size="default">
          {{ item }}
        </u-button>
      </view>
      <view class="">
        介绍
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
    ::v-deep .u-icon:first-child {
      padding: 0 3px 0 0 !important;

    }
  }

  text {
    font-size: 12px;
    color: $uni-text-color-placeholder;
  }
}

.anthology-btn-box {
  ::v-deep .u-btn {
    display: inline-block;
    margin-right: 20rpx;
    background-color: $uni-bg-color-grey;
  }
}

.active {
  color: red;
}

.mb_20 {
  margin-bottom: 20rpx;
}
</style>
