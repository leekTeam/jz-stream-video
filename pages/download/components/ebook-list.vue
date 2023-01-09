<script setup lang="ts">
import { ref } from 'vue'
import EbookBox from '@/components/ebook/ebook-box.vue'
import { resGet } from '@/api/ebook'

defineProps({
  isActive: Boolean,
})

const list = ref<TMovie[]>([])

const upCallback = () => {
  resGet({
    cid: '',
    page: 1,
    size: 10,
  }).then((res) => {
    list.value = [...list.value, ...res.dataObject]
  })
}

upCallback()
</script>

<template>
  <view class="ebook-list">
    <EbookBox
      v-for="ebookItem in list"
      :key="ebookItem.rid"
      :poster="ebookItem.poster"
      :name="ebookItem.name"
    />
  </view>
</template>

<style lang="scss" scoped>
.ebook-list {
  margin: 24rpx;
  padding: 10rpx;
  box-sizing: border-box;
  border: 1px solid $uni-border-color;
  border-radius: 12rpx;
}
</style>
