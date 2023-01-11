<script setup lang="ts">
import { useRequestList } from '../useRequestList'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MusicList from '@/components/music/music-list.vue'
import { classTopLayerGet, resGet } from '@/api/music'

const props = defineProps({
  isActive: Boolean,
})

const {
  scrollRef,
  activeClassifyCid,
  classifyList,
  isActiveScroll,
  listData,
  upCallback,
  onClassifyChange,
} = useRequestList(props, classTopLayerGet, resGet)
</script>

<template>
  <ScrollList
    ref="scrollRef"
    :class="{ 'has-list': !!listData.length }"
    :is-active="isActiveScroll"
    :up-callback="upCallback"
  >
    <template #header>
      <ClassTopList
        v-model="activeClassifyCid"
        :options="classifyList"
        @change="onClassifyChange"
      />
    </template>
    <MusicList :data="listData" />
  </ScrollList>
</template>

<style lang="scss" scoped>
.has-list {
  :deep(.mescroll-wrap) {
    margin: 24rpx 0;
    box-sizing: border-box;
    border: 1px solid $uni-border-color;
    border-radius: 12rpx;
  }
}
</style>
