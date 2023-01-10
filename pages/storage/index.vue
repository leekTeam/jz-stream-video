<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { bytesUnitFormat } from '@/utils'
import { LIMIT_CLEAR_KEYS } from '@/constant/storage'
import { useThemeStore } from '@/store'

// TODO
const themeStore = useThemeStore()
const storageTotal = ref('')
const allStateTotal = ref('')

onLoad(() => {
  const storageInfo = uni.getStorageInfoSync()
  storageTotal.value = bytesUnitFormat(storageInfo.currentSize)
})

const clearStorage = () => {
  uni.getStorageInfo({
    success: (res) => {
      res.keys.forEach((key) => {
        if (!LIMIT_CLEAR_KEYS.includes(key))
          uni.removeStorageSync(key)
      })
      storageTotal.value = bytesUnitFormat(0)
    },
  })
}

const clearAllState = () => {
  console.log('clearAllState')
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
      <u-cell-item title="清楚全部数据" :value="allStateTotal" @click="clearAllState" />
    </u-cell-group>
  </view>
</template>

<style lang="scss" scoped></style>
