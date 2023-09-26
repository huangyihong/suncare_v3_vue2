<template>
    <div>
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="MDC目录">
                <a-select
                  show-search
                  v-model="queryParam.mdc"
                  placeholder="请选择MDC目录"
                  :filter-option="filterOption"
                  :dropdownMatchSelectWidth="false"
                  @change="selectMdcCatalogCode"
                >
                  <a-select-option  v-for="(item,index) in mdcDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="ADRG目录">
                <a-select
                  show-search
                  v-model="queryParam.adrg"
                  placeholder="请选择ADRG目录"
                  :filter-option="filterOption"
                  :dropdownMatchSelectWidth="false"
                  @change="selectAdrgCatalogCode"
                >
                  <a-select-option  v-for="(item,index) in adrgDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="DRG目录">
                <a-select
                  show-search
                  v-model="queryParam.drg"
                  placeholder="请选择DRG目录"
                  :filter-option="filterOption"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in drgDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


            <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchResetFn" icon="reload" class="m-l-6">重置</a-button>
              <a @click="handleToggleSearch" class="m-l-6" :title="toggleSearchStatus ? '收起' : '展开'">
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
            </a-col>

            <template v-if="toggleSearchStatus">
              <a-col :md="6" :sm="8">
                <a-form-item label="医疗机构名称">
                  <j-input placeholder="请输入医疗机构名称模糊查询" v-model="queryParam.orgname"></j-input>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="8">
                <a-form-item label="就诊ID">
                  <a-input placeholder="请输入就诊ID" v-model="queryParam.visitid"></a-input>
                </a-form-item>
              </a-col>
            </template>

          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button @click="handleExportExcel" type="primary" icon="download">导出</a-button>
        <a-tooltip title="当数据量超过2w会进行异步导出">
          <a-button @click="showExportTask" type="primary" icon="download">异步导出日志</a-button>
        </a-tooltip>

      </div>

      <!-- table区域-begin -->
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
          :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          v-bind="tableAttrs"
          @change="handleTableChange">
          <span slot="visitid" slot-scope="text, record">
            <a  @click="showVisitInfo(record)">{{text}}</a>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="showDrgTargetDtl(record)" v-if="record.id.indexOf('#')===-1">查看</a>
          </span>

        </a-table>
      </div>
      <!-- table区域-end -->

      <visit-info-modal ref="visitInfo"></visit-info-modal>

      <drg-target-dtl-modal ref="drgTargetDtl"></drg-target-dtl-modal>

      <m-modal centered
               title="异步导出记录"
               :width="1300"
               :visible="exportTaskVisible"
               @cancel="handleCancelExportTask"
               cancelText="关闭" :footer="null">
        <export-task-list ref="exportTaskList"></export-task-list>
      </m-modal>

    </div>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction, putAction} from '@/api/manage'
import { filterOption } from '../mixins/filterOption'
import { filterObj } from '@/utils/util'
import moment from "moment"
import VisitInfoModal from '../modules/VisitInfoModal'
import DrgTargetDtlModal from '../modules/DrgTargetDtlModal'
import ExportTaskList from './ExportTaskList'
export default {
  name: "VisitDrgList",
  props: {

  },
  components: {
    VisitInfoModal,
    DrgTargetDtlModal,
    ExportTaskList
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      description: 'DRG入组病历结果',
      // 表头
      columns:[],
      leftColumns: [
        {
          title: '就诊ID',
          align: "left",
          dataIndex: 'visitid',
          width: '120px',
          scopedSlots: {customRender: 'visitid'}
        },{
          title: '医保住院登记号',
          align: "center",
          dataIndex: 'caseId',
          width: '120px'
        },{
          title: '医疗机构名称',
          align: "center",
          dataIndex: 'orgname',
          width: '120px'
        },{
          title: '患者姓名',
          align: "center",
          dataIndex: 'clientname',
          width: '100px'
        },{
          title: '医保个人编号',
          align: "center",
          dataIndex: 'insurancecardNo',
          width: '180px'
        },{
          title: '性别',
          align: "center",
          dataIndex: 'sex',
          width: '80px'
        },{
          title: '出生时间',
          align: "center",
          dataIndex: 'birthday',
          width: '120px'
        },{
          title: '参保类型',
          align: "center",
          dataIndex: 'insurancetype',
          width: '180px'
        },{
          title: '入院日期',
          align: "center",
          dataIndex: 'admitdate',
          width: '120px',
          customRender: t => t?t.substring(0,10):''
        },{
          title: '出院日期',
          align: "center",
          dataIndex: 'leavedate',
          width: '120px',
          customRender: t => t?t.substring(0,10):''
        },{
          title: '主诊断编码',
          align: "center",
          dataIndex: 'mdcDiagCode',
          width: '120px',
        },{
          title: '主诊断名称',
          align: "center",
          dataIndex: 'mdcDiagName',
          width: '120px',
        },{
          title: '主要手术和操作编码',
          align: "center",
          dataIndex: 'adrgSurgeryCode',
          width: '120px',
        },{
          title: '主要手术和操作名称',
          align: "center",
          dataIndex: 'adrgSurgeryName',
          width: '120px',
        }
      ],
      rightColumns: [
        {

          title: 'ADRG目录编码',
          align: "center",
          dataIndex: 'adrg',
          width: '120px'
        },{
          title: 'ADRG目录名称',
          align: "left",
          dataIndex: 'adrgName',
          width: '180px'
        },{
          title: 'MDC目录编码',
          align: "center",
          dataIndex: 'mdc',
          width: '120px'
        },{
          title: 'MDC目录名称',
          align: "left",
          dataIndex: 'mdcName',
          width: '180px'
        },{
          title: 'DRG分组逻辑',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '120px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      drgColumns: [
        {
          title: 'DRG目录编码',
          align: "center",
          dataIndex: 'drg',
          width: '120px'
        },{
          title: 'DRG目录名称',
          align: "left",
          dataIndex: 'drgName',
          width: '180px'
        }
      ],
      url: {
        list: "/drg/drgTask/visitDrgList",
        drglist: "/drg/drgTask/visitDrgList",
        noDrglist: "/drg/drgTask/visitNoDrgList",
        getCatalogBean: "/drg/drgCatalog/list",
        getCatalogDetailList:"/drg/drgCatalogDetail/list",
        exportVisitDrgList: "/drg/drgTask/exportVisitDrgList",
        exportVisitNoDrgList: "/drg/drgTask/exportVisitNoDrgList",
        exportVisitDrgListByThread: "/drg/drgTask/exportVisitDrgListByThread",
        exportVisitNoDrgListByThread: "/drg/drgTask/exportVisitNoDrgListByThread",

        exportXlsUrl: "/drg/drgTask/exportVisitDrgList",
        exportExcelByThread: "/drg/drgTask/exportVisitDrgListByThread",
      },
      isorter: {
        column: 'orgname,visitid,mdc,adrg',
        order: 'asc,asc'
      },
      initLoad:false,
      catalogBean:{},
      mdcDetailList:[],
      adrgDetailList:[],
      drgDetailList:[],
      filename:'drg入组病历结果',
      exportTaskVisible:false,
    }
  },
  beforeMount() {


  },
  methods: {
    filterOption,
    searchResetFn(){
      this.searchReset()
      this.adrgDetailList = []
      this.drgDetailList = []

    },
    async showData(record,isDrg){
      if(isDrg){
        this.url.list = this.url.drglist
        this.columns = [...this.leftColumns,...this.drgColumns,...this.rightColumns]
        this.filename = 'drg入组病历结果'
        this.url.exportXlsUrl = this.url.exportVisitDrgList
        this.url.exportExcelByThread = this.url.exportVisitDrgListByThread
      }else{
        this.url.list = this.url.noDrglist
        this.columns = [...this.leftColumns,...this.rightColumns]
        this.filename = 'drg入组未病历结果'
        this.url.exportXlsUrl = this.url.exportVisitNoDrgList
        this.url.exportExcelByThread = this.url.exportVisitNoDrgListByThread
      }
      this.fixedParam.batchId = record.batchId
      this.fixedParam.taskId = record.id
      this.loadData(1)
      await this.getCatalogBean(record.drgCatalogV)
      this.getMdcCatalogDetailList(this.catalogBean.mdcCatalogV)
      this.adrgDetailList = []
      this.drgDetailList = []
    },

    //获取Drg目录版本
    async getCatalogBean(versionCode){
      this.catalogBean = {};
      await getAction(this.url.getCatalogBean, {versionCode,catalogType:'DRG_V'}).then((res) => {
        if (res.success) {
          if(res.result.records.length>0){
            this.catalogBean = res.result.records[0]
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //获取mdc/目录列表
    getMdcCatalogDetailList(versionCode){
      getAction(this.url.getCatalogDetailList, {versionCode,catalogType:'MDC_V',examineStatus:'1',pageSize:99999}).then((res) => {
        if (res.success) {
          this.mdcDetailList =  res.result.records
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    getAdrgCatalogDetailList(versionCode,mdcCatalogCode){
      getAction(this.url.getCatalogDetailList, {versionCode,mdcCatalogCode,catalogType:'ADRG_V',examineStatus:'1',pageSize:99999}).then((res) => {
        if (res.success) {
          this.adrgDetailList =  res.result.records

        }else{
          this.$message.warning(res.message);
        }
      })
    },
    getDrgCatalogDetailList(versionCode,adrgCatalogCode){
      getAction(this.url.getCatalogDetailList, {versionCode,adrgCatalogCode,catalogType:'DRG_V',examineStatus:'1',pageSize:99999}).then((res) => {
        if (res.success) {
          this.drgDetailList =  res.result.records
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    selectMdcCatalogCode(val){
      this.getAdrgCatalogDetailList(this.catalogBean.adrgCatalogV,val)
      this.adrgDetailList = []
      this.$set(this.queryParam ,'adrg' ,undefined)
      this.$set(this.queryParam ,'drg' ,undefined)
    },

    selectAdrgCatalogCode(val){
      this.getDrgCatalogDetailList(this.catalogBean.versionCode,val)
      this.$set(this.queryParam ,'drg' ,undefined)
    },

    showVisitInfo(record){
      this.$refs.visitInfo.loadData(record)
    },

    showDrgTargetDtl(record){
      this.$refs.drgTargetDtl.showData(record)
    },
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      let totalCount = this.ipagination.total;
      if (totalCount < 20000) {
        this.handleExportFile(this.filename + moment().format('YYYYMMDDHHmmss')+'.xlsx')
        return;
      }
      this.handleExportThread(totalCount)
    },
    handleExportThread(count) {
      let param = filterObj({ ...this.queryParam, ...this.fixedParam })
      param.count = count
      getAction(this.url.exportExcelByThread, param, 'get').then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.openExportTaskPage()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    openExportTaskPage(){
      const that = this
      this.$confirm({
        title: '打开异步导出记录界面?',
        content: '',
        onOk() {
          that.showExportTask()
        }
      })
    },

    showExportTask(){
      this.exportTaskVisible = true
      this.$nextTick(() => {
        this.$refs.exportTaskList.loadData(1)
      });
    },

    handleCancelExportTask(){
      this.exportTaskVisible = false
    }



  }
}
</script>
<style lang="less" scoped>

</style>