<template>
  <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" :bordered="false" class="m-b-6">
    <breadcrumb :parent="{path:'/drg/DrgCatalogList/'+catalogType}" :info="titleBean.title" style="margin-bottom: 4px" v-if="$route.query.catalogId"></breadcrumb>

    <a-layout>
      <a-layout-sider v-show="titleBean.showTree" collapsedWidth="0" collapsible :trigger="null" v-model="sideCollapsed"  width="225" :style="{ overflow: 'auto', height: '100vh',  background: 'white' }" >
        <div>
          <div class="icons-list" >
            <a-icon type="edit"  theme="twoTone" style="float:right;margin-right: 20px;fontSize:18px;"/>
          </div>
          <catalog-tree :mdcCatalogV="$route.query.mdcCatalogV" :adrgCatalogV="$route.query.adrgCatalogV" @selectNodeInfo="selectNodeInfo" showCode></catalog-tree>
        </div>
      </a-layout-sider>
      <a-layout-content style="padding: 0 20px 20px 20px;background: #fff;border: 5px;" :style="{ borderLeftStyle: titleBean.showTree?'outset':''}">
        <div class="icons-list" v-if="titleBean.showTree">
          <a-icon :type="sideCollapsed?'menu-unfold':'menu-fold'" @click="sideCollapse"></a-icon>
        </div>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <template v-if="catalogType=='ADRG_LIST_V'">
                <a-col :md="6" :sm="8">
                  <a-form-item :label="`疾病编码1`">
                    <j-input placeholder="请输入疾病编码1模糊查询" v-model="queryParam.diagCode1"></j-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item :label="`疾病名称1`">
                    <j-input placeholder="请输入疾病名称1模糊查询" v-model="queryParam.diagName1"></j-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item :label="`疾病编码2`">
                    <j-input placeholder="请输入疾病编码2模糊查询" v-model="queryParam.diagCode2"></j-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item :label="`疾病名称2`">
                    <j-input placeholder="请输入疾病名称2模糊查询" v-model="queryParam.diagName2"></j-input>
                  </a-form-item>
                </a-col>
              </template>
              <template v-else>
                <a-col :md="6" :sm="8">
                  <a-form-item :label="`${titleBean.codeNameTitle}编号`">
                    <j-input placeholder="请输入编号模糊查询" v-model="queryParam.code"></j-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item :label="`${titleBean.codeNameTitle}名称`">
                    <j-input placeholder="请输入名称模糊查询" v-model="queryParam.name"></j-input>
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="catalogType=='ADRG_V'||catalogType=='DRG_V'">
                <a-col :md="6" :sm="8">
                  <a-form-item label="分组条件限制">
                    <m-dict-select-tag placeholder="请选择分组条件限制" dictCode="HAVINGORNO"
                                       v-model="queryParam.hasCondition"></m-dict-select-tag>
                  </a-form-item>
                </a-col>
              </template>
              <a-col :md="6" :sm="8">
                <a-form-item label="审核状态">
                  <m-dict-select-tag placeholder="请选择审核状态" dictCode="EXAMINE_STATUS"
                                     v-model="queryParam.examineStatus"></m-dict-select-tag>
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
          <a-button @click="handleEditFn({catalogId:$route.query.catalogId||''})" type="primary" icon="plus">新增</a-button>
          <a-button type="primary" icon="import" @click="handleImportExcel()">excel批量导入</a-button>
          <a-button @click="batchDel"  v-if="selectedRowKeys.length>0" type="primary" icon="delete">批量删除</a-button>
          <a-button type="primary" @click="handleExportExcel" icon="download" class="m-l-6">导出</a-button>
          <a-button @click="getExamine"  type="primary" icon="bulb">批量审核</a-button>
          <a-popconfirm title="确定要一键删除当前目录下的所有数据吗?" @confirm="deleteByCatalogId()">
            <a-button type="primary" icon="delete" v-if="$route.query.catalogId">一键删除</a-button>
          </a-popconfirm>

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
            <span slot="action" slot-scope="text, record">
              <a  @click="handleEditFn(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定删除当前信息吗?" @confirm="() => handleDelete(record.id)">
                <a size="small">删除</a>
              </a-popconfirm>
            </span>


          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>


    <!-- 表单区域 -->
    <drg-catalog-detail-modal  ref="modalForm" @ok="modalFormOk"></drg-catalog-detail-modal>

    <!--    批量审核确认框-->
    <examine-model ref="examineModel" :num="selectionRows.length" @ok="batchExamine"></examine-model>

    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>

  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {catalogDetailConfig} from './mixins/catalogDetailConfig'
import {httpAction, getAction, putAction,deleteAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import DrgCatalogDetailModal from './modules/DrgCatalogDetailModal'
import Breadcrumb from '@/components/Breadcrumb'
import CatalogTree from './plugin/CatalogTree'
import moment from "moment"
import ImportModal from '@/components/ImportModal'

import ExamineModel from './modules/ExamineModel'

export default {
  name: "DrgCatalogList",
  mixins: [JeecgListMixin,catalogDetailConfig],
  components: {
    MDictSelectTag,
    DrgCatalogDetailModal,
    Breadcrumb,
    CatalogTree,
    ExamineModel,
    ImportModal
  },
  data() {
    return {
      description: 'DRG分组目录详情表',
      // 表头
      leftcolumns:[{
        title: '编码',
        align: "left",
        dataIndex: 'code',
        width: '200px'
      },
        {
          title: '名称',
          align: "left",
          dataIndex: 'name',
          width: '300px'
        },],
      rightcolumns:[{
        title: '审核状态',
        align: "left",
        dataIndex: 'examineStatus_dictText',
        width: '100px'
      },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '120px',
          scopedSlots: {customRender: 'action'}
        }],
      columns: [],
      url: {
        list: "/drg/drgCatalogDetail/list",
        delete: '/drg/drgCatalogDetail/delete',
        deleteBatch: '/drg/drgCatalogDetail/deleteBatch',
        edit: "/drg/drgCatalogDetail/edit",
        exportXlsUrl: "/drg/drgCatalogDetail/exportXls",
        importExcelUrl: "/drg/drgCatalogDetail/importExcel",
        batchExamine: "/drg/drgCatalogDetail/batchExamine",
        deleteByCatalogId: "/drg/drgCatalogDetail/deleteByCatalogId",
      },
      initLoad:false,
      catalogType:'MDC_V',
      titleBean:{},
      sideCollapsed: false,
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  beforeMount() {
    this.fixedParam.catalogId = this.$route.query.catalogId
    this.catalogType = this.$route.query.catalogType
    if(!this.catalogType){
      let pathStrArr = this.$route.path.split('/')
      this.catalogType = pathStrArr[pathStrArr.length-1]
    }
    this.fixedParam.catalogType = this.catalogType
    this.titleBean = this.detailTitleMap[this.catalogType]
    this.leftcolumns = this.detailListMap[this.catalogType]
    if(!this.leftcolumns||this.leftcolumns.length==0){
      this.leftcolumns = [{
        title: this.titleBean.codeNameTitle+'编码',
        align: "left",
        dataIndex: 'code',
        width: '200px'
      },{
        title: this.titleBean.codeNameTitle+'名称',
        align: "left",
        dataIndex: 'name',
        width: '300px'
      },]
    }
    this.columns = [...this.leftcolumns,...this.rightcolumns]
    this.loadData(1)

  },

  methods: {
    sideCollapse() {
      this.sideCollapsed = !this.sideCollapsed
    },
    handleEditFn(record){
      this.$refs.modalForm.titleBean = this.titleBean
      if(!record.id){
        record.mdcCatalogCode = this.queryParam.mdcCatalogCode
        record.adrgCatalogCode = this.queryParam.adrgCatalogCode
        record.catalogType = this.catalogType
      }
      this.handleEdit(record)
    },
    selectNodeInfo(treeNode){
      let nodeData = treeNode.data.props.dataRef
      if(nodeData.parent){//第二层级
        this.queryParam.mdcCatalogCode = nodeData.parent;
        this.queryParam.adrgCatalogCode = nodeData.key;
      }else{
        if(nodeData.key){
          this.queryParam.mdcCatalogCode = nodeData.key;
        }else{
          delete this.queryParam.mdcCatalogCode
        }
        delete this.queryParam.adrgCatalogCode
      }
      this.searchQuery();
    },
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.handleExportFile(this.titleBean.title+'目录详细'+ moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: `${this.titleBean.title}目录导入`,
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName:`${this.titleBean.title}目录导入模板.xlsx`,
        templateUrl:'drg/drgCatalogDetail/importTemplate?catalogType='+this.catalogType,
        param:{catalogType:this.catalogType,catalogId:this.$route.query.catalogId||''},
      }
      this.$refs.importModel.loadData(param);
    },
    getExamine() {
      this.$refs.examineModel.show()
    },
    batchExamine(examineStatus,assignType) {
      this.loading=true
      let params = {}
      let ids = ''
      if(assignType=='SELECT'){
        for (var a = 0; a < this.selectionRows.length; a++) {
          ids += this.selectionRows[a].id + ','
        }
      }else{
        params = this.getQueryParams()
      }
      params.ids = ids
      params.status = examineStatus
      getAction(this.url.batchExamine, params).then(res => {
        if(res.success){
          this.$message.success("审核成功!");
          this.onClearSelected()
          this.loadData()
        }else{
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.loading=false
      })
    },
    deleteByCatalogId(){
      this.loading = true
      deleteAction(this.url.deleteByCatalogId, { catalogId: this.$route.query.catalogId }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData(1)
        } else {
          this.loading = false
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
