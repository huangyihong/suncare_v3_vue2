/**
 * 字典 util
 * author: scott
 * date: 20190109
 */

import { querySysDictByType, querySysDictByTypes, queryValByTypeKey } from '@/api-sv3/api'
import { getAction } from '@/api/manage'

/**
 * 获取字典数组
 * @param dictCode 字典Code
 * @return List<Map>
 */
export async function initDictOptions(dictCode, store) {
  if (store) {
    let data = await store.dispatch('GetCacheAsync', {
      key: 'MDict_' + dictCode, func: async resolve => {
        resolve(await queryDictOptionsDebounce(dictCode))
      }
    })
    return [...data]
  } else {
    //获取字典数组
    return await queryDictOptionsDebounce(dictCode)
  }
}

export async function queryDictOptions(dictCode) {
  let res = await querySysDictByType({ type: dictCode })
  if (res.success) {
    return res.result
  } else {
    throw res.message
  }
}


let timeRangeContainer = undefined
let timeRangePromise
let timeRangeLong = 30
// 防抖请求30毫秒之内的字典
async function queryDictOptionsDebounce(dictCode) {
    if(!timeRangeContainer){
      timeRangeContainer = [dictCode]
      timeRangePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          let types = timeRangeContainer.join(',')
          timeRangeContainer = undefined
          querySysDictByTypes({ types}).then(res => {
            if (res.success) {
              resolve(res.result)
            } else {
              reject(res.message)
            }
          })
        }, timeRangeLong)
      })
    } else {
      timeRangeContainer.push(dictCode)
    }

    let dataMap = await timeRangePromise
    return dataMap[dictCode]
}

export async function queryDictValue(dictCode,code,store) {
  let dict = await store.dispatch('GetCacheAsync', {
    key: 'MDict_' + dictCode, func: async resolve => {
      resolve(await queryDictOptions(dictCode))
    }
  })
  return filterDictText(dict,code)
}

/**
 * 字典值替换文本通用方法
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterDictText(dictOptions, text) {
  let option = dictOptions.find(option => option.code === text)
  return option?option.value:text
}

/**
 * 字典值替换文本通用方法(多选)
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterMultiDictText(dictOptions, text) {
  if (!text || !dictOptions || dictOptions.length == 0) {
    return ''
  }
  let re = ''
  let arr = text.split(',')
  dictOptions.forEach(function(option) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === option.code) {
        re += option.value + ','
        break
      }
    }
  })
  if (re == '') {
    return ''
  }
  return re.substring(0, re.length - 1)
}

/**
 * 翻译字段值对应的文本
 * @param children
 * @returns string
 */
export async function ajaxFilterDictText(dictCode, key) {
  if (!dictCode) {
    return '字典Code不能为空!'
  }
  //console.log(`key : ${key}`);
  if (!key) {
    return ''
  }
  //通过请求读取字典文本
  let res = await queryValByTypeKey({ type: dictCode, code: key })
  if (res.success) {
    // console.log('restult: '+ res.result);
    return res.result
  } else {
    return ''
  }
}
