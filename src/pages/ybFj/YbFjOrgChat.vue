<template>
  <div style="background-color: #f0f2f5">
    <a-row :gutter="16">
      <a-col :md="5" :sm="5" >
        <a-card  :bordered="false" style="min-height:800px;" class="m-t-10">
          <chat-file-list ref="chatFileList"></chat-file-list>
        </a-card>
      </a-col>
      <a-col :md="19" :sm="19" style="">
        <a-card  :bordered="false" class="m-t-10">
          <div class="chat-title">{{orgBean.orgName}}</div>
          <a-divider class="chat-divider"/>
          <div class="chat-content">
            <a-row :gutter="16">
              <a-col>
                <a-spin :spinning="loadingMore">
                  <div class="chat-desc" style="cursor: pointer" @click="loadMoreMessage()" v-if="hasMore">加载更多</div>
                </a-spin>
              </a-col>
            </a-row>
            <a-row :gutter="16" v-for="(item,index) in  messageList" :key="index">
              <a-col>
                <div class="chat-desc" v-if="index==0">{{formatChatTime(item.createTime)}}</div>
                <div class="chat-desc" v-else>{{formatChatTime(item.createTime,messageList[index-1].createTime)}}</div>
              </a-col>
              <template v-if="item.transferType=='sys'">
                <a-col :md="2" :sm="2">
                  <div class="disColumn" style="float: right" v-if="!(index>0&&item.transferType==messageList[index-1].transferType&&!isShowTime(item.createTime,messageList[index-1].createTime))">
                    <div class="avatar-img" :style="{backgroundImage: 'url(\'' + chatUserImg + '\')'}"></div>
                    <span class="t-c">监管联络员</span>
                  </div>
                </a-col>

                <a-col :md="22" :sm="22">
                  <div class="message-tip message-right" v-html="item.chatMsg" v-if="item.chatType=='txt'"></div>
                  <div class="message-tip message-right" v-else-if="item.chatType=='file'&&item.fileBean">
                    <a-popover placement="right">
                      <template slot="content">
                        <a @click="downloadFile(item.fileBean.fileId,item.fileBean.fileSrcname)">下载</a>
                      </template>
                      <file-img :fileType="item.fileBean.fileType"></file-img>
                      <span>{{item.fileBean.fileSrcname}}</span>
                    </a-popover>
                  </div>
                </a-col>
              </template>
              <template v-else>
                <a-col :md="22" :sm="22" class="t-r">
                  <div class="message-tip message-left" v-html="item.chatMsg" v-if="item.chatType=='txt'"></div>
                  <div class="message-tip message-left" v-else-if="item.chatType=='file'&&item.fileBean">
                    <a-popover placement="right">
                      <template slot="content">
                        <a @click="downloadFile(item.fileBean.fileId,item.fileBean.fileSrcname)">下载</a>
                      </template>
                      <file-img :fileType="item.fileBean.fileType"></file-img>
                      <span>{{item.fileBean.fileSrcname}}</span>
                    </a-popover>
                  </div>
                </a-col>
                <a-col :md="2" :sm="2" >
                  <div class="disColumn" v-if="!(index>0&&item.transferType==messageList[index-1].transferType&&!isShowTime(item.createTime,messageList[index-1].createTime))">
                    <div class="avatar-img" :style="{backgroundImage: 'url(\'' + hospImg + '\')'}" ></div>
                    <span style="width: 80px;">医院负责人({{item.createUsername}})</span>
                  </div>
                </a-col>

              </template>
            </a-row>
          </div>
          <div class="chat-desc">当前对话处于匿名状态，请注意不要泄露任何个人信息特征</div>
          <div class="chat-btn">
            <span class="m-l-30">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>文件发送</span>
                </template>
                <a-upload name="file"
                          :showUploadList="false"
                          :multiple="false"
                          :headers="tokenHeader"
                          :beforeUpload="beforeUpload"
                          :action="importFileUrl"
                          :data="{orgId:selectChatOrgId}"
                          @change="handleImportFile">
                      <img src="~@/assets/image/fjProject/folder.svg">
                </a-upload>
              </a-tooltip>
            </span>
          </div>
          <div style="height: 200px;width:100%">
            <div class="message-length"><span class="m-r-10">{{textValue.trim().length}}/1000</span></div>
            <a-textarea v-model="textValue" placeholder="请在下方输入文字" :maxLength="1000" class="message-textarea" @pressEnter="sendMsg"></a-textarea>
            <div class="t-r p-r-10">
              <a-button type="primary" @click="sendMsg" :disabled="textValue.trim().length<1||!selectChatOrgId">发送</a-button>
            </div>
          </div>
        </a-card>
      </a-col>

    </a-row>

  </div>
</template>

<script>
import { getAction,downFile } from '@/api/manage'
import {postAction as postAction_sv3} from '@/api-sv3/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import store from '@/store/'
import chatFileList from "./plugin/chatFileList"
import fileImg from "./plugin/fileImg"
import { downloadFileMixin } from './mixins/downloadMixin'
import { chatWebSocketMixin } from '@/mixins/webSocket/chatWebSocketMixin'
import { isShowTime,formatChatTime } from './mixins/formatChatTime'

export default {
  name: "YbFjOrgChat",
  mixins: [downloadFileMixin,chatWebSocketMixin],
  components: {
    chatFileList,
    fileImg
  },
  data() {
    return {
      title:'医院端聊天',
      chatUserImg: require('@/assets/image/fjProject/chat-user.svg'),
      hospImg: require('@/assets/image/fjProject/hosp.svg'),
      textValue:'',

      messageList:[],

      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      confirmLoading:false,
      importUrl:'',

      url:{
        chatAddOrg:'/fj/chat/org/add',
        messageList:'/fj/chat/log/list',
        sendMsg:'/fj/chat/log/client/send',
        sendFile:'/fj/chat/log/client/sendFile',
        queryByUserid:'/fj/org/queryByUserid',
        downloadFile:'/fj/chat/file/download',
      },
      orgBean:{},
      selectChatOrgId:undefined,//聊天医院
      loadingMore:false,//加载更多
      hasMore:true,
      messagePageNo:1,
      messagePageSize:10,

    }
  },
  computed: {
    importFileUrl: function() {
      if(!this.url.sendFile.startsWith('http')){
        return `${this.$config['domianURL']}/${this.url.sendFile}`
      }
      return this.url.sendFile;
    },

  },
  beforeMount() {
    this.loadData()
  },

  activated() {
    this.handleScrollBottom()
  },
  methods: {
    isShowTime,formatChatTime,
    async loadData() {
      let res = await getAction(this.url.queryByUserid,  {userId:this.$store.getters.userInfo.id})
      if (res.success) {
        if(res.result){
          this.orgBean = res.result
          this.selectChatOrgId = this.orgBean.orgId
        }else{
          this.$message.warning('当前用户未设置负责医院');
          return
        }

      } else {
        this.$message.warning(res.message);
        return
      }
      this.$refs.chatFileList.loadData(this.selectChatOrgId)
      this.loadMessageList()
    },
    sendMsg(){
      if(this.textValue&&this.textValue.trim().length>0&&this.selectChatOrgId){
        let chatMsg = this.textValue.trim()
        postAction_sv3(this.url.sendMsg, {chatMsg,orgId:this.selectChatOrgId}).then(res => {
          if (res.success) {
            this.textValue = ''
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 滚动到底部
    handleScrollBottom(height=0) {
      this.$nextTick(() => {
        setTimeout(() => {
          let chatContentDiv  = this.$el.querySelector('.chat-content')
          if(chatContentDiv&&chatContentDiv.scrollHeight){
            chatContentDiv.scrollTop = chatContentDiv.scrollHeight-height
          }
        }, 10)
      });
    },

    loadMessageList(){
      this.hasMore = true
      this.messagePageNo = 1
      this.messageList = []
      let params = {}
      params.orgId = this.selectChatOrgId
      params.pageSize = this.messagePageSize
      params.pageNo = this.messagePageNo
      getAction(this.url.messageList, params).then((res) => {
        if (res.success) {
          let dataList =res.result.records
          if(dataList.length==0||dataList.length<this.messagePageSize){
            this.hasMore = false
          }
          this.messageList = dataList.reverse()
          this.messageList.forEach(item=>{
            if(item.chatType=='file'){
              item.fileBean = JSON.parse(item.chatMsg)
            }
          })
          this.handleScrollBottom()
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //更多消息
    loadMoreMessage(){
      this.messagePageNo ++
      let params = {}
      params.orgId = this.selectChatOrgId
      params.pageSize = this.messagePageSize
      params.pageNo = this.messagePageNo
      this.loadingMore = true
      let prevHeight = this.$el.querySelector('.chat-content').scrollHeight;//上次高度
      getAction(this.url.messageList, params).then((res) => {
        if (res.success) {
          let dataList =res.result.records
          if(dataList.length==0||dataList.length<this.messagePageSize){
            this.hasMore = false
          }
          let that = this
          dataList.forEach(item=>{
            if(item.chatType=='file'){
              item.fileBean = JSON.parse(item.chatMsg)
            }
            that.messageList.unshift(item)
          })
          this.handleScrollBottom(prevHeight)
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.loadingMore = false
      })
    },

    beforeUpload() {
      if(this.selectChatOrgId){
        return true
      }
      return false
    },

    /* 导入 */
    handleImportFile(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        let res = info.file.response
        if (res.success) {

        } else {
          this.$notification.error({
            message: '文件上传失败',
            description:
              `${res.message} `,
          });
        }
        this.confirmLoading = false;
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.response.message} `);
        this.confirmLoading = false;
      }
    },

    /* 下载 */
    downloadFile(fileId,fileName){
      this.downloadFileAction(this.url.downloadFile,{fileId},fileName)
    },

    //websocket获取信息
    websocketonmessage: function(e) {
      var data = eval("(" + e.data + ")"); //解析对象
      if (data.cmd === 'fjSys'||data.cmd === 'fjOrg') {
        if(data.orgId==this.selectChatOrgId){
          let item = data.msgTxt
          if(item.chatType=='file'){
            item.fileBean = JSON.parse(item.chatMsg)
          }
          this.messageList.push(item)
          this.handleScrollBottom()
        }
      }
      //心跳检测重置
      this.heartCheck.reset().start();

    },

  }
}
</script>
<style lang="less" scoped>
  .disRow {
    display: flex;
    flex-direction: row
  }

  .disCC {
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .disColumn {
    display: flex;
    flex-direction: column
  }

  .selectColor{
    background-color:#bbd9ef66;
  }

  .text-ellipsis{
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }

  .chat-title{
    font-weight: 700;
    font-size: 16px;
  }
  .chat-content{
    height:400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 20px;
  }
  .chat-divider{
    height: 2px;
    background-color: #b1d8f3
  }
  .chat-desc{
    width:100%;
    text-align: center;
    font-size: 12px;
    color:#00000059;
    margin-bottom: 6px
  }
  .imgBox {
    width: 30px;
    margin-right: 12px;
  }
  .chat-btn{
    background-color: #b1d8f3;
    height:60px;
    line-height: 60px;
  }
  .message-length{
    position: relative;
    user-select: none;
    z-index: 999;
    text-align: right;
  }
  .message-textarea{
    margin-top: -20px;
    height: 160px;
    width: 100%;
    padding: 20px;
    border: none;
    outline: none;
    box-shadow: 0 0 0 0 white;
  }

  .message-tip {
    text-align: center;
    word-break: break-all;
    border-radius: 10px;
    font-family: sans-serif;
    padding: 10px;
    width:auto;
    display:inline-block !important;
    display:inline;
    margin-top:10px;
  }
  .message-right {
    background-color: #e2eff8;
  }
  .message-left {
    background-color:#ffffff;
    box-shadow: 0px 0px 2px 2px #f3fbff;
  }
  .avatar-img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #bdddf4;
    background-position:50% 50%;
    background-repeat:no-repeat;
    overflow: hidden;
  }

</style>