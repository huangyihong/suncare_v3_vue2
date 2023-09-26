<template>
  <a-card :bordered="false" v-bind="isSelect?{bodyStyle:{padding: 0}}:{}">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item label="分组编码">
              <j-input placeholder="请输入分组编码" v-model="queryParam.groupCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item label="分组名称">
              <j-input placeholder="请输入分组名称" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item label="字典类型">
              <m-dict-select-tag placeholder="字典类型" dictCode="DRUG_GROUP_KIND" showKey=true
                                 v-model="queryParam.kind"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="字典项代码">
                <j-input placeholder="请输入字典项代码" v-model="queryParam.code"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="字典项名称">
                <j-input placeholder="请输入字典项名称" v-model="queryParam.value"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :xs="searchItemSpan">
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
    <div class="table-operator" v-if="!isSelect">
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
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="!isSelect">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: selectType}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>
        <span slot="code" slot-scope="text, record">
          {{text}} <a-icon type="loading" v-if="record.loading"/>
        </span>
        <span slot="action" slot-scope="text, record">
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
                <a-menu-item>
                    <a @click="clearCache(record.groupCode)">清除缓存</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>

        </span>
        <template slot="expandedRowRender" slot-scope="record">
          <medical-dict-item-list :groupId="record.groupId"
                                  :groupCode="record.groupCode"
                                  :kind="record.kind" :key="record" :readonly="isSelect"
          ></medical-dict-item-list>
        </template>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medical-drug-rule-group-modal ref="modalForm" @ok="()=>{expandedRowKeys = [];modalFormOk()}"
                                   v-if="!isSelect"></medical-drug-rule-group-modal>

  </a-card>
</template>

<script>
  import MedicalDrugRuleGroupModal from './modules/MedicalDictModal'
  import MedicalDictItemList from './MedicalDictItemList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { getAction,postAction } from '@/api/manage'

  export default {
    name: "MedicalDictList",
    mixins: [JeecgListMixin],
    props: {
      isSelect: {
        type: Boolean,
        default: false
      },
      selectType: {
        type: String,
        default: 'checkbox'
      },
      kind:String
    },
    components: {
      MedicalDrugRuleGroupModal,
      MedicalDictItemList,
      MDictSelectTag,
      JEllipsis
    },
    data() {
      const columns = [
        {
          title: '分组编码',
          align: "left",
          dataIndex: 'groupCode',
          scopedSlots: { customRender: 'code' },
          width: 180
        },
        {
          title: '分组名称',
          align: "center",
          dataIndex: 'groupName',
          width: 180,
        },
        {
          title: '字典类型',
          align: "center",
          dataIndex: 'kind_dictText',
          width: 120,
        },
        {
          title: '描述',
          align: "center",
          dataIndex: 'remark',
          // scopedSlots: { customRender: 'remark' },
          width: 250,
        },

      ]
      if (!this.isSelect) {
        columns.push({
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: { customRender: 'action' },
          width: 180
        })
      }
      return {
        description: '药品合规规则分组管理页面',
        // 表头
        columns: columns,
        url: {
          list: "/config/medicalDict/list",
          delete: "/config/medicalDict/delete",
          deleteBatch: "/config/medicalDict/deleteBatch",
          deleteChild: "/config/medicalDictItem/delete",
          deleteChildBatch: "/config/medicalDictItem/deleteBatch",
          exportXlsUrl: "/config/medicalDict/exportXls",
          importExcelUrl: "/config/medicalDict/importExcel",
          clearCache: "/config/medicalDict/common/clearByType",
        },
        /* 排序参数 */
        isorter: {
          column: 'isOrder,groupCode',
          order: 'asc,asc',
        },
        searchItemSpan: this.isSelect?8:6,
      }
    },
    watch: {
      kind: {
        immediate: true,
        handler(val) {
          if(val && val.length > 0)
            this.queryParam.kind = val
        }
      },
    },
    beforeMount() {
      if (this.isSelect) {
        this.tableAttrs.scroll =  {
          x: this.scrollX,
          y: this.scrollY
        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.url.importExcelUrl}`;
      }
    },
    methods: {
      clearCache(code){
        this.$util.clearCache('MDict_' + code)
        getAction(this.url.clearCache, {type: code}).then(res => {
          if (res.success) {
            this.$message.success(res.message);

          } else {
            this.$message.warning(res.message);
          }
        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
