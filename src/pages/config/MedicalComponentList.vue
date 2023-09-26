<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQueryFn">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="成分编码">
              <j-input placeholder="输入成分编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="成分名称">
              <j-input placeholder="输入成分名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
                <a-date-picker placeholder="" v-model="queryParam.time2" class="search-divider-item"></a-date-picker>
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
      <a-button type="primary" v-has="'basicDataManage:export'" icon="download" @click="handleExportExcel('成分表')">导出</a-button>
      <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportHive(tableName)">同步Hive</a-button>
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

        <span slot="ename" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

        <span slot="otherName" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="toxicity" slot-scope="text">
          <j-ellipsis :value="text" :length="5"/>
        </span>

        <span slot="referencetype" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

        <span slot="source" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
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
    <medical-component-modal ref="modalForm" @ok="myModalFormOk"></medical-component-modal>

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

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { MedicalAuditLogListMixin } from './modules/MedicalAuditLog/MedicalAuditLogListMixin'

  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import MedicalComponentModal from './modules/MedicalComponentModal'
  import OtherDictSelectTag from "./modules/OtherDictSelectTag"

  export default {
    name: "MedicalComponentList",
    mixins:[JeecgListMixin,MedicalAuditLogListMixin],
    components: {
      MedicalComponentModal,
      JDictSelectTag,
      OtherDictSelectTag,
    },
    data () {
      return {
        description: '成分表管理页面',
        // 表头
        columns: [
          {
            title: '成分编码',
            width:150,
            align:"left",
            dataIndex: 'code',
            fixed: 'left',
          },
          {
            title: '成分名称',
            width:200,
            align:"left",
            dataIndex: 'name',
            //fixed: 'left',
            scopedSlots: { customRender: 'name' },
          },
          {
            title: '成分英文名称',
            width:100,
            align:"center",
            dataIndex: 'ename',
            // scopedSlots: { customRender: 'ename' },
          },
          {
            title: '成分异名',
            width:100,
            align:"center",
            dataIndex: 'otherName',
            // scopedSlots: { customRender: 'otherName' },
          },
          {
            title: '毒性程度',
            width:100,
            align:"center",
            dataIndex: 'toxicity',
            // scopedSlots: { customRender: 'toxicity' },
          },
          {
            title: '参考类型',
            width:100,
            align:"center",
            dataIndex: 'referencetype',
            // scopedSlots: { customRender: 'referencetype' },
          },
          {
            title: '参考来源',
            width:100,
            align:"center",
            dataIndex: 'source',
            // scopedSlots: { customRender: 'source' },
          },
          {
            title: '备注',
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
          list: "/config/medicalComponent/manageList",
          delete: "/config/medicalComponent/delete",
          deleteBatch: "/config/medicalComponent/deleteBatch",
          exportXlsUrl: "/config/medicalComponent/exportXls",
          importExcelUrl: "/config/medicalComponent/importExcel",
          getDataCount: "/config/medicalComponent/getDataCount",
          saveClean:"/config/medicalComponent/saveCleanMedicalComponent",
          saveAuditAll:"/config/medicalComponent/saveAuditAllMedicalAuditLog",
          saveUndoAllMedicalAuditLog: "/config/medicalComponent/saveUndoAllMedicalAuditLog",
          exportExcelByThread: "/config/medicalComponent/exportExcelByThread",
          exportExcel: "/config/medicalComponent/exportExcel",
        },
        keyFiled:'id',
        tableName: 'MEDICAL_COMPONENT',
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