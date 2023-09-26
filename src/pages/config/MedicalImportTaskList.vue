<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="操作名称">
              <j-input placeholder="请输入操作名称" v-model="queryParam.actionType"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="操作表">
              <j-input placeholder="请输入操作表" v-model="queryParam.tableName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select placeholder="请选择状态" v-model="queryParam.status">
                <a-select-option  value="-1">等待</a-select-option>
                <a-select-option  value="00">正在运行</a-select-option>
                <a-select-option  value="01">成功</a-select-option>
                <a-select-option  value="02">失败</a-select-option>
              </a-select>
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
      <a-button @click="batchDel" type="primary" icon="delete" v-has="'importTask:delete'">删除</a-button>
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
        @change="handleTableChange"
        v-bind="tableAttrs">

        <span slot="status" slot-scope="text, record, index">
          <span v-if="text=='-1'"><a-badge status="default"/> 等待</span>
          <span v-else-if="text=='00'"><a-badge status="processing"/> 正在运行</span>
          <span v-else-if="text=='01'"><a-badge status="success" /> 成功</span>
          <span v-else><a-badge status="warning"/> 失败</span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MedicalImportTaskList",
    mixins:[JeecgListMixin],
    components: {
    },
    data () {
      return {
        description: '导入任务管理页面',
        // 表头
        columns: [{
          title: '操作名称',
          align:"left",
          dataIndex: 'actionType',
          width: 200,
        }, {
          title: '操作表',
          align:"left",
          dataIndex: 'tableName',
          width: 200,
        }, {
            title: '记录数',
            align:"center",
            dataIndex: 'recordCount',
            width: 80,
            customRender: (text, record, index) => {
             if(text !== undefined && text != null){
               if(text === -1){
                 text = '未知'
               } else {
                 text += "条"
               }
             }
             return text;
           },
        }, {
            title: '状态',
            align:"center",
            dataIndex: 'status',
            width: 80,
            scopedSlots: { customRender: 'status' },
            customRender: (text, record, index) => {
               var html = '';
               if(text==='-1'){
                 html = "等待";
               }
              if(text==='00'){
                html = "正在运行";
              }
              if(text==='01'){
                html = "成功";
              }
              if(text==='02'){
                html = "失败";
              }
               return html;
             },
        }, {
          title: '开始时间',
          align:"center",
          dataIndex: 'startTime',
          width: 180,
        }, {
          title: '完成时间',
          align:"center",
          dataIndex: 'endTime',
          width: 180,
        }, {
            title: '提示信息',
            align:"center",
            dataIndex: 'message',
        }, {
            title: '创建人',
            align:"center",
            dataIndex: 'createUsername',
            width: 120,
             customRender: function (t, r, index) {
               return t || r.createUser;
             }
        }, {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime',
            width: 120,
        },
        ],
		url: {
          list: "/config/medicalImportTask/list",
          delete: "/config/medicalImportTask/delete",
          deleteBatch: "/config/medicalImportTask/deleteBatch",
       },
        /* 排序参数 */
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
    }
  },
    methods: {
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
