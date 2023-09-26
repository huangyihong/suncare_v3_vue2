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
              <a-col :xxl="8" :md="10" :sm="12" v-if="bean.tagType=='doctor'">
                <a-form-item  label="时间范围">
                  <a-date-picker placeholder="" v-decorator="['chargedateStartdate', {}]" class="search-divider-item2" @change="checkChargedateFn"></a-date-picker>
                  <div class="search-divider">~</div>
                  <a-date-picker placeholder=""v-decorator="['chargedateEnddate', {}]" class="search-divider-item2" @change="checkChargedateFn"></a-date-picker>
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
              <a-col :xxl="8" :md="10" :sm="12" v-else>
                <a-form-item  label="时间范围">
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

              <a-col :xxl="8" :md="6" :sm="12">
                <a-form-item label="数据来源">
                  <m-dict-select-tag v-decorator="['etlSource', {}]" dictCode="SEARCH_ETL_SOURCE" @change="changeEtlSource"></m-dict-select-tag>
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
                <a-col :md="8" :sm="8">
                  <a-form-item  label="模型类型" style="margin-bottom:4px;">
                    <a-select v-model="bean.tagType" @change="selectTagType">
                      <a-select-option value="tagStat">模型汇总统计</a-select-option>
                      <a-select-option value="org">医院模型</a-select-option>
                      <a-select-option value="patient">患者模型</a-select-option>
                      <a-select-option value="doctor">医生模型</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="8" v-show="bean.tagType!='tagStat'">
                  <a-form-item  label="模型名称" style="margin-bottom:4px;">
                    <a-select
                      show-search
                      allowClear
                      v-model="tagNameId"
                      placeholder="请选择模型名称"
                      :dropdownMatchSelectWidth="false"
                      @change="selectTag"
                    >
                      <a-select-option value="" v-if="bean.tagType=='patient'">患者预警模型汇总</a-select-option>
                      <a-select-option value="" v-else-if="bean.tagType=='doctor'">医生预警模型汇总</a-select-option>
                      <a-select-option value="" v-else-if="bean.tagType=='org'">就诊预警清单汇总</a-select-option>
                      <a-select-option value="" v-else>请选择模型名称</a-select-option>
                      <a-select-option  v-for="(item,index) in tagList" :value="item.NAME+'#'+item.TAG_INDEX" :key="item.NAME+'#'+item.TAG_INDEX">{{item.TAGNAME}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <template v-if="bean.tagType=='patient'">
                  <a-col :md="8" :sm="8">
                    <a-form-item label="患者ID" style="margin-bottom:4px;">
                      <a-input placeholder="请输入患者ID，多个患者ID用#分隔" v-model="bean.clientid"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="8">
                    <a-form-item label="患者姓名" style="margin-bottom:4px;">
                      <a-input placeholder="请输入患者姓名，多个患者姓名用#分隔" v-model="bean.clientname"></a-input>
                    </a-form-item>
                  </a-col>
                </template>
                <template v-if="bean.tagType=='doctor'">
                  <a-col :md="8" :sm="8">
                    <a-form-item label="科室" style="margin-bottom:4px;">
                      <a-input placeholder="请输入科室名称，多个科室名称用#分隔" v-model="bean.deptname"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="8">
                    <a-form-item label="医生姓名" style="margin-bottom:4px;">
                      <a-input placeholder="请输入医生姓名，多个医生姓名用#分隔" v-model="bean.doctorname"></a-input>
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
                       @searchQuery="searchQuery"
                       @searchQueryDetail="searchQueryDetail"
                       @createVisitTask="createVisitTask"
                       @createChargeTask="createChargeTask">
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

            <upload-tag-label :taskType="fnType" @ok="$refs.searchQueryList.loadData()"
                              v-for="(value,key) in resultConfigMap" :key="key" v-if="key==fnType&&value.lableTargetTable"></upload-tag-label>

            <a-dropdown class="m-l-6" v-if="filterGraphByTagName()">
              <a-menu slot="overlay">
                <a-menu-item  v-for="(item,index) in graphList" :key="item.GRAPH_NAME"
                              v-if="item.TAG_NAME==bean.tagName"
                              @click="showRiskGraph(item.GRAPH_NAME)">{{item.GRAPH_NAME}}</a-menu-item>
              </a-menu>
              <a-button>分布图形<a-icon type="down" /></a-button>
            </a-dropdown>

            <a-button class="m-l-6" v-if="filterSqlDetailByTagName()" @click="createTaskByTagName(bean.tagName)">相关明细下载</a-button>
            <a-button class="m-l-6" v-else-if="bean.tagType=='org'" disabled>相关明细下载</a-button>


          </div>
        </div>
      </searchQueryList>
    </div>

    <OdsCheckorgList ref="odsCheckorgList"  @setOrgsData="setOrgsData"></OdsCheckorgList>


    <!-- 图形展示 -->
    <risk-graph ref="riskGraphModal"/>

  </div>
</template>

<script>
import pick from 'lodash/pick'
import moment from "moment"
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import searchQueryList from '@/pages/ybChargeSearch/searchQueryList'
import taskTypeTab from './taskTypeTab'
import uploadTagLabel from "@/pages/ybChargeSearch/plugin/uploadTagLabel";
import { orgSelectMixin } from '@/pages/ybChargeSearch/mixins/orgSelectMixin'
import { taskQueryFormMixin } from '@/pages/ybChargeSearch/mixins/taskQueryFormMixin'
import riskGraph from "./riskGraph"
export default {
  name: "riskForm",
  mixins:[orgSelectMixin,taskQueryFormMixin],
  props: {
    taskType: {
      type: String,
      default:'riskStatistics',
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
    uploadTagLabel,
    riskGraph
  },
  data () {
    return {
      description: '数据挖掘分析表单',
      tagList:[],
      bean:{tagId:'',tagType:'tagStat',taskType:'tagStatistics'},
      datasourceAndDatabaseVO:null,
      url: {
        getTagList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getTagList",
        genTaskTypeResult: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/genTaskTypeResult",
        getResultConfigMap: "/ybChargeSearch/ybChargeSearchTask/getResultConfigMap",
      },
      tagNameId:undefined,
      graphList:[],
      sqlDetailGroupList:[],
      resultConfigMap:{},
    }
  },
  watch: {
    orgs: {
      immediate: true,
      handler(val) {
        this.changeOrgs(val)
      }
    },

    etlSource: {
      immediate: true,
      handler(val) {
        this.queryGraphList(val)
      }
    },
  },
  computed: {
    fnType: function() {
      return this.bean.taskType;
    },
  },
  activated(){
    this.$forceUpdate()
  },
  beforeMount() {
    this.loadResultConfigMap()
    this.queryGraphList()
    this.querySqlDetailGroupList()
  },
  methods: {
    //获取配置信息
    loadResultConfigMap(){
      getAction(this.url.getResultConfigMap, {}).then((res) => {
        if (res.success) {
          this.resultConfigMap = res.result;
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    selectTag(val){
      let selectArr = this.tagList.filter(item=>item.NAME+'#'+item.TAG_INDEX == val);
      if(selectArr.length>0){
        this.bean.tagName = selectArr[0].NAME
        this.bean.taskType = selectArr[0].TAG_TYPE
        this.bean.tagId = selectArr[0].TAG_INDEX
      }else{
        this.bean.tagName=''
        this.bean.taskType='tagStatistics'
        this.bean.tagId =''
        if(this.bean.tagType=='patient'){
          this.bean.taskType = 'patientRiskGroupStatistics'
        }else if(this.bean.tagType=='doctor'){
          this.bean.taskType = 'doctorRiskGroupStatistics'
        }else if(this.bean.tagType=='org'){
        this.bean.taskType = 'suspiciousGroupStatistics'
        }
      }
      let parentTagType= this.bean.tagName?this.bean.tagName:this.bean.tagType
      //医院标签  动态改变列表项
      if(this.bean.tagType!='tagStat'&&(this.bean.tagType=='org'||parentTagType)){
        if(this.bean.taskType=='suspiciousGroupStatistics'){
          parentTagType = ''
        }
        this.selectOrgRiskTag();
      }
    },
    selectOrgRiskTag(){
      this.$nextTick(() => {
        this.searchQuery()
      })
    },

    selectTagType(val){
      if(val=='patient'){
        this.bean.taskType = 'patientRiskGroupStatistics'
      }else if(val=='doctor'){
        this.bean.taskType = 'doctorRiskGroupStatistics'
      }else if(val=='tagStat'){
        this.bean.taskType = 'tagStatistics'
      }else if(val=='org'){
        this.bean.taskType = 'suspiciousGroupStatistics'
      }
      this.bean.tagName=''
      this.changeTagType()
    },

    //数据挖掘选择标签类型  医院标签/患者标签
    async changeTagType(){
      this.getTagList()
    },

    changeOrgs(orgArr){
      this.getTagList(orgArr);
    },

    //获取标签列表
    async getTagList(orgArr,etlSource,taskType){
      if(!orgArr){
        orgArr = this.form.getFieldValue('orgs')
      }
      if(!etlSource){
        etlSource = this.form.getFieldValue('etlSource')
      }
      if(!taskType){
        taskType = this.bean.taskType
      }
      this.tagList = []
      let orgs = orgArr&&orgArr.length>0?orgArr.join('|'):''
      if(taskType=='tagStatistics'){
        return
      }
      this.$refs.searchQueryList.loading = true
      await getAction(this.url.getTagList, {dataSource:this.userInfo.dataSource,etlSource, orgs,taskType}).then((res) => {
        if (res.success) {
          if(res.result&&res.result.length>0){
            this.tagList = res.result.filter(item =>item.COUNT>0)
          }
          if(this.tagNameId == ''&&this.tagList.length>0&&this.bean.tagName){
            let tagNameList = this.tagList.filter(item =>item.NAME==this.bean.tagName)
            if(tagNameList.length>0){
              this.tagNameId = tagNameList[0].NAME+'#'+tagNameList[0].TAG_INDEX
              console.log(this.tagNameId)
              this.selectTag(this.tagNameId)
            }
          }else if(this.tagList.length==0||this.tagList.filter(item =>item.NAME+'#'+item.TAG_INDEX==this.tagNameId).length==0){
            this.tagNameId = ''
            this.selectTag(this.tagNameId)
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    clearExcelTable(){
      this.bean = Object.assign({}, {tagId:this.bean.tagId,tagType:this.bean.tagType,taskType:this.bean.taskType})
      this.tagNameId = undefined
    },

    changeTaskType(key){
      this.$emit('changeTaskType',key);
    },
    setFormData(data,selectOrgsArr){
      this.form.setFieldsValue(pick(data,'orgs','chargedateStartdate','chargedateEnddate','etlSource'))
      this.orgs = data.orgs
      this.selectOrgsArr = selectOrgsArr
      this.datasourceAndDatabaseVO = data.datasourceAndDatabaseVO
      this.etlSource = data.etlSource
      this.$nextTick(() => {
        this.searchQuery()
      })
    },

    //获取图形列表
    queryGraphList(etlSource){
      if(!etlSource){
        etlSource = this.form.getFieldValue('etlSource')
      }
      getAction(this.url.genTaskTypeResult, {dataSource:this.userInfo.dataSource,taskType:'datamining_graph_data_group',etlSource}).then((res) => {
        if (res.success) {
          this.graphList = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //获取模型明细标签汇总
    querySqlDetailGroupList(orgArr){
      if(!orgArr){
        orgArr = this.form.getFieldValue('orgs')
      }
      let orgs = orgArr&&orgArr.length>0?orgArr.join('|'):''
      getAction(this.url.genTaskTypeResult, {dataSource:this.userInfo.dataSource,taskType:'datamining_sql_detail_group',orgs}).then((res) => {
        if (res.success) {
          this.sqlDetailGroupList = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },


    filterGraphByTagName() {
      if(this.graphList&&this.graphList.length>0){
        return this.graphList.filter(item=>item.TAG_NAME==this.bean.tagName).length>0?true:false
      }
      return false
    },

    filterSqlDetailByTagName(){
      if(this.sqlDetailGroupList&&this.sqlDetailGroupList.length>0){
        return this.sqlDetailGroupList.filter(item=>item.TAG_NAME==this.bean.tagName).length>0?true:false
      }
      return false
    },

    //直接查询结果进行展示
    searchQuery(){
      //切换左侧菜单
      this.$emit('selectTagName',this.bean.taskType,this.bean.tagName);
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.fnType
          this.$refs.searchQueryList.changeColums()
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
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.fnType
          formData.jsonStr=JSON.stringify(formData)
          this.saveTaskByType(formData);

        }
      })
    },

    saveTaskByType(formData){
      const that = this;
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
    },

    //查询明细
    searchQueryDetail(queryParam){
      let model = this.formatFormQueryData(this.getFormQueryData())
      //查询的参数
      this.$refs.searchQueryList.queryParam = Object.assign({orgs:model.orgs,etlSource:model.etlSource,dataSource:model.dataSource,
          chargedateStartdate:model.chargedateStartdate,chargedateEnddate:model.chargedateEnddate},
        queryParam);
      this.$refs.searchQueryList.loadData(1);
      this.$refs.searchQueryList.showDetail = true
    },

    //创建全年就诊清单任务
    createVisitTask(queryParam){
      let formData = Object.assign({},this.formatFormQueryData(this.getFormQueryData()),queryParam);
      formData.jsonStr=JSON.stringify(formData)
      this.saveTaskByType(formData)
    },

    //创建全年收费清单任务
    createChargeTask(queryParam){
      let formData = Object.assign({},this.formatFormQueryData(this.getFormQueryData()),queryParam);
      formData.jsonStr=JSON.stringify([formData])
      this.saveTaskByType(formData)
    },

    //分步图形展示
    showRiskGraph(graphName){
      let queryParam = {tagId:graphName,dataSource:this.userInfo.dataSource,taskType:'datamining_graph_data',etlSource:this.form.getFieldValue('etlSource')}
      this.$refs.riskGraphModal.initChart(queryParam)
      this.$refs.riskGraphModal.title = graphName
    },

    //下载标签模型明细
    createTaskByTagName(tagName){
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.tagName = tagName
          formData.taskType = 'datamining_sql_detail'
          formData.jsonStr=JSON.stringify(formData)
          this.saveTaskByType(formData);
        }
      })
    },

    //左侧菜调用
    changeQuery(taskType,tagType,tagName){
      this.bean = {tagId:'',tagType,taskType,tagName}
      this.tagNameId = ''
      if(taskType=='tagStatistics'){
        this.$nextTick(() => {
          this.searchQuery()
        })
      }else{
        this.getTagList()
      }

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
