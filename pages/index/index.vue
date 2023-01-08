<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavBar from './components/NavBar.vue'
import Media from './components/media/index.vue'
import { useThemeStore } from '@/store'
import { useTheme } from '@/composables'
import { MEDIA_LIST } from '@/constant/media'

const themeStore = useThemeStore()

useTheme()

const currentValue = ref(MEDIA_LIST[0].value)
const changeTab = (index: number) => {
  currentValue.value = MEDIA_LIST[index].value
}

const swiperCurrent = ref("")
const changeSwiper = () => {
  
}

const scrollHeight = ref("")
const setScrollHeight = () => {
  uni.getSystemInfo({
    success: function (res) {
      const query = uni.createSelectorQuery()
      query.select('.swiper-box').boundingClientRect()
      query.exec(data => {
        scrollHeight.value = res.windowHeight - data[0].top + 'px';
      })
    }
  });
}
onMounted(() => {
  setScrollHeight();
})
</script>

<template>
  <view class="content" :style="themeStore.themeStyles">
    <NavBar :list="MEDIA_LIST" @change="changeTab" />
    <swiper 
      :style="{ height: scrollHeight }"
      class="swiper-box"
      :current="swiperCurrent"
      @change="changeSwiper"
    >
      <swiper-item v-for="(item, index) in MEDIA_LIST" :key="index">
        <Media />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">

</style>
