<script lang="ts" setup>
import type { PropType } from 'vue'
import EbookBox from './ebook-box.vue'

defineProps({
  data: {
    type: Array as PropType<{ rid: string; poster: string; name: string; [key: string]: any }[]>,
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
      v-bind="$attrs"
    />
  </view>
</template>

<style lang="scss" scoped>
.ebook-list {
  padding: 24rpx;
  box-sizing: border-box;
}
</style>
