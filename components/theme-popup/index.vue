<script lang="ts" setup>
import { defineExpose, ref } from 'vue'
import { useThemeStore } from '@/store'
import type { ThemeType } from '@/config/theme'
import { themeOptions } from '@/config/theme'

const themeStore = useThemeStore()
const visible = ref(false)

const openPopup = () => {
  visible.value = true
}

const updateTheme = (val: ThemeType) => {
  themeStore.updateTheme(val)
  visible.value = false
}

defineExpose({
  openPopup,
})
</script>

<template>
  <u-popup v-model="visible" mode="bottom" border-radius="14">
    <view class="theme-box">
      <view
        v-for="item in themeOptions"
        :key="item.value"
        class="theme-box-item"
        @click="updateTheme(item.value)"
      >
        <view class="theme-box-item-label">
          {{ item.label }}
        </view>
        <view
          class="theme-box-item-color"
          :style="{
            'background-color': item.color,
          }"
        />
      </view>
    </view>
  </u-popup>
</template>

<style lang="scss" scoped>
.theme-box {
  display: flex;
  flex-direction: column;

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 24rpx;
    border-bottom: 1rpx solid $u-border-color;

    &-color {
      width: 80rpx;
      height: 80rpx;
    }
  }
}
</style>
