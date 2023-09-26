<template>
  <medical-instruction-list :isSelect="isSelect" :selectType="selectType" kind="1"></medical-instruction-list>
</template>

<script>
  import MedicalInstructionList from './MedicalInstructionList'


  export default {
    name: "MedicalDrugInstructionList",
    props: {
      isSelect: {
        type: Boolean,
        default: false
      },
      selectType: {
        type: String,
        default: 'checkbox'
      },
    },
    components: {
      MedicalInstructionList
    },
    data() {
      return {

      }
    },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>