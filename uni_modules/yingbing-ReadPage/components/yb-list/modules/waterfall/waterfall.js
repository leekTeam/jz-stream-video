export default {
	props: {
		//瀑布流列数
		columnCount: {
			type: Number,
			default: 2
		},
		columnWidth: {
			type: [String, Number],
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
		}
	},
	computed: {
		maxHeight () {
			let height = 0
			for ( let i in this.listData ) {
				height = Math.max(this.listData[i].height, height)
			}
			return height
		}
	},
	data () {
		return {
			listData: []
		}
	},
	mounted() {
		// #ifndef APP-NVUE
		this.initWaterfall()
		// #endif
	},
	methods: {
		initWaterfall () {
			this.listData = []
			for ( let i = 0; i < this.columnCount; i++ ) {
				this.listData.push({
					height: 0
				});
			}
		},
		changeListHeight (i, height) {
			this.listData[i].height += height
		},
		removeListHeight (i, height) {
			this.listData[i].height -= height
		}
	},
	watch: {
		columnCount (newVal) {
			// #ifndef APP-NVUE
			this.initWaterfall()
			// #endif
		}
	}
}