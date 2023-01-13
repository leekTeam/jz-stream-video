<script setup lang="ts">
// TODO
import { onLoad } from '@dcloudio/uni-app'
import { nextTick, ref, shallowRef } from 'vue'
import { useThemeStore } from '@/store'
import { resMediaGet } from '@/api/ebook'
import { replaceUrlHost } from '@/utils'
const themeStore = useThemeStore()
const ebookInfo = ref({
  name: '',
  rid: '',
  poster: '',
})
const ebookMediaInfo = shallowRef<TEbookMedia>()
const ebookMediaText = shallowRef(uni.getStorageSync('text') || '')
// 先全部给默认值
const readStyle = ref({
  fontsize: undefined,
  lineHeight: undefined,
  color: undefined,
  bgColor: undefined,
  currentChapter: 1,
})
const yingbingReadPageRef = ref()

const initReadPage = (content = ebookMediaText.value) => {
  nextTick(() => {
    yingbingReadPageRef.value.init({
      content,
      // start 阅读记录 需要存到本地下次进来打开恢复
      start: 0,
      title: ebookInfo.value.name,
    })
  })
}

const loadEbookText = () => {
  uni.request({
    url: ebookMediaInfo.value!.playurl,
    success: (res) => {
      ebookMediaText.value = res.data
      uni.setStorageSync('text', res.data)
      initReadPage()
    },
  })
}

const getMediaData = () => {
  uni.showLoading({ title: '加载中', mask: true })
  resMediaGet({ rid: ebookInfo.value.rid }).then((res) => {
    const { dataObject } = res
    const [row] = dataObject
    ebookMediaInfo.value = {
      ...row,
      playurl: replaceUrlHost(row.playurl),
    }
    loadEbookText()
  }).finally(() => {
    uni.hideLoading()
  })
}

onLoad((options = {}) => {
  ebookInfo.value = JSON.parse(decodeURIComponent(options.ebookInfo))
  uni.setNavigationBarTitle({ title: ebookInfo.value.name })
  getMediaData()
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
