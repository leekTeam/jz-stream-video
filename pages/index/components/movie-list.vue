<script setup lang="ts">
import { useRequestList } from '../useRequestList'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MovieList from '@/components/movie/movie-list.vue'
import { classTopLayerGet, resGet } from '@/api/movie'

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
    <MovieList :data="listData" />
  </ScrollList>
</template>

<style lang="scss" scoped></style>
