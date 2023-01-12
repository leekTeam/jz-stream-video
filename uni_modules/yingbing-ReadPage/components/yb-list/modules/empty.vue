<template>
	<view class="yb-flex yb-list-empty yb-align-center yb-justify-center"
	:style="{
		opacity: visible ? 1 : 0,
		backgroundColor: bgColor
	}" v-if="visiblevSync">
		<yb-empty :title="title" :size="size" :color="color" />
	</view>
</template>

<script>
	import ComponentMixin from '../../../js_sdk/componentMixin.js'
	export default {
		mixins: [ComponentMixin],
		props: {
			visible: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: '暂无数据'
			},
			size: {
				type: [Number, String],
				default: 40
			},
			color: {
				type: String,
				default: '#8A96A3'
			},
			bgColor: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				visiblevSync: false
			}
		},
		mounted() {
			this.visiblevSync = this.visible
		},
		watch: {
			visible (newVal) {
				if ( newVal ) {
					this.visiblevSync = newVal
				} else {
					setTimeout(() =>{
						this.visiblevSync = newVal
					}, 300)
				}
			}
		}
	}
</script>

<style scoped>
	.yb-list-empty {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transition-property: background-color, opacity;
		transition-duration: .3s;
	}
</style>
