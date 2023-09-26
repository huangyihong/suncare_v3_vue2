<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">


          <a-col :md="6" :sm="8">
            <a-form-item label="数据库编码">
              <j-input placeholder="请输入数据库编码" v-model="queryParam.dbname"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="数据库中文名称">
              <j-input placeholder="请输入数据库中文名称" v-model="queryParam.cnname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="数据库类型">
              <m-dict-select-tag :required="false"  placeholder="请选择数据库类型" dictCode="DB_TYPE"  class="loginList-select"  v-model="queryParam.dbtype" ></m-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
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
      <a-button @click="handleCopyAdd" type="primary" icon="copy">复制新增</a-button>
      <a-button @click="update()" type="primary" icon="edit">修改</a-button>
      <a-button @click="batchDel" type="primary" icon="delete">删除</a-button>
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
        rowKey="dbSourceName"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
         <span slot="action" slot-scope="text, record">
        <!--        <a @click="handleEdit(record)" :disabled="!record.isOperation">编辑</a>-->
          <a @click="handleEdit(record)" >编辑</a>
       </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sys-database-modal ref="modalForm" @ok="modalFormOk" @reloadDb="reloadDb"></sys-database-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { deleteAction, getAction, downFile } from '@/api/manage'
import SysDatabaseModal from './modules/SysDatabaseModal'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import {ajaxGetDictItems} from '@/api/api'

export default {
  name: "SysDatabaseList",
  mixins:[JeecgListMixin],
  components: {
    SysDatabaseModal,
    MDictSelectTag
  },
  data () {
    return {
      description: '数据源配置',
      dictOptions: [],
      // 表头
      columns: [
        {
          title: '数据库编码',
          align:"center",
          dataIndex: 'dbname',
          width: 200,
        },
        {
          title: '数据库中文名称',
          align:"center",
          dataIndex: 'cnname',
          width: 200,
        },
        {
          title: '数据库类型',
          align:"center",
          dataIndex: 'dbtype_dictText',
          width: 100,
        },
        {
          title: '连接的URL',
          align:"center",
          dataIndex: 'url',
          width: 550,
        },
        {
          title: '数据库用户名',
          align:"center",
          dataIndex: 'dbUser',
          width: 130,
        },

        {
          title: '备注',
          align:"center",
          dataIndex: 'remark',
          width: 200,
        },

        {
          title: '创建人名称',
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
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: {customRender: 'action'}
        }
      ],
      url: {
        list: "/system/sysDatabase/list",
        delete: "/system/sysDatabase/delete",
        deleteBatch: "/system/sysDatabase/deleteBatch",
      },
      isorter: {
        column: 'dataSource',
        order: 'desc'
      },
    }
  },
  computed: {
  },
  beforeMount() {
  },
  methods: {
    batchDel: function() {
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
        console.log("ids",ids)
        const that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            that.loading = true
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
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
    //修改
    update() {
      if (this.selectionRows.length !== 1) {
        this.$message.error("请选择1条记录!")
      } else {
        let data = this.selectionRows
        this.handleEdit(data[0])
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
