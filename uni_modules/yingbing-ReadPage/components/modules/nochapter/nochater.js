export default {
	methods: {
		computedNochapter (data) {
			let catalog = this.getCatalog(data.content)
			if ( data.content.length / catalog.length <= 10000 ) {
				this.contents = catalog
				this.initLoading = true;
				this.resetPage({
					contents: this.contents,
					start: parseInt(data.start || 0),
					currentChapter: parseInt(data.currentChapter),
					title: data.title || null
				});
				this.$emit('setCatalog', this.contents)
			} else {
				this.cutChapter(data, 0, 3000)
			}
		},
		//分割章节
		cutChapter (data, start, length) {
			let end = start + length
			let str = data.content.slice(start, end)
			let index1 = str.lastIndexOf('\r')
			let index2 = str.lastIndexOf('\n')
			let index = Math.max(index1, index2)
			index > -1 ? str = str.slice(0, index+1) : null
			end = start + str.length
			let chapter = this.contents.length + 1
			this.contents.push({
				title: '第' + chapter + '节 ' + str.replace(/[\r\n\t\s]/g, '').slice(0, 10),
				chapter: chapter,
				isStart: false,
				isEnd: false,
				start: start,
				end: end,
				content: str
			})
			if ( end < data.content.length ) {
				this.cutChapter(data, end, length)
			} else {
				this.contents[0].isStart = true
				this.contents[this.contents.length-1].isEnd = true
				this.initLoading = true;
				this.resetPage({
					contents: this.contents,
					start: parseInt(data.start || 0),
					currentChapter: parseInt(data.currentChapter || 1),
					title: data.title || null
				});
				this.$emit('setCatalog', this.contents)
			}
		},
		//使用正则获取章节目录 并抛出事件
		getCatalog (content) {
			const reg = new RegExp(/(第?[一二两三四五六七八九十○零百千万亿0-9１２３４５６７８９０※✩★☆]{1,6}[章回卷节折篇幕集部]?[、.-\s][^\n]*)[_,-]?/g);
			let match = '';
			let catalog = [];
			let chapter = 0
			while ((match = reg.exec(content)) != null) {
				chapter++
				catalog.push({
					title: match[0].replace(/[\r\n\t]/g, '').slice(0, 10),
					start: match.index,
					isStart: false,
					isEnd: false,
					chapter: chapter
				})
				if ( chapter > 1 ) {
					catalog[chapter-2].content = content.slice(catalog[chapter-2].start, match.index)
					catalog[chapter-2].end = match.index
				}
			}
			if ( catalog.length == 1 ) {
				catalog[0].content = content.slice(0, content.length)
				catalog[0].end = content.length
			}
			if ( catalog.length > 0 ) {
				catalog[0].isStart = true
				catalog[catalog.length-1].isEnd = true
				catalog[catalog.length-1].content = content.slice(catalog[catalog.length-1].start)
				catalog[catalog.length-1].end = content.length
			}
			return catalog;
		}
	}
}