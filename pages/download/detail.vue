<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './components/nav-bar.vue'
import MovieList from './components/movie-list.vue'
import EbookList from './components/ebook-list.vue'
import { useThemeStore } from '@/store'
import { useTheme } from '@/composables'
import { MEDIA_LIST } from '@/constant/media'
const themeStore = useThemeStore()

useTheme()

const currentValue = ref(0)
const changeTab = (index: number) => {
  currentValue.value = index
}

const swiperCurrent = ref(0)
const changeSwiper = (event: any) => {
  swiperCurrent.value = event.detail.current
}
</script>

<template>
  <view :style="themeStore.themeStyles" class="page-container">
    <NavBar v-model="currentValue" :list="MEDIA_LIST" @change="changeTab" />
    <swiper class="page-swiper" :current="swiperCurrent" @change="changeSwiper">
      <swiper-item>
        <MovieList :is-active="0 === swiperCurrent" />
      </swiper-item>
      <swiper-item>
        <EbookList :is-active="1 === swiperCurrent" />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
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
