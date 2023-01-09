<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import NavBar from './components/nav-bar.vue'
import MovieList from './components/movie-list.vue'
import ScrollList from './components/scroll-list.vue'
import { useThemeStore } from '@/store'
import { useTheme } from '@/composables'
import { MEDIA_LIST } from '@/constant/media'
const themeStore = useThemeStore()

useTheme()

const currentValue = ref(MEDIA_LIST[0].value)
const changeTab = (index: number) => {
  currentValue.value = MEDIA_LIST[index].value
}

const swiperCurrent = ref(0)
const changeSwiper = (event: Event) => {
  swiperCurrent.value = event.detail.current
}
</script>

<template>
  <view :style="themeStore.themeStyles" class="page-container">
    <NavBar :list="MEDIA_LIST" @change="changeTab" />
    <swiper class="page-swiper" :current="swiperCurrent" @change="changeSwiper">
      <swiper-item v-for="(item, index) in MEDIA_LIST" :key="index">
        <MovieList :is-active="index === swiperCurrent" />
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
