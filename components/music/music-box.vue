<script setup lang="ts">
defineProps({
  number: {
    type: Number,
    default: 0,
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
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <view class="music-box">
    <view class="music-box-number" :class="{'active': isActive}">{{ number }}</view>
    <view class="music-box-content">
      <view class="music-box-content-title" :class="{'active': isActive}">{{ name }}</view>
      <view class="music-box-content-singer">{{ mainauthor }}</view>
      <view class="music-box-content-score">
        <u-rate
          class="music-box-content-score-rate"
          :current="score"
          active-color="#fe9a00"
          disabled
          size="20"
        />
        <view>{{ score }}</view>
      </view>

    </view>
    <view class="music-box-icon">
      <u-icon
        class="music-box-icon-download"
        name="checkmark-circle-fill"
        size="40"
      />
      <u-icon
        name="download"
        size="40"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.music-box {
  display: flex;
  align-items: center;
  padding: 20rpx;
  &:first-child {
    border-bottom: 1px solid $uni-border-color;
  }
  &:not(:last-child) {
    border-bottom: 1px solid $uni-border-color;
  }

  &-number {
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
    &-download {
      margin-right: 10rpx;
    }
  }
}
.active {
  color: #fe9a00;
}
</style>
