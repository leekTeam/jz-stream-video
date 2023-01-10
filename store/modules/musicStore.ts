import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/music'
import { replaceUrlHost } from '@/utils'

export const useMusicStore = defineStore('musicStore', () => {
  const activeMusicInfo = ref({
    rid: '',
    paused: true,
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
    uni.showLoading({})
    resMediaGet({ rid }).then((res) => {
      const { dataObject } = res
      const playurl = dataObject[0].playurl
      musicRidPlayUrlMap.value[rid] = replaceUrlHost(playurl)
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
