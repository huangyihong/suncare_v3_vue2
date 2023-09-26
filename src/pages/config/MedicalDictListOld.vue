<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item label="分组编码">
              <a-input placeholder="请输入分组编码" v-model="queryParam.groupCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="分组名称">
              <j-input placeholder="请输入分组名称" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="字典类型">
              <m-dict-select-tag placeholder="字典类型" dictCode="DRUG_GROUP_KIND" showKey=true
                                 v-model="queryParam.kind"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :span="6">
              <a-form-item label="字典项代码">
                <j-input placeholder="请输入字典项代码" v-model="queryParam.code"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="字典项名称">
                <j-input placeholder="请输入字典项名称" v-model="queryParam.value"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="6">
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

     <!-- <a-button type="primary" icon="download" @click="handleExportXls('药品合规规则分组')">导出</a-button>
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
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>
      <a-table
        ref="table"
        size="middle"
        :bordered="false"
        rowKey="groupId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableAttrs">
        <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>
        <span slot="code" slot-scope="text, record">
          {{text}} <a-icon type="loading" v-if="record.loading"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.children">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.groupId)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
           <template v-else>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleChildDelete(record)">
                <a>删除</a>
              </a-popconfirm>
          </template>
        </span>
        <!--<medical-drug-rule-group-del-list :groupId="record.id" :key="record" slot="expandedRowRender" slot-scope="record"></medical-drug-rule-group-del-list>-->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medical-drug-rule-group-modal ref="modalForm" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></medical-drug-rule-group-modal>

  </a-card>
</template>

<script>
  import MedicalDrugRuleGroupModal from './modules/MedicalDictModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import JEllipsis from '@/components/jeecg/JEllipsis'

  import { queryItemsByGroup } from '@/api-sv3/api-medical'
  import { deleteAction } from '@/api/manage'

  export default {
    name: "MedicalDictList",
    mixins: [JeecgListMixin],
    components: {
      MedicalDrugRuleGroupModal,
      MDictSelectTag,
      JEllipsis,
    },
    data() {
      return {
        description: '药品合规规则分组管理页面',
        // 表头
        columns: [
          {
            title: '分组编码',
            align: "left",
            dataIndex: 'groupCode',
            scopedSlots: { customRender: 'code' }
          },
          {
            title: '分组名称',
            align: "center",
            dataIndex: 'groupName',
            width: '30%'
          },
          {
            title: '字典类型',
            align: "center",
            dataIndex: 'kind_dictText'
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark',
            // scopedSlots: { customRender: 'remark' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
            width: 180
          }
        ],
        url: {
          list: "/config/medicalDict/list",
          delete: "/config/medicalDict/delete",
          deleteBatch: "/config/medicalDict/deleteBatch",
          deleteChild: "/config/medicalDictItem/delete",
          deleteChildBatch: "/config/medicalDictItem/deleteBatch",
          exportXlsUrl: "/config/medicalDict/exportXls",
          importExcelUrl: "/config/medicalDict/importExcel",
        },
        /* 排序参数 */
        isorter: {
          column: 'isOrder,groupCode',
          order: 'asc,asc',
        },
        expandedRowKeys: []
      }


    },
    watch: {
      dataSource(val) {
        this.expandedRowKeys = []
        val.forEach(item => item.children = item.children || [])
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleExpand(expanded, record, reload) {
        if (Object.prototype.toString.call(record) === '[object String]') {
          record = this.dataSource.find(item => item.groupId === record)
        }
        if (!record) {
          return
        }
        // 删除原来的展开
        let keyIndex = this.expandedRowKeys.indexOf(record.groupId)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1);
        }
        // 判断是否是展开状态
        if (expanded) {
          if (reload || record.children.length === 0) {
            this.$set(record, 'loading', true)
            let {code, value} = this.queryParam
            queryItemsByGroup({ groupId: record.groupId,code, value }).then((res) => {
              if (res.success) {
                this.$set(record, 'children', res.result.records.map(item => {return {
                    groupId: item.itemId,
                    groupCode: item.code,
                    groupName: item.value,
                    parentId: record.groupId
                  }}))
                this.expandedRowKeys.push(record.groupId)
              } else {
                this.$message.warning(res.message)
              }
            }).finally(() => {
              this.$set(record, 'loading', false)
            })
          } else {
            this.expandedRowKeys.push(record.groupId)
          }
        }
      },
      handleChildDelete: function(record) {
        const that = this;
        deleteAction(that.url.deleteChild, { id: record.itemId }).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.handleExpand(true, record.parentId, true)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      batchDel: function() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        }
        let ids = this.selectionRows.filter(r => !r.parentId).map(r => r.groupId)
        let childItems = this.selectionRows.filter(r => !!r.parentId)
        let childIds = childItems.map(r => r.groupId)
        if (ids.length > 0 && childIds.length > 0) {
          this.$message.warning('子项不能和父项一起选择！');
          return
        }
        const that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function() {
            if (ids.length > 0) {
              deleteAction(that.url.deleteBatch, { ids: ids.join(",") }).then((res) => {
                if (res.success) {
                  that.loadData();
                  that.onClearSelected();
                  that.$message.success(res.message);
                } else {
                  that.$message.warning(res.message);
                }
              });
            } else if (childIds.length > 0) {
              deleteAction(that.url.deleteChildBatch, { ids: childIds.join(",") }).then((res) => {
                if (res.success) {
                  that.onClearSelected();
                  let idSet = new Set(childItems.map(item => item.parentId))
                  idSet.forEach(id => {
                    that.handleExpand(true, id, true)
                  })
                  that.$message.success(res.message);
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          }
        });

      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>