<template>
  <div>
    <!-- 查询区域 -->
  <!--  <div class="table-page-search-wrapper">
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
-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addItem" type="primary" >新增</a-button>
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
        rowKey="code"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX, y: scrollY}">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.ruleId)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MedicalDictItem",
    mixins: [JeecgListMixin],
    components: {
    },
    props: {
      dictCode:String,
      selectType: {
        type: String,
        default: 'checkbox'
      },
      edit: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        description: '字典项信息管理页面',
        // 表头
        columns: [
          {
            title: '子项编码',
            align: "left",
            dataIndex: 'code',
            width: 100
          },
          {
            title: '子项名称',
            align: "center",
            dataIndex: 'value',
            width: 150,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
          },

        ],
        id: 'itemId',
        code: 'code',
        name: 'name',
        initLoad: false
      }
    },
    beforeMount(){
    },
    watch: {
      dictCode:{
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.loadData(val);
          }
        },
      },
    },
    methods:{
      loadData(code){
        this.loading = true
        this.$util.initDict(code).then(data => {
          this.dataSource = data
        }).finally(()=>{
          this.loading = false
        })
      },
      addItem(){
        this.dataSource.push({
          code: undefined,
          value: undefined,
          isEdit: true
        })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
