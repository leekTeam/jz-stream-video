<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MovieBox from '@/components/movie/movie-box.vue'
import { classTopLayerGet, resGet } from '@/api/movie'

const props = defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TMovieTopClass[]>([])
const currentSubValue = ref('')
const list = ref<TMovie[]>([])

const changeTab = () => {
  scrollRef.value.triggerDownScroll()
}

watch(() => props.isActive, (val) => {
  if (val && !tabList.value.length) {
    nextTick(() => {
      classTopLayerGet().then((res) => {
        const { dataObject } = res
        tabList.value = dataObject
        currentSubValue.value = dataObject[0].cid
      })
    })
  }
}, {
  immediate: true,
})

const upCallback = (mescroll: any) => {
  resGet({
    cid: currentSubValue.value,
    page: mescroll.num,
    size: mescroll.size,
  }).then((res) => {
    const { dataObject } = res
    const { content, last } = dataObject
    mescroll.endSuccess(content.length, !last)
    if (mescroll.num === 1)
      list.value = content
    else list.value = [...list.value, ...content]
  })
    .catch(() => {
      mescroll.endErr()
    })
}
</script>

<template>
  <ScrollList ref="scrollRef" :is-active="isActive && !!currentSubValue" :up-callback="upCallback">
    <template #header>
      <ClassTopList v-model="currentSubValue" :options="tabList" @change="changeTab" />
    </template>
    <view class="movie-list">
      <MovieBox
        v-for="item in list"
        :key="item.rid"
        :rid="item.rid"
        :poster="item.poster"
        :name="item.name"
        :summary="item.summary"
        :label="item.label"
        :years="item.years"
        :country="item.country"
        :tolnum="item.tolnum"
        :score="item.score"
      />
    </view>
  </ScrollList>
</template>

<style lang="scss" scoped>
.movie-list {
  padding: 24rpx;
  box-sizing: border-box;
  .movie-box + .movie-box {
    margin-top: 24rpx;
  }
}
</style>
