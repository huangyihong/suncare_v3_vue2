<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xxl="6" :xs="8">
            <a-form-item :label="labelName+'组编码'">
              <j-input placeholder="请输入分组编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.groupCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :xs="8">
            <a-form-item :label="labelName+'组名称'">
              <j-input placeholder="请输入分组名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xxl="6" :xs="8">
              <a-form-item :label="labelName+'代码'">
                <a-input placeholder="请输入子项代码精确查询" v-model="queryParam.code"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xs="8">
              <a-form-item :label="labelName+'名称'">
                <a-input placeholder="请输入子项名称精确查询" v-model="queryParam.value"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xxl="6" :xs="8">
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

      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'


  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin, multiSelectMixin],
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
            width: 200
          },
          {
            title: '分组名称',
            align: "center",
            dataIndex: 'groupName',
            width: 200,
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark',
            width: 250,
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
        id: 'groupId',
        code: 'groupCode',
        name: 'groupName',
      }
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
      selectedRowRecords(val){
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
