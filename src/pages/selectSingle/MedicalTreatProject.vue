<template>
  <m-modal
    centered
    :title="title"
    :visible="selectVisible"
    @ok="handleSelectOk"
    @cancel="selectVisible=false"
    cancelText="关闭">
    <list-page ref="selectPageRef" selectType="radio"></list-page>
  </m-modal>
</template>

<script>
  import ListPage from "@/pages/selectMulti/MedicalTreatProject"

  export default {
    name: 'MedicalTreatProject',
    components: {ListPage},
    data() {
      return {
        title: '请选择服务项目',
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
          let {id,code,name} = this.$refs.selectPageRef
          this.$emit('ok',{id: records[0][id],code:records[0][code],  name: records[0][name]})
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
