<script setup lang="ts">
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { computed, nextTick, ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/sound'
import { useMusicStore, useThemeStore } from '@/store'
import { replaceUrlHost, timeUnitFormat } from '@/utils'
import { Download, DownloadSound } from '@/utils/download'
import { SOUND_DOWNLOAD_KEY } from '@/constant/storage'

const themeStore = useThemeStore()
const soundInfo = ref({
  name: '',
  rid: '',
  poster: '',
  summary: '',
  label: '',
  years: 0,
  tolnum: 0,
  closable: false,
})
const innerAudioContext = shallowRef<UniApp.InnerAudioContext>()
const soundMediaList = shallowRef<TSoundMedia[]>([])
const activeId = ref<TSoundMedia['id']>()
const activeMediaInfo = computed(() => soundMediaList.value.find(item => item.id === activeId.value) || {} as TSoundMedia)
const playLoading = ref(false)
const isPaused = ref(true)
const playTimeInfo = shallowRef({
  duration: '',
  currentTime: '',
  percent: 0,
})
const currentNum = ref(0)
const percentage = ref(0)
const { pauseLoading } = useMusicStore()

const onPlay = () => {
  nextTick(() => {
    innerAudioContext.value!.src = activeMediaInfo.value.playurl
    innerAudioContext.value!.play()
  })
}

const onPause = () => {
  innerAudioContext.value?.pause()
}

const togglePlay = () => {
  if (isPaused.value)
    onPlay()

  else
    onPause()
}

const downloadTask = shallowRef<DownloadSound>()
const judgeDownloadTask = (rid: string) => {
  const storageInfo = DownloadSound.getStorageInfo(rid)

  if (storageInfo?.episodesList.length) {
    const episodesStorageInfo = storageInfo?.episodesList.find(item => item.id === activeMediaInfo.value.id)
    percentage.value = ((episodesStorageInfo?.currentSize || 0) / (activeMediaInfo.value.size || 0)) * 100
    const download = DownloadSound.getSoundTask(rid)
    if (percentage.value !== 100 && download)
      downloadTask.value = download
    else
      downloadTask.value = undefined
  }
  else {
    downloadTask.value = undefined
  }
}
const onActiveChange = (item: TMovieMedia, index: number) => {
  const { id, rid } = item
  activeId.value = id
  currentNum.value = index
  onPlay()
  judgeDownloadTask(rid)
}

const createAudio = () => {
  innerAudioContext.value = uni.createInnerAudioContext()
  innerAudioContext.value.autoplay = true
  innerAudioContext.value.onError((res) => {
    uni.showToast({
      title: res?.errMsg || '音乐资源错误',
      icon: 'error',
    })
  })
  innerAudioContext.value.onEnded(() => {
    const index = soundMediaList.value.findIndex(item => item.id === activeId.value) + 1
    if (soundMediaList.value[index])
      onActiveChange(soundMediaList.value[index], index)
  })
  innerAudioContext.value.onPlay(() => {
    playLoading.value = false
    isPaused.value = false
  })

  innerAudioContext.value.onWaiting(() => {
    playLoading.value = true
  })

  innerAudioContext.value.onPause(() => {
    isPaused.value = true
  })

  innerAudioContext.value.onTimeUpdate(() => {
    playTimeInfo.value = {
      duration: timeUnitFormat(innerAudioContext.value!.duration),
      currentTime: timeUnitFormat(innerAudioContext.value!.currentTime),
      percent: (innerAudioContext.value!.currentTime / innerAudioContext.value!.duration) * 100 || 0,
    }
  })

  onPlay()
}

const getMediaData = () => {
  uni.showLoading({ title: '加载中', mask: true })
  resMediaGet({ rid: soundInfo.value.rid }).then((res) => {
    const { dataObject } = res
    soundMediaList.value = dataObject.map((item) => {
      return {
        ...item,
        playurl: replaceUrlHost(item.playurl),
      }
    })
    activeId.value = dataObject[0].id
    judgeDownloadTask(soundInfo.value.rid)
    createAudio()
  }).finally(() => {
    uni.hideLoading()
  })
}

const onProgress = (currentSize: number) => {
  percentage.value = currentSize / (activeMediaInfo.value!.size) * 100
}
const coverDownloadTask = shallowRef<Download>()
const handleDownload = () => {
  uni.showLoading({ title: '加载中', mask: true })
  const { poster, rid, closable, ...args } = soundInfo.value

  coverDownloadTask.value = new Download(poster)
  coverDownloadTask.value.on('success', () => {
    downloadTask.value = new DownloadSound({
      ...args,
      rid,
      coverOriginUrl: poster,
      originUrl: activeMediaInfo.value.downloadurl,
      coverUrl: coverDownloadTask.value!.getFilenameUrl(),
      totalSize: activeMediaInfo.value.size,
      currentNum: currentNum.value,
      episodesId: activeMediaInfo.value.id,
    })
    downloadTask.value.on('progress', onProgress)
    downloadTask.value.once('progress', () => {
      uni.hideLoading()
      uni.showToast({
        title: '开始下载',
        position: 'bottom',
      })
    })
  })
  coverDownloadTask.value.on('error', () => {
    uni.showToast({
      title: '下载失败',
      icon: 'error',
    })
  })
  coverDownloadTask.value.start()
}

onReady(() => {
  pauseLoading()
  if (!soundInfo.value.closable) {
    getMediaData()
  }
  else {
    const soundDownloadList = uni.getStorageSync(SOUND_DOWNLOAD_KEY) || []
    const index = soundDownloadList.findIndex((item) => {
      const { episodesList } = item
      return episodesList.some(episodesItem => episodesItem.rid === soundInfo.value.rid)
    })
    soundMediaList.value = soundDownloadList[index].episodesList.reduce((list, episodesItem, index) => {
      const { fileName: playurl, ...args } = episodesItem
      list.push({
        ...args,
        poster: soundDownloadList[index].coverUrl,
        playurl,
      })
      return list
    }, [])
    activeId.value = soundDownloadList[index].episodesList[0].id
    createAudio()
  }
})

onLoad((options = {}) => {
  soundInfo.value = JSON.parse(decodeURIComponent(options.soundInfo))
  uni.setNavigationBarTitle({ title: soundInfo.value.name })
})

onUnload(() => {
  innerAudioContext.value?.destroy()
  downloadTask.value?.off('progress', onProgress)
  coverDownloadTask.value?.destory()
})
</script>

<template>
  <page-meta>
    <navigation-bar
      :background-color="themeStore.primaryColor"
    />
  </page-meta>
  <view class="sound-detail-box" :style="themeStore.themeStyles">
    <u-image
      height="225px"
      :src="replaceUrlHost(soundInfo.poster)"
    />

    <view class="sound-detail-operation">
      <u-icon
        :name="isPaused ? 'play-right' : 'pause'"
        :size="40"
        class="toggle-play-icon"
        @click="togglePlay"
      />
      <view class="time">
        {{ playTimeInfo.currentTime }}
      </view>
      <u-line-progress
        :height="20"
        :active-color="themeStore.primaryColor"
        :percent="playTimeInfo.percent"
        :show-percent="false"
      />
      <view class="time">
        {{ playTimeInfo.duration }}
      </view>
      <view
        v-if="percentage === 0 && !downloadTask && !soundInfo.closable"
        class="down-box"
        @click.stop="handleDownload"
      >
        <u-icon name="download" :size="40" />
        <text>下载</text>
      </view>
      <view v-else-if="percentage > 0 && percentage < 100" class="down-box">
        <u-icon name="download" :size="40" />
        <text>已缓存</text>
      </view>
    </view>
    <view class="detail-box">
      <view class="anthology-btn-box">
        <view
          v-for="(item, index) in soundMediaList"
          :key="item.id"
          class="anthology-btn-box-item"
          :class="{ active: item.id === activeId }"
          size="default"
          @click="onActiveChange(item, index)"
        >
          {{ index + 1 }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.sound-detail-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.sound-detail-operation {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  box-sizing: border-box;
  overflow: hidden;
  .toggle-play-icon {
    color: $u-type-primary
  }

  .u-progress {
    flex: 1;
  }

  .time {
    flex-shrink: 0;
    margin: 0 24rpx;
  }

.down-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text {
    font-size: 24rpx;
  }
}
}
.detail-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.anthology-btn-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid $uni-border-color;
  border-radius: 20rpx 20rpx 0 0 ;
  overflow: auto;

  &-item {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    &:first-child {
      border-bottom: 1px solid $uni-border-color;
    }
    &:not(:last-child) {
      border-bottom: 1px solid $uni-border-color;
    }
  }
}

.active {
  color: $u-type-primary;
}
</style>
