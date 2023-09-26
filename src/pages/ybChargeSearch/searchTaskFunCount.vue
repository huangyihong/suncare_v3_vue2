<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="功能大类" >
              <a-input placeholder="请输入功能大类"  v-model="queryParam.bigTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="功能小类" >
              <a-input placeholder="请输入功能小类"  v-model="queryParam.smallTitle"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
              <a-button type="primary" @click="handleExportExcel" icon="download" class="m-l-6">下载</a-button>


            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
    <div>


      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="rowKey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX }"
        v-bind="tableAttrs"
        @change="handleTableChange">

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {getAction } from '@/api/manage'
import moment from "moment";

export default {
  name: "searchTaskCount",
  mixins: [JeecgListMixin],
  components: {
  },
  data() {
    return {
      description: '功能点使用统计',
      fields:[],
      // 表头
      columns: [
        {
          dataIndex: 'bigTitle',
          title: '功能大类',
          width:100,
          align:"left",
        },
        {
          dataIndex: 'smallTitle',
          title: '功能小类',
          width:100,
          align:"left",
        },
        {
          dataIndex: 'num',
          title: '数量',
          width: 100,

        },
      ],
      url: {
        list: "/ybChargeSearch/ybChargeSearchTask/getSearchTaskFunCount",
        exportXlsUrl:'/ybChargeSearch/ybChargeSearchTask/exportFunCountXls',
      },
      ipagination:{
        pageSize: 30,
      },

    }
  },
  computed: {

  },
  created() {
  },
  methods: {

    //下载
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      let totalCount = this.ipagination.total;
      this.handleExportXls('功能点使用统计' + moment().format('YYYYMMDDHHmmss'))
    },

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>