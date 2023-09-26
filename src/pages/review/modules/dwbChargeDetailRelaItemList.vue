<template>
    <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
            :scroll="{ x: scrollX, y:300 }"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
            v-bind="tableAttrs">

        <span slot="visitid" slot-scope="text, record">
          <a @click="selectKey(record)">{{text}}</a>
        </span>


    </a-table>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { querySysDictByType, querySysDictByTypes } from '@/api-sv3/api'

  import { getAction, httpAction } from '@/api/manage'

  export default {
    name: "DwbChargeDetailList",
    mixins: [JeecgListMixin],
    props: ['visitid', 'batchId'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        description: '收费明细列表',
        // 表头
        columns: [
          {
            title: '项目编码',
            align: "left",
            dataIndex: 'itemcode',
            width: 120,
            // fixed: 'left'
          },
          {
            title: '项目名称',
            align: "left",
            dataIndex: 'itemname',
            width: 120,
          },
          {
            title: '项目编码_src',
            align: "left",
            dataIndex: 'itemcodeSrc',
            width: 120,
            // fixed: 'left'
          },
          {
            title: '项目名称_src',
            align: "left",
            dataIndex: 'itemnameSrc',
            width: 120,
          },
          {
            title: '规格',
            align: "left",
            dataIndex: 'specificaion',
            width: 120,
          },
          {
            title: '数量',
            align: "left",
            dataIndex: 'amount',
            width: 100,
            //fixed: 'left',
          },
          {
            title: '计价单位',
            align: "left",
            dataIndex: 'chargeunit',
            width: 80,
          },
          {
            title: '单价',
            align: "left",
            dataIndex: 'itemprice',
            width: 80,
          },
          {
            title: '总金额',
            align: "left",
            dataIndex: 'fee',
            width: 120,
          },
          {
            title: '处方日期',
            align: "left",
            dataIndex: 'prescripttime',
            width: 180,
          },
          {
            title: '收费日期',
            align: "left",
            dataIndex: 'chargedate',
            width: 180,
          },

        ],
        url: {
          list: this.$suncare_v3 +this.$gp_database+ "/review/queryRelaChargeDetail",
        },
        ipagination: {
          current: 1,
          pageSize: 99999999,
        /*  pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0*/
        },
        initLoad: false,
        /* 排序参数 */
        isorter: {
          column: 'chargedate,fee',
          order: 'asc,desc'
        },
      }
    },
    watch: {
      visitid: {
        immediate: true,
        handler: function(val) {
          if (val) {
            this.fixedParam.visitid = val;
            this.fixedParam.batchId = this.batchId;
            this.loadData(1);
          }
        }
      }
    },
    methods: {}
  }
</script>
<style scoped>
</style>
