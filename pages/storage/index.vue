<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { bytesUnitFormat } from '@/utils'
import { LIMIT_CLEAR_KEYS } from '@/constant/storage'
import { useThemeStore } from '@/store'
import { DownloadEbook, DownloadMovie, DownloadMusic, DownloadSound, getDownloadingList } from '@/utils/download'
import { CLEAR_STORAGE } from '@/constant/event'

const themeStore = useThemeStore()
const storageTotal = ref('')

onLoad(() => {
  const storageInfo = uni.getStorageInfoSync()
  const value = [DownloadEbook, DownloadMovie, DownloadMusic, DownloadSound].reduce((total, item) => {
    total += item.getStorageSize()
    return total
  }, storageInfo.currentSize)
  storageTotal.value = bytesUnitFormat(value)
})

const clearStorage = () => {
  uni.showLoading({ title: '清除缓存中', mask: true })
  uni.getStorageInfo({
    success: (storageInfo) => {
      getDownloadingList().then((res) => {
        res.forEach((item) => {
          item.download.destory()
        })

        DownloadEbook.clearStorage()
        DownloadMovie.clearStorage()
        DownloadMusic.clearStorage()
        DownloadSound.clearStorage()

        storageInfo.keys.forEach((key) => {
          if (!LIMIT_CLEAR_KEYS.includes(key))
            uni.removeStorageSync(key)
        })

        storageTotal.value = bytesUnitFormat(0)

        uni.$emit(CLEAR_STORAGE)
        uni.hideLoading()
        uni.showToast({
          title: '清除缓存成功',
          icon: 'success',
        })
      })
    },
    fail() {
      uni.hideLoading()
    },
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
      <u-cell-item title="清除缓存" :value="storageTotal" @click="clearStorage" />
    </u-cell-group>
  </view>
</template>

<style lang="scss" scoped></style>
