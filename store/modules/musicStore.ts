import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { classTopLayerGet, resGet, resMediaGet } from '@/api/music'
import { MUSIC_DOWNLOAD_KEY } from '@/constant/storage'

export const useMusicStore = defineStore('musicStore', () => {
  const scrollRef = ref()

  const activeMusicInfo = ref({
    rid: '',
    paused: true,
    downloadurl: '',
  })

  const musicRidMediaInfoMap = ref<Record<string, TMusicMedia>>({})
  const musicRidPlayUrlMap = ref<Record<string, string>>({})

  const backgroundAudioManager = shallowRef<UniApp.BackgroundAudioManager>()

  const classifyList = ref<TMusicTopClass[]>([])
  const activeClassifyCid = ref('')
  const listData = ref<TMusic[]>([])
  const needPlayNext = ref(false)

  const getClassifyList = () => {
    uni.showLoading({ title: '加载中', mask: true })
    classTopLayerGet().then((res) => {
      const { dataObject } = res
      classifyList.value = dataObject
      activeClassifyCid.value = dataObject[0].cid
    }).finally(() => {
      uni.hideLoading()
    })
  }

  const onNext = () => {
    const index = listData.value.findIndex(item => item.rid === activeMusicInfo.value.rid) + 1
    const item = listData.value[index]
    if (item) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      playMusic(item.rid)
    }
    else {
      needPlayNext.value = true
      scrollRef.value.triggerUpScroll()
    }
  }

  const onPrev = () => {
    const index = listData.value.findIndex(item => item.rid === activeMusicInfo.value.rid) - 1
    const item = listData.value[index]
    if (item) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      playMusic(item.rid)
    }
  }

  const upCallback = (mescroll: any) => {
    resGet({
      cid: activeClassifyCid.value,
      // page  从0开始
      page: mescroll.num - 1,
      size: mescroll.size,
    })
      .then((res) => {
        const { dataObject } = res
        const { content, last } = dataObject
        mescroll.endSuccess(content.length, !last)
        if (mescroll.num === 1)
          listData.value = content
        else listData.value = [...listData.value, ...content]

        if (needPlayNext.value)
          onNext()

        needPlayNext.value = false
      })
      .catch(() => {
        mescroll.endErr()
      })
  }

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

        backgroundAudioManager.value.onStop(() => {
          pauseLoading()
        })

        backgroundAudioManager.value.onPrev(() => {
          onPrev()
        })

        backgroundAudioManager.value.onNext(() => {
          onNext()
        })
        backgroundAudioManager.value.onEnded(() => {
          onNext()
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
    listData,
    scrollRef,
    classifyList,
    activeMusicInfo,
    activeClassifyCid,

    playMusic,

    getMediaInfo,

    pauseLoading,

    getClassifyList,

    upCallback,
  }
})
