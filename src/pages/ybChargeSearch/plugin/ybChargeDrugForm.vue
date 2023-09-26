<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="药品分类">
              <j-input placeholder="请输入药品分类" v-model="queryParam.drugType"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="药品名称">
              <a-input placeholder="请输入药品名称" v-model="queryParam.drugName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="审核状态">
              <m-dict-select-tag placeholder="请选择审核状态" dictCode="EXAMINE_STATUS"
                                 v-model="queryParam.examineStatus"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="药品分类(小)">
                <j-input placeholder="请输入药品分类(小)" v-model="queryParam.drugTypeSmall"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="医保类别">
                <j-input placeholder="请输入医保类别" v-model="queryParam.funType"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="剂型">
                <j-input placeholder="请输入剂型" v-model="queryParam.dosageType"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="整理人">
                <j-input placeholder="请输入整理人" v-model="queryParam.sorter"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="备注">
                <j-input placeholder="请输入备注" v-model="queryParam.remark"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
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


    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a-->
<!--        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->

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

      </a-table>
    </div>

  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import moment from "moment";
import {httpAction, deleteAction, getAction} from '@/api/manage'
import {createStyle} from '@/api/optionStyle'
export default {
  name: "ybChargeDrugForm",
  mixins: [JeecgListMixin],
  components: {
    MDictSelectTag
  },
  props: ['paramData'],
  data() {
    return {
      description: '药品案例库管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '药品分类',
          align: "center",
          dataIndex: 'drugType',
          width: 140,
        },
        {
          title: '药品分类(小)',
          align: "center",
          dataIndex: 'drugTypeSmall',
          width: 140,
        },
        {
          title: '医保类别',
          align: "center",
          dataIndex: 'funType'
        },
        {
          title: '药品名称',
          align: "center",
          dataIndex: 'drugName',
          width: 140,
        },
        {
          title: '剂型',
          align: "center",
          dataIndex: 'dosageType'
        },
        {
          title: '备注',
          align: "center",
          dataIndex: 'remark',
          width: 140,
        },
        {
          title: '整理人',
          align: "center",
          dataIndex: 'sorter'
        },

      ],
      num: 0,
      url: {
        list: "/ybChargeSearch/ybChargeDrug/list",
        delete: "/ybChargeSearch/ybChargeDrug/delete",
        deleteBatch: "/ybChargeSearch/ybChargeDrug/deleteBatch",
        exportXlsUrl: "ybChargeSearch/ybChargeDrug/exportXls",
        importExcelUrl: "ybChargeSearch/ybChargeDrug/importExcel",
        batchExamine: "ybChargeSearch/ybChargeDrug/batchExamine"
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  created () {
    let drugName=''
    this.paramData.filter(item => item.drugName)
        .forEach(val => {
          if(drugName){
            drugName =drugName+"#"+val.drugName
          }else{
            drugName=val.drugName
          }

        })
    this.queryParam.drugName=drugName
    console.log("this.queryParam.drugName3",this.queryParam.drugName)
  },
  mounted() {
    createStyle('.vxe-table--tooltip-content{font-size: 18px !important;}')
    this.$forceUpdate()
  },
  methods: {

  },
  beforeDestroy() {
    createStyle('.vxe-table--tooltip-content{font-size: 12px !important;}')
    this.$forceUpdate()
    this.$forceUpdate()
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
</style>
