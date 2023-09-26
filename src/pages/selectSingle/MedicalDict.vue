<template>
  <m-modal
    centered
    :title="title"
    :visible="selectVisible"
    @ok="handleSelectOk"
    @cancel="selectVisible=false"
    cancelText="关闭">
      <medical-dict-list ref="selectPageRef" :isSelect="true" selectType="radio" :kind="kind" :readOnly="true"></medical-dict-list>
  </m-modal>
</template>

<script>
  import MedicalDictList from "@/pages/config/MedicalDictList"

  export default {
    name: 'MedicalDict',
    components: {MedicalDictList},
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
          this.$emit('ok',{id: records[0].groupId,code:records[0].groupCode,  name: records[0].groupName})
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
