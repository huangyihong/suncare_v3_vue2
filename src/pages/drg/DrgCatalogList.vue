<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="版本编号">
              <j-input placeholder="请输入版本编号模糊查询" v-model="queryParam.versionCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="版本名称">
              <j-input placeholder="请输入版本名称模糊查询" v-model="queryParam.versionName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
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
      <a-button @click="handleEdit({catalogType})" type="primary" icon="plus">新增</a-button>
      <a-button @click="batchDel"  v-if="selectedRowKeys.length>0" type="primary" icon="delete">批量删除</a-button>

     <!-- <a-button @click="changeType('MDC_V')" type="primary">MDC目录管理</a-button>
      <a-button @click="changeType('ADRG_V')" type="primary">ADRG目录管理</a-button>
      <a-button @click="changeType('MDC_INFO_V')" type="primary">MDC主诊表管理</a-button>
      <a-button @click="changeType('ADRG_LIST_V')" type="primary">ADRG列表管理</a-button>
      <a-button @click="changeType('MCC_INFO_V')" type="primary">MCC信息管理</a-button>
      <a-button @click="changeType('CC_INFO_V')" type="primary">CC信息管理</a-button>
      <a-button @click="changeType('EXCLUDE_INFO_V')" type="primary">排除表信息管理</a-button>
      <a-button @click="changeType('SURGERY_INFO_V')" type="primary">手术室手术管理</a-button>
      <a-button @click="changeType('DRG_V')" type="primary">DRG目录管理</a-button>-->

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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a  @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除当前版本信息吗?" @confirm="() => handleDelete(record.id)">
            <a size="small">删除</a>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a  @click="toDetailList(record)">目录维护</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <drg-catalog-modal  ref="modalForm" @ok="modalFormOk"></drg-catalog-modal>

  </a-card>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction, putAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import DrgCatalogModal from './modules/DrgCatalogModal'
import {catalogListConfig} from './mixins/catalogListConfig'

export default {
  name: "DrgCatalogList",
  mixins: [JeecgListMixin],
  components: {
    MDictSelectTag,
    DrgCatalogModal,
  },
  data() {
    return {
      description: 'DRG分组目录版本表',
      // 表头
      leftcolumns:[{
        title: '版本编码',
        align: "left",
        dataIndex: 'versionCode',
        width: '120px'
      },
        {
          title: '版本名称',
          align: "left",
          dataIndex: 'versionName',
          width: '200px'
        },],
      rightcolumns:[{
        title: '备注',
        align: "left",
        dataIndex: 'remark',
        width: '200px'
      },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '300px',
          scopedSlots: {customRender: 'action'}
        }],
      columns: [],
      url: {
        list: "/drg/drgCatalog/list",
        delete: '/drg/drgCatalog/delete',
        deleteBatch: '/drg/drgCatalog/deleteBatch',
        edit: "/drg/drgCatalog/edit",
      },
      catalogType:'MDC_V',
      fixedParam:{
        catalogType:'MDC_V',
      },
      initLoad:false,

    }
  },
  computed: {

  },
  beforeMount() {
    let pathStrArr = this.$route.path.split('/')
    this.catalogType = pathStrArr[pathStrArr.length-1]
    this.fixedParam.catalogType = this.catalogType
    this.columns = [...this.leftcolumns,...catalogListConfig[this.catalogType],...this.rightcolumns]
    this.loadData(1)

  },

  methods: {
    changeType(catalogType){
      this.catalogType = catalogType
      this.fixedParam.catalogType = catalogType
      this.columns = [...this.leftcolumns,...catalogListConfig[catalogType],...this.rightcolumns]
      this.loadData(1)
    },
    //目录维护
    toDetailList(record){
      this.$router.push({ path:'/drg/DrgCatalogDetailList',query: {catalogId:record.id,catalogType:record.catalogType,
        mdcCatalogV:record.mdcCatalogV,adrgCatalogV:record.adrgCatalogV} })
    },

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
