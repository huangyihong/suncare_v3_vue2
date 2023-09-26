<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQueryFn">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="中草药编码">
              <j-input placeholder="输入中草药编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="中草药名称">
              <j-input placeholder="输入中草药名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="收费类别">
                <other-dict-select-tag  placeholder="请选择收费类别" v-model="queryParam.chargeClassCode"  dictEname="chargeClass"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="数据状态">
                <j-dict-select-tag  v-model="queryParam.state" placeholder="数据状态" dictCode="base_data_state"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态">
                <j-dict-select-tag  v-model="queryParam.auditResult" placeholder="审核状态" dictCode="base_auditResult"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="操作类型">
                <j-dict-select-tag v-model="queryParam.actionType" placeholder="操作类型" dictCode="base_actionType"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="操作时间">
                <a-date-picker placeholder="" v-model="queryParam.time1" class="search-divider-item"></a-date-picker>
                <div class="search-divider">~</div>
                <a-date-picker placeholder="" v-model="queryParam.time2"  class="search-divider-item"></a-date-picker>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8" >
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
      <a-button @click="handleAdd()" v-has="'basicDataManage:add'" type="primary" icon="plus">新增</a-button>
      <a-button @click="update()" v-has="'basicDataManage:edit'" type="primary" icon="edit">修改</a-button>
      <a-button @click="del()" v-has="'basicDataManage:del'" type="primary" icon="delete">删除</a-button>
      <a-button @click="undo()" v-has="'basicDataManage:undo'" type="primary" icon="undo">撤销</a-button>
      <a-button @click="audit()" v-has="'basicDataManage:audit'" type="primary" icon="audit">审核</a-button>
      <a-popconfirm placement="top" title="确定将查询的结果一键清理吗？" okText="确认" cancelText="取消" @confirm="clean()">
        <a-button v-has="'basicDataManage:clean'" type="primary" icon="scissor">一键清理</a-button>
      </a-popconfirm>
      <a-button type="primary" v-has="'basicDataManage:export'" icon="download" @click="handleExportExcel('中草药信息')">导出</a-button>
      <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportHive(tableName)">同步Hive</a-button>
      <a-button type="primary" @click="handleReplaceData()">替换</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" v-has="'basicDataManage:importAdd'" @click="importAll()"><a-icon type="plus"/>批量导入</a-menu-item>
          <a-menu-item key="3" v-has="'basicDataManage:delAll'" @click="deleteAll()"><a-icon type="delete"/>全部删除</a-menu-item>
          <a-menu-item key="4" v-has="'basicDataManage:undoAll'" @click="undoAll()"><a-icon type="undo"/>全部撤销</a-menu-item>
          <a-menu-item key="5" v-has="'basicDataManage:auditAll'" @click="auditAll()"><a-icon type="audit"/>全部审核</a-menu-item>
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
        <span slot="source" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="medicalPart" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="pieceName" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="pieceSize" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="dosageType" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="method" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="prescription" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="place" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text"/>
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

    <!-- 表单区域 -->
    <medical-chinese-drug-modal ref="modalForm" @ok="myModalFormOk"></medical-chinese-drug-modal>

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

    <m-modal centered
             title="选择替换成的中草药信息"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <select-medical-chinese-drug ref="selectRef" :selected="selectData" selectType="radio"
                                   :fixedParam="{ state: '1' }"></select-medical-chinese-drug>
    </m-modal>

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { MedicalAuditLogListMixin } from './modules/MedicalAuditLog/MedicalAuditLogListMixin'
  import { CommonReplaceDataMixin } from './modules/MedicalAuditLog/CommonReplaceDataMixin'

  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import MedicalChineseDrugModal from './modules/MedicalChineseDrugModal'
  import OtherDictSelectTag from "./modules/OtherDictSelectTag"

  import {getAction } from '@/api/manage'

  const SelectMedicalChineseDrug = () => import("@/pages/selectMulti/MedicalChineseDrug")

  export default {
    name: "MedicalChineseDrugList",
    mixins:[JeecgListMixin,MedicalAuditLogListMixin,CommonReplaceDataMixin],
    components: {
      MedicalChineseDrugModal,
      JDictSelectTag,
      OtherDictSelectTag,
      SelectMedicalChineseDrug,
    },
    data () {
      return {
        description: '中草药管理页面',
        // 表头
        columns: [
          {
            title: '中草药编码',
            width:150,
            align:"left",
            dataIndex: 'code',
            fixed: 'left',
          },
          {
            title: '中草药名称',
            width:200,
            align:"left",
            dataIndex: 'name',
            //fixed: 'left',
            scopedSlots: { customRender: 'name' },
          },
          {
            title: '国家医保编码',
            width:120,
            align:"center",
            dataIndex: 'ybCode',
          },
          {
            title: '来源名称',
            width:100,
            align:"center",
            dataIndex: 'source',
            // scopedSlots: { customRender: 'source' },
          },
          {
            title: '药用部位',
            width:100,
            align:"center",
            dataIndex: 'medicalPart',
            // scopedSlots: { customRender: 'medicalPart' },
          },
          {
            title: '饮片名',
            width:100,
            align:"center",
            dataIndex: 'pieceName',
            // scopedSlots: { customRender: 'pieceName' },
          },
          {
            title: '饮片规格',
            width:100,
            align:"center",
            dataIndex: 'pieceSize',
            // scopedSlots: { customRender: 'pieceSize' },
          },

          {
            title: '剂型',
            width:100,
            align:"center",
            dataIndex: 'dosageType',
            // scopedSlots: { customRender: 'dosageType' },
          },
          {
            title: '炮制方法',
            width:100,
            align:"center",
            dataIndex: 'method',
            // scopedSlots: { customRender: 'method' },
          },
          {
            title: '常用处方名',
            width:100,
            align:"center",
            dataIndex: 'prescription',
            // scopedSlots: { customRender: 'prescription' },
          },
          {
            title: '产地',
            width:100,
            align:"center",
            dataIndex: 'place',
            // scopedSlots: { customRender: 'place' },
          },
          {
            title: '描述',
            width:100,
            align:"center",
            dataIndex: 'remark',
            // scopedSlots: { customRender: 'remark' },
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
            width:100,
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
            width:150,
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
          list: "/config/medicalChineseDrug/manageList",
          delete: "/config/medicalChineseDrug/delete",
          deleteBatch: "/config/medicalChineseDrug/deleteBatch",
          exportXlsUrl: "/config/medicalChineseDrug/exportXls",
          importExcelUrl: "/config/medicalChineseDrug/importExcel",
          getDataCount: "/config/medicalChineseDrug/getDataCount",
          saveClean:"/config/medicalChineseDrug/saveCleanMedicalChineseDrug",
          saveAuditAll:"/config/medicalChineseDrug/saveAuditAllMedicalAuditLog",
          saveUndoAllMedicalAuditLog: "/config/medicalChineseDrug/saveUndoAllMedicalAuditLog",
          exportExcelByThread: "/config/medicalChineseDrug/exportExcelByThread",
          exportExcel: "/config/medicalChineseDrug/exportExcel",
          replaceData: "/config/medicalChineseDrug/replaceData",
        },
        keyFiled:'id',
        tableName: 'MEDICAL_CHINESE_DRUG',
      }
    },
    computed: {

    },
    beforeMount(){

    },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>