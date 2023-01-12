<script setup lang="ts">
import { ref } from 'vue' 
import SoundList from '@/components/sound/sound-list.vue'

const listData = ref<TSound[]>([])
</script>

<template>
  <view class="sound-list">
    <SoundList :data="listData" />
  </view>
</template>

<style lang="scss" scoped>
.sound-list {
  margin: 24rpx;
  padding: 10rpx;
  box-sizing: border-box;
  border: 1px solid $uni-border-color;
  border-radius: 12rpx;
}
</style>
