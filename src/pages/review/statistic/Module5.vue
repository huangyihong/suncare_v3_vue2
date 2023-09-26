<template>
  <div>
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-10"/>
    <span class="fr">
      <a-button type="primary" @click="handleExportFile('初审/复审结果对比.xlsx')">导出</a-button>
    </span>

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
        list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module5',
        exportXlsUrl: this.$suncare_v3 +this.$gp_database+'/apiReviewStatisticNew/module5Export',
      }
      return {
        tabs: [],
        activeKey: 'all',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        columns: [{
          title: '不合规行为',
          align: "center",
          width: 100,
          dataIndex: 'actionName'
        },
          {
            title: '就诊ID数变化',
            align: "center",
            width: 100,
            dataIndex: 'visitidCount',
            customRender: t => this.compareColorRender(t),
          },
          {
            title: '记录数变化',
            align: "center",
            width: 100,
            dataIndex: 'count',
            customRender: t => this.compareColorRender(t),
          },
          {
            title: '收费项目数变化',
            align: "center",
            width: 100,
            dataIndex: 'itemcodeCount',
            customRender: t => this.compareColorRender(t),
          },
          {
            title: '违规金额变化',
            align: "center",
            width: 100,
            dataIndex: 'sumMinMoney',
            customRender: t => this.compareColorRender(t, true),
          },
          {
            title: '违规基金金额变化',
            align: "center",
            width: 100,
            dataIndex: 'sumActionMoney',
            customRender: t => this.compareColorRender(t, true),
          },],
        initLoad: false,
        fixedParam: {...this.param}
      }
    },
    beforeMount() {
      // this.loadActionData()
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
          if(val !== 'all'){
            this.fixedParam.secReviewStatus = val
          } else {
            this.fixedParam.secReviewStatus = undefined
          }
          this.loadData(1)
        }
      },
      dataSource(data){
        this.actionData.length === 0 && (this.actionData = data.filter(r => r.val).map(item => ({
          code: item.val,
          value: `${item.actionName || item.val}(${item.count})`
        })))
      }
    },
    methods: {
      loadActionData() {
        this.actionLoading = true
        getAction(this.url.termActionData, { ...this.param, pushStatus: '1'}).then(res => {
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
      compareColorRender(num, toFixed){
        if(toFixed && num){
          num = num.toFixed(2)
        }
        if(num > 0){
          return <span class="t-red">+{num}</span>
        } else if(num < 0){
          return <span style="color: darkcyan">{num}</span>
        } else {
          return num
        }
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
