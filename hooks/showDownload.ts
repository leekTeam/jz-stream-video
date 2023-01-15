import { ref } from 'vue'
export const useShowDownload = (key: string, data: any) => {
  const downloadList = uni.getStorageSync(key) || []
  const ridList = ref<string[]>([])
  if(downloadList.length){
    ridList.value = data.reduce((list, item) => {
      list.push(item.rid)
      return list
    }, [])
  }
  const getShowDownload = (rid: string) => {
    return !ridList.value.includes(rid)
  }

  return {
    ridList,
    getShowDownload,
  }
}