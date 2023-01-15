<script lang="ts" setup>
import type { PropType } from 'vue'
import EbookBox from './ebook-box.vue'
import { EBOOK_DOWNLOAD_KEY } from '@/constant/storage'
import { useShowDownload } from '@/hooks/showDownload'

const props = defineProps({
  data: {
    type: Array as PropType<TEbook[]>,
    default: () => [],
  },
})

const { getShowDownload } = useShowDownload(EBOOK_DOWNLOAD_KEY, props.data)
</script>

<template>
  <view v-if="data.length" class="ebook-list">
    <EbookBox
      v-for="ebookItem in data"
      :key="ebookItem.rid"
      :rid="ebookItem.rid"
      :poster="ebookItem.poster"
      :name="ebookItem.name"
      :show-download="getShowDownload(ebookItem.rid)"
    />
  </view>
</template>

<style lang="scss" scoped>
.ebook-list {
  padding: 24rpx;
  box-sizing: border-box;
}
</style>
