<script lang="ts" setup>
import type { PropType } from 'vue'
import SoundBox from './sound-box.vue'
defineProps({
  data: {
    type: Array as PropType<TSound[]>,
    default: () => [],
  },
})
</script>

<template>
  <view v-if="data.length" class="sound-list">
    <SoundBox
      v-for="soundItem in data"
      :key="soundItem.rid"
      :rid="soundItem.rid"
      :poster="soundItem.poster"
      :name="soundItem.name"
      :summary="soundItem.summary"
      :label="soundItem.label"
      :years="soundItem.years"
      :tolnum="soundItem.tolnum"
      v-bind="$attrs"
    />
  </view>
</template>

<style lang="scss" scoped>
.sound-list {
  padding: 24rpx 0;
  box-sizing: border-box;
  .sound-box + .sound-box {
    margin-top: 24rpx;
  }
}
</style>
