<template>
  <div>
    <a-button type="primary" @click="handleExportFile('初审 - 规则级别统计.xlsx')" class="fr">导出</a-button>

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
      v-bind="tableAttrs" class="m-t-40">

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
        list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module2',
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatisticNew/module7Export',
      }
      return {
        columns: [
          {
            title: '规则级别',
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
        initLoad: true,
        fixedParam: {...this.param, groupBy: 'RULE_GRADE'}
      }
    },
    beforeMount() {
    },
    methods: {
    },
    computed: {}
  }
</script>
<style scoped>

</style>
