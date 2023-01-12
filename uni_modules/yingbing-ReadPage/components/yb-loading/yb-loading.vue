<template>
	<view class="yb-flex" :id="customIdSync" :class="customClassSync" :style="customStyleSync">
		<view class="yb-loading yb-flex yb-align-center">
			<loading1 v-if="type == 1" :visible="visible" :size="size" :color="color"></loading1>
			<loading2 v-else-if="type == 2 || type == 3" :type="type" :visible="visible" :size="size" :color="color"></loading2>
			<text class="loading-text" :style="{color: color}" v-if="title && visible">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import Loading1 from './modules/loading_1.vue'
	import Loading2 from './modules/loading_2.vue'
	import ComponentMixin from '../../js_sdk/componentMixin.js'
	export default {
		mixins: [ComponentMixin],
		components: {
			Loading1,
			Loading2
		},
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			size: {
				type: [Number, String],
				default: 40
			},
			color: {
				type: String,
				default: '#333333'
			},
			title: {
				type: String,
				default: ''
			},
			type: {
				type: [String, Number],
				default: 1
			}
		}
	}
</script>

<style scoped>
	@import url(../../css/common.css);
	.yb-loading .loading-text {
		margin-top: 15rpx;
		font-size: 28rpx;
	}
</style>
