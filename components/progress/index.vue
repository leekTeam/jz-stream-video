<script setup lang="ts">
import { useThemeStore } from '@/store'
const themeStore = useThemeStore()
defineProps({
  placement: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'inherit'
  }
})
</script>

<template>
  <view class="progress-box" :class="`${placement && `progress-box-${placement}`}`">
    <u-line-progress
      v-bind="$attrs"
      class="progress-box-line-progress"
      :active-color="themeStore.primaryColor"
      height="12"
      :show-percent="false"
    />
    <u-icon
      class="progress-box-clock-icon"
      name="clock-fill"
      :color="color"
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
.progress-box-bottom {
  flex-direction: column-reverse;
  align-items: flex-end;
  .progress-box-line-progress {
    width: 100rpx;
    margin-top: 10rpx;
  }
}
</style>
