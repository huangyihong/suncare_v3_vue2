<template>
  <div>
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-10"/>
    <a-button type="primary" @click="handleExportFile('初审实时-全量统计.xlsx')" class="fr">导出</a-button>

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
      :scroll="{ x: scrollX,y: '300px'}"
      v-bind="tableAttrs">

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
        list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module2',
        exportXlsUrl: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module2Export',
      }
      return {
        tabs: [],
        activeKey: 'all',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        columns: [
          {
            title: '不合规行为',
            align: "center",
            width: 200,
            dataIndex: 'valName'
          },
          {
            title: '线索就诊ID数(去重)',
            align: "center",
            width: 100,
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
            width: 100,
            dataIndex: 'itemcodeCount'
          },
          {
            title: '线索违规金额',
            align: "center",
            width: 100,
            dataIndex: 'sumMinMoney',
            customRender: t => t.toFixed(2)
          },
          {
            title: '线索基金金额',
            align: "center",
            width: 100,
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
            width: 100,
            dataIndex: 'sumMinMoneyRatio',
          }
        ],
        initLoad: false,
        fixedParam: {...this.param}
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
            this.columns[0].title = '判定状态'
            this.fixedParam.firReviewStatus = undefined
            this.fixedParam.groupBy = "FIR_REVIEW_STATUS"
          } else {
            this.columns[0].title = '不合规行为'
            this.fixedParam.firReviewStatus = val
            this.fixedParam.groupBy = "ACTION_ID"

          }
          this.loadData(1)
        }
      },
    },
    methods: {
      loadActionData() {
        this.actionLoading = true
        getAction(this.url.termActionData, { ...this.param }).then(res => {
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
