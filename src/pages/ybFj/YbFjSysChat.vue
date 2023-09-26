<template>
  <div style="background-color: #f0f2f5">
    <a-row :gutter="16">
      <a-col :md="6" :sm="6" >
        <a-card  :bordered="false" style="min-height:800px;" class="m-t-10">
          <a-button type="primary" @click="selectVisible = true" style="width:100%">新建医院交流</a-button>
          <div style="font-size:16px;font-weight:bold" class="m-t-20">医院历史交流记录</div>
          <div class="m-t-10 disRow">
            <a-select v-model="searchField" style="width: 160px">
              <a-select-option value="orgName"> 医院名称 </a-select-option>

            </a-select>
            <a-input-search class="m-l-10" v-model="searchValue" @search="onSearch"></a-input-search>
          </div>

          <!-- 聊天列表 -->
          <template v-for="(item,index) in chatOrgList" >
            <div class="list-box m-t-10" :class="[item.orgId == selectChatOrgId ? 'selectColor' : '']" @click="selectChatOrg(item.orgId)">
              <div class="disCC">
                <span class="list-title text-ellipsis">{{item.orgName}}</span>
                <span class="list-des">本次对话匿名加密</span>
              </div>
              <div class="disCC ft-10 m-t-6">
                <span class="text-ellipsis">{{item.responsible}}（医院负责人)</span>
                <div style="width:160px;" v-if="item.chatTime">
                  <span class="m-r-20">最新对话</span>
                  <span>{{item.chatTime.substring(0,10)}}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 分页 -->
          <a-pagination size="small" :current="current" :total="totalPage" :page-size="10" @change="changePage" v-if="totalPage > 0" class="m-t-10 t-r" />
        </a-card>
      </a-col>
      <a-col :md="18" :sm="18" style="">
        <a-card  :bordered="false" class="m-t-10" v-if="orgBean.orgId">
          <div class="chat-title">{{orgBean.orgName}} <a-icon type="eye-invisible" class="m-l-50"/></div>
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
                <a-col :md="22" :sm="22" class="t-r">
                  <div class="message-tip message-left" v-html="item.chatMsg" v-if="item.chatType=='txt'"></div>
                  <div class="message-tip message-left" v-else-if="item.chatType=='file'&&item.fileBean">
                    <a-popover placement="right">
                      <template slot="content">
                        <a @click="downloadFile(item.fileBean.fileId,item.fileBean.fileSrcname)">下载</a>
                      </template>
                      <file-img :fileType="item.fileBean.fileType"></file-img>
                      {{item.fileBean.fileSrcname}}
                    </a-popover>
                  </div>
                </a-col>
                <a-col :md="2" :sm="2" >
                  <div class="disColumn" v-if="!(index>0&&item.transferType==messageList[index-1].transferType&&!isShowTime(item.createTime,messageList[index-1].createTime))">
                    <div class="avatar-img" :style="{backgroundImage: 'url(\'' + chatUserImg + '\')'}" ></div>
                    <span style="width: 80px;">监管联络人({{item.createUsername}})</span>
                  </div>

                </a-col>
              </template>
              <template v-else>
                <a-col :md="2" :sm="2">
                  <div class="disColumn" v-if="!(index>0&&item.transferType==messageList[index-1].transferType&&!isShowTime(item.createTime,messageList[index-1].createTime))">
                    <div class="avatar-img m-l-10" :style="{backgroundImage: 'url(\'' + hospImg + '\')'}"></div>
                    <span style="width: 80px;">医院负责人{{orgBean.responsible?'('+orgBean.responsible+')':''}}</span>
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
                      {{item.fileBean.fileSrcname}}
                    </a-popover>
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
                          :data="{orgId:orgBean.orgId}"
                          @change="handleImportFile">
                      <img src="~@/assets/image/fjProject/folder.svg">
                </a-upload>
              </a-tooltip>
            </span>
            <span class="fr m-r-30">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>历史记录</span>
                </template>
                <img src="~@/assets/image/fjProject/message.svg" @click="showChatFileList()">
              </a-tooltip>
            </span>
            <span class="fr m-r-30">
              <a-tooltip placement="bottom">
                <template slot="title">
                  <span>操作说明手册</span>
                </template>
                <img src="~@/assets/image/fjProject/manuals.svg">
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

    <m-modal centered
             title="选择医疗机构"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <select-fj-org ref="selectRef" :selected="selectData" selectType="radio"></select-fj-org>
    </m-modal>

    <a-drawer
      title="历史记录"
      :width="450"
      placement="right"
      @close="chatFileListVisible = false"
      :visible="chatFileListVisible"
    >
      <chat-file-list ref="chatFileList"></chat-file-list>
    </a-drawer>

  </div>
</template>

<script>
import { getAction,downFile } from '@/api/manage'
import {postAction as postAction_sv3} from '@/api-sv3/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import store from '@/store/'
import SelectFjOrg from "@/pages/selectMulti/YbFjOrgList"

import chatFileList from "./plugin/chatFileList"
import fileImg from "./plugin/fileImg"

import { downloadFileMixin } from './mixins/downloadMixin'
import { chatWebSocketMixin } from '@/mixins/webSocket/chatWebSocketMixin'
import { isShowTime,formatChatTime } from './mixins/formatChatTime'


export default {
  name: "YbFjSysChat",
  mixins: [downloadFileMixin,chatWebSocketMixin],
  components: {
    SelectFjOrg,
    chatFileList,
    fileImg
  },
  data() {
    return {
      title:'系统客服聊天',
      searchField:'orgName',
      searchValue:'',
      chatUserImg: require('@/assets/image/fjProject/chat-user.svg'),
      hospImg: require('@/assets/image/fjProject/hosp.svg'),
      textValue:'',

      messageList:[],
      selectVisible: false,//显示选择医疗机构窗口
      selectData: [],//选中医疗机构的值

      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      confirmLoading:false,
      importUrl:'',

      url:{
        chatAddOrg:'/fj/chat/org/add',
        chatOrgList:'/fj/chat/org/list',
        messageList:'/fj/chat/log/list',
        sendMsg:'/fj/chat/log/server/send',
        sendFile:'/fj/chat/log/server/sendFile',
        downloadFile:'/fj/chat/file/download',
      },
      chatOrgList:[],
      totalPage: 0,
      current: 1,
      selectChatOrgId:'',//聊天医院
      orgBean:{},
      loadingMore:false,//加载更多
      hasMore:true,
      messagePageNo:1,
      messagePageSize:10,
      chatFileListVisible:false,//历史记录
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
    this.loadChatOrgList()
  },
  activated() {
    this.handleScrollBottom()
  },
  methods: {
    isShowTime,formatChatTime,
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

    //选择医疗机构确定
    handleSelectOk() {
      this.selectData = this.$refs.selectRef.getSelect()
      if(this.selectData.length==1){//选中了医院
        this.addOrgChat(this.selectData[0].orgId)
      }
      this.handleSelectClose()
    },
    //新建医院交流
    addOrgChat(orgId){
      if(!orgId){
        return
      }
      postAction_sv3(this.url.chatAddOrg, {orgId}).then(res => {
        if (res.success) {
          //刷新列表并打开聊天界面
          this.current = 1
          this.loadChatOrgList('add',{})
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {

      })

    },

    //医院交流列表
    loadChatOrgList(type,params){
      this.chatOrgList = []
      if(!params){
        params = {}
      }
      params.pageNo = this.current
      getAction(this.url.chatOrgList, params).then((res) => {
        if (res.success) {
          this.chatOrgList = res.result.records
          this.totalPage = res.result.total
          if((type=='add'||!this.selectChatOrgId)&&this.chatOrgList.length>0){
            this.selectChatOrg(this.chatOrgList[0].orgId)
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    onSearch(){
      let params = {}
      if(this.searchValue){
        params[this.searchField] = this.searchValue
      }
      this.current = 1
      this.loadChatOrgList('',params)
    },

    //左侧机构分页
    changePage (v) {
      this.current = v
      this.loadChatOrgList()
    },

    selectChatOrg(orgId){
      this.selectChatOrgId = orgId
      let selectArr = this.chatOrgList.filter(t=>t.orgId==orgId)
      this.orgBean = selectArr.length>0?selectArr[0]:{}
      //获取医院聊天内容
      this.loadMessageList()
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

    //关闭选择医疗机构
    handleSelectClose() {
      this.selectVisible = false
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

    //历史记录
    showChatFileList(){
      this.chatFileListVisible = true
      this.$nextTick(() => {
        this.$refs.chatFileList.loadData(this.selectChatOrgId)
      })
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

  .list-box {
    padding: 14px 10px;
    border: 1px solid #f0f2f5;border-radius: 5px;
    background-color: #f9f9f9;
  }

  .list-box:hover {
    background-color:#ffffff;
    box-shadow: 0px 0px 2px 2px #f3fbff;
    cursor: pointer;
  }
  .list-title{
    font-size:14px;
    font-weight: bold;
  }
  .list-des{
    width:120px;
    font-size:8px;
    color:#00000059
  }

  .selectColor{
    background-color:#ffffff;
    box-shadow: 0px 0px 2px 2px #f3fbff;
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