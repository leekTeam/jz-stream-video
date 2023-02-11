<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { onHide } from '@dcloudio/uni-app'
import Loading from '../Loading/index.vue'
import Progress from '../progress/index.vue'
import { useMusicStore } from '@/store'
import { DownloadMusic } from '@/utils/download'
import { CLEAR_STORAGE } from '@/constant/event'

const props = defineProps({
  rid: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  mainauthor: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    default: '0',
  },
  closable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])
const { playMusic, activeMusicInfo, getMediaInfo, pauseLoading } = useMusicStore()

const downloadTask = shallowRef<DownloadMusic>()
const percentage = ref(0)
const totalSize = ref(0)

const onProgress = async (currentSize: number) => {
  percentage.value = currentSize / (totalSize.value) * 100
}

const onDelete = () => {
  uni.showLoading({ title: '删除中', mask: true })
  DownloadMusic.clearStorage(props.rid).finally(() => {
    emit('close')
    uni.$emit(CLEAR_STORAGE)
    uni.hideLoading()
  })
}

const downloadMusic = async () => {
  if (!downloadTask.value) {
    const { rid, name, mainauthor, score } = props
    getMediaInfo(rid).then((res) => {
      const { downloadurl, size } = res
      totalSize.value = size
      downloadTask.value = new DownloadMusic({
        rid,
        originUrl: downloadurl,
        name,
        score,
        mainauthor,
        totalSize: size,
      })

      downloadTask.value.on('progress', onProgress)
    })
  }
}

onMounted(() => {
  pauseLoading()
  const storageInfo = DownloadMusic.getStorageInfo(props.rid)
  if (storageInfo) {
    totalSize.value = storageInfo.totalSize
    onProgress(storageInfo.currentSize || 0)
    const download = DownloadMusic.getMusicTask(props.rid)

    if (percentage.value !== 100 && download) {
      downloadTask.value = download
      downloadTask.value.on('progress', onProgress)
    }
  }
})

onHide(() => {
  pauseLoading()
})

onUnmounted(() => {
  downloadTask.value?.off('progress', onProgress)
  pauseLoading()
})
</script>

<template>
  <view class="music-box" @click="playMusic(rid)">
    <view class="music-box-index" :class="{ active: activeMusicInfo.rid === rid }">
      {{ index }}
    </view>
    <view class="music-box-content">
      <view class="music-box-content-title" :class="{ active: activeMusicInfo.rid === rid }">
        {{ name }}
      </view>
      <view class="music-box-content-singer">
        {{ mainauthor }}
      </view>
      <view class="music-box-content-score">
        <u-rate
          class="music-box-content-score-rate"
          :current="(Number(score) / 2).toFixed(1)"
          active-color="#fe9a00"
          disabled
          size="20"
        />
        <view>{{ (Number(score) / 2).toFixed(1) }}</view>
      </view>
    </view>
    <view class="music-box-icon">
      <Loading
        v-if="activeMusicInfo.rid === rid"
        class="music-box-icon-Loading"
        :paused="activeMusicInfo.paused"
      />
      <view>
        <view v-if="closable" @click.stop="onDelete">
          <u-icon
            color="red"
            name="close-circle-fill"
            size="40"
          />
        </view>
        <view v-else-if="percentage === 0 && !downloadTask" @click.stop="downloadMusic">
          <u-icon
            name="download"
            size="40"
          />
        </view>
        <u-icon
          v-else-if="percentage === 100"
          color="#42b935"
          name="checkmark-circle-fill"
          size="40"
        />
        <Progress
          v-else
          :percent="percentage"
          placement="bottom"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.music-box {
  display: flex;
  align-items: center;
  padding: 20rpx;
  box-sizing: border-box;
  &:first-child {
    border-bottom: 1px solid $uni-border-color;
  }
  &:not(:last-child) {
    border-bottom: 1px solid $uni-border-color;
  }

  &-index {
    width: 50rpx;
    margin-right: 10rpx;
    text-align: center;
    @include ellipsis;
  }

  &-content {
    flex: 1;
    &-singer {
      color: $uni-text-color-placeholder;
    }
    &-score {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: $uni-text-color-placeholder;
      &-rate {
        margin-right: 20rpx;
      }
    }
  }

  &-icon {
    display: flex;
    &-Loading {
      margin-right: 10rpx;
    }
  }
}
.active {
  color: #fe9a00;
}
</style>
