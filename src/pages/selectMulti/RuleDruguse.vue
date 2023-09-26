<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :xs="12">
            <a-form-item label="项目编码">
              <j-input placeholder="请输入(模糊查询)" v-model="queryParam.itemCodes"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="项目名称">
              <j-input placeholder="请输入(模糊查询)" v-model="queryParam.itemNames"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :xs="12">
              <a-form-item label="规则编码">
                <j-input placeholder="请输入(模糊查询)" v-model="queryParam.ruleCode"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="提示信息">
                <j-input placeholder="请输入(模糊查询)" v-model="queryParam.message"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :xs="12">
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

      <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="ruleId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">

      </a-table>
    </div>
    <!-- table区域-end -->
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalTreatProjectList",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin,postListMixin],
    props: [],
    components: {
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '药品编码',
            align: "center",
            dataIndex: 'itemCodes',
            width: 200,
            // fixed: true,
          },
          {
            title: '药品名称',
            align: "center",
            dataIndex: 'itemNames',
            width: 200,
            // fixed: true,
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 180,
          },
          {
            title: '政策依据',
            align: "center",
            dataIndex: 'ruleBasis',
            width: 180,
          },
        ],
        url: {
          list: "/medical/medicalDruguse/list",
          selectAll: "/medical/medicalDruguse/selectAll",
        },
        /* 排序参数 */
        isorter: {
          column: 'itemCodes',
          order: 'asc',
        },
        fixedParam: {
        },
        id: 'ruleId',
        code: 'itemCodes',
        name: 'itemNames',
        paramInId:'ruleId',//已选中 未选中查询的参数
      }
    },
    methods: {
      searchQuery(){
        this.postloadData(1);
      },
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
