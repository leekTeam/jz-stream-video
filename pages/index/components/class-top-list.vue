<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])
const updateModelValue = (cid: string) => {
  if (props.modelValue !== cid) {
    emit('update:modelValue', cid)
    emit('change', cid)
  }
}
</script>

<template>
  <view class="class-top-list">
    <scroll-view scroll-x>
      <view class="class-top-list-wrap">
        <u-tag
          v-for="item in options"
          :key="item.cid"
          :text="item.name"
          shape="circle"
          mode="plain"
          :type="modelValue === item.cid ? 'primary' : 'info'"
          @click="updateModelValue(item.cid)"
        />
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.class-top-list {
  flex-shrink: 0;
  width: 100%;
  padding: 0 24rpx;
  .class-top-list-wrap {
    display: flex;
    align-items: center;
  }
  .u-tag {
    flex-shrink: 0;

    &.u-tag {
      margin-left: 24rpx;
    }
  }
}
</style>
