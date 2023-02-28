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

  const innerAudioContext = shallowRef<UniApp.InnerAudioContext>()

  const getStoragePlayUrl = (rid: string) => {
    const storageList: TMusicDownloadStorage[] = uni.getStorageSync(MUSIC_DOWNLOAD_KEY) || []
    return storageList.find(item => item.rid === rid)?.fileName
  }

  const playMusic = (rid: string) => {
    if (!rid) {
      innerAudioContext.value?.destroy()
      innerAudioContext.value = undefined
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
    if (activeMusicInfo.value.rid !== rid || activeMusicInfo.value.paused) {
      if (!innerAudioContext.value) {
        innerAudioContext.value = uni.createInnerAudioContext()
        innerAudioContext.value.autoplay = true
        innerAudioContext.value.onError((res) => {
          uni.showToast({
            title: res?.errMsg || '音乐资源错误',
            icon: 'error',
          })
          activeMusicInfo.value.paused = true
        })
      }
      innerAudioContext.value.src = musicRidMediaInfoMap.value[rid].downloadurl
      innerAudioContext.value.play()
      activeMusicInfo.value.paused = false
      activeMusicInfo.value.rid = rid
    }
    else {
      innerAudioContext.value!.pause()
      activeMusicInfo.value.paused = true
      activeMusicInfo.value.rid = rid
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

  const pauseLoading = () => {
    activeMusicInfo.value = {
      rid: '',
      paused: true,
      downloadurl: '',
    }
    innerAudioContext.value?.destroy()
    innerAudioContext.value = undefined
  }

  return {
    activeMusicInfo,

    playMusic,

    getMediaInfo,

    pauseLoading,
  }
})
