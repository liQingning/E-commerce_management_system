import { createRouter, createWebHashHistory } from 'vue-router'
import { constantroute } from './routes'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantroute,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
