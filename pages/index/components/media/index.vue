<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MediaItem from './components/MediaItem.vue'
import SubBar from '../SubBar.vue'
import { classTopLayerGet, resGet } from '@/api/movie'

const loadText = ref({
  loadmore: '轻轻上拉',
  loading: '努力加载中',
  nomore: '实在没有了',
})
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
    list.value = [...list.value, ...dataObject]
    if (!dataObject.length)
      status.value = 'nomore'
    else
      status.value = 'loadmore'
  })
}

const changeTab = (index: number) => {
  currentSubValue.value = tabList.value[index].cid
  list.value = []
  getList()
}

const onreachBottom = () => {
  page.value++
  getList()
}

const hanldeClick = (mediaItem: any) => {
  const {
    name,
    rid,
    label,
    country,
    years,
    tolnum,
    summary,
    score,
  } = mediaItem;
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
    url: `/pages/mediaDetail/index?item=${encodeURIComponent(JSON.stringify(params))}`,
  })
}

const scrollHeight = ref('0')
const setScrollHeight = () => {
  uni.getSystemInfo({
    success: function (res) {
      const query = uni.createSelectorQuery()
      query.select('.scroll-view-box').boundingClientRect()
      query.exec(data => {
        scrollHeight.value = res.windowHeight - data[0].top - 50 + 'px';
      })
    }
  });
}
onMounted(() => {
  setScrollHeight();
  classTopLayerGet().then((res) => {
    const { dataObject } = res
    tabList.value = dataObject
    changeTab(0)
  })
})
</script>

<template>
  <view>
    <SubBar :list="tabList" @change="changeTab" />
    <scroll-view
      scroll-y
      class="scroll-view-box"
      :style="{ height: scrollHeight }"
      @scrolltolower="onreachBottom">
      <MediaItem 
        v-for="mediaItem in list"
        :key="mediaItem.cid"
        :item="mediaItem"
        @click="hanldeClick(mediaItem)"
      />
      <u-loadmore
        icon-type="flower"
        :status="status"
        :load-text="loadText"
      />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>

</style>
