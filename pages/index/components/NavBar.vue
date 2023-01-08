<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables'
import { useThemeStore } from '@/store'

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: 'label',
  },
})

const emits = defineEmits(['change'])

const themeStore = useThemeStore()
useTheme()

const current = ref(0)

const changeTab = (index: number) => {
  emits('change', index)
}
</script>

<template>
  <u-tabs
    v-model="current"
    :active-color="themeStore.primaryColor"
    :name="name"
    :list="list"
    :show-bar="false"
    :is-scroll="false"
    @change="changeTab"
  />
</template>

<style lang="ts" scoped>
</style>
