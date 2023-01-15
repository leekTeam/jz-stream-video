<script setup lang="ts">
import { ref } from 'vue'
import SoundList from '@/components/sound/sound-list.vue'
import { SOUND_DOWNLOAD_KEY } from '@/constant/storage'

const soundDownloadList = ref(uni.getStorageSync(SOUND_DOWNLOAD_KEY) || [])
const listData = soundDownloadList.value.reduce((list, item) => {
  const { coverUrl: poster, fileName: playurl, ...args } = item
  list.push({
    ...args,
    poster,
    playurl,
  })
  return list
}, [])
</script>

<template>
  <view class="sound-list-box">
    <SoundList :data="listData" :is-online="false" />
  </view>
</template>

<style lang="scss" scoped>
.sound-list-box {
  margin: 24rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  height: 100%;
}
</style>
