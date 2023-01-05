<script lang="ts" setup>
import { useTheme } from '@/composables'
useTheme()
// TODO
const storageTotal = '13.38MB'
const allStateTotal = '16.02MB'
const clearStorage = () => {
  console.log('clearStorage')
}

const clearAllState = () => {
  console.log('clearAllState')
}
</script>

<template>
  <u-cell-group>
    <u-cell-item title="清除缓存" :value="storageTotal" @click="clearStorage" />
    <u-cell-item title="清楚全部数据" :value="allStateTotal" @click="clearAllState" />
  </u-cell-group>
</template>

<style lang="scss" scoped></style>
