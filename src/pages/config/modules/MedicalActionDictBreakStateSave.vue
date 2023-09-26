<template>
  <m-modal
    centered
    destroyOnClose
    title="请选择需要更新的项目批次"
    :width="500"
    :visible="visible"
    :maskClosable="false">
    <template slot="footer">
      <a-button @click="handleCancel">
        关闭
      </a-button>
      <a-button type="primary" :loading="loading" @click="handleOk" style="margin-left: 15px">
        确定
      </a-button>
    </template>
    <!--<task-action-field-col ref="selectRef" :selected="selectData" :param="{toSearch: '1'}"></task-action-field-col>-->
    <task-project-batch-tree-filter ref="selectRef" :param="{actionId: data.actionId}" tip="只显示存在当前不合规行为的项目批次"></task-project-batch-tree-filter>
    <!--<task-project-batch-tree-filter ref="selectRef" :param="{actionId: model.actionId}" tip="只显示存在当前不合规行为的项目批次"></task-project-batch-tree-filter>-->
  </m-modal>
</template>

<script>
  import TaskProjectBatchTreeFilter  from '@/pages/selectMulti/TaskProjectBatchTreeFilter'
  import { postAction } from '@/api-sv3/manage'

  export default {
    name: 'MedicalActionDictBreakStateSave',
    components: {TaskProjectBatchTreeFilter},
    props: {
    },
    data() {
      return {
        visible: false,
        loading: false,
        url: {
          saveBreakStateTemplData: '/apiTask/taskActionFieldConfig/saveBreakStateTemplData'
        },
        data: {}
      }
    },
    methods: {
      handler(data){
        this.data = data
        this.visible = true
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      handleCancel() {
        this.visible = false
        this.resolve()
      },
      handleOk() {
        let data = this.$refs.selectRef.getSelect()
        if(data.length > 0){
          let dataSources = data[0].join(',')
          let projectIds = data[1].join(',')
          let batchIds = data[2].join(',')
          this.loading = true
          postAction(this.url.saveBreakStateTemplData, {...this.data,
            dataSources, projectIds, batchIds
          }).then(res => {
            if (res.success) {
              this.$message.success(res.result)
              this.handleCancel();
            } else {
              this.$message.warning(res.message);
              this.reject()
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.handleCancel();
        }
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
