<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useThemeStore } from '@/store'
import { DownloadEbook } from '@/utils/testDownload'
import ReadBox from '@/components/ebook/read-box.vue'

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
const readBoxRef = ref()

const initReadPage = () => {
  plus.io.resolveLocalFileSystemURL(ebookInfo.value!.fileName, (entry: any) => {
    entry.file((file: any) => {
      const fileReader = new (plus.io as any).FileReader()
      fileReader.readAsText(file, 'utf-8')
      fileReader.onloadend = (res: any) => {
        readBoxRef.value.initViews({
          content: res.target.result,
          // start 阅读记录 需要存到本地下次进来打开恢复
          start: 0,
        })
      }
    })
  })
}

onLoad((options = {}) => {
  ebookInfo.value = DownloadEbook.getStorageInfo(options.rid)!
  uni.setNavigationBarTitle({ title: ebookInfo.value.name })
})

onReady(() => {
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
    <ReadBox ref="readBoxRef" />
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
