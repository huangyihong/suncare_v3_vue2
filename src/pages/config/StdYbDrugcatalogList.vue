<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="医保药品代码">
              <j-input placeholder="请输入医保药品代码模糊查询" v-model="queryParam.drugcodeYbregister"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="注册药品名称">
              <j-input placeholder="请输入注册药品名称模糊查询" v-model="queryParam.drugnameYbregister"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="药监药品本位码">
              <j-input placeholder="请输入药监药品本位码模糊查询" v-model="queryParam.drugcode869"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="药监药品名称">
              <j-input placeholder="请输入药监药品名称模糊查询" v-model="queryParam.drugname869"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="亚信药品名称">
                <j-input placeholder="请输入亚信药品名称模糊查询" v-model="queryParam.drugname"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="医保药品名称(原始)">
                <j-input placeholder="请输入医保药品名称(原始)模糊查询" v-model="queryParam.drugnameSrc"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="亚信药品编码">
                <j-input placeholder="请输入亚信药品编码模糊查询" v-model="queryParam.drugcode"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="医保目录编码">
                <j-input placeholder="请输入医保目录编码模糊查询" v-model="queryParam.drugcodeSrc"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="适用地名称">
                <j-input placeholder="请输入适用地名称模糊查询" v-model="queryParam.projectArea"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="医保目录版本">
                <j-input placeholder="请输入医保目录版本模糊查询" v-model="queryParam.fileName"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="操作类型">
                <a-select placeholder="选择操作类型" v-model="queryParam2.actionType">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="add">创建</a-select-option>
                  <a-select-option value="edit">修改</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="操作时间">
                <a-date-picker placeholder="" v-model="queryParam2.startTime" class="search-divider-item"></a-date-picker>
                <div  class="search-divider">~</div>
                <a-date-picker placeholder="" v-model="queryParam2.endTime" class="search-divider-item"></a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="操作人">
                <j-input placeholder="请输入操作人模糊查询" v-model="queryParam2.actionUser"></j-input>
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
    <div class="table-operator" v-if="!isSelect">
      <a-button @click="handleAdd" v-has="'basicDataManage:add'" type="primary" icon="plus">新增</a-button>
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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">



        <span slot="action" slot-scope="text, record">
            <a @click="handleDetail(record)">查看</a>
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
    <StdYbDrugcatalogModal ref="modalForm" @ok="modalFormOk"></StdYbDrugcatalogModal>

    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </a-card>
</template>

<script>
import StdYbDrugcatalogModal from './modules/StdYbDrugcatalogModal.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ImportModal from '@/components/ImportModal'
import moment from "moment"
import { getAction } from '@/api/manage'

export default {
  name: "StdYbDrugcatalogList",
  mixins: [JeecgListMixin],
  components: {
    StdYbDrugcatalogModal,
    ImportModal,
    moment
  },
  data() {
    return {
      description: '药品医保目录管理页面',
      // 表头
      columns: [
        {
          title: '医保药品代码',
          dataIndex: 'drugcodeYbregister',
          width:150,
          align:"center",
        },
        {
          title: '注册药品名称',
          dataIndex: 'drugnameYbregister',
          width:200,
          align:"center",
        },
        {
          title: '药监药品本位码',
          dataIndex: 'drugcode869',
          width:150,
          align:"left",
        },
        {
          title: '药监药品名称',
          dataIndex: 'drugname869',
          width:200,
          align:"center",
        },
        {
          title: '亚信药品编码',
          dataIndex: 'drugcode',
          width:150,
          align:"left",
        },
        {
          title: '亚信药品名称',
          dataIndex: 'drugname',
          width:200,
          align:"center",
        },

        {
          title: '医保目录编码',
          dataIndex: 'drugcodeSrc',
          width:150,
          align:"left",
        },
        {
          title: '医保药品名称(原始)',
          dataIndex: 'drugnameSrc',
          width:200,
          align:"center",
        },
        {
          title: '剂型名称(原始)',
          dataIndex: 'dosageNameSrc',
          width:200,
          align:"center",
        },
        {
          title: '适用地名称',
          dataIndex: 'projectArea',
          width:200,
          align:"center",
        },
        {
          title: '有效开始时间',
          dataIndex: 'startdate',
          width:150,
          align:"left",
        },
        {
          title: '有效截止时间',
          dataIndex: 'enddate',
          width:150,
          align:"left",
        },
        {
          title: '医保目录版本',
          dataIndex: 'fileName',
          width:200,
          align:"center",
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
        {
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
      url: {
        list: "/config/stdYbDrugcatalog/list",
        delete: "/config/stdYbDrugcatalog/delete",
        deleteBatch: "/config/stdYbDrugcatalog/deleteBatch",
        exportXlsUrl: "config/stdYbDrugcatalog/exportXls",
        importExcelUrl: "config/stdYbDrugcatalog/importExcel",
        exportExcel: "/config/stdYbDrugcatalog/exportExcel",
      },
      isorter: {
        column: 'updateTime',
        order: 'desc'
      },
      queryParam2: {},
      tableName:'STD_YB_DRUGCATALOG',
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    searchReset() {
      this.queryParam = {}
      this.queryParam2 = {}
      this.loadData(1);
    },
    searchQuery(){
      delete this.queryParam.createStaffName
      delete this.queryParam.updateStaffName
      delete this.queryParam.createTime_begin
      delete this.queryParam.createTime_end
      delete this.queryParam.updateTime_begin
      delete this.queryParam.updateTime_end
      delete this.queryParam.createStaffName1
      delete this.queryParam.createTime1
      delete this.queryParam.createTime2
      if(this.queryParam2.actionType=='edit'){
        this.queryParam.updateStaffName=this.queryParam2.actionUser
        this.queryParam.updateTime_begin = this.formateDate(this.queryParam2.startTime)
        this.queryParam.updateTime_end = this.formateDate(this.queryParam2.endTime)
      }else if(this.queryParam2.actionType=='add'){
        this.queryParam.createStaffName=this.queryParam2.actionUser
        this.queryParam.createTime_begin = this.formateDate(this.queryParam2.startTime)
        this.queryParam.createTime_end = this.formateDate(this.queryParam2.endTime)
      }else{
        this.queryParam.createStaffName1=this.queryParam2.actionUser
        this.queryParam.createTime1 = this.formateDate(this.queryParam2.startTime)
        this.queryParam.createTime2 = this.formateDate(this.queryParam2.endTime)
      }
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
      this.handleExportFile('药品医保目录' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '药品医保目录导入',
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName: 'STD_YB_DRUGCATALOG.xlsx'
      }
      this.$refs.importModel.loadData(param);
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