import {getAction,httpAction } from '@/api/manage'
import moment from "moment"
import { mapGetters } from 'vuex'
import pick from 'lodash/pick'
export const taskQueryFormMixin = {
  components: {

  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  beforeMount() {
    this.bean.dataSource = this.userInfo.dataSource
  },
  data(){
    return {
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        notRequired: { rules: [{ required: false, message: '' }] },
      },
      initBean:{visittype:'ZY,MM',dataStaticsLevel:'src',etlSource:'yb',fundValType:'>='},
      visittypeOptions:[{code:'ZY,MM',name:'住院+门诊'},{code:'ZY',name:'住院'},{code:'MM',name:'门诊'},{code:'GY',name:'购药'}],
      isFundpayOptions:[{code:'0',name:'不包含自费就诊数据'},{code:'1',name:'包含自费就诊数据'}],
      toggleSearchStatus:false,
      yearShowStart:false,
      yearShowEnd:false,
      checkChargedate:'',
      chargedateHelp:'',
      bean:{},
      url: {
        saveTaskBatch: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskBatch",
        saveTaskByType: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskByType",
      },
      confirmLoading:false,
      etlSource:'yb',

    }
  },
  methods:{
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    /**日期选择 年份选择 start **/
    beforeYear(start,end){
      let chargedateStartdate = null
      let chargedateEnddate = null
      chargedateStartdate= this.getRecentMonth(start)
      chargedateEnddate= this.getRecentMonth(end)
      this.form.setFieldsValue({chargedateStartdate:chargedateStartdate.substring(0,4)+'-01-01'})
      this.form.setFieldsValue({chargedateEnddate:chargedateEnddate})
      this.checkChargedateFn()
    },
    // 近N月
    getRecentMonth: function(n) {
      let month = moment(new Date()).subtract(n, "months").format("YYYY-MM-DD");
      return month;
    },
    openChangeStart(status) {
      if (status){
        this.yearShowStart =  true
      }
    },
    // 得到年份选择器的值
    panelChangeStart(value) {
      this.form.setFieldsValue({chargedateStartdate:value.toString().substring(11,15)})
      this.yearShowStart = false;
      this.checkChargedateFn()
    },

    openChangeEnd(status) {
      if (status){
        this.yearShowEnd =  true
      }
    },
    // 得到年份选择器的值
    panelChangeEnd(value) {
      this.form.setFieldsValue({chargedateEnddate:value.toString().substring(11,15)})
      this.yearShowEnd = false;
      this.checkChargedateFn()
    },
    formatYearDate(yeardata,type){
      if (yeardata) {
        if (typeof yeardata == 'object') {
          yeardata = yeardata.format("YYYY-MM-DD")
        } else if (yeardata.length == 4) {
          if(type=='end'){
            yeardata = yeardata + '-12-31'
          }else{
            yeardata = yeardata + '-01-01'
          }

        }
      }
      return yeardata
    },
    checkChargedateFn(){
      this.checkChargedate=''
      this.chargedateHelp = ''
    },
    /**日期选择 年份选择 end **/

    //获取查询form数据
    getFormQueryData(){
      let formData = {}
      this.form.validateFields((err, values) => {
        formData = values
      })
      return formData
    },

    formatFormQueryData(data){
      let formData = Object.assign({},data);
      formData.orgs = formData.orgs && formData.orgs.length > 0 ? formData.orgs.join(',') : null
      if(formData.orgs){
        let orgids = this.getOrgids(formData.orgs)
        formData.orgids = orgids
      }else{
        formData.orgids=""
      }
      formData.chargedateStartdate = this.formatYearDate(formData.chargedateStartdate,'start')
      formData.chargedateEnddate = this.formatYearDate(formData.chargedateEnddate,'end')
      formData.dataSource = this.userInfo.dataSource
      return formData
    },


    //清空查询条件
    clearQueryData(){
      this.clearExcelTable()
      this.form.resetFields();
      //清空机构
      this.orgsData=[]
      this.setOrgsField()
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.initBean,'visittype','etlSource','dataStaticsLevel','fundValType'))
        if(this.datasourceAndDatabaseVO&&this.datasourceAndDatabaseVO.etlSource){
          this.form.setFieldsValue({etlSource:this.datasourceAndDatabaseVO.etlSource})
        }

      });

    },

    //刷新任务列表
    reloadTaskTable(n){
      this.$refs.searchTaskList.reloadTable(n)
    },

    changeEtlSource(etlSource){
      this.changeVisittype(etlSource)
      this.etlSource = etlSource
    },

    //his的医保收费清单汇总(按科室)医保收费清单汇总(按就诊) 没有(住院+门诊)
    changeVisittype(etlSource,taskType){
      if(!taskType){
        taskType = this.taskType
      }
      if(taskType=='riskStatistics'){
        return;
      }
      if(etlSource=='his'&&(taskType=='itemByDeptStatistics'||taskType=='itemByVisitStatistics')){
        this.visittypeOptions=[{code:'ZY',name:'住院'},{code:'MM',name:'门诊'},{code:'GY',name:'购药'}]
        if(this.form.getFieldValue('visittype')=='ZY,MM'){
          this.form.setFieldsValue({visittype:'ZY'})
        }
      }else{
        this.visittypeOptions=[{code:'ZY,MM',name:'住院+门诊'},{code:'ZY',name:'住院'},{code:'MM',name:'门诊'},{code:'GY',name:'购药'}]
      }
    },




  }
}