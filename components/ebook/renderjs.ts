/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default {
  data() {
    return {
      clientWidth: 0,
      clientHeight: 0,
      viewProps: {},
      canvesContent: null,
      activeId: undefined,
      touchStartPosition: {
        x: 0,
        y: 0,
      },
      touchEndPosition: {
        x: 0,
        y: 0,
      },
      listData: [],
      touchstart: false,
      isStart: false,
    }
  },
  mounted() {
    const viewDom = document.querySelector('.read-box') as HTMLElement
    this.clientHeight = viewDom.clientHeight
    this.clientWidth = viewDom.clientWidth
  },
  methods: {
    propObserver(newVal: any, oldVal: any) {
      this.viewProps = newVal
      if (newVal.textContent && (!oldVal || !oldVal.textContent))
        this.initContents()
    },
    getContentDom(id: number) {
      return document.querySelector(`.read-box-content_${id}`) as HTMLElement
    },
    getBgDom() {
      return document.querySelector('.read-box-move-bg') as HTMLElement
    },
    getShadowDom() {
      return document.querySelector('.read-box-move-shadow') as HTMLElement
    },
    initContents() {
      const canvas = document.createElement('canvas')
      this.canvesContent = canvas.getContext('2d')!
      const row = this.getOnePageContents(this.viewProps.startReadIndex)!
      const value = [row]

      this.activeId = row.id
      if (!row.isEnd)
        value.push(this.getOnePageContents(row.end)!)

      if (!row.isStart)
        value.unshift(this.getOnePageContents(this.viewProps.startReadIndex, true)!)

      this.updateListData(value)
      this.$nextTick(() => {
        this.initPageDom()
      })
    },
    initPageDom() {
      if (this.activeId) {
        const currentDom = this.getContentDom(this.activeId)
        if (currentDom)
          currentDom.style.zIndex = '1'
      }
    },
    updatedObserver(newVal: boolean, oldVal: boolean) {
      if (newVal && !oldVal)
        this.initPageDom()
    },
    updateListData(value: any) {
      this.listData = value
      this.$ownerInstance.callMethod('setListData', value)
    },
    getOnePageContents(index = 0, inverted = false) {
      const { clientHeight, clientWidth } = this
      const { fontSize, lineHeight, textContent } = this.viewProps

      const ctx = this.canvesContent
      ctx.font = `${fontSize}px`

      const contents = []
      let currentText = ''
      let currentWidth = 0
      let start = index
      const end = inverted ? 0 : textContent.length
      while (inverted ? start > end : start <= end) {
        if (((contents.length + 1) * lineHeight < clientHeight)) {
          const text = textContent[start]
          if (currentWidth + fontSize < clientWidth && text !== '\n' && start !== end) {
            currentWidth += ctx.measureText(text).width
            currentText = inverted
              ? `${text}${currentText}`
              : `${currentText}${text}`
          }
          else {
            contents.push({
              id: Date.now() + index,
              text: currentText,
            })
            currentWidth = 0
            currentText = ''
          }
          inverted ? start-- : start++
        }
        else {
          break
        }
      }
      if (contents.length) {
        return {
          id: Date.now() + index,
          start: inverted ? start : index,
          end: inverted ? end : start,
          contents,
          isStart: (inverted ? start : index) === 0,
          isEnd: (inverted ? end : start) >= textContent.length,
        }
      }
    },
    animation() {
      const { clientWidth, touchStartPosition, touchEndPosition } = this
      const currentDom = this.getContentDom(this.activeId)
      const bgDom = this.getBgDom()
      const shadowDom = this.getShadowDom()
      currentDom.style.transition = 'all 300ms'
      bgDom.style.transition = 'all 300ms'
      shadowDom.style.transition = 'all 300ms'
      if (touchStartPosition.x > touchEndPosition.x) {
        currentDom.style.width = '0px'
        bgDom.style.width = '0px'
        bgDom.style.right = `${clientWidth}px`
        shadowDom.style.right = `${clientWidth}px`
      }
      else {
        currentDom.style.width = `${clientWidth}px`
        bgDom.style.width = '0px'
        bgDom.style.right = '0px'
        shadowDom.style.right = '0px'
      }
    },
    refreshView(pageX: number) {
      const { listData, viewProps, activeId } = this
      const { touchWidth } = viewProps
      const currentDom = this.getContentDom(activeId)
      const bgDom = this.getBgDom()
      const shadowDom = this.getShadowDom()

      currentDom.style.transition = ''
      bgDom.style.transition = ''
      shadowDom.style.transition = ''
      const index = listData.findIndex(item => item.id === this.activeId)
      const row = pageX < touchWidth ? listData[index - 1] : listData[index + 1]

      return !!row
    },
    updateStartStatus(val: boolean) {
      this.isStart = val
      this.$ownerInstance.callMethod('updateStatus', val)
    },
    onTouchStart(event: TouchEvent) {
      const { clientWidth, viewProps, listData } = this
      const { touchWidth } = viewProps
      const { pageX, pageY } = event.touches[0]
      if (
        (pageX > (clientWidth - touchWidth) || pageX < touchWidth)
          && this.refreshView(pageX)
      ) {
        this.touchstart = true
        this.touchStartPosition = {
          x: pageX,
          y: pageY,
        }
        if (pageX < touchWidth) {
          const index = listData.findIndex(item => item.id === this.activeId)
          const newId = listData[index - 1].id
          this.updateCurrentDomZIndex(newId, this.activeId)
          this.activeId = newId
        }
      }
    },
    onTouchMove(event: TouchEvent) {
      if (this.touchstart) {
        const { clientWidth, activeId } = this
        const { pageX } = event.touches[0]

        const offsetWidth
              = (clientWidth - pageX) / 2
              + (clientWidth / 2) * (1 - pageX / clientWidth)

        const currentDom = this.getContentDom(activeId)
        const bgDom = this.getBgDom()
        const shadowDom = this.getShadowDom()

        currentDom.style.width = `${clientWidth - offsetWidth}px`
        bgDom.style.width = `${offsetWidth}px`
        bgDom.style.right = `${offsetWidth}px`
        shadowDom.style.right = `${offsetWidth}px`
        this.updateStartStatus(true)
      }
    },
    onTouchEnd(event: TouchEvent) {
      if (this.touchstart) {
        const { pageX, pageY } = event.changedTouches[0]
        this.touchstart = false
        this.touchEndPosition = {
          x: pageX,
          y: pageY,
        }
        this.animation()
      }
    },
    updateCurrentDomZIndex(newId: number, oldId: number) {
      let currentDom = this.getContentDom(oldId)
      const zIndex = currentDom.style.zIndex
      currentDom.style.zIndex = `${Number(zIndex) - 1}`
      currentDom = this.getContentDom(newId)
      if (currentDom)
        currentDom.style.zIndex = zIndex
    },
    refreshPage(newId: number, oldId: number) {
      this.updateCurrentDomZIndex(newId, oldId)
      this.updateStartStatus(false)
    },
    onNext() {
      const newVal = [...this.listData]
      if (newVal.length > 2)
        newVal.shift()

      const lastRow = newVal[newVal.length - 1]
      if (!lastRow.isEnd) {
        const row = this.getOnePageContents(lastRow.end)
        if (row)
          newVal.push(row)
      }
      const index = newVal.findIndex(item => item.id === this.activeId)
      const val = newVal[index + 1].id
      this.refreshPage(val, this.activeId)
      this.activeId = val
      this.updateListData(newVal)
    },
    onPrev() {
      const newVal = [...this.listData]
      if (newVal.length > 2)
        newVal.pop()

      const firstRow = newVal[0]
      if (!firstRow.isStart) {
        const row = this.getOnePageContents(firstRow.start, true)
        if (row)
          newVal.unshift(row)
      }
      const index = newVal.findIndex(item => item.id === this.activeId)
      if (index > 0) {
        const val = newVal[index - 1].id
        this.refreshPage(val, this.activeId)
        this.activeId = val
      }
      else {
        this.updateStartStatus(false)
      }

      this.updateListData(newVal)
    },
    onTransitionend() {
      if (this.isStart) {
        const currentDom = this.getContentDom(this.activeId)
        const bgDom = this.getBgDom()
        const shadowDom = this.getShadowDom()

        currentDom.style.transition = ''
        bgDom.style.transition = ''
        shadowDom.style.transition = ''
        if (this.touchStartPosition.x > this.touchEndPosition.x)
          this.onNext()
        else
          this.onPrev()
      }
    },
  } as any,
} as any
