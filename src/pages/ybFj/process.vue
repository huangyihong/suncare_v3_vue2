<template>
  <div class="m-l-10">
    <breadcrumb :parent="{path:'/ybFjProject/projectIndex'}" :info="`${projectBean.projectName||''}/${projectOrgBean.orgName||''}`" style="margin-bottom: 4px" ></breadcrumb>

    <a-card  :bodyStyle="{ paddingBottom: '0px',paddingTop: '10px'}" :bordered="false" style="margin-bottom: 10px">
      <a-tabs v-model="processStep" class="topTab" @change="processStepChange">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="check-square" />
            线索提交
          </span>

        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="bank" />
            医院复核
          </span>

        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <a-icon type="bars" />
            线上核减
          </span>
        </a-tab-pane>
        <a-tab-pane key="4">
          <span slot="tab">
            <a-icon type="codepen" />
            现场检查
          </span>
        </a-tab-pane>
        <a-tab-pane key="5">
          <span slot="tab">
            <a-icon type="aliwangwang" />
            检查动态
          </span>
        </a-tab-pane>
        <a-tab-pane key="6">
          <span slot="tab">
            <a-icon type="profile" />
            检查基本信息
          </span>
          <a-card  :bordered="false" style="margin-top:10px;">
            <project-info :item="projectBean"></project-info>
          </a-card>
        </a-tab-pane>
      </a-tabs>

      <process-task v-if="processStep==1"></process-task>
      <process-task-hosp v-if="processStep==2"></process-task-hosp>
      <process-task-cut v-if="processStep==3"></process-task-cut>
      <process-onsite v-if="processStep==4"></process-onsite>
    </a-card >

  </div>


</template>

<script>
import {getAction} from '@/api/manage'
import Breadcrumb from '@/components/Breadcrumb'
import processTask from './processTask'
import processTaskHosp from './processTaskHosp'
import processTaskCut from './processTaskCut'
import processOnsite from './processOnsite'
import ProjectInfo from "./plugin/projectInfo";
export default {
  name: "process",
  components: {
    ProjectInfo,
    Breadcrumb,
    processTask,
    processTaskHosp,
    processTaskCut,
    processOnsite,
  },
  data() {
    return {
      url: {
        getProjectBean:"/fj/project/queryById",
        getProjectOrgBean:"/fj/projectOrg/queryById",
      },
      processStep:'1',

      projectBean:{},
      projectOrgBean:{},

    }
  },
  beforeMount() {
    this.getProjectBean()
    this.getProjectOrgBean()
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
    getProjectOrgBean(){
      this.projectOrgBean = {}
      getAction(this.url.getProjectOrgBean, {id: this.$route.query.projectOrgId}).then((res) => {
        if (res.success) {
          this.projectOrgBean = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    processStepChange(){
      this.$forceUpdate()
    }

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

.tabBox {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  width: 400px;
  background: rgba(162,166,169,0.2);
  padding: 6px 10px;
  margin-top: 10px;
  border-radius: 5px
}

.tabBtn {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #333;
  border-radius: 5px;
  width: 48%;
  cursor: pointer;
  padding: 10px;
}

.activeBtn {
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #1890ff;
  background: #fff;
  padding: 10px;
  width: 48%;
  cursor: pointer;
}
.sumTip{
  background: #e4f0f9;
  color:#108EE9;
  padding:12px;
  font-weight: bold;
}
</style>