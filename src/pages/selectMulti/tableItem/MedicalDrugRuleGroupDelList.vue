<template>
  <a-table
    ref="table"
    size="middle"
    :bordered="false"
    rowKey="id"
    :columns="columns"
    :dataSource="dataSource"
    :pagination="false"
    :loading="loading"
    :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
    v-bind="tableAttrs">
  </a-table>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "MedicalDrugRuleGroupDelList",
    mixins: [JeecgListMixin],
    props: {
      groupId: String,
      selected: Array
    },

    data() {
      return {
        columns: [
          {
            title: '字典项代码',
            align: "center",
            dataIndex: 'code',
            width: '50%'
          },
          {
            title: '字典项名称',
            align: "center",
            dataIndex: 'value',
            width: '50%'
          },
        ],
        url: {
          list: "/medical/medicalDrugRuleGroupDel/list",
        },
        queryParam: {
          groupId: this.groupId
        },
        initialSelected: []
      }
    },
    watch: {
      dataSource(val){
        this.setSelect()
      },
      selected(val){
        this.setSelect()
      }
    },
    methods: {
      setSelect(){
        this.selectedRowKeys = []
        this.initialSelected = []
        this.dataSource.forEach(r =>{
          if(this.selected.some(item => item.code === r.code)){
            this.selectedRowKeys.push(r.id)
            this.initialSelected.push(r.code)
          }
        })
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows

        this.$emit('selectChange', {selected:selectionRows, initSelected: this.initialSelected})
        this.initialSelected = selectionRows.map(item => item.code)
      },
    }
  }
</script>
<style scoped>
</style>
