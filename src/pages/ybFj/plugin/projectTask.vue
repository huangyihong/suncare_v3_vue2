<template>
  <a-card  :bordered="false">
    <div class="disRow">
      <div style="width:120px" class="changTabBox">
        <template v-if="processStep=='task'">
          <p :class="[isChangeTab=='alreadyAuditList'?'activeTab':'changTab']" @click="tabCard('alreadyAuditList')">审核完成</p>
          <p :class="[isChangeTab=='mineCreateList'?'activeTab':'changTab']" @click="tabCard('mineCreateList')">我发起的</p>
          <p :class="[isChangeTab=='waitAuditList'?'activeTab':'changTab']" @click="tabCard('waitAuditList')">待我审核</p>
        </template>
        <template v-if="processStep=='taskHosp'">
          <p :class="[isChangeTab=='alreadyAuditListHosp'?'activeTab':'changTab']" @click="tabCard('alreadyAuditListHosp')">已反馈</p>
          <p :class="[isChangeTab=='waitAuditListHosp'?'activeTab':'changTab']" @click="tabCard('waitAuditListHosp')">待反馈</p>
        </template>
        <template v-if="processStep=='taskHospOrg'">
          <p :class="[isChangeTab=='alreadyAuditListByOrg'?'activeTab':'changTab']" @click="tabCard('alreadyAuditListByOrg')">已反馈</p>
          <p :class="[isChangeTab=='waitAuditListByOrg'?'activeTab':'changTab']" @click="tabCard('waitAuditListByOrg')">待反馈</p>
        </template>



        <template v-if="processStep=='taskCut'">
          <p :class="[isChangeTab=='alreadyAuditListCut'?'activeTab':'changTab']" @click="tabCard('alreadyAuditListCut')">已查看</p>
          <p :class="[isChangeTab=='waitAuditListCut'?'activeTab':'changTab']" @click="tabCard('waitAuditListCut')">待查看</p>
        </template>
        <template v-if="processStep=='taskCutOrg'">
          <p :class="[isChangeTab=='mineCreateListByOrg'?'activeTab':'changTab']" @click="tabCard('mineCreateListByOrg')">核减进度</p>
        </template>

      </div>
      <div style="width:20px"></div>
      <div :style="{width:'calc(100% - 150px)'}">
        <slot name="createTaskBtn"></slot>
        <a-skeleton :loading="loading" active :paragraph="{rows: 2}">
        <div class="cardBorder" style="margin-top:10px;cursor: pointer;" v-for="(item,index) in taskList" @click="showTaskInfo(item)">
          <div class=" m-t-10 disCC">
            <span class="ft-14 W33">
              <span v-if="processStep=='taskCut'">核减</span>任务名称：{{item.taskName}}
              <a-tag color="#62de9c" style="margin-left: 40px" v-if="item.auditTime">
                <span v-if="processStep=='task'">已回复</span>
                <span v-if="processStep=='taskHosp'||processStep=='taskHospOrg'">已回复</span>
                <span v-if="processStep=='taskCut'||processStep=='taskCutOrg'">已查看</span>
              </a-tag>
              <a-tag color="#fdc274" style="margin-left: 40px" v-else>
                <span v-if="processStep=='task'">待审批</span>
                <span v-if="processStep=='taskHosp'||processStep=='taskHospOrg'">待反馈</span>
                <span v-if="processStep=='taskCut'||processStep=='taskCutOrg'">待查看</span>
              </a-tag>
            </span>
            <span class="ft-14 W33"><span v-if="processStep=='taskCut'||processStep=='taskCutOrg'">核减</span><span v-else>任务</span>编号：{{item.taskId}}</span>
            <span class="ft-14 W33" v-if="processStep=='task'">线索审核人：{{item.auditUserName}}</span>
            <span class="ft-14 W33" v-if="processStep=='taskHosp'||processStep=='taskHospOrg'">反馈人：{{item.createUsername}}</span>
            <span class="ft-14 W33" v-if="processStep=='taskCut'||processStep=='taskCutOrg'">发起人：{{item.createUsername}}</span>
          </div>
          <div class="disCC" style="margin-top:10px">
            <span class="ft-14 W33" v-if="processStep=='task'">期望审批时间：{{item.hopedAuditTime?item.hopedAuditTime.substring(0,10):''}}</span>
            <span class="ft-14 W33" v-if="(processStep=='taskHosp'||processStep=='taskHospOrg')&&item.auditTime">完成时间：{{item.auditTime?item.auditTime:''}}</span>
            <span class="ft-14 W33" v-if="(processStep=='taskHosp'||processStep=='taskHospOrg')&&!item.auditTime">反馈时间：{{item.createTime?item.createTime:''}}</span>
            <span class="ft-14 W33" v-if="(processStep=='taskCut'||processStep=='taskCutOrg')&&item.auditTime">查看时间：{{item.auditTime?item.auditTime:''}}</span>
            <span class="ft-14 W33" v-if="(processStep=='taskCut'||processStep=='taskCutOrg')&&!item.auditTime">提交时间：{{item.createTime?item.createTime:''}}</span>
            <span class="ft-14 W33">线索明细：{{item.caseAmount}}</span>
            <span class="ft-14 W33">线索金额：{{item.caseFee}}（元）</span>
          </div>
        </div>
        <!-- 分页 -->
        <a-pagination size="small" :current="current" :total="totalPage" :page-size="10" @change="changePage" v-if="totalPage > 0" style="margin-top:10px;text-align:right" />
        </a-skeleton>
      </div>
    </div>
  </a-card>
</template>

<script>
import { httpAction,getAction } from '@/api/manage'
export default {
  name: "projectTask",
  props: {
    projectOrgId: {
      type: String,
      required: true
    },
    processStep: {
      type: String,
      required: true
    },
  },
  components: {

  },
  watch: {
    projectOrgId: {
      immediate: true,
      handler(val) {
        this.current = 1

      }
    },
    processStep: {
      immediate: true,
      handler(val) {
        if(val){
          if(val=='task'){
            this.isChangeTab = 'alreadyAuditList'
          }
          if(val=='taskHosp'){
            this.isChangeTab = 'alreadyAuditListHosp'
          }
          if(val=='taskHospOrg'){
            this.isChangeTab = 'alreadyAuditListByOrg'
          }
          if(val=='taskCut'){
            this.isChangeTab = 'alreadyAuditListCut'
          }
          if(val=='taskCutOrg'){
            this.isChangeTab = 'mineCreateListByOrg'
          }
          this.getTaskList()
        }
      }
    },
  },
  data() {
    return {
      loading:false,
      isChangeTab:'alreadyAuditList',
      url:{
        alreadyAuditList:'/fj/project/task/alreadyAuditList',
        mineCreateList:'/fj/project/task/mineCreateList',
        waitAuditList:'/fj/project/task/waitAuditList',
        alreadyAuditListHosp:'/fj/project/task/hosp/alreadyAuditList',
        mineCreateListHosp:'/fj/project/task/hosp/mineCreateList',
        waitAuditListHosp:'/fj/project/task/hosp/waitAuditList',
        alreadyAuditListCut:'/fj/project/task/cut/alreadyAuditList',
        mineCreateListCut:'/fj/project/task/cut/mineCreateList',
        waitAuditListCut:'/fj/project/task/cut/waitAuditList',
        alreadyAuditListByOrg:'/fj/project/task/hosp/alreadyAuditListByOrg',
        waitAuditListByOrg:'/fj/project/task/hosp/waitAuditListByOrg',
        mineCreateListByOrg:'/fj/project/task/cut/mineCreateListByOrg',
      },
      totalPage: 0,
      current: 1,
      taskList:[],

    }
  },
  methods: {
    tabCard (v) {
      this.isChangeTab = v
      this.current = 1
      this.getTaskList()
      this.$forceUpdate()
    },

    getTaskList(type,params){
      if(!type){
        type = this.isChangeTab
      }
      if(this.processStep=='task'&&!['alreadyAuditList','mineCreateList','waitAuditList'].includes(this.isChangeTab)){
        this.isChangeTab = 'alreadyAuditList'
      }
      if(this.processStep=='taskHosp'&&!['alreadyAuditListHosp','waitAuditListHosp'].includes(this.isChangeTab)){
        this.isChangeTab = 'alreadyAuditListHosp'
      }
      if(this.processStep=='taskHospOrg'&&!['alreadyAuditListByOrg','waitAuditListByOrg'].includes(this.isChangeTab)){
        this.isChangeTab = 'alreadyAuditListByOrg'
      }
      if(this.processStep=='taskCut'&&!['alreadyAuditListCut','waitAuditListCut'].includes(this.isChangeTab)){
        this.isChangeTab = 'alreadyAuditListCut'
      }
      if(this.processStep=='taskCutOrg'&&!['mineCreateListByOrg'].includes(this.isChangeTab)){
        this.isChangeTab = 'mineCreateListByOrg'
      }
      this.taskList = []
      let url = this.url[type]
      if(!params){
        params = { projectOrgId: this.projectOrgId}
      }
      params.pageNo = this.current
      params.column = 'createTime'
      params.order = 'desc'
      this.loading = true
      getAction(url, params).then(res => {
        if (res.success) {
          this.taskList = res.result.records
          this.totalPage = res.result.total
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    changePage (v) {
      this.current = v
      this.getTaskList(this.isChangeTab)
    },

    showTaskInfo(item){
      let fnType = ''
      if(this.isChangeTab=='alreadyAuditList'||this.isChangeTab=='alreadyAuditListHosp'||this.isChangeTab=='alreadyAuditListByOrg'||this.isChangeTab=='alreadyAuditListCut'){
        fnType = 'view'
      }else if(this.isChangeTab=='mineCreateList'||this.isChangeTab=='mineCreateListByOrg'){
        if(item.auditTime){
          fnType = 'view'
        }else{
          fnType = 'edit'
        }
      }else if(this.isChangeTab=='waitAuditList'||this.isChangeTab=='waitAuditListHosp'||this.isChangeTab=='waitAuditListByOrg'||this.isChangeTab=='waitAuditListCut'){
        if(this.isChangeTab=='waitAuditListHosp'){
          fnType = 'edit'
        }else{
          fnType = 'audit'
        }
      }
      this.$emit('showTaskInfo',item,fnType);
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
  .changTabBox{
    cursor: pointer;
  }
  .changTab {
    line-height: 48px;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    background: rgba(187, 217, 239, 0.1);
  }
  .activeTab{
    line-height: 48px;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    background: rgba(66, 170, 245, 1);
    color:#fff
  }
  .cardBorder {
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    padding: 10px;
  }

  .W33 {
    width: 33%
  }

  .tabBox {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 240px;
    background: rgba(162,166,169,0.2);
    padding: 6px 10px;
    margin-top: 10px;
    border-radius: 5px
  }

</style>