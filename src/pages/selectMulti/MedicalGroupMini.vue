<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="8">
          <a-col :md="12" :xs="24">
            <a-form-item label="组编码">
              <j-input placeholder="请输入" v-model="queryParam.groupCode" @change="searchQuery"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :xs="24">
            <a-form-item label="组名称">
              <j-input placeholder="请输入" v-model="queryParam.groupName" @change="searchQuery"></j-input>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <template v-if="selectType === 'checkbox'">
        <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>
      </template>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="groupId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange">
        <template slot="title">
          选择{{labelName}}组
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import debounce from 'lodash/debounce';

  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin],
    components: {
    },
    props: {
      kind:String,
      selectType: {
        type: String,
        default: 'checkbox'
      },
    },
    data() {
      return {
        description: '分组信息管理页面',
        // 表头
        columns: [
          {
            title: '分组编码',
            align: "left",
            dataIndex: 'groupCode',
            width: 100
          },
          {
            title: '分组名称',
            align: "center",
            dataIndex: 'groupName',
            width: 150,
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark',
            width: 150,
          },

        ],
        url: {
          list: "/config/medicalDrugGroup/list",
        },
        /* 排序参数 */
        isorter: {
          column: 'isOrder,groupCode',
          order: 'asc,asc',
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: false,
          showSizeChanger: false,
          total: 0
        },
        initLoad:false,
        toggleSearchStatus: false,
        selectInfos: {
          '1': { tableNameUrl:'medicalProjectGroup',labelName:'医疗服务项目',tableName:'MEDICAL_PROJECT_GROUP' },
          '5': { tableNameUrl:'medicalDiseaseGroup',labelName:'疾病',tableName:'MEDICAL_DISEASE_GROUP' },
          '7': { tableNameUrl:'medicalDrugGroup',labelName:'药品',tableName:'MEDICAL_DRUG_GROUP' },
        },
        tableNameUrl:'medicalDrugGroup',
        labelName:'药品',
        tableName:'MEDICAL_DRUG_GROUP',
      }
    },
    beforeMount(){
      this.searchQuery = debounce(this.searchQuery, 1000);//消抖
    },
    watch: {
      kind:{
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.kindChange(val)
            this.loadData();
          }
        },
      },
      selectionRows(val){
        this.$emit('select',val)
      }
    },
    methods:{
      kindChange(kind){
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.tableNameUrl = info.tableNameUrl
            this.labelName = info.labelName
            this.tableName = info.tableName
            this.url = {
              list: `/config/${this.tableNameUrl}/list`,
              delete: `/config/${this.tableNameUrl}/delete`,
              deleteBatch: `/config/${this.tableNameUrl}/deleteBatch`,
              deleteChild: `/config/${this.tableNameUrl}/delete`,
              deleteChildBatch: `/config/${this.tableNameUrl}/deleteBatch`,
              exportXlsUrl: `/config/${this.tableNameUrl}/exportXls`,
              importExcelUrl: `/config/${this.tableNameUrl}/importExcel`,
              exportExcelByThread: `/config/${this.tableNameUrl}/exportExcelByThread`,
              exportExcel: `/config/${this.tableNameUrl}/exportExcel`,
            };
            this.columns[0].title = this.labelName+'组编码'
            this.columns[1].title = this.labelName+'组名称'
          }
        }
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
