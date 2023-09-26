<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :span="9">
            <a-form-item label="疾病项目">
              <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.diseaseNames"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="handleCopyAdd" type="primary" icon="copy">复制新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('药品合规规则')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
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
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="ruleId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: scrollX}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.ruleId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- 字符串超长截取省略号显示 -->
        <span slot="message" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>
        <span slot="codes" slot-scope="text">
          <j-ellipsis :value="text" :length="22"/>
        </span>
        <span slot="names" slot-scope="text">
          <j-ellipsis :value="text" :length="13"/>
        </span>
        <span slot="limitScope" slot-scope="text">
          <j-ellipsis :value="toLimitScopeShow(text)" :length="12"/>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medical-clinical-rule-modal ref="modalForm" @ok="modalFormOk"></medical-clinical-rule-modal>
  </a-card>
</template>

<script>
  import MedicalClinicalRuleModal from './modules/MedicalClinicalRuleModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  const limitDict = {
    '01': '年龄',
    '02': '性别',
    '03': '就医方式',
    '04': '参保类型',
    '05': '医院级别',
    '06': '科室',
    '07': '疗程用药剂量',
    '08': '年度用药剂量',
    '09': '治疗项目',
    '10': '治疗方式',
    '11': '重复用药',
    '12': '二线用药',
    '13': '适用症',
    '14': '治疗用药',
    '15': '住院天数',
    '16': '入院前天数',
    '17': '诊疗项目',
  }

  export default {
    name: "MedicalDrugRuleList",
    mixins: [JeecgListMixin],
    components: {
      MedicalClinicalRuleModal,
      JEllipsis,
    },
    data() {
      return {
        description: '药品合规规则管理页面',
        // 表头
        columns: [
          {
            title: '疾病名称',
            align: "center",
            dataIndex: 'diseaseNames',
            width: 200,
            // fixed: true,
            // scopedSlots: { customRender: 'names' }
          }, {
            title: '就诊类型',
            align: "center",
            dataIndex: 'jzlx_dictText',
            width: 200,
            // scopedSlots: { customRender: 'names' }
          },
          {
            title: '限定范围',
            align: "center",
            dataIndex: 'limitScope',
            width: 200,
            // scopedSlots: { customRender: 'limitScope' }
            customRender: this.toLimitScopeShow
          },
          {
            title: '住院天数',
            align: "center",
            dataIndex: 'inhospitalMax',
            width: 200,
            customRender: (t, r, i) => {
              let html = t?'上限：'+ t: '';
              if(r.inhospitalMin){
                html += '  下限：'+r.inhospitalMin;
              }
              return html
            },
          },
          {
            title: '入院前天数',
            align: "center",
            dataIndex: 'beforeInhospital',
            width: 130
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            // fixed: 'right',
            width: 150,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/medical/medicalDrugRule/list",
          delete: "/medical/medicalDrugRule/delete",
          deleteBatch: "/medical/medicalDrugRule/deleteBatch",
        },
        /* 排序参数 */
        isorter: {
          column: 'chargeItems',
          order: 'asc',
        },
        fixedParam: {ruleType: '3'}
      }
    },
    computed: {
    },
    methods: {
      toLimitScopeShow(limitScope) {
        return limitScope.trim().split(",").map(item => limitDict[item.toString()]).join(",")
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>