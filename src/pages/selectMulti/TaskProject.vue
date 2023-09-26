<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <j-input placeholder="请输入项目名称" v-model="queryParam.projectName"></j-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">

          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <!-- table区域-begin -->
    <div>
      <template v-if="selectType === 'checkbox'">
        <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                      v-on="selectActionOn"></selected-tag>
      </template>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="projectId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        @change="handleTableChange">


      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'

  export default {
    name: "TaskProjectList",
    mixins:[JeecgListMixin, multiSelectIdMatchMixin],
    components: {
    },
    data () {
      return {
        description: '任务项目管理页面',
        // 表头
        columns: [
		   {
            title: '项目名称',
            align:"center",
            dataIndex: 'projectName'
           },
		   {
            title: '项目备注',
            align:"center",
            dataIndex: 'remark'
           },
		   {
            title: '项目开始时间',
            align:"center",
            dataIndex: 'startTime'
           },
		   {
            title: '项目结束时间',
            align:"center",
            dataIndex: 'endTime'
           },
		   {
            title: '创建人',
            align:"center",
            dataIndex: 'createUserName'
           },
        ],
		url: {
          list: "/task/taskProject/list",
       },
        id: 'projectId',
        name: 'projectName',
        code: 'projectId',
    }
  },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
