<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MusicBox from '@/components/music/music-box.vue'
import { classTopLayerGet, resGet } from '@/api/music'

const props = defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TMusicTopClass[]>([])
const currentSubValue = ref('')
const list = ref<TMusic[]>([])

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
  <ScrollList ref="scrollRef" :class="{ 'has-list': !!list.length }" :is-active="isActive && !!currentSubValue" :up-callback="upCallback">
    <template #header>
      <ClassTopList v-model="currentSubValue" :options="tabList" @change="changeTab" />
    </template>
    <view v-if="list.length" class="music-list">
      <MusicBox
        v-for="(musicItem, index) in list"
        :key="musicItem.rid"
        :rid="musicItem.rid"
        :name="musicItem.name"
        :number="index + 1"
        :mainauthor="musicItem.mainauthor"
        :score="musicItem.score / 2"
      />
    </view>
  </ScrollList>
</template>

<style lang="scss" scoped>
.has-list {
  :deep(.mescroll-wrap) {
    padding: 24rpx 0;
    box-sizing: border-box;
  }
  :deep(.mescroll-uni-content){
    padding: 24rpx;
    box-sizing: border-box;
    border: 1px solid $uni-border-color;
    border-radius: 12rpx;
  }
}
</style>
