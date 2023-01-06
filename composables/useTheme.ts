import { onInit, onReady, onUnload } from '@dcloudio/uni-app'
import { useThemeStore } from '@/store'
import { THEME_CHANGE } from '@/constant/event'

export const useTheme = () => {
  const themeStore = useThemeStore()

  const updateTheme = () => {
    themeStore.updatePageTheme()
  }

  onInit(() => {
    uni.$on(THEME_CHANGE, updateTheme)
  })

  onReady(() => {
    updateTheme()
  })

  onUnload(() => {
    uni.$off(THEME_CHANGE, updateTheme)
  })
}
