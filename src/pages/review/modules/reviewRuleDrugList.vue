<template >
  <a-card :title="title" :headStyle="{backgroundColor:'#f6f6f6'}" class="card-padding0" size="small" v-if="loading || dataSource.length > 0">
    <a-table
      ref="table"
      size="small"
      class="border-0 min-height-0"
      rowKey="id"
      tableLayout="fixed"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX, y: '200px'}"
      :rowSelection="false"
      v-bind="tableAttrs">
      <template slot="ruleName" slot-scope="text">
        <j-ellipsis :value="text" :length="16"/>
      </template>
      <template slot="ruleDesc" slot-scope="text">
        <j-ellipsis :value="text" :length="16"/>
      </template>
    </a-table>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  export default {
    name: 'reviewRuleDrugList',
    props: {
      batchId: String,
      visitid: String,
      ruleType: String,
      title: String,
    },
    mixins: [JeecgListMixin],
    components: {
      JEllipsis
    },
    data() {
      return {
        url: {
          list: this.$suncare_v3 + '/review/queryUnreasonableDrugAction',
        },
        columns: [
          {
            title: '项目编码',
            align: "center",
            dataIndex: 'itemcode',
            width: 120,
          },
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'itemname',
            width: 120,
          },
          /*{
            title: '规格',
            align: "center",
            dataIndex: 'specificaion',
            width: 100,
          },
          {
            title: '结算日期',
            align: "left",
            dataIndex: 'chargedate',
            width: 120,
          },*/
          {
            title: '规则名称',
            align: "center",
            dataIndex: 'ruleName',
            width: 120,
            scopedSlots: { customRender: 'ruleName' },
            // ellipsis: true
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'ruleDesc',
            scopedSlots: { customRender: 'ruleDesc' },
            width: 200,
          }

        ],
        fixedParam: {
          ruleType: this.ruleType,
          batchId: this.batchId,
          visitid: this.visitid,
        },
      }
    },
    methods: {

    },
    computed: {
    }
  }
</script>
<style scoped>

</style>
