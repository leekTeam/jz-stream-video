<template>
	<view class="yb-list-loading yb-flex yb-align-center yb-justify-center" v-if="visiblevSync"
	:style="{
		opacity: visible ? 1 : 0,
		backgroundColor: bgColor
	}">
		<yb-loading :visible="visiblevSync" :type="type" :size="size" :color="color" :title="title" />
	</view>
</template>

<script>
	import ComponentMixin from '../../../js_sdk/componentMixin.js'
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
			bgColor: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			type: {
				type: [Number, String],
				default: 2
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
	.yb-list-loading {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transition-property: background-color, opacity;
		transition-duration: .3s;
	}
</style>
