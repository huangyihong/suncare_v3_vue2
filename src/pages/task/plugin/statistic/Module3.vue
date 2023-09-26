<template>
  <div>
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-6"/>
    <a-button type="primary" @click="handleExportFile('复审实时-不合规行为统计.xlsx')" class="fr">导出</a-button>

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
        termActionData: this.$suncare_v3 + '/apiReviewStatistic/termActionData',
        list: this.$suncare_v3 + '/apiReviewStatistic/module3',
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatistic/module3Export',
      }
      return {
        tabs: [],
        activeKey: 'all',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        columns: [],
        commonColumns: [
          {
            title: '不合规行为',
            align: "center",
            width: 100,
            dataIndex: 'actionName'
          },
          {
            title: '就诊ID数',
            align: "center",
            width: 100,
            dataIndex: 'visitidCount'
          },
          {
            title: '记录数',
            align: "center",
            width: 100,
            dataIndex: 'count'
          },
          {
            title: '收费项目数',
            align: "center",
            width: 100,
            dataIndex: 'itemcodeCount'
          },
          {
            title: '违规金额',
            align: "center",
            width: 100,
            dataIndex: 'sumMinMoney',
            customRender: t => t.toFixed(2)
          },
          {
            title: '违规基金金额',
            align: "center",
            width: 100,
            dataIndex: 'sumActionMoney',
            customRender: t => t.toFixed(2)
          },
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
        immediate: true,
        handler(val) {
          this.fixedParam.actionId = val
          this.loadData(1)
        }
      },
      activeKey: {
        immediate: true,
        handler(val) {
          this.columns = [...this.commonColumns]
          if(val !== 'all'){
            this.fixedParam.secReviewStatus = val
            this.columns.push({
                title: '就诊ID占比',
                align: "center",
                width: 100,
                customRender: (t, r, i) => {
                  return (r.visitidCount * 100.0 / r.totalVisitidCount).toFixed(2) + '%'
                },
              },
              {
                title: '记录占比',
                align: "center",
                width: 100,
                customRender: (t, r, i) => {
                  return (r.count * 100.0 / r.totalCount).toFixed(2) + '%'
                }
              },{
                title: '违规金额占比',
                align: "center",
                width: 100,
                customRender: (t, r, i) => {
                  return (r.sumMinMoney * 100.0 / r.totalSumMinMoney).toFixed(2) + '%'
                }
              })
          } else {
            this.fixedParam.secReviewStatus = undefined
          }
          this.loadData(1)
        }
      },
    },
    methods: {
      loadActionData() {
        this.actionLoading = true
        getAction(this.url.termActionData, { ...this.param, secPushStatus: '1' }).then(res => {
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
