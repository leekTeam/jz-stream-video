<script setup lang="ts">
import { ref } from 'vue'
import MediaItem from './MediaItem'
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },
  list: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: 'loadmore',
  },
})

const emits = defineEmits(['onreachBottom', 'change'])
const swiperCurrent = ref(0)

const onreachBottom = () => {
  emits('onreachBottom')
}

const changeSwiper = ({ detail }) => {
  const { current } = detail
  emits('change', current)
}

const loadText = ref({
  loadmore: '轻轻上拉',
  loading: '努力加载中',
  nomore: '实在没有了',
})

const hanldeClick = (mediaItem) => {
  console.log('mediaItem', mediaItem)
  uni.navigateTo({
    url: `/pages/mediaDetail/index?title=${mediaItem.name}&rid=${mediaItem.rid}&label=${mediaItem.label}&country=${mediaItem.country}&years=${mediaItem.years}&tolnum=${mediaItem.tolnum}&summary=${mediaItem.summary}&score=${mediaItem.score}`,
  })
}
</script>

<template>
  <swiper
    class="swiper-box"
    :current="swiperCurrent"
    @change="changeSwiper"
  >
    <swiper-item
      v-for="(item, index) in tabs"
      :key="index"
      class="swiper-item"
    >
      <scroll-view
        scroll-y
        style="height: 100%;width: 100%;"
        @scrolltolower="onreachBottom"
      >
        <MediaItem
          v-for="mediaItem in list"
          :key="mediaItem.cid"
          :item="mediaItem"
          @click="hanldeClick(mediaItem)"
        />
        <u-loadmore :status="status" icon-type="flower" :load-text="loadText" />
      </scroll-view>
    </swiper-item>
  </swiper>
</template>

<style lang="scss" scoped>
	.swiper-box {
		height: calc( 100vh - 44px - 80px - 80px);
	}
</style>
