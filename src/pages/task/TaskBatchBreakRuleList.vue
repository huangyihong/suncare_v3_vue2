<template>
  <a-card :bordered="false">
    <breadcrumb ></breadcrumb>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="违反规则名称">
              <j-input placeholder="请输入违反规则名称模糊查询" v-model="queryParam.ruleName"></j-input>
            </a-form-item>
          </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="违反规则类型">
                <m-dict-select-tag placeholder="请选择" dictCode="RULE_TYPE" v-model="queryParam.ruleType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="运行状态">
                <m-dict-select-tag placeholder="请选择" dictCode="RUN_STATUS" v-model="queryParam.status"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              </span>
             </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary">确认并提交</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="2" @click="batchDel">
            <a-icon type="delete"/>
            执行
          </a-menu-item>
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">执行</a>

        <!--  <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import Breadcrumb from '@/components/Breadcrumb'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"


  export default {
    name: "TaskBatchBreakRuleList",
    mixins: [JeecgListMixin],
    components: {
      Breadcrumb,
      MDictSelectTag
    },
    data() {
      return {
        description: '任务批次规则关联管理页面',
        // 表头
        columns: [
          {
            title: '违反规则名称',
            align: "center",
            dataIndex: 'ruleName'
          },
          {
            title: '违反规则类型',
            align: "center",
            dataIndex: 'ruleType_dictText'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status_dictText'
          },
          {
            title: '异常信息',
            align: "center",
            dataIndex: 'errorMsg'
          },
          {
            title: '数据条数',
            align: "center",
            dataIndex: 'total'
          },
          {
            title: '执行开始时间',
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '执行结束时间',
            align: "center",
            dataIndex: 'endTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: "/task/taskBatchBreakRule/list",
          delete: "/task/taskBatchBreakRule/delete",
          deleteBatch: "/task/taskBatchBreakRule/deleteBatch",
          exportXlsUrl: "task/taskBatchBreakRule/exportXls",
          importExcelUrl: "task/taskBatchBreakRule/importExcel",
        },
        queryParam: {
          batchId: this.$route.query.batchId
        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {},
    beforeMount(){
      console.log('this.routes',this.$router)
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
