<template>
    <div>
        <a-button class="m-t-10 m-b-10" type="primary" shape="round" icon="download" @click="handleExportXls('历史就诊记录')">导出</a-button>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      tableLayout="fixed"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX}"
      :rowSelection="false"
      v-bind="tableAttrs"
      class="m-b-20">
      <template slot="visitid" slot-scope="text, record">
          <a @click="selectKey(record)">{{text}}</a><span v-if="record.visitid===visitid">(当前)</span>
      </template>
    </a-table>
    </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'reviewOrder',
    mixins: [JeecgListMixin],
    props: {
      visitid: String,
    },
    components: {},
    data() {
      return {
        url: {
          list: this.$suncare_v3 +this.$gp_database+ '/review/queryClientDwbMasterInfoByVisitid',
          exportXlsUrl: this.$suncare_v3 +this.$gp_database+ '/review/exportClientMasterInfoByVisitid',
        },
        columns: [
          {
            title: '就诊ID号',
            align: "left",
            dataIndex: 'visitid',
            width: 200,
            scopedSlots: { customRender: 'visitid' },
          },
          {
            title: '诊断名称',
            align: "left",
            dataIndex: 'diseasename',
            width: 180,
          },
          {
            title: '就诊日期',
            align: "center",
            dataIndex: 'visitdate',
            width: 100,
            customRender: (text, record, index) => {
              if (text && text.length > 10) {
                return text.substr(0, 10)
              }
              return text;
            },
          },{
            title: '出院日期',
            align: "center",
            dataIndex: 'leavedate',
            width: 100,
            customRender: (text, record, index) => {
              if (text && text.length > 10) {
                return text.substr(0, 10)
              }
              return text;
            },
          },
          {
            title: '就诊金额',
            align: "center",
            dataIndex: 'totalfee',
            width: 100,
          },
          {
            title: '基金支付金额',
            align: "left",
            dataIndex: 'fundpay',
            width: 120,
          },
           {
             title: '就诊类型',
             align: "center",
             dataIndex: 'visittype',
             width: 100,
           },
           {
             title: '就诊机构',
             align: "left",
             dataIndex: 'orgname',
             width: 120,
           }

        ],
         isorter: {
           column: 'visitdate',
           order: 'asc',
         },
        initLoad: false,
      }
    },
    watch: {
      visitid: {
        immediate: true,
        handler(val) {
          if (val) {
            this.fixedParam.visitid = val
            this.loadData(1)
          }

        },
      },
    },
    methods: {
      selectKey(record){
        this.$emit("detail",record)
      }

    },
    computed: {}
  }
</script>
<style scoped>

</style>
