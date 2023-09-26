<template>
  <medical-group-list :isSelect="isSelect" :selectType="selectType" kind="7"></medical-group-list>
</template>

<script>
  import MedicalGroupList from './MedicalGroupList'


  export default {
    name: "MedicalDrugGroupList",
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
      MedicalGroupList
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