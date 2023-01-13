<script setup lang="ts">
import { ref } from 'vue'
import MovieList from './components/movie-list.vue'
import EbookList from './components/ebook-list.vue'
import SoundList from './components/sound-list.vue'
import MusicList from './components/music-list.vue'
import MediaTabs from '@/components/media-tabs/index.vue'
import { useThemeStore } from '@/store'
import { MEDIA_LIST } from '@/constant/media'
const themeStore = useThemeStore()

const currentIndex = ref(3)
const changeSwiper = (event: any) => {
  currentIndex.value = event.detail.current as number
}
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
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
  .u-tabs {
    flex-shrink: 0;
  }

  .page-swiper {
    flex: 1;
  }
}
</style>
