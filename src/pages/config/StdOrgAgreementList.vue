<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="医疗机构编码">
              <j-input placeholder="请输入医疗机构编码" v-model="queryParam.orgid"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="医疗机构名称">
              <j-input placeholder="请输入医疗机构名称" v-model="queryParam.orgname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="医疗保险类别">
              <other-dict-select-tag  placeholder="请选择医疗保险类别" v-model="queryParam.surancetypecode"  dictEname="medinsuranceType"/>
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
      <a-button @click="handleAdd" v-has="'basicDataManage:add'" type="primary" icon="plus">新增</a-button>
      <a-button @click="handleCopyAdd" v-has="'basicDataManage:add'" type="primary" icon="copy">复制新增</a-button>
      <a-button @click="update()" v-has="'basicDataManage:edit'" type="primary" icon="edit">修改</a-button>
      <a-button @click="batchDel" v-has="'basicDataManage:del'" type="primary" icon="delete">删除</a-button>
      <a-button type="primary" icon="import" v-has="'basicDataManage:importAdd'" @click="handleImportExcel()">导入</a-button>
      <a-button type="primary" icon="download" v-has="'basicDataManage:export'" @click="handleExportExcel()">导出</a-button>
      <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportHive(tableName)">同步Hive</a-button>
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
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stdOrgAgreementModal ref="modalForm" @ok="modalFormOk"></stdOrgAgreementModal>

    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </a-card>
</template>

<script>
import StdOrgAgreementModal from './modules/StdOrgAgreementModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ImportModal from '@/components/ImportModal'
import moment from "moment"
import {getAction } from '@/api/manage'
import OtherDictSelectTag from "./modules/OtherDictSelectTag"

export default {
  name: "StdOrgAgreementList",
  mixins: [JeecgListMixin],
  components: {
    StdOrgAgreementModal,
    ImportModal,
    moment,
    OtherDictSelectTag
  },
  data() {
    return {
      description: '医疗机构医保协议相关参数管理页面',
      // 表头
      columns: [
        {
          title: '医院机构编码',
          width:150,
          align:"left",
          dataIndex: 'orgid'
        },
        {
          title: '医院机构名称',
          width:200,
          align:"left",
          dataIndex: 'orgname'
        },
        {
          title: '医疗保险类别代码',
          width:150,
          align:"left",
          dataIndex: 'surancetypecode'
        },
        {
          title: '医疗保险类别名称',
          width:150,
          align:"left",
          dataIndex: 'surancetypename'
        },
        {
          title: '均次住院天数',
          width:100,
          align:"left",
          dataIndex: 'pertimeZydays'
        },
        {
          title: '单病种结算率(%)',
          width:150,
          align:"left",
          dataIndex: 'drgsettleRatio'
        },
        {
          title: '均次住院费用',
          width:100,
          align:"left",
          dataIndex: 'zypertimeAmt'
        },
        {
          title: '床日费用',
          width:100,
          align:"left",
          dataIndex: 'zyDayavgAmt'
        },
        {
          title: '药费占住院费用比例(%)',
          width:150,
          align:"left",
          dataIndex: 'medFeeratio'
        },
        {
          title: '百人门诊住院率(%)',
          width:150,
          align:"left",
          dataIndex: 'outConvertInRatio'
        },
        {
          title: '实际报销比例(%)',
          width:150,
          align:"left",
          dataIndex: 'fundpayRatio'
        },
        {
          title: '适用开始时间',
          width:150,
          align:"left",
          dataIndex: 'startdate'
        },
        {
          title: '适用截止时间',
          width:150,
          align:"left",
          dataIndex: 'enddate'
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
        }
      ],
      url: {
        list: "/config/stdOrgAgreement/list",
        delete: "/config/stdOrgAgreement/delete",
        deleteBatch: "/config/stdOrgAgreement/deleteBatch",
        exportXlsUrl: "config/stdOrgAgreement/exportXls",
        importExcelUrl: "config/stdOrgAgreement/importExcel",
        exportExcel: "/config/stdOrgAgreement/exportExcel",
      },
      tableName:'STD_ORG_AGREEMENT',
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
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
      this.handleExportFile('医疗机构医保协议相关参数' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '医疗机构医保协议相关参数导入',
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName: 'STD_ORG_AGREEMENT.xls'
      }
      this.$refs.importModel.loadData(param);
    },
    //同步到Hive
    dataimportHive(tableName){
      let params = {tableName: tableName}
      this.loading = true
      getAction(this.$suncare_v3+"/config/medicalHive/updateStdToHiveConfig", params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
        }else{
          this.$message.warning(res.message);
        }
      }).catch(e => {
        this.$message.error(e.message);
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>