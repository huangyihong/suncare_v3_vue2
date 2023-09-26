<template>
  <a-card  :bordered="false" :bodyStyle="{ paddingLeft: '0px'}">
    <div v-if="processStep=='project'">
      <div class="m-b-10 ft-12" style="color: #989898;margin-top: -16px">当前共管理文件 {{fileCount|ipagination.total}} 条</div>
    </div>
    <div class="disRow">
      <div style="width:120px" class="changTabBox">
        <template v-if="processStep=='task'">
          <p :class="[isChangeTab=='submitStepAllFileList'?'activeTab':'changTab']" @click="tabCard('submitStepAllFileList')">全部</p>
          <p :class="[isChangeTab=='mineSubmitStepFileList'?'activeTab':'changTab']" @click="tabCard('mineSubmitStepFileList')">我提交的</p>
          <p :class="[isChangeTab=='submitAuditStepFileList'?'activeTab':'changTab']" @click="tabCard('submitAuditStepFileList')">审批反馈</p>
        </template>
        <template v-if="processStep=='taskHosp'">
          <p :class="[isChangeTab=='hospStepAllFileList'?'activeTab':'changTab']" @click="tabCard('hospStepAllFileList')">全部</p>
          <p :class="[isChangeTab=='mineHospStepFileList'?'activeTab':'changTab']" @click="tabCard('mineHospStepFileList')">我提交的</p>
          <p :class="[isChangeTab=='hospAuditStepFileList'?'activeTab':'changTab']" @click="tabCard('hospAuditStepFileList')">医院反馈</p>
        </template>
        <template v-if="processStep=='taskCut'">
          <p :class="[isChangeTab=='cutStepAllFileList'?'activeTab':'changTab']" @click="tabCard('cutStepAllFileList')">全部</p>
          <p :class="[isChangeTab=='mineCutStepFileList'?'activeTab':'changTab']" @click="tabCard('mineCutStepFileList')">我提交的</p>
          <p :class="[isChangeTab=='cutAuditStepFileList'?'activeTab':'changTab']" @click="tabCard('cutAuditStepFileList')">审批反馈</p>
          <p :class="[isChangeTab=='cutOrgSubmitFileList'?'activeTab':'changTab']" @click="tabCard('cutOrgSubmitFileList')">医院上传</p>
        </template>
        <template v-if="processStep=='onsite'">
          <p :class="[isChangeTab=='onsiteStepAllFileList'?'activeTab':'changTab']" @click="tabCard('onsiteStepAllFileList')">全部</p>
          <p :class="[isChangeTab=='mineOnsiteStepFileList'?'activeTab':'changTab']" @click="tabCard('mineOnsiteStepFileList')">我上传的</p>
          <p :class="[isChangeTab=='outOnsiteStepFileList'?'activeTab':'changTab']" @click="tabCard('outOnsiteStepFileList')">我的导出</p>
        </template>
        <template v-if="processStep=='project'">
          <p :class="[isChangeTab=='projectAllFileList'?'activeTab':'changTab']" @click="tabCard('projectAllFileList')">全部</p>
          <p :class="[isChangeTab=='projectUpFileList'?'activeTab':'changTab']" @click="tabCard('projectUpFileList')">内部上传</p>
          <p :class="[isChangeTab=='projectOutFileList'?'activeTab':'changTab']" @click="tabCard('projectOutFileList')">内部输出</p>
          <p :class="[isChangeTab=='projectOrgUpFileList'?'activeTab':'changTab']" @click="tabCard('projectOrgUpFileList')">医院上传</p>
        </template>
      </div>
      <div style="width:20px"></div>
      <div :style="{width:'calc(100% - 150px)'}">
        <template v-if="processStep=='onsite'">
          <a-spin :spinning="uploadLoading">
            <a-upload name="file"
                      :showUploadList="false"
                      :multiple="false"
                      :headers="tokenHeader"
                      :beforeUpload="beforeUpload"
                      :action="importExcelUrl"
                      :data="{projectOrgId:$route.query.projectOrgId}"
                      @change="handleImportExcel">
              <a-button type="primary" class="m-b-10"><a-icon type="upload" /> 上传材料</a-button>
            </a-upload>
          </a-spin>
        </template>
        <template v-if="processStep=='project'">
          <a-button type="primary" class="m-b-10" @click="downloadFileBatch()">批量导出</a-button>
        </template>
        <a-skeleton :loading="loading" active :paragraph="{rows: 2}">
          <div>
            <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="fileId"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :scroll="{ x: scrollX }"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              v-bind="tableAttrs"
              @change="handleTableChange">
            <span slot="action" slot-scope="text, record">
              <a  @click="downloadFile(record.filePath,record.fileSrcname)">下载</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定删除当前信息吗?" @confirm="() => handleDelete(record.fileId)">
                <a size="small">删除</a>
              </a-popconfirm>
            </span>
            </a-table>
          </div>
        </a-skeleton>
      </div>
    </div>
  </a-card>
</template>

<script>
import { getAction,downFile } from '@/api/manage'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
export default {
  name: "projectTask",
  mixins: [JeecgListMixin],
  props: {
    projectOrgId: {
      type: String,
    },
    processStep: {
      type: String,
      required: true
    },
    projectId: {
      type: String,
    },
  },
  components: {

  },
  watch: {
    projectId: {
      immediate: true,
      handler(val) {
        if(val){
          this.fixedParam.projectId = val
          this.initData()
        }
      }
    },
    projectOrgId: {
      immediate: true,
      handler(val) {
        if(val){
          this.fixedParam.projectOrgId = val
          this.initData()
        }
      }
    },
    processStep: {
      immediate: true,
      handler(val) {
        if(val){
          if(val=='task'){
            this.isChangeTab = 'submitStepAllFileList'
          }
          if(val=='taskHosp'){
            this.isChangeTab = 'hospStepAllFileList'
          }
          if(val=='taskCut'){
            this.isChangeTab = 'cutStepAllFileList'
          }
          if(val=='onsite'){
            this.isChangeTab = 'onsiteStepAllFileList'
          }
          if(val=='project'){
            this.isChangeTab = 'projectAllFileList'
          }
          this.initData()
        }
      }
    },
  },
  data() {
    return {
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      uploadLoading:false,
      loading:false,
      isChangeTab:'submitStepAllFileList',
      url:{
        list:'/fj/clue/file/submitStepAllFileList',
        submitStepAllFileList:'/fj/clue/file/submitStepAllFileList',
        mineSubmitStepFileList:'/fj/clue/file/mineSubmitStepFileList',
        submitAuditStepFileList:'/fj/clue/file/submitAuditStepFileList',
        hospStepAllFileList:'/fj/clue/file/hospStepAllFileList',
        mineHospStepFileList:'/fj/clue/file/mineHospStepFileList',
        hospAuditStepFileList:'/fj/clue/file/hospAuditStepFileList',
        cutStepAllFileList:'/fj/clue/file/cutStepAllFileList',
        mineCutStepFileList:'/fj/clue/file/mineCutStepFileList',
        cutAuditStepFileList:'/fj/clue/file/cutAuditStepFileList',
        cutOrgSubmitFileList:'/fj/clue/file/cutOrgSubmitFileList',
        delete:'/fj/clue/file/delete',
        onsiteStepAllFileList:'/fj/clue/file/onsiteStepAllFileList',
        mineOnsiteStepFileList:'/fj/clue/file/mineOnsiteStepFileList',
        outOnsiteStepFileList:'/fj/clue/file/outOnsiteStepFileList',
        importExcelUrl: "/fj/clue/onsite/upload",
        projectAllFileList:'/fj/clue/file/projectAllFileList',
        projectUpFileList:'/fj/clue/file/projectUpFileList',
        projectOutFileList:'/fj/clue/file/projectOutFileList',
        projectOrgUpFileList:'/fj/clue/file/projectOrgUpFileList',
        downloadZip:'/fj/clue/file/downloadZip',
      },
      columns: [
        { title: '文件类型', dataIndex: 'fileType', width: '80px' },
        { title: '文档操作人', dataIndex: 'createUsername', width: '80px' },
        { title: '文档所属', dataIndex: 'stepType', width: '100px' ,
          customRender: (text, record, index) => {
            let html = text;
            if (text=='task'||text=='submit') {
              html = '线索提交'
            }else if (text=='task-audit') {
              html = '线索反馈'
            }else if (text == 'onsite' || text == 'onsite-upload') {
              html = '现场检查'
            }else if(text=='hosp-task'){
              html = '医院复核'
            }else if(text=='hosp-task-audit'){
              html = '医院复核反馈'
            }else if (text=='cut-task'){
              html = '线上核减'
            }else if (text=='cut-task-audit'){
              html = '线上核减审批'
            }
            return html
          }
        },
        { title: '文档名称', dataIndex: 'fileSrcname', width: '300px',},
        { title: '文档大小', dataIndex: 'fileSize', width: '100px',
          customRender: (text, record, index) => {
          let html = text;
          if (html) {
           html = html/1000+'KB'
          }
          return html
         }
        },
        { title: '文档上传时间', dataIndex: 'createTime', width: '160px' },
        {
          title: '操作', dataIndex: 'action', align: "center",width: '120px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      initLoad:false,
      fileCount:undefined,

    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    tabCard (v) {
      this.isChangeTab = v
      this.initData()
    },
    initData(){
      if(this.processStep=='task'&&!['submitStepAllFileList','mineSubmitStepFileList','submitAuditStepFileList'].includes(this.isChangeTab)){
        this.isChangeTab = 'submitStepAllFileList'
      }
      if(this.processStep=='taskHosp'&&!['hospStepAllFileList','mineHospStepFileList','hospAuditStepFileList'].includes(this.isChangeTab)){
        this.isChangeTab = 'hospStepAllFileList'
      }
      if(this.processStep=='taskCut'&&!['cutStepAllFileList','mineCutStepFileList','cutAuditStepFileList','cutOrgSubmitFileList'].includes(this.isChangeTab)){
        this.isChangeTab = 'cutStepAllFileList'
      }
      if(this.processStep=='onsite'&&!['onsiteStepAllFileList','mineOnsiteStepFileList','outOnsiteStepFileList'].includes(this.isChangeTab)){
        this.isChangeTab = 'onsiteStepAllFileList'
      }
      if(this.processStep=='project'&&!['projectAllFileList','projectUpFileList','projectOutFileList','projectOrgUpFileList'].includes(this.isChangeTab)){
        this.isChangeTab = 'projectAllFileList'
      }
      this.url.list = this.url[this.isChangeTab]
      this.loadData(1)
      if(this.processStep =='project'){
        this.loadFileCount()
      }
    },
    loadFileCount(){
      getAction(this.url.projectAllFileList, {projectId:this.projectId,pageSize:1}).then((res) => {
        if (res.success) {
          this.fileCount = res.result.total
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    /* 下载 */
    downloadFile(filePath,fileName){
      downFile("/sys/common/download/" + filePath, {}, 'get').then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        const that = this
        if(data.size == 0 ){
          this.$message.warning('文件不存在')
          return
        }
        if (data.size < 2001) {
          let reader = new FileReader()
          reader.onload = function(event) {
            let result = JSON.parse(reader.result)
            if (!result.success) {
              that.$message.error(result.message)
            } else {
              that.$message.success(result.result || result.message)
            }
          }
          reader.readAsText(data)
        } else {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('文件下载成功')
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
    },

    beforeUpload() {
      this.uploadLoading = true
    },
    /* 上传材料导入 */
    handleImportExcel(info) {
      this.fileList = info.fileList
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        let res = info.file.response
        if (res.success) {
          this.initData()
        } else {
          //this.$message.error(`文件上传失败: ${info.file.response.message} `);
          this.$notification.error({
            message: '文件材料失败',
            description:
              `${res.message} `,
          });
        }
        this.uploadLoading = false
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.response.message} `);
        this.uploadLoading = false
      }

    },

    //批量导出
    downloadFileBatch(){
      if(this.selectedRowKeys.length==0){
        this.$message.error("请选择一条记录进行批量导出操作")
        return
      }
      this.downloadZip(this.selectedRowKeys.join(','))

    },
    //附件下载
    downloadZip(fileIds){
      let fileName = '附件.zip'
      downFile(this.url.downloadZip, {fileIds}, 'get').then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        const that = this
        if (data.size < 2001) {
          let reader = new FileReader()
          reader.onload = function(event) {
            let result = JSON.parse(reader.result)
            if (!result.success) {
              that.$message.error(result.message)
            } else {
              that.$message.success(result.result || result.message)
            }
          }
          reader.readAsText(data)
        } else {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('文件下载成功')
        }
      }).catch(e => {
        this.$message.error(e.message)
      })
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
  .changTabBox{
    cursor: pointer;
  }
  .changTab {
    line-height: 48px;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    background: rgba(187, 217, 239, 0.1);
  }
  .activeTab{
    line-height: 48px;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    background: rgba(66, 170, 245, 1);
    color:#fff
  }
  .cardBorder {
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    padding: 10px;
  }

  .W33 {
    width: 33%
  }

  .tabBox {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 240px;
    background: rgba(162,166,169,0.2);
    padding: 6px 10px;
    margin-top: 10px;
    border-radius: 5px
  }

</style>