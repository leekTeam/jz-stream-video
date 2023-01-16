<script lang="ts">
import { computed, nextTick, ref } from 'vue'

interface TDataContent {
  id: number
  text: string
}

interface TData {
  id: number
  start: number
  end: number
  contents: TDataContent[]
  isStart: boolean
  isEnd: boolean
}

export default {
  props: {
    // 字体大小 px
    fontSize: {
      type: Number,
      default: 14,
    },
    // 行高 px
    lineHeight: {
      type: Number,
      default: 36,
    },
    // 背景颜色 px
    backgroundColor: {
      type: String,
      default: '#fcd281',
    },
    // 左右两侧可以触发的区间 px
    touchWidth: {
      type: Number,
      default: 40,
    },
  },
  emit: ['change'],
  setup(props) {
    const startReadIndex = ref(0)
    const textContent = ref('')
    const initViews = (data: { start: number; content: string }) => {
      const { content, start } = data
      startReadIndex.value = start
      textContent.value = content
    }

    const componentProps = computed(() => {
      const { fontSize, lineHeight, touchWidth } = props
      return {
        startReadIndex: startReadIndex.value,
        textContent: textContent.value,
        fontSize,
        lineHeight,
        touchWidth,
      }
    })

    const list = ref<TData[]>([])
    const updated = ref(false)
    const isStart = ref(false)

    const setListData = (val: TData[]) => {
      list.value = val
      nextTick(() => {
        updated.value = true
      })
    }

    const updateStatus = (val: boolean) => {
      isStart.value = val
    }

    return {
      isStart,
      updated,
      list,
      componentProps,
      initViews,
      setListData,
      updateStatus,
    }
  },
}
</script>
<!-- eslint-disable -->
<script lang="renderjs" module="renderBiz">
import renderjs from './renderjs'
export default {
  mixins: [renderjs]
}
</script>

<template>
  <view class="read-box" :style="{ backgroundColor }" :prop="componentProps" :change:prop="renderBiz.propObserver" :updated="updated" :change:updated="renderBiz.updatedObserver">
    <view
      v-for="item in list"
      :key="item.id"
      :class="`read-box-content_${item.id}`"
      class="read-box-content"
      :style="{ backgroundColor }"
    >
      <view
        v-for="textItem in item.contents"
        :key="textItem.id"
        :style="{ 'height': `${lineHeight}px`, 'line-height': `${lineHeight}px` }"
        class="read-box-text"
      >
        {{ textItem.text }}
      </view>
    </view>
    <view
      v-show="isStart"
      class="read-box-move-bg"
      :style="{ backgroundColor }"
      @transitionend="renderBiz.onTransitionend"
    />
    <view v-show="isStart" class="read-box-move-shadow" />
    <view
      class="read-box-event"
      @touchstart="renderBiz.onTouchStart"
      @touchmove="renderBiz.onTouchMove"
      @touchend="renderBiz.onTouchEnd"
    />
  </view>
</template>

<!-- eslint-enable  -->
<style lang="scss" scoped>
.read-box {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  &-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    line-height: 1;
  }

  &-text {
    white-space: pre-wrap;
    width: 100%;
    overflow: hidden;
  }

  &-move-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  &-move-shadow {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    box-shadow: 0 0 60px 30px rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  &-event {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
  }
}
</style>
