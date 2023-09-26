<template>
  <medical-group-list :isSelect="isSelect" :selectType="selectType" kind="5"></medical-group-list>
</template>

<script>
  import MedicalGroupList from './MedicalGroupList'


  export default {
    name: "MedicalDiseaseGroupList",
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