<template>
  <div class="m-l-10">
    <breadcrumb :parent="{path:'/home'}" :info="`${projectBean.projectName||''}`" style="margin-bottom: 4px"  v-if="$route.query.parent=='home'"></breadcrumb>
    <breadcrumb :parent="{path:'/ybFjProject/orgProject'}" :info="`${projectBean.projectName||''}`" style="margin-bottom: 4px" v-else></breadcrumb>

    <a-card  :bodyStyle="{ paddingBottom: '0px',paddingTop: '10px'}" :bordered="false" style="margin-bottom: 10px">
      <a-tabs v-model="processStep" class="topTab" @change="processStepChange">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="bank" />
            医院复核
          </span>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="bars" />
            线上核减
          </span>
        </a-tab-pane>

      </a-tabs>

      <orgProcessTaskHosp v-if="processStep==1"/>
      <orgProcessTaskCut v-if="processStep==2"/>
    </a-card >

  </div>


</template>

<script>
import {getAction} from '@/api/manage'
import Breadcrumb from '@/components/Breadcrumb'
import ProjectInfo from "./plugin/projectInfo"
import projectTask from './plugin/projectTask'
import projectTaskModal from './modules/projectTaskModal'
import orgProcessTaskCut from "./orgProcessTaskCut"
import orgProcessTaskHosp from "./orgProcessTaskHosp"
export default {
  name: "process",
  components: {
    Breadcrumb,
    projectTask,
    projectTaskModal,
    orgProcessTaskCut,
    orgProcessTaskHosp
  },
  data() {
    return {
      url: {
        getProjectBean:"/fj/project/queryById",
        getProjectOrgBean:"/fj/projectOrg/queryById",
      },
      processStep:'1',
      projectBean:{},

    }
  },
  beforeMount() {
    this.getProjectBean()
  },
  methods: {
    getProjectBean(){
      this.projectBean = {}
      getAction(this.url.getProjectBean, {projectId: this.$route.query.projectId}).then((res) => {
        if (res.success) {
          this.projectBean = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    processStepChange(){
      this.$forceUpdate()
    },

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
<style lang="less" scoped>
  .topTab{
    /deep/.ant-tabs-bar{
      margin:0;
    }
  }

  .disRow {
    display: flex;
    flex-direction: row
  }
  .disCC {
    display: flex;
    justify-content: space-between;
    align-items: center
  }

</style>