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
}

const { mescroll, mescrollRef } = useMescroll()

const { mescrollInit } = useMescrollMoreItem(mescroll, () => props.isActive)

const resetUpScroll = () => {
  mescroll.value.resetUpScroll()
}

const triggerDownScroll = () => {
  mescroll.value.triggerDownScroll()
}

const triggerUpScroll = () => {
  mescroll.value.triggerUpScroll()
}

defineExpose({
  mescroll,

  resetUpScroll,
  triggerDownScroll,
  triggerUpScroll,
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.mescroll-wrap {
  flex: 1;
  overflow: hidden;
}
</style>
