import Vue from 'vue'
import store from '@/store/'


export const chatWebSocketMixin = {
  data(){
    return {
      websock: null,
      lockReconnect: false,
      isReconnect: false,
      heartCheck: null,
    }
  },
  beforeDestroy: function() { // 离开页面生命周期函数
    this.websocketclose();
    if (this.tipTimer) {
      clearTimeout(this.tipTimer)
    }
  },
  beforeMount() {
    this.initWebSocket();
    this.heartCheckFun();
  },
  methods: {
    initWebSocket: function() {
      var userId = this.$store.getters.userInfo.id
      let url = this.$config['baseUrl']
      if (!url.startsWith('http') && !url.startsWith('https')) {
        url = window.location.protocol + '//' + window.location.host + url
      }
      url = url.replace('https://', 'wss://').replace('http://', 'ws://') + '/websocket/' + userId
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen: function() {
      if (this.isReconnect) {
        this.isReconnect = false
      }
      //心跳检测重置
      this.heartCheck.reset().start();
    },
    websocketonerror: function(e) {
      this.reconnect();
    },
    websocketonmessage: function(e) {

    },
    websocketsend(text) { // 数据发送
      try {
        this.websock.send(text);
      } catch (err) {
        console.log("send failed ()");
      }
    },
    websocketclose: function(e) {
      this.isReconnect = true
      this.reconnect();
    },
    reconnect() {
      var that = this;
      if (that.lockReconnect) return;
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function() {
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    heartCheckFun() {
      var that = this
      //心跳检测,每20s心跳一次
      that.heartCheck = {
        timeout: 20000,
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj)
          return this
        },
        start: function () {
          var self = this
          this.timeoutObj = setTimeout(function () {
            that.websocketsend('HeartBeat')
          }, this.timeout)
        },
      }
    },
  }

}


