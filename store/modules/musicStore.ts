import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/music'
import { MUSIC_DOWNLOAD_KEY } from '@/constant/storage'

export const useMusicStore = defineStore('musicStore', () => {
  const activeMusicInfo = ref({
    rid: '',
    paused: true,
    downloadurl: '',
  })

  const musicRidMediaInfoMap = ref<Record<string, TMusicMedia>>({})
  const musicRidPlayUrlMap = ref<Record<string, string>>({})

  const backgroundAudioManager = shallowRef<UniApp.BackgroundAudioManager>()

  const getStoragePlayUrl = (rid: string) => {
    const storageList: TMusicDownloadStorage[] = uni.getStorageSync(MUSIC_DOWNLOAD_KEY) || []
    return storageList.find(item => item.rid === rid)?.fileName
  }

  const pauseLoading = () => {
    activeMusicInfo.value.rid = ''
    activeMusicInfo.value.paused = true
    activeMusicInfo.value.downloadurl = ''
    if (backgroundAudioManager.value)
      backgroundAudioManager.value.src = ''
  }

  const playMusic = (rid: string) => {
    if (!rid) {
      backgroundAudioManager.value?.pause()
      backgroundAudioManager.value = undefined
      activeMusicInfo.value.paused = true
      activeMusicInfo.value.rid = ''
      return
    }
    if (!musicRidMediaInfoMap.value[rid]) {
      const filename = getStoragePlayUrl(rid)
      if (filename) {
        musicRidPlayUrlMap.value[rid] = filename
        playMusic(rid)
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getMusicData(rid)
      return
    }

    // 暂停之后开始播放
    if (activeMusicInfo.value.paused && activeMusicInfo.value.rid && backgroundAudioManager.value) {
      activeMusicInfo.value.paused = false
      backgroundAudioManager.value.play()
    }
    else if (activeMusicInfo.value.rid !== rid) {
      // 第一次播放
      if (!backgroundAudioManager.value) {
        backgroundAudioManager.value = uni.getBackgroundAudioManager()
        backgroundAudioManager.value.onError((res) => {
          uni.showToast({
            title: res?.errMsg || '音乐资源错误',
            icon: 'error',
          })
          activeMusicInfo.value.paused = true
        })
        backgroundAudioManager.value.onPause(() => {
          activeMusicInfo.value.paused = true
        })
        // TODO 目前无法确定由系统关闭音乐的事件是不是onStop
        backgroundAudioManager.value.onStop(() => {
          pauseLoading()
        })

        backgroundAudioManager.value.onPrev(() => {
          // TODO 用户点击上一首
        })

        backgroundAudioManager.value.onNext(() => {
          // TODO 用户点击下一首
        })
        backgroundAudioManager.value.onEnded(() => {
          // TODO 当前音乐播放到结束
        })
      }

      backgroundAudioManager.value.src = musicRidMediaInfoMap.value[rid].downloadurl
      backgroundAudioManager.value.title = musicRidMediaInfoMap.value[rid].details
      backgroundAudioManager.value.play()
      activeMusicInfo.value.paused = false
      activeMusicInfo.value.rid = rid
    }
    else {
      // 播放中之后暂停
      backgroundAudioManager.value!.pause()
      activeMusicInfo.value.paused = true
    }
  }

  const getMediaInfo = async (rid: string) => {
    if (musicRidMediaInfoMap.value[rid])
      return musicRidMediaInfoMap.value[rid]

    uni.showLoading({ title: '加载中', mask: true })
    try {
      const res = await resMediaGet({ rid })
      const { dataObject } = res
      musicRidMediaInfoMap.value[rid] = dataObject[0]
      return musicRidMediaInfoMap.value[rid]
    }
    catch (err) {
      return Promise.reject(err)
    }
    finally {
      uni.hideLoading()
    }
  }

  const getMusicData = async (rid: string) => {
    await getMediaInfo(rid)
    activeMusicInfo.value.downloadurl = musicRidMediaInfoMap.value[rid].downloadurl
    playMusic(rid)
  }

  return {
    activeMusicInfo,

    playMusic,

    getMediaInfo,

    pauseLoading,
  }
})
