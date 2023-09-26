<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="分组编码">
              <j-input placeholder="请输入分组编码模糊查询" v-model="queryParam.groupType"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="分组名称">
              <j-input placeholder="请输入分组名称模糊查询" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              </span>
             </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
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
    data() {
      return {
        description: '分组信息管理页面',
        // 表头
        columns: [
          {
            title: '分组编码',
            align: "center",
            dataIndex: 'groupType',
            width: 180
          },
          {
            title: '分组名称',
            align: "center",
            dataIndex: 'groupName',
            width: 180
          },
          {
            title: '字典类型',
            align: "center",
            dataIndex: 'kind_dictText',
            width: 120
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark',
            width: 200
          },

        ],
        url: {
          list: "/medical/medicalDrugRuleGroup/list",
        },
        toggleSearchStatus: false,
        code: 'groupType',
        name: 'groupName',
      }
    },
    watch: {
      kind:{
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.fixedParam.kind = val
          }
        },
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
