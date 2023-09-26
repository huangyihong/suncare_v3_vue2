<template>
  <div>
    <a-tabs v-model="taskType" @change="callback">
      <a-tab-pane key="search" tab="收费明细导出">
      </a-tab-pane>
      <a-tab-pane key="drugRuleStatistics" tab="药品收费违规查询">
      </a-tab-pane>
      <a-tab-pane key="yearStatistics" tab="年度统计指标">
      </a-tab-pane>
      <a-tab-pane key="visitStatistics" tab="住院及门慢清单">

      </a-tab-pane>
      <a-tab-pane key="itemStatistics" tab="医保收费清单汇总(按医院)">

      </a-tab-pane>
      <a-tab-pane key="itemByDeptStatistics" tab="医保收费清单汇总(按科室)"/>

      <a-tab-pane key="itemByVisitStatistics" tab="医保收费清单汇总(按就诊)"/>

      <a-tab-pane key="riskStatistics" tab="数据挖掘分析">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

export default {
  name: "taskTypeTab",
  props: {
    taskType: {
      type: String,
      required: true
    },
  },
  components: {
  },
  data () {
    return {

    }
  },
  methods: {
    callback(key) {
      this.$emit('changeTaskType',key);
    }
  }
}
</script>
<style lang="less" scoped>

</style>
