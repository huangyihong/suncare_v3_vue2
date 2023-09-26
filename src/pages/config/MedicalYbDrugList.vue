<template>
  <a-card :bordered="false">
    <resize-division :px="true" :offset="300" :limit="200">
      <div slot="left" style="overflow: auto">
        <div class="icons-list" >
          <a-icon type="edit"  theme="twoTone"  @click="openOtherDictTab('ybdrug_category')"  style="float:right;margin-right: 20px;fontSize:18px;"/>
        </div>
        <other-dict-tree @selectNode="searchData" @selectNodeInfo="selectNodeInfo" dictEname="ybdrug_category" :showCode="true"></other-dict-tree>
      </div>
      <template  slot="right">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQueryFn">
            <a-row :gutter="24">
              <a-col :md="8" :sm="12">
                <a-form-item label="药品编码">
                  <j-input placeholder="输入药品编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="12">
                <a-form-item label="药品名称">
                  <j-input placeholder="输入药品名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"/>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="12">
                  <a-form-item label="父级编码">
                    <j-input placeholder="输入父级编码模糊查询" v-model="queryParam.parentCode"/>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="父级名称">
                    <j-input placeholder="输入父级名称模糊查询" v-model="queryParam.parentName"/>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="剂型">
                    <other-dict-select-tag  placeholder="请选择剂型" v-model="queryParam.dosageCode"  dictEname="DosageForm"/>
                  </a-form-item>
                </a-col>


              </template>

              <a-col :md="8" :sm="12" >
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
          <a-button @click="handleAddFn" v-has="'basicDataManage:add'" type="primary" icon="plus">新增</a-button>
          <a-button @click="update()" v-has="'basicDataManage:edit'" type="primary" icon="edit">修改</a-button>
          <a-button @click="batchDel" v-has="'basicDataManage:del'" type="primary" icon="delete">删除</a-button>
          <a-button type="primary" icon="import" v-has="'basicDataManage:importAdd'" @click="handleImportExcel()">导入</a-button>
          <a-button type="primary" icon="download" v-has="'basicDataManage:export'" @click="handleExportExcel()">导出</a-button>
          <!--<a-button type="primary" @click="dataimportHive(tableName)">同步Hive</a-button>-->
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
            @change="handleTableChange"
            v-bind="tableAttrs">

            <span slot="action" slot-scope="text, record">
            <a @click="handleDetail(record)">查看</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'basicDataManage:del'">
              <a>删除</a>
            </a-popconfirm>
            </span>

          </a-table>
        </div>
        <!-- table区域-end -->
      </template>
    </resize-division>

    <!-- 表单区域 -->
    <medical-yb-drug-modal ref="modalForm" @ok="modalFormOk"></medical-yb-drug-modal>
    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ImportModal from '@/components/ImportModal'
import moment from "moment"
import { getAction } from '@/api/manage'
import {putAction } from '@/api/manage'

import JDictSelectTag from '@/components/dict/JDictSelectTag'
import OtherDictTree from './modules/OtherDictTree.vue'
import ResizeDivision from '@//components/ResizeDivision'
import MedicalYbDrugModal from './modules/MedicalYbDrugModal.vue'
import OtherDictSelectTag from "./modules/OtherDictSelectTag"

export default {
  name: "MedicalYbDrugList",
  mixins:[JeecgListMixin],
  components: {
    ImportModal,
    moment,
    JDictSelectTag,
    OtherDictTree,
    ResizeDivision,
    MedicalYbDrugModal,
    OtherDictSelectTag
  },
  data () {
    return {
      description: '重复用药管理页面',
      // 表头
      columns: [
        {
          title: '药品编码',
          width:180,
          align:"left",
          dataIndex: 'code',
          fixed: 'left',
        },
        {
          title: '药品名称',
          width:200,
          align:"left",
          dataIndex: 'name',
          fixed: 'left',
        },
        {
          title: '父级编码',
          width:150,
          align:"left",
          dataIndex: 'parentCode',
        },
        {
          title: '父级名称',
          width:200,
          align:"left",
          dataIndex: 'parentName',
        },
        {
          title: '剂型',
          width:150,
          align:"center",
          dataIndex: 'dosage'
        },
        {
          title: '所属类别',
          width:150,
          align:"center",
          dataIndex: 'tableType'
        },
        {
          title: '描述',
          width:200,
          align:"center",
          dataIndex: 'remark',
          ellipsis: true,
        },
        {
          title: '创建人',
          align: "center",
          dataIndex: 'createStaffName',
          width: 150,
        },
        {
          title: '创建时间',
          align: "center",
          dataIndex: 'createTime',
          width: 180,
        },
        /*{
          title: '修改人',
          align: "center",
          dataIndex: 'updateStaffName',
          width: 150,
        },
        {
          title: '修改时间',
          align: "center",
          dataIndex: 'updateTime',
          width: 180,
        },*/
        {
          title: '操作',
          dataIndex: 'action',
          align:"center",
          fixed: 'right',
          width:200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      isorter: {
        column: 'parentCode,isOrder',
        order: 'asc,asc',
      },
      url: {
        list: "/config/medicalYbDrug/list",
        delete: "/config/medicalYbDrug/delete",
        deleteBatch: "/config/medicalYbDrug/deleteBatch",
        exportXlsUrl: "config/medicalYbDrug/exportXls",
        importExcelUrl: "config/medicalYbDrug/importExcel",
        exportExcel: "/config/medicalYbDrug/exportExcel",
      },
      tableName: 'MEDICAL_YB_DRUG',
      parentCode:'',
      parentName:'',
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  beforeMount(){

  },
  methods: {
    //左侧树点击查询
    searchData(parentCode){
      this.parentCode = parentCode
      this.queryParam.parentCode_1 = parentCode;
      this.searchQuery();
    },
    selectNodeInfo(treeNode){
      this.parentName = treeNode.data.props.dataRef.title.replace('('+treeNode.data.props.dataRef.key+')','')
    },
    handleAddFn(){
      let record = {};
      record.fntype='add';
      record.parentCode = this.parentCode;
      record.parentName = this.parentName;
      this.handleEdit(record);
    },
    //修改
    update() {
      if (this.selectionRows.length !== 1) {
        this.$message.error("请选择1条记录!")
      } else {
        let data = this.selectionRows
        this.$refs.modalForm.visible = false
        this.handleEdit(data[0])
      }
    },

    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.url.exportXlsUrl=this.url.exportExcel
      this.handleExportFile('重复用药' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '重复用药导入',
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName: 'MEDICAL_YB_DRUG.xlsx'
      }
      this.$refs.importModel.loadData(param);
    },
    //打开其他字典
    openOtherDictTab(dictEname){
      this.$util.openTab('/config/MedicalOtherDictList?dictEname='+dictEname)
    },

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>