<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="查询日期">
              <j-date class="search-divider-item" placeholder="开始日期"
                      v-model="queryParam.weekStart"></j-date>
              <span class="search-divider">~</span>
              <j-date class="search-divider-item" placeholder="结束日期"
                      v-model="queryParam.weekEnd"></j-date>
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
        :scroll="{ x: scrollX, y: 'calc(100vh - 200px)' }"
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
      description: '使用情况统计',
      fields:[],
      // 表头
      columns: [
        {
          dataIndex: 'weekStart',
          title: '周开始时间',
          width:100,
          align:"left",
        },
        {
          dataIndex: 'weekEnd',
          title: '周结束时间',
          width:100,
          align:"left",
        },
        {
          dataIndex: 'weekNum',
          title: '周数',
          width: 100,

        },
      ],
      url: {
        list: "/ybChargeSearch/ybChargeSearchTask/getSearchTaskCount",
        getDataSourceFields: "/ybChargeSearch/ybChargeSearchTask/getDataSourceFields",
        exportXlsUrl:'/ybChargeSearch/ybChargeSearchTask/exportCountXls',
      },

    }
  },
  computed: {

  },
  created() {
    this.getColumns();

  },
  methods: {
    getColumns(){
      getAction(this.url.getDataSourceFields).then(res => {
        if(res.success){
          this.fields = res.result
          console.log("fields==",this.fields)
          this.fields.forEach(item =>{
            let column={
              dataIndex: item.code,
              title: item.name,
              width: 100,
            }
            this.columns.push(column);
          })
          this.columns.push({
            dataIndex: 'total',
            title: '合计',
            width: 100,
            fixed: 'right'
          });
        }
      })

    },
    //下载
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      let totalCount = this.ipagination.total;
      this.handleExportXls('使用情况统计' + moment().format('YYYYMMDDHHmmss'))

    },

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>