import { putAction } from '@/api-sv3/manage'
import {hasPermission} from '@/utils/hasPermission'
export default {
  components: { },
  data() {
    this.changeStatusUrl = '/medical/medicalRuleConfig/changeStatus'
    this.statusDict =  {
      normal: 'normal',
      stop: 'stop'
    }
    return {
    }
  },
  computed: {
    hasAdd(){
      return this.hasPermission('ruleConfig:add')
    },
    hasDel(){
      return this.hasPermission('ruleConfig:del')
    },
    hasExport(){
      return this.hasPermission('ruleConfig:export')
    },
    hasImport(){
      return this.hasPermission('ruleConfig:import')
    }
  },
  beforeMount: function() {
  },
  methods: {
    hasPermission,
    changeStatus(index) {
      let record = this.dataSource[index]
      let statusDict = this.statusDict
      let status = record.status === statusDict.normal ? statusDict.stop : statusDict.normal
      this.$set(record, 'statusLoading', true)
      putAction(this.changeStatusUrl, { ids: record.ruleId, status }).then((res) => {
        if (res.success) {
          this.$set(record, 'status', status)
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.$set(record, 'statusLoading', false)
      })

    },
    changeStatusBatch(status){
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      }
      this.loading = true
      putAction(this.changeStatusUrl, { ids: this.selectedRowKeys.join(','), status }).then((res) => {
        if (res.success) {
          let idSet = new Set(this.selectedRowKeys)
          this.dataSource.forEach(r => idSet.has(r.ruleId) && (r.status = status))
          this.dataSource = [...this.dataSource]
          this.onClearSelected()
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}