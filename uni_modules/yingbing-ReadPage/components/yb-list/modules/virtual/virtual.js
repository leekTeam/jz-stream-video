export default {
	props: {
		virtualable: {
			type: Boolean,
			default: false
		},
		data: {
			type: Array,
			default () {
				return new Array
			}
		},
		height: {
			type: [Number, String],
			default: 'auto'
		},
		//最大展示数据量
		count: {
			type: Number,
			default: 20
		}
	},
	computed: {
		Util () {
			return Util
		},
		virtualList () {
			return this.data.slice(this.startIndex, this.count)
		}
	},
	data () {
		return {
			startIndex: 0,
			endIndex: 0
		}
	}
}