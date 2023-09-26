<template>
    <div class="inline-block">
      <div @click="show" class="inline-block">
        <slot></slot>
      </div>
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
        <reorder ref="reorderRef" :columns="columns" :isorter="isorter" :tolowercase="tolowercase" :single="single"></reorder>
      </m-modal>
    </div>
</template>
<script>
  const Reorder = ()=> import('@/components/Reorder')
  export default {
    name: 'ReorderBtn',
    props:{
      columns: Array,
      isorter: Object,
      tolowercase: Boolean,
      single: Boolean,
      isReset:{
        default:true,
        type:Boolean
      }
    },
    components: { Reorder },
    data() {
      return {
        selectVisible: false
      }
    },
    mounted(){
      console.log('this.$listeners',this.$listeners)
    },
    methods: {
      handleSelectOk(){
        this.handleCancel()
        this.$emit('ok',this.$refs.reorderRef.getSort())
      },
      handleCancel(){
        this.selectVisible = false
      },
      handleReset(){
        this.handleCancel()
        this.$emit('ok', {
          column: 'createTime',
          order: 'desc',
        })
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
