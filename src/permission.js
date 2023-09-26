import Vue from 'vue'
import router from './router'
import store from './store'

import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from '@/utils/util'
if(window.location.href.indexOf("prepro") > 0){
  Vue.prototype.$chatUrl = 'https://prepro.lingwww.com/intelligent_vue/'
}else{
  Vue.prototype.$chatUrl = 'https://ybjg.lingwww.com/intelligent_vue/'
}
//本地测试
// Vue.prototype.$chatUrl = 'http://localhost:9061/intelligent_vue/'
const whiteList = ['/user/login', '/user/register', '/user/register-result', '/user/alteration', '/test', '/403', '/404', '/500'] // no redirect whitelist
router.beforeEach((to, from, next) => {
  // console.log('beforeEach', to, from)
  // NProgress.start() // start progress bar
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/' })
      // NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {

        // 获取路由缓存，加速页面显示
       /* let oldMenuData = Vue.ls.get('MENU_DATA')
        if (oldMenuData) {
          store.commit('SET_PERMISSIONLIST', oldMenuData)
          let constRoutes = generateIndexRouter(oldMenuData)
          store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)

            const redirect = decodeURIComponent(from.query.redirect || to.path)
            console.log('跳转旧菜单', redirect)
            if (to.path === redirect) {
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
        }*/
        // 获取最新路由 并更新
        store.dispatch('GetPermissionList').then(res => {
          let systemCode = res.result.systemCode
          if(systemCode!==Vue.prototype.$config.systemCode){
            throw new Error('前后端系统编码不一致')
          }
          let menuData = res.result.menu

          if (menuData && menuData.length > 0) {
            // 添加路由缓存
            store.commit('SET_PERMISSIONLIST', menuData)
            Vue.ls.set('MENU_DATA', menuData)
          } else {
            throw new Error('getPermissionList: permissions must be a non-null array !')
          }

          let constRoutes = generateIndexRouter(menuData)
          // 更新路由
          store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)

            // if (!oldMenuData) {
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
    /*        } else {
              // 假如当前页已没有权限访问
              const route = router.currentRoute

              const findMenuIndex = function(array) {
                for (let i = 0, len = array.length; i < len; i++) {
                  let item = array[i]
                  if (item.path === route.path) {
                    return [i]
                  }
                  if (item.children) {
                    let childIndex = findMenuIndex(item.children)
                    if (Array.isArray(childIndex)) {
                      childIndex.unshift(i)
                      return childIndex
                    }
                  }
                }
                return -1
              }

              let index = findMenuIndex(menuData)
              console.log('index',index,route.path)

              if (index === -1 && route.path !== '/' && route.path !== '/home') {
                console.log('跳转', route.path)
                next({ path: '/' })
              }
            }*/

          })
        }).catch((e) => {
          notification.error({
            message: '系统提示',
            description: '请求用户信息失败，请重试！'
          })
          store.dispatch('Logout').then(() => {
            next({ path: '/user/login', query: { redirect: to.fullPath } })
          })
        })
      } else {
        next()
      }
    }
  } else {
    console.log(whiteList.indexOf(to.path), to.path)
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      // NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})
router.onError((error) => {
  /* console.log('error',error)
   router.replace({ path: '/404' })*/
})

router.afterEach((to, from) => {
  // NProgress.done() // finish progress bar
  Vue.prototype.$bus.$emit('scrollTop', 0)
})
/*
window.onpopstate = function (e) {
  console.log('onpopstate')

  window.localStorage.setItem('hasBack', '1')
}
*/


