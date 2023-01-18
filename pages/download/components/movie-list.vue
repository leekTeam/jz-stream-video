<script setup lang="ts">
import { ref } from 'vue'
import MovieList from '@/components/movie/movie-list.vue'
import { DownloadMovie } from '@/utils/download'
import { DOWNLOAD_STATUS } from '@/constant/download'

const getListData = () => {
  return DownloadMovie.storageList.reduce((list, item) => {
    const { episodesList, coverUrl: poster, ...args } = item

    episodesList.forEach((episodesItem) => {
      const { status } = episodesItem
      if (status === DOWNLOAD_STATUS.SUCCESS) {
        list.push({
          ...args,
          poster,
        })
      }
    })
    return list
  }, [])
}

const listData = ref(getListData())

const refreshList = () => {
  listData.value = getListData()
}
</script>

<template>
  <view class="movie-list">
    <MovieList :data="listData" closable @close="refreshList" />
  </view>
</template>

<style lang="scss" scoped>
.movie-list {
  padding: 24rpx;
  box-sizing: border-box;
  .movie-box + .movie-box {
    margin-top: 24rpx;
  }
}
</style>
