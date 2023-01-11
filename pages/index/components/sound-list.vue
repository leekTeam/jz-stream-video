<script setup lang="ts">
import { useRequestList } from '../useRequestList'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import SoundList from '@/components/sound/sound-list.vue'
import { classTopLayerGet, resGet } from '@/api/sound'

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
    <SoundList :data="listData" />
  </ScrollList>
</template>

<style lang="scss" scoped></style>
