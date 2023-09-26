import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import store from './store'
import '@/permission' // permission control
import '@/utils/filter' // base filter
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'
import '@/assets/less/developer.less'
import '@/assets/less/public.css'

import Antd from 'ant-design-vue'
import { Table as AtTable } from 'ant-design-vue';
import Storage from 'vue-ls'
import vueBus from '@/utils/vueBus';
import Viser from 'viser-vue'
import VueDraggableResizable from 'vue-draggable-resizable';
import echarts from 'echarts'
import hasPermission from '@/utils/hasPermission'

import configObj from './config'
import './registerSW' // PWA 的sw缓存注册
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Antd)
Vue.config.silent = true
// 引入 vxe-table
import XEUtils from 'xe-utils'
import {
  // 核心
  VXETable,
  // 功能模块
  Icon,
  Button,
  Header,
  // Input,
  Keyboard,
  Tooltip,
  // 可选组件
  Column,
  // Pager,
  // Select,
  Toolbar,
  // 表格
  Table,
  Grid,
} from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
// 按需加载的方式默认是不带国际化的，自定义国际化需要自行解析占位符 '{0}'，例如：
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})
// 表格功能
Vue.use(Header)
  .use(Icon)
  .use(Button)
  .use(Tooltip)
  // .use(Input)
  .use(Keyboard)
  .use(Column)
  // .use(Pager)
  // .use(Select)
  .use(Toolbar)
  .use(Table)
  .use(Grid)

let $configObj
if(process.env.NODE_ENV ==='production'){
  Vue.prototype.$config = $configObj = configInitFunction()
} else {
  Vue.prototype.$config = $configObj = configObj
}

Vue.component('vue-draggable-resizable', VueDraggableResizable);

require('echarts/theme/macarons') // echarts theme
Vue.prototype.$echarts = echarts

Vue.use(Viser)

Vue.use(Storage, config.storageOptions)

Vue.use(vueBus);
Vue.use(hasPermission)

// 自定义全局组件
import MModal from '@/components/tools/MModal'
Vue.component('MModal', MModal);
import JInput from '@/components/jeecg/JInput'
Vue.component('JInput', JInput);
import JEllipsis from '@/components/jeecg/JEllipsis'
Vue.component('JEllipsis', JEllipsis);
import JDate from '@/components/jeecg/JDate'
Vue.component('JDate', JDate);

import MTable from '@/components/table/MTable'
// Vue.component('MTable', MTable);
Vue.component('ATable', MTable);


Vue.component('AtTable', AtTable);

//图片预览
import VueImageSwipe from 'vue-image-swipe'
import 'vue-image-swipe/dist/vue-image-swipe.css'
Vue.use(VueImageSwipe)
Vue.config.productionTip = false

Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})


import '@/assets/less/devAnt.less'
import '@/assets/less/devVex.less'



import {
  USER_INFO,
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'

import Loading from '@/components/Loading'
Vue.component('DefLoading', Loading);

import { Spin } from 'ant-design-vue';
// 全局loading样式
Spin.setDefaultIndicator({
  indicator:  h => {
      // return <a-icon type="loading" style="font-size: 24px" spin />;
      return <def-loading/>;
  },
});
import { VueAxios } from "@/utils/request"
Vue.use(VueAxios,router,store, $configObj.baseUrl)

import { VueAxios as riskportalRequest  } from "@/utils/riskportalRequest"
Vue.use(riskportalRequest,router,store, $configObj.riskportalBaseUrl)

import {global} from "@/utils/utils-sv3"
Vue.use(global, router, store)

// 节流
import throttle from 'lodash/throttle'
window.onresize = throttle(function () {
  let grid,gridType;
  let {clientWidth:width, clientHeight:height} = document.body;
  if(width < 576){
    grid = 1;gridType = 'xs'
  } else if(width < 768){
    grid = 2;gridType = 'sm'
  } else if(width < 992){
    grid = 3;gridType = 'md'
  } else if(width < 1200){
    grid = 4;gridType = 'lg'
  } else if(width < 1600){
    grid = 5;gridType = 'xl'
  } else {
    grid = 6;gridType = 'xxl'
  }
  store.commit('SET_GRID', {grid,gridType})
  store.commit('SET_RECT', {width,height})
},800)

window.onresize()
// 重写方法

Number.prototype.toFixed = function (exponent) {
  return parseInt(this * Math.pow(10, exponent) + 0.5) / Math.pow(10, exponent);
}

store.commit('SET_COMMIT_SAVE', false) // 以下操作不保存到缓存
store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
store.commit('SET_MULTI_PAGE', Vue.ls.get(DEFAULT_MULTI_PAGE,config.multipage))
store.commit('SET_COMMIT_SAVE', true)
store.commit('SET_INFO', Vue.ls.get(USER_INFO,{}))

console.time("start")
const app = new Vue({
  router,
  store,
  mounted(){
    console.timeEnd("start")
  },
  render: h => h(App),
})

router.onReady(() => {
  app.$mount('#app')
})

