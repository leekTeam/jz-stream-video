<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { resMediaGet } from '@/api/sound'
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()

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
  poster: '',
  tolnum: 1,
})

onLoad((options = {}) => {
  const item = JSON.parse(decodeURIComponent(options.item))
  const { name: title, rid, ...args } = item
  uni.setNavigationBarTitle({ title })
  detailInfo.value = args
  getMediaData(rid)
})
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view class="sound-detail-box" :style="themeStore.themeStyles">
    <video
      class="audio-box"
      :src="mediaDetailInfo.playurl"
      :poster="detailInfo.poster"
    />
    <view class="detail-box">
      <view class="down-box">
        <u-icon name="download" size="40" />
        <text>下载</text>
      </view>
      <view class="anthology-btn-box">
        <view
          v-for="item in detailInfo.tolnum"
          :key="item"
          class="anthology-btn-box-item"
          :class="{ active: item === active }"
          size="default"
          @click="handleClick(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.sound-detail-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.audio-box {
  width: 100%;
}

.detail-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 0 20rpx 20rpx 20rpx;
}

.down-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 20rpx;

  text {
    margin-top: 10rpx;
    font-size: 12px;
  }
}

.anthology-btn-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid $uni-border-color;
  border-radius: 20rpx 20rpx 0 0 ;
  overflow: auto;

  &-item {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    &:first-child {
      border-bottom: 1px solid $uni-border-color;
    }
    &:not(:last-child) {
      border-bottom: 1px solid $uni-border-color;
    }
  }
}

.active {
  color: $u-type-primary;
}
</style>
