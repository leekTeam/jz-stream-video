<script setup lang="ts">
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
const yingbingReadPageRef = ref()

const getContent = (chapter = 1) => {
  return `第${chapter}章
    你们— —好啊你们好啊"你们好啊你"“们好啊你们好”啊你们好啊你们好啊。
    你们好啊— —你们好啊你们，好啊你们好啊你们好啊你们好啊你们好啊。
    你们— —好啊你们好啊,你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你,们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们，好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你,们好啊你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好啊，你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊— —你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好，啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你，们好啊你们好啊你们好啊你们好啊。
    你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊。

    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊

    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊

    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊

    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
    神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊

    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
    疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊

    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊

    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
    `
}

const start = (content = ebookMediaText.value) => {
  nextTick(() => {
    yingbingReadPageRef.value.init({
      contents: [
        {
          chapter: 3,
          content: getContent(3),
          title: '第三章',
          isStart: false,
          isEnd: false,
        },
        {
          chapter: 4,
          content: getContent(4),
          title: '第四章',
          isStart: false,
          isEnd: false,
        },
        {
          chapter: 5,
          content: getContent(5),
          title: '第五章',
          isStart: false,
          isEnd: false,
        },
      ],
      start: 0,
      currentChapter: 3,
    })
  })
}
const loadEbookText = () => {
  if (ebookMediaText.value) {
    start()
    return
  }

  uni.request({
    url: ebookMediaInfo.value!.playurl,
    success: (res) => {
      ebookMediaText.value = res.data
      uni.setStorageSync('text', res.data)
      start()
    },
  })
}

const getMediaData = () => {
  if (ebookMediaText.value) {
    start()
    return
  }
  uni.showLoading({ title: '加载中', mask: true })
  resMediaGet({ rid: ebookInfo.value.rid })
    .then((res) => {
      const { dataObject } = res
      const [row] = dataObject
      ebookMediaInfo.value = {
        ...row,
        playurl: replaceUrlHost(row.playurl),
      }
      loadEbookText()
    })
    .finally(() => {
      uni.hideLoading()
    })
}

onLoad((options = {}) => {
  ebookInfo.value = JSON.parse(decodeURIComponent(options.ebookInfo))
  uni.setNavigationBarTitle({ title: ebookInfo.value.name })
  getMediaData()
})

const loadmoreContent = (chapter: any, callback: any) => {
  setTimeout(() => {
    callback('success', {
      chapter,
      content: chapter === 4 ? '' : getContent(chapter),
      title: `第${chapter}章`,
      isStart: chapter === 1,
      isEnd: chapter === 7,
    })
  }, 2000)
}

const preloadContent = (chapters, callback) => {
  setTimeout(() => {
    const contents = []
    for (const i in chapters) {
      contents.push({
        chapter: chapters[i],
        start: 0,
        content: chapters[i] === 4 ? '' : getContent(chapters[i]),
        title: `第${chapters[i]}章`,
        isStart: chapters[i] === 1,
        isEnd: chapters[i] === 7,
      })
    }
    callback('success', contents)
  }, 2000)
}
</script>

<template>
  <page-meta>
    <navigation-bar :background-color="themeStore.primaryColor" />
  </page-meta>
  <view class="ebook-detail-box" :style="themeStore.themeStyles">
    <yingbing-ReadPage
      ref="yingbingReadPageRef"
      style="height: 100%;"
      page-type="scroll"
      :slide="24"
      :no-chapter="false"
      :enable-preload="true"
      @loadmore="loadmoreContent"
      @preload="preloadContent"
    />
  </view>
</template>

<style lang="scss" scoped>
.ebook-detail-box {
  height: 100%;
}
</style>
