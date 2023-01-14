<script setup lang="ts">
import { ref } from 'vue'
import MusicList from '@/components/music/music-list.vue'
import { MUSIC_DOWNLOAD_KEY } from '@/constant/storage';

const listData = ref(uni.getStorageSync(MUSIC_DOWNLOAD_KEY) || []);
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
