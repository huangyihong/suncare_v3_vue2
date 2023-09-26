<template>
    <div style="display: inline-block">
      <a-button @click="show" type="primary" icon="ordered-list" v-bind="$attrs">
        <slot></slot>
      </a-button>
      <m-modal
        centered
        title="列表排序"
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
          <a-button type="primary" @click="handleSelectOk" style="margin-left: 15px">
            确定
          </a-button>
        </template>
        <groupby ref="reorderRef"></groupby>
      </m-modal>
    </div>
</template>
<script>
  const Groupby = ()=> import('./Groupby')
  export default {
    name: 'ReorderBtn',
    props:{
      isReset:{
        default:true,
        type:Boolean
      }
    },
    components: { Groupby },
    data() {
      return {
        selectVisible: false
      }
    },
    methods: {
      handleSelectOk(){
        this.handleCancel()
        this.$emit('ok',this.$refs.reorderRef.getData())
      },
      handleCancel(){
        this.selectVisible = false
      },
      handleReset(){
        this.$refs.reorderRef.clear()
        this.handleCancel()
        this.$emit('ok', [])
      },
      show(){
        // this.$emit('click')
        if(this.$listeners.click){
          this.$emit('click',()=>{
            this.$nextTick(()=>{
              this.selectVisible = true
            })
          })
        } else {
          this.selectVisible = true
        }

      }
    },
  }
</script>
<style scoped>

</style>
