<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref, shallowRef } from 'vue'
import { resMediaGet } from '@/api/movie'
import { useThemeStore } from '@/store'
import { replaceUrlHost } from '@/utils'

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
})

const movieMediaList = shallowRef<TMovieMedia[]>([])
const activeId = ref<TMovieMedia['id']>()

const activeMediaInfo = computed(() => movieMediaList.value.find(item => item.id === activeId.value) || {} as TMovieMedia)

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
  }).finally(() => {
    uni.hideLoading()
  })
}

const onActiveChange = (item: TMovieMedia) => {
  activeId.value = item.id
}

const onNext = () => {
  const index = movieMediaList.value.findIndex(item => item.id === activeId.value) + 1
  if (movieMediaList.value[index])
    onActiveChange(movieMediaList.value[index])
}

onLoad((options = {}) => {
  movieInfo.value = JSON.parse(decodeURIComponent(options.movieInfo))
  uni.setNavigationBarTitle({ title: movieInfo.value.name })
  getMediaData()
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
        <view class="down-box">
          <u-icon name="download" size="40" />
          <text>下载</text>
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
          @click="onActiveChange(item)"
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
      margin-top: 10rpx;
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
