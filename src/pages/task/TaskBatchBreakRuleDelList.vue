<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :xs="8" v-if="ruleType === 'CASE'">
            <a-form-item label="业务组名称">
              <j-input placeholder="请输入业务组名称" v-model="queryParam.busiName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="8" v-if="ruleType === 'CLINICAL'">
            <a-form-item label="违规临床路径">
              <j-input placeholder="请输入违规临床路径名称" v-model="queryParam.clinicalNames"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="8">
            <a-form-item label="运行状态">
              <m-dict-select-tag placeholder="请选择" dictCode="RUN_STATUS"
                                 v-model="queryParam.status"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              </span>
             </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportExcel(`${ruleType==='CASE'?'模型':ruleType==='CLINICAL'?'临床路径':''}运行详情`)">导出</a-button>
      <!--<template v-if="onStep">
        <a-popconfirm title="确定重跑吗?" @confirm="() => handleReRun(selectedRowKeys)" v-if="selectedRowKeys.length > 0">
          <a-button type="primary" icon="redo">批量重跑</a-button>
        </a-popconfirm>
      </template>-->
    </div>
    <!-- table区域-begin -->

  <!--  <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="onStep">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
      selectedRowKeys.length }}</a>项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>-->
    <slot name="tabs"></slot>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="false"
      :scroll="{ x: scrollX,}"
      v-bind="tableAttrs"
      @change="handleTableChange">
      <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
      <a slot="caseName" slot-scope="text,record" class="pointer" @click="caseDetail(record.caseId)">
        {{text}}
      </a>
      <a slot="clinicalName" slot-scope="text,record" class="pointer" @click="clinicalDetail(record.caseId)">
        {{text}}
      </a>
      <a slot="recordNum" slot-scope="text,record"  @click="gotoReview(record.caseId)">
        {{text}}
      </a>
      <!-- 字符串超长截取省略号显示 -->
      <span slot="errorMsg" slot-scope="text,record">
          <j-ellipsis :value="text" :length="10"/>
        </span>
      <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定重跑吗?" @confirm="() => handleReRun([record.id])" v-if="record.status === 'abnormal'">
               <a>重跑</a>
          </a-popconfirm>
        </span>

    </a-table>

    <case-detail-modal ref="caseModal" :batchId="batchId"></case-detail-modal>
    <medicalClinical-modal ref="clinicalModalForm"></medicalClinical-modal>

    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  import JEllipsis from '@/components/jeecg/JEllipsis'
  import moment from "moment"

  import CaseDetailModal from '@/pages/probe/caseDetailModal'
  import MedicalClinicalModal from '@/pages/config/modules/MedicalClinicalModal'
  import {  postAction } from '@/api-sv3/manage'


  export default {
    name: "TaskBatchBreakRuleDelList",
    mixins: [JeecgListMixin],
    components: {
      MDictSelectTag,
      JEllipsis,
      CaseDetailModal,
      MedicalClinicalModal,
    },
    props: {
      batchId: String,
      ruleType: String,
      onStep: {
        type: Boolean,
        default: false,
      }
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
          width: 120,
          scopedSlots: { customRender: 'recordNum' },
        },
        {
          title: '违规总金额',
          align: "center",
          dataIndex: 'totalAcount',
          width: 120
        },
        {
          title: '状态',
          align: "center",
          dataIndex: 'status_dictText',
          width: 120
        },
        {
          title: '异常信息',
          align: "center",
          dataIndex: 'errorMsg',
          scopedSlots: { customRender: 'errorMsg' },
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
       /* {
          title: '审核人',
          align: "center",
          dataIndex: 'reviewUsername',
          width: 120
        },*/
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

      return {
        description: '违规模型详情管理页面',
        // 表头
        columns,
        url: {
          list: "/task/taskBatchBreakRuleDel/list",
          delete: "/task/taskBatchBreakRuleDel/delete",
          deleteBatch: "/task/taskBatchBreakRuleDel/deleteBatch",
          exportXlsUrl: "task/taskBatchBreakRuleDel/exportXls",
          exportExcelByThread: "task/taskBatchBreakRuleDel/exportXlsThread",
          importExcelUrl: "task/taskBatchBreakRuleDel/importExcel",
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 50,
          pageSizeOptions: ['10', '20', '30','50','100'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        fixedParam: {
          ruleType: this.ruleType
        }
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
         /* let col = {
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
          }*/
        },
      },
    },
    methods: {
      clinicalDetail(id){
        this.$refs.clinicalModalForm.detail(id)
      },
      caseDetail(id){
        this.$refs.caseModal.detail(id)
      },
     /* gotoReview(clinicalId){
        this.$router.push({path: '/review/reviewSystemCommonView', query: {batchId:this.batchId,clinicalId, ruleType: 'CLINICAL'}})
      },*/
      handleReRun(ids) {
        this.loading = true
        postAction(this.$suncare_v3 + "/apiTask/taskProjectBatch/execCase",{ detailIds: ids.join(",")}).then(res => {
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
    }
  }
</script>
<style scoped>
  /*@import '~@assets/less/common.less'*/
</style>
