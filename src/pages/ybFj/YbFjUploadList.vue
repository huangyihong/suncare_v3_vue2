<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="10" :sm="10">
            <a-form-item label="医疗机构名称">
              <j-input placeholder="请输入医疗机构名称模糊查询" v-model="queryParam.orgName" ></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增文档生成任务</a-button>
      <a-button @click="batchDownload" type="primary"  icon="download" class="m-l-6">批量下载</a-button>
      <a-button @click="batchDel"  v-if="selectedRowKeys.length>0" type="primary" icon="delete">批量删除</a-button>
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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="taskStatus" slot-scope="text, record, index">
          <span v-if="text=='0'"><a-badge status="default"/> 未映射</span>
          <span v-else-if="text=='1'"><a-badge status="processing"/> 识别中</span>
          <span v-else-if="text=='2'"><a-badge status="success" /> 完成</span>
          <span v-else-if="text=='3'"><a-badge status="warning"/> 失败</span>
          <span v-else><a-badge status="default"/> 等待识别</span>
        </span>

        <span slot="action" slot-scope="text, record">
          <a  @click="handleEdit(record)">重新生成文档</a>
          <a-divider type="vertical"/>
          <a @click="toShowResultList(record)">下载结果文档</a>
       </span>

        <span slot="templateCodes" slot-scope="text, record">
          <template v-for="(item,index) in record.templateCodes.split(',')">
            <span v-if="index>0">, </span><a @click="downloadFile(record,item)">{{text.split(',')[index]}}</a>
          </template>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->


    <!--文件上传对话框-->
    <yb-fj-upload-modal ref="modalForm" @ok="modalFormOk"></yb-fj-upload-modal>

    <!-- 下载结果文件列表 -->
    <yb-fj-upload-result-modal  ref="resultListModal"></yb-fj-upload-result-modal>

  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import Breadcrumb from '@/components/Breadcrumb'
import YbFjUploadModal from './modules/YbFjUploadModal'
import YbFjUploadResultModal from './modules/YbFjUploadResultModal'

export default {
  name: "YbFjUploadList",
  mixins: [JeecgListMixin],
  components: {
    Breadcrumb,
    MDictSelectTag,
    YbFjUploadModal,
    YbFjUploadResultModal
  },
  data() {
    return {
      description: '飞检项目上传记录',
      // 表头
      columns: [
        {
          title: '医疗机构名称',
          align: "left",
          dataIndex: 'orgName',
          width: '200px'
        },
        {
          title: '导入数据模板类型',
          align: "left",
          dataIndex: 'templateImportId_dictText',
          width: '200px'
        },
        {
          title: '生成的文档类型',
          align: "left",
          dataIndex: 'templateCodes_dictText',
          width: '300px',
          scopedSlots: { customRender: 'templateCodes' }
        },
        {
          title: '备注',
          align: "left",
          dataIndex: 'remark',
          width: '200px'
        },

        {
          title: '上传人',
          align: "left",
          dataIndex: 'createUsername',
          width: '200px'
        },
        {
          title: '上传时间',
          align: "left",
          dataIndex: 'createTime',
          width: '200px'
        },
        {
          title: '任务状态',
          align:"center",
          dataIndex: 'taskStatus',
          width: 100,
          scopedSlots: { customRender: 'taskStatus' }
        },
        {
          title: '任务结果说明',
          align:"center",
          dataIndex: 'taskDesc',
          width: 200,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '300px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      url: {
        list: "/ybFj/ybFjUpload/list",
        delete: '/ybFj/ybFjUpload/delete',
        deleteBatch: '/ybFj/ybFjUpload/deleteBatch',
        resultList: "/ybFj/ybFjUploadResult/list",
        downloadZip: "/ybFj/ybFjUpload/downloadZip",
      },
    }
  },
  computed: {

  },
  beforeMount () {

  },
  methods: {
    //单个文件下载
    downloadFile(record,templateCode){
      getAction(this.url.resultList, {templateCode,uploadId:record.id}).then((res) => {
        if (res.success) {
          if(res.result.records.length==1){
            window.open(this.$config['domianURL'] + "/sys/common/download/" + res.result.records[0].filePath);
          }else{
            this.downloadZip(record.id,templateCode);
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    //批量文件下载
    downloadZip(ids,templateCode){
      this.loading = true
      getAction(this.url.downloadZip, {ids,templateCode}).then((res) => {
        if (res.success) {
          window.open(this.$config['domianURL'] + "/sys/common/download/" + res.result);
        }else{
          this.$message.warning(res.message);
        }
        this.loading = false
      })
    },

    batchDownload: function() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        let ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        const that = this
        this.$confirm({
          title: '确认批量下载',
          content: '是否批量下载选中数据生成的结果文件?',
          onOk: function() {
            that.downloadZip(ids)
          }
        })
      }
    },

    toShowResultList(record){
      this.$refs.resultListModal.show(record)
    },


  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
