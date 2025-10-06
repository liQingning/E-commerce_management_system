import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => ({
    fold: false,
    refresh: false,
  }),
})

export default useLayoutSettingStore
