<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MusicBox from '@/components/music/music-box.vue'
import { classTopLayerGet, resGet } from '@/api/music'

defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TMusicTopClass[]>([])
const currentSubValue = ref('')
const list = ref<TMusic[]>([])

const changeTab = () => {
  scrollRef.value.triggerDownScroll()
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
    const { dataObject, numberOfElements } = res
    const { content } = dataObject as any
    mescroll.endBySize(content.length, numberOfElements)
    console.log("dataObject",dataObject);
    
    if (mescroll.num === 1)
      list.value = content
    else list.value = [...list.value, ...content]
  })
    .catch(() => {
      mescroll.endErr()
    })
}

const activeIndex = ref();
const hanldeClick = (musicItem: any) => {

}
</script>

<template>
  <ScrollList ref="scrollRef" :is-active="isActive && !!currentSubValue" :up-callback="upCallback">
    <template #header>
      <ClassTopList v-model="currentSubValue" :options="tabList" @change="changeTab" />
    </template>
    <view class="music-list">
      <MusicBox
        v-for="(musicItem, index) in list"
        :key="musicItem.rid"
        :name="musicItem.name"
        :number="index + 1"
        :mainauthor="musicItem.mainauthor"
        :score="musicItem.score / 2"
        :isActive="activeIndex === 2"
        @click="hanldeClick(musicItem)"
      />
    </view>
  </ScrollList>
</template>

<style lang="scss" scoped>
.music-list {
  margin: 24rpx;
  box-sizing: border-box;
  border: 1px solid $uni-border-color;
  border-radius: 12rpx;
}
</style>
