<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { DownloadTask } from '@/utils/download'
import { BASE_URL_KEY } from '@/constant/storage'

onLaunch(() => {
  console.log('App Launch')
  if (!uni.getStorageSync(BASE_URL_KEY))
    uni.setStorageSync(BASE_URL_KEY, 'https://6q7645j209.goho.co/')

  DownloadTask.recoverDownloadTask()
  // TODO 开始下载任务
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
