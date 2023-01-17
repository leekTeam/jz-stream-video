<script setup lang="ts">
import { ref } from 'vue'
import EbookList from '@/components/ebook/ebook-list.vue'
import { DownloadEbook } from '@/utils/download'
import { DOWNLOAD_STATUS } from '@/constant/download'

const getListData = () => {
  return DownloadEbook.storageList.filter(item => item.status === DOWNLOAD_STATUS.SUCCESS).map((item) => {
    const { rid, name, coverUrl } = item
    return {
      rid,
      name,
      poster: coverUrl,
    }
  })
}
const listData = ref(getListData())
</script>

<template>
  <view class="ebook-list-box">
    <EbookList :data="listData" closable @close="getListData" />
  </view>
</template>

<style lang="scss" scoped>
.ebook-list-box {
  margin: 24rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  border: 1px solid $uni-border-color;
  height: 100%;
}
</style>
