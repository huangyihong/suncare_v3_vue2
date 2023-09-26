<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="项目编码">
              <j-input placeholder="请输入项目编码模糊查询" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="项目名称">
              <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.name"></j-input>
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
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <!-- 字符串超长截取省略号显示 -->
        <span slot="name" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'


  export default {
    name: "MedicalTreatProjectListEquipment",
    mixins: [JeecgListMixin,multiSelectMixin],
    components: {
      JEllipsis,
    },
    props:{
      fixedParam: Object
    },
    data() {
      return {
        description: '收费项目管理页面',
        // 表头
        columns: [

          {
            title: '项目编码',
            align: "center",
            dataIndex: 'code',
            width: 180
          },
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'name',
            width: 200,
            // scopedSlots: { customRender: 'name' }
          },
          {
            title: '分类编码',
            align: "center",
            dataIndex: 'typeCode',
            width: 120
          },
          {
            title: '分类名称',
            align: "center",
            dataIndex: 'typeName',
            width: 120
          },
        ],
        url: {
          list: "/config/medicalTreatProject/listTreatProjectEquipment",
        },
        isorter:{
          column: 'code',
          order: 'asc',
        },
      }
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
