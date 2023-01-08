<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SubBar from '../SubBar'
import MediaList from './components/MediaList'
import { classTopLayerGet, resGet } from '@/api/movie'

const tabList = ref([])
const currentSubValue = ref('')

const status = ref('loadmore')

const list = ref([])
const page = ref(1)
const getList = () => {
  status.value = 'loading'
  resGet({
    cid: currentSubValue.value,
    page: page.value,
    size: 10,
  }).then((res) => {
    const { dataObject } = res
    console.log('res', res)
    list.value = [...list.value, ...dataObject]
    if (!dataObject.length)
      status.value = 'nomore'
    else
      status.value = 'loadmore'
  })
}
const changeTab = (index) => {
  currentSubValue.value = tabList.value[index].cid
  list.value = []
  getList()
}

const onreachBottom = () => {
  page.value++
  getList()
}

const current = ref(0)
const changeSwiper = (index) => {
  current.value = index
  changeTab(index)
}

onMounted(() => {
  classTopLayerGet().then((res) => {
    const { dataObject } = res
    tabList.value = dataObject
    changeTab(0)
  })
})
</script>

<template>
  <SubBar v-model="current" :list="tabList" @change="changeTab" />
  <MediaList :status="status" :tabs="tabList" :list="list" @onreachBottom="onreachBottom" @change="changeSwiper" />
</template>

<style>

</style>
