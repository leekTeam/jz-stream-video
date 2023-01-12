<template>
	<view class="yb-loadmore yb-flex yb-align-center yb-justify-center"
	:class="{
		'yb-row': options.row
	}"
	@tap="onTap" v-if="options.show">
		<view class="yb-flex" style="height: 20rpx;"></view>
		<view class="yb-flex yb-align-center yb-justify-center" :style="{'margin-left': options.row ? '-70rpx' : 0}">
			<view class="yb-flex indicator-icon yb-align-center yb-justify-center">
				<template v-if="status == ''">
					<slot name="loadmore-symbol">
						<slot name="loadmore-symbol">
							<yb-icon
							name="arrow-up"
							:size="50"
							:color="options.color"></yb-icon>
						</slot>
					</slot>
				</template>
				<template v-if="status == 'loading'">
					<slot name="loadmore-loading">
						<yb-loading :visible="status == 'loading'" :color="options.color"></yb-loading>
					</slot>
				</template>
				<template v-if="status == 'fail'">
					<slot name="loadmore-fail">
						<yb-icon
						name="fork-circle"
						:size="50"
						:color="options.color"></yb-icon>
					</slot>
				</template>
				<template v-if="status == 'end' || status == 'success'">
					<slot name="loadmore-end">
						<yb-icon
						name="hook-circle"
						:size="50"
						:color="options.color"></yb-icon>
					</slot>
				</template>
			</view>
		</view>
		<view class="yb-flex indicator-text yb-align-center">
			<text class="refresh-text" :style="{color: options.color}">{{refreshText}}</text>
		</view>
		<view class="yb-flex" style="height: 20rpx;"></view>
	</view>
</template>

<script>
	import ComponentMixin from '../../../../js_sdk/componentMixin.js'
	export default {
		mixins: [ComponentMixin],
		props: {
			options: {
				type: Object,
				default () {
					return new Object
				}
			},
			status: {
				type: String,
				default: ''
			}
		},
		computed: {
			refreshText () {
				return this.status == 'loading' ? this.options.refreshingText : this.status == 'success' ? this.options.successText : this.status == 'fail' ? this.options.failText : this.status == 'end' ? this.options.endText : this.options.defaultText
			}
		},
		methods: {
			onTap () {
				if ( this.status == 'fail' ) {
					this.$emit('reload')
				}
			}
		}
	}
</script>

<style scoped>
	.yb-loadmore .indicator-icon {
		width: 70rpx;
		height: 70rpx;
	}
	.yb-loadmore .refresh-text {
		text-align: center;
		font-size: 24rpx;
	}
	.yb-loadmore .indicator-symbol {
		transition: transform .1s;
	}
	.yb-loadmore .refresh-time {
		font-size: 23rpx;
	}
</style>