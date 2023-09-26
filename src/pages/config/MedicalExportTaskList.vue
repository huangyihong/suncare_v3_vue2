<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="文件名">
              <j-input placeholder="请输入文件名" v-model="queryParam.fileName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select placeholder="请选择状态" v-model="queryParam.status">
                <a-select-option  value="-1">等待</a-select-option>
                <a-select-option  value="00">正在导出</a-select-option>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <span slot="action" slot-scope="text, record">
          <a @click="uploadFile(record)" v-if="record.status==='01'">下载</a>
          <!--<a @click="uploadFile(record)" v-if="record.status==='01' || record.status==='02'">下载</a>-->
        </span>

        <span slot="errorMsg" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MedicalExportTaskList",
    mixins:[JeecgListMixin],
    components: {
    },
    data () {
      return {
        description: '导出文件任务管理页面',
        // 表头
        columns: [
		   {
            title: '文件名',
            align:"left",
            dataIndex: 'fileName'
           },
//		   {
//            title: '文件路径',
//            align:"center",
//            dataIndex: 'filePath'
//           },
		   {
            title: '文件大小',
            align:"center",
            dataIndex: 'fileSize',
             customRender: (text, record, index) => {
               var html = text;
               if(text){
                 html += "KB";
               }
               return html;
             },
           },
		   {
            title: '记录数',
            align:"center",
            dataIndex: 'recordCount',
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
           },
		   {
            title: '状态',
            align:"center",
            dataIndex: 'status',
            customRender: (text, record, index) => {
               var html = '';
               if(text==='-1'){
                 html = "等待";
               }
              if(text==='00'){
                html = "正在导出";
              }
              if(text==='01'){
                html = "成功";
              }
              if(text==='02'){
                html = "失败";
              }
               return html;
             },
           },
		   {
            title: '错误信息',
            align:"center",
            dataIndex: 'errorMsg',
            scopedSlots: { customRender: 'errorMsg' },
           },
		   {
            title: '创建人',
            align:"center",
            dataIndex: 'createUsername',
             customRender: function (t, r, index) {
               return t || r.createUser;
             }
           },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
		   {
            title: '完成时间',
            align:"center",
            dataIndex: 'overTime'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/config/medicalExportTask/list",
          delete: "/config/medicalExportTask/delete",
          deleteBatch: "/config/medicalExportTask/deleteBatch",
          exportXlsUrl: "config/medicalExportTask/exportXls",
          importExcelUrl: "config/medicalExportTask/importExcel",
       },
        /* 排序参数 */
        isorter: {
          column: 'createTime,fileName',
          order: 'desc,desc'
        },
    }
  },
    methods: {
      /* 文件下载 */
      uploadFile(record){
        let {dataSource, filePath} = record
        let host = dataSource && dataSource.length > 0? this.$config[dataSource].suncare_v3 : this.$config['domianURL']
        window.open(host + "/sys/common/download/" + filePath);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
