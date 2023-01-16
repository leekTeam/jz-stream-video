import { computed, nextTick, ref, watch } from 'vue'

export function useRequestList<
  Props extends { isActive: boolean }, FetchClassifyApi extends () => Promise<any>, FetchListApi extends (...args: any) => Promise<any>,
>(
  props: Props,
  fetchClassifyApi: FetchClassifyApi,
  fetchListApi: FetchListApi,
) {
  const scrollRef = ref()
  const classifyList = ref<Awaited<ReturnType<FetchClassifyApi>>['dataObject']>([])
  const activeClassifyCid = ref('')
  const listData = ref<Awaited<ReturnType<FetchListApi>>['dataObject']['content']>([])
  const isActiveScroll = computed(() => props.isActive && !!activeClassifyCid.value)

  const onClassifyChange = () => {
    scrollRef.value.triggerDownScroll()
  }

  const getClassifyList = () => {
    uni.showLoading({ title: '加载中', mask: true })
    fetchClassifyApi().then((res) => {
      const { dataObject } = res
      classifyList.value = dataObject
      activeClassifyCid.value = dataObject[0].cid
    }).finally(() => {
      uni.hideLoading()
    })
  }

  watch(
    () => props.isActive,
    (val) => {
      if (val && !classifyList.value.length) {
        nextTick(() => {
          getClassifyList()
        })
      }
    },
    {
      immediate: true,
    },
  )

  const upCallback = (mescroll: any) => {
    fetchListApi({
      cid: activeClassifyCid.value,
      // page  从0开始
      page: mescroll.num - 1,
      size: 1,
    })
      .then((res) => {
        const { dataObject } = res
        const { content, last } = dataObject
        mescroll.endSuccess(content.length, !last)
        if (mescroll.num === 1)
          listData.value = content
        else listData.value = [...listData.value, ...content]
      })
      .catch(() => {
        mescroll.endErr()
      })
  }

  return {
    scrollRef,
    activeClassifyCid,
    classifyList,
    isActiveScroll,
    listData,
    upCallback,
    onClassifyChange,
  }
}
