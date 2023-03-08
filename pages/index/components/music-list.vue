<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MusicList from '@/components/music/music-list.vue'
import { useMusicStore } from '@/store'
import { BASE_URL_CHANGE, CLEAR_STORAGE } from '@/constant/event'

const props = defineProps({
  isActive: Boolean,
})

const musicStore = useMusicStore()
const { getClassifyList, upCallback } = musicStore
const { scrollRef, activeClassifyCid, listData, classifyList } = storeToRefs(musicStore)

const isActiveScroll = computed(() => props.isActive && !!activeClassifyCid.value)

const onClassifyChange = () => {
  scrollRef.value.triggerDownScroll()
}

watch(
  () => props.isActive,
  (val) => {
    if (val && !classifyList.value.length) {
      nextTick(() => {
        getClassifyList()
      })
    }
  },
  {
    immediate: true,
  },
)

const refreshList = () => {
  if (listData.value.length)
    listData.value = []

  if (props.isActive)
    scrollRef.value.triggerDownScroll()
}

onMounted(() => {
  uni.$on(CLEAR_STORAGE, refreshList)
  uni.$on(BASE_URL_CHANGE, refreshList)
})

onUnmounted(() => {
  uni.$off(CLEAR_STORAGE, refreshList)
  uni.$off(BASE_URL_CHANGE, refreshList)
})
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
