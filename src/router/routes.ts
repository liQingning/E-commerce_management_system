//对外暴露配置路由
export const constantroute = [
  {
    // 登录页面路由配置
    path: '/login',
    name: 'login', //路由名称，用于编程式导航
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }, // 页面标题
    // 控制是否在侧边栏显示
  },
  {
    // 首页路由配置
    path: '/',
    name: 'layout',
    meta: { title: '', hidden: false },
    component: () => import('@/layout/index.vue'),

    redirect: '/home', // 重定向到首页

    children: [
      {
        path: '/home',
        name: 'homeIndex',
        meta: { title: '首页', hidden: false, icon: 'House' },

        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
  {
    // 404页面路由配置
    path: '/404',
    name: '404',
    meta: { title: '404', hidden: true },
    component: () => import('@/views/404/index.vue'),
  },

  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/index.vue'),
    meta: { title: '数据大屏', hidden: false, icon: 'Monitor' },
  },
  // 404路由已在constantroute开头定义，避免重复
]

export const asyncRoute = [
  {
    path: '/acl',
    name: 'Acl',
    redirect: '/acl/user',
    component: () => import('@/layout/index.vue'),
    meta: { title: '权限管理', hidden: false, icon: 'Lock' },
    children: [
      {
        path: '/acl/user',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: { title: '用户管理', hidden: false, icon: 'User' },
      },
      {
        path: '/acl/role',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: { title: '角色管理', hidden: false, icon: 'UserFilled' },
      },
      {
        path: '/acl/permission',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: { title: '菜单管理', hidden: false, icon: 'Grid' },
      },
    ],
  },
  {
    path: '/product',

    name: 'Product',
    redirect: '/product/trademark',
    component: () => import('@/layout/index.vue'),
    meta: { title: '商品管理', hidden: false, icon: 'Goods' },
    children: [
      {
        path: '/product/trademark',
        name: 'Trademark',

        component: () => import('@/views/product/trademark/index.vue'),
        meta: { title: '品牌管理', hidden: false, icon: 'ShoppingCartFull' },
      },
      {
        path: '/product/attr',
        name: 'Attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: { title: '属性管理', hidden: false, icon: 'ChromeFilled' },
      },
      {
        path: '/product/spu',
        name: 'Spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: { title: 'SPU管理', hidden: false, icon: 'Calendar' },
      },
      {
        path: '/product/sku',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: { title: 'SKU管理', hidden: false, icon: 'Orange' },
      },
    ],
  },
]

export const anyRoute = [
  {
    path: '/:pathMatch(.*)*', // vue3写法，匹配所有路径
    redirect: '/404', // 重定向到404页面
    name: 'Any',
    meta: { title: 'Any', hidden: true },
  },
]
