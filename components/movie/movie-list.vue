<script lang="ts" setup>
import type { PropType } from 'vue'
import MovieBox from './movie-box.vue'

interface TData {
  rid: string
  poster: string
  name: string
  summary: string
  label: string
  years: number
  country: string
  tolnum: number
  score: string
  [key: string]: any
}

defineProps({
  data: {
    type: Array as PropType<TData[]>,
    default: () => [],
  },
})
</script>

<template>
  <view v-if="data.length" class="movie-list">
    <MovieBox
      v-for="item in data"
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
      v-bind="$attrs"
    />
  </view>
</template>

<style lang="scss" scoped>
.movie-list {
  padding: 24rpx 0;
  box-sizing: border-box;
  .movie-box + .movie-box {
    margin-top: 24rpx;
  }
}
</style>
