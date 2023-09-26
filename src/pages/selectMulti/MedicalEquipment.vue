<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="产品编码">
              <j-input placeholder="输入产品编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.productcode"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="产品名称">
              <j-input placeholder="输入产品名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.productname"/>
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
    name: "MedicalEquipmentList",
    mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
    components: {
    },
    data() {
      return {
        description: '医疗器械信息管理页面',
        // 表头
        columns: [
          {
            title: '产品编码',
            width:200,
            align:"left",
            dataIndex: 'productcode',
          },
          {
            title: '产品名称',
            width:200,
            align:"left",
            dataIndex: 'productname',
            // ellipsis:true,
          },
          {
            title: '商品名称',
            width:100,
            align:"center",
            dataIndex: 'brandname',
            // ellipsis:true,
          },
          {
            title: '规格型号编码',
            width:120,
            align:"left",
            dataIndex: 'specificaioncode',
            // ellipsis:true,
          },
          {
            title: '规格型号',
            width:120,
            align:"left",
            dataIndex: 'specificaion',
            // ellipsis:true,
          },
          {
            title: '产品描述',
            width:300,
            align:"left",
            dataIndex: 'productdiscription',
            // ellipsis:true,
          },

        ],
        isorter: {
          column: 'orderId',
          order: 'asc',
        },
        url: {
          list: "/config/medicalEquipment/list",
          selectAll: "/config/medicalEquipment/selectAll",
        },
        fixedParam: {
          state: '1'
        },
        id: 'id',
        code: 'productcode',
        name: 'productname',
        paramInId:'productcode',//已选中 未选中查询的参数
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
  @import '~@assets/less/common.less'
</style>
