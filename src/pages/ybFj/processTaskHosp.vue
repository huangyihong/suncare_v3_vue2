<template>
  <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" :bordered="false">
    <div class="tabBox ">
      <div @click="tabCard(1)" :class="[isActive == 1 ? 'activeBtn' : 'tabBtn']">
        <div class="tabTitle"><a-icon type="check-square" class="m-r-6" />线索总览</div>
      </div>
      <div :class="[isActive == 2 ? 'activeBtn' : 'tabBtn']" @click="tabCard(2)" class="m-l-20">
        <div class="tabTitle"><a-icon type="pic-center" class="m-r-6" />反馈管理</div>
      </div>
      <div :class="[isActive == 3 ? 'activeBtn' : 'tabBtn']" @click="tabCard(3)" class="m-l-20">
        <div class="tabTitle"><a-icon type="folder-add" class="m-r-6" />文档管理</div>
      </div>
    </div>


    <template v-if="isActive== 1">

      <div class="m-t-10 m-b-10 disRow">
        <a-select v-model="searchField" style="width: 160px">
          <a-select-option value="issueType"> 问题类别 </a-select-option>
          <a-select-option value="issueSubtype"> 问题类型 </a-select-option>
          <a-select-option value="clueName"> 项目名称 </a-select-option>
        </a-select>
        <a-input-search class="m-l-10" style="width:250px" v-model="searchValue" @search="onSearch"></a-input-search>
      </div>

      <a-button type="primary" @click="goBatchAudit('createByClue')" class="m-r-10">反馈医院</a-button>
      <a-button  @click="goPush" class="m-r-10" style="float: right">推送其他环节</a-button>
      <a-button  @click="handleExportExcel()" class="m-r-10" style="float: right">导出</a-button>


      <div class="m-t-20 sumTip" v-if="statStepClueVo">
        当前线索实时汇总，线索类别   {{statStepClueVo.issueSubtypeCnt}}条，
        项目  {{statStepClueVo.clueNameCnt}}类，
        涉及总数量  {{statStepClueVo.caseAmount}}，
        涉及人次  {{statStepClueVo.casePersonCnt}}，
        线索总金额 {{statStepClueVo.caseFee&&statStepClueVo.caseFee>10000?(statStepClueVo.caseFee/10000).toFixed(2)+'（万元）':statStepClueVo.caseFee+'（元）'}}，
        涉及医保基金总金额 {{statStepClueVo.caseFundFee&&statStepClueVo.caseFundFee>10000?(statStepClueVo.caseFundFee/10000).toFixed(2)+'（万元）':statStepClueVo.caseFundFee+'（元）'}}，
        已完成审核线索 {{statStepClueVo.auditClueNameCnt}} 类
      </div>

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="clueId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          v-bind="tableAttrs"
          @change="handleTableChange">
            <span slot="hospAuditState" slot-scope="text, record">
              <a-tag color="rgba(253, 194, 116, 1)" v-if="text==='init'">待反馈</a-tag>
              <a-tag color="rgba(98, 222, 156, 1)" v-if="text==='accept'">已认可</a-tag>
              <a-tag color="rgba(255, 121, 121, 1)" v-if="text==='noaccept'">不认可</a-tag>
              <a-tag color="rgba(255, 121, 121, 1)" v-if="text==='cut'">待核减</a-tag>
            </span>
          <span slot="action" slot-scope="text, record">
              <a  @click="showDtlList(record)">明细查看</a>
              <a-divider type="vertical"/>
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item key="2">
                    <a-popconfirm title="确定下载当前线索的所有附件?" @confirm="() => downloadZip(record.clueId)">
                      <a>附件下载</a>
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item key="3"  v-if="record.hospAuditState!='accept'">
                    <a-popconfirm title="确定认可通过当前项目线索信息吗?" @confirm="() => goAudit(record,'accept')">
                      <a >认可通过</a>
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item key="4"  v-if="record.hospAuditState!='cut'">
                    <a-popconfirm title="确定待核减当前项目线索信息吗?" @confirm="() => goAudit(record,'cut')">
                      <a>待核减</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
                <a-button type="primary">编辑<a-icon type="down" /> </a-button>
              </a-dropdown>
            </span>


        </a-table>
      </div>
      <!-- table区域-end -->

      <!--明细列表 -->
      <clue-dtl-list ref="dtlListRef"></clue-dtl-list>

      <!-- 表单区域 -->
      <task-clue-modal ref="modalForm" @ok="refreshData"></task-clue-modal>

      <!--批量审核确认框-->
      <audit-modal ref="auditModal" @ok="refreshData"></audit-modal>


      <!--推送其他环节-->
      <push-modal ref="pushModal" currStep="hosp" @ok="refreshData"></push-modal>



    </template>

    <template  v-if="isActive== 2">
      <project-task ref="projectTaskModal" processStep="taskHosp" :projectOrgId="$route.query.projectOrgId" @showTaskInfo="showTaskInfo">
        <div slot="createTaskBtn">
          <a-button type="primary"  @click="goBatchAudit('createByUpload')" class="m-r-10">发起反馈</a-button>
        </div>
      </project-task>
    </template>

    <template  v-if="isActive== 3">
      <clue-file ref="clueFileModal" :projectOrgId="$route.query.projectOrgId" processStep="taskHosp"></clue-file>
    </template>

    <!-- 反馈信息 -->
    <project-task-modal ref="taskModal" @ok="refreshTaskList" processStep="taskHosp"></project-task-modal>
  </a-card>
</template>


<script>
import {httpAction, getAction, putAction, downFile} from '@/api/manage'
import {postAction} from '@/api-sv3/manage'
import Breadcrumb from '@/components/Breadcrumb'
import moment from "moment"
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import clueDtlList from './clueDtlList'
import taskClueModal from './modules/taskClueModal'
import auditModal from './modules/auditModal'
import pushModal from './modules/pushModal'
import projectTask from './plugin/projectTask'
import projectTaskModal from './modules/projectTaskModal'
import clueFile from './plugin/clueFile'
import { downloadFileMixin } from './mixins/downloadMixin'
export default {
  name: "processTaskHosp",
  mixins: [JeecgListMixin,downloadFileMixin],
  components: {
    Breadcrumb,
    clueDtlList,
    taskClueModal,
    auditModal,
    pushModal,
    projectTask,
    projectTaskModal,
    clueFile
  },
  data() {
    return {
      columns: [
        {
          title: '问题类别',
          align: "left",
          dataIndex: 'issueType',
          width: '120px'
        },{
          title: '问题类型',
          align: "left",
          dataIndex: 'issueSubtype',
          width: '120px'
        },{
          title: '项目名称',
          align: "left",
          dataIndex: 'clueName',
          width: '200px'
        },{
          title: '项目类别',
          align: "left",
          dataIndex: 'clueType',
          width: '120px'
        },{
          title: '涉及数量',
          align: "left",
          dataIndex: 'caseAmount',
          width: '100px'
        },{
          title: '涉及人次',
          align: "left",
          dataIndex: 'casePersonCnt',
          width: '100px'
        },{
          title: '线索金额(元)',
          align: "left",
          dataIndex: 'caseFee',
          width: '120px'
        },{
          title: '涉及医保基金(元)',
          align: "left",
          dataIndex: 'caseFundFee',
          width: '140px'
        },{
          title: '违规说明',
          align: "left",
          dataIndex: 'caseRemark',
          width: '200px'

        },{
          title: '审核状态',
          align: "left",
          dataIndex: 'hospAuditState',
          fixed: 'right',
          width: '85px',
          scopedSlots: {customRender: 'hospAuditState'}
        },{
          title: '审核人',
          align: "left",
          dataIndex: 'hospAuditUserName',
          fixed: 'right',
          width: '80px'
        },{
          title: '审核时间',
          align: "left",
          dataIndex: 'hospAuditTime',
          fixed: 'right',
          width: '160px'
        },{
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      url: {
        list: "/fj/clue/inHospStepClueList",
        delete: '/fj/clue/delete',
        deleteBatch: '/fj/clue/deleteBatch',
        importExcelUrl: "/fj/clue/import",
        downloadZip:'fj/clue/downloadZip',
        audit: "/fj/clue/hospAudit",
        clueDtlList:"/fj/clue/dtl/list",
        statClue:"/fj/clue/statClueInHosp",
        exportXlsUrl: "/fj/clue/export",
      },
      initLoad:false,
      isActive: '1',
      searchField:'issueType',
      searchValue:'',
      //统计结果
      statStepClueVo:undefined,

    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  beforeMount() {
    this.fixedParam.projectId = this.$route.query.projectId
    this.fixedParam.projectOrgId = this.$route.query.projectOrgId
    this.onSearch()

  },
  methods: {
    tabCard (v) {
      this.isActive = v
      if(v==1){
        this.onSearch()
      }
      this.$forceUpdate()
    },
    onSearch(){
      this.queryParam = {}
      if(this.searchValue){
        this.queryParam[this.searchField] = `${this.searchValue}`
      }
      this.loadData(1)
      this.getStatStepClueVo()
    },
    //获取统计数据
    getStatStepClueVo(){
      let projectOrgId = this.$route.query.projectOrgId
      if(!projectOrgId){
        return
      }
      getAction(this.url.statClue, { projectOrgId }).then(res => {
        if (res.success) {
          this.statStepClueVo = res.result
        } else {
          this.$message.warning(res.message);
        }
      })

    },
    showDtlList(record){
      this.$refs.dtlListRef.visible = true
      this.$refs.dtlListRef.initData(record,this.url.clueDtlList)
    },
    goAudit(record,auditState) {
      this.confirmLoading = true;
      postAction(this.url.audit,{auditState,clueId:record.clueId,auditOpinion:''}).then((res)=>{
        if(res.success){
          this.$message.success(res.message);
          this.refreshData()
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },
    goBatchAudit(fnType) {
      if(fnType=='createByClue'){
        if(this.selectedRowKeys.length===0){
          this.$message.error("请您至少选择一条记录进行反馈医院操作")
          return
        }
        let clueIds =  this.selectedRowKeys
        this.$refs.taskModal.clueIds =clueIds
      }else{
        this.$refs.taskModal.clueIds =[]
      }
      this.$refs.taskModal.fnType = fnType
      this.$refs.taskModal.projectOrgId = this.$route.query.projectOrgId
      this.$refs.taskModal.disableSubmit = false
      this.$refs.taskModal.readonly = false
      this.$refs.taskModal.add()
    },
    showTaskInfo(record,fnType){
      this.$refs.taskModal.fnType = fnType
      this.$refs.taskModal.projectOrgId = this.$route.query.projectOrgId
      this.$refs.taskModal.disableSubmit = fnType=='view'?true:false
      this.$refs.taskModal.readonly = fnType=='view'?true:false
      this.$refs.taskModal.edit(record)
    },

    goPush(){
      let clueIds =  this.selectedRowKeys
      this.$refs.pushModal.loadData(clueIds, this.getQueryParams());
    },
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.handleExportFile('线索汇总表'+ moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //附件下载

    refreshTaskList(){
      if(this.isActive=='2'){
        this.$refs.projectTaskModal.getTaskList();
      }
    },
    //刷新列表
    refreshData() {
      // 新增/修改 成功时，重载列表
      this.loadData()
      this.onClearSelected()
      //统计刷新
      this.getStatStepClueVo()
    },

  }
}
</script>
<style lang="less" scoped>
  .topTab{
    /deep/.ant-tabs-bar{
      margin:0;
    }
  }

  .tabTitle{
    width: 100%;
    text-align: center;
  }

  .disRow {
    display: flex;
    flex-direction: row
  }

  .tabBox {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 400px;
    background: rgba(162,166,169,0.2);
    padding: 6px 10px;
    margin-top: 10px;
    border-radius: 5px
  }

  .tabBtn {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #333;
    border-radius: 5px;
    width: 48%;
    cursor: pointer;
    padding: 10px;
  }

  .activeBtn {
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #1890ff;
    background: #fff;
    padding: 10px;
    width: 48%;
    cursor: pointer;
  }
  .sumTip{
    background: #e4f0f9;
    color:#108EE9;
    padding:12px;
    font-weight: bold;
  }


</style>