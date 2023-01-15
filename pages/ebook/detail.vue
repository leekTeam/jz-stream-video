<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { nextTick, ref } from 'vue'
import { useThemeStore } from '@/store'
import { DownloadEbook } from '@/utils/testDownload'

const themeStore = useThemeStore()
const ebookInfo = ref<TEbookDownloadStorage>()
// 先全部给默认值
const readStyle = ref({
  fontsize: undefined,
  lineHeight: undefined,
  color: undefined,
  bgColor: undefined,
  currentChapter: 1,
})
const yingbingReadPageRef = ref()

const initReadPage = () => {
  console.log(ebookInfo.value)
}

onLoad((options = {}) => {
  ebookInfo.value = DownloadEbook.getStorageInfo(options.rid)!
  uni.setNavigationBarTitle({ title: ebookInfo.value.name })
  initReadPage()
})
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view class="page-container" :style="themeStore.themeStyles">
    <yingbing-ReadPage
      ref="yingbingReadPageRef"
      page-type="real"
      :font-size="readStyle.fontsize"
      :line-height="readStyle.lineHeight"
      :color="readStyle.color"
      :bg-color="readStyle.bgColor"
      :slide="24"
      :no-chapter="true"
      enable-click
      :auto-split-chapter="false"
      :visible-page="false"
    />
  </view>
</template>

<style lang="scss" scoped>
.page-container {
  overflow: hidden;
  height: 100%;
}
.yingbing-read-page {
  height: 100%;
}
</style>
