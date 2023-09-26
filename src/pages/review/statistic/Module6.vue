<template>
  <div>
    <a-button type="primary" @click="handleExportFile('初审实时-按医疗机构.xlsx')" class="fr">导出</a-button>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="val"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX,y: '380px'}"
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
      list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module6',
      exportXlsUrl: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module6Export',
    }
    return {
      columns: [
        {
          title: '医疗机构名称',
          align: "center",
          width: 200,
          dataIndex: 'valName'
        },
        {
          title: '输出记录数',
          align: "center",
          width: 100,
          dataIndex: 'total_count'
        },
        {
          title: '输出基金金额',
          align: "center",
          width: 100,
          dataIndex: 'total_sumActionMoney',
          customRender: t => t.toFixed(2)
        },
        {
          title: '已判定总记录数',
          align: "center",
          width: 100,
          dataIndex: 'judge_count'
        },
        {
          title: '已判定基金金额',
          align: "center",
          width: 100,
          dataIndex: 'judge_sumActionMoney',
          customRender: t => t.toFixed(2)
        },
       /* {
          title: '黑名单记录数',
          align: "center",
          width: 100,
          dataIndex: 'blank_count'
        },
        {
          title: '黑名单基金金额',
          align: "center",
          width: 100,
          dataIndex: 'blank_sumActionMoney',
          customRender: t => t.toFixed(2)
        },*/
        {
          title: '黑名单记录数占比',
          align: "center",
          width: 100,
          dataIndex: 'blank_countRatio'
        },{
          title: '黑名单基金金额占比',
          align: "center",
          width: 100,
          dataIndex: 'blank_sumActionMoneyRatio',
        },
      ],
      initLoad: true,
      fixedParam: {...this.param,groupBy: 'ORGNAME',}
    }
  },
  beforeMount() {

  },
  watch: {
  },
  methods: {

  },
  computed: {}
}
</script>
<style scoped>

</style>
