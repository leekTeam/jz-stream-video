<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from '@/composables'
import { useThemeStore } from '@/store'

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: 'name',
  },
  value: {
    type: Number,
    default: 0,
  },
})

const emits = defineEmits(['change', 'update:value'])

const themeStore = useThemeStore()

useTheme()

const current = ref(0)
const changeTab = (index: number) => {
  emits('change', index)
}

const style = {
  backgroundColor: '#ffffff',
  borderRadius: '43rpx',
  border: '2rpx solid var(--color-primary)',
}
</script>

<template>
  <u-tabs v-model="current" class="tab-box" :active-color="themeStore.primaryColor" :name="name" :list="list"
    :show-bar="false" :active-item-style="style" @change="changeTab" />
</template>

<style lang="scss" scoped>
.tab-box ::v-deep {
  .u-tab-item {
    background-color: #f4f4f5;
    border-radius: 43rpx;
    margin-left: 20rpx;

    &:not(:last-child) {
      margin-right: 20rpx;
    }
  }
}
</style>
