<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="表名">
              <j-input placeholder="请输入表名" v-model="queryParam.tableName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="表中文名">
              <j-input placeholder="请输入表中文名" v-model="queryParam.tableCnName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目地">
              <j-input placeholder="请输入项目地" v-model="queryParam.project"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        v-bind="tableAttrs"
        @change="handleTableChange">

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: "MedicalSolrSynInfoList",
  mixins:[JeecgListMixin],
  components: {
  },
  data () {
    return {
      description: 'SOLR数据同步情况表管理页面',
      // 表头
      columns: [
        {
          title: '表名',
          width:250,
          align:"left",
          dataIndex: 'tableName'
        },
        {
          title: '表中文名',
          width:200,
          align:"left",
          dataIndex: 'tableCnName'
        },
        {
          title: 'HIVE更新时间',
          width:150,
          align:"left",
          dataIndex: 'hiveUpdateTime'
        },
        {
          title: 'SOLR索引创建完毕时间',
          width:150,
          align:"left",
          dataIndex: 'indexCreateTime'
        },
        {
          title: 'SOLR索引正式生效时间',
          width:150,
          align:"left",
          dataIndex: 'solrUpdateTime'
        },
        {
          title: '项目地',
          width:80,
          align:"left",
          dataIndex: 'project'
        },
        /*{
          title: '排序编号',
          width:80,
          align:"left",
          dataIndex: 'sortOrder'
        }*/
      ],
      url: {
        list: "/config/medicalSolrSynInfo/list",
      },
      isorter: {
        column: 'sortOrder',
        order: 'asc'
      },
    }
  },
  computed: {
  },
  methods: {
    searchQuery() {
      this.queryParam.tableName = this.queryParam.tableName.toUpperCase()
      this.loadData(1)
    },
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
