/* eslint-disable no-undef */
// 引入核心文件
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js'
);

// 设置缓存名称前缀
workbox.core.setCacheNameDetails({ prefix: 'sv3-v0.01' });

/*
    一下两个接口对应 service worker 中的
    self.skipWaiting() 强制等待中的 Service Worker 被激活
    self.clients.claim() 新的 Service Worker 被激活后使其立即获得页面控制权
 */

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.suppressWarnings();

// precacheAndRoute 预缓存静态文件
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

/*
    registerRoute 路由请求缓存
    第一个参数可以是正则、完整路径字符串、或者是返回布尔值的函数
    第二个参数 workbox.strategies.networkFirst() 是一个路由缓存策略，用来确定资源缓存方式
 */

workbox.routing.registerRoute(
  // new RegExp('.*.js'),
  new RegExp('.*.(?:js|svg)'),
  workbox.strategies.networkFirst()
);