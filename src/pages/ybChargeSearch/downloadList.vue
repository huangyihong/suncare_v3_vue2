<template>
  <m-modal centered
           :title="title"
           width="500px"
           :visible="visible"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :scroll="{ x: scrollX, y: 'calc(100vh - 400px)' }"
      v-bind="tableAttrs"
      @change="handleTableChange"></a-table>
  </m-modal>
</template>

<script>
import {getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "downloadList",
    props: {

    },
    mixins:[JeecgListMixin],
    components: {},
    data() {
      return {
        title: '下载记录',
        visible: false,
        url:{
          list:"/ybChargeSearch/ybChargeSearchTaskDownload/list",
        },
        columns:[
          {dataIndex: 'fileName', title: '文件名称',width:300}
          ,{dataIndex: 'createUser', title: '下载人',width:10}
          ,{dataIndex: 'createTime', title: '下载时间',width:100}],
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
      initData(record){
        this.fixedParam.taskId = record.id
        this.loadData()
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
