import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponse } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'
let useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    c1Arr: [],
    c1id: '',
    c2Arr: [],
    c2id: '',
    c3Arr: [],
    c3id: '',
  }),
  actions: {
    async getC1() {
      let result: CategoryResponse = await reqC1()
      if (result.code == 200) this.c1Arr = result.data
    },
    async getC2() {
      let result: CategoryResponse = await reqC2(this.c1id as number)
      if (result.code == 200) this.c2Arr = result.data
    },
    async getC3() {
      let result: CategoryResponse = await reqC3(this.c2id as number)
      if (result.code == 200) this.c3Arr = result.data
    },
  },
  getters: {},
})

export default useCategoryStore
