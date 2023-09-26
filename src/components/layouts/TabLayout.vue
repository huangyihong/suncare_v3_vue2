<template>
  <global-layout @dynamicRouterShow="dynamicRouterShow" @freshtab="freshtab">
    <template slot="header">
      <page-router-tab ref="routerTab"
                       @keyChange="val => routeKey = val"
      ></page-router-tab>
    </template>
    <div class="relative">
      <!--<transition name="page-transition">-->
        <keep-alive v-if="keepAlive" :max="30">
          <router-view :key="$route.fullPath + routeKey"/>
        </keep-alive  >
        <template v-else>
          <router-view/>
        </template>
      <!--</transition>-->
    </div>
  </global-layout>
</template>

<script>
  import GlobalLayout from '@/components/page/GlobalLayout'
  import PageRouterTab from '@/components/page/PageRouterTab'
  import { mixin, mixinDevice } from '@/utils/mixin'


  export default {
    name: 'TabLayout',
    components: {
      GlobalLayout,
      PageRouterTab,
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        excludes: [],
        routeKey: ''
      }
    },
    /* update_begin author:wuxianquan date:20190828 for: 关闭当前tab页，供子页面调用 ->望菜单能配置外链，直接弹出新页面而不是嵌入iframe #428 */
    provide(){
      return{
        closeCurrent: this.closeCurrent
      }
    },
    /* update_end author:wuxianquan date:20190828 for: 关闭当前tab页，供子页面调用->望菜单能配置外链，直接弹出新页面而不是嵌入iframe #428 */
    computed: {
      multipage() {
        //判断如果是手机模式，自动切换为单页面模式
        if (this.isMobile()) {
          return false
        } else {
          return this.$store.state.app.multipage
        }
      },
      isIframe(){
        return this.$store.state.app.isIframe
      },
      keepAlive () {
        return this.$route.meta.keepAlive || this.multipage
        // return false
      },
    },
    watch: {
    },
    methods: {
      freshtab(){
        // this.$refs.routerTab.routeReload()
        this.$refs.routerTab.reloadPage(routeKey)

      },
      closeCurrent(...arg){
        return this.$refs.routerTab.closeCurrent(...arg)
      },
    }
  }
</script>

<style lang="less">



</style>
