<script setup lang="ts">
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { computed, ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/movie'
import { useThemeStore } from '@/store'
import { replaceUrlHost } from '@/utils'
import { Download, DownloadMovie } from '@/utils/download'
import { MOVIE_DOWNLOAD_KEY } from '@/constant/storage'

const themeStore = useThemeStore()

const movieInfo = ref({
  name: '',
  rid: '',
  label: '',
  country: '',
  years: '',
  score: '',
  tolnum: 1,
  summary: '',
  poster: '',
  isOnline: true,
})

const movieMediaList = shallowRef<TMovieMedia[]>([])
const activeId = ref<TMovieMedia['id']>()
const currentNum = ref(0)
const percentage = ref(20)

const activeMediaInfo = computed(() => movieMediaList.value.find(item => item.id === activeId.value) || {} as TMovieMedia)
const downloadTask = shallowRef<DownloadMovie>()
const judgeDownloadTask = (rid: string) => {
  const storageInfo = DownloadMovie.getStorageInfo(rid)
  if (storageInfo?.episodesList.length) {
    const episodesStorageInfo = storageInfo?.episodesList.find(item => item.id === activeMediaInfo.value.id)
    percentage.value = ((episodesStorageInfo?.currentSize || 0) / (activeMediaInfo.value.size || 0)) * 100
    const download = DownloadMovie.getMovieTask(rid)
    if (percentage.value !== 100 && download)
      downloadTask.value = download
    else
      downloadTask.value = undefined
  }
  else {
    downloadTask.value = undefined
  }
}
const getMediaData = () => {
  uni.showLoading({ title: '加载中', mask: true })
  resMediaGet({ rid: movieInfo.value.rid }).then((res) => {
    const { dataObject } = res
    movieMediaList.value = dataObject.map((item) => {
      return {
        ...item,
        playurl: replaceUrlHost(item.playurl),
      }
    })
    activeId.value = dataObject[0].id
    judgeDownloadTask(movieInfo.value.rid)
  }).finally(() => {
    uni.hideLoading()
  })
}

const onActiveChange = (item: TMovieMedia, index: number) => {
  const { rid, id } = item
  activeId.value = id
  currentNum.value = index
  judgeDownloadTask(rid)
}

const onNext = () => {
  const index = movieMediaList.value.findIndex(item => item.id === activeId.value) + 1
  if (movieMediaList.value[index])
    onActiveChange(movieMediaList.value[index], index)
}

const onProgress = (currentSize: number) => {
  percentage.value = currentSize / (activeMediaInfo.value!.size) * 100
}

const coverDownloadTask = shallowRef<Download>()
const handleDownload = () => {
  uni.showLoading({ title: '加载中', mask: true })
  const { poster, rid, ...args } = movieInfo.value
  coverDownloadTask.value = new Download(poster)
  coverDownloadTask.value.on('success', () => {
    downloadTask.value = new DownloadMovie({
      ...args,
      rid,
      coverOriginUrl: poster,
      originUrl: activeMediaInfo.value.downloadurl,
      coverUrl: coverDownloadTask.value!.task.filename!,
      totalSize: activeMediaInfo.value.size,
      currentNum: currentNum.value,
      episodesId: activeMediaInfo.value.id,
    })
    downloadTask.value.on('progress', onProgress)
    downloadTask.value.once('progress', () => {
      uni.hideLoading()
      uni.navigateTo({
        url: '/pages/download/index',
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
  if (movieInfo.value.isOnline) {
    getMediaData()
  }
  else {
    const movieDownloadList = uni.getStorageSync(MOVIE_DOWNLOAD_KEY) || []
    const index = movieDownloadList.findIndex((item) => {
      const { episodesList } = item
      return episodesList.some(episodesItem => episodesItem.id === activeMediaInfo.value.id)
    })
    let episodesIndex = 0
    movieMediaList.value = movieDownloadList[index].episodesList.reduce((list, episodesItem, index) => {
      const { fileName: playurl, ...args } = episodesItem
      if (episodesItem.id === activeMediaInfo.value.id)
        episodesIndex = index

      list.push({
        ...args,
        poster: movieDownloadList[index].coverUrl,
        playurl,
      })
      return list
    }, [])
    activeId.value = movieDownloadList[index].episodesList[episodesIndex].id
  }
})

onLoad((options = {}) => {
  movieInfo.value = JSON.parse(decodeURIComponent(options.movieInfo))
  uni.setNavigationBarTitle({ title: movieInfo.value.name })
})

onUnload(() => {
  downloadTask.value?.off('progress', onProgress)
  coverDownloadTask.value?.destory()
})
</script>

<template>
  <page-meta>
    <navigation-bar :background-color="themeStore.primaryColor" />
  </page-meta>
  <view class="media-detail-box" :style="themeStore.themeStyles">
    <video
      class="video-box"
      enable-play-gesture
      :poster="replaceUrlHost(movieInfo.poster)"
      :src="activeMediaInfo.playurl"
      @ended="onNext"
    />
    <view class="detail-box">
      <view class="title-box">
        <text>{{ activeMediaInfo.name }}</text>
        <view
          v-if="percentage === 0 && !downloadTask"
          class="down-box"
          @click.stop="handleDownload"
        >
          <u-icon name="download" size="40" />
          <text>下载</text>
        </view>
        <view v-else-if="percentage > 0 && percentage < 100" class="down-box">
          <u-icon name="clock-fill" size="40" />
          <text>正在下载</text>
        </view>
      </view>
      <view class="sub-title-box">
        <text>{{ movieInfo.label }}</text>
        <text>{{ movieInfo.country }}</text>
        <text>{{ movieInfo.years }}</text>
      </view>
      <view class="score-box">
        <u-rate
          class="rate"
          :current="(Number(movieInfo.score) / 2).toFixed(1)"
          active-color="#fe9a00"
          disabled
          size="20"
        />
        <text>{{ (Number(movieInfo.score) / 2).toFixed(1) }}</text>
      </view>
      <view class="title">
        选集
      </view>
      <view class="anthology-btn-box">
        <u-button
          v-for="(item, index) in movieMediaList"
          :key="item.id" size="default"
          :type="item.id === activeId ? 'primary' : 'default'"
          @click="onActiveChange(item, index)"
        >
          {{ index + 1 }}
        </u-button>
      </view>
      <view class="title">
        介绍
      </view>
      <view class="summary-box">
        {{ movieInfo.summary }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.video-box {
  width: 100%;
}

.detail-box {
  padding: 0 24rpx;
  box-sizing: border-box;
}

.title-box {
  display: flex;
  justify-content: space-between;

  .down-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text {
      margin-top: 5rpx;
      font-size: 12px;
    }
  }
}

.sub-title-box {
  font-size: 14px;
  color: $uni-text-color-placeholder;
  margin-bottom: 20rpx;

  text {
    margin-right: 20rpx;
  }
}

.score-box {
  margin-bottom: 20rpx;

  .rate {
    :deep(.u-icon:first-child) {
      padding: 0 3px 0 0 !important;
    }
  }

  text {
    font-size: 12px;
    color: $uni-text-color-placeholder;
  }
}

.anthology-btn-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;

  .u-btn {
    margin: 0;
    margin-bottom: 24rpx;

    &+.u-btn {
      margin-left: 24rpx;
    }
  }
}

.title {
  font-weight: 700;
  margin-bottom: 20rpx;
}

.summary-box {
  color: $uni-text-color-placeholder;
}
</style>
