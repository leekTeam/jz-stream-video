import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import type { ObjAddPrefix } from '@/types/utils'
import type { Theme, ThemeType } from '@/config/theme'
import { themeConfig } from '@/config/theme'
import { TIEME_KEY } from '@/constant/storage'

export const useThemeStore = defineStore('themeStore', () => {
  const themeType = ref<ThemeType>('red')

  const themeStyles = computed(() => {
    return Object.entries(themeConfig[themeType.value]).reduce((obj, [key, val]) => {
      obj[`--${key as keyof Theme}`] = val
      return obj
    }, {} as ObjAddPrefix<Theme, '--'>)
  })

  const primaryColor = computed(() => {
    return themeStyles.value['--color-primary']
  })

  const updatePageTheme = () => {
    nextTick(() => {
      uni.setNavigationBarColor({
        backgroundColor: primaryColor.value,
      })
      uni.setTabBarStyle({
        selectedColor: primaryColor.value,
      })
    })
  }

  const updateTheme = (val?: ThemeType) => {
    themeType.value = val || uni.getStorageSync(TIEME_KEY) || 'red'
    uni.setStorageSync(TIEME_KEY, themeType.value)
    updatePageTheme()
  }

  updateTheme()

  return {
    primaryColor,
    themeStyles,
    updateTheme,
    updatePageTheme,
  }
})
