<template>
	<view class="yb-list yb-flex" :id="customIdSync" :class="rootClass" :style="customStyleSync">
		<!-- #ifdef APP-VUE || H5 || MP-WEIXIN || MP-QQ -->
		<view class="yb-refresh yb-flex yb-flex-1"
		:prop="pulldownProp" :change:prop="pulldownwxs.propWatcher"
		@touchstart="pulldownwxs.touchstart"
		@touchmove="pulldownwxs.touchmove"
		@touchend="pulldownwxs.touchend">
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view class="yb-refresh yb-flex yb-flex-1" ref="ybRefresh">
		<!-- #endif -->
		
			<!-- #ifdef APP-VUE || H5 || MP-WEIXIN || MP-QQ -->
			<view ref="ybListPulldown" class="yb-list-pulldown yb-flex">
				<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
					<template #pulldown-symbol>
						<slot name="pulldown-symbol"></slot>
					</template>
					<template #pulldown-loading>
						<slot name="pulldown-loading"></slot>
					</template>
					<template #pulldown-success>
						<slot name="pulldown-success"></slot>
					</template>
					<template #pulldown-fail>
						<slot name="pulldown-fail"></slot>
					</template>
					<template #pulldown-end>
						<slot name="pulldown-end"></slot>
					</template>
				</list-pulldown>
			</view>
			<!-- #endif -->
			
			<template v-if="typeSync == 'list'">
				<!-- #ifdef APP-NVUE -->
				<list
				:render-whole="true"
				:bounce="bounce"
				:isSwiperList="isSwiperList"
				:fixFreezing="fixFreezing"
				:offsetAccuracy="offsetAccuracy"
				@[scrollEvent]="onScroll"
				@loadmore="onScrolltolower"
				:scrollable="scrollable"
				:show-scrollbar="showScrollbar"
				ref="ybPulldownScroller"
				class="yb-pulldown-scroller">
					<template v-if="pulldownOptionsSync.show">
						<refresh :display="display" @pullingdown="pullingdown($event.pullingDistance)" @refresh="refresh">
							<view class="yb-flex" style="height: 30rpx;"></view>
							<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
								<template #pulldown-symbol>
									<slot name="pulldown-symbol"></slot>
								</template>
								<template #pulldown-loading>
									<slot name="pulldown-loading"></slot>
								</template>
								<template #pulldown-success>
									<slot name="pulldown-success"></slot>
								</template>
								<template #pulldown-fail>
									<slot name="pulldown-fail"></slot>
								</template>
								<template #pulldown-end>
									<slot name="pulldown-end"></slot>
								</template>
							</list-pulldown>
							<view class="yb-flex" style="height: 20rpx;"></view>
						</refresh>
					</template>
					<cell>
						<view class="yb-flex" style="height: 0.1px;" ref="ybTop"></view>
					</cell>
					<slot></slot>
					<template v-if="loadmoreOptionsSync.show && !loadingSync.show && !emptySync.show">
						<cell>
							<list-loadmore :status="loadmoreStatus" :options="loadmoreOptionsSync" @reload="reload">
								<template #loadmore-symbol>
									<slot name="loadmore-symbol"></slot>
								</template>
								<template #loadmore-loading>
									<slot name="loadmore-loading"></slot>
								</template>
								<template #loadmore-fail>
									<slot name="loadmore-fail"></slot>
								</template>
								<template #loadmore-end>
									<slot name="loadmore-end"></slot>
								</template>
							</list-loadmore>
						</cell>
					</template>
				</list>
				<!-- #endif -->
			</template>
			<template v-else-if="typeSync == 'waterfall'">
				<!-- #ifdef APP-NVUE -->
				<waterfall
				:render-whole="true"
				:bounce="bounce"
				:isSwiperList="isSwiperList"
				:fixFreezing="fixFreezing"
				:offsetAccuracy="offsetAccuracy"
				@[scrollEvent]="onScroll"
				@loadmore="onScrolltolower"
				:scrollable="scrollable"
				:column-count="columnCount"
				:column-width="columnWidth"
				:column-gap="Util.unitpixel(columnGap)"
				:left-gap="Util.unitpixel(leftGap)"
				:right-gap="Util.unitpixel(rightGap)"
				:always-scrollable-vertical="alwaysScrollableVertical"
				ref="ybPulldownScroller"
				class="yb-pulldown-scroller yb-pulldown-scroll-view">
					<template v-if="pulldownOptionsSync.show">
						<refresh :display="display" @pullingdown="pullingdown($event.pullingDistance)" @refresh="refresh">
							<view class="yb-flex" style="height: 30rpx;"></view>
							<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
								<template #pulldown-symbol>
									<slot name="pulldown-symbol"></slot>
								</template>
								<template #pulldown-loading>
									<slot name="pulldown-loading"></slot>
								</template>
								<template #pulldown-success>
									<slot name="pulldown-success"></slot>
								</template>
								<template #pulldown-fail>
									<slot name="pulldown-fail"></slot>
								</template>
								<template #pulldown-end>
									<slot name="pulldown-end"></slot>
								</template>
							</list-pulldown>
							<view class="yb-flex" style="height: 20rpx;"></view>
						</refresh>
					</template>
					<cell>
						<view class="yb-flex" style="height: 0.1px;" ref="ybTop"></view>
					</cell>
					<slot></slot>
					<template v-if="loadmoreOptionsSync.show && !loadingSync.show && !emptySync.show">
						<header>
							<list-loadmore :status="loadmoreStatus" :options="loadmoreOptionsSync" @reload="reload">
								<template #loadmore-symbol>
									<slot name="loadmore-symbol"></slot>
								</template>
								<template #loadmore-loading>
									<slot name="loadmore-loading"></slot>
								</template>
								<template #loadmore-fail>
									<slot name="loadmore-fail"></slot>
								</template>
								<template #loadmore-end>
									<slot name="loadmore-end"></slot>
								</template>
							</list-loadmore>	
						</header>
					</template>
				</waterfall>
				<!-- #endif -->
			</template>
			<template v-else-if="typeSync == 'page'">
				<!-- #ifndef APP-NVUE -->
				<view :render-whole="true" ref="ybPulldownScroller" class="yb-pulldown-scroller yb-flex">
					<slot></slot>
					<template v-if="loadmoreOptionsSync.show && !loadingSync.show && !emptySync.show">
						<yb-appear @appear="onScrolltolower">
							<list-loadmore :status="loadmoreStatus" :options="loadmoreOptionsSync" @reload="reload">
								<template #loadmore-symbol>
									<slot name="loadmore-symbol"></slot>
								</template>
								<template #loadmore-loading>
									<slot name="loadmore-loading"></slot>
								</template>
								<template #loadmore-fail>
									<slot name="loadmore-fail"></slot>
								</template>
								<template #loadmore-end>
									<slot name="loadmore-end"></slot>
								</template>
							</list-loadmore>
						</yb-appear>
					</template>
				</view>
				<!-- #endif -->
			</template>
			<template v-else>
				<scroll-view
				:render-whole="true"
				v-if="enableScrolling"
				@scroll="onScroll"
				:scroll-top="scrollTop"
				:scroll-into-view="scrollIntoView"
				:scroll-with-animation="scrollWithAnimation"
				:scroll-y="scrollable"
				ref="ybPulldownScroller"
				class="yb-pulldown-scroller yb-pulldown-scroll-view"
				@scrolltoupper="onScrolltoupper"
				@scrolltolower="onScrolltolower">
					<!-- #ifdef APP-NVUE -->
					<template v-if="pulldownOptionsSync.show">
						<refresh :display="display" @pullingdown="pullingdown($event.pullingDistance)" @refresh="refresh">
							<view class="yb-flex" style="height: 30rpx;"></view>
							<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
								<template #pulldown-symbol>
									<slot name="pulldown-symbol"></slot>
								</template>
								<template #pulldown-loading>
									<slot name="pulldown-loading"></slot>
								</template>
								<template #pulldown-success>
									<slot name="pulldown-success"></slot>
								</template>
								<template #pulldown-fail>
									<slot name="pulldown-fail"></slot>
								</template>
								<template #pulldown-end>
									<slot name="pulldown-end"></slot>
								</template>
							</list-pulldown>
							<view class="yb-flex" style="height: 20rpx;"></view>
						</refresh>
					</template>
					<!-- #endif -->
					<template v-if="virtualable">
						<slot :virtualList="virtualList"></slot>
					</template>
					<template v-else>
						<slot></slot>
					</template>
					<template v-if="loadmoreOptionsSync.show && !loadingSync.show && !emptySync.show">
						<list-loadmore :status="loadmoreStatus" :options="loadmoreOptionsSync" @reload="reload">
							<template #loadmore-symbol>
								<slot name="loadmore-symbol"></slot>
							</template>
							<template #loadmore-loading>
								<slot name="loadmore-loading"></slot>
							</template>
							<template #loadmore-fail>
								<slot name="loadmore-fail"></slot>
							</template>
							<template #loadmore-end>
								<slot name="loadmore-end"></slot>
							</template>
						</list-loadmore>
					</template>
				</scroll-view>
				<scroll-view
				:render-whole="true"
				v-else
				:scroll-top="scrollTop"
				:scroll-into-view="scrollIntoView"
				:scroll-with-animation="scrollWithAnimation"
				:scroll-y="scrollable"
				ref="ybPulldownScroller"
				class="yb-pulldown-scroller yb-pulldown-scroll-view"
				@scrolltoupper="onScrolltoupper"
				@scrolltolower="onScrolltolower">
					<!-- #ifdef APP-NVUE -->
					<template v-if="pulldownOptionsSync.show">
						<refresh :display="display" @pullingdown="pullingdown($event.pullingDistance)" @refresh="refresh">
							<view class="yb-flex" style="height: 30rpx;"></view>
							<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
								<template #pulldown-symbol>
									<slot name="pulldown-symbol"></slot>
								</template>
								<template #pulldown-loading>
									<slot name="pulldown-loading"></slot>
								</template>
								<template #pulldown-success>
									<slot name="pulldown-success"></slot>
								</template>
								<template #pulldown-fail>
									<slot name="pulldown-fail"></slot>
								</template>
								<template #pulldown-end>
									<slot name="pulldown-end"></slot>
								</template>
							</list-pulldown>
							<view class="yb-flex" style="height: 20rpx;"></view>
						</refresh>
					</template>
					<!-- #endif -->
					<template v-if="virtualable">
						<slot :virtualList="virtualList"></slot>
					</template>
					<template v-else>
						<slot></slot>
					</template>
					<template v-if="loadmoreOptionsSync.show && !loadingSync.show && !emptySync.show">
						<list-loadmore :status="loadmoreStatus" :options="loadmoreOptionsSync" @reload="reload">
							<template #loadmore-symbol>
								<slot name="loadmore-symbol"></slot>
							</template>
							<template #loadmore-loading>
								<slot name="loadmore-loading"></slot>
							</template>
							<template #loadmore-fail>
								<slot name="loadmore-fail"></slot>
							</template>
							<template #loadmore-end>
								<slot name="loadmore-end"></slot>
							</template>
						</list-loadmore>
					</template>
				</scroll-view>
			</template>
		</view>
		<list-empty :title="emptySync.text" :bgColor="emptySync.bgColor" :size="emptySync.size" :color="emptySync.color" :visible="emptySync.show && !loadingSync.show"></list-empty>
		<list-loading :type="loadingSync.type" :title="loadingSync.text" :bgColor="loadingSync.bgColor" :size="loadingSync.size" :color="loadingSync.color" :visible="loadingSync.show"></list-loading>
		<view v-if="!scrollable" class="mask" @touchmove.stop.prevent></view>
	</view>
</template>

<script>
	import Util from '../../js_sdk/util.js'
	import ListPulldown from './modules/pulldown/pulldown.vue'
	import ListLoadmore from './modules/loadmore/loadmore.vue'
	import ListEmpty from './modules/empty.vue'
	import ListLoading from './modules/loading.vue'
	import ComponentMixin from '../../js_sdk/componentMixin.js'
	import PulldownMixin from './modules/pulldown/pulldown.js'
	import LoadmoreMixin from './modules/loadmore/loadmore.js'
	import VirtualMixin from './modules/virtual/virtual.js'
	export default {
		name: 'YbList',
		mixins: [ComponentMixin, PulldownMixin, LoadmoreMixin, VirtualMixin],
		components: {
			ListPulldown,
			ListLoadmore,
			ListEmpty,
			ListLoading
		},
		props: {
			type: {
				type: String,
				default: 'list'//list表示使用list组件，在app-vue会使用scroll-view组件替代, scroll表示使用scroll-view组件
			},
			//开启滚动
			scrollable: {
				type: Boolean,
				default: true
			},
			//显示滚动条
			showScrollbar: {
				type: Boolean,
				default: true
			},
			//监听滚动事件
			enableScrolling: {
				type: Boolean,
				default: false
			},
			loading: {
				type: [Object, Boolean],
				default () {
					return new Object
				}
			},
			empty: {
				type: [Object, Boolean],
				default () {
					return new Object
				}
			},
			//下拉加载配置
			pulldown: {
				type: [Object, Boolean],
				default () {
					return new Object
				}
			},
			//触底加载更多配置
			loadmore: {
				type: [Object, Boolean],
				default () {
					return new Object
				}
			},
			//滚动事件触发频率 仅nvue下有效
			offsetAccuracy: {
				type: Number,
				default: 10
			},
			//开启回弹效果 仅APP-NVUE下有效
			bounce: {
				type: Boolean,
				default: true
			},
			//是否是左右切换列表
			isSwiperList: {
				type: Boolean,
				default: false
			},
			fixFreezing: {
				type: Boolean,
				default: false
			},
			//瀑布流列数
			columnCount: {
				type: Number,
				default: 2
			},
			columnWidth: {
				type:[String, Number],
				default: 'auto'
			},
			columnGap: {
				type: Number,
				default: 24
			},
			leftGap: {
				type: Number,
				default: 24
			},
			rightGap: {
				type: Number,
				default: 24
			},
			alwaysScrollableVertical: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				scrollTop: 0,
				scrollIntoView: '',
				scrollWithAnimation: false,
				isShow: false
			}
		},
		computed: {
			Util () {
				return Util
			},
			rootClass () {
				return this.filterClass(
					{
						'yb-flex-1': this.typeSync != 'page'
					}
				) + this.customClass
			},
			typeSync () {
				// #ifdef APP-NVUE
				return this.type == 'page' ? 'list' : this.type
				// #endif
				// #ifndef APP-NVUE
				return this.type == 'page' ? 'page' : 'scroll'
				// #endif
			},
			loadingSync () {
				return Object.assign({}, {
					show: false,
					color: '#333',
					size: '30rpx',
					text: '加载中',
					bgColor: '#fff',
					type: 2
				}, Util.typeof(this.loading) == 'Object' ? this.loading : Util.typeof(this.loading) == 'Boolean' ? { show: this.loading } : {})
			},
			emptySync () {
				return Object.assign({}, {
					show: false,
					color: '#333',
					text: '暂无数据',
					bgColor: '#fff',
					size: '30rpx'
				}, Util.typeof(this.empty) == 'Object' ? this.empty : Util.typeof(this.empty) == 'Boolean' ? { show: this.empty } : {})
			},
			scrollEvent () {
				return this.enableScrolling ? 'scroll' : 'unbindScroll'
			}
		},
		methods: {
			onScrolltoupper () {
				this.$emit('scrolltoupper')
			},
			setSpecialEffects (args) {
				// #ifdef APP-NVUE
				this.$refs.ybPulldownScroller.setSpecialEffects(args)
				// #endif
			},
			//返回顶部
			backTop() {
				if ( this.typeSync == 'list' || this.typeSync == 'waterfall' ) {
					uni.requireNativePlugin('dom').scrollToElement(this.$refs.ybTop, {animated: false})
				} else if ( this.typeSync == 'page' ) {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 0
					})
				} else {
					this.scrollTop = -1;
					this.$nextTick(() => {
						this.scrollTop = 0
					})
				}
			},
			scrollTo (offset, animated = false) {
				if ( this.typeSync == 'scroll' ) {
					this.scrollWithAnimation = animated
					this.$nextTick(function() {
						this.scrollTop = offset - 1
						this.$nextTick(function () {
							this.scrollTop = offset
						})
					})
				} else if ( this.typeSync == 'list' || this.typeSync == 'waterfall' ) {
					uni.requireNativePlugin('dom').scrollToElement(this.$refs.ybTop, {
						offset: offset,
						animated: animated
					})
				} else {
					uni.pageScrollTo({
						scrollTop: offset,
						duration: animated ? 300 : 0,
						fail: (err) => {
							console.log(err);
						}
					})
				}
			},
			scrollToElement (element, options = {}) {
				if ( this.typeSync == 'scroll' ) {
					this.scrollWithAnimation = options.animated || false
					this.$nextTick(function() {
						this.scrollIntoView = ''
						this.$nextTick(function () {
							this.scrollIntoView = element
						})
					})
				} else if ( this.typeSync == 'list' || this.typeSync == 'waterfall' ) {
					uni.requireNativePlugin('dom').scrollToElement(element, {
						offset: options.offset || 0,
						animated: options.animated || false
					})
				} else {
					uni.pageScrollTo({
						scrollTop: options.offset || 0,
						selector: element,
						duration: options.animated ? 300 : 0,
						fail: (err) => {
							console.log(err);
						}
					})
				}
			},
			onScroll (e) {
				if ( this.typeSync == 'scroll' ) {
					this.$emit('scroll', {
						scrollTop: e.detail.scrollTop,
						scrollHeight: e.detail.scrollHeight,
						scrollWidth: e.detail.scrollWidth
					})
				} else {
					// #ifdef APP-NVUE
					this.$emit('scroll', {
						scrollTop: Math.abs(e.contentOffset.y),
						scrollHeight: e.contentSize.height,
						scrollWidth: e.contentSize.width
					})
					// #endif
					// #ifndef APP-NVUE
					this.$emit('scroll', {
						scrollTop: e.detail.scrollTop,
						scrollHeight: e.detail.scrollHeight,
						scrollWidth: e.detail.scrollWidth
					})
					// #endif
				}
			}
		}
	}
</script>

<!-- #ifdef APP-VUE || H5 || MP-WEIXIN || MP-QQ -->
<script module="pulldownwxs" lang="wxs" src="./modules/pulldown/pulldown.wxs"></script>
<script module="ybVirtualList" lang="wxs" src="./modules/virtual/virtual.wxs"></script>
<!-- #endif -->

<style scoped>
	@import url(./modules/waterfall/waterfall.css);
	@import url(../../css/common.css);
	.yb-list {
		position: relative;
		/* #ifndef APP-NVUE */
		overflow: visible;
		/* #endif */
	}
	.yb-list .yb-refresh {
		position: relative;
		/* #ifndef APP-NVUE */
		overflow: visible;
		/* #endif */
	}
	.yb-list .yb-list-pulldown {
		height: 400rpx;
		margin-top: -400rpx;
		justify-content: flex-end;
		padding: 40rpx 0;
	}
	.yb-pulldown-scroller {
		/* #ifndef APP-NVUE */
		overflow: visible;
		/* #endif */
	}
	.yb-list .yb-pulldown-scroll-view {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.yb-list .mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		z-index: 999;
		/* #endif */
	}
</style>
