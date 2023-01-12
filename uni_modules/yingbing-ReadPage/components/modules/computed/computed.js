import Util from '../../../js_sdk/util.js'
export default {
	methods: {
		//绘制页面
		resetPage(data) {
			setTimeout(() => {
				//一次最多渲染3章的内容，根据定位的章节剪切出3章内容渲染
				let currentChapter = data.currentChapter || this.contents[0].chapter
				let nowIndex = this.contents.findIndex(item => item.chapter == currentChapter);
				let prevIndex = -1;
				let nextIndex = -1;
				let contents = [];
				if (!this.contents[nowIndex].isStart) prevIndex = this.contents.findIndex(item => item
					.chapter == currentChapter - 1);
				if (!this.contents[nowIndex].isEnd) nextIndex = this.contents.findIndex(item => item.chapter ==
					currentChapter + 1);
				if (prevIndex > -1) {
					contents.push(this.contents[prevIndex])
				}
				contents.push(this.contents[nowIndex])
				if (nextIndex > -1) {
					contents.push(this.contents[nextIndex])
				}
				let arr = [];
				const dowhile = (i) => {
					let item = contents[i];
					this.computedChapter(item).then(pages => {
						if (currentChapter == item.chapter) {
							let index = Object.keys(pages).findIndex(key => data.start >= pages[
									key].start &&
								data.start < pages[key].end)
							this.currentDataId = pages[index > -1 ? index : 0].dataId;
						}
						arr = arr.concat(pages)
						if (i == contents.length - 1) {
							if ( this.options.pageType != 'scroll' ) {
								arr.unshift({
									title: contents[0].title || '',
									chapter: contents[0].chapter,
									type: contents[0].isStart ? 'top' : 'prevLoading',
									dataId: arr[0].dataId - 1,
									start: 0,
									end: 0
								})
								arr.push({
									title: item.title || '',
									chapter: item.chapter,
									type: item.isEnd ? 'bottom' : 'nextLoading',
									dataId: arr[arr.length - 1].dataId + 1,
									start: 0,
									end: 0
								})
							}
							this.pages = arr;
							this.$nextTick(() => {
								if ( this.options.pageType != 'scroll' ) {
									this.onChange(this.currentDataId);
								} else {
									setTimeout(() => {
										// #ifndef MP
										this.$refs.list.scrollToElement('scroll-item_' + this.currentDataId)
										// #endif
										// #ifdef MP
										const query = uni.createSelectorQuery().in(this);
										query.select('#scroll-item_' + this.currentDataId).boundingClientRect(data => {
											if ( data.top != 0 ) {
												this.$refs.list.scrollTo(data.top)
											}
										}).exec();
										// #endif
									}, 300)
								}
								this.initLoading = false;
								this.preload(currentChapter);
							})
						} else {
							setTimeout(() => {
								dowhile(i + 1)
							}, 100)
						}
					})
				}
				dowhile(0)
			}, 50)
		},
		computedChapter(content) {
			return new Promise((resolve) => {
				this.$refs.computedPage.computed({
					content: content.content,
					custom: content.custom,
					chapter: content.chapter,
					title: content.title || ''
				}).then((pages) => {
					resolve(pages);
				})
			}).catch(() => {
				resolve([])
			})
		},
		computedPage(e) {
			this.computedChapter(e.content).then((pages) => {
				let arr = [];
				let newPages = [];
				const pagesSync = e.type == 'prev' ? pages.concat(this.pages) : this.pages.concat(pages);
				pagesSync.forEach(item => {
					if (arr.indexOf(item.chapter) == -1) arr.push(item.chapter)
				})
				if (arr.length > 3) {
					let reChapter = e.type == 'prev' ? pagesSync[pagesSync.length - 1].chapter : pagesSync[0]
						.chapter;
					newPages = pagesSync.filter(item => item.chapter != reChapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'));
				} else {
					newPages = pagesSync.filter(item => (item.type == 'text' || item.type == 'custom' || item.type == 'slot'));
				}
				if ( this.options.pageType != 'scroll' ) {
					const prevIndex = this.contents.findIndex(content => content.chapter == newPages[0].chapter);
					const nextIndex = this.contents.findIndex(content => content.chapter == newPages[newPages
						.length - 1].chapter);
					newPages.unshift({
						title: this.contents[prevIndex].title || '',
						chapter: this.contents[prevIndex].chapter,
						type: this.contents[prevIndex].isStart ? 'top' : 'prevLoading',
						dataId: newPages[0].dataId - 1,
						start: 0,
						end: 0
					})
					newPages.push({
						title: this.contents[nextIndex].title || '',
						chapter: this.contents[nextIndex].chapter,
						type: this.contents[nextIndex].isEnd ? 'bottom' : 'nextLoading',
						dataId: newPages[newPages.length - 1].dataId + 1,
						start: 0,
						end: 0
					})
					this.pages = newPages
					const nowIndex = newPages.findIndex(page => page.dataId == this.currentDataId);
					if ( nowIndex == -1 ) {
						this.currentDataId = e.type == 'next' ? pages[0].dataId : pages[pages.length - 1].dataId;
						this.onChange(this.currentDataId)
					}
				} else {
					let dataId = e.type == 'prev' ? this.pages[0].dataId : this.pages[this.pages.length-1].dataId
					this.pages = newPages
					if ( e.type == 'next' ) {
						let index = this.pages.findIndex(page => page.dataId == dataId)
						dataId = this.pages[index + 1] && this.pages[index + 1].dataId
					}
					this.$nextTick(function () {
						setTimeout(() => {
							// #ifndef MP
							this.$refs.list.scrollToElement('scroll-item_' + dataId)
							this.$nextTick(function () {
								setTimeout(() => {
									if ( e.type == 'prev' ) {
										// #ifndef APP-NVUE
										this.$refs.list.scrollTo(this.scrollTop -(this.options.topGap + this.options.bottomGap))
										// #endif
										// #ifdef APP-NVUE
										this.$refs.list.scrollTo(this.scrollTop -(this.options.topGap + this.options.bottomGap + uni.upx2px(200)))
										// #endif
									} else {
										// #ifndef APP-NVUE
										this.$refs.list.scrollTo(this.scrollTop -(this.options.topGap + this.options.bottomGap + this.windowHeight - uni.upx2px(200)))
										// #endif
										// #ifdef APP-NVUE
										this.$refs.list.scrollTo(this.scrollTop -(this.options.topGap + this.options.bottomGap + this.windowHeight))
										// #endif
									}
								}, 50)
							})
							// #endif
							// #ifdef MP
							const query = uni.createSelectorQuery().in(this);
							query.select('#scroll-item_' + dataId).boundingClientRect(data => {
								if ( e.type == 'prev' ) {
									this.$refs.list.scrollTo(Math.abs(data.top) - this.options.topGap - this.options.bottomGap)
								}
							}).exec();
							// #endif
						}, 300)
					})
				}
			})
		},
		//预加载章节
		preload (chapter) {
			if ( !this.enablePreload ) return false
			const nowIndex = this.contents.findIndex(item => item.chapter == chapter);
			let prevIndex = -2;
			let nextIndex = -2;
			let chapters = [];
			if ( !this.contents[nowIndex].isStart ) prevIndex = this.contents.findIndex(item => item.chapter == chapter - 1);
			if ( !this.contents[nowIndex].isEnd ) nextIndex = this.contents.findIndex(item => item.chapter == chapter + 1);
			if ( prevIndex == -1 ) {
				chapters.push(chapter - 1);
			}
			if ( nextIndex == -1 ) {
				chapters.push(chapter + 1);
			}
			if ( chapters.length > 0 ) {
				this.$emit('preload', chapters, (status, contents) => {
					if (status == 'success') {
						contents.forEach(item => {
							const index = this.contents.findIndex(content => content.chapter == item.chapter)
							if (index > -1) {
								this.contents[index] = item;
							} else {
								this.contents.push(item);
							}
						})
					}
				})
			}
		},
		filterPage (pageInfo) {
			if ( pageInfo && pageInfo.dataId > -1 ) {
				const nowChapters = this.pages.filter(item => item.chapter == pageInfo.chapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'))
				let currentPage = nowChapters.findIndex(item => item.dataId == pageInfo.dataId)
				if ( currentPage > -1 ) {
					return (currentPage + 1) + ' / ' + nowChapters.length
				} else {
					return pageInfo.type == 'top' ? '最前面' : pageInfo.type == 'bottom' ? '最后面' : pageInfo.type.indexOf('Loading') > -1 ? '请等待' : ''
				}
			} else {
				return '加载中'
			}
		},
		filterDate () {
			let date = new Date()
			return Util.zeroize(date.getHours()) + ':' + Util.zeroize(date.getMinutes())
		},
		//翻往上一页
		pagePrev () {
			if ( this.options.pageType != 'scroll' ) {
				// #ifndef APP-NVUE
				this.pagePrevWxs()
				// #endif
				// #ifdef APP-NVUE
				this.pagePrevBinding()
				// #endif
			} else {
				this.scrollPrev()
			}
		},
		//翻往下一页
		pageNext () {
			if ( this.options.pageType != 'scroll' ) {
				// #ifndef APP-NVUE
				this.pageNextWxs()
				// #endif
				// #ifdef APP-NVUE
				this.pageNextBinding()
				// #endif
			} else {
				this.scrollNext()
			}
		},
	}
}