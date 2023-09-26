<template>
    <a-card :bordered="false">
        <template v-if="isTrail">
            <breadcrumb :parent="{path:trailPath}"
                        :current="{meta:{title:'试算结果'}}"></breadcrumb>
        </template>

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">

                <a-row :gutter="24">
                    <a-col :xxl="4" :lg="6" :sm="8">
                        <a-form-item label="不合规行为">
                            <m-dict-select-tag placeholder="请选择不合规行为" :options="actionData" search
                                               v-model="queryParam.actionId" :loading="actionLoading"/>
                        </a-form-item>
                    </a-col>
                    <!--动态搜索条件-->
                    <template v-for="(item,index) in toggleSearchStatus?dynamicSearchs:dynamicSearchs.slice(0, 2)">
                        <a-col v-bind="item.inputType === '2'?{xxl: 8, sm:12}:{xxl:4, lg:6, sm: 8}">
                            <a-form-item :label="item.title">
                                <template v-if="item.inputType === '2'">
                                    <component :is="item.component" v-bind="item.param" class="search-divider-item"
                                               v-model="queryParam.dynamicSearch[item.field + '_begin']"></component>
                                    <div class="search-divider">~</div>
                                    <component :is="item.component" v-bind="item.param" class="search-divider-item"
                                               v-model="queryParam.dynamicSearch[item.field + '_end']"></component>
                                </template>
                                <component :is="item.component" v-bind="item.param" v-else class="w-b-100"
                                           v-model="queryParam.dynamicSearch[item.field]"></component>
                            </a-form-item>
                        </a-col>
                    </template>
                    <template v-if="toggleSearchStatus">
                        <a-col :lg="6" :sm="8">
                            <a-form-item label="通过状态">
                                <a-select placeholder="请选择" v-model="queryParam.pushStatus" allowClear>
                                    <a-select-option value="!1">未通过</a-select-option>
                                    <a-select-option value="1">通过</a-select-option>
                                    <!--<a-select-option value="0">不推送</a-select-option>-->
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="8">
                            <a-form-item label="判定结果">
                                <m-multi-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus" separator="|"></m-multi-select-tag>
                                <!--<m-dict-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus"></m-dict-select-tag>-->
                            </a-form-item>
                        </a-col>
                        <a-col :xxl="8" :sm="12">
                          <a-form-item label="Pr(概率)">
                            <a-input placeholder="精确查询" v-model="queryParam.probility_begin" class="search-divider-item"></a-input>
                            <div  class="search-divider">~</div>
                            <a-input placeholder="精确查询" v-model="queryParam.probility_end" class="search-divider-item"></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="8">
                          <a-form-item label="Label(AI标签)">
                            <m-multi-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.predictLabel" separator="|"></m-multi-select-tag>
                            <!--<m-dict-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus"></m-dict-select-tag>-->
                          </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="8">
                          <a-form-item label="规则级别">
                            <a-select placeholder="请选择规则级别" v-model="queryParam.ruleGrade" :allowClear="true">
                              <a-select-option value="1级">1级</a-select-option>
                              <a-select-option value="2级">2级</a-select-option>
                              <a-select-option value="3级">3级</a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>

                    </template>

                    <a-col :xxl="4" :lg="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search" :loading="searchBtnLoading">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
                    </a-col>

                </a-row>
            </a-form>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <template v-if="!isTrail && onStep">
                <async-log-modal-button ref="asyncLogRef" style="float:right"
                                        :param="(caseId?['batchId=' + batchId, 'caseId=' + caseId, 'ruleType=' + ruleTypeVal]
                                        :['batchId=' + batchId, 'ruleType=' + ruleTypeVal]).join('&')"
                ></async-log-modal-button>
                <a-button type="primary" @click="updatePredictLabel()">AI结果打标</a-button>
                <a-button type="primary" @click="updateReviewStatus()">初审判定</a-button>
                <a-button type="primary" @click="pushReview()">初审通过</a-button>
                <a-button type="primary" v-has="'review:import'" @click="handleImportReviewExcel()">导入审核记录</a-button>
                <a-button type="primary" v-has="'review:import'" @click="handleImportGroupReviewExcel()">导入分组统计审核</a-button>
            </template>
            <a-button type="primary" v-has="'review:export'" @click="handleExportMenu({key:'dynamicColsExport'})">导出</a-button>

            <a-breadcrumb separator=">" class="p-l-10 p-r-10"
                          style="display: inline-block;height: 32px;line-height: 32px;background-color: #eeee;"
                          v-if="groupby.length > 0 && groupbyIndex > -1">
                <a-breadcrumb-item><a class="t-blue" @click="resetToActionFields">全部</a></a-breadcrumb-item>
                <template v-for="(item,index) in groupby">
                    <a-breadcrumb-item>
                        <a class="t-blue" v-if="index < groupbyIndex" @click="toLastDetail(index)">
                            {{item.data.map(r => fixedParam[r.humpCode]).join(',')}}</a>
                        <span :class="groupbyIndex === index?'t-red':'t-grey-bbb'" v-else>
                                {{item.data.map(r => r.value).join(',')}}
                            </span>
                    </a-breadcrumb-item>
                </template>
                <a-breadcrumb-item><a :class="groupbyIndex === groupby.length?'t-red':'t-grey-bbb'">详细</a>
                </a-breadcrumb-item>
            </a-breadcrumb>
            <!-- <a-radio-group v-model="isActionField" button-style="solid"
                            @change="onActionFieldChange">
                 <a-radio-button :value="false">
                     默认字段
                 </a-radio-button>
                 <a-radio-button :value="true">
                     不合规行为字段
                 </a-radio-button>
             </a-radio-group>-->
        </div>
        <!-- table区域-begin -->

        <slot name="tabs"></slot>
        <div>
          <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                        v-on="selectActionOn"></selected-tag>
            <a-table
                    ref="table"
                    class="footer-padding0 min-table"
                    size="middle"
                    bordered
                    :rowKey="rowKey"
                    tableLayout="fixed"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading || actionLoading || searchBtnLoading"
                    :scroll="{ x: scrollX, y:scrollPageY }"
                    :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent, fixed: true}"
                    @change="handleTableChange"
                    v-bind="tableAttrs">
                <span slot="firReviewStatus" slot-scope="text, record">
            <span v-if="text==='init'">未判定</span>
            <span style="color: #09b909;" v-if="text==='white'">白名单</span>
            <span style="color: red;" v-if="text==='blank'">黑名单</span>
            <span style="color: #b9adad;" v-if="text==='grey'">灰名单</span>
        </span>
              <span slot="predictLabel" slot-scope="text, record">
            <span v-if="text==='init'">未判定</span>
            <span style="color: #09b909;" v-if="text==='white'">白名单</span>
            <span style="color: red;" v-if="text==='blank'">黑名单</span>
            <span style="color: #b9adad;" v-if="text==='grey'">灰名单</span>
        </span>
                <a slot="groupByCount" slot-scope="text, record" @click="toNextDetail(record[rowKey])">
                    {{text}}
                </a>
                <template slot="footer" slot-scope="text">
                    <jsx-temp :jsx="tableFooterJsx"></jsx-temp>
                </template>
            </a-table>
        </div>
        <!-- table区域-end -->
        <review-detail-model ref="reviewDetailModel" :batchId="batchId" showPush></review-detail-model>
        <template v-if="!isTrail">
            <review-push-modal ref="reviewModel" :batchId="batchId" @ok="updateOk"
                               :url="{save:url.pushRecord,query: url.queryReviewInfoById}"
            ></review-push-modal>
            <review-status-modal ref="reviewStatusModel" :batchId="batchId" :url="reviewStatusModelUrl" :stepAi="stepAi"
                                 @ok="updateOk"></review-status-modal>
            <!--导入-->
            <import-modal ref="importModel" tip="文件中必须包含：记录ID、判定结果、推送状态列名。超过50MB请删除其余列"
                          @ok="modalFormOk"></import-modal>
        </template>
        <!--<select-modal ref="selectModal"></select-modal>-->
    </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { reviewDynamicColMixin } from './mixin'
  import { getAction, putAction } from '@/api-sv3/manage'
  import { querySysDictByType, querySysDictByTypes } from '@/api-sv3/api'

  import moment from "moment"
  import { drugLimitScope, chargeLimitScope } from "@//pages/case/DrugRuleCommon"

  import Breadcrumb from '@/components/Breadcrumb'
  import ReviewDetailModel from "./modules/reviewDetailModel"
  import ReviewStatusModal from "@/pages/review/plugins/ReviewStatusModal"
  import ReviewPushModal from "@/pages/review/plugins/ReviewPushModal"

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import JDate from '@/components/jeecg/JDate'
  import InputMedicalOtherDict from '@/pages/selectInput/MedicalOtherDict'
  import GroupbyBtn from "@/pages/review/plugins/GroupbyBtn"
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'

  export default {
    name: "reviewSystemRuleView",
    mixins: [JeecgListMixin, reviewDynamicColMixin, multiSelectIdMatchMixin],
    props: {
      ruleType: String,
      onStep: Boolean
    },
    components: {
      Breadcrumb,
      ReviewDetailModel,
      ReviewStatusModal,
      ReviewPushModal,

      MDictSelectTag,
      MMultiSelectTag,
      JDate,
      InputMedicalOtherDict,
      GroupbyBtn,
    },
    data() {
      // this.userInfo = this.$store.getters.userInfo
      const { caseId, batchId, ruleId } = this.$route.query
      this.caseId = caseId
      this.batchId = batchId || ruleId

      let ruleType = this.ruleTypeVal = this.ruleType || this.$route.query.ruleType
      this.isItemBreak = ruleType === 'DRUG'||ruleType === 'CHARGE'||ruleType === 'TREAT'

      this.rightCols = [
        {
          title: 'Label(AI标签)',
          align: 'center',
          dataIndex: 'PREDICT_LABEL',
          width: 100,
          scopedSlots: { customRender: 'predictLabel' },
        },
        {
          title: 'Pr(概率)',
          align: 'center',
          dataIndex: 'PROBILITY',
          width: 100,
          customRender: t => t?t.toFixed(4):'',
        },
        {
          title: '判定理由',
          align: 'center',
          dataIndex: 'FIR_REVIEW_REMARK',
          width: 100,
          // scopedSlots: { customRender: 'predictLabel' }
        },
        {
          title: '白名单归因类型',
          align: 'center',
          dataIndex: 'FIR_REVIEW_CLASSIFY',
          width: 100,
          // scopedSlots: { customRender: 'firReviewStatus' }
        },
        {
          title: '审核人',
          align: 'center',
          fixed: 'right',
          dataIndex: 'FIR_REVIEW_USERNAME',
          width: 100
        },
        {
          title: '判定结果',
          align: 'center',
          fixed: 'right',
          dataIndex: 'FIR_REVIEW_STATUS',
          width: 100,
          scopedSlots: { customRender: 'firReviewStatus' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'PUSH_STATUS',
          fixed: 'right',
          width: 100,
          customRender: (text, record, index) => {
            // return text === '1' ? '已推送' : text === '0' ? '不推送' : '待推送'
            return text === '1' ? '通过' : '未通过'
          }
        }
      ]

      return {
        description: '结果总览',
        url: {
          list: this.$gp_database +"/apiReviewFirst/dynamicColsList",
          selectAll: this.$gp_database +"/apiReviewFirst/selectAll",
          exportStatistics: "/apiReviewFirst/drugExportStatistics",
          export: "/apiReviewFirst/drugListExport",
          dynamicColsExport: this.$gp_database +"/apiReviewFirst/dynamicColsExport",
          pushRecord: this.$gp_database +"/apiReviewFirst/pushRecord",
          updateReviewStatus: this.$gp_database +"/apiReviewFirst/updateReviewStatus",
          queryReviewInfoById: this.$gp_database +"/apiReviewFirst/queryReviewInfoById",
          termHisItem: this.isItemBreak?"/apiReviewFirst/termHisItem":undefined,
          importReviewExcelUrl: this.$gp_database +'/apiReviewFirst/importReviewExcel',
          importGroupReviewExcel: this.$gp_database +'/apiReviewFirst/importGroupReviewExcel',
          updatePredictLabel: this.$gp_database +"/apiReviewFirst/updatePredictLabel",
        },
        isorter: {
          column: 'caseName,visitid',
          order: 'asc,asc',
        },
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 50,
          pageSizeOptions: ['10', '50', '100', '500', '1000'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        fixedParam: {
          batchId,
          ruleId,
          caseId,
          busiType: this.ruleTypeVal,
        },
        step: 1,
        id: 'id',
        code: 'id',
        rowKey: 'id',
        stepAi:false,
        reviewStatusModelUrl:'',
      }
    },
    computed: {
      isTrail() {
        return !this.ruleType
      },
      trailPath() {
        let ruleType = this.ruleTypeVal
        return `/case/medical${ruleType.charAt(0) + ruleType.substring(1).toLowerCase()}RuleList`
      },
      name(){
        return groupbyIndex > -1? 'id': 'VISITID'
      }
    },

    beforeMount() {
      this.ruleTypeDict = {}
      this.$util.initDict('ACTION_TYPE').then(data => {
        for(let item of data){
          this.ruleTypeDict[item.code] = item.value
        }
        this.ruleTypeDict['MANUAL'] = '特殊批次'
      })
    },
    methods: {
      handleExportMenu({ key, item }) {
        let actionId = this.queryParam.actionId
        console.log('actionId', actionId)
        console.log('selectActionName', this.selectActionName)
        console.log('ruleTypeVal', this.ruleTypeVal)
        let title = actionId && actionId.length > 0? this.selectActionName: this.ruleTypeDict[this.ruleTypeVal]
        let param = this.getDynamicParams()
        this.handleExportFile(title + '-_导出' + moment().format('YYYYMMDDHHmmss') + '.xlsx'
          , param, this.url[key], 'post')
      },
      handleStatisticExportMenu({ key, item }) {
        let name = item.$el.innerText
        let param = this.getDynamicParams()
        param.groupBy = key
        param.groupByName = name
        this.handleExportFile(this.ruleTypeDict[this.ruleTypeVal] + "统计-" + name + "维度-" + this.batchId + ".xlsx", param, this.url.exportStatistics)
      },
      //推送
      pushReview(keys = this.selectedRowKeys) {
        let records = this.dataSource.filter(r => keys.some(key => key === r.id))
        this.$refs.reviewModel.loadData(keys, this.getDynamicParams(), records);
      },
      // 判定结果
      updateReviewStatus(keys = this.selectedRowKeys) {
        this.stepAi = false
        let records = this.dataSource.filter(r => keys.some(key => key === r.id))
        this.$refs.reviewStatusModel.title = '初审判定'
        this.reviewStatusModelUrl = this.url.updateReviewStatus
        this.$refs.reviewStatusModel.loadData(keys, this.getDynamicParams(), records);
      },
      // AI判定结果
      updatePredictLabel(keys = this.selectedRowKeys) {
        this.stepAi = true
        let records = this.dataSource.filter(r => keys.some(key => key === r.id))
        this.$refs.reviewStatusModel.title = 'AI结果打标'
        this.reviewStatusModelUrl = this.url.updatePredictLabel
        this.$refs.reviewStatusModel.loadData(keys, this.getDynamicParams(), records);
      },
      updateOk(sync){
        this.onClearSelected();
        if(sync){
          this.modalFormOk()
        } else {
          this.$refs.asyncLogRef.show()
        }
      },
    }
  }
</script>
<style lang="less" scoped>
</style>
