<script setup lang="ts">
import { ref } from 'vue'
import SoundList from '@/components/sound/sound-list.vue'
import { DownloadSound } from '@/utils/download'
import { DOWNLOAD_STATUS } from '@/constant/download'

const getListData = () => {
  return DownloadSound.storageList.filter(item => item.status === DOWNLOAD_STATUS.SUCCESS).map((item) => {
    const { coverUrl: poster, fileName: playurl, ...args } = item
    return {
      poster,
      playurl,
      ...args,
    }
  })
}

const listData = ref(getListData())

const refreshList = () => {
  listData.value = getListData()
}
</script>

<template>
  <view class="sound-list-box">
    <SoundList :data="listData" closable @close="refreshList" />
  </view>
</template>

<style lang="scss" scoped>
.sound-list-box {
  margin: 24rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  height: 100%;
}
</style>
