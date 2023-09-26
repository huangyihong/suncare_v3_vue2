<template>


    <a-popover
            trigger="click"
            placement="bottomRight"
            :autoAdjustOverflow="true"
            :arrowPointAtCenter="true"
            overlayClassName="header-notice-wrapper"
            @visibleChange="handleHoverChange"
            :overlayStyle="{ width: '300px', top: '50px' }">
        <template slot="content">
            <a-spin :spinning="loadding">
                <a-tabs>
                    <a-tab-pane :tab="msg1Title" key="1">
                        <!--<a-list>
                          <a-list-item>
                            <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                              <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                            </a-list-item-meta>
                          </a-list-item>
                          <a-list-item>
                            <a-list-item-meta title="你推荐的 IT大牛 已通过第三轮面试" description="一年前">
                              <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                            </a-list-item-meta>
                          </a-list-item>
                          <a-list-item>
                            <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                              <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                            </a-list-item-meta>
                          </a-list-item>
                        </a-list>-->
                        <a-list>
                            <a-list-item :key="index" v-for="(record, index) in announcement1">
                                <div style="margin-left: 5%;width: 80%">
                                    <p><a @click="showAnnouncement(record)">标题：{{ record.titile }}</a></p>
                                    <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }}
                                        发布</p>
                                </div>
                                <div style="text-align: right">
                                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'"
                                           color="blue">一般消息
                                    </a-tag>
                                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'"
                                           color="orange">重要消息
                                    </a-tag>
                                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'"
                                           color="red">紧急消息
                                    </a-tag>
                                </div>
                            </a-list-item>
                            <div style="margin-top: 5px;text-align: center">
                                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
                            </div>
                        </a-list>
                    </a-tab-pane>
                    <a-tab-pane :tab="msg2Title" key="2">
                        <a-list>
                            <a-list-item :key="index" v-for="(record, index) in announcement2">
                                <div style="margin-left: 5%;width: 80%">
                                    <p><a @click="showAnnouncement(record)">标题：{{ record.titile }}</a></p>
                                    <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }}
                                        发布</p>
                                </div>
                                <div style="text-align: right">
                                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'"
                                           color="blue">一般消息
                                    </a-tag>
                                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'"
                                           color="orange">重要消息
                                    </a-tag>
                                    <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'"
                                           color="red">紧急消息
                                    </a-tag>
                                </div>
                            </a-list-item>
                            <div style="margin-top: 5px;text-align: center">
                                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
                            </div>
                        </a-list>
                    </a-tab-pane>
                </a-tabs>
            </a-spin>
        </template>
        <a-popover :visible="tipVisible"
                   trigger="click">
            <div slot="content" style="width: 200px;line-height: 30px">
                <a-row>
                    <a-col :span="4">
                        <a-icon type="info-circle" class="m-t-6" style="font-size: 18px;color: green"/>
                    </a-col>
                    <a-col :span="20">
                        <p class="ellipsis-1 t-red">{{tipTitle}}</p>
                        <p class="ellipsis-1">{{tipText}}</p>
                    </a-col>
                </a-row>
                <!-- <div class="t-r">
                     <a @click="()=>{tipVisible=false}" class="m-r-20">关闭</a>
                     <a @click="()=>{$util.openTab(tipPath);tipVisible=false}">查看</a>

                 </div>-->
            </div>
            <span @click="fetchNotice" class="header-notice">
              <a-badge :count="msgTotal">
                <slot/>
              </a-badge>
             </span>
        </a-popover>
        <show-announcement ref="ShowAnnouncement" @ok="modalFormOk"></show-announcement>
    </a-popover>

</template>

<script>
  import { getAction, putAction } from '@/api/manage'
  import ShowAnnouncement from './ShowAnnouncement'
  import store from '@/store/'


  export default {
    name: "HeaderNotice",
    components: {
      ShowAnnouncement,
    },
    data() {
      return {
        loadding: false,
        url: {
          listCementByUser: "/sys/annountCement/listByUser",
          editCementSend: "/sys/sysAnnouncementSend/editByAnntIdAndUserId",
          queryById: "/sys/annountCement/queryById",
        },
        hovered: false,
        announcement1: [],
        announcement2: [],
        msg1Count: "0",
        msg2Count: "0",
        msg1Title: "通知(0)",
        msg2Title: "",
        stopTimer: false,
        websock: null,
        lockReconnect: false,
        isReconnect: false,
        heartCheck: null,
        oldMessageProp: () => {
        },
        tipVisible: false,
        tipTitle: '初审-判定完成',
        tipText: '批次：zly1201模型',
        tipPath: '',
        tipTimer: undefined
      }
    },
    computed: {
      msgTotal() {
        return parseInt(this.msg1Count) + parseInt(this.msg2Count);
      }
    },
    mounted() {
      this.loadData();
      //this.timerFun();
      this.initWebSocket();
      this.heartCheckFun();
    },
    beforeDestroy: function() { // 离开页面生命周期函数
      this.websocketclose();
      if (this.tipTimer) {
        clearTimeout(this.tipTimer)
      }
    },
    methods: {
      timerFun() {
        this.stopTimer = false;
        let myTimer = setInterval(() => {
          // 停止定时器
          if (this.stopTimer == true) {
            clearInterval(myTimer);
            return;
          }
          this.loadData()
        }, 6000)
      },
      loadData() {
        try {
          // 获取系统消息
          getAction(this.url.listCementByUser).then((res) => {
            if (res.success) {
              this.announcement1 = res.result.anntMsgList;
              this.msg1Count = res.result.anntMsgTotal;
              this.msg1Title = "通知(" + res.result.anntMsgTotal + ")";
              this.announcement2 = res.result.sysMsgList;
              this.msg2Count = res.result.sysMsgTotal;
              this.msg2Title = "系统消息(" + res.result.sysMsgTotal + ")";
              this.hovered = true
            }
          }).catch(error => {
            console.log("系统消息通知异常", error);//这行打印permissionName is undefined
            this.stopTimer = true;
            console.log("清理timer");
          });
        } catch (err) {
          this.stopTimer = true;
          console.log("通知异常", err);
        }
      },
      fetchNotice() {
        if (this.loadding) {
          this.loadding = false
          return
        }
        this.loadding = true
        setTimeout(() => {
          this.loadding = false
        }, 200)
      },
      showAnnouncement(record) {
        putAction(this.url.editCementSend, { anntId: record.id }).then((res) => {
          if (res.success) {
            this.loadData();
          }
        });
        this.hovered = false;
        this.$refs.ShowAnnouncement.detail(record);
      },
      toMyAnnouncement() {

        this.$router.push({
          path: '/isps/userAnnouncement',
          name: 'isps-userAnnouncement'
        });
      },
      modalFormOk() {
      },
      handleHoverChange(visible) {
        this.hovered = visible;
        if (visible && this.tipVisible) {
          this.tipVisible = false
        }
      },

      initWebSocket: function() {
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var userId = this.$store.getters.userInfo.id;
        /*       let url = his.$config['domianURL']
               if(url.startsWith('http')){
                 url = url.replace("https://","wss://").replace("http://","ws://")
               } else if(url.startsWith('/')){

               }*/
        // let url = this.$config['domianURL'].replace("https://","wss://").replace("http://","ws://")+"/websocket/"+userId;
        // let url = ((this.$config['localAddress'] || '') + this.$config['domianURL']).replace("https://", "wss://").replace("http://", "ws://") + "/websocket/" + userId;
        let url = this.$config['baseUrl']
        if (!url.startsWith('http')) {
          url = window.location.protocol+"//"+window.location.host + url
        }

        url = url.replace("https://", "wss://").replace("http://", "ws://") + "/websocket/" + userId;
        console.log('ws', url);
        this.websock = new WebSocket(url);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen: function() {
        if (this.isReconnect) {
          this.isReconnect = false
          // this.oldMessageProp()
          // setTimeout(() => {
          //   this.oldMessageProp = this.$message.success('重新连接成功')
          // }, 500)
        }

        console.log("WebSocket连接成功");
        //心跳检测重置
        this.heartCheck.reset().start();
      },
      websocketonerror: function(e) {
        this.reconnect();
      },
      websocketonmessage: function(e) {
        var data = eval("(" + e.data + ")"); //解析对象
        if (data.cmd === "topic") {
          //系统通知
          this.loadData();
        } else if (data.cmd === "user") {
          //用户消息
          this.loadData();
        } else if (data.cmd === 'async') {
          let { msgId: logId, msgTxt } = data
          this.tipVisible = true
          let [text, action] = msgTxt.split('\n')
          this.tipTitle = action
          this.tipText = text
          this.tipPath = '/task/taskAsyncActionLogList'
          if (this.tipTimer) {
            clearTimeout(this.tipTimer)
          }
          this.tipTimer = setTimeout(() => {
            this.tipVisible = false
            this.tipTimer = undefined
          }, 5000)
        } else if(data.cmd === 'my-examine'){
           this.$bus.$emit("my-examine",data)
        }

        //心跳检测重置
        this.heartCheck.reset().start();

      },
      websocketsend(text) { // 数据发送
        try {
          this.websock.send(text);
        } catch (err) {
          // console.log("send failed (" + err.code + ")");
          console.log("send failed ()");
        }
      },
      websocketclose: function(e) {
        console.log("connection closed ()");
        // this.oldMessageProp()
        // this.$message.error('网络连接失败，等待重连', 5.5)
        this.isReconnect = true
        // console.log("connection closed (" + e.code + ")");
        this.reconnect();
      },

      openNotification(data) {
        var text = data.msgTxt;
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: '消息提醒',
          placement: 'bottomRight',
          description: text,
          key,
          btn: (h) => {
            return h('a-button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.showDetail(key, data)
              }
            }, '查看详情')
          },
        });
      },

      reconnect() {
        var that = this;
        if (that.lockReconnect) return;
        that.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        setTimeout(function() {
          console.info("尝试重连...");
          // that.oldMessageProp = that.$message.loading('正在重新连接...', 0)
          that.initWebSocket();
          that.lockReconnect = false;
        }, 5000);
      },
      heartCheckFun() {
        var that = this;
        //心跳检测,每20s心跳一次
        that.heartCheck = {
          timeout: 20000,
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function() {
            clearTimeout(this.timeoutObj);
            //clearTimeout(this.serverTimeoutObj);
            return this;
          },
          start: function() {
            var self = this;
            this.timeoutObj = setTimeout(function() {
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              that.websocketsend("HeartBeat");
              // console.info("客户端发送心跳");
              //self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
              //  that.websock.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
              //}, self.timeout)
            }, this.timeout)
          }
        }
      },


      showDetail(key, data) {
        this.$notification.close(key);
        var id = data.msgId;
        getAction(this.url.queryById, { id: id }).then((res) => {
          if (res.success) {
            var record = res.result;
            this.showAnnouncement(record);
          }
        })

      },
    }
  }
</script>

<style lang="css">
    .header-notice-wrapper {
        top: 50px !important;
    }
</style>
<style lang="less" scoped>
    .header-notice {
        display: inline-block;
        transition: all 0.3s;

        span {
            vertical-align: initial;
        }
    }
</style>
