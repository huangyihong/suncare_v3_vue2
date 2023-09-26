<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为编码">
              <j-input placeholder="请输入不合规行为编码" v-model="queryParam.actionId"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为名称">
              <j-input placeholder="请输入不合规行为名称" v-model="queryParam.actionName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="规则级别">
              <a-select v-model="queryParam.ruleLevel" placeholder="请选择规则级别">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="项目层级">项目层级</a-select-option>
                <a-select-option value="就诊层级">就诊层级</a-select-option>
                <a-select-option value="明细层级">明细层级</a-select-option>
                <a-select-option value="统计层级">统计层级</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">已启用</a-select-option>
                <a-select-option value="0">已禁用</a-select-option>

              </a-select>
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        @change="handleTableChange">

        <span slot="status" slot-scope="text">
          <span v-if="text=='1'">已启用</span>
          <span v-else-if="text=='0'">已禁用</span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'

export default {
  name: "MedicalActionDictList",
  mixins: [JeecgListMixin, multiSelectMixin],
  components: {},
  data() {
    return {
      description: '不合规行为管理页面',
      // 表头
      columns: [
        {
          title: '不合规行为编码',
          width:120,
          align:"left",
          dataIndex: 'actionId'
        },
        {
          title: '不合规行为名称',
          width:200,
          align:"left",
          dataIndex: 'actionName',
          ellipsis: true,
        },
        {
          title: '不合规行为释义',
          width:150,
          align:"left",
          dataIndex: 'actionDesc',
          ellipsis: true,
        },
        {
          title: '规则级别',
          width:150,
          align:"left",
          dataIndex: 'ruleLevel'
        },
        {
          title: '计算逻辑',
          width:100,
          align:"left",
          dataIndex: 'calculate',
          ellipsis: true,
        },
        {
          title: '规则/模型类别',
          width:200,
          align:"center",
          dataIndex: 'rules',
          ellipsis: true,
        },
        {
          title: '政策依据',
          width:100,
          align:"left",
          dataIndex: 'policyBasis',
          ellipsis: true,
        },
        {
          title: '现场查处需要资料',
          width:100,
          align:"left",
          dataIndex: 'information',
          ellipsis: true,
        },
        {
          title: '现场稽查查处方法',
          width:100,
          align:"left",
          dataIndex: 'method',
          ellipsis: true,
        },
        {
          title: '落地难易度',
          width:100,
          align:"left",
          dataIndex: 'difficultyLevel'
        },

        {
          title: '创建人',
          align: "left",
          dataIndex: 'createStaffName',
          width: 100,
        },
        {
          title: '创建时间',
          align: "left",
          dataIndex: 'createTime',
          width: 150,
        },
        {
          title: '修改人',
          align: "left",
          dataIndex: 'updateStaffName',
          width: 100,
        },
        {
          title: '修改时间',
          align: "left",
          dataIndex: 'updateTime',
          width: 150,
        },
        {
          title: '备注',
          width:100,
          align:"left",
          dataIndex: 'remark'
        },
      ],
      url: {
        list: "/config/medicalActionDict/list",
      },
      /* 排序参数 */
      isorter: {
        column: 'actionId',
        order: 'asc'
      },
      fixedParam:{
        status: '1'
      },
      id: 'id',
      code: 'actionId',
      name: 'actionName',
    }
  },
  methods: {

  }
}
</script>
<style scoped>
</style>
