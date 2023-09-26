<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :lg="6" :xs="8" v-if="ruleType === 'CASE'">
            <a-form-item label="业务组名称" >
              <j-input placeholder="请输入业务组名称" v-model="queryParam.busiName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :xs="8">
            <a-form-item label="违规模型名称">
              <j-input placeholder="请输入违规模型名称" v-model="queryParam.caseName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :xs="8">
            <a-form-item label="状态">
              <m-dict-select-tag placeholder="请选择" dictCode="RUN_STATUS"
                                 v-model="queryParam.status"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <!--<template v-if="toggleSearchStatus">
            <a-col :lg="6" :xs="8">
              <a-form-item label="审核状态">
                <m-dict-select-tag placeholder="请选择" dictCode="REVIEW_STATE" v-model="queryParam.reviewStatus"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          </template>-->
          <a-col :lg="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <!--<a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-popconfirm title="确定推送选中模型吗?" @confirm="pushSelect()" v-if="onStep">
        <a-button type="primary" :loading="pushLoading">推送</a-button>
      </a-popconfirm>-->
      <a-button type="primary" @click="pushReview()" v-if="onStep">初审通过</a-button>
      <a-button type="primary" v-has="'review:export'" icon="download" @click="handleExportExcel(`${ruleType==='CASE'?'模型':ruleType==='CLINICAL'?'临床路径':''}运行详情`)">导出</a-button>
      <a-button type="primary" v-has="'review:export'" @click="handleExportFile('明细导出.xlsx', undefined, url.exportDynamicColsByCase)">明细导出</a-button>
      <a-button type="primary" v-has="'review:import'" @click="handleImportReviewExcel">明细导入</a-button>

    </div>
    <!-- table区域-begin -->

    <slot name="tabs"></slot>
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
      selectedRowKeys.length }}</a>项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps}"
      :scroll="{ x: scrollX, y:scrollPageY}"
      v-bind="tableAttrs"
      @change="handleTableChange">
      <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
      <a slot="caseName" slot-scope="text,record" @click="caseDetail(record)">
        {{text}}
      </a>
      <a slot="clinicalName" slot-scope="text,record" @click="clinicalDetail(record.caseId)">
        {{text}}
      </a>
      <template slot="recordNum" slot-scope="text,record">
        <a @click="gotoReview(record)" v-if="text > 0">
          {{text}}
        </a>
        <template v-else>
          {{text}}
        </template>
      </template>
      <!-- 字符串超长截取省略号显示 -->
      <span slot="errorMsg" slot-scope="text,record">
          <j-ellipsis :value="text" :length="10"/>
        </span>
      <span slot="action" slot-scope="text, record">
        <span v-if="record.status !== 'deleted'" v-has="'reviewTaskCase:delete'">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete([record.id])"
                        >
               <a>删除</a>
          </a-popconfirm>
        <a-divider type="vertical"/>
        </span>

          <a-popconfirm title="确定重跑吗?" @confirm="() => handleReRun([record.id])">
               <a>重跑</a>
          </a-popconfirm>

        <!--  <a v-if="record.reviewStatus!=='audited' && assignIds.has(record.caseId)"
             @click="gotoReview(record.caseId)">开始审核</a>
          <template v-else-if="record.reviewStatus==='audited'">
            已审核<a @click="gotoReview(record.caseId)">(查看)</a>
          </template>-->

      </span>

    </a-table>

    <!--<task-review-system-assign ref="assignModal" @reload="reloadData"></task-review-system-assign>-->
    <case-detail-modal ref="caseModal" :batchId="batchId"></case-detail-modal>
    <medicalClinical-modal ref="clinicalModalForm"></medicalClinical-modal>
    <review-push-modal ref="reviewModel" :batchId="batchId" :url="{save: url.pushCase}"
                         @ok="modalFormOk"></review-push-modal>
    <!--导入-->
    <import-modal ref="importModel" tip="文件中必须包含：记录ID、判定结果、推送状态列名。超过50MB请删除其余列"
                  @ok="modalFormOk"></import-modal>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import {  getAction } from '@/api/manage'
  import {  postAction } from '@/api-sv3/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  import JEllipsis from '@/components/jeecg/JEllipsis'
  import moment from "moment"

  import CaseDetailModal from '@/pages/probe/caseDetailModal'
  import MedicalClinicalModal from '@/pages/config/modules/MedicalClinicalModal'
  // import TaskReviewSystemAssign from '@/pages/review/TaskReviewSystemAssign'
  import ReviewPushModal from "@/pages/review/plugins/ReviewPushModal"
  import ImportModal from '@/components/ImportModal'


  export default {
    name: "reviewTaskCase",
    mixins: [JeecgListMixin],
    components: {
      MDictSelectTag,
      JEllipsis,
      CaseDetailModal,
      MedicalClinicalModal,
      // TaskReviewSystemAssign,
      ReviewPushModal,
      ImportModal,
    },
    props: {
      batchId: String,
      ruleType: String,
      onStep: Boolean
    },
    data() {
      let columns = [
        {
          title: '违规模型名称',
          align: "center",
          dataIndex: 'caseName',
          scopedSlots: { customRender: 'caseName' },
          width: 180
        },
        /*{
          title: '违规主体数',
          align: "center",
          dataIndex: 'objectNum',
          width: 120
        },*/
        {
          title: '违规记录数',
          align: "center",
          dataIndex: 'recordNum',
          scopedSlots: { customRender: 'recordNum' },
          width: 120
        },
        {
          title: '涉案金额',
          align: "center",
          dataIndex: 'actionMoney',
          width: 120
        },
        {
          title: '就诊总金额',
          align: "center",
          dataIndex: 'totalAcount',
          width: 120
        },
        {
          title: '状态',
          align: "center",
          dataIndex: 'status_dictText',
          customRender: t => t.indexOf('删除') > -1?<span class="t-red">{t}</span>: t,
          width: 120
        },
        {
          title: '异常信息',
          align: "center",
          dataIndex: 'errorMsg',
          // scopedSlots: { customRender: 'errorMsg' },
          width: 120
        },
        {
          title: '执行开始时间',
          align: "center",
          dataIndex: 'startTime',
          width: 120
        },
        {
          title: '执行结束时间',
          align: "center",
          dataIndex: 'endTime',
          width: 120
        },
        {
          title: '审核人',
          align: "center",
          dataIndex: 'reviewUsername',
          width: 120
        },
      ]
      if (this.ruleType === 'CASE') {
        columns.unshift({
          title: '业务组名称',
          align: "center",
          dataIndex: 'busiName',
          width: 180
        })
      } else if (this.ruleType === 'CLINICAL') {
        columns[0].title = "临床路径名称"
        columns[0].scopedSlots = { customRender: 'clinicalName' }
      }

      let ruleTypeMap = {
        'CASE': '01',
        'NEWCASE': '11',
        'CLINICAL': '06'
      }

      return {
        description: '违规模型详情管理页面',
        // 表头
        columns,
        url: {
          list: "/task/taskBatchBreakRuleDel/list",
          listAssign: "/task/taskReviewAssign/listRuleId",
          delete: "/task/taskBatchBreakRuleDel/delete",
          deleteBatch: "/task/taskBatchBreakRuleDel/deleteBatch",
          exportXlsUrl: "task/taskBatchBreakRuleDel/exportXls",
          exportExcelByThread: "task/taskBatchBreakRuleDel/exportXlsThread",
          importExcelUrl: "task/taskBatchBreakRuleDel/importExcel",
          pushCase: this.$suncare_v3 + this.$gp_database + '/apiReviewFirst/pushCase',
          exportDynamicColsByCase: this.$suncare_v3 + this.$gp_database +'/apiReviewFirst/dynamicColsExportByCase',
          importReviewExcelUrl: this.$suncare_v3 + this.$gp_database + '/apiReviewFirst/importReviewExcel',

        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 50,
          pageSizeOptions: ['10', '20', '30','50', '100'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        fixedParam: {
          ruleType: ruleTypeMap[this.ruleType]
        },
        assignIds: new Set(),
        pushLoading: false
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    watch: {
      batchId: {
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.fixedParam.batchId = val
          }
        },
      },
      onStep: {
        immediate: true,
        handler(val) {
          let col = {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
            width: 120
          }
          if (val) {
            this.columns.push(col)
          } else {
            let index = this.columns.findIndex(item => item.dataIndex === col.dataIndex)
            if (index >= 0) {
              this.columns.splice(index, 1)
            }
          }
        },
      },
    },
    beforeMount(){
      // this.loadAssignRuleIds()
    },
    methods: {
      /*pushSelect(){
        let caseIds = Array.from(new Set(this.dataSource.filter(r => this.selectedRowKeys.indexOf(r.id) > -1).map(r => r.caseId)));
        if(caseIds.length === 0){
          this.$message.warn('请勾选需要推送的模型')
          return
        }
        this.pushLoading = true
        postAction(this.url.pushCase, {batchId:this.batchId, caseIds: caseIds.join(',') }).then(res => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          this.pushLoading = false
        })
      },*/
      getCheckboxProps: record => ({
        props: {
          // disabled: record.status !== 'normal', // Column configuration not to be checked
        },
      }),
      reloadData(){
        this.loadAssignRuleIds()
        this.loadData(1)
      },
      clinicalDetail(id){
        this.$refs.clinicalModalForm.detail(id)
      },
      caseDetail({caseId, caseClassify}){
        this.$refs.caseModal.detail(caseId, caseClassify)
      },
      handleReRun(ids) {
        this.loading = true
        postAction(this.$suncare_v3 + "/apiTask/taskProjectBatch/execCase",{ detailIds: ids.join(","), batchId: this.batchId}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData(1)
          } else {
            this.$message.warning(res.message);
            this.loading = false
          }
        })
      },
      handleDelete(ids) {
        this.loading = true
        postAction(this.$suncare_v3 + "/apiTask/taskProjectBatch/deleteCase",{ detailIds: ids.join(","), batchId: this.batchId}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData(1)
          } else {
            this.$message.warning(res.message);
            this.loading = false
          }
        })
      },
      //导出
      handleExportExcel(name) {
        if(this.ipagination.total === 0){
          this.$message.warn('没有需要导出的数据')
          return
        }
        let totalCount = this.ipagination.total;
        if (totalCount < 1000) {
          this.handleExportXls(name + moment().format('YYYYMMDDHHmmss'))
          return;
        }
        this.handleExportXlsAsync()
      },
     /* isAssignFilterChange(val){
        console.log('isAssignFilterChange',val)
        if(val === 'assign'){
          this.fixedParam.caseId = Array.from(this.assignIds).join(",");
        } else {
          delete this.fixedParam.caseId
        }
        this.loadData(1)

      },
      loadAssignRuleIds(){
        let params = {batchId: this.batchId, ruleType: this.ruleType}
        getAction(this.url.listAssign, params).then(res => {
          if (res.success) {
            this.assignIds = new Set(res.result.map(item => item.CASE_ID))
          } else {
            this.$message.warning(res.message);
          }
        })
      },*/
      gotoReview({caseId, caseClassify}){
        this.$router.push({path: '/review/reviewSystemRuleView', query: {batchId:this.batchId,caseId
            ,ruleType: this.ruleType.indexOf('CASE')> -1? 'CASE':this.ruleType}})
      },
      //推送
      pushReview() {
        let caseIds = Array.from(new Set(this.dataSource.filter(r => this.selectedRowKeys.indexOf(r.id) > -1).map(r => r.caseId)));
        /*if(caseIds.length === 0){
          this.$message.warn('请勾选需要推送的模型')
          return
        }*/
        this.$refs.reviewModel.loadData(caseIds,this.getQueryParams());
      },
      //导入普通审核记录
      handleImportReviewExcel() {
        let param = {
          title: '批量导入审核记录',
          importUrl: this.url.importReviewExcelUrl,
          actionType: 'add',
          param: {
            ...this.getQueryParams(),
          }
        }
        this.$refs.importModel.loadData(param)
      },
    }
  }
</script>
<style scoped>
  /*@import '~@assets/less/common.less'*/
</style>
