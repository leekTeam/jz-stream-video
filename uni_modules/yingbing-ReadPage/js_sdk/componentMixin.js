import Util from './util'
export default {
	options: {
		addGlobalClass: true,
		virtualHost: true,  //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
	},
	props: {
		customStyle: {
			type: [String, Object],
			default: ''
		},
		customClass: {
			type: [String, Object],
			default: ''
		},
		customId: {
			type: [String, Object],
			default: ''
		}
	},
	computed: {
		customClassSync () {
			return this.filterClass(this.customClass)
		},
		customIdSync () {
			return this.filterClass(this.customId)
		},
		customStyleSync () {
			return this.filterStyle(this.customStyle)
		}
	},
	methods: {
		filterClass (customClass) {
			if ( Util.typeof(customClass) == 'String' ) {
				return customClass
			} else {
				let str = ''
				Object.keys(customClass).forEach(key => {
					if ( customClass[key] ) {
						str += key + ' '
					}
				})
				return str
			}
		},
		filterStyle (customStyle) {
			if ( Util.typeof(customStyle) == 'String' ) {
				return customStyle
			} else {
				let str = ''
				Object.keys(customStyle).forEach(key => {
					str += this.toLine(key) + ':' + customStyle[key] + ';'
				})
				return str
			}
		},
		//驼峰转横杠
		toLine(name) {
		  return name.replace(/([A-Z])/g,"-$1").toLowerCase();
		}
	}
}