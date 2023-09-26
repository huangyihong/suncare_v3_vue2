<template>

    <m-modal
            centered
            title="汇总统计字段配置"
            width="800px"
            :visible="selectVisible"
            @cancel="handleCancel"
            cancelText="关闭">
        <template slot="footer">
            <a-button @click="handleCancel">
                关闭
            </a-button>
            <a-button type="primary" ghost v-if="isReset" @click="handleReset" style="margin-left: 15px">
                重置
            </a-button>
            <a-button type="primary" :loading="loading" @click="handleSelectOk" style="margin-left: 15px">
                确定
            </a-button>
        </template>
        <groupby ref="reorderRef"></groupby>
    </m-modal>
</template>
<script>
  const Groupby = () => import('./Groupby')
  export default {
    name: 'ReorderBtn',
    props: {
      isReset: {
        default: true,
        type: Boolean
      },
      value: String,
    },
    components: { Groupby },
    data() {
      return {
        selectVisible: false,
        loading: false,
        callback: undefined
      }
    },
    methods: {
      handleSelectOk() {
        this.$refs.reorderRef.getData(data => {
          this.loading = true
          this.callback(data).then(res => {
            this.handleCancel()
          }).finally(()=>{
            this.loading = false
          })
        })

        // this.$emit('ok', this.$refs.reorderRef.getData())
      },
      handleCancel() {
        this.selectVisible = false
      },
      handleReset() {
        this.$refs.reorderRef.clear()
      },
      edit(record, promiseFun) {
        // this.$emit('click')
        this.selectVisible = true
        this.callback = promiseFun
        this.$nextTick(()=> {
          this.$refs.reorderRef.edit(record)
        })
      },
    },
  }
</script>
<style scoped>

</style>
