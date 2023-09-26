<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :lg="6" :xs="8">
            <a-form-item label="节点编码">
              <j-input placeholder="请输入节点编码模糊查询" v-model="queryParam.nodeCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :xs="8">
            <a-form-item label="节点名称">
              <j-input placeholder="请输入节点名称模糊查询" v-model="queryParam.nodeName"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :lg="6" :xs="8">
              <a-form-item label="分类">
                <m-dict-select-tag placeholder="选择节点分类" dictCode="FLOW_TEMPL_KIND"
                                   v-model="queryParam.nodeKind"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          </template>
          <a-col :sm="8">
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
     <!-- <a-button type="primary" icon="download" @click="handleExportXls('节点模板')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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
        rowKey="nodeId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.nodeId)">
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
    <medicalFlowTempl-modal ref="modalForm" @ok="modalFormOk"></medicalFlowTempl-modal>
  </a-card>
</template>

<script>
  import MedicalFlowTemplModal from './modules/MedicalFlowTemplModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "MedicalFlowTemplList",
    mixins: [JeecgListMixin],
    components: {
      MedicalFlowTemplModal,
      MDictSelectTag
    },
    data() {
      return {
        description: '节点模板管理页面',
        // 表头
        columns: [
          {
            title: '节点编码',
            align: "left",
            dataIndex: 'nodeCode'
          },
          {
            title: '节点名称',
            align: "left",
            dataIndex: 'nodeName'
          },
          {
            title: '分类',
            align: "center",
            dataIndex: 'nodeKind_dictText'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/probe/medicalFlowTempl/list",
          delete: "/probe/medicalFlowTempl/delete",
          deleteBatch: "/probe/medicalFlowTempl/deleteBatch",
          exportXlsUrl: "probe/medicalFlowTempl/exportXls",
          importExcelUrl: "probe/medicalFlowTempl/importExcel",
        },
        isorter:{
          column: 'updateTime,createTime,nodeCode',
          order: 'desc,desc,asc',
        },
      }
    },
    watch:{

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
