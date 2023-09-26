<template>
  <div style="width:800px">
    <a-table
      ref="table"
      size="small"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      hideTools
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange">
    </a-table>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  name: "ReportTable",
  mixins: [JeecgListMixin],
  props:['columns','dataSource'],
  data() {
    return {
      initLoad: false,
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      this.$emit('onSelectChange',this.selectionRows);
    },
  },
}
</script>