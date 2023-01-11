<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, shallowRef } from 'vue'
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
const cataLog = shallowRef()
const getCatalog = (content = ebookMediaText.value) => {
  const reg = new RegExp(/(第?[一二两三四五六七八九十○零百千万亿0-9１２３４５６７８９０※✩★☆]{1,6}[章回卷节折篇幕集部]?[、.-\s][^\n]*)[_,-]?/g)
  let match = ''
  const catalog = []
  let chapter = 0
  console.log(content)
  while ((match = reg.exec(content)) != null) {
    chapter++
    catalog.push({
      title: match[0],
      start: match.index,
      chapter,
    })
  }
  console.log(catalog)
  cataLog.value = catalog
}
const loadEbookText = () => {
  if (ebookMediaText.value) {
    getCatalog()
    return
  }

  uni.request({
    url: ebookMediaInfo.value!.playurl,
    success: (res) => {
      ebookMediaText.value = res.data
      uni.setStorageSync('text', res.data)
      getCatalog()
    },
  })
}

const getMediaData = () => {
  if (ebookMediaText.value) {
    getCatalog()
    return
  }
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
  <view class="ebook-detail-box" :style="themeStore.themeStyles">
    dasd
  </view>
</template>

<style lang="scss" scoped></style>
