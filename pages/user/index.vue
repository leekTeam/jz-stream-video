<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useThemeStore } from '@/store'
import { useTheme } from '@/composables'
import ThemePopup from '@/components/theme-popup/index.vue'

useTheme()

const themeStore = useThemeStore()

const themePopupRef = ref()

const openThemePopup = () => {
  themePopupRef.value.openPopup()
}

const goStoragePage = () => {
  uni.navigateTo({
    url: '/pages/storage/index',
  })
}
</script>

<template>
  <view :style="themeStore.themeStyles">
    <u-cell-group>
      <u-cell-item icon="file-text" title="离线中心" />
      <u-cell-item icon="download" title="下载中心" />
      <u-cell-item icon="bookmark" title="皮肤" @click="openThemePopup" />
      <u-cell-item icon="setting" title="缓存设置" @click="goStoragePage" />
    </u-cell-group>

    <ThemePopup ref="themePopupRef" />
  </view>
</template>

<style></style>
