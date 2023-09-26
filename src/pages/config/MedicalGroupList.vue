<template>
  <a-card :bordered="false" v-bind="isSelect?{bodyStyle:{padding: 0}}:{}">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item :label="labelName+'组编码'">
              <j-input placeholder="请输入分组编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.groupCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="searchItemSpan">
            <a-form-item :label="labelName+'组名称'">
              <j-input placeholder="请输入分组名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item :label="labelName+'代码'">
                <a-input placeholder="请输入子项代码精确查询" v-model="queryParam.code"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="searchItemSpan">
              <a-form-item :label="labelName+'名称'">
                <a-input placeholder="请输入子项名称精确查询" v-model="queryParam.value"></a-input>
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
      <a-button type="primary" v-has="'basicDataManage:importAdd'" icon="import" @click="handleImportExcel()">导入</a-button>
      <a-button type="primary" v-has="'basicDataManage:export'" icon="download" @click="handleExportExcel()">导出</a-button>
      <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportSolr()">同步Solr</a-button>
      <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportHive(tableName)">同步Hive</a-button>
      <a-button type="primary" @click="handleReplaceData()" v-if="tableName=='MEDICAL_DISEASE_GROUP'">替换</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('药品合规规则分组')">导出</a-button>
       <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                 @change="handleImportExcel">
         <a-button type="primary" icon="import">导入</a-button>
       </a-upload>-->
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
        :bordered="true"
        rowKey="groupId"
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
            <a @click="openConfigRule(record)" v-has="'basicDataManage:edit'">规则关联</a>

            <a-divider type="vertical"/>
            <a @click="handleEdit1(record)" v-has="'basicDataManage:edit'">编辑</a>

            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
              <a-menu slot="overlay" >
                <a-menu-item v-has="'basicDataManage:del'">
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.groupId)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>

        </span>
        <medical-group-item-list :groupId="record.groupId" :key="record" :readOnly="isSelect" slot="expandedRowRender"
                                 slot-scope="record" :kind="kind"></medical-group-item-list>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medical-group-modal ref="modalForm" @ok="()=>{expandedRowKeys = [];modalFormOk()}"
                         v-if="!isSelect"></medical-group-modal>

    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>

    <!--规则关联 -->
    <medical-rule-config-tab ref="ruleConfigTab"></medical-rule-config-tab>

    <!--替换窗口 -->
    <m-modal centered
             :title="'选择替换成的'+labelName+'信息'"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <select-medical-group ref="selectRef" :selected="selectData" selectType="radio" :kind="kind"></select-medical-group>
    </m-modal>

  </a-card>
</template>

<script>
  import MedicalGroupModal from './modules/MedicalGroupModal'
  import MedicalGroupItemList from './MedicalGroupItemList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  import ImportModal from '@/components/ImportModal'
  import moment from "moment"
  import {getAction } from '@/api/manage'

  import MedicalRuleConfigTab from '@/pages/case/MedicalRuleConfigTab'

  import { CommonReplaceDataMixin } from './modules/MedicalAuditLog/CommonReplaceDataMixin'

  const SelectMedicalGroup = () => import("@/pages/selectMulti/MedicalGroup")

  export default {
    name: "MedicalGroupList",
    mixins: [JeecgListMixin,CommonReplaceDataMixin],
    props: {
      isSelect: {
        type: Boolean,
        default: false
      },
      selectType: {
        type: String,
        default: 'checkbox'
      },
      kind: String
    },
    components: {
      MedicalGroupModal,
      MedicalGroupItemList,
      JEllipsis,
      ImportModal,
      moment,
      MedicalRuleConfigTab,
      SelectMedicalGroup,
    },
    data() {
      const columns = [
        {
          title: '分组编码',
          align: "left",
          dataIndex: 'groupCode',
          scopedSlots: { customRender: 'code' },
          width: 80
        },
        {
          title: '分组名称',
          align: "center",
          dataIndex: 'groupName',
          width: 120,
        },
        {
          title: '描述',
          align: "center",
          dataIndex: 'remark',
          // scopedSlots: { customRender: 'remark' },
          width: 200,
        },
        {
          title: '创建人',
          align: "center",
          dataIndex: 'createStaffName',
          width: 120,
        },
        {
          title: '创建时间',
          align: "center",
          dataIndex: 'createTime',
          width: 120,
        },
        {
          title: '修改人',
          align: "center",
          dataIndex: 'updateStaffName',
          width: 120,
        },
        {
          title: '修改时间',
          align: "center",
          dataIndex: 'updateTime',
          width: 120,
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
        description: '分组管理页面',
        // 表头
        columns: columns,
        url: {},
        /* 排序参数 */
        isorter: {
          column: 'isOrder,groupCode',
          order: 'asc,asc',
        },
        searchItemSpan: this.isSelect ? 8 : 6,
        initLoad: false,
        selectInfos: {
          '1': { tableNameUrl: 'medicalProjectGroup', labelName: '医疗服务项目', tableName: 'MEDICAL_PROJECT_GROUP' },
          '5': { tableNameUrl: 'medicalDiseaseGroup', labelName: '疾病', tableName: 'MEDICAL_DISEASE_GROUP' },
          '7': { tableNameUrl: 'medicalDrugGroup', labelName: '药品', tableName: 'MEDICAL_DRUG_GROUP' },
        },
        tableNameUrl: 'medicalDrugGroup',
        labelName: '药品',
        tableName: 'MEDICAL_DRUG_GROUP',
        kind:'7',
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
            this.selectComponent =info.component
            this.kind = kind
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
              replaceData: `/config/${this.tableNameUrl}/replaceData`,
            };
            this.columns[0].title = this.labelName + '组编码'
            this.columns[1].title = this.labelName + '组名称'
          }
        }
      },
      //导出
      handleExportExcel() {
        if(this.ipagination.total === 0){
          this.$message.warn('没有需要导出的数据')
          return
        }
        let name = this.labelName + '组';
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
          title: this.labelName + '组导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: this.tableName + '.xls'
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
      //同步到solr
      dataimportSolr(){
        console.log('tableName',this.tableName)
        let stdTableName = 'STD_DRUGGROUP';
        if(this.tableName=='MEDICAL_DRUG_GROUP'){
          stdTableName = 'STD_DRUGGROUP'
        }
        if(this.tableName=='MEDICAL_DISEASE_GROUP'){
          stdTableName = 'STD_DIAGGROUP'
        }
        if(this.tableName =='MEDICAL_PROJECT_GROUP'){
          stdTableName = 'STD_TREATGROUP'
        }

        let params = {tableName: stdTableName}
        let thisDs = this.$store.getters.userInfo.dataSource

        // url去重容器
        let urlSet = new Set()
        // 遍历循环数据源请求同步接口
        for(let key in this.$config){
          let val = this.$config[key]
          if(typeof val !== 'object' || !val.suncare_v3 || urlSet.has(val.suncare_v3)){
            continue
          }
          urlSet.add(val.suncare_v3)

          let url = val.suncare_v3 + '/config/medicalDrugGroup/dataimportSolr'
          // 如果是当前数据源则提示
          if(key === thisDs){
            this.loading = true
            getAction(url, params).then((res) => {
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
          } else {
            getAction(url, params).then((res) => {
              if (res.success) {
                // this.$message.success(res.message)
              }else{
                // this.$message.warning(res.message);
              }
            })
          }

        }
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

      //打开合规配置
      openConfigRule(record){
        let param = {};
        if(this.tableName=='MEDICAL_DISEASE_GROUP'){
          param={diseaseGroupCode:record.groupCode}
        }
        if(this.tableName=='MEDICAL_DRUG_GROUP'){
          param={drugGroupCode:record.groupCode}
        }
        if(this.tableName =='MEDICAL_PROJECT_GROUP'){
          param={projectGroupCode:record.groupCode}
        }

        let params = {
          title: '规则关联',
          param: param,
          groupCode:record.groupCode
        }
        this.$refs.ruleConfigTab.loadData(params);

      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
