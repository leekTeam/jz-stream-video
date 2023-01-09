<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MovieBox from '@/components/movie/movie-box.vue'
import { classTopLayerGet, resGet } from '@/api/movie'

defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TMovieTopClass[]>([])
const currentSubValue = ref('')
const list = ref<TMovie[]>([])

const changeTab = (index: number) => {
  currentSubValue.value = tabList.value[index].cid
  scrollRef.value.resetUpScroll()
}

const hanldeClick = (mediaItem: any) => {
  const { name, rid, label, country, years, tolnum, summary, score }
    = mediaItem
  const params = {
    name,
    rid,
    label,
    country,
    years,
    tolnum,
    summary,
    score,
  }
  uni.navigateTo({
    url: `/pages/media/detail?item=${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  })
}
onMounted(() => {
  classTopLayerGet().then((res) => {
    const { dataObject } = res
    tabList.value = dataObject
    currentSubValue.value = dataObject[0].cid
  })
})

const upCallback = (mescroll: any) => {
  resGet({
    cid: currentSubValue.value,
    page: mescroll.num,
    size: mescroll.size,
  }).then((res) => {
    const { dataObject, totalElements } = res
    mescroll.endBySize(dataObject.length, totalElements)
    if (mescroll.num === 1)
      list.value = dataObject
    else list.value = [...list.value, ...dataObject]
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
        v-for="mediaItem in list"
        :key="mediaItem.rid"
        :poster="mediaItem.poster"
        :name="mediaItem.name"
        :summary="mediaItem.summary"
        :label="mediaItem.label"
        :years="mediaItem.years"
        @click="hanldeClick(mediaItem)"
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
