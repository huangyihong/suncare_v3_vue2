<template>
    <a-card :bordered="false">

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">

                    <a-col :md="6" :sm="8">
                        <a-form-item label="项目编码">
                            <j-input placeholder="请输入(模糊查询)" v-model="queryParam.itemCodes"></j-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="项目名称">
                            <j-input placeholder="请输入(模糊查询)" v-model="queryParam.itemNames"></j-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="规则编码">
                            <j-input placeholder="请输入(模糊查询)" v-model="queryParam.ruleCode"></j-input>
                        </a-form-item>
                    </a-col>

                    <template v-if="toggleSearchStatus">
                        <a-col :lg="6" :md="8" :xs="12">
                            <a-form-item label="提示信息">
                                <j-input placeholder="请输入(模糊查询)" v-model="queryParam.message"></j-input>
                            </a-form-item>
                        </a-col>
                        <a-col :lg="6" :md="8" :xs="12">
                            <a-form-item label="操作时间">
                                <a-input placeholder="请输入(模糊查询)" v-model="queryParam.actionTime"></a-input>
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
            <a-button @click="handleImportExcel" type="primary" icon="import">导入</a-button>
            <a-button type="primary" icon="download" @click="handleExportFile('用药合理配置导出.xlsx')">导出</a-button>
            <a-button type="primary" icon="download"
                      @click="handleExportFile('失效判定条件组导出.xlsx', undefined, url.exportInvalidXls)">导出失效条件组
            </a-button>
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
                    rowKey="ruleId"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :scroll="{ x: scrollX}"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    v-bind="tableAttrs"
                    @change="handleTableChange">
                <!-- 字符串超长截取省略号显示 -->
                <span slot="message" slot-scope="text">
                   <j-ellipsis :value="text" :length="20"/>
                </span>
                <span slot="action" slot-scope="text, record">
                  <a @click="handleEdit(record)">编辑</a>

                  <a-divider type="vertical"/>
                  <a-dropdown>
                    <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.ruleId)">
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
        <medicalDruguse-modal ref="modalForm" @ok="modalFormOk"></medicalDruguse-modal>

        <!--导入-->
        <import-modal ref="importModel" tip="导入数据会根据【药品+不合规行为+年龄+性别】的唯一值作为标识，存在更新数据，不存在新增"
                      @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
    </a-card>
</template>

<script>
  import MedicalDruguseModal from './modules/MedicalDruguseModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ImportModal from '@/components/ImportModal'

  export default {
    name: "MedicalDruguseList",
    mixins: [JeecgListMixin],
    components: {
      MedicalDruguseModal,
      ImportModal
    },
    data() {
      return {
        description: '合理用药配置管理页面',
        // 表头
        columns: [

          {
            title: '药品编码',
            align: "center",
            dataIndex: 'itemCodes',
            width: 200,
            // fixed: true,
          },
          {
            title: '药品名称',
            align: "center",
            dataIndex: 'itemNames',
            width: 200,
            // fixed: true,
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 350,
            // scopedSlots: { customRender: 'message' },
          },
          {
            title: '政策依据',
            align: "center",
            dataIndex: 'ruleBasis',
            width: 350,
            // scopedSlots: { customRender: 'message' },
          },

          {
            title: '修改人',
            align: "center",
            dataIndex: 'updateUsername',
            width: 120,

          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'updateTime',
            width: 120,
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername',
            width: 120,
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime',
            width: 120,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 180,
            scopedSlots: { customRender: 'action' },
            fixed: 'right'
          }
        ],
        url: {
          list: "/medical/medicalDruguse/list",
          delete: "/medical/medicalDruguse/delete",
          deleteBatch: "/medical/medicalDruguse/deleteBatch",
          exportXlsUrl: "medical/medicalDruguse/exportXls",
          exportInvalidXls: "medical/medicalDruguse/exportInvalidXls",
          importExcelUrl: "medical/medicalDruguse/importExcel",
        },
      }
    },
    methods: {
      //导入
      handleImportExcel() {
        let param = {
          title: '用药合理配置导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: 'MEDICAL_DRUGUSE.xlsx'
        }
        this.$refs.importModel.loadData(param);
      },
    }
  }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
