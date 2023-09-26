<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="标签定义所属表">
              <m-dict-select-tag  placeholder="请输入标签定义所属表"  v-model="queryParam.ownTableName" dictCode="DATA_TAG_OWN_TABLE"  />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
          <a-form-item label="标签英文名称">
            <a-input placeholder="请输入标签英文名称" v-model="queryParam.tagName"></a-input>
          </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="标签中文名称">
              <a-input placeholder="请输入标签中文名称" v-model="queryParam.tagChnName"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">


          <a-col :md="6" :sm="8">
            <a-form-item label="标签详细说明">
              <a-input placeholder="请输入标签详细说明" v-model="queryParam.tagDesc"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="标签类型">
              <m-dict-select-tag  placeholder="请选择标签类型"  v-model="queryParam.tagType" dictCode="DATA_TAG_TYPE"  />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="标签状态">
              <m-dict-select-tag  placeholder="请选择标签状态"  v-model="queryParam.tagState" dictCode="DATA_TAG_STATUS"  />
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
      <a-button type="primary" icon="download" @click="handleExportXls('标签管理')">导出</a-button>

      <template v-if="selectedRowKeys.length > 0">
        <a-button   @click="changeTagStatus" ><a-icon type="edit"/>编辑标签状态</a-button>
         <a-button   @click="batchDel" ><a-icon type="delete"/>删除</a-button>
      </template>

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
        rowKey="tagId"
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
    <medicalDataTagDef-modal ref="modalForm" @ok="modalFormOk" @statusOK="changeTagStatusOk"></medicalDataTagDef-modal>
  </a-card>
</template>

<script>
  import MedicalDataTagDefModal from './modules/MedicalDataTagDefModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "MedicalDataTagDefList",
    mixins:[JeecgListMixin],
    components: {
      MedicalDataTagDefModal,
      MDictSelectTag
    },
    data () {
      return {
        description: '标签管理管理页面',
        // 表头
        columns: [

		   {
            title: '标签定义所属表',
            align:"center",
            dataIndex: 'ownTableName_dictText',
            width:"300px"
           },
		   {
            title: '标签英文名称',
            align:"center",
            dataIndex: 'tagName'
           },
		   {
            title: '标签中文名称',
            align:"center",
            dataIndex: 'tagChnName'
           },
		   {
            title: '标签详细说明',
            align:"center",
            dataIndex: 'tagDesc'
           },
		   {
            title: '标签类型',
            align:"center",
            dataIndex: 'tagType_dictText'
           },
		   {
            title: '标签状态',
            align:"center",
            dataIndex: 'tagState_dictText'
           },

		   {
            title: '创建人',
            align:"center",
            dataIndex: 'createUsername'
           },

          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/config/medicalDataTagDef/list",
          delete: "/config/medicalDataTagDef/delete",
          deleteBatch: "/config/medicalDataTagDef/deleteBatch",
          exportXlsUrl: "config/medicalDataTagDef/exportXls",
          importExcelUrl: "config/medicalDataTagDef/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      changeTagStatus:function(){
        if (this.selectedRowKeys.length !== 1) {
          this.$message.warning('请选择一条记录！')
          return
        }
        let record = {...this.selectionRows[0]}
        this.$refs.modalForm.editStatus(record)
        this.$refs.modalForm.title = '修改标签状态'
        this.$refs.modalForm.disableSubmit = false
      },
      changeTagStatusOk:function(){
        this.selectedRowKeys=[]
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
