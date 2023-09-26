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
              <a-form-item label="收费日期" >
                <a-date-picker placeholder="请选择收费日期" v-decorator="['itemChargedate', {}]" :style="{width:'calc(100% - 80px) !important'}"></a-date-picker>
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

              <a-col :md="8" :sm="12">
                <a-form-item label="病案号" >
                  <a-input placeholder="请输入病案号，多个病案号用#分隔" v-decorator="['caseId', {}]"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="12">
                <a-form-item label="医生姓名" >
                  <a-input placeholder="请输入医生姓名，多个医生姓名用#分隔" v-decorator="['doctorname', {}]"></a-input>
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
                  <a-col :md="6" :sm="12">
                    <a-form-item label="收费项目A关键字" style="margin-bottom:10px;">
                      <a-input placeholder="请输入收费项目A关键字" v-model="item.itemname"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="12">
                    <a-form-item label="收费项目B关键字" style="margin-bottom:10px;">
                      <a-input placeholder="请输入收费项目B关键字" v-model="item.itemname1"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="12">
                    <a-form-item label="收费项目名称类型" style="margin-bottom:10px;">
                      <m-dict-select-tag v-model="item.itemType" dictCode="ITEM_TYPE" :required="true"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>

                  <a-col :md="6" :sm="12">
                    <a-form-item label="重复收费类型" style="margin-bottom:10px;">
                      <m-dict-select-tag v-model="item.item1Type" dictCode="ITEM1_TYPE" :required="true"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="24" v-if="item.toggleStatus">
                  <a-col :md="6" :sm="8">
                    <a-form-item label="收费项目B违规判断" style="margin-bottom:10px;">
                      <m-dict-select-tag v-model="item.item1Wgtype" dictCode="ITEM1_WGTYPE" :required="true"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="8">
                    <a-form-item label="超量检查的类型" style="margin-bottom:10px;">
                      <m-dict-select-tag v-model="item.qtyType" dictCode="QTY_TYPE" :required="true"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="8">
                    <a-form-item label="超量的数值(不含)" style="margin-bottom:10px;">
                      <a-input-number placeholder="请输入超量的数值" v-model="item.qtyNum" style="width:100%"></a-input-number>
                    </a-form-item>
                  </a-col>

                  <a-col :md="6" :sm="8">
                    <a-form-item label="是否输出同一天的手术项目" style="margin-bottom:10px;">
                      <m-dict-select-tag v-model="item.isSameDay" dictCode="YESNO" :required="true"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>

                  <a-col :md="6" :sm="6">
                    <a-form-item label="违规案例提示" style="margin-bottom:10px;">
                      <a-input placeholder="请输入违规案例提示" v-model="item.wgRemark"></a-input>
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
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item key="1">
                  <a-upload name="file"
                            accept=".xls,.xlsx"
                            :showUploadList="false"
                            :multiple="false"
                            :headers="tokenHeader"
                            :beforeUpload="beforeUpload"
                            :action="importExcelUrl"
                            @change="handleImportExcel">
                    <a-icon type="upload" /> 从Excel导入数据
                  </a-upload>
                </a-menu-item>
                <a-menu-item key="2">
                  <a @click="downloadTemplate"><a-icon type="download" /> 下载Excel导入模板</a>
                </a-menu-item>
              </a-menu>
              <a-button>从Excel导入查询项目<a-icon type="down" /> </a-button>
            </a-dropdown>

            <a-button @click="openSelectCase('case')">项目相关案例</a-button>

            <a-button @click="openSelect">从关键词库导入查询项目</a-button>

            <a-popconfirm title="确定要根据当前查询条件创建收费项目月度用量分析报表查询任务吗?" @confirm="handleOk('1')">
              <a-button >收费项目月度用量分析</a-button>
            </a-popconfirm>

            <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk()">
              <a-button type="primary">创建文件下载任务</a-button>
            </a-popconfirm>
          </div>
        </div>
      </search-task-list>
    </div>

    <excel-table-list ref="excelTableList" @setExcelTable="setExcelTable" @saveTask="saveTask"></excel-table-list>

    <SelectYbChargeitemChecklist ref="selectRef" :selected="selectData" :param="{examineStatus: '1'}" @setSelectTable="setSelectTable" @saveTask="saveTask" ></SelectYbChargeitemChecklist>

    <SelectYbChargeCaseList  ref="selectCaseRef" :paramData="paramData"></SelectYbChargeCaseList>

    <OdsCheckorgList ref="odsCheckorgList"  @setOrgsData="setOrgsData"></OdsCheckorgList>
  </div>
</template>

<script>

const excelTableBean= {itemname:'',itemname1:'',itemType:'yb',item1Type:'oneday',item1Wgtype:'haveB',qtyType:'charge_qty',qtyNum:'',isSameDay:'0',
                     wgRemark:'', toggleStatus:true}

import pick from 'lodash/pick'
import moment from "moment"
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import searchTaskList from '@/pages/ybChargeSearch/searchTaskList'
import taskTypeTab from '@/pages/ybChargeSearch/plugin/taskTypeTab'
import excelTableList from '@/pages/ybChargeSearch/plugin/excelTableList'
import SelectYbChargeitemChecklist from "@/pages/ybChargeSearch/plugin/selectYbChargeitemChecklist"
import SelectYbChargeCaseList from "@/pages/ybChargeSearch/plugin/selectYbChargeCaseList"
import { orgSelectMixin } from '@/pages/ybChargeSearch/mixins/orgSelectMixin'
import { taskQueryFormMixin } from '@/pages/ybChargeSearch/mixins/taskQueryFormMixin'
export default {
  name: "searchForm",
  mixins:[orgSelectMixin,taskQueryFormMixin],
  props: {
    taskType: {
      type: String,
      default:'search',
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
    excelTableList,
    SelectYbChargeitemChecklist,
    SelectYbChargeCaseList
  },
  data () {
    return {
      description: '收费明细查询表单',
      excelTableData:[Object.assign({}, excelTableBean)],
      datasourceAndDatabaseVO:null,
      url:{
        saveTaskBatch: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskBatch",
      },
      importUrl: '/ybChargeSearch/ybChargeSearchTask/importExcel',
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      fileList:[],
      importData:[],//excel导入的结果数据
      queryValues:{},
      paramData:[],
      selectVisible:false,
      selectData:[],//关键词库数据
    }
  },
  computed: {
    importExcelUrl: function() {
      if(!this.importUrl.startsWith('http')){
        return `${this.$config['domianURL']}/${this.importUrl}`
      }
      return this.importUrl;
    },
    fnType: function() {
      return this.taskType;
    },

  },
  activated(){
    console.log('activated')
    this.$forceUpdate()
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
      this.form.setFieldsValue(pick(data,'orgs','chargedateStartdate','chargedateEnddate','visittype','clientname','visitid','itemChargedate','etlSource','dataStaticsLevel','caseId','doctorname','idNo'))
      this.orgs = data.orgs
      this.selectOrgsArr = selectOrgsArr
      this.datasourceAndDatabaseVO = data.datasourceAndDatabaseVO
    },
    handleOk (isSearchDrug='0') {
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
          if(isSearchDrug=='1'){
            formData.isSearchDrug = isSearchDrug
          }else{
            formData.isSearchDrug = null
          }
          formData.taskType = this.fnType
          this.saveTaskBatch(formData,'')
        }
      })
    },
    //search保存
    saveTaskBatch(formData,type){
      let msg = '';
      let excelTableData=[]
      if(type=='excel'){
        excelTableData = this.importData
      }else if(type=='select'){
        excelTableData = this.$refs.selectRef.selectData
      }else{
        excelTableData = this.excelTableData
      }
      delete formData.itemname
      excelTableData.forEach(function(vo,index){
        Object.assign(vo, formData);
        if(!vo.itemname&&!vo.orgs){
          if(!vo.clientname&&!vo.visitid&&!vo.itemChargedate&&!vo.idNo&&!vo.caseId&&!vo.doctorname&&!vo.doctorid){
            msg +='第'+(index+1)+'行医院名称和收费项目名称A不能同时为空,';
          }
        }
        if(!vo.itemname&&vo.itemname1){
          msg +='第'+(index+1)+'行查询的收费项目名称A为空时，收费项目名称B不能存在,';
        }
        //项目A为空 无法进行收费项目月度用量分析
        if(formData.isSearchDrug=='1'&&!vo.itemname){
          msg +='第'+(index+1)+'行查询的收费项目名称A为空时，无法进行收费项目月度用量分析,';
        }
        //收费项目名称A 收费项目名称B 不能相同
        if(vo.itemname&&vo.itemname==vo.itemname1){
          msg +='第'+(index+1)+'行查询的收费项目名称A和收费项目名称B不能相同,';
        }
      });
      if(msg){
        this.$message.warning(msg+'请先核对输入的查询项目信息!');
        return false
      }
      let param = {jsonStr:JSON.stringify(excelTableData),taskType:formData.taskType};
      this.confirmLoading = true;
      httpAction(this.url.saveTaskBatch,param,'post').then((res)=>{
        if(res.success){
          if(type=='excel'){
            this.$refs.excelTableList.close()
          }else if(type=='select'){
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
        this.$refs.selectRef.show(this.queryValues)

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
      this.$refs.selectRef.selectData.map(item=>{
        item.toggleStatus = true
        this.excelTableData.push(item)
      })
      this.$refs.selectRef.close()
    },

    //excel导入项目条件
    setExcelTable(){
      this.excelTableData =[]
      this.importData.map(item=>{
        item.toggleStatus = true
        this.excelTableData.push(item)
      })
      this.$refs.excelTableList.close()
    },


    downloadTemplate() {
      window.open(this.$config['domianURL'] + "/sys/common/download/chargeImportTemplate.xlsx");
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

    /* 导入 */
    handleImportExcel(info) {
      this.fileList = info.fileList
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        let res = info.file.response
        if (res.success) {
          this.importData = res.result
          this.$refs.excelTableList.initData(res.result)
        } else {
          //this.$message.error(`文件上传失败: ${info.file.response.message} `);
          this.$notification.error({
            message: '文件上传失败',
            description:
              `${res.message} `,
          });
        }
        this.confirmLoading = false;
        this.fileList = []
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.response.message} `);
        this.confirmLoading = false;
      }
    },


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
