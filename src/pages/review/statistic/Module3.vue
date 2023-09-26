<template>
  <div>
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-10"/>
    <a-button type="primary" @click="handleExportFile('复审实时-全量统计.xlsx')" class="fr">导出</a-button>

    <a-tabs v-model="activeKey">
      <a-tab-pane key="all" tab="全量统计"/>
      <a-tab-pane key="blank" tab="黑名单"/>
      <a-tab-pane key="white" tab="白名单"/>
      <a-tab-pane key="grey" tab="灰名单"/>
    </a-tabs>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="val"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX,y: '310px'}"
      v-bind="tableAttrs">

        <span slot="visitidCount" slot-scope="text,record">
          <span v-if="projectDataSource&&projectDataSource.dwbMasterInfo.count">{{projectDataSource.dwbMasterInfo.count && (record.visitidCount*100/projectDataSource.dwbMasterInfo.count).toFixed(2)+'%' || 0}}</span>
        </span>
        <span slot="count" slot-scope="text,record">
          <span v-if="projectDataSource&&projectDataSource.dwbChargeDetail.count">{{projectDataSource.dwbChargeDetail.count && (record.count*100/projectDataSource.dwbChargeDetail.count).toFixed(2)+'%' || 0}}</span>
        </span>
        <span slot="sumMinMoney" slot-scope="text,record">
          <span v-if="projectDataSource&&projectDataSource.dwbMasterInfo.sumTotalfee">{{projectDataSource.dwbMasterInfo.sumTotalfee && (record.sumMinMoney*100/projectDataSource.dwbMasterInfo.sumTotalfee).toFixed(2)+'%' || 0}}</span>
        </span>
        <span slot="sumActionMoney" slot-scope="text,record">
          <span v-if="projectDataSource&&projectDataSource.dwbMasterInfo.sumFundpay">{{projectDataSource.dwbMasterInfo.sumFundpay && (record.sumActionMoney*100/projectDataSource.dwbMasterInfo.sumFundpay).toFixed(2)+'%' || 0}}</span>
        </span>

    </a-table>
  </div>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: 'StatisticModule1',
    mixins:[JeecgListMixin],
    components: {MDictSelectTag},
    props: {
      param: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      this.url = {
        termActionData: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/termActionData',
        list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module3',
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatisticNew/module3Export',
      }
      return {
        tabs: [],
        activeKey: 'all',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        columns:[],
        columns1: [
          {
            title: '不合规行为',
            align: "center",
            width: 200,
            dataIndex: 'valName'
          },
          {
            title: '线索就诊ID数(去重)',
            align: "center",
            width: 200,
            dataIndex: 'visitidCount'
          },
          {
            title: '线索记录数',
            align: "center",
            width: 100,
            dataIndex: 'count'
          },
          {
            title: '线索收费项目数(去重)',
            align: "center",
            width: 200,
            dataIndex: 'itemcodeCount'
          },
          {
            title: '线索违规金额',
            align: "center",
            width: 120,
            dataIndex: 'sumMinMoney',
            customRender: t => t.toFixed(2)
          },
          {
            title: '线索基金金额',
            align: "center",
            width: 120,
            dataIndex: 'sumActionMoney',
            customRender: t => t.toFixed(2)
          },
          {
            title: '就诊ID占比',
            align: "center",
            width: 100,
            dataIndex: 'visitidCountRatio'
          },
          {
            title: '记录占比',
            align: "center",
            width: 100,
            dataIndex: 'countRatio'
          },{
            title: '违规金额占比',
            align: "center",
            width: 120,
            dataIndex: 'sumMinMoneyRatio',
          },
        ],
        columns2:[{
          title: '就诊ID占比(项目全量)',
          align: "center",
          width: 200,
          dataIndex: 'visitidCount1',
          scopedSlots: { customRender: 'visitidCount' }
        },{
          title: '记录占比(项目全量)',
          align: "center",
          width: 200,
          dataIndex: 'count1',
          scopedSlots: { customRender: 'count' }
        },{
          title: '违规金额占比(项目全量)',
          align: "center",
          width: 200,
          dataIndex: 'sumMinMoney1',
          scopedSlots: { customRender: 'sumMinMoney' }
        },{
          title: '违规基金金额占比(项目全量)',
          align: "center",
          width: 200,
          dataIndex: 'sumActionMoney1',
          scopedSlots: { customRender: 'sumActionMoney' }
        }],
        initLoad: false,
        fixedParam: {...this.param},
        projectDataSource:null,
      }
    },
    beforeMount() {
      this.loadActionData()
    },
    watch: {
      actionId: {
        immediate: false,
        handler(val) {
          this.fixedParam.actionId = val
          this.loadData(1)
        }
      },
      activeKey: {
        immediate: true,
        handler(val) {
          this.columns = [...this.columns]
          if(val === 'all'){
            this.columns =  [... this.columns1, ... this.columns2]
            this.columns[0].title = '判定状态'
            this.columns[0].width = 120
            this.fixedParam.secReviewStatus = undefined
            this.fixedParam.groupBy = "SEC_REVIEW_STATUS"
          } else {
            this.columns =  [... this.columns1]
            this.columns[0].title = '不合规行为'
            this.columns[0].width = 200
            this.fixedParam.secReviewStatus = val
            this.fixedParam.groupBy = "ACTION_ID"
          }
          this.loadData(1)
        }
      },
    },
    methods: {
      loadActionData() {
        this.actionLoading = true
        //接收项目全量数据统计结果
        this.$bus.$on('project-dataSource', (val) => {
          this.projectDataSource = val
        })
        getAction(this.url.termActionData, { ...this.param, pushStatus: '1' }).then(res => {
          // 解析不合规行为
          if (res.success) {
            let data = res.result
            this.actionData = data.map(item => ({
              code: item.val,
              value: `${item.name || item.actionName || item.val}(${item.count})`
            }))
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.actionLoading = false
        })
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
