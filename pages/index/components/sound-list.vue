<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import SoundBox from '@/components/sound/sound-box.vue'
import { classTopLayerGet, resGet } from '@/api/sound'

const props = defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TSoundTopClass[]>([])
const currentSubValue = ref('')
const list = ref<TSound[]>([])

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

const hanldeClick = (soundItem: any) => {
  const { name, rid, poster, tolnum } = soundItem
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
        :rid="soundItem.rid"
        :poster="soundItem.poster"
        :name="soundItem.name"
        :summary="soundItem.summary"
        :label="soundItem.label"
        :years="soundItem.years"
        :tolnum="soundItem.tolnum"
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
