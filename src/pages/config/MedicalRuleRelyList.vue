<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为类型">
              <a-select placeholder="请选择不合规行为类型" v-model="queryParam.ruleType">
                <a-select-option value="">--请选择--</a-select-option>
                <a-select-option value="CASE">模型</a-select-option>
                <a-select-option value="DRUG">药品合规</a-select-option>
                <a-select-option value="CHARGE">收费合规</a-select-option>
                <a-select-option value="TREAT">合理诊疗</a-select-option>
                <a-select-option value="DRUGUSE">合理用药</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为">
              <j-input placeholder="请输入不合规行为" v-model="queryParam.actionName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="规则名称">
              <j-input placeholder="请输入规则名称" v-model="queryParam.ruleName"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="准入字段名称">
              <j-input placeholder="请输入准入字段名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.accessColumn"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="判断字段名称">
              <j-input placeholder="请输入判断字段名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.judgeColumn"></j-input>
            </a-form-item>
          </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="规则ID">
                <j-input placeholder="请输入规则ID" type="more" v-model="queryParam.ruleId"></j-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8" >
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
      <a-button type="primary" icon="download"  @click="handleExportExcel()">导出</a-button>
      <a-button type="primary" @click="handleCompute()">更新</a-button>
      <a-button type="primary" v-has="'basicDataManage:sync'" @click="dataimportHive('MEDICAL_RULE_RELY')">同步Hive</a-button>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="ruleType" slot-scope="text">
          <span v-if="text=='CASE'">模型</span>
          <span v-else-if="text=='DRUG'">药品合规</span>
          <span v-else-if="text=='CHARGE'">收费合规</span>
          <span v-else-if="text=='TREAT'">合理诊疗</span>
          <span v-else-if="text=='DRUGUSE'">合理用药</span>
          <span v-else>{{text}}</span>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { MedicalAuditLogListMixin } from './modules/MedicalAuditLog/MedicalAuditLogListMixin'
import moment from "moment"
import {getAction } from '@/api/manage'

export default {
  name: "MedicalRuleRelyList",
  mixins:[JeecgListMixin,MedicalAuditLogListMixin],
  components: {
    moment
  },
  data () {
    return {
      description: '规则依赖字段表管理页面',
      // 表头
      columns: [
        {
          title: '不合规行为类型',
          width:110,
          align:"left",
          dataIndex: 'ruleType',
          scopedSlots: { customRender: 'ruleType' },
        },
        {
          title: '不合规行为',
          width:200,
          align:"left",
          dataIndex: 'actionName'
        },
        {
          title: '规则ID',
          width:280,
          align:"left",
          dataIndex: 'ruleId'
        },
        {
          title: '规则名称',
          width:200,
          align:"left",
          dataIndex: 'ruleName'
        },
        {
          title: '准入字段名称',
          width:350,
          align:"left",
          dataIndex: 'accessColumn'
        },
        {
          title: '判断字段名称',
          width:350,
          align:"left",
          dataIndex: 'judgeColumn'
        },
        {
          title: '最后更新时间',
          width:100,
          align:"left",
          dataIndex: 'createTime'
        },
      ],
      url: {
        list: "/medical/medicalRuleRely/list",
        exportExcel: "/medical/medicalRuleRely/exportExcel",
        exportExcelByThread: "/medical/medicalRuleRely/exportExcelByThread",
        compute: "/medical/medicalRuleRely/compute",
      },
      isorter: {
        column: 'actionName',
        order: 'asc'
      },
    }
  },
  computed: {
  },
  methods: {
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.url.exportXlsUrl=this.url.exportExcel
      let totalCount = this.ipagination.total;
      if (totalCount < 5000||(this.selectedRowKeys && this.selectedRowKeys.length > 0)) {
        this.handleExportFile('规则依赖字段信息' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
        return;
      }
      this.handleExportXlsAsync()
    },
    // 更新
    handleCompute(){
      const that = this
      this.$confirm({
        title: '确认更新',
        content: '是否确认进行更新操作?',
        onOk: function() {
          that.loading = true

          getAction(that.url.compute, {}).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            }else{
              that.$message.warning(res.message);
            }
          }).catch(e => {
            that.$message.error(e.message);
          }).finally(() => {
            that.loading = false
          })
        }
      })


    },
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
