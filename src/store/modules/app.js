import Vue from 'vue'
import {
  SIDEBAR_TYPE,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR,
  DEFAULT_COLOR_WEAK,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"

const app = {
  state: {
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: 'desktop',
    theme: '',
    layout: '',
    contentWidth: '',
    fixedHeader: false,
    fixSiderbar: false,
    autoHideHeader: false,
    color: null,
    weak: false,
    multipage: true, //默认多页签模式
    commitSave: false,
    grid: 5,
    gridType: 'xl',
    width: 0,
    height: 0,
    modalMax: false,
    isIframe: false,
    orgImportGp:false,
  },
  mutations: {
    ORG_IMPORT_GP: (state, type) => {
      state.orgImportGp=type
    },
    SET_SIDEBAR_TYPE: (state, type) => {
      state.sidebar.opened = type
      if(state.commitSave){
        Vue.ls.set(SIDEBAR_TYPE, type)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      if(state.commitSave){
        Vue.ls.set(SIDEBAR_TYPE, true)
      }
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    TOGGLE_THEME: (state, theme) => {
      // setStore('_DEFAULT_THEME', theme)
      if(state.commitSave){
        Vue.ls.set(DEFAULT_THEME, theme)
      }
      state.theme = theme
    },
    TOGGLE_LAYOUT_MODE: (state, layout) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_LAYOUT_MODE, layout)
      }
      state.layout = layout
    },
    TOGGLE_FIXED_HEADER: (state, fixed) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_FIXED_HEADER, fixed)
      }
      state.fixedHeader = fixed
    },
    TOGGLE_FIXED_SIDERBAR: (state, fixed) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_FIXED_SIDEMENU, fixed)
      }
      state.fixSiderbar = fixed
    },
    TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show)
      }
      state.autoHideHeader = show
    },
    TOGGLE_CONTENT_WIDTH: (state, type) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_CONTENT_WIDTH_TYPE, type)
      }
      state.contentWidth = type
    },
    TOGGLE_COLOR: (state, color) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_COLOR, color)
      }
      state.color = color
    },
    TOGGLE_WEAK: (state, flag) => {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_COLOR_WEAK, flag)
      }
      state.weak = flag
    },
    SET_MULTI_PAGE (state, multipageFlag) {
      if(state.commitSave){
        Vue.ls.set(DEFAULT_MULTI_PAGE, multipageFlag)
      }
      state.multipage = multipageFlag
    },
    SET_COMMIT_SAVE (state, save) {
      state.commitSave = save
    },
    SET_GRID (state, {grid,gridType}) {
      state.grid = grid
      state.gridType = gridType
    },
    SET_RECT (state, {width,height}) {
      state.width = width
      state.height = height
    },
    SET_MODAL_MAX (state, isMax) {
      state.modalMax = isMax
    },
    SET_IFRAME (state, isIframe) {
      state.isIframe = isIframe
    }
  },
  actions: {
    setSidebar: ({ commit }, type) => {
      commit('SET_SIDEBAR_TYPE', type)
    },
    CloseSidebar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleTheme({ commit }, theme) {
      commit('TOGGLE_THEME', theme)
    },
    ToggleLayoutMode({ commit }, mode) {
      commit('TOGGLE_LAYOUT_MODE', mode)
    },
    ToggleFixedHeader({ commit }, fixedHeader) {
      if (!fixedHeader) {
        commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
      }
      commit('TOGGLE_FIXED_HEADER', fixedHeader)
    },
    ToggleFixSiderbar({ commit }, fixSiderbar) {
      commit( 'TOGGLE_FIXED_SIDERBAR', fixSiderbar)
    },
    ToggleFixedHeaderHidden({ commit }, show) {
      commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
    },
    ToggleContentWidth({ commit }, type) {
      commit('TOGGLE_CONTENT_WIDTH', type)
    },
    ToggleColor({ commit }, color) {
      commit('TOGGLE_COLOR', color)
    },
    ToggleWeak({ commit }, weakFlag) {
      commit('TOGGLE_WEAK', weakFlag)
    },
    ToggleMultipage({ commit }, multipageFlag) {
      commit('SET_MULTI_PAGE', multipageFlag)
    },
    setCommitSave({ commit }, save) {
      commit('SET_COMMIT_SAVE', save)
    }
  }
}

export default app