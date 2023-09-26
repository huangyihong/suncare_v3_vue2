import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
import { toRgbArray } from '@/utils/util'

const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => Vue.prototype.$util.toImgPath(state.user.avatar),
  username: state => state.user.username,
  nickname: state => state.user.realname,
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  rgbColor: state => {
    let color = state.app.rgbColor
    if (!color) {
      color = state.app.rgbColor = toRgbArray(state.app.color).join(',')
    }
    return color
  },
  grid: state => state.app.grid,
  width: state => state.app.width,
  height: state => state.app.height,
  colDict: state => state.cache.colDict,
  modalMax: state => state.app.modalMax,
  isIframe: state => state.app.isIframe,

}

export default getters