<template>
  <div>
    <!--<a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Tab 1">
      </a-tab-pane>
    </a-tabs>-->
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-10"/>
    <a-button type="primary" @click="handleExportFile('初审实时-未判定统计.xlsx')" class="fr">导出</a-button>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="val"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX,y: '360px'}"
      v-bind="tableAttrs">

    </a-table>

  </div>
</template>

<script>
  import { getAction, downFile } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

  export default {
    name: 'StatisticModule1',
    components: { MDictSelectTag },
    mixins:[JeecgListMixin],
    props: {
      param: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      this.url = {
        termActionData: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/termActionData',
        list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module1',
        exportXlsUrl: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module1Export',
      }
      return {
        tabs: [],
        activeKey: '1',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        columns: [
          {
            title: '不合规行为',
            align: "center",
            width: 200,
            dataIndex: 'actionName'
          },
          {
            title: '已完成判定记录数',
            align: "center",
            width: 100,
            dataIndex: 'review_count'
          },
          {
            title: '未判定记录数',
            align: "center",
            width: 100,
            dataIndex: 'unReview_count'
          },
          {
            title: '未判定就诊ID数',
            align: "center",
            width: 100,
            dataIndex: 'unReview_visitidCount'
          },
          {
            title: '未判定收费项目数',
            align: "center",
            width: 100,
            dataIndex: 'unReview_itemcodeCount',
          },
          {
            title: '未判定违规金额',
            align: "center",
            width: 100,
            dataIndex: 'unReview_sumMinMoney',
            customRender: t => t && t.toFixed(2) || 0
          },
          {
            title: '未判定基金金额',
            align: "center",
            width: 100,
            dataIndex: 'unReview_sumActionMoney',
            customRender: t => t && t.toFixed(2) || 0
          },
        ],
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
