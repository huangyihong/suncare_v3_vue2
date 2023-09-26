<template>
  <div>
    <!-- 列表 -->
    <template v-for="(item,index) in projectList" >
      <a-divider dashed v-if="index>0" style="margin: 0"/>
      <div class="list-box m-t-10" :key="item.projectId"  @click="selectProject(item.projectId,item.projectOrgId)">
        <div class="disCC  ">
          <span class="text-ellipsis">{{item.projectName}}</span>
          <span style="width:60px">{{filterDictText(dictOptins.FJ_PROJECT_STATE,item.projectState)||''}} </span>
        </div>
        <div class="disCC  ">
          <span class="text-ellipsis">{{item.projectNo}}</span>
          <div style="width:160px">
            <span class="m-r-20">{{item.actionFzr}}</span>
            <span >{{item.createTime.substring(0,10)}}</span>
          </div>
        </div>
      </div>
    </template>
    <!-- 分页 -->
    <a-pagination size="small" :current="current" :total="totalPage" :page-size="10" @change="changePage" v-if="totalPage > 0" class="m-t-10 t-r" />
  </div>
</template>

<script>
import {getAction } from '@/api/manage'
import { filterDictText} from '@/components/dict/JDictSelectUtil'
export default {
  name: "projectInfoList",

  components: {

  },
  data() {
    return {
      url: {
        list: "/fj/project/projectListByOrg",
        selectProjectId:'',//选中的检查项目
      },
      totalPage: 0,
      current: 1,
      projectList:[],
      dictOptins:{},
    }
  },
  beforeMount() {
    let keys = ['URGENT_LEVEL', 'FJ_PROJECT_STATE']
    this.$util.initDict(keys).then(obj => {
      this.dictOptins = obj
      for (let key in this.dictOptins){
        this.dictOptins[key] = this.dictOptins[key].map(item =>{
          return {
            text: item.value,
            value: item.code
          }
        })
      }
    })

    //获取检查列表
    this.getProjectList()
  },
  methods: {
    filterDictText,
    //获取检查列表
    getProjectList(params){
      this.projectList = []
      if(!params){
        params = {}
      }
      params.pageNo = this.current
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.projectList = res.result.records
          this.totalPage = res.result.total
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    selectProject(projectId,projectOrgId){
      this.$router.push({ path:'/ybFjProject/orgProcess',query: {projectId,projectOrgId,parent:'home'} })
    },
    changePage (v) {
      this.current = v
      this.getProjectList()
    },
  }
}
</script>
<style lang="less" scoped>
  .disRow {
    display: flex;
    flex-direction: row
  }

  .disCC {
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .list-box {
    padding: 10px 10px;

  }

  .list-box:hover {
    background-color:#daeff97a;
    cursor: pointer;
  }


</style>