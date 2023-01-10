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
    btnText: '去看看',
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
    <view class="scroll-header">
      <slot name="header" />
    </view>
    <mescroll-uni
      ref="mescrollRef"
      :down="downOption"
      :up="upOption"
      :fixed="false"
      @init="mescrollInit"
      @down="resetUpScroll"
      @up="upCallback"
    >
      <slot />
    </mescroll-uni>
  </view>
</template>

<style lang="scss" scoped>
.scroll-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mescroll-uni-warp {
  flex: 1;
  overflow: hidden;
}
</style>
