<template>
  <m-modal
    centered
    :title="title"
    :visible="selectVisible"
    @ok="handleSelectOk"
    @cancel="selectVisible=false"
    cancelText="关闭">
    <list-page ref="selectPageRef" selectType="radio" :kind="kind"></list-page>
  </m-modal>
</template>

<script>
  import ListPage from "@/pages/selectMulti/MedicalGroupItem"

  export default {
    name: 'MedicalDict',
    components: {ListPage},
    props: ['kind'],
    data() {
      return {
        title: '请选择医疗字典',
        selectVisible: false
      }
    },
    beforeMount: function() {
    },
    methods: {
      handleSelectOk(){
        let records = this.$refs.selectPageRef.selectionRows
        if(records.length === 0){
          this.$message.warn('请选择')
        } else {
          this.selectVisible = false
          this.$emit('ok',{id: records[0].itemId,code:records[0].code,  name: records[0].value})
        }
      },
      show(){
        this.selectVisible = true
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
