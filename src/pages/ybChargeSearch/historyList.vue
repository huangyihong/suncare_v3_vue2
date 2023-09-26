<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="收费项目名称A">
              <j-input placeholder="请输入收费项目名称A模糊查询" v-model="queryParam.itemname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="收费项目名称B">
              <j-input placeholder="请输入收费项目名称B模糊查询" v-model="queryParam.itemname1"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="结果记录数">
              <j-input placeholder="请输入结果记录数模糊查询" v-model="queryParam.orgs"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="重复收费类型" >
                <m-dict-select-tag placeholder="请选择重复收费类型" dictCode="ITEM1_TYPE" v-model="queryParam.item1Type"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目B违规判断" >
                <m-dict-select-tag placeholder="请选择收费项目B违规判断" dictCode="ITEM1_WGTYPE" v-model="queryParam.item1Wgtype"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="超量检查的类型">
                <m-dict-select-tag placeholder="请选择超量检查的类型目" dictCode="QTY_TYPE" v-model="queryParam.qtyType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="超量的数值(不含)）">
                <a-input placeholder="超量的数值(不含)" v-model="queryParam.qtyNum"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否输出同一天的手术项目">
                <m-dict-select-tag placeholder="请选择是否输出同一天的手术项目" dictCode="YESNO" v-model="queryParam.isSameDay"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="查询次数）">
                <a-input placeholder="查询次数" v-model="queryParam.queryCount"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否纳入规则">
                <a-select placeholder="请选择是否纳入规则" v-model="queryParam.isRule" >
                  <a-select-option value="是">是</a-select-option>
                  <a-select-option value="否">否</a-select-option>
                </a-select>
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
      <a-button type="primary" icon="download" @click="handleExportExcel()">导出</a-button>
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
        :scroll="{ x: scrollX, y: 'calc(100vh - 200px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {getAction } from '@/api/manage'
import moment from "moment"
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import {checklistCols} from '@/pages/ybChargeSearch/mixins/checklistColsCount'

export default {
  name: "historyList",
  mixins: [JeecgListMixin],
  components: {
    MDictSelectTag
  },
  data() {

    return {
      description: '检索关键字使用统计',
      // 表头
      columns:[
        ...checklistCols,
        {
          title: '金额累计(元)',
          width:'140px',
          dataIndex: 'totalFee',
          fixed: 'right',
        },
        {
          title: '结果记录数',
          width:'400px',
          dataIndex: 'orgs',
          fixed: 'right',
        },
      ],
      url: {
        list: "/ybChargeSearch/ybChargeSearchHistory/list",
        exportXlsUrl: "/ybChargeSearch/ybChargeSearchHistory/exportExcel",
      },
      isorter: {
        column: 'itemname',
        order: 'desc'
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
      this.handleExportFile('检索关键字使用统计' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>