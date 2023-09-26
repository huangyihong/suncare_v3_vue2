<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="10" :sm="10">
            <a-form-item label="任务名称">
              <j-input placeholder="请输入任务名称" v-model="queryParam.taskName"></j-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增OCR识别任务</a-button>
      <a-button @click="batchDownload" type="primary" icon="download" class="m-l-6">批量下载</a-button>
      <a-button @click="batchDel" v-if="selectedRowKeys.length>0" type="primary" icon="delete">批量删除</a-button>
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
        v-bind="tableAttrs"
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        @change="handleTableChange">

         <span slot="taskStatus" slot-scope="text, record, index">
          <span v-if="text=='0'"><a-badge status="default"/> 未映射</span>
          <span v-else-if="text=='1'"><a-badge status="processing"/> 识别中</span>
          <span v-else-if="text=='2'"><a-badge status="success"/> 完成</span>
          <span v-else-if="text=='3'"><a-badge status="warning"/> 失败</span>
          <span v-else><a-badge status="default"/> 等待识别</span>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">重新生成文档</a>
          <a-divider type="vertical" v-if="record.taskStatus == 2 && record.exportPath != '' "/>
          <a @click="downloadFile(record.exportPath,record.exportName)" v-if="record.taskStatus == 2 && record.exportPath != '' ">下载结果文档</a>
       </span>

        <span slot="exportName" slot-scope="text, record">
          <a @click="downloadFile(record.exportPath,record.exportName)" >{{record.exportName}}</a>
        </span>

        <span slot="fileName" slot-scope="text, record">
          <a @click="downloadFile(record.filePath,record.fileName)" v-if="record.fileName.indexOf('.pdf') != -1">{{record.fileName}}</a>
          <a @click="imageView(record.filePath)" v-else>{{record.fileName}}</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <ybFjOcr-modal ref="modalForm" @ok="modalFormOk"></ybFjOcr-modal>

    <a-modal :visible="previewVisible" :width="900" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-card>
</template>

<script>
import YbFjOcrModal from './modules/YbFjOcrModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction} from '@/api/manage'
import { downFile } from '@/api/manage'
export default {
  name: "YbFjOcrList",
  mixins: [JeecgListMixin],
  components: {
    YbFjOcrModal
  },
  data() {
    return {
      description: 'OCR识别工具管理页面',
      previewVisible:false,
      previewImage:false,
      // 表头
      columns: [
        // {
        //   title: '序号',
        //   dataIndex: '',
        //   key: 'rowIndex',
        //   width: 60,
        //   align: "center",
        //   customRender: function (t, r, index) {
        //     return parseInt(index) + 1;
        //   }
        // },
        {
          title: '任务名称',
          align: "center",
          dataIndex: 'taskName',
          width: '200px'
        },
        {
          title: '源图片',
          align: "center",
          dataIndex: 'fileName',
          width: '200px',
          scopedSlots: {customRender: 'fileName'}
        },
        {
          title: '生成的结果文档',
          align: "center",
          dataIndex: 'exportName',
          width: '200px',
          scopedSlots: {customRender: 'exportName'}
        },
        {
          title: '生成的文档类型',
          align: "center",
          dataIndex: 'exportType_dictText',
          width: '200px'
        },
        {
          title: '备注',
          align: "center",
          dataIndex: 'remark',
          width: '200px'
        },
        {
          title: '上传人',
          align: "center",
          dataIndex: 'createUsername',
          width: '200px'
        },
        {
          title: '上传时间',
          align: "center",
          dataIndex: 'createTime',
          width: '200px'
        },
        {
          title: '任务状态',
          align: "center",
          dataIndex: 'taskStatus',
          width: 100,
          scopedSlots: {customRender: 'taskStatus'}
        },
        {
          title: '任务结果说明',
          align: "center",
          dataIndex: 'taskDesc',
          width: '200px'
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
        list: "/ybFj/ybFjOcr/list",
        delete: "/ybFj/ybFjOcr/delete",
        deleteBatch: "/ybFj/ybFjOcr/deleteBatch",
        exportXlsUrl: "ybFj/ybFjOcr/exportXls",
        importExcelUrl: "ybFj/ybFjOcr/importExcel",
        downloadZip: "/ybFj/ybFjOcr/downloadZip",
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    //单个文件下载
    downloadFile(filePath,fileName){
      if(filePath){
        // fileName = fileName.substring(0,fileName.indexOf("."))
        let url = "/sys/common/download/" + filePath
        downFile(url, {}, 'get').then((data) => {
          if (!data) {
            this.$message.warning('下载失败')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('下载成功')
        }).catch(e => {
          this.$message.error(e.message)
        })
      }

    },
    /** 预览图片地址 */
    imageView(filePath){

      this.previewImage = this.$config['domianURL'] + "/sys/common/download/" + filePath
      this.previewVisible = true
    },
    batchDownload: function () {
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
          onOk: function () {
            that.downloadZip(ids)
          }
        })
      }
    },
    handleCancel() {
      this.previewVisible = false
      this.previewImage = false
    },
    //批量文件下载
    downloadZip(ids) {
      this.loading = true
      getAction(this.url.downloadZip, {ids: ids}).then((res) => {
        if (res.success) {
          window.open(this.$config['domianURL'] + "/sys/common/download/" + res.result);
        } else {
          this.$message.warning(res.message);
        }
        this.loading = false
      })
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
