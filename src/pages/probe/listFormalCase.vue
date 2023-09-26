<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="模型名称">
              <j-input placeholder="模糊查询" v-model="queryParam.caseName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="不合规行为">
              <j-input placeholder="模糊查询" v-model="queryParam.actionName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="8" :xs="12">
            <a-form-item label="所属地区">
              <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="模型状态">
                <m-dict-select-tag placeholder="请选择模型状态" dictCode="SWITCH_STATUS"
                                   v-model="queryParam.caseStatus"/>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="模型描述">
                <j-input placeholder="模糊查询" v-model="queryParam.caseRemark"></j-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="政策依据">
                <j-input placeholder="模糊查询" v-model="queryParam.ruleBasis"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="适用时间(开始)">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.startTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.startTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="适用时间(结束)">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.endTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.endTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="创建时间">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.createTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.createTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="创建人">
                <j-input placeholder="模糊查询" v-model="queryParam.createUsername"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="6">
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
      <span v-has="'sumup:action'">
        <a-button type="primary" icon="plus"  @click="handleImportExcel" v-has="'probe:import'">导入</a-button>
        <a-button type="primary" icon="import" class="m-l-6" @click="handleExportFile('模型信息导出.xlsx', undefined, url.exportCaseInfo)" v-has="'probe:export'">导出</a-button>
      </span>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel" v-has="'probe:del'">
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
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length
        }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="caseId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: scrollX}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <template slot="caseStatus" slot-scope="caseStatus, record">
          <span style="color: red" v-if="caseStatus === 'stop'">{{filterDictText(statusDictOptions, caseStatus)}}</span>
          <span v-else>{{filterDictText(statusDictOptions, caseStatus)}}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <span v-has="'sumup:action'">
            <template v-has="'probe:add'">
              <a @click="caseDetail(record)">查看</a>
              <a-divider type="vertical"/>
            </template>
            <template v-has="'probe:del'">
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.caseId)">
                      <a>删除</a>
              </a-popconfirm>
            </template>
          </span>
        </span>

      </a-table>
    </div>

    <!-- 模型详情 -->
    <case-detail-modal ref="caseModal"></case-detail-modal>

    <!--导入-->
    <import-modal ref="importModel" tip=""
                  @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>

  </a-card>
</template>

<script>
import { JeecgListMixin,ListMoreMixin } from '@/mixins/JeecgListMixin'
import moment from 'moment'
import { getAction } from '@/api/manage'
import {  filterDictText } from '@/components/dict_medical/DictSelectUtil'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import ImportModal from '@/components/ImportModal'
import CaseDetailModal from '@/pages/probe/caseDetailModal'
export default {
  name: 'listFormalCase',
  mixins: [JeecgListMixin,ListMoreMixin],
  components: {
    MDictSelectTag,
    ImportModal,
    CaseDetailModal,
  },
  data() {
    return {
      filterDictText,
      description: '模型管理页面',
      // 表头
      columns: [
        {
          title: '模型名称',
          dataIndex: 'caseName',
          align: "center",
          width: 200,
        },{
          title: '所属地区',
          align: 'center',
          dataIndex: 'ruleSource',
          width: 80
        },
        {
          title: '状态',
          dataIndex: 'caseStatus',
          scopedSlots: { customRender: 'caseStatus' },
          align:"center",
        },
        {
          title: '不合规行为',
          align: 'center',
          dataIndex: 'actionName',
          width: 200
        },
        {
          title: '适用时间',
          align: 'center',
          dataIndex: 'startTime',
          width: 120,
          customRender: (text, record, index) => {
            return record.startTime + ' ~ ' + record.endTime
          }
        },
        {
          title: '模型描述',
          align: 'center',
          dataIndex: 'caseRemark',
          width: 200
        },

        {
          title: '创建人',
          dataIndex: 'createUsername',
          align: "center",
          width: 120
        },{
          title: '创建时间',
          dataIndex: 'createTime',
          align: "center",
          width: 120
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: "/formal/medicalFormalCase/list",
        delete: "/formal/medicalFormalCase/delete",
        deleteBatch: "/formal/medicalFormalCase/deleteBatch",
        importCaseInfo: "/formal/medicalFormalCase/importCaseInfo",
        exportCaseInfo: "/formal/medicalFormalCase/exportCaseInfo",
      },
      /* 排序参数 */
      isorter:{
        column: 'caseStatus,createTime,caseName',
        order: 'asc,desc,asc',
      },
      fixedParam: {
        caseClassify: '!*',
      },
      statusDictOptions:[],

    }
  },
  beforeMount() {
    this.initDictConfig()

  },
  props: {
    fixedParam1: Object,
    groupCode:String,
    initLoad:{
      type: Boolean,
      default: true
    }
  },
  watch: {
    groupCode: {
      immediate: true,
      handler(val) {
        if(val){
          this.fixedParam = Object.assign(this.fixedParam, this.fixedParam1)
          this.searchQuery()
        }
      }
    },
  },
  methods: {
    initDictConfig() {
      // console.log("--我才是真的方法!--")
      //初始化字典 - 状态
      this.$util.initDict('SWITCH_STATUS').then(data => {
        this.statusDictOptions = data
        //this.setColFilter('caseStatus', data)
      })
    },
    //查看模型
    caseDetail({caseId}){
      this.$refs.caseModal.detail(caseId)
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '批量导入更新',
        importUrl: this.url.importCaseInfo,
        actionType: 'add',
        uploadFileName: 'MEDICAL_FORMAL.xlsx'
      }
      this.$refs.importModel.loadData(param);
    },

  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
