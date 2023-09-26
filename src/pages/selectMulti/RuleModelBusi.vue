<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="业务组名称">
              <j-input placeholder="输入业务组名称模糊查询" v-model="queryParam.busiName"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
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
      <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="busiId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <template slot="busiName" slot-scope="text,record">
          <task-batch-break-case-list :key="record.busiId" :busiId="record.busiId" notHis>
            <a>{{text}}</a>
          </task-batch-break-case-list>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import TaskBatchBreakCaseList from '@/pages/task/modules/TaskBatchBreakCaseList'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'


  export default {
    name: "MedicalFormalBusi",
    mixins: [JeecgListMixin,multiSelectIdMatchMixin,postListMixin],
    components: {
      JEllipsis,
      TaskBatchBreakCaseList
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '业务组名称',
            align:"center",
            dataIndex: 'busiName',
            scopedSlots: { customRender: 'busiName' },
            width: 180,
          },
          {
            title: '客户名称',
            align:"center",
            dataIndex: 'custName',
            width: 120,
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'busiStatus_dictText',
            width: 80,
          },
          {
            title: '数据源',
            align:"center",
            dataIndex: 'dataSourceId',
            width: 120,
          },
          {
            title: '数据开始时间',
            align:"center",
            dataIndex: 'etlStartTime',
            width: 180,
          },
          {
            title: '数据结束时间',
            align:"center",
            dataIndex: 'etlEndTime',
            width: 180,
          },
        ],
        url: {
          list: "/formal/medicalFormalBusi/list",
        },
        fixedParam: {
          busiStatus: 'normal'
        },
        id: 'busiId',
        code: 'busiId',
        name: 'busiName',
        paramInId:'busiId',//已选中 未选中查询的参数
      }
    },
    methods: {
      searchQuery(){
        this.postloadData(1);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
