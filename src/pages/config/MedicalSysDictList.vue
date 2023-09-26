<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="字典类型">
              <j-input placeholder="请输入字典类型模糊查询" v-model="queryParam.dictType"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="字典编码">
              <a-input placeholder="请输入字典编码模糊查询" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="字典值">
              <a-input placeholder="请输入字典值模糊查询" v-model="queryParam.value"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="描述">
                <j-input placeholder="请输入描述模糊查询" v-model="queryParam.remark"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="handleCopyAdd" type="primary" icon="plus">复制新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medicalSysDict-modal ref="modalForm" @ok="modalFormOk"></medicalSysDict-modal>
  </a-card>
</template>

<script>
  import MedicalSysDictModal from './modules/MedicalSysDictModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'


  export default {
    name: "MedicalSysDictList",
    mixins: [JeecgListMixin],
    components: {
      MedicalSysDictModal,
    },
    data() {
      return {
        description: '医疗字典管理页面',
        // 表头
        columns: [
          {
            title: '字典类型',
            align: "center",
            dataIndex: 'dictType'
          },
          {
            title: '字典编码',
            align: "center",
            dataIndex: 'code'
          },
          {
            title: '字典值',
            align: "center",
            dataIndex: 'value'
          },
          {
            title: '字典顺序',
            align: "center",
            dataIndex: 'isOrder'
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark'
          },
          /*{
            title: '机构ID',
            align: "center",
            dataIndex: 'orgId'
          },*/
          {
            title: '种类',
            align: "center",
            dataIndex: 'kind_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            // fixed: 'right',
            scopedSlots: { customRender: 'action' },
          }
        ],
        /* 排序参数 */
        isorter:{
          column: 'dictType,isOrder',
          order: 'asc,asc',
        },
        url: {
          list: "/config/medicalSysDict/list",
          delete: "/config/medicalSysDict/delete",
          deleteBatch: "/config/medicalSysDict/deleteBatch",
          exportXlsUrl: "config/medicalSysDict/exportXls",
          importExcelUrl: "config/medicalSysDict/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>