<script setup lang="ts">
import { useThemeStore } from '@/store'
import { MEDIA_LIST } from '@/constant/media'
const themeStore = useThemeStore()
</script>

<template>
  <u-tabs
    v-bind="$attrs"
    :active-color="themeStore.primaryColor"
    name="label"
    :list="MEDIA_LIST"
    :show-bar="false"
    :is-scroll="false"
  />
</template>

<style lang="ts" scoped></style>
