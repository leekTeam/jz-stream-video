<script lang="ts" setup>
import type { PropType } from 'vue'
import EbookBox from './ebook-box.vue'
defineProps({
  data: {
    type: Array as PropType<TEbook[]>,
    default: () => [],
  },
})
</script>

<template>
  <view v-if="data.length" class="ebook-list">
    <EbookBox
      v-for="ebookItem in data"
      :key="ebookItem.rid"
      :rid="ebookItem.rid"
      :poster="ebookItem.poster"
      :name="ebookItem.name"
    />
  </view>
</template>

<style lang="scss" scoped>
.ebook-list {
  padding: 24rpx;
  box-sizing: border-box;
}
</style>
