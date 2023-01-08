<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <view class="media-item-box">
    <u-image width="240rpx" height="100%" class="img-box" :src="item.poster" />
    <view class="right-box">
      <view class="title">
        {{ item.name }}
      </view>
      <view class="introduce-box">
        {{ item.summary }}
      </view>
      <view class="bottom-box">
        <view>{{ item.label }}</view>
        <view>{{ item.years }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.media-item-box {
	height: 250rpx;
	padding: 20rpx;
	margin: 20rpx 10rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid $uni-border-color;
	border-radius: 15rpx;
	.img-box {
		margin-right: 20rpx;
	}
	.right-box {
		display: flex;
		flex: 1;
		flex-shrink: 0;
		align-self: flex-start;
		flex-direction: column;
		.title {
			font-weight: 700;
		}
		.introduce-box {
			display: -webkit-box;
			-webkit-line-clamp: 3;
			box-orient: vertical;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
		.bottom-box {
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
