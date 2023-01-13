<script setup lang="ts">
import { ref } from 'vue'
import MovieList from '@/components/movie/movie-list.vue'


const listData = ref<TMovie[]>([])
</script>

<template>
  <view class="movie-list">
    <MovieList :data="listData" />
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
