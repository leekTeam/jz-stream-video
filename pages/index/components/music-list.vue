<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ClassTopList from './class-top-list.vue'
import ScrollList from './scroll-list.vue'
import MusicBox from '@/components/music/music-box.vue'
import { classTopLayerGet, resGet, resMediaGet } from '@/api/music'

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

const active = ref('');
const pause = ref(true)
const innerAudioContext = uni.createInnerAudioContext();
const playMusic = (url: string) => {
  innerAudioContext.autoplay = true;
  innerAudioContext.src = url;
  innerAudioContext.onError((res) => {
    const { errMsg } = res;
    uni.showToast({
      title: errMsg || '音乐资源错误',
      icon: 'error',
    })
  });
}
const getMusicData = (rid: string) => {
  resMediaGet({ rid }).then((res) => {
    const { dataObject } = res;
    const playurl = dataObject[0].playurl
    playMusic(playurl);
  })
}
const hanldeClick = (musicItem: any) => {
  const { rid } = musicItem;

  if(active.value !== rid){
    pause.value = true;
    getMusicData(rid);
  }
  if(pause.value){
    innerAudioContext.play();
  }else{
    innerAudioContext.pause();
  }

  pause.value = !pause.value
  active.value = rid
}


</script>

<template>
  <ScrollList ref="scrollRef" :is-active="isActive && !!currentSubValue" :up-callback="upCallback">
    <template #header>
      <ClassTopList v-model="currentSubValue" :options="tabList" @change="changeTab" />
    </template>
    <view class="music-list" v-if="list.length">
      <MusicBox
        v-for="(musicItem, index) in list"
        :key="musicItem.rid"
        :name="musicItem.name"
        :number="index + 1"
        :mainauthor="musicItem.mainauthor"
        :score="musicItem.score / 2"
        :isActive="active === musicItem.rid"
        :pause="pause"
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
