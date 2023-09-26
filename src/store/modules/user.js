import Vue from 'vue'
import { login, logout, phoneLogin } from '@/api/login'
import { ACCESS_TOKEN, USER_NAME, USER_INFO, USER_AUTH, SYS_BUTTON_AUTH,DATA_SOURCE } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { queryPermissionsByUser } from '@/api/api'
import { getAction } from '@/api/manage'
import { showImg } from '@/api-sv3/api'

const updateUser = (commit, userInfo) => {
  Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
  Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
  commit('SET_INFO', userInfo)
}
const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      console.log('SET_INFO', info)

      state.info = info
      state.username = info.username
      state.realname = info.realname
      state.welcome = welcome()
      state.avatar = info.avatar

      if(Vue.prototype.$config[info.dataSource]){
        Vue.prototype.$suncare_v3 = Vue.prototype.$config[info.dataSource].suncare_v3
        Vue.prototype.$riskportal_solr = Vue.prototype.$config[info.dataSource].riskportal_solr
      }else if(info.dataSourceInfo){
        Vue.prototype.$suncare_v3 = info.dataSourceInfo.suncareV3Url?info.dataSourceInfo.suncareV3Url:''
        Vue.prototype.$riskportal_solr = info.dataSourceInfo.suncareV3Url?info.dataSourceInfo.suncareV3Url:''
      }
      //判断是否为gp数据源
      let gp_database = ""
      if(info.dataSourceInfo&&!info.dataSourceInfo.solrAddr){
        gp_database = "/gp"
      }
      Vue.prototype.$gp_database =gp_database



    },
  },

  actions: {
    // CAS验证登录
    ValidateLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        getAction('/cas/client/validateLogin', userInfo).then(response => {
          console.log('----cas 登录--------', response)
          if (response.success) {
            const result = response.result
            const userInfo = result.userInfo
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            updateUser(commit, userInfo)
            resolve(response)
          } else {
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          if (response.success) {
            /* const result = response.result
             const userInfo = result.userInfo
             Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
             Vue.ls.set(DATA_SOURCE, params.dataSource)
             commit('SET_TOKEN', result.token)
             updateUser(commit, userInfo)*/
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateUser({ commit }, userInfo) {
      updateUser(commit, userInfo)
    },
    //手机号登录
    PhoneLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        phoneLogin(userInfo).then(response => {
          if (response.code == '200') {
            const result = response.result
            const userInfo = result.userInfo
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            updateUser(commit, userInfo)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        let v_token = Vue.ls.get(ACCESS_TOKEN)
        let params = { token: v_token }
        queryPermissionsByUser(params).then(response => {
          const menuData = response.result.menu
          const authData = response.result.auth
          const allAuthData = response.result.allAuth
          //Vue.ls.set(USER_AUTH,authData);
          sessionStorage.setItem(USER_AUTH, JSON.stringify(authData))
          sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
          /*if (menuData && menuData.length > 0) {
            commit('SET_PERMISSIONLIST', menuData)
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }*/
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        let logoutToken = state.token
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove("MENU_DATA")
        //console.log('logoutToken: '+ logoutToken)
        logout(logoutToken).then(() => {
          //var sevice = "http://"+window.location.host+"/";
          //var serviceUrl = encodeURIComponent(sevice);
          //window.location.href = this.$config['casPrefixUrl']+"/logout?service="+serviceUrl;
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
