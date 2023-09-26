<template>
  <m-modal
    centered
    :title="title"
    :visible="selectVisible"
    @ok="handleSelectOk"
    @cancel="selectVisible=false"
    cancelText="关闭">
    <list-page ref="selectPageRef" selectType="radio" :fixedParam="fixedParam"></list-page>
  </m-modal>
</template>

<script>
  import ListPage from "@/pages/selectMulti/MedicalStdAtc"

  export default {
    name: 'MedicalStdAtc',
    components: {ListPage},
    props:{
      fixedParam: Object,
    },
    data() {
      return {
        title:'选择',
        selectVisible: false
      }
    },
    beforeMount: function() {
    },
    methods: {
      handleSelectOk(){
        let records = this.$refs.selectPageRef.selectionRows
        if(records.length === 0){
          //this.$message.warn('请选择')
          this.selectVisible = false
          this.$emit('ok',{id: '',code:'',  name: ''})
        } else {
          this.selectVisible = false
          this.$emit('ok',{id: records[0].id,code:records[0].code, name: records[0].name})
        }
      },
      show(title){
        if(title){
          this.title = title
        }
        this.selectVisible = true
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
