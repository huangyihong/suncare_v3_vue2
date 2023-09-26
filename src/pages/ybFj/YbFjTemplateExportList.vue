<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="10" :sm="10">
            <a-form-item label="文档生成模板名称">
              <j-input placeholder="请输入文档生成模板名称模糊查询" v-model="queryParam.templateName"></j-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="importPop" class="btn" type="primary">上传文件</a-button>
      <a-button @click="batchDel"  v-if="selectedRowKeys.length>0" type="primary" icon="delete">批量删除</a-button>
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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" v-if="record.templatePath"/>
          <a @click="uploadFile(record.templatePath)" v-if="record.templatePath">下载模板文件</a>
          <a-divider type="vertical"/>
          <a @click="toShowHistory(record)">查看历史版本</a>
       </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <yb-fj-template-export-modal  ref="modalForm" @ok="modalFormOk"></yb-fj-template-export-modal>
    <!-- 历史版本 -->
    <yb-fj-template-export-his-modal  ref="historyModal"></yb-fj-template-export-his-modal>
    <!--    上传文件对话框-->
    <import-excle-model ref="importExcleModel" :text="'上传文件'" ></import-excle-model>

  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import YbFjTemplateExportModal from './modules/YbFjTemplateExportModal'
import YbFjTemplateExportHisModal from './modules/YbFjTemplateExportHisModal'
import ImportExcleModel from './modules/ImportExcleModel'
export default {
  name: "YbFjTemplateExportList",
  mixins: [JeecgListMixin],
  components: {
    MDictSelectTag,
    YbFjTemplateExportModal,
    YbFjTemplateExportHisModal,
    ImportExcleModel
  },
  data() {
    return {
      description: '文档生成模板管理',
      // 表头
      columns: [
        {
          title: '文档模板ID',
          align: "left",
          dataIndex: 'templateCode',
          width: '100px'
        },
        {
          title: '文档生成模板名称',
          align: "left",
          dataIndex: 'templateName',
          width: '200px'
        },
        {
          title: '调用python编码(名称)',
          align: "left",
          dataIndex: 'pythonProcCode',
          width: '150px',
          customRender: (text, record, index) => {
            return `${text}(${record.pythonProcCode_dictText})`
          }
        },
        {
          title: '模板版本号',
          align: "left",
          dataIndex: 'versionNum',
          width: '100px',
          customRender: function(text) {
            if(!text){return ''}
            let t= text.toString()
            if(t.indexOf('.') == -1){
              return `V${t}.00`
            }else{
              return `V${t}`
            }
          }
        },
        {
          title: '模板最后修改人',
          align: "left",
          dataIndex: 'updateUsername',
          width: '150px'
        },
        {
          title: '模板最后修改时间',
          align: "left",
          dataIndex: 'createTime',
          width: '150px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '300px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      url: {
        list: "/ybFj/ybFjTemplateExport/list",
        delete: '/ybFj/ybFjTemplateExport/delete',
        deleteBatch: '/ybFj/ybFjTemplateExport/deleteBatch',
      },

      fixedParam:{
        useStatus:'1',
      },
      isorter: {
        column: 'templateCode',
        order: 'asc'
      },

    }
  },
  computed: {

  },

  methods: {
    importPop() {
      this.$refs.importExcleModel.show()
    },
    toShowHistory(record){
      this.$refs.historyModal.show(record)
    },
    /* 模板下载 */
    uploadFile(templatePath){
      window.open(this.$config['domianURL'] + "/sys/common/download/" + templatePath);
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
