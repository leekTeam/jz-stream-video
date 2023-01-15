import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/music'
import { replaceUrlHost } from '@/utils'
import { MUSIC_DOWNLOAD_KEY } from '@/constant/storage';

export const useMusicStore = defineStore('musicStore', () => {
  const listData = ref(uni.getStorageSync(MUSIC_DOWNLOAD_KEY) || []);
  const activeMusicInfo = ref({
    rid: '',
    paused: true,
    downloadurl: '',
  })

  const musicRidPlayUrlMap = ref<Record<string, string>>({})

  const innerAudioContext = shallowRef<UniApp.InnerAudioContext>()

  const playMusic = (rid: string) => {
    if (!rid) {
      innerAudioContext.value?.destroy()
      innerAudioContext.value = undefined
      activeMusicInfo.value.paused = true
      activeMusicInfo.value.rid = ''
      return
    }
    if (!musicRidPlayUrlMap.value[rid]) {
      const filename = listData.value.find(item => item.rid === rid)?.filename
      if(filename){
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
      innerAudioContext.value.src = musicRidPlayUrlMap.value[rid]
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

  const getMusicData = (rid: string) => {
    uni.showLoading({ title: '加载中', mask: true })
    resMediaGet({ rid }).then((res) => {
      const { dataObject } = res
      const { playurl, downloadurl } = dataObject[0]
      musicRidPlayUrlMap.value[rid] = replaceUrlHost(playurl)
      activeMusicInfo.value.downloadurl = downloadurl
      playMusic(rid)
    }).finally(() => {
      uni.hideLoading()
    })
  }

  return {
    activeMusicInfo,

    playMusic,
  }
})
