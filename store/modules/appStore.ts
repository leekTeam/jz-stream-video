import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', () => {
  return {
    count: 123,
  }
})
