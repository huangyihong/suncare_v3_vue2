<template>
  <div>
    <keep-alive>
      <component v-for="(item,key) in taskTypeComponent"
                 :is="item.component"
                 :key="key"
                 :ref="item.ref"
                 :taskType="key"
                 :singlePage="singlePage"
                 v-if="taskType==key"
                 @changeTaskType="changeTaskType"></component>
    </keep-alive>


  </div>
</template>

<script>
import {getAction } from '@/api/manage'
import searchForm from './plugin/searchForm2'
import drugRuleForm from './plugin/drugRuleForm2'
import yearForm from './plugin/yearForm2'
import visitForm from './plugin/visitForm2'
import itemForm from './plugin/itemForm2'
import itemByDeptForm from './plugin/itemByDeptForm2'
import itemByVisitForm from './plugin/itemByVisitForm2'
import riskForm from './plugin/riskForm2'
export default {
  name: "searchMain",
  components: {
    searchForm,
    drugRuleForm,
    yearForm,
    visitForm,
    itemForm,
    itemByDeptForm,
    itemByVisitForm,
    riskForm
  },
  data () {
    return {
      taskTypeComponent: {
        'search': {component: 'searchForm', ref: 'searchForm'},
        'drugRuleStatistics': {component: 'drugRuleForm', ref: 'drugRuleForm'},
        'yearStatistics': {component: 'yearForm', ref: 'yearForm'},
        'visitStatistics': {component: 'visitForm', ref: 'visitForm'},
        'itemStatistics': {component: 'itemForm', ref: 'itemForm'},
        'itemByDeptStatistics': {component: 'itemByDeptForm', ref: 'itemByDeptForm'},
        'itemByVisitStatistics': {component: 'itemByVisitForm', ref: 'itemByVisitForm'},
        'riskStatistics': {component: 'riskForm', ref: 'riskForm'},
      },
      taskType:'search',
      taskTypeForm:null,
      initBean:{visittype:'ZY,MM',dataStaticsLevel:'src',etlSource:'yb',fundValType:'>='},
      bean:{},
      selectOrgsArr:[],
      url: {
        getDatasourceAndDatabase: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getDatasourceAndDatabase",
      },
      datasourceAndDatabaseVO:null,
      toggleSearchStatus:false,
      singlePage:false,//是否为单页面模式
    }
  },
  beforeMount() {
    //路由指定任务类型
    let pathStrArr = this.$route.path.split('/')
    let taskTypePath = pathStrArr[pathStrArr.length-1]
    for (let key in this.taskTypeComponent){
      if(taskTypePath==key){
        this.taskType = taskTypePath
        this.singlePage = true
      }
    }

    Object.assign(this.bean,this.initBean)
    this.getDatasourceAndDatabase()
    this.$nextTick(() => {
      this.taskTypeForm = this.$refs[this.taskTypeComponent[this.taskType].ref][0]
      this.taskTypeForm.setFormData(this.bean,this.selectOrgsArr)
    })

  },
  methods: {
    changeTaskType(key){
      this.beforeQueryData()
      this.taskType = key
      this.$nextTick(() => {
        this.taskTypeForm = this.$refs[this.taskTypeComponent[this.taskType].ref][0]
        this.taskTypeForm.setFormData(this.bean,this.selectOrgsArr)
        this.taskTypeForm.toggleSearchStatus = this.toggleSearchStatus
      })

    },
    beforeQueryData(){
      Object.assign(this.bean,this.taskTypeForm.getFormQueryData())
      this.selectOrgsArr = this.taskTypeForm.selectOrgsArr
      this.toggleSearchStatus =  this.taskTypeForm.toggleSearchStatus
    },

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
  }
}
</script>
<style lang="less" scoped>

</style>
