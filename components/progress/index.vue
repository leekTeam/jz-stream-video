<script setup lang="ts">
import { useThemeStore } from '@/store'
const themeStore = useThemeStore()
</script>

<template>
  <view class="progress-box">
    <u-line-progress
      v-bind="$attrs"
      :activeColor="themeStore.primaryColor"
      height="12"
      :showText="false"
    />
    <u-icon
      class="progress-box-clock-icon"
      color="#ffffff"
      name="clock-fill"
      size="40"
    />
  </view>
</template>

<style lang="scss" scoped>
.progress-box {
  display: flex;
  align-items: center;
  &-clock-icon {
    margin-left: 10rpx;
  }
}
</style>
