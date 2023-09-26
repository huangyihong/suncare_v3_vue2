<template>
  <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" :bordered="false">
    <project-task ref="projectTaskModal" processStep="taskHospOrg" :projectOrgId="$route.query.projectOrgId" @showTaskInfo="showTaskInfo">
    </project-task>


    <!-- 反馈信息 -->
    <project-task-modal ref="taskModal" @ok="refreshTaskList" processStep="taskHospOrg"></project-task-modal>
  </a-card>
</template>


<script>
import projectTask from './plugin/projectTask'
import projectTaskModal from './modules/projectTaskModal'
export default {
  name: "orgProcessTaskCut",
  components: {
    projectTask,
    projectTaskModal
  },
  data() {
    return {

    }
  },
  methods: {
    showTaskInfo(record,fnType){
      this.$refs.taskModal.fnType = fnType
      this.$refs.taskModal.projectOrgId = this.$route.query.projectOrgId
      this.$refs.taskModal.disableSubmit = fnType=='view'?true:false
      this.$refs.taskModal.readonly = fnType=='view'?true:false
      this.$refs.taskModal.edit(record)
    },
    refreshTaskList(){
      this.$refs.projectTaskModal.getTaskList();
    },
  }
}
</script>
