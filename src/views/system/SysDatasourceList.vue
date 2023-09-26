<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="项目地编码">
              <a-input placeholder="请输入项目地编码" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目地名称">
              <j-input placeholder="请输入项目地名称" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

            <a-col :md="6" :sm="8">
              <a-form-item label="数据源">
                <a-select placeholder="请选择数据源" :options="databaseOptions"
                          v-model="queryParam.databaseSource"></a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="数据来源">
                <m-dict-select-tag placeholder="请选择数据来源" dictCode="ETL_SOURCE" :required="false"  class="loginList-select" v-model="queryParam.etlSource"></m-dict-select-tag>
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
      <a-button @click="handleCopyAdd" type="primary" icon="copy">复制新增</a-button>
      <a-button @click="update()" type="primary" icon="edit">修改</a-button>
      <a-button @click="batchDel" type="primary" icon="delete">删除</a-button>
      <a-button @click="authRole" type="primary" style="margin-top: 16px">授权给角色</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="dbSourceName"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
<!--         <span slot="etlSource" slot-scope="text, record, index">-->
<!--            <span v-for="(item,index) in dictEtlSourceOptions">-->
<!--              <span v-if="text==item.value">{{item.text}}</span>-->
<!--            </span>-->
<!--        </span>-->
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="authToRole(record)">授权给角色</a>
        </span>
        <span slot="databaseSource" slot-scope="text, record, index">
<!--            <span v-for="(item,index) in databaseOptions">-->
<!--              <span v-if="text==item.value">{{item.text}}</span>-->
<!--            </span>-->
          {{record.cnname}}
          <span v-if="record.dbname">
            ({{record.dbname}})
          </span>

        </span>
        <span slot="solrAddr" slot-scope="text, record, index">
            <span v-for="(item,index) in solrOptions">
              <span v-if="text==item.value">{{item.text}}</span>
            </span>
        </span>
        <span slot="systemCode_dictText" slot-scope="text, record, index">

          <span v-if="text=='' || text==null">全部</span>
          <span v-else>{{text}}</span>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sys-datasource-modal ref="modalForm" @ok="modalFormOk" @reloadDb="reloadDb"></sys-datasource-modal>
    <!--  角色授权-->
    <Select-Role-Modal ref="selectRoleModal" @ok="refresh"></Select-Role-Modal>
  </a-card>
</template>

<script>
import SysDatasourceModal from './modules/SysDatasourceModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, deleteAction, getAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import SelectRoleModal from "./modules/SelectRoleModal";

export default {
  name: "SysDatasourceList",
  mixins: [JeecgListMixin],
  components: {
    SysDatasourceModal,
    MDictSelectTag,
    SelectRoleModal
  },
  data() {
    return {
      description: '项目地配置管理页面',
      dictEtlSourceOptions: [],
      databaseOptions: [],
      solrOptions: [],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '项目地编码',
          align: "center",
          width: 200,
          dataIndex: 'code'

        },
        {
          title: '项目地名称',
          align: "center",
          width: 200,
          dataIndex: 'name'
        },
        {
          title: '数仓project',
          align: "center",
          width: 200,
          dataIndex: 'dataProject'
        },
        {
          title: '数据库名称(编码)',
          align: "center",
          width: 200,
          dataIndex: 'databaseSource',
          scopedSlots: {customRender: 'databaseSource'}
        },
        {
          title: '数据来源',
          align: "center",
          width: 200,
          dataIndex: 'etlSource_dictText',
          // scopedSlots: {customRender: 'etlSource'}
        },
        {
          title: '备注',
          align: "center",
          width: 200,
          dataIndex: 'remark'
        },
        {
          title: '创建人',
          align:"center",
          dataIndex: 'createdByName'
        },
        {
          title: '创建时间',
          align:"center",
          dataIndex: 'createdTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: 'right',
          width: 200,
          scopedSlots: {customRender: 'action'},
        }
      ],
      url: {
        list: "/system/sysDatasource/list",
        delete: "/system/sysDatasource/delete",
        deleteBatch: "/system/sysDatasource/deleteBatch",
        exportXlsUrl: "system/sysDatasource/exportXls",
        importExcelUrl: "system/sysDatasource/importExcel",
        queryDatabaseList: "/system/sysDatabase/queryList"
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  created() {



    getAction(this.url.queryDatabaseList).then(res => {
      if (res.success) {
        res.result.forEach(item => {
          this.databaseOptions.push({text: item.cnname, title: item.cnname, value: item.dbname})
        })
      }
    })

    getAction(this.url.queryDatabaseList,{dbtype:"solr"}).then(res => {
      if (res.success) {
        res.result.forEach(item => {
          this.solrOptions.push({text: item.cnname, title: item.cnname, value: item.dbname})
        })
      }
    })


  },
  methods: {
    authRole(){
      if (this.selectionRows.length !== 1) {
        this.$message.error("请选择1个项目地!")
      } else {
        this.$refs.selectRoleModal.show(this.selectionRows[0])
      }
    },
    authToRole(record){
      this.$refs.selectRoleModal.show(record)
    },

    //修改
    update() {
      if (this.selectionRows.length !== 1) {
        this.$message.error("请选择1条记录!")
      } else {
        let data = this.selectionRows
        this.handleEdit(data[0])
      }
    },

    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        let ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectionRows[a].id + ','
        }
        console.log("ids", ids)
        const that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            that.loading = true
            deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.loading = false
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },

    //刷新数据库下拉选择
    reloadDb(){
      this.$emit('reloadDb');
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
