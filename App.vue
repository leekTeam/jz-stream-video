<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { BASE_URL_KEY } from '@/constant/storage'
import { getDownloadingList } from '@/utils/download'
onLaunch(() => {
  if (!uni.getStorageSync(BASE_URL_KEY))
    uni.setStorageSync(BASE_URL_KEY, 'https://6q7645j209.goho.co/')

  getDownloadingList()
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import "./uni_modules/vk-uview-ui/index.scss";

uni-page-body {
  height: 100% !important;
  overflow-y: auto;
}
</style>
