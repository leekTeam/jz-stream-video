<script setup lang="ts">
import { ref } from 'vue'
import MovieBox from '@/components/movie/movie-box.vue'

defineProps({
  isActive: Boolean,
})

const list = ref<TMovie[]>([])
</script>

<template>
  <view class="movie-list">
    <MovieBox
      v-for="item in list"
      :key="item.rid"
      :rid="item.rid"
      :poster="item.poster"
      :name="item.name"
      :summary="item.summary"
      :label="item.label"
      :years="item.years"
      :country="item.country"
      :tolnum="item.tolnum"
      :score="item.score"
    />
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
