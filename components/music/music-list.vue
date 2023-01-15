<script lang="ts" setup>
import type { PropType } from 'vue'
import MusicBox from './music-box.vue'
import { MUSIC_DOWNLOAD_KEY } from '@/constant/storage'
import { useShowDownload } from '@/hooks/showDownload'

const props = defineProps({
  data: {
    type: Array as PropType<TMusic[]>,
    default: () => [],
  },
})

const { getShowDownload } = useShowDownload(MUSIC_DOWNLOAD_KEY, props.data)

</script>

<template>
  <view v-if="data.length">
    <MusicBox
      v-bind="$attrs"
      v-for="(musicItem, index) in data"
      :key="musicItem.rid"
      :rid="musicItem.rid"
      :name="musicItem.name"
      :index="index + 1"
      :mainauthor="musicItem.mainauthor"
      :score="musicItem.score"
      :showDownload="getShowDownload(musicItem.rid)"
    />
  </view>
</template>

<style lang="scss" scoped></style>
