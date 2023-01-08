<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavBar from './components/NavBar'
import Media from './components/media/index'
import { useThemeStore } from '@/store'
import { useTheme } from '@/composables'
import { MEDIA_LIST } from '@/constant/media'

const themeStore = useThemeStore()

useTheme()

const currentValue = ref(MEDIA_LIST[0].value)
const changeTab = (index: number) => {
  currentValue.value = MEDIA_LIST[index].value
}

const list = ref([])
const currentSubValue = ref('')
const changeSubTab = (index: number) => {
  currentSubValue.value = list.value[index].cid
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
