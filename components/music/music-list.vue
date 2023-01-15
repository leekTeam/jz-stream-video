<script lang="ts" setup>
import type { PropType } from 'vue'
import MusicBox from './music-box.vue'

defineProps({
  data: {
    type: Array as PropType<TMusic[]>,
    default: () => [],
  },
})
</script>

<template>
  <view v-if="data.length">
    <MusicBox
      v-for="(musicItem, index) in data"
      v-bind="$attrs"
      :key="musicItem.rid"
      :rid="musicItem.rid"
      :name="musicItem.name"
      :index="index + 1"
      :mainauthor="musicItem.mainauthor"
      :score="musicItem.score"
    />
  </view>
</template>

<style lang="scss" scoped></style>
