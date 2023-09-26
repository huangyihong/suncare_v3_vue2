<template>
  <a-card :bordered="false">
    <resize-division :px="true" :offset="300" :limit="200">
      <div slot="left" style="overflow: auto">
        <div class="icons-list" >
          <a-icon type="edit"  theme="twoTone"  @click="openOtherDictTab('STD_ICDClassify')"  style="float:right;margin-right: 20px;fontSize:18px;"/>
        </div>
        <other-dict-tree @selectNode="searchData" dictEname="STD_ICDClassify" :showCode="true"></other-dict-tree>
      </div>
      <template  slot="right">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQueryFn">
            <a-row :gutter="24">
              <a-col :md="8" :sm="12">
                <a-form-item label="疾病编码">
                  <j-input placeholder="输入疾病编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="12">
                <a-form-item label="疾病名称">
                  <j-input placeholder="输入疾病名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"/>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="12">
                  <a-form-item label="父级分类编码">
                    <a-input placeholder="输入父级分类编码模糊查询" v-model="queryParam.typeCode"/>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="父级分类名称">
                    <j-input placeholder="输入父级分类名称模糊查询" v-model="queryParam.typeName"/>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="数据状态">
                    <j-dict-select-tag  v-model="queryParam.state" placeholder="数据状态" dictCode="base_data_state"/>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="审核状态">
                    <j-dict-select-tag  v-model="queryParam.auditResult" placeholder="审核状态" dictCode="base_auditResult"/>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="操作类型">
                    <j-dict-select-tag v-model="queryParam.actionType" placeholder="操作类型" dictCode="base_actionType"/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="12">
                  <a-form-item label="操作时间">
                    <a-date-picker placeholder="" v-model="queryParam.time1" class="search-divider-item"></a-date-picker>
                    <div class="search-divider">~</div>
                    <a-date-picker placeholder="" v-model="queryParam.time2" class="search-divider-item"></a-date-picker>
                  </a-form-item>
                </a-col>
              </template>

              <a-col :md="8" :sm="12" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQueryFn" icon="search">查询</a-button>
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
          <a-button @click="handleAddFn()" v-has="'basicDataManage:add'" type="primary" icon="plus">新增</a-button>
          <a-button @click="update()" v-has="'basicDataManage:edit'" type="primary" icon="edit">修改</a-button>
          <a-button @click="del()" v-has="'basicDataManage:del'" type="primary" icon="delete">删除</a-button>
          <a-button @click="undo()" v-has="'basicDataManage:undo'" type="primary" icon="undo">撤销</a-button>
          <a-button @click="audit()" v-has="'basicDataManage:audit'" type="primary" icon="audit">审核</a-button>
          <a-popconfirm placement="top" title="确定将查询的结果一键清理吗？" okText="确认" cancelText="取消" @confirm="clean()">
            <a-button v-has="'basicDataManage:clean'" type="primary" icon="scissor">一键清理</a-button>
          </a-popconfirm>
          <a-button type="primary" v-has="'basicDataManage:export'" icon="download" @click="handleExportExcel('ICD国际疾病信息')">导出</a-button>
          <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportHive(tableName)">同步Hive</a-button>
          <a-button type="primary" @click="handleReplaceData()">替换</a-button>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1" v-has="'basicDataManage:importAdd'" @click="importAll()"><a-icon type="plus"/>批量导入</a-menu-item>
              <a-menu-item key="6" @click="addToNewGroup"><a-icon type="plus"/>批量生成疾病组</a-menu-item>
              <a-menu-item key="3" v-has="'basicDataManage:delAll'" @click="deleteAll()"><a-icon type="delete"/>全部删除</a-menu-item>
              <a-menu-item key="4" v-has="'basicDataManage:undoAll'" @click="undoAll()"><a-icon type="undo"/>全部撤销</a-menu-item>
              <a-menu-item key="5" v-has="'basicDataManage:auditAll'" @click="auditAll()"><a-icon type="audit"/>全部审核</a-menu-item>
              <a-menu-item key="6" v-has="'basicDataManage:sync'" @click="syncAll()">同步全部基础表</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown>
        </div>




        <!-- table区域-begin -->
        <div>

          <a-table
            ref="table"
            size="middle"
            bordered
            :rowKey="keyFiled"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
            v-bind="tableAttrs">

        <span slot="name" slot-scope="text, record">
          <a @click="handleDetail(record)">{{text}}</a>
        </span>

            <span slot="auditResult" slot-scope="text, record">
          <a @click="showMedicalAuditLog(record)">{{text}}</a>
        </span>

            <span slot="typeName" slot-scope="text">
          <j-ellipsis :value="text" :length="12"/>
        </span>

            <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>

            <span slot="createReason" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

            <span slot="updateReason" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

            <span slot="deleteReason" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->
      </template>
    </resize-division>
    <!-- 表单区域 -->
    <medical-disease-diag-modal ref="modalForm" @ok="myModalFormOk"></medical-disease-diag-modal>

    <!-- 审核日志查看区域 -->
    <show-medical-audit-log-modal  ref="showMedicalAuditLogModel"></show-medical-audit-log-modal>

    <!-- 撤销操作区域 -->
    <undo-medical-audit-log-modal ref="undoMedicalAuditLogModal" @ok="myModalFormOk"></undo-medical-audit-log-modal>

    <!-- 审核操作区域 -->
    <audit-medical-audit-log-modal ref="auditMedicalAuditLogModal" @ok="myModalFormOk"></audit-medical-audit-log-modal>

    <!-- 批量审核操作区域 -->
    <batch-audit-medical-audit-log-modal ref="batchAuditMedicalAuditLogModal" @ok="myModalFormOk"></batch-audit-medical-audit-log-modal>

    <!-- 一键清理操作区域 -->
    <clean-medical-audit-log-modal ref="cleanMedicalAuditLogModal" @ok="myModalFormOk"></clean-medical-audit-log-modal>

    <!--批量新增 批量修改-->
    <import-modal ref="importModel" @ok="myModalFormOk"></import-modal>

    <!--批量归纳到 新增的疾病组-->
    <a-spin :spinning="addToNewGroupLoading">
      <medical-group-info-modal ref="groupInfoModel" kind="5" @ok="groupInfoFormOk"></medical-group-info-modal>
    </a-spin>

    <m-modal centered
             title="选择替换成的疾病信息"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <select-medical-disease-diag ref="selectRef" :selected="selectData" selectType="radio"
                                              :fixedParam="{ state: '1' }"></select-medical-disease-diag>
    </m-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { MedicalAuditLogListMixin } from './modules/MedicalAuditLog/MedicalAuditLogListMixin'
import { CommonReplaceDataMixin } from './modules/MedicalAuditLog/CommonReplaceDataMixin'
import {getAction,putAction } from '@/api/manage'

import JDictSelectTag from '@/components/dict/JDictSelectTag'
import MedicalDiseaseDiagModal from './modules/MedicalDiseaseDiagModal.vue'
import OtherDictTree from './modules/OtherDictTree.vue'
import MedicalGroupInfoModal from './modules/MedicalGroupInfoModal'
import ResizeDivision from '@//components/ResizeDivision'
const SelectMedicalDiseaseDiag = () => import("@/pages/selectMulti/MedicalDiseaseDiag")

export default {
  name: "MedicalDiseaseDiagList",
  mixins:[JeecgListMixin,MedicalAuditLogListMixin,CommonReplaceDataMixin],
  components: {
    MedicalDiseaseDiagModal,
    JDictSelectTag,
    OtherDictTree,
    MedicalGroupInfoModal,
    ResizeDivision,
    SelectMedicalDiseaseDiag,
  },
  data () {
    return {
      description: 'ICD国际疾病管理页面',
      // 表头
      columns: [
        {
          title: '疾病编码',
          width:150,
          align:"left",
          dataIndex: 'code',
          fixed: 'left',
        },
        {
          title: '疾病名称',
          width:200,
          align:"left",
          dataIndex: 'name',
          fixed: 'left',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '父级分类编码',
          width:150,
          align:"left",
          dataIndex: 'typeCode',
          //fixed: 'left',
        },
        {
          title: '父级分类名称',
          width:200,
          align:"left",
          dataIndex: 'typeName',
          //fixed: 'left',
          // scopedSlots: { customRender: 'typeName' },
        },
        {
          title: '描述',
          width:200,
          align:"center",
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
        },
        {
          title: '数据状态',
          width:100,
          align:"center",
          dataIndex: 'state_dictText'
        },
        {
          title: '审核结果',
          width:100,
          align:"center",
          dataIndex: 'auditResult_dictText',
          scopedSlots: { customRender: 'auditResult' },
        },
        {
          title: '操作类型',
          width:100,
          align:"center",
          dataIndex: 'actionType_dictText'
        },

        {
          title: '新增人',
          width:120,
          align:"center",
          dataIndex: 'createStaffName'
        },
        {
          title: '新增时间',
          width:150,
          align:"center",
          dataIndex: 'createTime'
        },
        {
          title: '新增原因',
          width:150,
          align:"center",
          dataIndex: 'createReason',
          // scopedSlots: { customRender: 'createReason' },
        },
        {
          title: '最新修改人',
          width:120,
          align:"center",
          dataIndex: 'updateStaffName'
        },
        {
          title: '最新修改时间',
          width:150,
          align:"center",
          dataIndex: 'updateTime'
        },
        {
          title: '（最新）修改原因',
          width:150,
          align:"center",
          dataIndex: 'updateReason',
          // scopedSlots: { customRender: 'updateReason' },
        },
        {
          title: '删除人',
          width:120,
          align:"center",
          dataIndex: 'deleteStaffName'
        },

        {
          title: '删除时间',
          width:100,
          align:"center",
          dataIndex: 'deleteTime'
        },
        {
          title: '删除原因',
          width:100,
          align:"center",
          dataIndex: 'deleteReason',
          // scopedSlots: { customRender: 'deleteReason' },
        }
      ],
      isorter: {
        column: 'code',
        order: 'asc',
      },
      url: {
        list: "/config/medicalDiseaseDiag/manageList",
        delete: "/config/medicalDiseaseDiag/delete",
        deleteBatch: "/config/medicalDiseaseDiag/deleteBatch",
        exportXlsUrl: "/config/medicalDiseaseDiag/exportXls",
        importExcelUrl: "/config/medicalDiseaseDiag/importExcel",
        getDataCount: "/config/medicalDiseaseDiag/getDataCount",
        saveClean:"/config/medicalDiseaseDiag/saveCleanMedicalDiseaseDiag",
        saveAuditAll:"/config/medicalDiseaseDiag/saveAuditAllMedicalAuditLog",
        saveUndoAllMedicalAuditLog: "/config/medicalDiseaseDiag/saveUndoAllMedicalAuditLog",
        exportExcelByThread: "/config/medicalDiseaseDiag/exportExcelByThread",
        exportExcel: "/config/medicalDiseaseDiag/exportExcel",
        addToNewGroup: "/config/medicalDiseaseDiag/addToNewGroup",
        replaceData: "/config/medicalDiseaseDiag/replaceData",
      },
      keyFiled:'id',
      tableName: 'MEDICAL_DISEASE_DIAG',
      addToNewGroupLoading: false,
    }
  },
  computed: {

  },
  beforeMount(){

  },
  methods: {
    //左侧树点击查询
    searchData(typeCode){
      this.queryParam.typeCode_1 = typeCode;
      this.searchQueryFn();
    },
    handleAddFn(){
      let record = {};
      record.fntype='add';
      record.typeCode = this.queryParam.typeCode_1;
      this.handleEdit(record);
    },
    addToNewGroup(){
      this.$refs.groupInfoModel.show()
    },
    groupInfoFormOk(groupObj){
      this.addToNewGroupLoading = true
      let params = {group:groupObj, params: this.getQueryParams()}
      putAction(this.url.addToNewGroup,params).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.groupInfoModel.close()
        } else {
          this.$message.warning(res.message);
        }
      }).finally(()=>{
        this.addToNewGroupLoading = false
      })
    },
    syncAll(){
      let params = {}
      this.loading = true
      getAction(this.$suncare_v3+"/config/medicalHive/updateStdToHiveConfigAll", params).then((res) => {
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