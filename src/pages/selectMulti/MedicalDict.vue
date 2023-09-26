<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item label="分组编码">
              <a-input placeholder="请输入分组编码" v-model="queryParam.groupCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="分组名称">
              <j-input placeholder="请输入分组名称" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
         <!-- <a-col :span="6">
            <a-form-item label="字典类型">
              <m-dict-select-tag placeholder="字典类型" dictCode="DRUG_GROUP_KIND" showKey=true
                                 v-model="queryParam.kind"></m-dict-select-tag>
            </a-form-item>
          </a-col>-->
          <template v-if="toggleSearchStatus">
            <a-col :span="6">
              <a-form-item label="字典项代码">
                <j-input placeholder="请输入字典项代码" v-model="queryParam.code"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="字典项名称">
                <j-input placeholder="请输入字典项名称" v-model="queryParam.value"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="6">
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
        :bordered="false"
        rowKey="groupId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange">
        <medical-dict-item-list :groupId="record.groupId" :readonly="true" :key="record" slot="expandedRowRender"
                                slot-scope="record"></medical-dict-item-list>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import MedicalDictItemList from '@/pages/config/MedicalDictItemList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import JEllipsis from '@/components/jeecg/JEllipsis'


  export default {
    name: "MedicalDictList",
    mixins: [JeecgListMixin, multiSelectMixin],
    props: ['kind'],
    components: {
      MedicalDictItemList,
      MDictSelectTag,
      JEllipsis
    },
    data() {
      const columns = [
        {
          title: '分组编码',
          align: "left",
          dataIndex: 'groupCode',
          // scopedSlots: { customRender: 'code' },
          width: 180,
        },
        {
          title: '分组名称',
          align: "center",
          dataIndex: 'groupName',
          width: 180,
        },
        {
          title: '字典类型',
          align: "center",
          dataIndex: 'kind_dictText',
          width: 120,
        },
        {
          title: '描述',
          align: "center",
          dataIndex: 'remark',
          // scopedSlots: { customRender: 'remark' },
          width: 250,
        },

      ]
      return {
        description: '药品合规规则分组管理页面',
        // 表头
        columns: columns,
        url: {
          list: "/config/medicalDict/list",
          delete: "/config/medicalDict/delete",
          deleteBatch: "/config/medicalDict/deleteBatch",
          deleteChild: "/config/medicalDictItem/delete",
          deleteChildBatch: "/config/medicalDictItem/deleteBatch",
          exportXlsUrl: "/config/medicalDict/exportXls",
          importExcelUrl: "/config/medicalDict/importExcel",
        },
        /* 排序参数 */
        isorter: {
          column: 'isOrder,groupCode',
          order: 'asc,asc',
        },
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
