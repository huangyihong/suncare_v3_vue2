<template>
  <div>
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-10"/>
    <a-button type="primary" @click="handleExportFile('复审实时-不合规行为.xlsx')" class="fr">导出</a-button>

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
      <div slot="title" v-if="nextLevelParam">
        全部
        <span class="m-l-10 m-r-10">></span>
        <span class="t-red">{{nextLevelParam.valName}}</span> <a @click="toLastLevel" class="m-l-20">上一级</a>

      </div>

    </a-table>
  </div>
</template>

<script>
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: 'StatisticModule1',
    mixins: [JeecgListMixin],
    components: { MDictSelectTag },
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
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatisticNew/module3Export'
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
            align: 'center',
            width: 200,
            dataIndex: 'valName',
            customRender: (t, r, i) => <a onClick={() => this.toNextLevel(r.val, t)}>{t}</a>
          },
          {
            title: '线索就诊ID数(去重)',
            align: 'center',
            width: 100,
            dataIndex: 'visitidCount'
          },
          {
            title: '线索记录数',
            align: 'center',
            width: 100,
            dataIndex: 'count'
          },
          {
            title: '线索收费项目数(去重)',
            align: 'center',
            width: 100,
            dataIndex: 'itemcodeCount'
          },
          {
            title: '线索违规金额',
            align: 'center',
            width: 100,
            dataIndex: 'sumMinMoney',
            customRender: t => t.toFixed(2)
          },
          {
            title: '线索基金金额',
            align: 'center',
            width: 100,
            dataIndex: 'sumActionMoney',
            customRender: t => t.toFixed(2)
          },
          {
            title: '就诊ID占比',
            align: 'center',
            width: 100,
            dataIndex: 'visitidCountRatio'
          },
          {
            title: '记录占比',
            align: 'center',
            width: 100,
            dataIndex: 'countRatio'
          }, {
            title: '违规金额占比',
            align: 'center',
            width: 100,
            dataIndex: 'sumMinMoneyRatio'
          }
        ],
        initLoad: false,
        fixedParam: { ...this.param, groupBy: 'ACTION_ID', actionId: undefined },
        nextLevelParam: undefined
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
          value: `${item.valName || item.val}(${item.count})`
        })))
      }
    },
    methods: {
      toNextLevel(val, valName) {
        this.nextLevelParam = { val, valName }
        this.fixedParam.actionId = val
        this.fixedParam.groupBy = 'SEC_REVIEW_STATUS'
        this.columns[0].title = '判定状态'
        this.columns[0].customRender = t => t
        this.columns = [...this.columns]
        this.loadData(1)
      },
      toLastLevel() {
        this.nextLevelParam = undefined
        this.fixedParam.actionId = this.actionId
        this.fixedParam.groupBy = 'ACTION_ID'
        this.columns[0].title = '不合规行为'
        this.columns[0].customRender = (t, r, i) => <a onClick={() => this.toNextLevel(r.val, t)}>{t}</a>
        this.columns = [...this.columns]
        this.loadData(1)
      },
      loadActionData() {
        this.actionLoading = true
        getAction(this.url.termActionData, { ...this.param, pushStatus: '1'  }).then(res => {
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
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
