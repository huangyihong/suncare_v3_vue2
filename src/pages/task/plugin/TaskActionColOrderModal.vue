<template>

    <m-modal
            centered
            title="调整排序"
            width="1000px"
            :visible="selectVisible"
            @cancel="handleCancel"
            cancelText="关闭">
        <template slot="footer">
            <a-button @click="handleCancel">
                关闭
            </a-button>
            <a-button type="primary" ghost @click="$refs.componentRef.openSelect()" style="margin-left: 15px">
                选择
            </a-button>
            <a-button type="primary" :loading="loading" @click="handleSelectOk" style="margin-left: 15px">
                确定
            </a-button>
        </template>
        <task-action-col-order ref="componentRef" :type="type" @loading="val => loading = val"></task-action-col-order>
    </m-modal>
</template>
<script>
  const TaskActionColOrder = () => import('./TaskActionColOrder')
  export default {
    name: 'TaskActionColOrderModal',
    components: { TaskActionColOrder },
    data() {
      return {
        selectVisible: false,
        loading: false,
        type: undefined
      }
    },
    methods: {
      handleSelectOk() {
        this.$refs.componentRef.save()
      },
      handleCancel() {
        this.selectVisible = false
      },
      edit(type) {
        this.selectVisible = true
        this.type = type
        this.$nextTick(()=> {
          this.$refs.componentRef.loadData()
        })
      },
    },
  }
</script>
<style scoped>

</style>
