<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { DownloadTask } from '@/utils/download'
onLaunch(() => {
  console.log('App Launch')
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
