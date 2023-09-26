<template>
  <m-modal centered
           :title="title"
           width="1400px"
           :visible="visible"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="clueDtlId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :scroll="{ x: scrollX, y: 'calc(100vh - 300px)' }"
      v-bind="tableAttrs"
      @change="handleTableChange"></a-table>
  </m-modal>
</template>

<script>
import {getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  name: "clueDtlList",
  props: {

  },
  mixins:[JeecgListMixin],
  components: {},
  data() {
    return {
      title: '线索明细',
      visible: false,
      url:{
        list:"/fj/clue/dtl/list",
      },
      columns:[
        {dataIndex: 'orgname', title: '医疗机构名称',width:100}
        ,{dataIndex: 'visitid', title: '就诊ID',width:100}
        ,{dataIndex: 'doctorname', title: '医生姓名',width:100}
        ,{dataIndex: 'deptname', title: '科室名称',width:100}
        ,{dataIndex: 'visittype', title: '就诊类型',width:100}
        ,{dataIndex: 'clientname', title: '病人姓名',width:100}
        ,{dataIndex: 'sex', title: '性别',width:100}
        ,{dataIndex: 'visitdate', title: '就诊日期',width:100}
        ,{dataIndex: 'leavedate', title: '离院日期',width:100}
        ,{dataIndex: 'yearage', title: '年龄',width:100}
        ,{dataIndex: 'dis', title: '疾病名称',width:100}
        ,{dataIndex: 'hisItemname', title: 'his项目名称',width:100}
        ,{dataIndex: 'itemname', title: '医保项目名称',width:100}
        ,{dataIndex: 'chargeattri', title: '项目类别',width:100}
        ,{dataIndex: 'sl', title: '数量',width:100}
        ,{dataIndex: 'fy', title: '费用',width:100}
        ],
      initLoad:false,
    }
  },
  computed: {

  },
  methods: {
    close() {
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    initData(record,url){
      if(url){
        this.url.list = url
      }
      this.fixedParam.clueId = record.clueId
      this.fixedParam.projectId = record.projectId
      this.fixedParam.projectOrgId = record.projectOrgId
      this.loadData(1)
    },

  }
}
</script>

<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>
