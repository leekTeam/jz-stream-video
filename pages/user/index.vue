<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/store'
import ThemePopup from '@/components/theme-popup/index.vue'

const themeStore = useThemeStore()

const themePopupRef = ref()

const openThemePopup = () => {
  themePopupRef.value.openPopup()
}

const goDownloadDetail = () => {
  uni.navigateTo({
    url: '/pages/download/detail',
  })
}

const goDownload = () => {
  uni.navigateTo({
    url: '/pages/download/index',
  })
}

const goStoragePage = () => {
  uni.navigateTo({
    url: '/pages/storage/index',
  })
}

const goApiSetting = () => {
  uni.navigateTo({
    url: '/pages/api/setting',
  })
}
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view :style="themeStore.themeStyles">
    <u-cell-group>
      <u-cell-item icon="file-text" title="离线中心" @click="goDownloadDetail" />
      <u-cell-item icon="download" title="下载中心" @click="goDownload" />
      <u-cell-item icon="bookmark" title="皮肤" @click="openThemePopup" />
      <u-cell-item icon="setting" title="缓存设置" @click="goStoragePage" />
      <u-cell-item icon="setting" title="API设置" @click="goApiSetting" />
    </u-cell-group>
    <ThemePopup ref="themePopupRef" />
  </view>
</template>

<style></style>
