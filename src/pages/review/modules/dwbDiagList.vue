<template>
  <a-card :bordered="false">



    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: scrollX}"
        @change="handleTableChange"
        v-bind="tableAttrs">


      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { querySysDictByType,querySysDictByTypes } from '@/api-sv3/api'

  import { getAction,httpAction } from '@/api/manage'

  export default {
    name: "DwbDiagList",
    mixins:[JeecgListMixin],
    props: ['visitid'],
    components: {
      MDictSelectTag
    },
    data () {
      return {
        description: '诊断列表',
        // 表头
        columns: [
          {
            title: '诊断疾病编码',
            align:"left",
            dataIndex: 'diseasecode',
            width:120,
          },
          {
            title: '诊断疾病名称',
            align:"left",
            dataIndex: 'diseasename',
            width:120,
          },
          {
            title: '诊断疾病编码_src',
            align:"left",
            dataIndex: 'diseasecodeSrc',
            width:120,
          },
          {
            title: '诊断疾病名称_src',
            align:"left",
            dataIndex: 'diseasenameSrc',
            width:120,
          },
          {
            title: '医疗费用总金额',
            align:"left",
            dataIndex: 'totalfee',
            width:120,
          },
          {
            title: '入院病情代码',
            align:"left",
            dataIndex: 'admDiseasestatus',
            width:120,
            //fixed: 'left',
          },
          {
            title: '主要诊断标识',
            align:"left",
            dataIndex: 'primarydiagSign',
            width:120,
          },
          {
            title: '疾病诊断类型代码',
            align:"left",
            dataIndex: 'diagtypeCode',
            width:120,
          },
          {
            title: '诊断依据代码',
            align:"left",
            dataIndex: 'basisCode',
            width:120,
          },
          {
            title: '疾病状态编码',
            align:"left",
            dataIndex: 'diseasestatusCode',
            width:120,
          },
          {
            title: '治疗结果',
            align:"left",
            dataIndex: 'diagResult',
            width:120,
            ellipsis: true,
          },
          {
            title: '住院天数',
            align:"left",
            dataIndex: 'zyDays',
            width:80,
          }

        ],
        url: {
          list: this.$suncare_v3 +this.$gp_database+ "/review/dwbDiagList",
        },
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: false,
          showSizeChanger: false,
          total: 0
        },
        /* 排序参数 */
        isorter: {
          column: 'diagdate',
          order: 'desc'
        },
        initLoad: false
      }
    },
    watch: {
      visitid: {
        immediate: true,
        handler: function(val) {
          if(val){
            this.fixedParam.visitid = val;
            this.loadData(1);
          }
        }
      }
    },
    methods: {
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
<style scoped>
  .ant-table-scroll > .ant-table-body {
    overflow-x: auto !important;
    min-height: 100px;
  }
</style>
