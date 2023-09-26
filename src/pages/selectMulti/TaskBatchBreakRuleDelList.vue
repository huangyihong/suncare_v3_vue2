<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :xs="8">
            <a-form-item label="业务组名称">
              <j-input placeholder="请输入业务组名称" v-model="queryParam.busiName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="8">
            <a-form-item label="违规模型名称">
              <j-input placeholder="请输入违规模型名称" v-model="queryParam.caseName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="8">
            <a-form-item label="状态">
              <m-dict-select-tag placeholder="请选择" dictCode="RUN_STATUS"
                                 v-model="queryParam.status"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              </span>
             </a-col>

        </a-row>
      </a-form>
    </div>


    <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection, getCheckboxProps}"
      :scroll="{ x: scrollX, y: scrollY}"
      v-bind="tableAttrs"
      @change="handleTableChange">
      <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
      <a slot="caseName" slot-scope="text,record" class="pointer" @click="caseDetail(record.caseId)">
        {{text}}
      </a>
      <a slot="clinicalName" slot-scope="text,record" class="pointer" @click="clinicalDetail(record.caseId)">
        {{text}}
      </a>
      <!-- 字符串超长截取省略号显示 -->
      <span slot="errorMsg" slot-scope="text,record">
          <j-ellipsis :value="text" :length="10"/>
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
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'

  export default {
    name: "TaskBatchBreakRuleDelList",
    mixins: [JeecgListMixin,multiSelectMixin],
    components: {
      MDictSelectTag,
      JEllipsis,
      CaseDetailModal,
      MedicalClinicalModal,
    },
    props: {
      batchId: String,
      ruleType: String,
      reviewUserid: String,
    },
    data() {
      let columns = [
        {
          title: '违规模型名称',
          align: "center",
          dataIndex: 'caseName',
          scopedSlots: { customRender: 'caseName' },
          width: 120
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
          width: 120
        },
        {
          title: '违规总金额',
          align: "center",
          dataIndex: 'totalAcount',
          width: 120
        },
        {
          title: '审核人',
          align: "center",
          dataIndex: 'reviewUsername',
          width: 120
        },
       /* {
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
        },*/
        /*{
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
        },*/
      ]
      if (this.ruleType === 'CASE') {
        columns.unshift({
          title: '业务组名称',
          align: "center",
          dataIndex: 'busiName',
          width: 120
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
        fixedParam: {
          ruleType: this.ruleType === 'CASE'?'01':'06'
        },
        id: 'id',
        code: 'caseId',
        name: 'caseName',
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
    },
    methods: {
      getCheckboxProps(record){
        const disabled = !(this.reviewUserid && record.reviewUserid === this.reviewUserid) && record.reviewUserid && record.reviewUserid !== ''
        let style = {}
        if(disabled){
          style.display = 'none'
        }
        return {
          props: {
            disabled , // Column configuration not to be checked
            style
          }
        }
      },
      clinicalDetail(id){
        this.$refs.clinicalModalForm.detail(id)
      },
      caseDetail(id){
        this.$refs.caseModal.detail(id)
      },
    }
  }
</script>
<style scoped>
  /*@import '~@assets/less/common.less'*/
</style>
