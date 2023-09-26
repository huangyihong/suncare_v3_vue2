<template>

  <a-table
    ref="table"
    size="middle"
    :bordered="false"
    rowKey="itemId"
    :showHeader="false"
    :columns="columns"
    :dataSource="dataSource"
    :pagination="false"
    :loading="loading">
    <span slot="action" slot-scope="text, record" v-if="!readonly">
       <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.itemId)">
         <a>删除</a>
       </a-popconfirm>
    </span>
  </a-table>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: "MedicalInstructionItemList",
  mixins: [JeecgListMixin],
  props: {
    readonly: Boolean,
    parentId: String,
    kind:String,
  },
  components: {},
  data() {
    const columns = [
      {
        title: '子项编码',
        align: "center",
        dataIndex: 'itemCode',
        width: '30%',
      },
      {
        title: '子项的值',
        align: "center",
        dataIndex: 'itemValue',
        width: '30%',
      },
      {
        title: '指向表',
        align: "center",
        dataIndex: 'tableType',
        width: '30%',
      },

    ]
    if (!this.readonly) {
      columns.push({
        title: '操作',
        dataIndex: 'action',
        align: "center",
        scopedSlots: { customRender: 'action' },
        // width: 180
      })
    }
    return {
      description: '分组子项管理页面',
      // 表头
      columns: columns,
      url: {},
      fixedParam: { parentId: this.parentId },
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 9999999,
      },
      /* 排序参数 */
      isorter: {
        column: 'isOrder',
        order: 'asc',
      },
      selectInfos: {
        '1': { tableNameUrl:'medicalDrugInstructionItem',labelName:'药品' },
        '2': { tableNameUrl:'medicalEquipInstructionItem',labelName:'医疗器械' },
      },
      tableNameUrl:'medicalEquipInstructionItem',
    }
  },
  watch: {
    kind: {
      immediate: true,
      handler(val) {
        if(val && val.length > 0){
          this.kindChangeUrl(val);
        }
      }
    }
  },
  beforeMount() {
    this.kindChangeUrl(this.kind);
  },
  methods: {
    kindChangeUrl(kind){
      if (kind && kind.length > 0) {
        let info = this.selectInfos[kind]
        if (info) {
          this.tableNameUrl = info.tableNameUrl
          this.url = {
            list: `/config/${this.tableNameUrl}/list`,
            delete: `/config/${this.tableNameUrl}/delete`,
          };
        }
      }
    }

  }
}
</script>
<style scoped>
</style>
