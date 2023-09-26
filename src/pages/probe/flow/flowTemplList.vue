<template>
  <div>
    <div class="table-operations" style="margin-bottom: 5px">
      <j-input-search placeholder="输入名称模糊查询" class="m-t-6"
                      v-model="queryParam.nodeName"
                      @search="loadData(1)" />
    </div>
    <a-table
      size="middle"
      rowKey="nodeId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :customRow="rowClick"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
      @change="handleTableChange">
      <a-icon slot="filterIcon" slot-scope="filtered" type="search"/>
    </a-table>

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import JInputSearch from '@/components/jeecg/JInputSearch'

  export default {
    name: "flowTemplList",
    mixins: [JeecgListMixin],
    components: {JInputSearch},
    data() {
      return {
        data: [],
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          simple: true,
          total: 0
        },
        columns: [
          {
            title: '节点名称',
            dataIndex: 'nodeName',
            align: "center",
            width: '60%',
          },{
            title: '创建人',
            dataIndex: 'createUsername',
            align: "center",
            width: '40%',
          },
        ],
        url: {
          list: "/probe/medicalFlowTempl/list",
        },
        isorter:{
          column: 'createTime',
          order: 'desc',
        },

      }
    },
    methods: {
      rowClick(record,index){
        const that = this
        return ({
          style:{cursor:'pointer'},
          // 事件
          on: {
            click: () => {
              that.onSelectChange([record.nodeId],[record])
            }
          }
        })
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows
        this.loadRules(selectionRows[0])
      },
      loadCurrentPage(){
        this.loadData(this.ipagination.current)
      },
      loadRules(record){
        this.$emit('loadRules', record)
      },

    }
  }
</script>
<style scoped>

</style>
