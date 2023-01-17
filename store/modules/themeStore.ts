import { defineStore } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import type { ObjAddPrefix } from '@/types/utils'
import type { Theme, ThemeType } from '@/config/theme'
import { themeConfig } from '@/config/theme'
import { TIEME_KEY } from '@/constant/storage'

export const useThemeStore = defineStore('themeStore', () => {
  const themeType = ref<ThemeType>('red')
  // 生成主题变量
  const themeStyles = computed(() => {
    return Object.entries(themeConfig[themeType.value]).reduce((obj, [key, val]) => {
      obj[`--${key as keyof Theme}`] = val
      return obj
    }, {} as ObjAddPrefix<Theme, '--'>)
  })

  // 给第三方UI库使用  activeColor、activeBackground 等颜色需要随着主题变化而变化
  const primaryColor = computed(() => {
    return themeStyles.value['--color-primary']
  })

  const updatePageTheme = () => {
    nextTick(() => {
      uni.setNavigationBarColor({
        backgroundColor: primaryColor.value,
        frontColor: '#ffffff',
      })
      uni.setTabBarStyle({
        selectedColor: primaryColor.value,
      })
      uni.setTabBarItem({
        index: 0,
        selectedIconPath: `/static/tabbar/recreation-${themeType.value}.png`,
      })
      uni.setTabBarItem({
        index: 1,
        selectedIconPath: `/static/tabbar/user-${themeType.value}.png`,
      })
    })
  }

  const updateTheme = (val?: ThemeType) => {
    if (val && val !== themeType.value) {
      themeType.value = val
      uni.setStorageSync(TIEME_KEY, themeType.value)
      updatePageTheme()
    }
  }

  updateTheme(uni.getStorageSync(TIEME_KEY))

  return {
    primaryColor,
    themeStyles,
    updateTheme,
    updatePageTheme,
  }
})
