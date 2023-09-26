<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="政策编号">
              <j-input placeholder="请输入政策编号模糊查询" v-model="queryParam.policyCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="政策名称">
              <j-input placeholder="请输入政策名称模糊查询" v-model="queryParam.policyName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="附件文件内容">
              <j-input placeholder="请输入附件文件模糊查询" v-model="queryParam.fileContent"></j-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="附件名称">
                <j-input placeholder="请输入附件名称模糊查询" v-model="queryParam.filenames"></j-input>
              </a-form-item>
            </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="政策类型">
              <other-dict-select-tag  placeholder="请选择政策类型" v-model="queryParam.policyTypeCode"  dictEname="rule_sourcetype"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="文件用途分类">
              <other-dict-select-tag  placeholder="请选择政策类型" v-model="queryParam.policyServiceClassCode"  dictEname="service_class"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="发文机关">
              <j-input placeholder="请输入发文机关模糊查询" v-model="queryParam.issuingOffice"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="效力级别">
              <j-input placeholder="请输入效力级别模糊查询" v-model="queryParam.effectLevelName"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="适用地区">
              <j-input placeholder="请输入适用地区模糊查询" v-model="queryParam.applyArea"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="适用开始时间范围">
              <a-date-picker placeholder="" v-model="queryParam.effectStartdate_begin" class="search-divider-item"></a-date-picker>
              <div  class="search-divider">~</div>
              <a-date-picker placeholder="" v-model="queryParam.effectStartdate_end" class="search-divider-item"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="适用结束时间范围">
              <a-date-picker placeholder="" v-model="queryParam.effectEnddate_begin" class="search-divider-item"></a-date-picker>
              <div  class="search-divider">~</div>
              <a-date-picker placeholder="" v-model="queryParam.effectEnddate_end" class="search-divider-item"></a-date-picker>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="适用人群">
              <j-input placeholder="请输入适用人群模糊查询" v-model="queryParam.applyPeople"></j-input>
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
      <a-button @click="handleAdd" v-has="'basicDataManage:add'" type="primary" icon="plus">新增</a-button>
      <a-button @click="handleCopyAdd" v-has="'basicDataManage:add'" type="primary" icon="copy">复制新增</a-button>
      <a-button @click="update()" v-has="'basicDataManage:edit'" type="primary" icon="edit">修改</a-button>
      <a-button @click="batchDel" v-has="'basicDataManage:del'" type="primary" icon="delete">删除</a-button>
      <a-button type="primary" icon="import" v-has="'basicDataManage:importAdd'" @click="handleImportExcel()">导入</a-button>
      <a-button type="primary" icon="download" v-has="'basicDataManage:export'" @click="handleExportExcel()">导出</a-button>
      <a-button @click="handleImportFiles" v-has="'basicDataManage:importAdd'" type="primary" icon="import">批量导入附件</a-button>

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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
            <a @click="showPdfDetail(record)">查看</a>
            <a-divider type="vertical"/>
            <a @click="handleEdit(record)" v-has="'basicDataManage:edit'">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'basicDataManage:del'">
              <a>删除</a>
            </a-popconfirm>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <Medical-Policy-Modal ref="modalForm" @ok="modalFormOk"></Medical-Policy-Modal>
    <MedicalPolicyShowPdfModal ref="modalPdfForm" @ok="modalFormOk"></MedicalPolicyShowPdfModal>

    <!--导入-->
    <import-modal ref="importModel" @ok="modalFormOk"
                  tip="导入文件的政策编号必须有四个部分组成，中间用-分隔，如：SD-JN-0001-ZW"
    ></import-modal>

    <!--批量导入附件-->
    <import-multi-modal ref="importMultiModel"  @ok="modalFormOk"
                        tip="文件名需要以政策编号（如：SD-JN-0001-ZW）开头，政策编号后跟横杆再跟政策文件名称（如SD-JN-0001-ZW-城乡医保报销办法),导入成功后刷新列表查看结果"></import-multi-modal>

  </a-card>
</template>

<script>
import MedicalPolicyModal from './modules/MedicalPolicyModal'
import MedicalPolicyShowPdfModal from './modules/MedicalPolicyShowPdfModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ImportModal from '@/components/ImportModal'
import ImportMultiModal from '@/components/ImportMultiModal'
import moment from "moment"
import OtherDictSelectTag from "./modules/OtherDictSelectTag"

export default {
  name: "MedicalPolicyList",
  mixins: [JeecgListMixin],
  components: {
    MedicalPolicyModal,
    MedicalPolicyShowPdfModal,
    ImportModal,
    moment,
    OtherDictSelectTag,
    ImportMultiModal
  },
  data() {
    return {
      description: '政策法规管理页面',
      // 表头
      columns: [
        {
          title: '政策编号',
          width:150,
          align:"left",
          dataIndex: 'policyCode'
        },
        {
          title: '政策名称',
          width:150,
          align:"left",
          dataIndex: 'policyName'
        },
        {
          title: '政策类型',
          width:150,
          align:"left",
          dataIndex: 'policyTypeName'
        },
        {
          title: '政策用途分类',
          width:150,
          align:"left",
          dataIndex: 'policyServiceClassName'
        },
        {
          title: '效力级别',
          width:200,
          align:"left",
          dataIndex: 'effectLevelName'
        },
        {
          title: '政策文号',
          width:150,
          align:"left",
          dataIndex: 'policyDocNumber'
        },
        {
          title: '发文机关',
          width:100,
          align:"left",
          dataIndex: 'issuingOffice'
        },
        {
          title: '发文机关所属地区',
          width:100,
          align:"left",
          dataIndex: 'issuingOfficeArea'
        },
        {
          title: '发文时间',
          width:100,
          align:"left",
          dataIndex: 'issuingDate'
        },
        {
          title: '适用开始时间',
          width:150,
          align:"left",
          dataIndex: 'effectStartdate'
        },
        {
          title: '适用结束时间',
          width:150,
          align:"left",
          dataIndex: 'effectEnddate'
        },
        {
          title: '适用人群',
          width:100,
          align:"left",
          dataIndex: 'applyPeople'
        },
        {
          title: '适用地区',
          width:150,
          align:"left",
          dataIndex: 'applyArea'
        },
        {
          title: '相对应废止的政策文号',
          width:150,
          align:"left",
          dataIndex: 'policyDiscardDocNumber'
        },
        {
          title: '数据状态',
          width:150,
          align:"left",
          dataIndex: 'dataStatus'
        },
        {
          title: '创建人',
          align: "left",
          dataIndex: 'createUsername',
          width: 150,
        },
        {
          title: '创建时间',
          align: "left",
          dataIndex: 'createTime',
          width: 150,
        },
        {
          title: '修改人',
          align: "left",
          dataIndex: 'updateUsername',
          width: 150,
        },
        {
          title: '修改时间',
          align: "left",
          dataIndex: 'updateTime',
          width: 150,
        },
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
        column: 'policyCode',
        order: 'asc'
      },
      url: {
        list: "/config/medicalPolicy/list",
        delete: "/config/medicalPolicy/delete",
        deleteBatch: "/config/medicalPolicy/deleteBatch",
        exportXlsUrl: "/config/medicalPolicy/exportXls",
        importExcelUrl: "/config/medicalPolicy/importExcel",
        exportExcel: "/config/medicalPolicy/exportExcel",
        importFileUrl: "/config/medicalPolicy/importFiles",
      },
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    showPdfDetail: function(record) {
        this.$refs.modalPdfForm.showPdfDetail(record)
        this.$refs.modalPdfForm.title = '详情'
        this.$refs.modalPdfForm.disableSubmit = true
        this.$refs.modalPdfForm.readonly = true

    },
    searchQuery(){
      this.queryParam.startdate_end = this.formateDate(this.queryParam.startdate_end)
      this.queryParam.enddate_begin = this.formateDate(this.queryParam.enddate_begin)
      this.loadData(1);
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
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.url.exportXlsUrl=this.url.exportExcel
      this.handleExportFile('政策法规' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '政策法规导入',
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName: 'MEDICAL_POLICY.xlsx'
      }
      this.$refs.importModel.loadData(param);
    },
    // 批量导入附件
    handleImportFiles() {
      let param = {
        title: '政策法规附件批量导入',
        importUrl: this.url.importFileUrl,
        actionType: 'add',
      }
      this.$refs.importMultiModel.loadData(param);
    },
    //转换时间格式
    formateDate(datetime) {
      function addDateZero(num) {
        return (num < 10 ? "0" + num : num);
      }
      if(!datetime){
        return '';
      }
      let d = new Date(datetime);
      let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
      return formatdatetime;
    },
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>