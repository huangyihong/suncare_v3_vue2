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
                <a-form-item  label="时间范围" :required="true" :validateStatus="checkChargedate" :help="chargedateHelp">
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
              <a-col :xxl="8" :md="6" :sm="8">
                <a-form-item label="就诊类型">
                  <a-select v-decorator="['visittype', validatorRules.required]" >
                    <a-select-option v-for="item in visittypeOptions" :key="item.code" :value="item.code"> {{item.name}} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8" >
                <a-form-item label="患者姓名" >
                  <a-input placeholder="请输入患者姓名，多个患者姓名用#分隔" v-decorator="['clientname', {}]"></a-input>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8">
                <a-form-item label="就诊号" >
                  <a-input placeholder="请输入就诊号，多个就诊号用#分隔" v-decorator="['visitid', {}]"  ></a-input>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8">
                <a-form-item label="出院日期" >
                  <a-date-picker placeholder="请选择出院日期" v-decorator="['leavedate', {}]" :style="{width:'calc(100% - 80px) !important'}"></a-date-picker>
                  <a @click="handleToggleSearch" class="m-l-6 ">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                  </a>
                </a-form-item>
              </a-col>
              <div v-show="toggleSearchStatus">
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

                <a-col :md="8" :sm="8">
                  <a-form-item label="患者身份证号" >
                    <a-input placeholder="请输入患者身份证号，多个患者身份证号用#分隔" v-decorator="['idNo', {}]"></a-input>
                  </a-form-item>
                </a-col>
              </div>



            </a-row>
          </a-form>
        </div>
      </a-card>

      <a-card class="m-t-10" :bordered="false" >
        <task-type-tab :taskType="taskType" @changeTaskType="changeTaskType" v-if="!singlePage"></task-type-tab>

        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <template v-for="(item,index) in excelTableData">
              <div class="fieldset-box1 " style="float:left" :style="{width:'calc(100% - 50px)'}">
                <div style="float:left" :style="{width:'calc(100% - 20px)'}">
                  <a-row :gutter="24">
                    <a-col :md="8" :sm="12">
                      <a-form-item label="药品名称" style="margin-bottom:10px;">
                        <a-input placeholder="请输入药品名称" v-model="item.drugName"></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="12">
                      <a-form-item label="药品大类" style="margin-bottom:10px;">
                        <a-input placeholder="请输入药品大类" v-model="item.drugType"></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="12">
                      <a-form-item label="药品小类" style="margin-bottom:10px;">
                        <a-input placeholder="请输入药品小类" v-model="item.drugTypeSmall"></a-input>
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <a-row :gutter="24" v-if="item.toggleStatus">
                    <a-col :md="8" :sm="12">
                      <a-form-item label="限制类型" style="margin-bottom:10px;">
                        <m-dict-select-tag v-model="item.limitType" dictCode="DC_DRUG_LIMIT_TYPE" :required="true"></m-dict-select-tag>
                      </a-form-item>
                    </a-col>

                    <a-col :md="8" :sm="12">
                      <a-form-item label="限制内容" style="margin-bottom:10px;">
                        <a-input placeholder="年龄举例: >=4,<18" v-model="item.limitContent"></a-input>
                      </a-form-item>
                    </a-col>

                    <a-col :md="8" :sm="12">
                      <a-form-item label="备注" style="margin-bottom:10px;">
                        <a-input placeholder="请输入备注" v-model="item.remark"></a-input>
                      </a-form-item>
                    </a-col>

                  </a-row>
                </div>
                <div style="width:20px;float:left" class="rotate90">
                  <a @click="item.toggleStatus=!item.toggleStatus"  class="m-l-6 " style="font-size:16px;">
                    <a-icon :type="item.toggleStatus ? 'double-left' : 'double-right'" />
                  </a>
                </div>

              </div>
              <div style="font-size: 20px;color: #aaa;padding:0 16px;width:50px;float:left">
                <a-icon type="plus-circle" class="m-r-10" @click="addExcelTable"></a-icon>
                <a-icon type="minus-circle" @click="delExcelTable(index)" v-if="excelTableData.length>1"></a-icon>
              </div>
            </template>
          </a-form>
        </div>
      </a-card>
    </a-spin>

    <div>
      <search-task-list ref="searchTaskList" :taskType="fnType">
        <div style="text-align: right;margin:0 20px 20px 0;" slot="createTaskBtn">
          <div class="table-operator" style='margin-right: 45px' v-has="'ybChargeTask:createTask'">
            <a-button @click="clearQueryData">清空查询条件</a-button>
            <a-button @click="openDrugTop200">top200口服药</a-button>
            <a-button @click="openDrugTop200Detail">top200口服药明细</a-button>
            <a-button @click="openSelectCase('drug')">药品相关案例</a-button>
            <a-button @click="openSelect">从药品规则库导入查询项目</a-button>
            <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk">
              <a-button type="primary">创建文件下载任务</a-button>
            </a-popconfirm>
          </div>
        </div>
      </search-task-list>
    </div>

    <select-yb-charge-drug-rule-list ref="selectDrugRuleRef" :selected="selectData" :param="{examineStatus: '1'}" @setSelectTable="setSelectTable" @saveTask="saveTask"></select-yb-charge-drug-rule-list>

    <SelectYbChargeCaseList  ref="selectCaseRef" :paramData="paramData"></SelectYbChargeCaseList>

    <OdsCheckorgList ref="odsCheckorgList"  @setOrgsData="setOrgsData"></OdsCheckorgList>

    <m-modal centered
             title="top200口服药"
             width="90%"
             :visible="drugTop200Visible"
             :destroyOnClose="true"
             @cancel="drugTop200Visible=false"
             :footer="null"
    >
      <drugTop200Form ref="drugTop200Form" taskType="drug_top200" @close="drugTop200Visible=false"/>
    </m-modal>

    <m-modal centered
             title="top200口服药明细"
             width="90%"
             :visible="drugTop200DetailVisible"
             :destroyOnClose="true"
             @cancel="drugTop200DetailVisible=false"
             :footer="null"
    >
      <drugTop200DetailForm ref="drugTop200DetailForm" taskType="drug_top200_detail" @close="drugTop200DetailVisible=false"/>
    </m-modal>
  </div>
</template>

<script>
const excelTableBean= {drugName:'',drugType:'',drugTypeSmall:'',limitType:'age',limitContent:'',remark:'',toggleStatus:true}
import pick from 'lodash/pick'
import moment from "moment"
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import searchTaskList from '@/pages/ybChargeSearch/searchTaskList'
import taskTypeTab from '@/pages/ybChargeSearch/plugin/taskTypeTab'
import SelectYbChargeCaseList from "@/pages/ybChargeSearch/plugin/selectYbChargeCaseList"
import SelectYbChargeDrugRuleList from "@/pages/ybChargeSearch/plugin/selectYbChargeDrugRuleList.vue"
import { orgSelectMixin } from '@/pages/ybChargeSearch/mixins/orgSelectMixin'
import { taskQueryFormMixin } from '@/pages/ybChargeSearch/mixins/taskQueryFormMixin'
import drugTop200Form from "@/pages/ybChargeSearch/plugin/drugTop200Form"
import drugTop200DetailForm from "@/pages/ybChargeSearch/plugin/drugTop200DetailForm"
export default {
  name: "drugForm",
  mixins:[orgSelectMixin,taskQueryFormMixin],
  props: {
    taskType: {
      type: String,
      default:'drugRuleStatistics',
      required: true
    },
    singlePage: {
      type: Boolean,
      default: false
    },
  },
  components: {
    MDictSelectTag,
    taskTypeTab,
    searchTaskList,
    SelectYbChargeCaseList,
    SelectYbChargeDrugRuleList,
    drugTop200Form,
    drugTop200DetailForm,
  },
  data () {
    return {
      description: '药品收费违规查询表单',
      excelTableData:[Object.assign({}, excelTableBean)],
      datasourceAndDatabaseVO:null,
      url:{
        saveTaskBatch: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskBatch",
      },
      queryValues:{},
      paramData:[],
      selectVisible:false,
      selectData:[],//关键词库数据
      drugTop200Visible:false,
      drugTop200DetailVisible:false,
    }
  },
  activated(){
    this.$forceUpdate()
  },
  computed: {
    fnType: function() {
      return this.taskType;
    },
  },
  methods: {
    addExcelTable(){
      let bean = Object.assign({}, excelTableBean);
      bean.toggleStatus = false
      this.excelTableData.push(bean)
    },
    delExcelTable(data_index){
      this.excelTableData.splice(data_index,1)
    },
    clearExcelTable(){
      this.excelTableData = [Object.assign({}, excelTableBean)]
    },
    changeTaskType(key){
      this.$emit('changeTaskType',key);
    },
    setFormData(data,selectOrgsArr){
      this.form.setFieldsValue(pick(data,'orgs','chargedateStartdate','chargedateEnddate','visittype','clientname','visitid','leavedate','etlSource','dataStaticsLevel','idNo'))
      this.orgs = data.orgs
      this.selectOrgsArr = selectOrgsArr
      this.datasourceAndDatabaseVO = data.datasourceAndDatabaseVO
    },
    handleOk () {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          if(!values.chargedateStartdate||!values.chargedateEnddate){
            this.checkChargedate='error'
            this.chargedateHelp = '这是必填项!'
            this.$message.warning('请选择时间范围');
            return
          }
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.fnType
          this.saveTaskBatch(formData,'')
        }
      })
    },
    //search保存
    saveTaskBatch(formData,type){
      let msg = '';
      let excelTableData=[]
      if(type=='select'){
        excelTableData = this.$refs.selectDrugRuleRef.selectData
      }else{
        excelTableData = this.excelTableData
      }
      excelTableData.forEach(function(vo,index){
        vo = Object.assign({},{drugName:vo.drugName,drugType:vo.drugType,drugTypeSmall:vo.drugTypeSmall,
          limitType:vo.limitType,limitContent:vo.limitContent,remark:vo.remark}, formData);
        if(!vo.drugName){
          msg +='第'+(index+1)+'行药品名称不能为空,';
        }
        if(!vo.limitType){
          msg +='第'+(index+1)+'行限制类型不能为空,';
        }
        if(!vo.limitContent){
          msg +='第'+(index+1)+'行限制内容不能为空,';
        }
        excelTableData[index] = vo
      });
      if(msg){
        this.$message.warning(msg+'请先核对输入的查询药品信息!');
        return false
      }

      let param = {jsonStr:JSON.stringify(excelTableData),taskType:formData.taskType};
      this.confirmLoading = true;
      httpAction(this.url.saveTaskBatch,param,'post').then((res)=>{
        if(res.success){
          if(type=='select'){
            this.$refs.selectRef.close()
          }
          this.$success({
            title: '操作成功',
            content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
          });
          this.clearExcelTable()
          this.reloadTaskTable(1)
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },

    saveTask(type){
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          if(!values.chargedateStartdate||!values.chargedateEnddate){
            this.checkChargedate='error'
            this.chargedateHelp = '这是必填项!'
            this.$message.warning('请选择时间范围');
            return
          }
          let formData =  this.formatFormQueryData(Object.assign({},this.bean, values))
          formData.taskType = this.fnType
          this.saveTaskBatch(formData,type)
        }
      })
    },

    //选择窗口
    openSelect(){
      if(this.beforeUpload()){
        this.selectData=[]
        this.$refs.selectDrugRuleRef.show(this.queryValues)
      }
    },

    openSelectCase(type){
      this.paramData=this.excelTableData
      this.$nextTick(() => {
        this.$refs.selectCaseRef.show(type)
      });
    },

    //关键词选择导入项目条件
    setSelectTable(){
      this.excelTableData =[]
      this.$refs.selectDrugRuleRef.selectData.map(item=>{
        item.toggleStatus = true
        this.excelTableData.push(item)
      })
      this.$refs.selectDrugRuleRef.close()
    },

    beforeUpload() {
      let flag = false;
      this.form.validateFields((err, values) => {
        this.queryValues=values
        if (!err) {
          flag = true;
        }else{
          let {chargedateStartdate,chargedateEnddate} = values;
          if(!chargedateStartdate||!chargedateEnddate){
            this.$message.warning('请选择时间范围');
          }
        }
      })
      return flag
    },

    openDrugTop200(){
      this.drugTop200Visible=true
      let data = {chargedateStartdate:this.form.getFieldValue('chargedateStartdate'),chargedateEnddate:this.form.getFieldValue('chargedateEnddate')}
      this.$nextTick(() => {
        this.$refs.drugTop200Form.setFormData(data)
      })

    },

    openDrugTop200Detail(){
      this.drugTop200DetailVisible=true
      let data = {orgs:this.orgs,chargedateStartdate:this.form.getFieldValue('chargedateStartdate'),chargedateEnddate:this.form.getFieldValue('chargedateEnddate')}
      this.$nextTick(() => {
        this.$refs.drugTop200DetailForm.setFormData(data,this.selectOrgsArr)
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
