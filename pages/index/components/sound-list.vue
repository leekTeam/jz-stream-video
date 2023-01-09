<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import SoundBox from '@/components/sound/sound-box.vue'
import { classTopLayerGet, resGet } from '@/api/sound'

defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TMovieTopClass[]>([])
const currentSubValue = ref(0)
const list = ref<TSound[]>([])

const changeTab = (index: number) => {
  currentSubValue.value = index
  scrollRef.value.resetUpScroll()
}

const hanldeClick = (mediaItem: any) => {
  const { name, rid, poster, tolnum }
    = mediaItem
  const params = {
    name,
    rid,
    poster,
    tolnum,
  }
  uni.navigateTo({
    url: `/pages/sound/detail?item=${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  })
}
onMounted(() => {
  classTopLayerGet().then((res) => {
    const { dataObject } = res
    tabList.value = dataObject
    currentSubValue.value = 0
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
    <view class="sound-list">
      <SoundBox
        v-for="soundItem in list"
        :key="soundItem.rid"
        :poster="soundItem.poster"
        :name="soundItem.name"
        :summary="soundItem.summary"
        :label="soundItem.label"
        :years="soundItem.years"
        @click="hanldeClick(soundItem)"
      />
    </view>
  </ScrollList>
</template>

<style lang="scss" scoped>
.sound-list {
  padding: 24rpx;
  box-sizing: border-box;
  .sound-box + .sound-box {
    margin-top: 24rpx;
  }
}
</style>
