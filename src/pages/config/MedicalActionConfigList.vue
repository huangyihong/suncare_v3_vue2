<template>
    <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">
                    <a-col :md="6" :sm="8">
                        <a-form-item label="不合规行为名称">
                            <j-input placeholder="请输入不合规行为名称" v-model="queryParam.actionName"></j-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="不合规行为描述">
                            <j-input placeholder="请输入不合规行为描述" v-model="queryParam.actionDesc"></j-input>
                        </a-form-item>
                    </a-col>
                    <template v-if="toggleSearchStatus">
                        <a-col :md="6" :sm="8">
                            <a-form-item label="备注">
                                <j-input placeholder="请输入备注" v-model="queryParam.remark"></j-input>
                            </a-form-item>
                        </a-col>
                        <!--<a-col :md="6" :sm="8">
                            <a-form-item label="不合规行为类型">
                                <a-input placeholder="请输入不合规行为类型" v-model="queryParam.actionType"></a-input>
                            </a-form-item>
                        </a-col>-->
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
            <a-button type="primary" icon="download" @click="handleExportXls('不合规行为管理')">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
                      :action="importExcelUrl" @change="handleImportExcel">
                <a-button type="primary" icon="import">导入</a-button>
            </a-upload>
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
                    v-bind="tableAttrs"
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
        <medicalActionConfig-modal ref="modalForm" @ok="modalFormOk"></medicalActionConfig-modal>
    </a-card>
</template>

<script>
  import MedicalActionConfigModal from './modules/MedicalActionConfigModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MedicalActionConfigList",
    mixins: [JeecgListMixin],
    components: {
      MedicalActionConfigModal
    },
    data() {
      return {
        description: '不合规行为管理管理页面',
        // 表头
        columns: [
          {
            title: '不合规行为名称',
            align: "center",
            dataIndex: 'actionName'
          },
          {
            title: '不合规行为描述',
            align: "center",
            dataIndex: 'actionDesc'
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'remark'
          },
          {
            title: '不合规行为类型',
            align: "center",
            dataIndex: 'actionType'
          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '修改人姓名',
            align: "center",
            dataIndex: 'updateUsername'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建人姓名',
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
          list: "/config/medicalActionConfig/list",
          delete: "/config/medicalActionConfig/delete",
          deleteBatch: "/config/medicalActionConfig/deleteBatch",
          exportXlsUrl: "config/medicalActionConfig/exportXls",
          importExcelUrl: "config/medicalActionConfig/importExcel",
        },
        /* 排序参数 */
        isorter: {
          column: 'createTime',
          order: 'desc'
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
