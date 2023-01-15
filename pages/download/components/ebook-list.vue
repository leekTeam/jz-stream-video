<script setup lang="ts">
import { ref } from 'vue'
import EbookList from '@/components/ebook/ebook-list.vue'
import { EBOOK_DOWNLOAD_KEY } from '@/constant/storage'

const listData = ref(uni.getStorageSync(EBOOK_DOWNLOAD_KEY) || [])
</script>

<template>
  <view class="ebook-list">
    <EbookList :data="listData" />
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
