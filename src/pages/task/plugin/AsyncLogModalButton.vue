<template>
    <span>
    <m-modal
            centered
            title="异步操作进度"
            width="1000px"
            :visible="selectVisible"
            @cancel="handleCancel"
            cancelText="关闭">
        <template slot="footer">
            <a-button @click="handleCancel">
                关闭
            </a-button>
             <a-button type="primary" @click="toAutoRefresh" style="margin-left: 15px">
                <template v-if="autoRefresh">关闭</template>自动刷新
            </a-button>
            <a-button type="primary" :disabled="autoRefresh && refreshTime === 0" @click="toRefresh" style="margin-left: 15px">
                刷新 <template v-if="refreshTime > 0">({{refreshTime}})</template>
            </a-button>
        </template>
        <task-async-action-log-mini ref="reorderRef" v-bind="$attrs" @countdown="startCountdown"></task-async-action-log-mini>
    </m-modal>

    <a-button type="primary" @click="show()"><slot>异步操作日志</slot></a-button>
    </span>
</template>
<script>
  const TaskAsyncActionLogMini = () => import('@/pages/task/TaskAsyncActionLogMini')

  export default {
    name: 'TaskAsyncActionLogMiniModal',
    components: { TaskAsyncActionLogMini },
    data() {
      return {
        selectVisible: false,
        loading: false,
        callback: undefined,
        refreshTime: 0,
        autoRefresh: false
      }
    },
    methods: {
      handleCancel() {
        this.selectVisible = false
        if(this.countdown){
          clearTimeout(this.countdown)
        }
      },
      show(){
        this.selectVisible = true
        this.$refs.reorderRef && this.refresh()
      },
      toAutoRefresh(){
        if(this.autoRefresh){
          this.autoRefresh = false
          this.refreshTime = 0
          if(this.countdown){
            clearTimeout(this.countdown)
          }
        } else {
          this.autoRefresh = true
          this.toRefresh()
        }
      },
      toRefresh(){
        clearTimeout(this.countdown)
        this.refresh()
      },
      refresh(){
        this.refreshTime = 0
        this.$refs.reorderRef.loadData()
      },
      startCountdown(){
        if(!this.autoRefresh || !this.selectVisible){
          return
        }
        if(this.refreshTime === 0){
          this.refreshTime = 5
        }
        this.countdown = setTimeout(() => {
          if(--this.refreshTime === 0){
            this.countdown = undefined
            this.refresh()
          } else {
            this.startCountdown()
          }
        },1000)
      },
    },
  }
</script>
<style scoped>

</style>
