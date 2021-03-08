import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
  },
  {
    path: '/test',
    component: () => import('@/views/test'),
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
  },
  {
    path: '/order',
    component: Layout,
		redirect: '/order/order',
		name: '订单管理',
		meta: {
      title: '订单管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order/order'),
        name: 'order',
        meta: { title: '订单管理', icon: 'el-icon-orange',  affix: true }
      },
    ]
  },
  {
    path: '/dashboard',
    component: Layout,
		redirect: '/dashboard/dashboard',
		name: '油站管理',
		meta: {
      title: '油站管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/dashboard'),
        name: 'dashboard',
        meta: { title: '油站管理', icon: 'el-icon-orange'}
      },
      {
        path: 'addGasStation',
        component: () => import('@/views/dashboard/addGasStation'),
        name: 'addGasStation',
        meta: { title: '添加油站', icon: 'el-icon-orange'}
      },
      {
        path: 'detail',
        component: () => import('@/views/dashboard/detail'),
        name: 'detail',
        meta: { title: '油站详情', icon: 'el-icon-orange'}
      },
    ]
  },
  {
    path: '/antenna',
    component: Layout,
    redirect: '/antenna/antennaList',
    name: '天线管理',
    meta: {
      title: '天线管理',
      icon: 'edit'
    },
    children: [
      {
        path: 'antennaList',
        component: () => import('@/views/antenna/antennaList'),
        name: 'antennaList',
        meta: { title: '天线管理' , keepAlive: true }
      },
      {
        path: 'addAntenna',
        component: () => import('@/views/antenna/addAntenna'),
        name: 'addAntenna',
        meta: { title: '添加天线', icon: 'el-icon-orange'}
      },
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/merchantList',
    name: '商户管理',
    meta: {
      title: '商户管理',
      icon: 'edit'
    },
    children: [
      {
        path: 'brandList',
        component: () => import('@/views/merchant/brandList'),
        name: 'brandList',
        meta: { title: '品牌管理' }
      },
      {
        path: 'addBrand',
        component: () => import('@/views/merchant/addBrand'),
        name: 'addBrand',
        meta: { title: '添加品牌' }
      },
      {
        path: 'merchantList',
        component: () => import('@/views/merchant/merchantList'),
        name: 'merchantList',
        meta: { title: '商户管理' }
      },
      {
        path: 'addMerchant',
        component: () => import('@/views/merchant/addMerchant'),
        name: 'addMerchant',
        meta: { title: '添加商户'},
      },
    ]
  },
  {
    path: '/operation',
    component: Layout,
		redirect: '/operation/authList',
		name: '运营管理',
		meta: {
      title: '运营管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'authList',
        component: () => import('@/views/operation/authList'),
        name: 'authList',
        meta: { title: '车主认证'}
      },
      {
        path: 'suggestList',
        component: () => import('@/views/operation/suggestList'),
        name: 'suggestList',
        meta: { title: '反馈信息'}
      },
    ]
  },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/orderlist',
  //   name: '订单管理',
  //   meta: {
  //     title: '订单管理',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'orderlist',
  //       component: () => import('@/views/order/orderlist'),
  //       name: 'orderlist',
  //       meta: { title: '订单列表' , keepAlive: true}
  //     },
  //     {
  //       path: 'topUp',
  //       component: () => import('@/views/order/topUp'),
  //       name: 'topUp',
  //       meta: { title: '批量充值', keepAlive: true}
  //     },
  //     {
  //       path: 'deleteOrder',
  //       name: 'deleteOrder',
  //       component: () => import('@/views/order/deleteOrder'),
  //       meta: { title: '删除订单' }
  //     },
  //     {
  //       path: 'commission',
  //       name: 'commission',
  //       component: () => import('@/views/order/commission'),
  //       meta: { title: '佣金列表' }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles 需要权限限制的页面
 */
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
