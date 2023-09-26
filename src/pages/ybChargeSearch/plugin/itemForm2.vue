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

              <a-col :md="8" :sm="8">
                <a-form-item label="标签名称">
                  <a-select
                    v-decorator="['tagName', {}]"
                    show-search
                    allowClear
                    placeholder="请选择标签名称"
                    :dropdownMatchSelectWidth="false"
                  >
                    <a-select-option  v-for="(item,index) in tagList" :value="item.NAME" :key="item.NAME">{{item.TAGNAME}}</a-select-option>
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

      </a-card>
    </a-spin>

    <div>
      <search-task-list ref="searchTaskList" :taskType="fnType">
        <div style="text-align: right;margin:0 20px 20px 0;" slot="createTaskBtn">
          <div class="table-operator" style='margin-right: 45px' v-has="'ybChargeTask:createTask'">
            <a-button @click="clearQueryData">清空查询条件</a-button>
            <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk">
              <a-button type="primary">创建文件下载任务</a-button>
            </a-popconfirm>
          </div>
        </div>
      </search-task-list>
    </div>



    <OdsCheckorgList ref="odsCheckorgList"  @setOrgsData="setOrgsData"></OdsCheckorgList>

  </div>
</template>

<script>
import pick from 'lodash/pick'
import moment from "moment"
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import searchTaskList from '@/pages/ybChargeSearch/searchTaskList'
import taskTypeTab from '@/pages/ybChargeSearch/plugin/taskTypeTab'
import { orgSelectMixin } from '@/pages/ybChargeSearch/mixins/orgSelectMixin'
import { taskQueryFormMixin } from '@/pages/ybChargeSearch/mixins/taskQueryFormMixin'
export default {
  name: "itemForm",
  mixins:[orgSelectMixin,taskQueryFormMixin],
  props: {
    taskType: {
      type: String,
      default:'itemStatistics',
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
  },
  data () {
    return {
      description: '医保收费清单汇总(按医院)',
      bean:{},
      tagList:[],//标签列表
      url: {
        getTagList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getTagList",
        getOrgList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgList",
      },
      owntypeList: [],//机构属性列表
      localTagList: [],//机构所在地列表
      hosplevelList: [],//机构等级
    }
  },
  watch: {
    orgs: {
      immediate: true,
      handler(val) {
        this.changeOrgs(val)
      }
    },
  },
  computed: {
    fnType: function() {
      return this.taskType;
    },
  },
  activated(){
    this.$forceUpdate()
  },
  beforeMount() {
    this.queryOwntypeLocalTagHosplevel()
  },
  methods: {
    clearExcelTable(){
    },
    changeTaskType(key){
      this.$emit('changeTaskType',key);
    },
    setFormData(data,selectOrgsArr){
      if(!data.fundValType){
        data.fundValType = '>='
      }
      this.form.setFieldsValue(pick(data,'orgs','chargedateStartdate','chargedateEnddate','visittype','tagName',
        'etlSource','dataStaticsLevel','owntype','localTag','hosplevel','fundValType','fundValType'))
      this.orgs = data.orgs
      this.selectOrgsArr = selectOrgsArr
      this.datasourceAndDatabaseVO = data.datasourceAndDatabaseVO
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
        taskType = this.taskType
      }
      this.tagList = []
      let orgs = orgArr&&orgArr.length>0?orgArr.join('|'):''
      await getAction(this.url.getTagList, {dataSource:this.userInfo.dataSource,etlSource, orgs,taskType}).then((res) => {
        if (res.success) {
          if(res.result&&res.result.length>0){
            this.tagList = res.result.filter(item =>item.COUNT>0)
          }

          let tagName = this.form.getFieldValue('tagName')
          if(tagName&&this.tagList.length>0&&this.tagList.filter(item =>item.NAME==tagName).length>0){
            this.form.setFieldsValue({tagName:tagName})
          }else{
            this.form.setFieldsValue({tagName:undefined})
          }
        }else{
          this.$message.warning(res.message);
        }
      })
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

    handleOk () {
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
          this.saveTaskByType(formData)
        }
      })
    },
    //其他taskType保存
    saveTaskByType(formData){
      if(formData.orderby){
        formData.orderby = formData.orderby + " "+ formData.orderbyType
      }
      formData.jsonStr=JSON.stringify(formData)
      this.confirmLoading = true
      httpAction(this.url.saveTaskByType,formData,'post').then((res)=>{
        if(res.success){
          this.$success({
            title: '操作成功',
            content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
          });
          this.reloadTaskTable(1)
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
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
