<template>
  <a-table
    ref="table"
    size="small"
    class="border-0 min-height-0"
    rowKey="id"
    tableLayout="fixed"
    :columns="columns"
    :dataSource="data"
    :pagination="false"
    :scroll="{ x: scrollX, y: '200px'}"
    :rowSelection="false">
    <template slot="ruleName" slot-scope="text,record" v-if="type === 'CASE' || type === 'CLINICAL'">
      <a @click="$emit('detail',record)">{{text}}</a>
    </template>
    <template slot="ruleName" slot-scope="text,record">
      <span>{{text}}</span>
    </template>
    <template slot="ruleDesc" slot-scope="text">
      <j-ellipsis :value="text" :length="16"/>
    </template>
  </a-table>

</template>

<script>

  export default {
    name: 'reviewRuleDrugList',
    props: {
      data: {
        type: Array,
        default: () => ([])
      },
      type:  String,
      title:String
    },
    components: {},
    data() {
      let title = this.title || '违规'
      let columns = [
        {
          title: title + '名称',
          align: "center",
          dataIndex: 'CASE_NAME',
          scopedSlots: { customRender: 'ruleName' },
          width: 120,
        },
        {
          title: '不合规行为名称',
          align: "center",
          dataIndex: 'ACTION_NAME',
          width: 120,
        },
        {
          title: '不合规行为类型',
          align: "center",
          dataIndex: 'ACTION_TYPE_NAME',
          width: 120,
        },
        {
          title: '不合规行为释义',
          align: "center",
          dataIndex: 'ACTION_DESC',
          width: 200,
        },
      ]
      if (this.type === 'DRUG' || this.type === 'CHARGE') {
        columns.unshift({
          title: title + '编码',
          align: "center",
          dataIndex: 'CASE_ID',
          width: 120,
        },)
      }
      return {
        columns
      }
    },
    computed: {
      scrollX() {
        return this.columns.reduce((prev, cur) => prev + (cur.width || 120), 20)
      },
    },
    methods: {},
  }
</script>
<style scoped>

</style>
