<script setup lang="ts">
import { ref } from 'vue'
import MovieList from './components/movie-list.vue'
import EbookList from './components/ebook-list.vue'
import SoundList from './components/sound-list.vue'
import MusicList from './components/music-list.vue'
import MediaTabs from '@/components/media-tabs/index.vue'
import { useThemeStore } from '@/store'
import { MEDIA_LIST } from '@/constant/media'
import { DownloadMusic } from '@/utils/download'
const themeStore = useThemeStore()

const currentIndex = ref(1)
const changeSwiper = (event: any) => {
  currentIndex.value = event.detail.current as number
}
const download = () => {
  const downloadTask = new DownloadMusic({
    rid: '22323',
    originUrl: 'http://vjs.zencdn.net/v/oceans.mp4',
    name: '年轮',
    score: '3',
    mainauthor: '张碧晨',
    totalSize: 888888888,
  })
}
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <div @click="download">
    下载
  </div>
  <view :style="themeStore.themeStyles" class="page-container">
    <MediaTabs v-model="currentIndex" :list="MEDIA_LIST" />
    <swiper class="page-swiper" :current="currentIndex" @change="changeSwiper">
      <swiper-item>
        <MovieList :is-active="0 === currentIndex" />
      </swiper-item>
      <swiper-item>
        <EbookList :is-active="1 === currentIndex" />
      </swiper-item>
      <swiper-item>
        <SoundList :is-active="2 === currentIndex" />
      </swiper-item>
      <swiper-item>
        <MusicList :is-active="3 === currentIndex" />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .u-tabs {
    flex-shrink: 0;
  }

  .page-swiper {
    flex: 1;
  }
}
</style>
