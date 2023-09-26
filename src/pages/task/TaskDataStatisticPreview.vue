<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <a-spin :spinning="searchLoading">

    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <h3>批次 - 过滤条件</h3>
        <div class="fieldset-box">
        <a-row :gutter="24" style="margin-bottom: -20px">
          <a-col  :xxl="6" :xl="8" :md="12">
            <a-form-item label="数据来源">
              <m-dict-select-tag placeholder="选择数据来源" dictCode="ETL_SOURCE"
                                 v-model="queryParam.etlSource" :disabled="readonly"
              ></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col  :xxl="6" :xl="8" :md="12">
            <a-form-item label="数据时间">
              <j-date placeholder="" v-model="queryParam.visitdate_begin"
                             class="search-divider-item"></j-date>
              <div class="search-divider">~</div>
              <j-date placeholder="" v-model="queryParam.visitdate_end"
                             class="search-divider-item"></j-date>
            </a-form-item>
          </a-col>

          <a-col :xxl="6" :xl="8" :md="12">
            <a-form-item label="机构选择">
              <input-medical-org-dwb v-model="queryParam.orgid" multi hideButton :maxTag="2" separator="|"></input-medical-org-dwb>
            </a-form-item>
          </a-col>

<!--          <template v-if="toggleSearchStatus">-->

            <a-col :xxl="6" :xl="8" :md="12">
              <a-form-item label="医保基金支付金额去除0">
                <m-dict-select-tag dictCode="YESNO" v-model="queryParam.fundpayGt0"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <h3>项目 - 排除条件</h3>
        <div class="fieldset-box">
          <a-row :gutter="24" style="margin-bottom: -20px">
            <a-col :xxl="6" :xl="8" :md="12">
              <a-form-item label="就诊类型">
                <input-medical-other-dict dict="VisitType" multi hideButton separator="|"
                                          v-model="queryParam.visittypeId"  :maxTag="2"></input-medical-other-dict>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xl="8" :md="12">
              <a-form-item label="支付方式">
                <input-medical-other-dict dict="PayWay" multi hideButton separator="|"
                                          v-model="queryParam.paywayId"  :maxTag="2"></input-medical-other-dict>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xl="8" :md="12">
              <a-form-item label="结算方式">
                <input-medical-other-dict dict="fun_settleway" multi hideButton separator="|"
                                          v-model="queryParam.funSettlewayId"  :maxTag="2"></input-medical-other-dict>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xl="8" :md="12">
              <a-form-item label="疾病诊断">
                <input-medical-disease-diag multi hideButton separator="|"
                                          v-model="queryParam.diseasecodeCustom"  :maxTag="2"></input-medical-disease-diag>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xl="8" :md="12">
              <a-form-item label="疾病映射不全过滤">
                <m-dict-select-tag dictCode="YESNO" v-model="queryParam.diseaseMappingFilter"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <a-row :gutter="24">
<!--          </template>-->
          <a-col  :xxl="6" :xl="8" :md="12">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

<!--              <a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

          <a-col :xxl="12" :xl="10" :md="12">
            <a-form-item label="历史批次条件">
              <batch-select v-model="batchSelectVal" @change="projectBatchSelect"></batch-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    </a-spin>
<!--     操作按钮区域 -->
<!--
    <div class="table-operator">
      <a-row>
        <a-col :md="8" :xs="24">

        </a-col>
        <a-col>

        </a-col>
      </a-row>


    </div>
-->

    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="val"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :isorter="false"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{y: scrollY}"
        v-bind="tableAttrs"
        @change="handleTableChange">

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import InputMedicalOrgDwb from "@/pages/selectInput/MedicalOrgDwb"
import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
import InputMedicalDiseaseDiag from "@/pages/selectInput/MedicalDiseaseDiag"
import BatchSelect from '@/pages/task/plugin/BatchSelect.vue'
import moment from 'moment'

import pick from 'lodash/pick'
export default {
  name: 'TaskActionFieldColList',
  mixins: [JeecgListMixin],
  components: {
    MDictSelectTag,
    InputMedicalOrgDwb,
    InputMedicalOtherDict,
    InputMedicalDiseaseDiag,
    BatchSelect,
  },
  data() {
    return {
      description: '不合规行为表字段信息配置管理页面',
      // 表头
      columns: [
        {
          title: '医疗机构名称',
          align: 'center',
          dataIndex: 'val',
        },
        {
          title: '医疗总费用',
          align: 'center',
          dataIndex: 'sumTotalfee',
          customRender: t => t?t.toFixed(2):undefined
        },
        {
          title: '基金总费用',
          align: 'center',
          dataIndex: 'sumFundpay',
          customRender: t => t?t.toFixed(2):undefined
        },
        {
          title: '就诊记录总数',
          align: 'center',
          dataIndex: 'visitidCount',
        },
        {
          title: '筛查明细总数',
          align: 'center',
          dataIndex: 'chargeidCount'
        },
      ],
      url: {
        list: this.$suncare_v3 + '/apiTask/taskDataPreview/hospitalStatistic',
        exportXlsUrl: 'task/taskActionFieldCol/exportXls',
        importExcelUrl: 'task/taskActionFieldCol/importExcel',
        queryConditionByRuleId: "/task/taskCommonConditionSet/queryByRuleId",
        queryBatchById: "/task/taskProjectBatch/queryById",

      },
      /* 排序参数 */
      isorter: {
        column: 'createTime,tableName,colName',
        order: 'desc,asc,asc'
      },
      initLoad: false,
      heightRatio: 1,
      tableMarginTop: 200,
      searchLoading: false,
      batchSelectVal: undefined
    }
  },
  mounted(){
    this.$refs.table.setEmptyDesc('请先选择查询条件')
  },
  computed: {},
  methods: {
    projectBatchSelect([projectId, batchId]) {
      if(!projectId || !batchId){
        return
      }
      this.searchLoading = true
      Promise.all([this.loadProjectRule(projectId)
        , this.loadBatchRule(batchId)]).then(res => {
        let [projectRule, batchRule] = res
        this.queryParam = {...projectRule, ...batchRule}
      }).finally(() =>{
        this.searchLoading = false

      })
    },
    loadProjectRule(projectId){
      return new Promise((resolve, reject) => {
        getAction(this.url.queryConditionByRuleId, { ruleId: projectId }).then(res => {
          if (res.success) {
            let data = res.result
            if (data.length === 0) {
              return
            }
            let fieldMapping = {
              'visittype': {
                field: 'visittypeId',
                separatorTo: [',', '|']
              },
              'payway': {
                field: 'paywayId',
                separatorTo: [',', '|']
              },
              'funSettleway': {
                field: 'funSettlewayId',
                separatorTo: [',', '|']
              },
              'diseaseDiag': {
                field: 'diseasecodeCustom',
                separatorTo: [',', '|']
              },
              'diseaseMappingFilter': {
                field: 'diseaseMappingFilter'
              },
            }
            let dataObj = {}
            data.forEach(r => {
              let fieldObj = fieldMapping[r.field] || {field: r.field}
              let separatorTo = fieldObj.separatorTo
              dataObj[fieldObj.field] = separatorTo
                ? r.ext1.replace(new RegExp(separatorTo[0], 'g'), separatorTo[1])
                : r.ext1
            })
            resolve(dataObj)
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    loadBatchRule(batchId){
      return new Promise((resolve, reject) => {
        getAction(this.url.queryBatchById, { id: batchId }).then(res => {
          if (res.success) {
            let record = res.result || {}
            let obj = {
              etlSource: record.etlSource,
              visitdate_begin: moment(record.startTime),
              visitdate_end: moment(record.endTime),
              fundpayGt0: record.ybFundRm0,
              orgid: record.customFilter && record.customFilter.split(',').join('|') || undefined
            }
            resolve(obj)
          } else {
            reject()
            this.$message.warning(res.message);
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    searchReset() {
      this.queryParam = {}
      this.batchSelectVal = undefined
    },



  }
}
</script>
<style scoped>

</style>
