<template>
  <div>
    <a-drawer
      :title="title"
      :width="800"
      placement="right"
      :closable="false"
      @close="close"
      :destroyOnClose="true"
      :visible="visible">

      <a-collapse v-model="activeKey" destroyInactivePanel :bordered="false">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="0" header="全量统计" :style="panelStyle">
          <module0 ref="module0" :param="{...param, step: 1}"></module0>
        </a-collapse-panel>
        <a-collapse-panel key="1" header="初审实时-未判定统计" :style="panelStyle">
          <module1 ref="module1" :param="{...param, step: 1}"></module1>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="复审实时-项目全量统计" :style="panelStyle">
          <module2 ref="module2" :param="param"></module2>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="复审实时-不合规行为统计" :style="panelStyle">
          <module3 ref="module3" :param="param"></module3>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="白名单归因统计" :style="panelStyle">
          <module4 ref="module4" :param="param"></module4>
        </a-collapse-panel>
        <a-collapse-panel key="5" header="初审/复审结果对比" :style="panelStyle">
          <module5 ref="module5" :param="param"></module5>
        </a-collapse-panel>
      </a-collapse>
      <div class="drawer-bottom">
        <a-button @click="handleCancel">关闭</a-button>
      </div>
    </a-drawer>

    <m-modal
      centered
      title="请选择统计的项目批次"
      :width="500"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="handleSelectClose"
      cancelText="关闭">
      <!--<task-action-field-col ref="selectRef" :selected="selectData" :param="{toSearch: '1'}"></task-action-field-col>-->
      <task-project-batch-tree ref="selectRef"></task-project-batch-tree>
    </m-modal>
  </div>
</template>

<script>
  import { postAction } from '@/api-sv3/manage'
  import TaskProjectBatchTree from '@/pages/selectMulti/TaskProjectBatchTree'
  const Module0 = () => import('@/pages/task/plugin/statistic/Module0')
  const Module1 = () => import('@/pages/task/plugin/statistic/Module1')
  const Module2 = () => import('@/pages/task/plugin/statistic/Module2')
  const Module3 = () => import('@/pages/task/plugin/statistic/Module3')
  const Module4 = () => import('@/pages/task/plugin/statistic/Module4')
  const Module5 = () => import('@/pages/task/plugin/statistic/Module5')
  export default {
    name: 'StatisticModal',
    components: {
      TaskProjectBatchTree,
      Module0,
      Module1,
      Module2,
      Module3,
      Module4,
      Module5,
    },
    data() {

      return {
        title: '项目批次审核统计',
        visible: false,
        model: {},
        confirmLoading: false,
        selectVisible: false,
        activeKey: [],
        panelStyle: 'background: white;border:none',
        param: {}
      }
    },
    beforeMount() {

    },
    methods: {
      show() {
        // this.visible = true;
        this.selectVisible = true
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleCancel() {
        this.close()
      },
      handleSelectOk() {
        let data = this.$refs.selectRef.getSelect()
        if (data.length > 0) {
          // let dataSources = data[0].join(',')
          let projectIds = data[1].join(',')
          let batchIds = data[2].join(',')
          // this.param = {projectIds, batchIds, step: 1}
          // this.visible = true
          this.$router.push({path: '/review/reviewStatisticView', query: {projectIds, batchIds}})
          this.activeKey = []
        }

        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      }
    },
    computed: {}
  }
</script>

<style lang="less" scoped>
</style>
