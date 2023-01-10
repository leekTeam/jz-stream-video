<script setup lang="ts">
import { useMescroll, useMescrollMoreItem } from '@/composables'

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
  upCallback: {
    type: Function,
    default: () => {},
  },
})

const downOption = {
  auto: false,
}
const upOption = {
  auto: false,
  noMoreSize: 4,
  empty: {
    tip: '~ 空空如也 ~',
  },
}

const { mescroll, mescrollRef } = useMescroll()

const { mescrollInit } = useMescrollMoreItem(mescroll, () => props.isActive)

const resetUpScroll = () => {
  mescroll.value.resetUpScroll()
}

const triggerDownScroll = () => {
  mescroll.value.triggerDownScroll()
}

defineExpose({
  resetUpScroll,
  triggerDownScroll,
})
</script>

<template>
  <view class="scroll-list">
    <slot name="header" />
    <div class="mescroll-wrap">
      <mescroll-uni
        ref="mescrollRef"
        :down="downOption"
        :up="upOption"
        :fixed="false"
        :bottombar="false"
        @init="mescrollInit"
        @down="resetUpScroll"
        @up="upCallback"
      >
        <slot />
      </mescroll-uni>
    </div>
  </view>
</template>

<style lang="scss" scoped>
.scroll-list {
  // #ifdef APP-PLUS
  height: calc(100% - 52rpx);
  // #endif
  // #ifndef APP-PLUS
  height: 100%;
  // #endif
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 24rpx;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
}
.mescroll-wrap {
  flex: 1;
  overflow: hidden;
}
</style>
