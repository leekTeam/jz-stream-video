<script setup lang="ts">
import { ref } from 'vue'
import Progress from '../progress/index.vue'
import { replaceUrlHost } from '@/utils'
import { downloadFile } from '@/utils/downloadFile'
import { EBOOK_DOWNLOAD_KEY } from '@/constant/storage'
import { resMediaGet } from '@/api/ebook'

const props = defineProps({
  rid: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  showDownload: {
    type: Boolean,
    default: true,
  },
})

const goDetail = () => {
  const {
    name,
    rid,
    poster,
  } = props

  const params = {
    name,
    rid,
    poster,
  }
  uni.navigateTo({
    url: `/pages/ebook/detail?ebookInfo=${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  })
}

const percentage = ref(0)
const downloadEbook = async () => {
  const { rid, name, poster } = props
  uni.showLoading({ title: '加载中', mask: true })
  const data = {
    rid,
    name,
  }
  const postParams = {
    url: poster,
    key: EBOOK_DOWNLOAD_KEY,
    data,
    fileName: 'poster',
  }
  downloadFile(postParams, {
    success: async () => {
      uni.hideLoading()
      try {
        const { dataObject } = await resMediaGet({ rid })
        const downloadurl = dataObject[0].downloadurl

        const ebookParams = {
          url: downloadurl,
          key: EBOOK_DOWNLOAD_KEY,
          data,
          fileName: 'playurl',
        }

        downloadFile(ebookParams, {
          progress: (download: any) => {
            const { downloadedSize, totalSize } = download
            percentage.value = (downloadedSize / totalSize) * 100
          },
        })
      }
      catch (e) {
        uni.showToast({
          title: '获取书籍信息失败',
          icon: 'error',
        })
      }
    },
    fail: () => {
      uni.hideLoading()
    },
  })
}
</script>

<template>
  <view class="ebook-box" @click="goDetail">
    <view class="ebook-box-cover">
      <u-image
        width="100%"
        height="250rpx"
        :src="replaceUrlHost(poster)"
      />
      <view v-if="showDownload">
        <view @click.stop="downloadEbook">
          <u-icon
            v-if="percentage === 0"
            class="ebook-box-cover-down-icon"
            color="#ffffff"
            name="download"
            size="40"
          />
        </view>
        <u-icon
          v-if="percentage === 100"
          class="ebook-box-cover-success-icon"
          color="#42b935"
          name="checkmark-circle-fill"
          size="40"
        />
        <Progress
          v-if="percentage > 0 && percentage < 100"
          class="ebook-box-cover-progress"
          color="#ffffff"
          :percent="percentage"
        />
      </view>
    </view>
    <view class="ebook-box-title">
      <text>{{ name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ebook-box {
  display: inline-block;
  width: calc(100% / 3);
  padding: 0 10rpx;

  &-cover {
    position: relative;
    &-down-icon, &-success-icon {
      position: absolute;
      right: 10rpx;
      bottom: 10rpx;
    }
    &-progress {
      position: absolute;
      right: 10rpx;
      left: 10rpx;
      bottom: 10rpx;
    }
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    height: 80rpx;
    text {
      @include text-multi-ellipsis(2);
    }
  }
}
</style>
