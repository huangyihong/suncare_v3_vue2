import {publicPath} from '@/config'
import { showImg } from '@/api/api'
import { initDictOptions,filterDictText } from '@/components/dict_medical/DictSelectUtil'
import Qs from 'qs'

/* 产引入jsencrypt实现数据RSA加密 */
import JSEncrypt from 'jsencrypt' // 处理长文本数据时报错 jsencrypt.js Message too long for RSA
/* 产引入encryptlong实现数据RSA加密 */
// import Encrypt from 'encryptlong' // encryptlong是基于jsencrypt扩展的长文本分段加解密功能。

let router, store
const logoUrl = publicPath + '/logo.png'

/*

* 在vue页面中使用this.$util 调用
* */
export const global = {
  install(Vue, g_router, g_store) {
    router = g_router
    store = g_store
    Vue.prototype.$util = {
      initDict: async (dictCode) =>{
        if(Array.isArray(dictCode)) {
          let results = await Promise.all(dictCode.map(code => initDictOptions(code,store)))
          let obj = {}
          for(let [index,code] of dictCode.entries()){
            obj[code] = results[index]
          }
          return obj
        } else {
          return await initDictOptions(dictCode,store)
        }
      },
      toImgPath: (path) => path ? showImg(path) : logoUrl,
      goBack: () => {
        router.back()
      },
      setCache(key,data){
        store.commit('SET_CACHE', {key,data})
      },
      clearCache(key){
        store.commit('CLEAR_CACHE', key)
      },
      getCacheAsync: async (key,setCacheFun)=>{
        return await store.dispatch('GetCacheAsync', { key, func: resolve => {
          if(setCacheFun)
            setCacheFun(resolve)
          }
        })
      },
      getCache: (key)=>{
        return store.state.cache[key]
      },
      openTab(url, query){
        if(url.indexOf("/") !== 0){
          url = '/'+ url
        }
        console.log('openTab',url)
        if(store.state.app.multipage){
          router.push({path: url,query})
        } else {

          let suffix = query?'?' + Qs.stringify(query):''
          window.open(publicPath + url + suffix)
        }
      },
    }
  }
}
/* JSEncrypt加密 */
export const rsaEncrypt = (data) => {
  // 公钥key
  const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6xhF8f8wufQtG9zMq9doqjYRPgmvS0y8cvyMmqKLY/c9p4a1y+QGaTiy5QaYMUW30f2R1TDjF6NX7GIt0hajwjvVLt3LiLTbQQbrYBOhhgTx6g0N/x9CptEPMbJxI/RRlmnkH+mSOGvxE1oLpQnfD+potsAVij8zfjLPFDvwGCwIDAQAB';
  const jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(publicKey)
  // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
  const result = jsencrypt.encrypt(data)
  return result
};
