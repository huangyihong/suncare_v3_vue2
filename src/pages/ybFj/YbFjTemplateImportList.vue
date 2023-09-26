<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="10" :sm="10">
            <a-form-item label="导入数据模板名称">
              <j-input placeholder="请输入导入数据模板名称模糊查询" v-model="queryParam.importName"></j-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增导入数据模板</a-button>
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
        <div slot="useStatus" slot-scope="text, record, index">
          <!--<a-switch checked-children="开" un-checked-children="关" :checked="record.useStatus == '1'"
                    :loading="record.statusLoading" @click="changeUseStatus(record)"/>-->
          <span v-if="record.useStatus == '1'">可用</span>
          <span v-else>禁用</span>
        </div>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="uploadFile(record.importPath)" >下载导入数据格式模板</a>
       </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <yb-fj-template-import-modal  ref="modalForm" @ok="modalFormOk"></yb-fj-template-import-modal>

  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction, putAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import YbFjTemplateImportModal from './modules/YbFjTemplateImportModal'

export default {
  name: "YbFjTemplateList",
  mixins: [JeecgListMixin],
  components: {
    MDictSelectTag,
    YbFjTemplateImportModal,
  },
  data() {
    return {
      description: '导入数据模板信息',
      // 表头
      columns: [
        {
          title: '导入数据模板名称',
          align: "left",
          dataIndex: 'importName',
          width: '200px'
        },
        {
          title: '可生成的文档类型',
          align: "left",
          dataIndex: 'templateCodes_dictText',
          width: '300px'
        },
        {
          title: '模板创建者',
          align: "left",
          dataIndex: 'createUsername',
          width: '80px'
        },
        {
          title: '模板创建时间',
          align: "left",
          dataIndex: 'createTime',
          width: '150px'
        },
        {
          title: '模板可用状态',
          align: "left",
          dataIndex: 'useStatus',
          width: '120px',
          scopedSlots: {customRender: 'useStatus'}
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      url: {
        list: "/ybFj/ybFjTemplateImport/list",
        delete: '/ybFj/ybFjTemplateImport/delete',
        deleteBatch: '/ybFj/ybFjTemplateImport/deleteBatch',
        edit: "/ybFj/ybFjTemplateImport/edit",
      },

    }
  },
  computed: {

  },

  methods: {
    toShowHistory(record){
      this.$refs.historyModal.show(record)
    },
    /* 模板下载 */
    uploadFile(templatePath){
      window.open(this.$config['domianURL'] + "/sys/common/download/" + templatePath);
    },

    changeUseStatus(record) {
      let useStatus = record.useStatus == '1' ? '0' : '1'
      this.$set(record, 'statusLoading', true)
      putAction(this.url.edit, { id: record.id, useStatus }).then((res) => {
        if (res.success) {
          this.$set(record, 'useStatus', useStatus)
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.$set(record, 'statusLoading', false)
      })

    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
