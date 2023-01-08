<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<template>
  <view class="content" :style="themeStore.themeStyles">
    <NavBar :list="MEDIA_LIST" @change="changeTab" />
    <Media />
  </view>
</template>

<style lang="scss">

</style>
