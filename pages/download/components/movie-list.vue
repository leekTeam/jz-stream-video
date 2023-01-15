<script setup lang="ts">
import { ref } from 'vue'
import MovieList from '@/components/movie/movie-list.vue'
import { MOVIE_DOWNLOAD_KEY } from '@/constant/storage'

const movieDownloadList = ref(uni.getStorageSync(MOVIE_DOWNLOAD_KEY) || [])
const listData = movieDownloadList.value.reduce((list, item) => {
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
  <view class="movie-list">
    <MovieList :data="listData" :is-online="false" />
  </view>
</template>

<style lang="scss" scoped>
.movie-list {
  padding: 24rpx;
  box-sizing: border-box;
  .movie-box + .movie-box {
    margin-top: 24rpx;
  }
}
</style>
