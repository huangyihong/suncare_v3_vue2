<template>
    <a-card :bordered="false">

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">
                    <a-col :md="6" :sm="8">
                        <a-form-item label="表名">
                            <m-dict-select-tag placeholder="请选择表名" dictCode="DATA"
                                               v-model="queryParam.tableName" showKey search
                                               :loaded="data => {data.unshift({code: 'MEDICAL_UNREASONABLE_ACTION',value: '规则引擎结果表'}); return data}"
                            ></m-dict-select-tag>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="字段名">
                            <j-input placeholder="请输入字段名" v-model="queryParam.colName"></j-input>
                        </a-form-item>
                    </a-col>
                  <a-col :md="6" :sm="8">
                    <a-form-item label="字段中文名">
                      <j-input placeholder="请输入字段中文名" v-model="queryParam.colCnname"></j-input>
                    </a-form-item>
                  </a-col>
                   <!-- <a-col :md="6" :sm="8">
                        <a-form-item label="适用平台">
                            <m-dict-select-tag placeholder="请选择适用平台" dictCode="ACTION_FIELD_PALTFORM"
                                               v-model="queryParam.platform"/>
                        </a-form-item>
                    </a-col>-->
                    <template v-if="toggleSearchStatus">

                        <a-col :md="6" :sm="8">
                            <a-form-item label="是否DWS字段">
                                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                                   v-model="queryParam.dwsCol"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="8">
                            <a-form-item label="是否默认字段">
                                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                                   v-model="queryParam.defSelect"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="8">
                            <a-form-item label="是否默认查询条件">
                                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                                   v-model="queryParam.defSearch"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="8">
                            <a-form-item label="是否配置查询条件">
                                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                                   v-model="queryParam.toSearch"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="8">
                            <a-form-item label="状态">
                                <m-dict-select-tag placeholder="请选择状态" dictCode="SWITCH_STATUS"
                                                   v-model="queryParam.status"/>
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
            <!--<a-button type="primary" icon="download" @click="handleExportXls('不合规行为表字段信息配置')">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
                      :action="importExcelUrl" @change="handleImportExcel">
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
                    rowKey="colId"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    v-bind="tableAttrs"
                    @change="handleTableChange">
        <span slot="status" slot-scope="text, record, index">
          <a-switch checked-children="开" un-checked-children="关" :checked="record.status === 'normal'"
                    :loading="record.statusLoading" @click="changeStatus(index)"/>
        </span>
                <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.colId)">
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
        <taskActionFieldCol-modal ref="modalForm" @ok="modalFormOk"></taskActionFieldCol-modal>

    </a-card>
</template>

<script>
  import TaskActionFieldColModal from './modules/TaskActionFieldColModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { putAction } from '@/api/manage'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "TaskActionFieldColList",
    mixins: [JeecgListMixin],
    components: {
      TaskActionFieldColModal,
      MDictSelectTag,
    },
    data() {
      return {
        description: '不合规行为表字段信息配置管理页面',
        // 表头
        columns: [
          {
            title: '表名',
            align: "center",
            dataIndex: 'tableName'
          },
          {
            title: '字段名',
            align: "center",
            dataIndex: 'colName'
          },
          {
            title: '字段中文名',
            align: "center",
            dataIndex: 'colCnname'
          },
         /* {
            title: '适用平台',
            align: "center",
            dataIndex: 'platform_dictText'
          },*/
          {
            title: '字段含义',
            align: "center",
            dataIndex: 'colDesc',
            customRender: t => <j-ellipsis value={t} length={10}/>
          },
          /*{
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },*/
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '默认字段',
            align: "center",
            dataIndex: 'defSelect_dictText'
          },{
            title: '查询条件',
            align: "center",
            dataIndex: 'toSearch_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/task/taskActionFieldCol/list",
          delete: "/task/taskActionFieldCol/delete",
          deleteBatch: "/task/taskActionFieldCol/deleteBatch",
          edit: "/task/taskActionFieldCol/edit",
          exportXlsUrl: "task/taskActionFieldCol/exportXls",
          importExcelUrl: "task/taskActionFieldCol/importExcel",
        },
        /* 排序参数 */
        isorter:{
          column: 'createTime,tableName,colName',
          order: 'desc,asc,asc',
        },
      }
    },
    computed: {},
    methods: {
      changeStatus(index) {
        let record = this.dataSource[index]
        let status = record.status === 'normal' ? 'stop' : 'normal'
        this.$set(record, 'statusLoading', true)
        putAction(this.url.edit, { colId: record.colId, status }).then((res) => {
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
