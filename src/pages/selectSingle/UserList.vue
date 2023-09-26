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
  import ListPage from "@/pages/selectMulti/UserList"

  export default {
    name: 'MedicalDict',
    components: {ListPage},
    props: {
      title: {
        type: String,
        default: '请选择用户'
      },
    },
    data() {
      return {
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
          console.log('records',records)
          this.selectVisible = false
          this.$emit('ok',{id: records[0].id,
            code:records[0][this.$refs.selectPageRef.code],
            name:records[0][this.$refs.selectPageRef.name],
          })
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
