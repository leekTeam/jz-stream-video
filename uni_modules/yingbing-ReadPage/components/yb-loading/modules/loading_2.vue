<template>
	<view class="yb-flex" v-if="visible">
		<view class="loadings yb-flex" :style="{
			width: pixelSize + 'px',
			height: height + 'px'
		}">
			<view class="loading yb-flex"
			:class="'loading_' + type"
			ref="loading"
			:style="{
				width: (pixelSize / 8) + 'px',
				'background-color': color,
				'border-radius': (pixelSize / 8) + 'px'
			}"
			v-for="(item, index) in loadings" :key="index"></view>
		</view>
	</view>
</template>

<script>
	import Util from '../../../js_sdk/util.js'
	import ComponentMixin from '../../../js_sdk/componentMixin.js'
	// #ifdef APP-NVUE
	const Binding = uni.requireNativePlugin('bindingx');
	// #endif
	export default {
		mixins: [ComponentMixin],
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
			type: {
				type: [String, Number],
				default: 2
			}
		},
		computed: {
			height () {
				return this.pixelSize
			},
			pixelSize () {
				return Util.unitpixel(this.size)
			}
		},
		data () {
			return {
				loadings: [1,2,3,4,5],
				loading_binding: null
			}
		},
		mounted() {
			// #ifdef APP-NVUE
			this.$nextTick(() => {
				if ( this.visible ) {
					this.start()
				}
			})
			// #endif
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.closedLoading();
		},
		// #endif
		
		// #ifdef VUE3
		beforeUnmount() {
			this.closedLoading();
		},
		// #endif
		methods: {
			closedLoading(){
				// #ifdef APP-NVUE
				if ( this.loading_binding ) {
					Binding.unbind({
						token: this.loading_binding.token,
						eventType: 'timing'
					})
					this.loading_binding = null
				}
				// #endif
			},
			start () {
				let props = this.$refs.loading.map((loading, key) => {
					let element = Util.getEl(loading);
					let height = this.height
					let minHeight = this.height/10
					let duration = 400
					let delay = this.type == 2 ? key * 100 : key * duration
					let expression = ''
					return {
				        element: element,
				        property: 'height',
						// expression: `floor((t-${delay})/${duration})%2==0?((floor((t-${delay})/${duration})+1)*${duration}-(t-${delay}))/${duration}*${height}+${minHeight}:((floor((t-${delay})/${duration})+1)*${duration}-(t-${delay}))/${duration}*${minHeight-height}+${height}`
						expression: `floor((t-${delay})/${duration})%2==0?linear((t-${delay})-(floor((t-${delay}) / ${duration}) * ${duration}), ${minHeight}, ${height-minHeight}, ${duration}):linear((t-${delay})-(floor((t-${delay}) / ${duration}) * ${duration}), ${height}, ${minHeight-height}, ${duration})`
				    }
				})
				this.loading_binding = Binding.bind({
				    eventType: 'timing',
				    props: props
				});
			}
		},
		watch: {
			visible (newVal) {
				// #ifdef APP-NVUE
				this.$nextTick(() => {
					if ( newVal ) {
						this.start()
					} else {
						if ( this.loading_binding ) {
							Binding.unbind({
								token: this.loading_binding.token,
								eventType: 'timing'
							})
							this.loading_binding = null
						}
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	@keyframes loading{
		0% {
			height: 100%;
		}
		50% {
			height: 10%;
		} 
		100%{
			height: 100%;
		}
	}
	.loading_2:nth-child(1) {
		animation: loading 800ms infinite;
	}
	.loading_2:nth-child(2) {
		animation: loading 800ms 100ms infinite;
	}
	.loading_2:nth-child(3) {
		animation: loading 800ms 200ms infinite;
	}
	.loading_2:nth-child(4) {
		animation: loading 800ms 300ms infinite;
	}
	.loading_2:nth-child(5) {
		animation: loading 800ms 400ms infinite;
	}
	.loading_3:nth-child(odd) {
		animation: loading 800ms infinite;
	}
	.loading_3:nth-child(even) {
		animation: loading 800ms 400ms infinite;
	}
	/* #endif */
	.loadings {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-shrink: 0;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	/* #ifndef APP-NVUE */
	.loading {
		height: 100%;
	}
	/* #endif */
</style>
