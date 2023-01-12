<script setup lang="ts">
import MusicList from '@/components/music/music-list.vue'
import { DownloadTask } from '@/utils/download'

const listData = DownloadTask.getDownloadList();
console.log("listData", listData);

</script>

<template>
  <view class="music-list">
    <MusicList :data="listData" :show-download="false" />
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
