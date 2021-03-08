<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" style="width:211px">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menu" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data(){
    return{
      showLogo: true,
      menu: [
        {
          path: '/order',
          icon: 'star',
          name: '订单管理',
          children: [
            {
              path: 'order',
              name: 'order',
              meta: { title: '订单管理', icon: 'dashboard' }
            },
          ]
        },
        {
          path: '/dashboard',
          icon: 'star',
          name: '油站管理',
          children: [
            {
              path: 'dashboard',
              name: 'dashboard',
              meta: { title: '油站管理', icon: 'dashboard' }
            },
            // {
            //   path: 'addGasStation',
            //   name: 'addGasStation',
            //   meta: { title: '添加油站', icon: 'edit',}
            // },
          ]
        },
        {
          path: '/antenna',
          icon: 'edit',
          name: '天线管理',
          children: [
            {
              path: 'antennaList',
              name: 'antennaList',
              meta: { title: '天线管理', icon: 'dashboard' }
            },
            // {
            //   path: 'addAntenna',
            //   name: 'addAntenna',
            //   meta: { title: '添加天线', icon: 'edit',}
            // },
          ]
        },
        {
          path: '/merchant',
          name: '商户管理',
          icon: 'dashboard',
          children: [
            {
              path: 'brandList',
              name: 'brandList',
              meta: { title: '品牌管理', icon: 'star',}
            },
            {
              path: 'merchantList',
              name: 'merchantList',
              meta: { title: '商户管理', icon: 'star',}
            },
            // {
            //   path: 'addMerchant',
            //   name: 'addMerchant',
            //   meta: { title: '添加商户', icon: 'edit',}
            // },
          ]
        },
        {
          path: '/operation',
          name: '运营管理',
          icon: 'dashboard',
          children: [
            {
              path: 'authList',
              name: 'authList',
              meta: { title: '车主认证', icon: 'star' }
            },
            {
              path: 'suggestList',
              name: 'suggestList',
              meta: { title: '反馈信息', icon: 'star' }
            },
          ]
        },
        // {
        //   path: '/order',
        //   redirect: '/order/orderlist',
        //   alwaysShow: true, // will always show the root menu
        //   name: '订单管理',
        //   icon: 'list',
        //   children: [
        //     {
        //       path: 'orderlist',
        //       name: 'orderlist',
        //       meta: { title: '订单列表' }
        //     },
        //     {
        //       path: 'topUp',
        //       name: 'topUp',
        //       meta: { title: '批量充值' }
        //     },
        //     {
        //       path: 'deleteOrder',
        //       name: 'deleteOrder',
        //       meta: { title: '删除订单' }
        //     },
        //     {
        //       path: 'commission',
        //       name: 'commission',
        //       meta: { title: '佣金列表' }
        //     }
        //   ]
        // },
  /** when your routing map is too long, you can split it into small modules **/
  // 404 page must be placed at the end !!!
        { path: '*', redirect: '/404', hidden: true }
      ]
    }
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      // 'permission_routes',
      // 'menu',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
  .wanwu{
    height: 50px;
    color:#DFDFDF;
    font-size: 16px;
    text-align: center;
    line-height: 50px;
    background: #2b2f3a;
  }
  /deep/ .el-menu{
    border-right: none;
  }
</style>

