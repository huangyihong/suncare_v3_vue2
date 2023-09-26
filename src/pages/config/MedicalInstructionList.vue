<template>
  <a-card :bordered="false" v-bind="isSelect?{bodyStyle:{padding: 0}}:{}">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item :label="labelName+'说明书编码'">
              <j-input placeholder="请输入说明书编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item :label="labelName+'说明书名称'">
              <j-input placeholder="请输入说明书名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="关联代码">
                <a-input placeholder="请输入关联代码精确查询" v-model="queryParam.itemCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="关联名称">
                <a-input placeholder="请输入关联名称精确查询" v-model="queryParam.itemValue"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="说明书修订日期">
                <a-date-picker placeholder="" v-model="queryParam.revisionDate_begin" class="search-divider-item"></a-date-picker>
                <div  class="search-divider">~</div>
                <a-date-picker placeholder="" v-model="queryParam.revisionDate_end" class="search-divider-item"></a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="操作类型">
                <a-select placeholder="选择操作类型" v-model="queryParam2.actionType">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="add">创建</a-select-option>
                  <a-select-option value="edit">修改</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="操作时间">
                <a-date-picker placeholder="" v-model="queryParam2.startTime" class="search-divider-item"></a-date-picker>
                <div  class="search-divider">~</div>
                <a-date-picker placeholder="" v-model="queryParam2.endTime" class="search-divider-item"></a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item label="操作人">
                <j-input placeholder="请输入操作人模糊查询" v-model="queryParam2.actionUser"></j-input>
              </a-form-item>
            </a-col>

          </template>
          <a-col :xl="6" :xs="searchItemSpan">
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
      <a-button type="primary" v-has="'basicDataManage:export'" icon="download" @click="handleExportExcel()">导出</a-button>
      <a-button type="primary" v-has="'basicDataManage:importAdd'" icon="import" @click="handleImportExcel()">导入</a-button>
      <a-button @click="handleImportFiles" v-has="'basicDataManage:importAdd'" type="primary" icon="import">批量导入附件</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel" v-has="'basicDataManage:del'">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="!isSelect">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        :bordered="false"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: selectType}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>
        <span slot="code" slot-scope="text, record">
          {{text}} <a-icon type="loading" v-if="record.loading"/>
        </span>
        <span slot="action" slot-scope="text, record">
            <a @click="handleEdit1(record)" v-has="'basicDataManage:edit'">编辑</a>

            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
              <a-menu slot="overlay">
                <a-menu-item v-has="'basicDataManage:del'">
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>

        </span>
        <medical-instruction-item-list :parentId="record.id" :key="record" :readOnly="isSelect" slot="expandedRowRender"
                                 slot-scope="record" :kind="kind"></medical-instruction-item-list>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medical-instruction-item-modal ref="modalForm"  @ok="()=>{expandedRowKeys = [];modalFormOk()}"
                         v-if="!isSelect"></medical-instruction-item-modal>

    <!--导入-->
    <import-modal ref="importModel" tip="说明书内容存在于第一个sheet页里，关联信息存在于第二个sheet页里,导入成功后刷新列表查看结果" ></import-modal>

    <!--批量导入附件-->
    <import-multi-modal ref="importMultiModel"
                        tip="文件名需要以说明书编码开头，编码后紧跟下划线。例：X-A10BF-A025_阿卡波糖说明书.docx（已存在的文件名不会被覆盖）,导入成功后刷新列表查看结果"></import-multi-modal>


  </a-card>
</template>

<script>
import MedicalInstructionItemModal from './modules/MedicalInstructionItemModal'
import MedicalInstructionItemList from './MedicalInstructionItemList'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'

import ImportModal from '@/components/ImportModal'
import ImportMultiModal from '@/components/ImportMultiModal'
import moment from "moment"
import {getAction } from '@/api/manage'

export default {
  name: "MedicalInstructionList",
  mixins: [JeecgListMixin],
  props: {
    isSelect: {
      type: Boolean,
      default: false
    },
    selectType: {
      type: String,
      default: 'checkbox'
    },
    kind: {
      type: String,
      default: '2'
    },
  },
  components: {
    MedicalInstructionItemModal,
    MedicalInstructionItemList,
    JEllipsis,
    ImportModal,
    ImportMultiModal,
    moment
  },
  data() {
    const columns = [
      {
        title: '说明书编码',
        align: "left",
        dataIndex: 'code',
        scopedSlots: { customRender: 'code' },
        width: 200
      },
      {
        title: '说明书名称',
        align: "center",
        dataIndex: 'name',
        width: 400,
      },
      {
        title: '说明书修订日期',
        align: "center",
        dataIndex: 'revisionDate',
        width: 200,
      },
      /*{
        title: '生产企业名称',
        align: "center",
        dataIndex: 'enterprise',
        width: 250,
      },*/
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

    ]
    if (!this.isSelect) {
      columns.push({
        title: '操作',
        dataIndex: 'action',
        align: "center",
        scopedSlots: { customRender: 'action' },
        width: 180,
      })
    }
    return {
      description: '说明书管理页面',
      // 表头
      columns: columns,
      /* 排序参数 */
      isorter: {
        column: 'code',
        order: 'asc',
      },
      url: {},
      searchItemSpan: this.isSelect ? 8 : 6,
      initLoad: false,
      selectInfos: {
        '1': { tableNameUrl: 'medicalDrugInstruction', labelName: '药品', tableName: 'MEDICAL_DRUG_INSTRUCTION' },
        '2': { tableNameUrl: 'medicalEquipInstruction', labelName: '医疗器械', tableName: 'MEDICAL_EQUIP_INSTRUCTION' },
      },
      tableNameUrl: 'medicalDrugInstruction',
      labelName: '药品',
      tableName: 'MEDICAL_DRUG_INSTRUCTION',
      queryParam2: {},
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${this.url.importExcelUrl}`;
    }
  },
  watch: {
    kind: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.kindChangeUrl(val);
          this.loadData();
        }
      }
    }
  },
  beforeMount() {
    if (this.isSelect) {
      this.tableAttrs = Object.assign(this.tableAttrs, {
        scroll: {
          x: this.columns.reduce((prev, cur) => prev + cur.width, 20),
          y: 'calc(80vh - 350px)'
        }
      })
    }
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
      this.queryParam.revisionDate_begin = this.formateDate(this.queryParam.revisionDate_begin)
      this.queryParam.revisionDate_end = this.formateDate(this.queryParam.revisionDate_end)
      this.loadData(1);
    },
    handleAdd() {
      let record = { kind: this.kind };
      this.handleEdit(record);
    },
    handleEdit1(record) {
      let data = Object.assign({}, record);
      data.kind = this.kind;
      this.handleEdit(data);
    },
    kindChangeUrl(kind) {
      if (kind && kind.length > 0) {
        let info = this.selectInfos[kind]
        if (info) {
          this.tableNameUrl = info.tableNameUrl
          this.labelName = info.labelName
          this.tableName = info.tableName
          this.url = {
            list: `/config/${this.tableNameUrl}/list`,
            delete: `/config/${this.tableNameUrl}/delete`,
            deleteBatch: `/config/${this.tableNameUrl}/deleteBatch`,
            deleteChild: `/config/${this.tableNameUrl}/delete`,
            deleteChildBatch: `/config/${this.tableNameUrl}/deleteBatch`,
            exportXlsUrl: `/config/${this.tableNameUrl}/exportXls`,
            importExcelUrl: `/config/${this.tableNameUrl}/importExcel`,
            exportExcelByThread: `/config/${this.tableNameUrl}/exportExcelByThread`,
            exportExcel: `/config/${this.tableNameUrl}/exportExcel`,
            importFileUrl: `/config/${this.tableNameUrl}/importFiles`,
          };
          this.columns[0].title = this.labelName + '说明书编码'
          this.columns[1].title = this.labelName + '说明书名称'
        }
      }
    },
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      let name = this.labelName + '说明书';
      this.url.exportXlsUrl=this.url.exportExcel
      let totalCount = this.ipagination.total;
      if (totalCount < 100||(this.selectedRowKeys && this.selectedRowKeys.length > 0)) {
        this.handleExportFile(name + moment().format('YYYYMMDDHHmmss')+'.xlsx')
        return;
      }
      this.handleExportXlsAsync()
    },
    //导入
    handleImportExcel() {
      let param = {
        title: this.labelName + '说明书导入',
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName: this.tableName + '.xlsx'
      }
      this.$refs.importModel.loadData(param);
    },
    // 批量导入附件
    handleImportFiles() {
      let param = {
        title: this.labelName + '说明书附件批量导入',
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