<script setup lang="ts">
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { computed, nextTick, ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/sound'
import { useThemeStore } from '@/store'
import { replaceUrlHost, timeUnitFormat } from '@/utils'

const themeStore = useThemeStore()
const soundInfo = ref({
  name: '',
  rid: '',
  poster: '',
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

const onActiveChange = (item: TMovieMedia) => {
  activeId.value = item.id
  onPlay()
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
      onActiveChange(soundMediaList.value[index])
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
    createAudio()
  }).finally(() => {
    uni.hideLoading()
  })
}

onLoad((options = {}) => {
  soundInfo.value = JSON.parse(decodeURIComponent(options.soundInfo))
  uni.setNavigationBarTitle({ title: soundInfo.value.name })
  getMediaData()
})

onUnload(() => {
  innerAudioContext.value?.destroy()
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
      <view class="down-box">
        <u-icon name="download" :size="40" />
        <text>下载</text>
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
          @click="onActiveChange(item)"
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
  align-items: flex-end;
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
