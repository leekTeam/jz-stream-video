<script setup lang="ts">
import { useThemeStore } from '@/store'

defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: 'name',
  },
})

const themeStore = useThemeStore()

const style = {
  backgroundColor: '#ffffff',
  borderRadius: '43rpx',
  border: '2rpx solid var(--color-primary)',
}
</script>

<template>
  <u-tabs
    v-bind="$attrs"
    class="tab-box"
    :active-color="themeStore.primaryColor"
    :name="name"
    :list="options"
    :show-bar="false"
    :active-item-style="style"
  />
</template>

<style lang="scss" scoped>
.tab-box {
  flex-shrink: 0;
}
:deep(.u-tab-item) {
  background-color: #f4f4f5;
  border-radius: 43rpx;
  margin-left: 20rpx;

  &:not(:last-child) {
    margin-right: 20rpx;
  }
}
</style>
