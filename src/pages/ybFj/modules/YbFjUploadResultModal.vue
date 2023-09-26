<template>
  <m-modal centered
           :title="title"
           width="700px"
           :visible="visible"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">
    <!-- 查询区域 -->

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-bottom: 18px;">
      <a-button @click="selectDownload" type="primary" icon="select" class="m-l-6">选中下载</a-button>
      <a-button @click="batchDownload" type="primary"  icon="download" class="m-l-6">下载全部</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size11="small"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="uploadFile(record.filePath)" v-if="record.filePath">下载</a>
       </span>

        <span slot="taskStatus" slot-scope="text, record, index">
          <span v-if="text=='0'"><a-badge status="default"/> 未映射</span>
          <span v-else-if="text=='1'"><a-badge status="processing"/> 识别中</span>
          <span v-else-if="text=='2'"><a-badge status="success" /> 完成</span>
          <span v-else-if="text=='3'"><a-badge status="warning"/> 失败</span>
          <span v-else><a-badge status="default"/> 等待识别</span>
        </span>


      </a-table>
    </div>
  </m-modal>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction} from '@/api/manage'

  export default {
    name: "YbFjUploadResultModal",
    mixins: [JeecgListMixin],
    components: {
    },
    data () {
      return {
        title:"下载结果文档列表",
        visible: false,
        // 表头
        columns: [
          {
            title: '生成的结果文档类型',
            align: "left",
            dataIndex: 'templateCode_dictText',
            width: '200px'
          },
          {
            title: '生成的文件名称',
            align: "left",
            dataIndex: 'fileName',
            width: '300px'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: '100px',
            scopedSlots: {customRender: 'action'}
          }
        ],
        url: {
          list: "/ybFj/ybFjUploadResult/list",
          downloadZip: "/ybFj/ybFjUpload/downloadZip",
        },
        isorter: {
          column: 'exportType',
          order: 'desc'
        },
        initLoad:false,
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0,
          size:'small',
        },
      }
    },
    created () {
    },
    methods: {
      close() {
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },
      show(record){
        console.log(record)
        this.queryParam.uploadId = record.id
        this.loadData(1);
        this.visible = true;
      },
      /* 模板下载 */
      uploadFile(templatePath){
        window.open(this.$config['domianURL'] + "/sys/common/download/" + templatePath);
      },

      //选中下载
      selectDownload(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          let resultIds = ''
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            resultIds += this.selectedRowKeys[a] + ','
          }
          const that = this
          this.$confirm({
            title: '确认选中下载',
            content: '是否批量下载选中数据生成的结果文档?',
            onOk: function() {
              that.downloadZip( that.queryParam.uploadId,'',resultIds)
            }
          })
        }
      },

      //批量文件下载
      downloadZip(ids,templateCode,resultIds){
        this.loading = true
        getAction(this.url.downloadZip, {ids,templateCode,resultIds}).then((res) => {
          if (res.success) {
            window.open(this.$config['domianURL'] + "/sys/common/download/" + res.result);
          }else{
            this.$message.warning(res.message);
          }
          this.loading = false
        })
      },

      //下载全部
      batchDownload(){
        const that = this
        this.$confirm({
          title: '确认下载全部',
          content: '是否批量下载该任务生成的结果文档?',
          onOk: function() {
            that.downloadZip( that.queryParam.uploadId)
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped>

</style>
