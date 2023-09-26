import { isURL } from '@/utils/validate'
import {domianURL} from '@/config'
// import { reject, resolve } from 'core-js/fn/promise'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  let index = Math.floor((Math.random() * arr.length))
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  var regPos = /^\d+(\.\d+)?$/
  if (regPos.test(value)) {
    //如果是数字
    let getDate = new Date(value)
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  } else {
    //TODO
    value = value.trim()
    return value.substr(0, fmt.length)
  }
}

// 生成首页路由
export function generateIndexRouter(data) {
  const children = generateChildRouters(data)
  if(!data.find(r => r.name === 'dashboard-workplace')){
    children.push({
      path: '/dashboard/workplace',
      name: 'dashboard-workplace',
      component: () => import('@/pages/dashboard/workplace'),
      meta: { title: '工作台', keepAlive: false, internalOrExternal: false }
    })
  }
  let indexRouter = [{
    path: '/',
    name: 'root',
    //component: () => import('@/components/layouts/BasicLayout'),
    component: resolve => require(['@/components/layouts/TabLayout'], resolve),
    meta: { title: '首页' },
    redirect: '/home',
    children: [
      ...children
    ]
  }, {
    'path': '*', 'redirect': '/404', 'hidden': true
  }]
  return indexRouter
}

// 生成嵌套路由（子路由）

function generateChildRouters(data) {
  let routers = []

  for (var item of data) {
    let component = ''
    if(item.component){
      if (item.component.indexOf('layouts') >= 0) {
        component = 'components/' + item.component
      } else if (item.component.indexOf('pages') >= 0) {
        component = item.component
      } else {
        component = 'views/' + item.component
      }
    }
    let config_this = {domianURL, 'taskRemote': ''}
    // eslint-disable-next-line
    /*let URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2.replace(/window._CONFIG/g, 'config_this'))) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      item.meta.url = URL
    }*/
    item.meta.url = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2.replace(/window._CONFIG/g, 'config_this'))) // URL支持{{ window.xxx }}占位符变量
    let menu = {
      path: item.path,
      name: item.name,
      redirect: item.redirect,
      component: resolve => require(['@/' + component + '.vue'], resolve),
      // component: () => import('@/' + component),
      hidden: item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        url: item.meta.url,
        permissionList: item.meta.permissionList,
        keepAlive: item.meta.keepAlive,
        /*update_begin author:wuxianquan date:20190908 for:赋值 */
        internalOrExternal: item.meta.internalOrExternal
        /*update_end author:wuxianquan date:20190908 for:赋值 */
      }
    }
    if (item.alwaysShow) {
      menu.alwaysShow = true
      menu.redirect = menu.path
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)]
    }
    //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    //判断是否生成路由
    if (item.route && item.route === '0') {
      //console.log(' 不生成路由 item.route：  '+item.route);
      //console.log(' 不生成路由 item.path：  '+item.path);
    } else {
      routers.push(menu)
    }
    //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
  }
  return routers
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    let [length] = arguments
    // 生成指定长度的随机数字，首位一定不是 0
    let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    let [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * 下划线转驼峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string) {
  return string.replace(/_([a-z])/g, function(all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 判断是否显示办理按钮
 * @param bpmStatus
 * @returns {*}
 */
export function showDealBtn(bpmStatus) {
  if (bpmStatus != '1' && bpmStatus != '3' && bpmStatus != '4') {
    return true
  }
  return false
}

/**
 * 增强CSS，可以在页面上输出全局css
 * @param css 要增强的css
 * @param id style标签的id，可以用来清除旧样式
 */
export function cssExpand(css, id) {
  let style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = `@charset "UTF-8"; ${css}`
  // 清除旧样式
  if (id) {
    let $style = document.getElementById(id)
    if ($style != null) $style.outerHTML = ''
    style.id = id
  }
  // 应用新样式
  document.head.appendChild(style)
}

/**
 * 16进制颜色转rgb
 * @param color
 * @returns {Array}
 */
export function toRgbArray(color) {
  // 16进制颜色值的正则
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 把颜色值变成小写
  color = color.toLowerCase()

  // 如果只有三位的值，需变成六位，如：#fff => #ffffff
  if (color.length === 4) {
    var colorNew = '#'
    for (var i = 1; i < 4; i += 1) {
      colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
    }
    color = colorNew
  }
  // 处理六位的颜色值，转为RGB
  var colorChange = []
  for (var i = 1; i < 7; i += 2) {
    colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
  }
  return colorChange
}
export function isUrl404(url){
    var xmlHttp = new XMLHttpRequest()
    return new Promise((resolve,reject)=>{     
      
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        if(xmlHttp.readyState==4) {
            if(xmlHttp.Status != 200) {
                console.log("不存在")
                resolve(false)
            }else{
                resolve(true)
            };
            return xmlHttp.Status==200;
        }
        return false;

    })
}