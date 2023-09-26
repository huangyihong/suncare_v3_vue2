<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="问题类别(一级指标)">
              <a-input placeholder="请输入问题类别(一级指标)" v-model="queryParam.cat"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="违规第几款">
              <a-input placeholder="请输入违规第几款" v-model="queryParam.clauseK"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="违规第几条">
              <a-input placeholder="请输入违规第几条" v-model="queryParam.clauseT"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="违规情形描述">
              <a-input placeholder="请输入违规情形描述" v-model="queryParam.wgDesc"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="违规医保基金金额（元）">
              <a-input placeholder="请输入违规医保基金金额（元）" v-model="queryParam.fundAmt"></a-input>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8" >
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
      <a-button type="primary" icon="download" @click="handleExportXls('上会材料详细表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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
    <ybMeetingMaterialsDetail-modal ref="modalForm" @ok="modalFormOk"></ybMeetingMaterialsDetail-modal>
  </a-card>
</template>

<script>
  import YbMeetingMaterialsDetailModal from './modules/YbMeetingMaterialsDetailModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "YbMeetingMaterialsDetailList",
    mixins:[JeecgListMixin],
    components: {
      YbMeetingMaterialsDetailModal
    },
    data () {
      return {
        description: '上会材料详细表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '问题类别(一级指标)',
            align:"center",
            dataIndex: 'cat'
           },
		   {
            title: '违规第几款',
            align:"center",
            dataIndex: 'clauseK'
           },
		   {
            title: '违规第几条',
            align:"center",
            dataIndex: 'clauseT'
           },
		   {
            title: '违规情形描述',
            align:"center",
            dataIndex: 'wgDesc'
           },
		   {
            title: '违规医保基金金额（元）',
            align:"center",
            dataIndex: 'fundAmt'
           },
		   {
            title: '违规项目',
            align:"center",
            dataIndex: 'item'
           },
		   {
            title: '上会材料主表id',
            align:"center",
            dataIndex: 'mid'
           },
		   {
            title: '违规人次',
            align:"center",
            dataIndex: 'pax'
           },
		   {
            title: '罚款金额',
            align:"center",
            dataIndex: 'penaltyAmt'
           },
		   {
            title: '罚款倍数',
            align:"center",
            dataIndex: 'penaltyN'
           },
		   {
            title: '序号',
            align:"center",
            dataIndex: 'seq'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/ybChargeSearch/ybMeetingMaterialsDetail/list",
          delete: "/ybChargeSearch/ybMeetingMaterialsDetail/delete",
          deleteBatch: "/ybChargeSearch/ybMeetingMaterialsDetail/deleteBatch",
          exportXlsUrl: "ybChargeSearch/ybMeetingMaterialsDetail/exportXls",
          importExcelUrl: "ybChargeSearch/ybMeetingMaterialsDetail/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
