import { onPageScroll, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref, watch } from 'vue'

export const useMescroll = () => {
  const mescroll = ref<any>(null)
  const mescrollRef = ref()
  onPullDownRefresh(() => {
    mescroll.value && mescroll.value.onPullDownRefresh()
  })

  onPageScroll(() => {
    mescroll.value && mescroll.value.onPageScroll()
  })

  onReachBottom(() => {
    mescroll.value && mescroll.value.onReachBottom()
  })

  const mescrollInitByRef = () => {
    if (!mescroll.value || !mescroll.value.resetUpScroll) {
      if (mescrollRef.value)
        mescroll.value = mescrollRef.value.mescroll
    }
  }

  const mescrollInit = (val: any) => {
    mescroll.value = val
    mescrollInitByRef()
  }

  onMounted(() => {
    mescrollInitByRef()
  })

  return {
    mescroll,
    mescrollRef,
    mescrollInit,
  }
}

// 没有兼容字节小程序
export const useMescrollMoreItem = (mescroll: any, isActive: () => boolean) => {
  const isInit = ref(false)

  const mescrollTrigger = () => {
    isInit.value = true // 标记为true
    if (mescroll.value) {
      if (mescroll.value.optDown.use)
        mescroll.value.triggerDownScroll()

      else
        mescroll.value.triggerUpScroll()
    }
  }

  watch(isActive, (val) => {
    if (val && !isInit.value)
      mescrollTrigger()
  })

  const mescrollInit = (val: any) => {
    mescroll.value = val
    // 自动加载当前tab的数据
    if (isActive())
      mescrollTrigger()
  }

  return {
    mescrollInit,
  }
}
