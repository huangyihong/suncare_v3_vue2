<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="编码">
              <j-input placeholder="请输入编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="名称">
              <j-input placeholder="请输入名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.value"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search" title="查询"></a-button>
                <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6" title="重置"></a-button>

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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{x:scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">

      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalOtherDictList",
    mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
    components: {
    },
    props:{
      fixedParam: Object,
      selectType: {
        type: String,
        default: 'checkbox'
      },
    },
    data() {
      return {
        description: '医疗其他字典管理页面',
        // 表头
        columns: [
          {
            title: '编码',
            align: "left",
            dataIndex: 'code',
            width: 180,
          },
          {
            title: '名称',
            align: "left",
            dataIndex: 'value',
            width: 180,
          },
          {
            title: '父级编码',
            align: "left",
            dataIndex: 'parentCode',
            width: 180,
          },
          {
            title: '父级名称',
            align: "left",
            dataIndex: 'parentValue',
            width: 180,
          },
          {
            title: '排序号',
            align: "left",
            dataIndex: 'isOrder',
            width: 80,
          },
          {
            title: '字典英文名称',
            align: "left",
            dataIndex: 'dictEname',
            width: 180,
          },
          {
            title: '字典中文名称',
            align: "left",
            dataIndex: 'dictCname',
            width: 180,
          },

        ],
        url: {
          list: "/config/medicalOtherDict/list",
          selectAll: "/config/medicalOtherDict/selectAll",
        },
        code: 'code',
        name: 'value',
        id: 'id',
        /*isorter: {
          column: 'dictEname,parentCode,isOrder,code',
          order: 'asc,asc,asc,asc',
        }, */
        isorter: {
          column: 'dictEname,isOrder,code',
          order: 'asc,asc,asc',
        },
        paramInId:'code',//已选中 未选中查询的参数
      }
    },
    methods: {
      searchQuery(){
        this.postloadData(1);
      },
    }
  }
</script>
<style scoped>
</style>
