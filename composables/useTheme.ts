import { onReady, onShow } from '@dcloudio/uni-app'
import { nextTick } from 'vue'
import { useThemeStore } from '@/store'

export const useTheme = () => {
  const themeStore = useThemeStore()

  onShow(() => {
    nextTick(() => {
      themeStore.updatePageTheme()
    })
  })

  onReady(() => {
    themeStore.updatePageTheme()
  })
}
