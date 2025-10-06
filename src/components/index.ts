import SvgIcon from './Svgicon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const allglobalcomponents = [SvgIcon, Pagination, Category]
//对外暴露插件对象
export default {
  install: (app: any) => {
    //循环注册全局组件
    allglobalcomponents.forEach((component: any) => {
      if (component && component.name) {
        app.component(component.name, component)
      }
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
