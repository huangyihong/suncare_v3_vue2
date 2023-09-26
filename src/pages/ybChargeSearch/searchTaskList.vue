<template>
  <div style='background-color: white'>
    <slot name="createTaskBtn"></slot>

    <!-- table区域-begin -->
    <div style=' border-bottom:2px solid #eff2f5;  '>
      <div  class='result_title'>
        <span style=' font-weight: 500;font-size: 16px;color:rgb(0, 0, 0)' >下载任务列表 </span>
        <a @click='reloadTable'>【刷新】</a>
      </div>
    </div>

    <a-card  :bordered="false" >

    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX }"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <span slot="status" slot-scope="text, record, index">
          <span v-if="text=='00'"><a-badge status="processing"/> 进行中</span>
          <span v-else-if="text=='01'"><a-badge status="success" /> 已完成</span>
          <span v-else-if="text=='02'"><a-badge status="red"/>
            <a @click="showErrorMsg(record.errorMsg)" v-if="record.errorMsg&&record.errorMsg.length>0"><a-tooltip :title="record.errorMsg">  失败...</a-tooltip></a>
            <span v-else>  失败</span>
          </span>
          <span v-else><a-badge status="default"/> 等待</span>
        </span>
        <span slot="action" slot-scope="text, record">

          <span  v-if="record.status==='01'&&record.recordCount>0&&record.fileFullpath" v-has="'ybChargeTask:downloadFile'">
            <a size="small" @click="uploadAction(record)">下载</a>
            <a-divider type="vertical"/>
          </span>
          <a size="small" @click="toResultPreview(record)">预览</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item key="3" v-if="(record.taskType=='search'||record.taskType=='drugRuleStatistics')&&record.status==='01'&&record.recordCount>0&&record.fileFullpath">
                <a size="small" @click="wgTypeShow(record)">保存到统计表</a>
              </a-menu-item>
              <a-menu-item key="1" v-has="'ybChargeTask:downloadFile'">
                <a size="small" @click="toDownloadList(record)" >下载记录</a>
              </a-menu-item>
              <a-menu-item key="2" v-has="'ybChargeTask:delTask'">
                <a-popconfirm title="确定删除当前查询任务吗?" @confirm="() => handleDelete(record.id)">
                   <a size="small" >删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        </span>

        <span slot="taskType" slot-scope="text, record">
          <span v-if="record.tagName&&filterDictText(dictOptins.SEARCH_TASK_TYPE, text).indexOf('数据挖掘分析')!=-1">
            {{record.tagName}}
          </span>
          <span v-else>
            {{filterDictText(dictOptins.SEARCH_TASK_TYPE, text)||''}}
          </span>
        </span>



      </a-table>
    </div>
    </a-card>
    <!-- table区域-end -->


    <download-list ref="downloadList"></download-list>

    <search-result ref="searchResult" @reloadTaskList="reloadTaskList"></search-result>

    <send-sms-download ref="sendSms" @ok="uploadFile"></send-sms-download>


    <m-modal centered
             title="违规类型选择"
             :width="400"
             :visible="wgTypeVisible"
             @ok="handleWgTypeSave"
             @cancel="handleWgTypeClose"
             cancelText="关闭">
      <a-spin :spinning="wgTypeSaveLoading">
      <a-form :form="form">
        <a-form-item  :labelCol="labelCol"
                      :wrapperCol="wrapperCol" label="违规类型">
          <m-dict-select-tag placeholder="请选择违规类型" v-decorator="['tagId',validatorRules.requiredOnly]" dictCode="SEARCH_WG_TYPE" :required="false"></m-dict-select-tag>
        </a-form-item>
        <a-form-item  :labelCol="labelCol"
                      :wrapperCol="wrapperCol" label="标签名称">
          <a-input placeholder="请输入标签名称" v-decorator="['tagName',validatorRules.required]"/>
        </a-form-item>
      </a-form>
      </a-spin>

    </m-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import downloadList from './downloadList'
import searchResult from './searchResult'
import {hasPermission} from '@/utils/hasPermission'
import sendSmsDownload from './plugin/sendSmsDownload'
import { CHECK_SMS_DONLOAD } from "@/store/mutation-types"
import {configMap} from './mixins/configMap'
import { filterDictText} from '@/components/dict/JDictSelectUtil'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import { chatWebSocketMixin } from '@/mixins/webSocket/chatWebSocketMixin'
import moment from "moment"
import { downloadFileMixin } from '@/mixins/downloadMixin'

export default {
  name: "searchTaskList",
  mixins:[JeecgListMixin,downloadFileMixin,chatWebSocketMixin],
  props: {
    taskType: {
      type: String,
      required: false
    },
  },
  components: {
    downloadList,
    searchResult,
    sendSmsDownload,
    MDictSelectTag,
  },
  data () {
    return {
      description: '收费明细查询任务页面',

      // 任务列表
      columns: [],
      url: {
        list: "/ybChargeSearch/ybChargeSearchTask/list",
        delete: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/delete",
        getResultConfigMap: "/ybChargeSearch/ybChargeSearchTask/getResultConfigMap",
        saveDownloadData: "/ybChargeSearch/ybChargeSearchTask/saveDownloadData",
        fileExists: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/fileExists",
        dwbVisitTagCountByTagname: this.$suncare_v3 +"/apiYbChargeTagLabel/ybChargeTagLabel/dwbVisitTagCountByTagname",
        dwbVisitTagImportForUpdate: this.$suncare_v3 +"/apiYbChargeTagLabel/ybChargeTagLabel/dwbVisitTagImportForUpdate",
        downloadFile: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/download",
      },
      initLoad:false,
      showDemo:false,
      resultConfigBean:{},
      resultConfigMap:{},
      dictOptins:{},
      //违规信息
      wgTypeVisible:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
      },
      wgTypeSaveLoading:false,
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },

  beforeMount() {
    this.loadResultConfigMap()
    if(!this.taskType){
      this.resultConfigBean = Object.assign({}, this.resultConfigMap[''],configMap['']);
      this.columns = this.resultConfigBean.taskColumns
      this.initLoadTable(null);
    }

    let keys = ['SEARCH_TASK_TYPE']
    this.$util.initDict(keys).then(obj => {
      this.dictOptins = obj
      for (let key in this.dictOptins){
        this.dictOptins[key] = this.dictOptins[key].map(item =>{
          return {
            text: item.value,
            value: item.code
          }
        })
      }
    })
  },
  watch: {
    taskType: {
      immediate: true,
      handler(val) {
        if (val&&val.length > 0) {
          this.resultConfigBean = Object.assign({}, this.resultConfigMap[val],configMap[val]);
        }else{
          this.resultConfigBean = Object.assign({}, this.resultConfigMap.search,configMap.search);
        }
        this.resultConfigBean.column = this.getColum()
        this.columns = this.resultConfigBean.taskColumns
        this.initLoadTable(val)
      }
    },
  },
  methods: {
    hasPermission,
    filterDictText,
    initLoadTable(taskType){
      this.fixedParam.dataSource = this.userInfo.dataSource
      if(taskType=='itemByDeptStatistics'){
        taskType='itemByDeptStatistics,deptStatistics'
      }
      if(taskType=='riskStatistics'){
        taskType='riskStatistics,diagRiskStatistics,lowStatistics'
      }
      this.fixedParam.taskType = taskType
      if(!this.hasPermission('ybChargeTask:viewOtherTask')){
        this.fixedParam.createUserId = this.userInfo.id
      }
      this.loadData(1)
    },
    reloadTable(n){
      this.loadData(n);
    },

    //下载文件操作
    uploadAction(record){
      let checkSmsDonload = this.$ls.get(CHECK_SMS_DONLOAD)
      if(checkSmsDonload){//已短信验证
        this.uploadFile(record)
      }else{
        this.$refs.sendSms.load(record)
      }
    },

    /* 文件下载 */
    uploadFile(record){
      let {dataSource, filePath, id, fileFullpath,taskType,tagName} = record
      getAction(this.url.fileExists, {fileFullpath:fileFullpath}).then((res) => {
        if (res.success) {
          let host = ''
          if(this.$config[dataSource]){
            host = this.$config[dataSource].suncare_v3
          }else{
            host = this.userInfo.dataSourceInfo?this.userInfo.dataSourceInfo.suncareV3Url:''
          }
          host = host ? host : this.$config['domianURL']
          this.saveDownloadData(id)
          let fileName = record.fileName
          if(this.filterDictText(this.dictOptins.SEARCH_TASK_TYPE, taskType).indexOf('数据挖掘分析')!=-1||this.filterDictText(this.dictOptins.SEARCH_TASK_TYPE, taskType).indexOf('欺诈专题')!=-1){
            fileName = this.filterDictText(this.dictOptins.SEARCH_TASK_TYPE, taskType)
            if(tagName){
              fileName = tagName
            }
            fileName += '_'+moment(new Date()).format("YYYYMMDDHHhhmmss")+'.xlsx'
          }
          //window.open(host + "/sys/common/download/" + filePath);
          this.downloadFileAction(this.url.downloadFile,{fileFullpath,fileName},fileName)
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    toResultPreview(record){
      let taskType = record.taskType
      //if(taskType=='deptStatistics'||taskType=='itemByDeptStatistics'||taskType=='diagRiskStatistics'||taskType=='lowStatistics'||taskType=='riskStatistics'){
        this.resultConfigBean = Object.assign({}, this.resultConfigMap[taskType],configMap[taskType]);
        this.resultConfigBean.column = this.getColum()
      //}

      this.$refs.searchResult.visible=true
      if(taskType=='yearStatistics'&&'src'==record.dataStaticsLevel){
        this.$refs.searchResult.columns = this.resultConfigBean.column.filter(t=>t.dataIndex!=='orgnameSrc')
      }else{
        this.$refs.searchResult.columns = this.resultConfigBean.column
      }
      this.$refs.searchResult.url.list = `/ybChargeSearch/${this.toHump(this.resultConfigBean.resultTable)}/list`
      this.$refs.searchResult.resultTitle = this.resultConfigBean.detailTitle
      this.$refs.searchResult.initData(record)
    },

    reloadTaskList(n){
      this.reloadTable(n)
    },

    loadResultConfigMap(){
      getAction(this.url.getResultConfigMap, {}).then((res) => {
        if (res.success) {
          this.resultConfigMap = res.result;
          this.resultConfigBean = Object.assign({}, this.resultConfigMap[this.taskType],configMap[this.taskType]);
          this.resultConfigBean.column = this.getColum()
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    getColum(){
      let column = []
      if(!this.resultConfigBean.cols||this.resultConfigBean.cols.length==0){
        return column
      }
      this.resultConfigBean.cols.forEach(function(item,index){
        let bean = {dataIndex:item.field,title:item.title};
        if(item.minWidth){
          bean.minWidth = item.minWidth+'px';
        }else{
          bean.width = item.width+'px';
        }
        column.push(bean);
      });
      return column;
    },

    // 下划线转换驼峰
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
      });
    },

    //保存下载记录
    saveDownloadData(id){
      getAction(this.url.saveDownloadData, {id}).then((res) => {
      })
    },

    toDownloadList(record){
      this.$refs.downloadList.visible=true
      this.$refs.downloadList.initData(record)
    },
    showErrorMsg(msg){
      this.$warning({
        title: '错误日志',
        content: msg,
      });
    },

    //违规类型选择保存
    wgTypeShow(record){
      this.form.resetFields();
      this.taskId = record.id
      this.wgTypeVisible = true
    },
    handleWgTypeSave(){
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          let formData = Object.assign({taskId:this.taskId}, values);
          this.confirmLoading = true;
          getAction(this.url.dwbVisitTagCountByTagname,formData).then((res)=>{
            if(res.success){
              let count = res.result
              if(count>0){
                const that = this
                this.$confirm({
                  title: '确认覆盖',
                  content: '统计表中已存在医院的这个标签结果，是否覆盖?',
                  onOk: function() {
                    that.importForUpdate(formData,true)
                  },
                  onCancel() {
                    that.wgTypeVisible = false
                  },
                })
              }else{
                const that = this
                this.$confirm({
                  title: '确认保存',
                  content: '保存结果到统计表?',
                  onOk: function() {
                    that.importForUpdate(formData,false)
                  },
                  onCancel() {
                    that.wgTypeVisible = false
                  },
                })
              }
            }else{
              this.$message.warning(res.message);
            }
          })

        }
      })
    },
    handleWgTypeClose(){
      this.wgTypeVisible = false
    },
    importForUpdate(formData,updateFlag){
      this.wgTypeSaveLoading = true;
      let params = Object.assign({updateFlag}, formData);
      getAction(this.url.dwbVisitTagImportForUpdate,params).then((res1) => {
        if (res1.success) {
          this.$message.success(`保存结果到统计表成功`);
        }else{
          this.$message.warning(res1.message);
        }
      }).finally(() => {
        this.wgTypeSaveLoading = false;
        this.wgTypeVisible = false
      })
    },

    //websocket获取信息
    websocketonmessage: function(e) {
      var data = eval("(" + e.data + ")"); //解析对象
      if (data.cmd === 'searchTask') {
        let id = data.id
        if(this.dataSource.filter(t=>t.id==id).length>0){
          this.loadData()
        }
      }
      //心跳检测重置
      this.heartCheck.reset().start();
    },



  }
}
</script>
<style lang="less" scoped>
  .layui-elem-quote {
    margin-bottom: 10px;
    padding: 15px;
    line-height: 22px;
    border-left: 5px solid #009688;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
  }
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    div {
      padding: 0 5px;
    }
  }
  .list-item {
    border-bottom: 1px solid #e8e8e8;
    padding: 5px 0;
  }
  .success_btn{
    color: #fff;
    background-color: #009688;
    border-color: #009688;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  }
  .result_title{
    background-color: white;
    width: 100%;
    padding-left: 25px;
    padding-bottom: 12px;
    padding-top: 12px;
  }
</style>
