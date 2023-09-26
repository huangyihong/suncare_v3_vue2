<template>
  <div>
   <!-- <a-skeleton active :loading="dwbMasterInfoLoading">
      <a-descriptions title="" bordered size="middle">
        <a-descriptions-item label="就诊医疗机构">
          {{dwbMasterInfoVo.orgname}}
        </a-descriptions-item>
        <a-descriptions-item label="就诊科室名称">
          {{dwbMasterInfoVo.deptname}}
        </a-descriptions-item>
        <a-descriptions-item label="就诊类型">
          {{dwbMasterInfoVo.visittype}}
        </a-descriptions-item>
        <a-descriptions-item label="处方号">
          {{dwbMasterInfoVo.prescriptno}}
        </a-descriptions-item>
        <a-descriptions-item label="医嘱医生姓名">
          {{dwbMasterInfoVo. doctorname }}
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>-->
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      tableLayout="fixed"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :scroll="{ x: scrollX, y:300 }"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange"
      v-bind="tableAttrs">
      <template slot="title">

      </template>

    </a-table>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import TextComp from '../../case/plugin/YesOrNoTextComp'

  export default {
    name: 'reviewOrder',
    mixins: [JeecgListMixin],
    props: {
      visitid: String,
      // medicalUnreasonableActionVo: Object
    },
    components: { TextComp },
    data() {
      return {
        url: {
          list: this.$suncare_v3 +this.$gp_database+ '/review/queryDwbOrderByVisitid',
          // queryDwbMasterInfoByVisitid: this.$suncare_v3 + "/review/queryDwbMasterInfoByVisitid",
        },
        columns: [
          {
            title: '项目编码',
            align: 'center',
            dataIndex: 'itemcode',
            width: 120,
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'itemname',
            width: 120,
          },
          {
            title: '项目编码_src',
            align: 'center',
            dataIndex: 'itemcodeSrc',
            width: 120,
          },
          {
            title: '项目名称_src',
            align: 'center',
            dataIndex: 'itemnameSrc',
            width: 120,
          },
          {
            title: '剂型名称',
            align: 'center',
            dataIndex: 'dosagename',
            width: 100,
          },
          {
            title: '规格',
            align: 'center',
            dataIndex: 'specificaion',
            width: 100,
          },
          {
            title: '医嘱类型',
            align: 'center',
            dataIndex: 'ordertype',
            width: 100,
          },
          {
            title: '项目类别',
            align: 'center',
            dataIndex: 'itemclass',
            width: 100,
          },
          {
            title: '收费类别',
            align: 'center',
            dataIndex: 'chargeclass',
            width: 100,
          },
          {
            title: '单次剂量',
            align: 'center',
            dataIndex: 'dosage',
            width: 100,
          },
          {
            title: '剂量单位',
            align: 'center',
            dataIndex: 'dosageunit',
            width: 100,
          },
          {
            title: '给药途径',
            align: 'center',
            dataIndex: 'usetype',
            width: 100,
          },
          {
            title: '中药煎煮',
            align: 'center',
            dataIndex: 'chimedicine_decoct',
            width: 100,
          },
          {
            title: '频次',
            align: 'center',
            dataIndex: 'frequency',
            width: 100,
          },
          {
            title: '数量',
            align: 'center',
            dataIndex: 'amount',
            width: 100,
          },
          {
            title: '数量单位',
            align: 'center',
            dataIndex: 'amount',
            width: 80,
          },
          {
            title: '用药天数',
            align: 'center',
            dataIndex: 'days',
            width: 80,
          },
          {
            title: '项目单价',
            align: 'center',
            dataIndex: 'itemprice',
            width: 100,
          },
          {
            title: '计价单位',
            align: 'center',
            dataIndex: 'chargeunit',
            width: 80,
          },
          {
            title: '金额',
            align: 'center',
            dataIndex: 'fee',
            width: 100,
          },

        ],
         isorter: {
           column: 'itemcode',
           order: 'asc',
         },
        initLoad: false,
        dwbMasterInfoLoading: false,
        dwbMasterInfoVo: {}
      }
    },
    beforeMount() {

    },
    watch: {
      visitid: {
        immediate: true,
        handler(val) {
          if (val) {
            this.fixedParam.visitid = val
            this.loadData(1)
            // this.loadDwbMasterInfo(val)
          }

        },
      },
      medicalUnreasonableActionVo: {
        immediate: true,
        handler(val) {
          if (val) {
            this.dwbMasterInfoVo = val
            this.fixedParam.visitid = val.visitid
            this.loadData(1)
          }
        },
      },
    },
    methods: {
      /*  loadData(visitId){
          // getAction()
        },*/
      //就诊信息
      loadDwbMasterInfo(visitid) {
        this.dwbMasterInfoLoading = true;
        let param = { visitid: visitid };
        getAction(this.url.queryDwbMasterInfoByVisitid, param, 'get').then((res) => {
          if (res.success) {
            let record = res.result
            this.dwbMasterInfoVo = record || {}
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbMasterInfoLoading = false;
        })
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
