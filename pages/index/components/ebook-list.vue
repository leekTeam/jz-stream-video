<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import EbookBox from '@/components/ebook/ebook-box.vue'
import { classTopLayerGet, resGet } from '@/api/ebook'

defineProps({
  isActive: Boolean,
})

const scrollRef = ref()
const tabList = ref<TEbookTopClass[]>([])
const currentSubValue = ref('')
const list = ref<TEbook[]>([])

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
    <view class="ebook-list">
      <EbookBox
        v-for="ebookItem in list"
        :key="ebookItem.rid"
        :poster="ebookItem.poster"
        :name="ebookItem.name"
      />
    </view>
  </ScrollList>
</template>

<style lang="scss" scoped>
.ebook-list {
  margin: 24rpx;
  padding: 10rpx;
  box-sizing: border-box;
  border: 1px solid $uni-border-color;
  border-radius: 12rpx;
}
</style>
