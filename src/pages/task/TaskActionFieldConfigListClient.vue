<template>
    <a-card :bordered="false">

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">

                    <a-col :md="6" :sm="8">
                        <a-form-item label="不合规行为">
                            <j-input placeholder="请输入(模糊查询)" v-model="queryParam.searchActionName"></j-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="状态">
                            <m-dict-select-tag placeholder="请选择状态" dictCode="SWITCH_STATUS"
                                               v-model="queryParam.status"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="修改人">
                            <j-input placeholder="请输入(模糊查询)" v-model="queryParam.updateUsername"></j-input>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :md="6" :sm="8">
                      <a-form-item label="字段(多值)">
                        <a-input placeholder="请输入字段(多值)" v-model="queryParam.fields"></a-input>
                      </a-form-item>
                    </a-col>-->
                    <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

                <!--<a @click="handleToggleSearch" class="m-l-6">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </a>-->
            </span>
                    </a-col>

                </a-row>
            </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button @click="handleCopyAdd" type="primary" icon="plus">复制新增</a-button>
            <!--<async-log-modal-button ref="asyncLogRef" actionType="TYPE_CACHE_GROUP">分组统计数据沉淀进度</async-log-modal-button>-->
            <!--<a-button @click="handleAddBatch" type="primary" icon="plus">批量新增</a-button>-->
            <!--<a-button type="primary" icon="download" @click="handleExportXls('不同不合规行为显示字段配置')">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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
            <!--  <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
                <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
                <a style="margin-left: 24px" @click="onClearSelected">清空</a>
              </div>-->

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
                <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
                <span slot="status" slot-scope="text, record, index">
                  <a-switch checked-children="开" un-checked-children="关" :checked="record.status === 'normal'"
                            :loading="record.statusLoading" @click="changeStatus(index)"/>
                </span>
                <span slot="action" slot-scope="text, record">

          <a @click="handleDetail(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
                    <!-- <a-dropdown>
                       <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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

        <!-- 表单区域 -->
        <task-action-field-config-modal-client ref="modalForm" @ok="modalFormOk"></task-action-field-config-modal-client>
        <task-action-field-config-detail-modal ref="detailModal"></task-action-field-config-detail-modal>
        <groupby-modal ref="groupbyModal"></groupby-modal>
    </a-card>
</template>

<script>
  import TaskActionFieldConfigModalClient from './modules/TaskActionFieldConfigModalClient'
  import TaskActionFieldConfigDetailModal from './modules/TaskActionFieldConfigDetailModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { putAction } from '@/api/manage'
  import GroupbyModal from '@/pages/task/plugin/GroupbyModal'
  import AsyncLogModalButton from '@/pages/task/plugin/AsyncLogModalButton'

  export default {
    name: "TaskActionFieldConfigList",
    mixins: [JeecgListMixin],
    components: {
      TaskActionFieldConfigModalClient,
      TaskActionFieldConfigDetailModal,
      MDictSelectTag,
      GroupbyModal,
      AsyncLogModalButton,
    },
    data() {
      return {
        description: '不同不合规行为显示字段配置管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function(t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '不合规行为',
            align: "center",
            width: 180,
            dataIndex: 'actionName',
          },
          {
            title: '修改人',
            align: "center",
            width: 120,
            dataIndex: 'updateUsername'
          },
          {
            title: '修改时间',
            align: "center",
            width: 120,
            dataIndex: 'updateTime'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            width: 120,
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 300,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/task/taskActionFieldConfig/list",
          delete: "/task/taskActionFieldConfig/delete",
          deleteBatch: "/task/taskActionFieldConfig/deleteBatch",
          exportXlsUrl: "task/taskActionFieldConfig/exportXls",
          importExcelUrl: "task/taskActionFieldConfig/importExcel",
          edit: "task/taskActionFieldConfig/editConfig",
        },
        fixedParam: {
          platform: 'client'
        },
        /* 排序参数 */
        isorter:{
          column: 'updateTime,createTime,actionName',
          order: 'desc,desc,asc',
        },
        focusId: undefined
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      /*handleAddBatch: function() {
        this.$refs.modalForm.add(true)
        this.$refs.modalForm.title = '批量新增'
        this.$refs.modalForm.disableSubmit = false
      },*/
      handleDetail: function(record) {
        this.$refs.detailModal.detail(record)
      },
      changeStatus(index) {
        let record = this.dataSource[index]
        let status = record.status === 'normal' ? 'stop' : 'normal'
        this.$set(record, 'statusLoading', true)
        putAction(this.url.edit, { id: record.id, status }).then((res) => {
          if (res.success) {
            this.$set(record, 'status', status)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.$set(record, 'statusLoading', false)
        })

      },
    }
  }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
