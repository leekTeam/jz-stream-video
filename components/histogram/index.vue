<script setup lang="ts">
defineProps({
  pause: Boolean,
})
</script>

<template>
  <view class="histogram-box">
    <view class="histogram-box-one" :class="{ pause }" />
    <view class="histogram-box-two" :class="{ pause }" />
    <view class="histogram-box-three" :class="{ pause }" />
    <view class="histogram-box-one" :class="{ pause }" />
  </view>
</template>

<style lang="scss" scoped>
.histogram-box {
  display: flex;
  justify-content: space-between;
  width: 40rpx;
  height: 40rpx;
  transform: rotateX(180deg);
  &-one, &-two, &-three {
    width: 4px;
    height: 30rpx;
    background: #fe9a00;
  }
  &-one {
    height: 30rpx;
    animation: move 1.4s ease infinite;
  }
  &-two {
    height: 44rpx;
    animation: move 1.4s ease .2s infinite;
  }
  &-three {
    height: 20rpx;
    animation: move 1.4s ease .3s infinite;
  }
}

.pause {
  animation-play-state: paused;
}

@keyframes move {
  0% { height: 0; }
  50% { height: 40rpx; }
  100% { height: 0; }
}
</style>
