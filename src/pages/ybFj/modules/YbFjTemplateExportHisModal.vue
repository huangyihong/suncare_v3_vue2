<template>
  <m-modal centered
           :title="title"
           width="80%"
           :visible="visible"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="10" :sm="10">
            <a-form-item label="文档模板ID">
              <a-input placeholder="请输入模板ID查询" v-model="queryParam.templateCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator"></div>

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
        v-bind="tableAttrs"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="uploadFile(record.templatePath)" v-if="record.templatePath">下载该版本模板文件</a>
       </span>

      </a-table>
    </div>
  </m-modal>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction} from '@/api/manage'

  export default {
    name: "YbFjTemplateExportHisModal",
    mixins: [JeecgListMixin],
    components: {
    },
    data () {
      return {
        title:"查看文档生成模板历史版本",
        visible: false,
        // 表头
        columns: [
          {
            title: '文档模板ID',
            align: "left",
            dataIndex: 'templateCode',
            width: '100px'
          },
          {
            title: '文档生成模板名称',
            align: "left",
            dataIndex: 'templateName',
            width: '200px'
          },
          {
            title: '调用python编码(名称)',
            align: "left",
            dataIndex: 'pythonProcCode',
            width: '170px',
            customRender: (text, record, index) => {
              return `${text}(${record.pythonProcCode_dictText})`
            }
          },
          {
            title: '模板历史版本号',
            align: "left",
            dataIndex: 'versionNum',
            width: '150px',
            customRender: function(text) {
              if(!text){return ''}
              let t= text.toString()
              if(t.indexOf('.') == -1){
                return `V${t}.00`
              }else{
                return `V${t}`
              }
            }
          },
          {
            title: '模板创建者',
            align: "left",
            dataIndex: 'createUsername',
            width: '100px'
          },
          {
            title: '模板创建时间',
            align: "left",
            dataIndex: 'createTime',
            width: '160px'
          },
          {
            title: '模板最后修改人',
            align: "left",
            dataIndex: 'updateUsername',
            width: '130px'
          },
          {
            title: '模板最后修改时间',
            align: "left",
            dataIndex: 'updateTime',
            width: '160px'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: '150px',
            scopedSlots: {customRender: 'action'}
          }
        ],
        url: {
          list: "/ybFj/ybFjTemplateExport/list",
        },
        fixedParam:{
          useStatus:'0',
        },
        isorter: {
          column: 'updateTime',
          order: 'desc'
        },
        initLoad:false,
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
        this.queryParam.templateCode = record.templateCode
        this.loadData(1);
        this.visible = true;
      },
      /* 模板下载 */
      uploadFile(templatePath){
        window.open(this.$config['domianURL'] + "/sys/common/download/" + templatePath);
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
