<template>
  <div style='background-color: white'>


    <slot name="queryBtn"></slot>


    <!-- table区域-begin -->
    <div class="table-operator">
      <template v-if="showDetail">
        <div style="cursor: pointer;margin-left: 30px" @click="goBack()">
          <a-icon type="arrow-left" />
          <span style="color:#1890ff;margin-left:8px">返回</span>
        </div>
      </template>
      <template v-else><slot name="createTaskBtn"></slot></template>

    </div>

    <a-card  :bordered="false" >
      <div v-if="taskType=='yearOrgOnlinePatientCount'||querytTaskType=='yearOrgOnlinePatientCount'">
        <a-spin :spinning="loading">
          <yearLineStack width="95%" height="500px" ref="yearLineStack"></yearLineStack>
        </a-spin>
      </div>

      <div v-else>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ x: scrollX }"
          v-bind="tableAttrs"
          @change="handleTableChange">

          <span slot="tagName" slot-scope="text, record">
            <template v-for="(item,index) in text.split(',')">
              <span v-if="index>0">, </span>
              <a @click="queryDetailByTagName(record,item)">{{item}}</a>
            </template>
          </span>

          <span slot="actionPatient" slot-scope="text, record">
            <a @click="createVisitTask(record)" >全年就诊清单</a><a-divider type="vertical"/><a @click="createChargeTask(record)">全年收费清单</a>
          </span>

          <span slot="actionOrg" slot-scope="text, record">
            <a @click="createChargeTask1(record)">收费明细</a>
          </span>

          <span slot="actionDoctor" slot-scope="text, record">
            <a @click="createVisitTaskByDoctor(record)">相关就诊清单</a>
          </span>

          <span slot="actionOrgHoliday" slot-scope="text, record">
            <a @click="showScatter(record)">全年日入院人次散点图</a>
          </span>

        </a-table>
      </div>
    </a-card>
    <!-- table区域-end -->

    <holiday-scatter ref="holidayScatterModal"/>

  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {getAction } from '@/api/manage'
import holidayScatter from "./plugin/holidayScatter"

import yearLineStack from "./plugin/yearLineStack"
export default {
  name: "searchResultList",
  mixins:[JeecgListMixin],
  props: {
    taskType: {
      type: String,
      required: true
    },
  },
  components: {
    holidayScatter,
    yearLineStack
  },
  data () {
    return {
      description: '任务查询结果页面',

      // 表头
      columns: [],
      url: {
        list: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/queryList",
        getResultConfigMap: "/ybChargeSearch/ybChargeSearchTask/getResultConfigMap",
      },
      isorter: {
        column: '',
        order: ''
      },
      initLoad:false,
      resultConfigBean:{},
      resultConfigMap:{},
      showDetail:false,
      querytTaskType:'',
    }
  },

  beforeMount() {
    this.loadResultConfigMap()
  },
  watch: {
    taskType: {
      immediate: true,
      handler(val) {
        this.changeColums(val)
      }
    },
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      let params = this.getQueryParams()//查询条件
      if(params.taskType=='yearOrgOnlinePatientCount'){
        params.pageSize = 999999
      }
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
           if(params.taskType==this.taskType||params.taskType==this.querytTaskType){
             this.dataSource = res.result.records
             this.ipagination.total = res.result.total
             if(this.dataSource.length === 0){
               this.$refs.table && this.$refs.table.setEmptyDesc()
             }
             this.showYearLineStack(params.taskType)
           }
        } else {
          this.$message.warning(res.message)
          this.$refs.table && this.$refs.table.setEmptyDesc(res.message)
        }
      }).catch(e => {
        this.$refs.table && this.$refs.table.setEmptyDesc(e.response.data.message)
        this.$message.error("网络中断或超时")
      }).finally(() => {
        this.loading = false
      })
    },
    //获取配置信息
    loadResultConfigMap(){
      getAction(this.url.getResultConfigMap, {}).then((res) => {
        if (res.success) {
          this.resultConfigMap = res.result;
          this.changeColums(this.taskType)
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    changeColums(taskType){
      if(!taskType){
        taskType = this.taskType
      }else{
        this.querytTaskType = taskType
      }
      /*if(taskType=='patientRiskStatistics'||taskType=='doctorRiskStatistics'){
        this.showDetail = true
      }else{
        this.showDetail = false
      }*/
      this.resultConfigBean = Object.assign({}, this.resultConfigMap[taskType]);
      this.columns = this.getColum(taskType)
      this.dataSource = []
      this.ipagination.total = 0
      this.showYearLineStack(taskType)
    },

    getColum(taskType){
      let that = this
      if(!taskType){
        taskType = this.taskType
      }
      let column = []
      if(!this.resultConfigBean.cols||this.resultConfigBean.cols.length==0){
        return column
      }
      this.resultConfigBean.cols.forEach(function(item,index){
        let bean = {dataIndex:item.field,title:item.title};
        if(item.minWidth){
          bean.minWidth = item.minWidth+'px';
        }else{
          bean.width = item.width+'px';
        }
        if(taskType=='patientRiskGroupStatistics'){
          if(item.field=='clientid'){
            bean.customRender = (t, r, i) => <a onClick={() => that.queryPatientDetailByClientid(r)}>{t}</a>
          }else if(item.field=='tagName'){
            bean.scopedSlots = {customRender: 'tagName'}
          }
        }else if(taskType=='doctorRiskGroupStatistics'){
          if(item.field=='doctorname'){
            bean.customRender = (t, r, i) => <a onClick={() => that.queryDoctorDetailByName(r)}>{t}</a>
          }else if(item.field=='tagName'){
            bean.scopedSlots = {customRender: 'tagName'}
          }
        }else if(taskType=='suspiciousGroupStatistics'){
          /*if(item.field=='tagName'){
            bean.scopedSlots = {customRender: 'tagName'}
          }*/
        }
        column.push(bean);
      });
      if(taskType=='patientRiskGroupStatistics'||taskType=='patientRiskStatistics'){
        let bean = {
          title: '操作',
          dataIndex: 'actionPatient',
          align: 'center',
          fixed: 'right',
          width: '260px',
          scopedSlots: {customRender: 'actionPatient'}
        };
        column.push(bean)
      }else if(taskType=='visitTogetherStatistics'){
        let bean = {
          title: '操作',
          dataIndex: 'actionOrg',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'actionOrg'}
        };
        column.push(bean)
      }else if(taskType=='doctorRiskStatistics'){
        let bean = {
          title: '操作',
          dataIndex: 'actionDoctor',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'actionDoctor'}
        };
        column.push(bean)
      }else if(taskType=='orgHolidayRiskStatistics'){
        let bean = {
          title: '操作',
          dataIndex: 'actionOrgHoliday',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'actionOrgHoliday'}
        };
        column.push(bean)
      }
      return column;
    },
    //点击clientid
    queryPatientDetailByClientid(record){
      let taskType = 'patientRiskStatistics'
      this.changeColums(taskType)
      let queryParam = {clientid:record.clientid,taskType};
      if(record.yyear){
        queryParam.chargedateStartdate = record.yyear+'-01-01'
        queryParam.chargedateEnddate = record.yyear+'-12-31'
      }
      this.$emit('searchQueryDetail',queryParam);
    },
    //点击tagName
    queryDetailByTagName(record,tagName){
      let taskType = 'patientRiskStatistics'
      if(this.taskType=='patientRiskGroupStatistics'){
        taskType = 'patientRiskStatistics'
      }else if(this.taskType=='doctorRiskGroupStatistics'){
        taskType = 'doctorRiskStatistics'
      }else{
        taskType = this.taskType
      }
      this.changeColums(taskType)
      let queryParam = {tagName,taskType};
      this.$emit('searchQueryDetail',queryParam);
    },
    //点击返回
    goBack(){
      this.$emit('searchQuery');
    },

    //全年就诊清单
    createVisitTask(record){
      let queryParam = {clientid:record.clientid,clientname:record.clientname,orgs:record.orgList,taskType:'visitStatistics'};
      if(record.yyear){
        queryParam.chargedateStartdate = record.yyear+'-01-01'
        queryParam.chargedateEnddate = record.yyear+'-12-31'
      }
      this.$emit('createVisitTask',queryParam);
    },

    //全年收费清单
    createChargeTask(record){
      let queryParam = {clientid:record.clientid,clientname:record.clientname,orgs:record.orgList,taskType:'search'};
      if(record.yyear){
        queryParam.chargedateStartdate = record.yyear+'-01-01'
        queryParam.chargedateEnddate = record.yyear+'-12-31'
      }
      this.$emit('createChargeTask',queryParam);
    },

    //结伴就医 收费明细
    createChargeTask1(record){
      let queryParam = {visitid:record.visitidSrc,taskType:'search',orgs:record.orgnameSrc,orgid:record.orgid};
      this.$emit('createChargeTask',queryParam);
    },

    //点击doctorname
    queryDoctorDetailByName(record){
      let taskType = 'doctorRiskStatistics'
      this.changeColums(taskType)
      let queryParam = {doctorname:record.doctorname,taskType};
      if(record.orgname){
        queryParam.orgname = record.orgname
      }
      if(record.deptnameSrc){
        queryParam.deptnameSrc = record.deptnameSrc
      }
      this.$emit('searchQueryDetail',queryParam);
    },

    //医生相关诊清单
    createVisitTaskByDoctor(record){
      let queryParam = {doctorname:record.doctorname,doctorid:record.doctorid,orgs:record.orgname,taskType:'visitStatistics'};
      let visitdate = record.yyear
      if(record.mmonth){
        visitdate +='-'
        if((record.mmonth+'').length==1){
          visitdate +='0'
        }
        visitdate +=record.mmonth
      }
      if(record.dday){
        visitdate +='-'
        if((record.dday+'').length==1){
          visitdate +='0'
        }
        visitdate +=record.dday
      }
      if(!visitdate){
        this.$message.warning('无医生年月日数据，无法查询相关就诊清单!');
      }
      queryParam.visitdate = visitdate
      //年份时间段
      queryParam.chargedateStartdate = record.yyear+'-01-01'
      queryParam.chargedateEnddate = record.yyear+'-01-01'
      this.$emit('createVisitTask',queryParam);
    },

    //全年日入院人次散点图
    showScatter(record){
      let queryParam = {orgs:record.orgname}
      if(record.year){
        let yyear = record.year
        if(record.year.length>4){
          yyear = record.year.substring(0,4)
        }
        queryParam.chargedateStartdate = yyear+'-01-01'
        queryParam.chargedateEnddate = yyear+'-12-31'
      }
      this.$refs.holidayScatterModal.initChart(queryParam)
    },
    //年度折线图
    showYearLineStack(taskType){
      if(taskType=='yearOrgOnlinePatientCount'){
        this.$nextTick(() => {
          this.$refs.yearLineStack.initChart(this.dataSource)
        })
      }

    }
  }
}
</script>
<style lang="less" scoped>

</style>
