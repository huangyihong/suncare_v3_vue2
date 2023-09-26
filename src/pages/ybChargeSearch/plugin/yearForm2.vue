<template>
  <div>
    <a-spin :spinning="confirmLoading">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item  label="医院名称">
                <a-select  mode="multiple"  :max-tag-count="1" v-decorator="['orgs', {}]" v-show="false" @change="changeOrgs"></a-select>
                <a-select
                  show-search
                  allowClear
                  mode="multiple"
                  :max-tag-count="3"
                  label-in-value
                  :value="selectOrgsArr"
                  placeholder="模糊检索,多个医院检索用#分隔"
                  :dropdownMatchSelectWidth="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="fetchOrg"
                  @change="handleChangeOrg"
                  :style="{width:'calc(100% - 80px) !important'}"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in selectOrgList" :key="d.value">{{d.text}}</a-select-option>
                </a-select>
                <a-button @click="selectOrg" class="m-l-6">选择</a-button>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :md="10" :sm="12">
              <a-form-item  label="时间范围" :required="true" :validateStatus="checkChargedate" :help="chargedateHelp" >
                <a-date-picker class="search-divider-item2" placeholder="" v-decorator="['chargedateStartdate', {}]"
                               mode="year"
                               :open='yearShowStart'
                               format='YYYY'
                               @openChange="openChangeStart"
                               @panelChange="panelChangeStart"></a-date-picker>
                <div class="search-divider">~</div>
                <a-date-picker class="search-divider-item2" placeholder=""v-decorator="['chargedateEnddate', {}]"
                               mode="year"
                               :open='yearShowEnd'
                               format='YYYY'
                               @openChange="openChangeEnd"
                               @panelChange="panelChangeEnd"></a-date-picker>
                <div class="search-divider2">
                  <a-dropdown>
                    <a-menu slot="overlay">
                      <a-menu-item key="0" @click="beforeYear(0,0)">今年</a-menu-item>
                      <a-menu-item key="1" @click="beforeYear(12,0)">近1年</a-menu-item>
                      <a-menu-item key="2" @click="beforeYear(24,0)">近2年</a-menu-item>
                      <a-menu-item key="3" @click="beforeYear(36,0)">近3年</a-menu-item>
                    </a-menu>
                    <a-button>快速填充<a-icon type="down" /></a-button>
                  </a-dropdown>
                </div>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :md="6" :sm="8">
              <a-form-item label="就诊类型">
                <a-select v-decorator="['visittype', validatorRules.required]" >
                  <a-select-option v-for="item in visittypeOptions" :key="item.code" :value="item.code"> {{item.name}} </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


            <a-col :md="8" :sm="12">
              <a-form-item label="数据来源">
                <m-dict-select-tag v-decorator="['etlSource', {}]" dictCode="SEARCH_ETL_SOURCE" @change="changeEtlSource"></m-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="12">
              <a-form-item label="数据提取层级">
                <m-dict-select-tag v-decorator="['dataStaticsLevel', {}]" dictCode="DATA_STATICS_LEVEL"></m-dict-select-tag>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="12">
              <a-form-item label="机构属性">
                <a-select v-decorator="['owntype', {}]" allowClear placeholder="请选择机构属性">
                  <a-select-option v-for="item in owntypeList" :value="item" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="12">
              <a-form-item label="机构所在地">
                <a-select v-decorator="['localTag', {}]" allowClear placeholder="请选择机构所在地">
                  <a-select-option v-for="item in localTagList" :value="item" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12">
              <a-form-item label="医院等级">
                <a-select v-decorator="['hosplevel', {}]" allowClear placeholder="请选择医院等级">
                  <a-select-option v-for="item in hosplevelList" :value="item" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="12">
              <a-form-item label="年度基金支付合计金额 ">
                <div>
                  <a-select style="width: 15%"  v-decorator="['fundValType', {}]"
                            allow-clear :default-value="{ key: '>=' }">
                    <a-select-option value=">="> >=</a-select-option>
                    <a-select-option value=">"> ></a-select-option>
                    <a-select-option value="<="> <=</a-select-option>
                    <a-select-option value="<"> <</a-select-option>
                  </a-select>
                  <a-input style="margin-left:5%;width: 80%" placeholder="请输入年度基金支付合计金额" v-decorator="['maxAllfundPay', {}]"/>
                </div>
              </a-form-item>
            </a-col>

          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card class="m-t-10" :bordered="false" >
      <task-type-tab :taskType="taskType" @changeTaskType="changeTaskType" v-if="!singlePage"></task-type-tab>

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <div class="fieldset-box1">
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item label="功能列表" style="margin-bottom:4px;">
                  <a-select  v-model="fnType" @change="selectFnType">
                    <a-select-option value="yearStatistics">年度统计</a-select-option>
                    <a-select-option value="yearUserateStatistics">医保项目使用率汇总</a-select-option>
                    <a-select-option value="yearSurgeryStatistics">医院手术情况统计</a-select-option>
                    <a-select-option value="yearOrgOnlinePatientCount">医院每日在院人数统计</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="显示排序" style="margin-bottom:4px;">
                  <a-select show-search v-model="bean.orderby">
                    <template v-if="fnType=='yearStatistics'">
                      <a-select-option value="sum_totalfee">医疗费用总额</a-select-option>
                      <a-select-option value="orgname">机构名称</a-select-option>
                      <a-select-option value="sum_fundpay">基金使用金额</a-select-option>
                      <a-select-option value="total_count">就诊人次</a-select-option>
                      <a-select-option value="zy_count">住院人次</a-select-option>
                      <a-select-option value="mz_count">门诊人次</a-select-option>
                    </template>
                    <template v-else-if="fnType=='yearUserateStatistics'">
                      <a-select-option value="userate">医保项目使用率</a-select-option>
                      <a-select-option value="fee">医疗费用总额</a-select-option>
                    </template>
                    <template v-else-if="fnType=='yearSurgeryStatistics'">
                      <a-select-option value="cnt_sum">全年次数</a-select-option>
                      <a-select-option value="avg_day_cnt">日均次数</a-select-option>
                      <a-select-option value="max_day_cnt">日最大次数</a-select-option>
                    </template>
                    <template v-else-if="fnType=='yearOrgOnlinePatientCount'">
                      <!--<a-select-option value="inhospital_cnt">在院住院人数</a-select-option>
                      <a-select-option value="admit_cnt">每日新增住院人数</a-select-option>
                      <a-select-option value="leave_cnt">每日出院人数</a-select-option>
                      <a-select-option value="yyear">统计年度</a-select-option>-->
                      <a-select-option value="ddate">日期</a-select-option>
                    </template>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="6">
                <a-form-item style="margin-bottom:4px;">
                  <a-radio-group  v-model="bean.orderbyType">
                    <a-radio value="desc">降序</a-radio>
                    <a-radio value="asc">升序</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <template v-if="fnType=='yearUserateStatistics'">
                <a-col :md="6" :sm="8">
                  <a-form-item label="收费项目大类" style="margin-bottom:4px;">
                    <a-select allowClear mode="multiple" @change="selectItemname">
                      <a-select-option value="药品">药品</a-select-option>
                      <a-select-option value="耗材">耗材</a-select-option>
                      <a-select-option value="诊疗">诊疗</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="fnType=='yearSurgeryStatistics'">
                <a-col :md="6" :sm="8">
                  <a-form-item label="手术名称" style="margin-bottom:4px;">
                    <a-input placeholder="请输入手术名称" v-model="bean.surgeryName"></a-input>
                  </a-form-item>
                </a-col>
              </template>

            </a-row>
          </div>
        </a-form>

      </div>
    </a-card>
    </a-spin>


    <div>
      <searchQueryList ref="searchQueryList"
                       :taskType="fnType"
                       @searchQuery="searchQuery">
        <div style="text-align: right;margin:0 50px 20px 0;" slot="queryBtn">
          <div class="table-operator" v-has="'ybChargeTask:createTask'">
            <a-button @click="clearQueryData" style='margin-right: 10px'>清空查询条件</a-button>
            <a-button type="primary"  @click="searchQuery">查询</a-button>
          </div>
        </div>
        <div style="margin:0 30px;" slot="createTaskBtn">
          <div v-has="'ybChargeTask:createTask'">
            <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk()">
              <a-button type="primary">创建文件下载任务</a-button>
            </a-popconfirm>

            <a-popconfirm title="确定要创建初始化表吗?" @confirm="createYearSql()">
              <a v-if="(fnType=='yearStatistics'||fnType=='yearUserateStatistics')&&datasourceAndDatabaseVO&&datasourceAndDatabaseVO.sysDatabase.dbtype=='greenplum'" style="float:right;padding-top:16px">【创建初始化表】</a>
            </a-popconfirm>
          </div>
        </div>
      </searchQueryList>
    </div>

    <OdsCheckorgList ref="odsCheckorgList"  @setOrgsData="setOrgsData"></OdsCheckorgList>
  </div>
</template>

<script>
import pick from 'lodash/pick'
import moment from "moment"
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import searchQueryList from '@/pages/ybChargeSearch/searchQueryList'
import taskTypeTab from './taskTypeTab'
import { orgSelectMixin } from '@/pages/ybChargeSearch/mixins/orgSelectMixin'
import { taskQueryFormMixin } from '@/pages/ybChargeSearch/mixins/taskQueryFormMixin'

import Line from '@/components/echart/Line'
import Scatter from '@/components/echart/LineStack'
export default {
  name: "yearForm",
  mixins:[orgSelectMixin,taskQueryFormMixin],
  props: {
    taskType: {
      type: String,
      default:'yearStatistics',
      required: true
    },
    singlePage: {
      type: Boolean,
      default: false
    },
  },
  components: {
    MDictSelectTag,
    searchQueryList,
    taskTypeTab,
    Line,
    Scatter
  },
  data () {
    return {
      description: '年度统计指标表单',
      bean:{orderby:'sum_totalfee',orderbyType:'desc',itemname:'',surgeryName:''},
      url: {
        getOrgList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgList",
        createYearSql: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/createYearSql",
      },
      owntypeList: [],//机构属性列表
      localTagList: [],//机构所在地列表
      hosplevelList: [],//机构等级
      datasourceAndDatabaseVO:null,
      fnType:'yearStatistics',
      width:'960px',
      height:'500px',
    }
  },
  activated(){
    this.$forceUpdate()
  },
  beforeMount() {
    this.queryOwntypeLocalTagHosplevel()
  },
  computed: {
    fnType: function() {
      return this.taskType;
    },
  },
  methods: {
    selectFnType(val){
      this.bean.itemname = ''
      this.bean.surgeryName = ''
      if(val=='yearStatistics'){
        this.bean.orderby = 'sum_totalfee'
      }else if(val=='yearUserateStatistics'){
        this.bean.orderby = 'userate'
      }else if(val=='yearSurgeryStatistics'){
        this.bean.orderby = 'cnt_sum'
      }else if(val=='yearOrgOnlinePatientCount'){
        this.bean.orderby = 'ddate'
        this.bean.orderbyType = 'asc'
      }
      this.$nextTick(() => {
        this.searchQuery()
      })
    },
    selectItemname(valArr){
      if(valArr&&valArr.length>0){
        this.bean.itemname = valArr.join('|')
      }else{
        this.bean.itemname = ''
      }
    },
    clearExcelTable(){
      this.bean = Object.assign({}, {orderby:this.bean.orderby,orderbyType:this.bean.orderbyType,itemname:'',surgeryName:''})
    },
    changeTaskType(key){
      this.$emit('changeTaskType',key);
    },
    setFormData(data,selectOrgsArr){
      if(!data.fundValType){
        data.fundValType = '>='
      }
      this.form.setFieldsValue(pick(data,'orgs','chargedateStartdate','chargedateEnddate','visittype','etlSource','dataStaticsLevel','owntype','localTag','hosplevel','fundValType','fundValType'))
      this.orgs = data.orgs
      this.selectOrgsArr = selectOrgsArr
      this.datasourceAndDatabaseVO = data.datasourceAndDatabaseVO
      if(data.chargedateStartdate&&data.chargedateEnddate){
        this.$nextTick(() => {
          this.searchQuery()
        })
      }else{
        this.$refs.searchQueryList.dataSource = []
        this.$refs.searchQueryList.ipagination.total = 0
      }

    },
    //获取机构属性列表
    queryOwntypeLocalTagHosplevel(){
      this.owntypeList = []
      this.localTagList = []
      this.hosplevelList = []
      getAction(this.url.getOrgList, {dataSource:this.userInfo.dataSource,taskType:'queryOwntypeLocalTagHosplevel'}).then((res) => {
        if (res.success) {
          this.owntypeList = Array.from(new Set(res.result.filter(item=>item.OWNTYPE != null && item.OWNTYPE !='').map(item=>item.OWNTYPE)))
          this.localTagList = Array.from(new Set(res.result.filter(item=>item.LOCAL_TAG != null && item.LOCAL_TAG !='').map(item=>item.LOCAL_TAG)))
          this.hosplevelList = Array.from(new Set(res.result.filter(item=>item.HOSPLEVEL != null && item.HOSPLEVEL !='').map(item=>item.HOSPLEVEL)))
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //直接查询结果进行展示
    searchQuery(){
      this.form.validateFields((err, values) => {
        this.$refs.searchQueryList.changeColums(this.fnType)
        this.changeColumnYear(this.fnType,values.dataStaticsLevel)
        if (!err) {
          if(!values.chargedateStartdate||!values.chargedateEnddate){
            this.checkChargedate='error'
            this.chargedateHelp = '这是必填项!'
            return
          }
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.fnType
          if(this.fnType=='yearOrgOnlinePatientCount'&&this.selectOrgsArr.length!=1){
            this.$message.warning('请选择一家医院进行查询分析');
            return
          }

          this.$refs.searchQueryList.queryParam = formData;
          if(this.$refs.searchQueryList.queryParam.orderby){
            this.$refs.searchQueryList.queryParam.orderby = this.$refs.searchQueryList.queryParam.orderby + " "+ this.$refs.searchQueryList.queryParam.orderbyType
          }

          this.$refs.searchQueryList.loadData(1);
          this.$refs.searchQueryList.showDetail = false
        }
      })
    },

    handleOk () {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          if(!values.chargedateStartdate||!values.chargedateEnddate){
            this.checkChargedate='error'
            this.chargedateHelp = '这是必填项!'
            return
          }
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.fnType
          if(this.fnType=='yearOrgOnlinePatientCount'&&this.selectOrgsArr.length!=1){
            this.$message.warning('请选择一家医院进行查询分析');
            return
          }

          formData.jsonStr=JSON.stringify(formData)
          this.confirmLoading = true;
          httpAction(this.url.saveTaskByType,formData,'post').then((res)=>{
            if(res.success){
              this.$confirm({
                title: '打开下载任务记录界面?',
                content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
                onOk() {
                  that.$util.openTab('/ybChargeSearch/searchTaskList')
                }
              })
            }else{
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoading = false;
          })
        }
      })
    },

    //年度统计 过滤字段
    changeColumnYear(taskType,dataStaticsLevel){
      if(taskType=='yearStatistics'&&'src'==dataStaticsLevel){
        this.$refs.searchQueryList.columns = this.$refs.searchQueryList.columns.filter(t=>t.dataIndex!=='orgnameSrc')
      }
    },

    //年度统计 创建初始化表
    createYearSql(){
      getAction(this.url.createYearSql, {}).then((res) => {
        if (res.success) {
          this.$success({
            title: '操作成功',
            content: '创建初始化表正在后台执行，请耐心等候',
          });
        }else{
          this.$message.warning(res.message);
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
  .rotate90{
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .fieldset-box1 {
    padding: 16px;
    border: 1px solid rgb(153,153,153);
    border-radius: 2px;
    //display: inline-block;
    width: 100%;
    position: relative;
    margin: 0 0 16px;
    transition: all 0.2s;
  }

  .table-operator .ant-btn {
    margin-right: 6px;
  }

  .search-divider-item2{
    display: inline-block;
    width: calc(50% - 62px) !important;
    min-width: 80px !important;
  }
  .search-divider2{
    width: 100px;
    padding-left:2px;
    display: inline-block;
  }

  /deep/ .ant-card-body{
    padding-bottom: 0px;
    padding-top: 14px;
    padding-right: 24px;
    padding-left: 24px;
  }
</style>
