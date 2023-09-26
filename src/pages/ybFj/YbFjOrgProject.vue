<template>
  <a-card  :bordered="false">
    <a-row :gutter="16">
      <a-col :md="3" :sm="3" >
      </a-col>
      <a-col :md="18" :sm="18" >
        <!-- 列表 -->
        <template v-for="(item,index) in projectList" >
          <div  style="margin-bottom: 20px;cursor: pointer;" @click="selectProject(item.projectId,item.projectOrgId)">
            <project-info :item="item"></project-info>
          </div>

        </template>


      </a-col>
      <a-col :md="3" :sm="3" >
      </a-col>
    </a-row>

    <!-- 分页 -->
    <a-pagination size="small" :current="current" :total="totalPage" :page-size="10" @change="changePage" v-if="totalPage > 0" class="m-t-10 t-r" />

  </a-card>
</template>

<script>
import {getAction } from '@/api/manage'
import store from '@/store/'
import ProjectInfo from "./plugin/projectInfo";
export default {
  name: "YbFjOrgProject",
  components: {
    ProjectInfo
  },
  data() {
    return {
      description: '医院端检查项目列表',
      url: {
        list: "/fj/project/projectListByOrg",
        queryByUserid:'/fj/org/queryByUserid',
      },
      totalPage: 0,
      current: 1,
      projectList:[],
      orgBean:{},
      projectOrgId:undefined,
    }
  },
  beforeMount() {
    //获取检查列表
    this.getProjectList()
  },
  methods: {
    //获取检查列表
    getProjectList(params){
      this.projectList = []
      if(!params){
        params = {}
      }
      params.pageNo = this.current
      params.column = ''
      params.order = ''
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.projectList = res.result.records
          this.totalPage = res.result.total
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    changePage (v) {
      this.current = v
      this.getProjectList()
    },
    selectProject(projectId,projectOrgId){
      console.log('1111')
      this.$router.push({ path:'/ybFjProject/orgProcess',query: {projectId,projectOrgId} })
    }
  }
}
</script>
<style lang="less" scoped>
</style>