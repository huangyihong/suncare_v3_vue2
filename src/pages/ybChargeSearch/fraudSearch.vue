<template>
  <div>
    <fraudPatientForm :taskType="taskType" v-if="taskType=='fraud_patient'"/>
    <fraudProjectForm :taskType="taskType" v-if="taskType=='fraud_project'"/>
    <fraudHospitalForm :taskType="taskType" v-if="taskType=='fraud_hospital'"/>
  </div>
</template>

<script>
import fraudPatientForm from './plugin/fraudPatientForm'
import fraudProjectForm from './plugin/fraudProjectForm'
import fraudHospitalForm from './plugin/fraudHospitalForm'
export default {
  name: "fraudSearch",
  components: {
    fraudPatientForm,
    fraudProjectForm,
    fraudHospitalForm
  },
  data () {
    return {
      taskType:'fraud_project',
    }
  },
  beforeMount() {
    let pathStrArr = this.$route.path.split('/')
    this.taskType = pathStrArr[pathStrArr.length-1]
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>

</style>
