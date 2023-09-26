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
  import { deleteAction } from '@/api/manage'

  export default {
    name: "MedicalDictItemList",
    mixins: [JeecgListMixin],
    props: {
      readonly: Boolean,
      groupId: String,
      groupCode: String,
      kind: String,
    },
    components: {},
    data() {
      const columns = [
        {
          title: '字典项编码',
          align: "left",
          dataIndex: 'code',
          width: '50%',
          customRender: (text, record, index) => {
            return <span class="m-l-60">{text}</span>;
          },
        },
        {
          title: '字典项的值',
          align: "center",
          dataIndex: 'value',
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
        description: '医疗字典子项管理页面',
        // 表头
        columns: columns,
        url: {
          list: "/config/medicalDictItem/list",
          delete: "/config/medicalDictItem/delete",
          deleteBatch: "/config/medicalDictItem/deleteBatch",
          exportXlsUrl: "config/medicalDictItem/exportXls",
          importExcelUrl: "config/medicalDictItem/importExcel",
        },
        fixedParam: { groupId: this.groupId },
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
      }
    },
    methods: {
      handleDelete: function(id) {
        this.loading = true
        const that = this
        this.$util.clearCache('MDict_' + this.groupCode)
        deleteAction(that.url.delete,
                { id: id,groupCode: this.groupCode,kind: this.kind  }).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.loadData()
          } else {
            that.loading = false
            that.$message.warning(res.message)
          }
        })
      },
    }
  }
</script>
<style scoped>
</style>
