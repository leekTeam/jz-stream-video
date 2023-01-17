<script setup lang="ts">
import { ref } from 'vue'
import MusicList from '@/components/music/music-list.vue'
import { DownloadMusic } from '@/utils/download'
import { DOWNLOAD_STATUS } from '@/constant/download'
const getListData = () => {
  return DownloadMusic.storageList.filter(item => item.status === DOWNLOAD_STATUS.SUCCESS).map((item) => {
    const { rid, name, mainauthor, score } = item
    return {
      rid,
      name,
      mainauthor,
      score,
    }
  })
}
const listData = ref(getListData())
</script>

<template>
  <view class="music-list">
    <MusicList :data="listData" />
  </view>
</template>

<style lang="scss" scoped>
.music-list {
  margin: 24rpx;
  box-sizing: border-box;
  border: 1px solid $uni-border-color;
  border-radius: 12rpx;
  height: 100%;
}
</style>
