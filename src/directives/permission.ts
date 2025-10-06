import type { App } from 'vue'
import useUserStore from '@/store/modules/user'

// 定义权限指令
export default function setupPermissionDirective(app: App) {
  // 注册v-permission指令
  app.directive('permission', {
    mounted(el, binding) {
      // 获取用户store
      const userStore = useUserStore()
      // 获取绑定的值，即权限按钮标识
      const permission: string = binding.value

      // 判断当前用户是否拥有该权限
      if (!userStore.buttons.includes(permission)) {
        // 如果没有权限，移除元素或隐藏元素
        el.style.display = 'none'
        // 或者完全移除元素
        // el.parentNode?.removeChild(el)
      }
    },
  })
}
