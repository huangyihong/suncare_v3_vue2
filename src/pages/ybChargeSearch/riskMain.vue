<template>
  <div style="display:flex">

    <a-menu style="width: 180px;margin-right:4px" mode="vertical" v-model="tagName" @click="handleClick">
      <a-menu-item key="模型汇总统计" taskType="tagStatistics">
       模型汇总统计
      </a-menu-item>
      <a-menu-item key="医院预警模型汇总" taskType="suspiciousGroupStatistics">
        医院预警模型汇总
      </a-menu-item>
      <a-menu-item key="患者预警模型汇总" taskType="patientRiskGroupStatistics">
        患者预警模型汇总
      </a-menu-item>
      <a-menu-item key="医生预警模型汇总" taskType="doctorRiskGroupStatistics">
        医生预警模型汇总
      </a-menu-item>
      <a-sub-menu v-for="(value,key) in tagMenuMap" :key="key" :title="key" >
        <a-menu-item  v-for="item in value" :key="item.key" >
          {{item.title}}
        </a-menu-item>
      </a-sub-menu>

    </a-menu>
    <div :style="{width:'calc(100% - 180px) !important'}" >
      <risk-form taskType="riskStatistics" :singlePage="true" ref="riskForm" @selectTagName="selectTagName"></risk-form>
    </div>


  </div>
</template>

<script>
import {getAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import riskForm from './plugin/riskForm2'
export default {
  name: "searchMain",
  components: {
    riskForm
  },
  data () {
    return {
      initBean:{visittype:'ZY,MM',dataStaticsLevel:'src',etlSource:'yb',fundValType:'>='},
      bean:{},
      selectOrgsArr:[],
      url: {
        getDatasourceAndDatabase: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getDatasourceAndDatabase",
        genTaskTypeResult: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/genTaskTypeResult",
      },
      datasourceAndDatabaseVO:null,
      singlePage:false,//是否为单页面模式
      tagMenuMap:{},
      tagName:'模型汇总统计',
      tableTaskTypeMap:{
        'datamining_chargeitem_risk_data':'riskStatistics',
        'datamining_diag_risk_data':'diagRiskStatistics',
        'datamining_doctor_risk_data':'doctorRiskStatistics',
        'datamining_patient_risk_data':'patientRiskStatistics',
        'datamining_org_risk_data':'orgRiskStatistics',
        '假期住院人次异常':'orgHolidayRiskStatistics',
        'dwb_visitid_tag':'dwb_visit_tag',
        '涉嫌挂床住院--主诊断筛查':'lowStatistics',
        '涉嫌挂床住院--药费异常':'lowStatistics',
        '结伴住院':'visitTogetherStatistics',
        '结伴门诊':'visitTogetherStatistics',
        '结伴购药':'visitTogetherStatistics',
        '结伴就诊':'visitTogetherStatistics',
        '医生住院期间收治病人':'doctor_admit_patient_insick',
      },
      tagTypeMap:{
        'tagStatistics':'tagStat',
        'suspiciousGroupStatistics':'org',
        'patientRiskGroupStatistics':'patient',
        'doctorRiskGroupStatistics':'doctor',
        'riskStatistics':'org',
        'diagRiskStatistics':'org',
        'doctorRiskStatistics':'doctor',
        'patientRiskStatistics':'patient',
        'orgRiskStatistics':'org',
        'orgHolidayRiskStatistics':'org',
        'dwb_visit_tag':'org',
        'lowStatistics':'org',
        'visitTogetherStatistics':'org',
        'doctor_admit_patient_insick':'org',
      },
      tagNameMap:{
        '模型汇总统计':{tagType:'tagStat',taskType:'tagStatistics',tagName:''},
        '医院预警模型汇总':{tagType:'org',taskType:'suspiciousGroupStatistics',tagName:''},
        '患者预警模型汇总':{tagType:'patient',taskType:'patientRiskGroupStatistics',tagName:''},
        '医生预警模型汇总':{tagType:'doctor',taskType:'doctorRiskGroupStatistics',tagName:''},
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  beforeMount() {
    Object.assign(this.bean,this.initBean)
    this.getDatasourceAndDatabase()
    this.queryMonitorList()
    this.$nextTick(() => {
      this.$refs.riskForm.setFormData(this.bean,this.selectOrgsArr)
      this.$refs.riskForm.changeQuery('tagStatistics','tagStat','')
    })

  },
  methods: {
    //获取项目地和数据库配置信息
    getDatasourceAndDatabase(){
      getAction(this.url.getDatasourceAndDatabase, {}).then((res) => {
        if (res.success) {
          this.datasourceAndDatabaseVO = res.result;
          if(this.datasourceAndDatabaseVO&&this.datasourceAndDatabaseVO.sysDatasource&&this.datasourceAndDatabaseVO.sysDatasource.etlSource){
            let etlSource = this.datasourceAndDatabaseVO.sysDatasource.etlSource
            if(etlSource=='A01'){
              etlSource = 'yb'
            }else if(etlSource=='A03'){
              etlSource = 'his'
            }
            this.bean.etlSource = etlSource
            this.bean.datasourceAndDatabaseVO = this.datasourceAndDatabaseVO
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    //获取左侧菜单
    queryMonitorList(){
      getAction(this.url.genTaskTypeResult, {dataSource:this.userInfo.dataSource,taskType:'monitor_datamining_stat'}).then((res) => {
        if (res.success) {
          this.tagMenuMap = {}
          res.result.map(item=>{
            //设置菜单tagMenuMap
            let childrenList = []
            if(this.tagMenuMap[item.TAG_TYPE_NAME]){
              childrenList = this.tagMenuMap[item.TAG_TYPE_NAME]
            }
            childrenList.push({key:item.TAG_NAME,title:item.TAG_NAME})
            this.tagMenuMap[item.TAG_TYPE_NAME] = childrenList
            //设置tagNameMap
            let taskType = this.tableTaskTypeMap[item.TAG_NAME]
            if(!taskType){
              taskType = this.tableTaskTypeMap[item.TABLE_NAME]
            }
            let tagType = this.tagTypeMap[taskType]
            this.tagNameMap[item.TAG_NAME] = {taskType,tagType,tagName:item.TAG_NAME}
          })
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //选中左侧菜单
    handleClick(e) {
      let obj =  this.tagNameMap[e.key]
      let {taskType,tagType,tagName} = obj
      this.$refs.riskForm.changeQuery(taskType,tagType,tagName)
    },

    //页面内切换菜单
    selectTagName(taskType,tagName){
      if(!tagName){
        if(taskType=='tagStatistics'){
          tagName = '模型汇总统计'
        }else if(taskType=='suspiciousGroupStatistics'){
          tagName = '医院预警模型汇总'
        }else if(taskType=='patientRiskGroupStatistics'){
          tagName = '患者预警模型汇总'
        }else if(taskType=='doctorRiskGroupStatistics'){
          tagName = '医生预警模型汇总'
        }
      }
      this.tagName = tagName
    }
  }
}
</script>
<style lang="less" scoped>

</style>
