<template>
    <a-card :bordered="false">

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
                        <a-col :lg="6" :md="8">
                            <a-form-item label="初审判定">
                                <m-multi-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus"
                                                    separator="|"></m-multi-select-tag>
                                <!--<m-dict-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus"></m-dict-select-tag>-->
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="8">
                            <a-form-item label="复审判定">
                                <m-multi-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.secReviewStatus"
                                                    separator="|"></m-multi-select-tag>
                                <!--<m-dict-select-tag dictCode="FIRST_REVIEW_STATUS" v-model="queryParam.firReviewStatus"></m-dict-select-tag>-->
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
            <template v-if="onStep">
                <async-log-modal-button ref="asyncLogRef" style="float:right"
                                        :param="'batchId=' + batchId"></async-log-modal-button>
                <template v-if="secPushStatus === '!1'">
                    <a-button @click="updateReviewStatus()" type="primary">复审判定</a-button>
                    <!--<a-button @click="copyReviewStatus()" type="primary">初审合格</a-button>-->
                    <a-button @click="pushReview()" type="primary">批量推送</a-button>
                    <a-button v-has="'review:import'"@click="handleImportReviewExcel()" type="primary">导入审核记录</a-button>
                    <a-button v-has="'review:import'" @click="handleImportGroupReviewExcel()" type="primary">导入分组统计审核</a-button>
                </template>
                <a-button @click="pushReview()" type="primary" v-if="secPushStatus === '1'">重新推送</a-button>
                <a-button v-has="'review:export'" @click="handleExport(url.dynamicColsExport)" type="primary">导出</a-button>
            </template>
            <!--<groupby-btn @ok="groupbyCols">汇总</groupby-btn>-->
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
            <!--<a-radio-group v-model="isActionField" button-style="solid"
                           @change="onActionFieldChange">
              <a-radio-button :value="false">
                默认字段
              </a-radio-button>
              <a-radio-button :value="true">
                不合规行为字段
              </a-radio-button>
            </a-radio-group>-->

        </div>

        <slot name="tabs"></slot>

        <!-- table区域-begin -->
        <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-show="selectedRowKeys.length > 0">
                <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
                selectedRowKeys.length }}</a>项
                <a style="margin-left: 24px" @click="onClearSelected">清空</a>
            </div>

            <a-table
                    ref="table"
                    class="footer-padding0 min-table"
                    size="middle"
                    bordered
                    :rowKey="rowKey"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
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
                <a slot="groupByCount" slot-scope="text, record" @click="toNextDetail(record[rowKey])">
                    {{text}}
                </a>
                <template slot="footer" slot-scope="currentPageData">
                    <jsx-temp :jsx="tableFooterJsx"></jsx-temp>
                </template>
            </a-table>
        </div>
        <!-- table区域-end -->

        <review-detail-model ref="reviewDetailModel" :batchId="batchId"></review-detail-model>

        <review-push-model ref="reviewModel" :batchId="batchId"
                           @ok="()=>{onClearSelected();modalFormOk()}"></review-push-model>

        <review-status-modal ref="reviewStatusModel" :batchId="batchId" :url="url.updateReviewStatus"
                             @ok="updateOk" step2></review-status-modal>

        <!--<review-range-modal ref="reviewRangeModel" :batchId="batchId" :url="url.copyReviewStatus"-->
                            <!--@ok="updateOk"></review-range-modal>-->

        <select-modal ref="selectModal"></select-modal>

        <!--导入-->
        <import-modal ref="importModel" tip="文件中必须包含：记录ID、复审判定、复审判定理由、推送状态列名。超过50MB请删除其余列"
                      @ok="modalFormOk"></import-modal>
    </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction, httpAction, postAction } from '@/api/manage'
  import moment from "moment"
  import ReviewDetailModel from "@/pages/review/modules/reviewDetailModel.vue"
  import ReviewPushModel from "@/pages/review/modules/reviewPushModel"
  import ReviewStatusModal from "@/pages/review/plugins/ReviewStatusModal"
  import ReviewRangeModal from "@/pages/review/plugins/ReviewRangeModal"

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { reviewDynamicColMixin } from './mixin'
  import GroupbyBtn from "@/pages/review/plugins/GroupbyBtn"
  import MDictSelectTagOP from "@/components/dict_medical/MDictSelectTagOP"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"

  import InputMedicalOtherDict from '@/pages/selectInput/MedicalOtherDict'



  export default {
    name: "reviewPushList",
    mixins: [JeecgListMixin, reviewDynamicColMixin],
    props: {
      secPushStatus: String,
      onStep: Boolean
    },
    components: {
      ReviewDetailModel,
      ReviewPushModel,
      ReviewStatusModal,
      ReviewRangeModal,
      MDictSelectTag,
      GroupbyBtn,
      MDictSelectTagOP,
      MMultiSelectTag,
      InputMedicalOtherDict
    },
    data() {
      const batchId = this.$route.query.batchId

      this.rightCols = []
      // if(this.secPushStatus === '!1'){
      this.rightCols.push({
          title: '初审判定理由',
          align: "center",
          dataIndex: 'FIR_REVIEW_REMARK',
          width: 100,
        }, {
          title: '复审判定理由',
          align: "center",
          dataIndex: 'SEC_REVIEW_REMARK',
          width: 100,
        },{
          title: '白名单归因类型',
          align: 'center',
          dataIndex: 'SEC_REVIEW_CLASSIFY',
          width: 100,
          // scopedSlots: { customRender: 'firReviewStatus' }
        }, {
          title: '初审判定',
          align: "center",
          dataIndex: 'FIR_REVIEW_STATUS',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'firReviewStatus' },
        }
        , {
          title: '初审人',
          align: "center",
          fixed: 'right',
          dataIndex: 'FIR_REVIEW_USERNAME',
          width: 80,
        }, {
          title: '复审判定',
          align: "center",
          dataIndex: 'SEC_REVIEW_STATUS',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'firReviewStatus' },
        },
        {
          title: '复审人',
          align: "center",
          fixed: 'right',
          dataIndex: 'SEC_REVIEW_USERNAME',
          width: 100,
        },)
      // }

      return {
        description: '推送列表',
        isorter: {
          column: 'caseName,visitid',
          order: 'asc,asc',
        },
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 50,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        url: {
          list: this.$gp_database +"/apiReviewFirst/dynamicColsList",
          // list: "/reviewNewPush/list",
          dynamicColsExport: this.$gp_database +"/apiReviewFirst/dynamicColsExport",
          updateReviewStatus: this.$gp_database +'/apiReviewSec/updateReviewStatus',
          copyReviewStatus: '/apiReviewSec/copyReviewStatus',
          importReviewExcelUrl: this.$gp_database +'/apiReviewSec/importReviewExcel',
          importGroupReviewExcel: this.$gp_database +'/apiReviewSec/importGroupReviewExcel',
        },
        fixedParam: {
          batchId,
          secPushStatus: this.secPushStatus,
          pushStatus: '1',
        },
        batchId,
      }
    },
    methods: {
      //推送
      pushReview(keys = this.selectedRowKeys) {
        this.$refs.reviewModel.loadData(keys, this.getDynamicParams());
        this.$refs.reviewModel.title = "推送";
        this.$refs.reviewModel.disableSubmit = false;
      },
      handleExport(url) {
        let param = this.getDynamicParams()
        param.fixCols = '1'
        this.handleExportFile('结果导出' + moment().format('YYYYMMDDHHmmss') + '.xlsx'
          , param, url, 'post')
      },
      // 判定结果
      updateReviewStatus(keys = this.selectedRowKeys) {
        let records = this.dataSource.filter(r => keys.some(key => key === r.id))
        this.$refs.reviewStatusModel.title = '复审判定'
        this.$refs.reviewStatusModel.loadData(keys, this.getDynamicParams(), records);
      },

      // 初审合格
      copyReviewStatus(keys = this.selectedRowKeys) {
        let records = this.dataSource.filter(r => keys.some(key => key === r.id))
        this.$refs.reviewRangeModel.loadData(keys, this.getDynamicParams(), records);
      },
      updateOk(sync) {
        this.onClearSelected();
        if (sync) {
          this.modalFormOk()
        } else {
          this.$refs.asyncLogRef.show()
        }
      },
    }
  }
</script>
<style scoped>

</style>
