<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为编码">
              <j-input placeholder="请输入不合规行为编码" v-model="queryParam.actionId"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为名称">
              <j-input placeholder="请输入不合规行为名称" v-model="queryParam.actionName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="规则级别">
              <a-select v-model="queryParam.ruleLevel" placeholder="请选择规则级别">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="项目层级">项目层级</a-select-option>
                <a-select-option value="就诊层级">就诊层级</a-select-option>
                <a-select-option value="明细层级">明细层级</a-select-option>
                <a-select-option value="统计层级">统计层级</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">已启用</a-select-option>
                <a-select-option value="0">已禁用</a-select-option>

              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为释义">
              <j-input placeholder="请输入不合规行为释义" v-model="queryParam.actionDesc"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="政策依据">
              <j-input placeholder="请输入政策依据" v-model="queryParam.policyBasis"></j-input>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <a @click="handleToggleSearch" style="margin-left: 8px">
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
      <async-log-modal-button ref="asyncLogRef" actionType="UPDATE_BREAK_STATE">违规说明模板更新进度</async-log-modal-button>
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

        <span slot="status" slot-scope="text">
          <span v-if="text=='1'">已启用</span>
          <span v-else-if="text=='0'">已禁用</span>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

          <a-divider type="vertical"/>

          <a-popconfirm title="确定禁用吗?" @confirm="() => handleStatus(record.id,'0')" v-if="record.status=='1'">
            <a>禁用</a>
          </a-popconfirm>
          <a-popconfirm title="确定启用吗?" @confirm="() => handleStatus(record.id,'1')" v-else-if="record.status=='0'">
            <a>启用</a>
          </a-popconfirm>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <Medical-Action-Dict-modal ref="modalForm" @ok="modalFormOk"></Medical-Action-Dict-modal>

    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </a-card>
</template>

<script>
import MedicalActionDictModal from './modules/MedicalActionDictModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ImportModal from '@/components/ImportModal'
import moment from "moment"
import { getAction } from '@/api/manage'
import AsyncLogModalButton from '@/pages/task/plugin/AsyncLogModalButton'

export default {
  name: "MedicalActionDictList",
  mixins: [JeecgListMixin],
  components: {
    MedicalActionDictModal,
    ImportModal,
    AsyncLogModalButton
  },
  data() {
    return {
      description: '不合规行为管理页面',
      // 表头
      columns: [
        {
          title: '不合规行为编码',
          width:150,
          align:"left",
          dataIndex: 'actionId'
        },
        {
          title: '不合规行为名称',
          width:200,
          align:"left",
          dataIndex: 'actionName',
          ellipsis: true,
        },
        {
          title: '不合规行为释义',
          width:150,
          align:"left",
          dataIndex: 'actionDesc',
          ellipsis: true,
        },
        {
          title: '人工审核标准',
          width:150,
          align:"left",
          dataIndex: 'auditStandard',
          ellipsis: true,
        },
        {
          title: '规则级别',
          width:150,
          align:"left",
          dataIndex: 'ruleLevel'
        },
        {
          title: '计算逻辑',
          width:100,
          align:"left",
          dataIndex: 'calculate',
          ellipsis: true,
        },
        {
          title: '规则/模型类别',
          width:200,
          align:"center",
          dataIndex: 'rules',
          ellipsis: true,
        },
        {
          title: '政策依据',
          width:100,
          align:"left",
          dataIndex: 'policyBasis',
          ellipsis: true,
        },
        {
          title: '现场查处需要资料',
          width:100,
          align:"left",
          dataIndex: 'information',
          ellipsis: true,
        },
        {
          title: '现场稽查查处方法',
          width:100,
          align:"left",
          dataIndex: 'method',
          ellipsis: true,
        },
        {
          title: '落地难易度',
          width:100,
          align:"left",
          dataIndex: 'difficultyLevel'
        },

        {
          title: '创建人',
          align: "left",
          dataIndex: 'createStaffName',
          width: 100,
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
          dataIndex: 'updateStaffName',
          width: 100,
        },
        {
          title: '修改时间',
          align: "left",
          dataIndex: 'updateTime',
          width: 150,
        },
        {
          title: '备注',
          width:100,
          align:"left",
          dataIndex: 'remark'
        },

        {
          title: '状态',
          width:100,
          align:"left",
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
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
        list: "/config/medicalActionDict/list",
        delete: "/config/medicalActionDict/delete",
        deleteBatch: "/config/medicalActionDict/deleteBatch",
        exportXlsUrl: "config/medicalActionDict/exportXls",
        importExcelUrl: "config/medicalActionDict/importExcel",
        exportExcel: "/config/medicalActionDict/exportExcel",
        updateStatus: "/config/medicalActionDict/updateStatus",
      },
      /* 排序参数 */
      isorter: {
        column: 'actionId',
        order: 'asc'
      },
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
      this.handleExportFile('不合规行为' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '不合规行为导入',
        importUrl: this.url.importExcelUrl,
        actionType: 'add',
        uploadFileName: 'MEDICAL_ACTION_DICT.xlsx'
      }
      this.$refs.importModel.loadData(param);
    },
    //启用、禁用
    handleStatus(id,status){
      this.loading = true
      const that = this
      return new Promise((resolve, reject) => {
        let params = { id: id, status: status }
        console.dir(params)
        getAction(that.url.updateStatus, params,'get').then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.loadData()
            resolve()
          } else {
            that.loading = false
            that.$message.warning(res.message)
            reject()
          }
        })
      })
    },

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
