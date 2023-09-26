
const loadingObj = {}
const cache = {
  state: {
    colDict: {},
    colConfig: {},
  },
  mutations: {
    SET_CACHE: (state, {key, data}) => {
      state[key] = data
    },
    SET_COL_CONFIG (state, colConfig) {
      let {cols } = colConfig
      let tempColsObjDict = {}
      for (let item of cols) {
        let colId = item.tabName + ':' + item.colName
        item.colId = colId
        tempColsObjDict[colId] = item;
      }
      state.colDict = tempColsObjDict
      state.colConfig = colConfig
    },
    RESET_COL_CONFIG(state){
      state.colDict = {}
      state.colConfig = {}
    },
    CLEAR_CACHE(state,key){
      delete state[key]
    }
  },
  actions: {
    //  这里面的方法都是异步   同时请求同个key只会使用第一个的获取方法
    async GetCacheAsync({ commit, state }, { key, func }) {
      let data = state[key]
      if (data) {
        return data
      } else {
        let result
        let awaitFun = loadingObj[key]
        if(awaitFun) {
          result = await awaitFun
        } else {
          awaitFun = loadingObj[key] = new Promise(func)
          result = await awaitFun
          delete loadingObj[key]
        }
        commit('SET_CACHE', { key, data: result })
        return result
      }

    },
  }
}

export default cache