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

              <a-col :md="8" :sm="12" v-if="bean.taskType=='search'||(bean.taskType=='riskStatistics'&&tagType=='doctor')||bean.taskType=='drugRuleStatistics'">
                <a-form-item  label="时间范围">
                  <a-date-picker placeholder="" v-decorator="['chargedateStartdate', bean.taskType=='riskStatistics'?{}:validatorRules.requiredOnly]" class="search-divider-item2"></a-date-picker>
                  <div class="search-divider">~</div>
                  <a-date-picker placeholder=""v-decorator="['chargedateEnddate', bean.taskType=='riskStatistics'?{}:validatorRules.requiredOnly]" class="search-divider-item2"></a-date-picker>
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

              <a-col :md="8" :sm="12" v-else>
                <a-form-item  label="时间范围">
                  <a-date-picker class="search-divider-item2"  placeholder="" v-decorator="['chargedateStartdate', bean.taskType=='riskStatistics'?{}:validatorRules.requiredOnly]"
                                 mode="year"
                                 :open='yearShowStart'
                                 format='YYYY'
                                 @openChange="openChangeStart"
                                 @panelChange="panelChangeStart"></a-date-picker>
                  <div class="search-divider">~</div>
                  <a-date-picker class="search-divider-item2"  placeholder="" v-decorator="['chargedateEnddate', bean.taskType=='riskStatistics'?{}:validatorRules.requiredOnly]"
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

              <div v-show="bean.taskType!='riskStatistics'">
                <a-col :md="8" :sm="8">
                  <a-form-item label="就诊类型">
                    <a-select v-decorator="['visittype', validatorRules.required]" >
                      <a-select-option v-for="item in visittypeOptions" :key="item.code" :value="item.code"> {{item.name}} </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col v-if="!showTagSelect"></a-col>
                <a-col :md="8" :sm="8" v-if="showTagSelect">
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
                <div v-show="bean.taskType!='yearStatistics'&&bean.taskType!='itemStatistics'&&bean.taskType!='itemByDeptStatistics'">
                  <a-col :md="8" :sm="8" >
                    <a-form-item label="患者姓名" >
                      <a-input placeholder="请输入患者姓名，多个患者姓名用#分隔" v-decorator="['clientname', {}]"></a-input>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="8">
                    <a-form-item label="就诊号" >
<!--                      <a-input placeholder="请输入就诊号，多个就诊号用#分隔" v-decorator="['visitid', validatorRules.required]" :style="{width:!showTagSelect?'100%':'calc(100% - 80px) !important'}" v-if="bean.taskType=='itemByVisitStatistics'"></a-input>-->
                      <a-input placeholder="请输入就诊号，多个就诊号用#分隔" v-decorator="['visitid', {}]" :style="{width:!showTagSelect?'100%':'calc(100% - 80px) !important'}" ></a-input>
                      <a @click="handleToggleSearch" class="m-l-6 " v-if="showTagSelect">
                        {{ toggleSearchStatus ? '收起' : '展开' }}
                        <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                      </a>
                    </a-form-item>
                  </a-col>


                  <a-col :md="8" :sm="8" v-show="toggleSearchStatus||!showTagSelect">
                    <a-form-item label="出院日期" >
                      <a-date-picker placeholder="请选择出院日期" v-decorator="['leavedate', {}]" :style="{width:showTagSelect?'100%':'calc(100% - 80px) !important'}"></a-date-picker>
                      <a @click="handleToggleSearch" class="m-l-6 " v-if="!showTagSelect">
                        {{ toggleSearchStatus ? '收起' : '展开' }}
                        <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                      </a>
                    </a-form-item>
                  </a-col>
                </div>

                <div v-show="toggleSearchStatus||bean.taskType=='yearStatistics'||bean.taskType=='itemStatistics'||bean.taskType=='itemByDeptStatistics'">
                  <a-col :md="8" :sm="8" v-show="bean.taskType =='visitStatistics'">
                    <a-form-item label="在院日期" >
                      <a-date-picker placeholder="请选择在院日期" v-decorator="['inHospitalDate', {}]" :style="{width:showTagSelect?'100%':'calc(100% - 80px) !important'}"></a-date-picker>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="8" v-show="false">
                    <a-form-item label="自费就诊">
                      <a-select v-decorator="['isFundpay', {}]">
                        <a-select-option v-for="item in isFundpayOptions" :key="item.code" :value="item.code"> {{item.name}} </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="12" v-show="bean.taskType=='search'">
                    <a-form-item label="病案号" >
                      <a-input placeholder="请输入病案号，多个病案号用#分隔" v-decorator="['caseId', {}]"></a-input>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="12" v-show="bean.taskType=='search'">
                    <a-form-item label="医生姓名" >
                      <a-input placeholder="请输入医生姓名，多个医生姓名用#分隔" v-decorator="['doctorname', {}]"></a-input>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="8" v-show="bean.taskType!='yearStatistics'&&bean.taskType!='itemStatistics'&&bean.taskType!='itemByDeptStatistics'">
                    <a-form-item label="患者身份证号" >
                      <a-input placeholder="请输入患者身份证号，多个患者身份证号用#分隔" v-decorator="['idNo', {}]"></a-input>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="8" v-show="bean.taskType =='visitStatistics'">
                    <a-form-item label="诊断关键字" >
                      <a-input placeholder="请输入诊断关键字" v-decorator="['diseasename', {}]" ></a-input>
                    </a-form-item>
                  </a-col>

                  <a-col :md="8" :sm="8" v-show="bean.taskType =='visitStatistics'">
                    <a-form-item label="收费清单中不包含" >
                      <a-input placeholder="请输入收费清单中不包含,多个项目用#分隔" v-decorator="['excludeItemname', {}]" ></a-input>
                    </a-form-item>
                  </a-col>

                  <template v-if="bean.taskType!='riskStatistics'">
                    <a-col :md="8" :sm="12">
                      <a-form-item label="数据来源">
                        <m-dict-select-tag v-decorator="['etlSource', {}]" dictCode="SEARCH_ETL_SOURCE" @change="changeEtlSource"></m-dict-select-tag>
                      </a-form-item>
                    </a-col>
                  </template>

                  <a-col :md="8" :sm="12">
                    <a-form-item label="数据提取层级">
                      <m-dict-select-tag v-decorator="['dataStaticsLevel', {}]" dictCode="DATA_STATICS_LEVEL"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>
                </div>
              </div>
              <template v-if="bean.taskType=='riskStatistics'">
                <a-col :md="8" :sm="12">
                  <a-form-item label="数据来源">
                    <m-dict-select-tag v-decorator="['etlSource', {}]" dictCode="SEARCH_ETL_SOURCE" @change="changeEtlSource"></m-dict-select-tag>
                  </a-form-item>
                </a-col>
              </template>

                <a-col :md="8" :sm="12" v-show="bean.taskType=='yearStatistics'||bean.taskType=='itemStatistics'">
                  <a-form-item label="机构属性">
                    <a-select v-decorator="['owntype', {}]" allowClear placeholder="请选择机构属性">
                      <a-select-option v-for="item in owntypeList" :value="item" :key="item">{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="12" v-show="bean.taskType=='yearStatistics'||bean.taskType=='itemStatistics'">
                  <a-form-item label="机构所在地">
                    <a-select v-decorator="['localTag', {}]" allowClear placeholder="请选择机构所在地">
                      <a-select-option v-for="item in localTagList" :value="item" :key="item">{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="12" v-show="bean.taskType=='yearStatistics'||bean.taskType=='itemStatistics'">
                  <a-form-item label="医院等级">
                    <a-select v-decorator="['hosplevel', {}]" allowClear placeholder="请选择医院等级">
                      <a-select-option v-for="item in hosplevelList" :value="item" :key="item">{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="12" v-show="bean.taskType=='yearStatistics'||bean.taskType=='itemStatistics'">
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
        <a-tabs v-model="bean.taskType">
          <a-tab-pane key="search" tab="收费明细导出">
            <search-form ref="searchForm"></search-form>
          </a-tab-pane>
          <a-tab-pane key="drugRuleStatistics" tab="药品收费违规查询">
            <drug-rule-form ref="drugRuleForm"></drug-rule-form>
          </a-tab-pane>
          <a-tab-pane key="yearStatistics" tab="年度统计指标">
            <year-form ref="yearForm" @changeYearFnType="changeYearFnType"></year-form>
          </a-tab-pane>
          <a-tab-pane key="visitStatistics" tab="住院及门慢清单">

          </a-tab-pane>
          <a-tab-pane key="itemStatistics" tab="医保收费清单汇总(按医院)">

          </a-tab-pane>
          <a-tab-pane key="itemByDeptStatistics" tab="医保收费清单汇总(按科室)">
            <item-by-dept-form ref="itemByDeptForm"></item-by-dept-form>
          </a-tab-pane>
          <a-tab-pane key="itemByVisitStatistics" tab="医保收费清单汇总(按就诊)">

          </a-tab-pane>
          <a-tab-pane key="riskStatistics" tab="数据挖掘分析">
            <risk-form ref="riskForm" @changeTagType="changeTagType" @selectOrgRiskTag="selectOrgRiskTag"></risk-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>

    <!--<a-card title='下载任务列表' :bordered="false" style="margin-top: -15px;">-->
    <div >
      <search-task-list ref="searchTaskList" :taskType="bean.taskType" v-if="bean.taskType!='riskStatistics'&&bean.taskType!='yearStatistics'">
        <div style="text-align: right;margin:0 20px 20px 0;" slot="createTaskBtn">
          <div class="table-operator" style='margin-right: 45px' v-has="'ybChargeTask:createTask'">
            <a-button @click="clearQueryData">清空查询条件</a-button>
            <template v-if="bean.taskType=='search'">
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

            </template>
            <template v-else-if="bean.taskType=='drugRuleStatistics'">
              <a-button @click="openDrugTop200">top200口服药</a-button>
              <a-button @click="openDrugTop200Detail">top200口服药明细</a-button>
              <a-button @click="openSelectCase('drug')">药品相关案例</a-button>
              <a-button @click="openSelect">从药品规则库导入查询项目</a-button>
              <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk">
                <a-button type="primary">创建文件下载任务</a-button>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-popconfirm title="确定要根据当前查询条件创建报表查询任务吗?" @confirm="handleOk">
                <a-button type="primary">创建文件下载任务</a-button>
              </a-popconfirm>
            </template>

          </div>


        </div>
      </search-task-list>
      <searchQueryList ref="searchQueryList"
                       :taskType="bean.taskType=='riskStatistics'?querytTaskType:bean.taskType"
                       @searchQuery="searchQuery"
                       @searchQueryDetail="searchQueryDetail"
                       @createVisitTask="createVisitTask"
                       @createChargeTask="createChargeTask"
                       v-else>
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

            <upload-tag-label :taskType="querytTaskType" @ok="$refs.searchQueryList.loadData()"
                              v-if="bean.taskType=='riskStatistics'&&querytTaskType!='patientRiskGroupStatistics'
                              &&querytTaskType!='doctorRiskGroupStatistics'&&querytTaskType!='tagStatistics'
                              &&querytTaskType!='suspiciousGroupStatistics'&&querytTaskType!='orgHolidayRiskStatistics'
                              &&querytTaskType!='dwb_visit_tag'"></upload-tag-label>
            <a-popconfirm title="确定要创建初始化表吗?" @confirm="createYearSql()">
              <a @click='reloadTable' v-if="bean.taskType=='yearStatistics'&&datasourceAndDatabaseVO.sysDatabase.dbtype=='greenplum'" style="float:right;padding-top:16px">【创建初始化表】</a>
            </a-popconfirm>
          </div>
        </div>
      </searchQueryList>
    </div>
    <!-- </a-card>-->

    <excel-table-list ref="excelTableList" @setExcelTable="setExcelTable" @saveTask="saveTask"></excel-table-list>

    <SelectYbChargeitemChecklist ref="selectRef" :selected="selectData" :param="{examineStatus: '1'}" @setSelectTable="setSelectTable" @saveTask="saveTask" ></SelectYbChargeitemChecklist>
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
import {getAction,httpAction } from '@/api/manage'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import { mapGetters } from 'vuex'
import pick from 'lodash/pick'
import moment from "moment"
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import searchTaskList from './searchTaskList'
import searchQueryList from './searchQueryList'
import searchForm from './plugin/searchForm'
import yearForm from './plugin/yearForm'
import itemByDeptForm from './plugin/itemByDeptForm'
import excelTableList from './plugin/excelTableList'
import riskForm from './plugin/riskForm'
import SelectYbChargeitemChecklist from "./plugin/selectYbChargeitemChecklist"
import SelectYbChargeCaseList from "./plugin/selectYbChargeCaseList"
import SelectYbChargeDrugRuleList from "./plugin/selectYbChargeDrugRuleList.vue"
import OdsCheckorgList from "./plugin/OdsCheckorgListForm.vue"
import drugRuleForm from './plugin/drugRuleForm'
import { taskMixin } from './mixins/taskMixin'
import uploadTagLabel from "./plugin/uploadTagLabel";
import debounce from 'lodash/debounce'

import drugTop200Form from './plugin/drugTop200Form'
import drugTop200DetailForm from './plugin/drugTop200DetailForm'
export default {
  name: "search",
  mixins:[taskMixin],
  components: {
    uploadTagLabel,
    MDictSelectTag,
    searchTaskList,
    searchForm,
    yearForm,
    itemByDeptForm,
    riskForm,
    excelTableList,
    SelectYbChargeitemChecklist,
    searchQueryList,
    SelectYbChargeCaseList,
    drugRuleForm,
    SelectYbChargeDrugRuleList,
    OdsCheckorgList,
    drugTop200Form,
    drugTop200DetailForm,
  },
  data () {
    this.lastFetchId = 0;
    this.fetchOrg = debounce(this.fetchOrg, 800);

    return {
      data: [],

      fetching: false,

      description: '收费明细查询任务页面',
      //表单
      bean:{taskType:'search',visittype:'ZY,MM',dataStaticsLevel:'src',etlSource:'yb',isFundpay:'0',fundValType:'>='},
      model: {},
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        notRequired: { rules: [{ required: false, message: '' }] },
      },
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      fileList:[],
      confirmLoading: false,
      toggleSearchStatus:false,

      url: {
        getOrgList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgList",
        getDeptList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getDeptList",
        getTagList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getTagList",
        saveTaskBatch: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskBatch",
        saveTaskByType: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/saveTaskByType",

        getOrgPageList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgPageList",
        createYearSql: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/createYearSql",
      },
      importUrl: '/ybChargeSearch/ybChargeSearchTask/importExcel',

      selectOrgsArr:[],//机构选中的数据
      selectOrgList:[],//机构下拉选项
      orgs:[],

      deptList:[],//科室列表
      tagList:[],//标签列表
      orgsData:[],
      paramData:[],
      yearShowStart:false,
      yearShowEnd:false,
      importData:[],//excel导入的结果数据
      selectVisible:false,
      selectData:[],//关键词库数据
      visittypeOptions:[{code:'ZY,MM',name:'住院+门诊'},{code:'ZY',name:'住院'},{code:'MM',name:'门诊'},{code:'GY',name:'购药'}],
      isFundpayOptions:[{code:'0',name:'不包含自费就诊数据'},{code:'1',name:'包含自费就诊数据'}],
      showTagSelect:false,//是否显示标签选择
      tagType:'tagStat',
      querytTaskType:'tagStatistics',//直接查询taskType类型
      queryValues:{},

      owntypeList: [],//机构属性列表
      localTagList: [],//机构所在地列表
      hosplevelList: [],//机构等级
      drugTop200Visible:false,
      drugTop200DetailVisible:false,
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    importExcelUrl: function() {
      if(!this.importUrl.startsWith('http')){
        return `${this.$config['domianURL']}/${this.importUrl}`
      }
      return this.importUrl;
    },

  },
  beforeMount() {
    this.loadResultConfigMap()
    this.bean.dataSource = this.userInfo.dataSource
    this.getDatasourceAndDatabase()
    this.resetForm()
    this.getOrgList()
    this.queryOwntypeLocalTagHosplevel()

  },
  watch: {
    'bean.taskType': {
      immediate: true,
      handler(val) {
        let orgs = this.form.getFieldValue('orgs');
        let etlSource = this.form.getFieldValue('etlSource')
        this.setFormValue()//值回填

        if(val=='itemByDeptStatistics'){
          this.getDeptList(orgs);
        }
        if(val=='riskStatistics'){
          this.getTagList(orgs,etlSource,val);
          this.$nextTick(() => {
            this.searchQuery()
          })
        }
        this.changeVisittype(etlSource,val)
        this.changeIsFundpay(val)

        if(val=='visitStatistics'||val=='itemStatistics'||val=='itemByDeptStatistics'||val=='itemByVisitStatistics'){
          this.showTagSelect = true
          this.getTagList(orgs,etlSource,val);
        }else{
          this.showTagSelect = false
        }
      }
    },
    orgs: {
      immediate: true,
      handler(val) {
       this.changeOrgs(val)
      }
    },
  },

  methods: {
    fetchOrg(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.selectOrgList = [];
      this.fetching = true;
      getAction(this.url.getOrgPageList, {orgname:value,pageSize:50}).then((res) => {
        if (res.success) {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = res.result.records.map(item => ({
            text:item.orgname,
            value:item.orgid,
          }));
          this.selectOrgList = data;
          this.fetching = false;
        }else{
          this.$message.warning(res.message);
        }
      })

    },
    handleChangeOrg(value) {
      Object.assign(this, {
        selectOrgsArr:value,
        fetching: false,
      });
      let orgs = this.selectOrgsArr.map(t=>{
       return t.label
      })
      this.orgs = orgs
      this.form.setFieldsValue({orgs})
    },


    selectOrg(){
      this.$refs.odsCheckorgList.show()
    },
    beforeYear(start,end){
      let chargedateStartdate = null
      let chargedateEnddate = null
      chargedateStartdate= this.getRecentMonth(start)
      chargedateEnddate= this.getRecentMonth(end)
      this.form.setFieldsValue({chargedateStartdate:chargedateStartdate.substring(0,4)+'-01-01'})
      this.form.setFieldsValue({chargedateEnddate:chargedateEnddate})

    },
    // 近N月
    getRecentMonth: function(n) {
      let month = moment(new Date()).subtract(n, "months").format("YYYY-MM-DD");
      return month;
    },
    clearQueryData(){
      //this.$refs.searchForm.clearExcelTable()
      if(this.bean.taskType=='search'){
        this.$refs.searchForm.clearExcelTable()
      }else if(this.bean.taskType=='drugRuleStatistics'){
        this.$refs.drugRuleForm.clearExcelTable()
      }else if(this.bean.taskType=='riskStatistics'){
        this.$refs.riskForm.clearExcelTable()
      }else if(this.bean.taskType=='yearStatistics'){
        this.$refs.yearForm.clearExcelTable()
      }
      this.resetForm()
      //清空机构
      this.orgsData=[]
      this.setOrgsField()

    },
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },

    downloadTemplate() {
      window.open(this.$config['domianURL'] + "/sys/common/download/chargeImportTemplate.xlsx");
    },

    //获取机构列表
    getOrgList(){
      this.fetchOrg()
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

    //获取机构属性列表
    getOwntypeList(){
      this.owntypeList = []
      getAction(this.url.getOrgList, {dataSource:this.userInfo.dataSource,taskType:'queryOwntypeList'}).then((res) => {
        if (res.success) {
          this.owntypeList = res.result.filter(item=>item.VALUE != null && item.VALUE !='')
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    //获取机构所在地
    getLocalTagList(){
      this.localTagList = []
      getAction(this.url.getOrgList, {dataSource:this.userInfo.dataSource,taskType:'queryLocalTagList'}).then((res) => {
        if (res.success) {
          this.localTagList = res.result.filter(item=> item.VALUE !=null && item.VALUE !='')
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    setOrgsData(){
      this.orgsData=this.$refs.odsCheckorgList.orgsData
      this.setOrgsField()
    },
    setOrgsField(){
      var orgs = this.orgsData.map(function(obj,index){
        return obj.orgname;
      })
      this.orgs = orgs
      this.form.setFieldsValue({orgs:orgs})
      this.selectOrgsArr =this.orgsData.map(item => ({
        label: item.orgname,
        key: item.orgid,
      }))
    },

    changeOrgs(orgArr){
      this.getDeptList(orgArr);
      this.getTagList(orgArr);
      if(this.bean.taskType=='riskStatistics'){
        this.$nextTick(() => {
          this.searchQuery()
        })
      }

    },

    //获取科室列表
    getDeptList(orgArr){
      this.deptList = []
      if(orgArr&&orgArr.length>0&&this.bean.taskType=='itemByDeptStatistics'){
        let orgs = orgArr.join(',')
        let orgids = this.getOrgids(orgs)
        getAction(this.url.getDeptList, {dataSource:this.userInfo.dataSource,etlSource:this.form.getFieldValue('etlSource'), orgs,orgids,taskType:this.bean.taskType}).then((res) => {
          if (res.success) {
            if(res.result&&res.result.length>0){
              this.deptList = res.result.filter(item =>item.DEPTNAME)
            }
            this.$refs.itemByDeptForm.deptList = this.deptList
          }else{
            this.$message.warning(res.message);
          }
        })
      }
    },

    //根据orgnames获取orgids
    getOrgids(orgs){
      let orgids = this.selectOrgsArr.map(t=>{
        return t.key
      })
      return orgids.join(',')
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
      if(taskType=='riskStatistics'){
        if(this.tagType=='patient'){
          this.querytTaskType='patientRiskGroupStatistics'
        }else if(this.tagType=='doctor'){
          this.querytTaskType='doctorRiskGroupStatistics'
        }else if(this.tagType=='org'){
          this.querytTaskType='suspiciousGroupStatistics'
        }else if(this.tagType=='tagStat'){
          this.querytTaskType='tagStatistics'
          return
        }else{
          this.querytTaskType = taskType
        }
        await getAction(this.url.getTagList, {dataSource:this.userInfo.dataSource,etlSource, orgs,taskType:this.querytTaskType}).then((res) => {
          if (res.success) {
            if(res.result&&res.result.length>0){
              this.tagList = res.result.filter(item =>item.COUNT>0)
            }
            this.$refs.riskForm.tagList = this.tagList
            let tagNameId = this.$refs.riskForm.tagNameId
            if(this.tagList.length==0||this.tagList.filter(item =>item.NAME+'#'+item.TAG_INDEX==tagNameId).length==0){
              this.$refs.riskForm.tagNameId = ''
            }
            this.$refs.riskForm.bean.tagType = this.tagType?this.tagType:'org'
          }else{
            this.$message.warning(res.message);
          }
        })
      }else if(this.showTagSelect){//显示标签选择
        await getAction(this.url.getTagList, {dataSource:this.userInfo.dataSource,etlSource, orgs,taskType}).then((res) => {
          if (res.success) {
            if(res.result&&res.result.length>0){
              this.tagList = res.result.filter(item =>item.COUNT>0)
            }

           /* let tagId = this.form.getFieldValue('tagId')
            if(tagId&&this.tagList.length>0&&this.tagList.filter(item =>item.TAG_INDEX==tagId).length>0){
              this.form.setFieldsValue({tagId:tagId})
            }else{
              this.form.setFieldsValue({tagId:undefined})
            }*/
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
      }
    },

   /* selectTag(val){
      let selectArr = this.tagList.filter(item=>item.TAG_INDEX == val);
      if(selectArr.length>0){
        this.bean.tagName = selectArr[0].NAME
      }else{
        this.bean.tagName = '';
      }
    },*/

    resetForm(){
      this.form.resetFields();
      this.model = Object.assign({}, this.bean);
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'orgs','visittype','dataStaticsLevel','etlSource','isFundpay','fundValType'))
      });
    },

    setFormValue(){
      let clientname = this.form.getFieldValue('clientname')
      let visitid = this.form.getFieldValue('visitid')
      let etlSource = this.form.getFieldValue('etlSource')
      let chargedateStartdate = this.form.getFieldValue('chargedateStartdate')
      let chargedateEnddate = this.form.getFieldValue('chargedateEnddate')
      this.model = Object.assign(this.model,{clientname,visitid,etlSource,chargedateStartdate,chargedateEnddate});
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'clientname','visitid','etlSource','chargedateStartdate','chargedateEnddate'))
      });
      setTimeout(() => {
        this.form.setFieldsValue(pick(this.model,'visitid','etlSource','clientname','chargedateStartdate','chargedateEnddate'))
      }, 500)
    },

    handleOk (isSearchDrug='0') {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err||this.bean.taskType=='riskStatistics') {
          this.confirmLoading = true
          let formData = Object.assign(this.model, values);
          if(isSearchDrug=='1'){
            formData.isSearchDrug = isSearchDrug
          }else{
            formData.isSearchDrug = null
          }
          formData.taskType = this.bean.taskType
          formData.orgs = formData.orgs&&formData.orgs.length>0?formData.orgs.join(','):null
          if(formData.chargedateStartdate){
            if(typeof formData.chargedateStartdate=='object'){
              formData.chargedateStartdate = formData.chargedateStartdate.format("YYYY-MM-DD")
            }else if(formData.chargedateStartdate.length==4){
              formData.chargedateStartdate = formData.chargedateStartdate+'-01-01'
            }
          }
          if(formData.chargedateEnddate){
            if(typeof formData.chargedateEnddate=='object'){
              formData.chargedateEnddate = formData.chargedateEnddate.format("YYYY-MM-DD")
            }else if(formData.chargedateEnddate.length==4){
              formData.chargedateEnddate = formData.chargedateEnddate+'-01-01'
            }
          }
          let orgs = formData.orgs;
          console.log("orgs===",orgs)
          console.log("formData===",formData)
          if(orgs){
            let orgids = this.getOrgids(orgs)
            formData.orgids = orgids
          }else{
            formData.orgids=""
          }
          /*if(formData.tagId&&this.bean.tagName){
            formData.tagName = this.bean.tagName
          }else{
            formData.tagName = null
          }*/
          if(formData.taskType=='search'||formData.taskType=='drugRuleStatistics'){
            this.saveTaskBatch(formData,'')
          }else{
            this.saveTaskByType(formData)
          }
        }
      })
    },

    //search保存
    saveTaskBatch(formData,type){

      let msg = '';
      let excelTableData=[]
      if(formData.taskType=='search'){

        if(type=='excel'){
          excelTableData = this.importData
        }else if(type=='select'){
          excelTableData = this.$refs.selectRef.selectData
        }else{
          excelTableData = this.$refs.searchForm.excelTableData
        }
        delete formData.itemname
        excelTableData.forEach(function(vo,index){
          Object.assign(vo, formData);
          if(!vo.itemname&&!vo.orgs){
            if(!vo.clientname&&!vo.visitid&&!vo.leavedate&&!vo.idNo&&!vo.caseId&&!vo.doctorname&&!vo.doctorid){
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
          this.confirmLoading = false;
          return false
        }
      }else if(formData.taskType=='drugRuleStatistics'){
        if(type=='select'){
          excelTableData = this.$refs.selectDrugRuleRef.selectData
        }else{
          excelTableData = this.$refs.drugRuleForm.excelTableData
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
          this.confirmLoading = false;
          return false
        }
      }
      let param = {jsonStr:JSON.stringify(excelTableData),taskType:formData.taskType};

      httpAction(this.url.saveTaskBatch,param,'post').then((res)=>{
        if(res.success){
          if(type=='excel'){
            this.$refs.excelTableList.close()
          }else if(type=='select'){
            this.$refs.selectRef.close()
          }
          if((this.bean.taskType!='riskStatistics')&&this.bean.taskType!='yearStatistics'){
            this.$success({
              title: '操作成功',
              content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
            });
            if(formData.taskType=='search'){
              this.$refs.searchForm.clearExcelTable()
            }else if(formData.taskType=='drugRuleStatistics'){
              this.$refs.drugRuleForm.clearExcelTable()
            }
            this.reloadTaskTable(1)
          }else{
            let that = this
            this.$confirm({
              title: '打开下载任务记录界面?',
              content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
              onOk() {
                that.$util.openTab('/ybChargeSearch/searchTaskList')
              }
            })
          }
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },
    //其他taskType保存
    saveTaskByType(formData){
      if(formData.taskType=='yearStatistics'){
        Object.assign(formData, this.$refs.yearForm.bean);
        if(this.bean.taskType=='yearStatistics'){
          formData.taskType = this.$refs.yearForm.fnType
        }
        if(this.$refs.yearForm.fnType=='yearOrgOnlinePatientCount'&&this.selectOrgsArr.length!=1){
          this.$message.warning('请选择一家医院进行查询分析');
          return false
        }
      }else if(formData.taskType=='itemByVisitStatistics'){
        if(!formData.tagName&&!formData.clientname&&!formData.visitid&&!formData.leavedate&&!formData.idNo){
          this.$message.warning('标签名称、患者姓名、就诊号、出院日期、患者身份证号不能同时为空!');
          this.confirmLoading = false;
          return false
        }
      }else if(formData.taskType=='itemByDeptStatistics'){
        let orgs = formData.orgs
        if(orgs==null){
          this.$message.warning('请选择且只能选择一家医院进行科室汇总查询!');
          this.confirmLoading = false;
          return false
        }
        let orgList=orgs.split(',');
        if(!orgList||orgList.length!=1){
          this.$message.warning('请选择且只能选择一家医院进行科室汇总查询!');
          this.confirmLoading = false;
          return false
        }
        Object.assign(formData, this.$refs.itemByDeptForm.bean)
        formData.deptname = formData.deptname&&formData.deptname.length>0?formData.deptname.join(','):null
      }else if(formData.taskType=='riskStatistics'){
        formData = Object.assign({orgs:formData.orgs,etlSource:formData.etlSource,
          dataSource:formData.dataSource,chargedateStartdate:formData.chargedateStartdate,chargedateEnddate:formData.chargedateEnddate}, this.$refs.riskForm.bean)
        if(!formData.tagId&&formData.taskType=='riskStatistics'){
          this.$message.warning('请选择标签名称进行数据挖掘分析查询!');
          this.confirmLoading = false;
          return false
        }
      }
      if(formData.orderby){
        formData.orderby = formData.orderby + " "+ formData.orderbyType
      }

      formData.jsonStr=JSON.stringify(formData)
      httpAction(this.url.saveTaskByType,formData,'post').then((res)=>{
        if(res.success){
          if((this.bean.taskType!='riskStatistics')&&this.bean.taskType!='yearStatistics'){
            this.$success({
              title: '操作成功',
              content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
            });
            this.reloadTaskTable(1)
          }else{
            let that = this
            this.$confirm({
              title: '打开下载任务记录界面?',
              content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
              onOk() {
                that.$util.openTab('/ybChargeSearch/searchTaskList')
              }
            })
          }
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },

    beforeUpload() {
      let flag = false;
      this.form.validateFields((err, values) => {
        this.queryValues=values
        if (!err) {
          flag = true;
        }else{
          let formData = Object.assign(this.model, values);
          if(!formData.chargedateStartdate||!formData.chargedateEnddate){
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

    //刷新任务列表
    reloadTaskTable(n){
      this.$refs.searchTaskList.reloadTable(n)
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
    },

    //excel导入项目条件
    setExcelTable(){
      this.$refs.searchForm.excelTableData =[]
      this.importData.map(item=>{
        item.toggleStatus = true
        this.$refs.searchForm.excelTableData.push(item)
      })
      this.$refs.excelTableList.close()
    },

    saveTask(type){
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let formData = Object.assign(this.model, values);
          formData.taskType = this.bean.taskType
          formData.orgs = formData.orgs&&formData.orgs.length>0?formData.orgs.join(','):null
          if(formData.chargedateStartdate){
            if(typeof formData.chargedateStartdate=='object'){
              formData.chargedateStartdate = formData.chargedateStartdate.format("YYYY-MM-DD")
            }else if(formData.chargedateStartdate.length==4){
              formData.chargedateStartdate = formData.chargedateStartdate+'-01-01'
            }
          }
          if(formData.chargedateEnddate){
            if(typeof formData.chargedateEnddate=='object'){
              formData.chargedateEnddate = formData.chargedateEnddate.format("YYYY-MM-DD")
            }else if(formData.chargedateEnddate.length==4){
              formData.chargedateEnddate = formData.chargedateEnddate+'-01-01'
            }
          }
          let orgs = formData.orgs;
          if(orgs){
            let orgids = this.getOrgids(orgs)
            formData.orgids = orgids
          }else{
            formData.orgids=""
          }
          this.saveTaskBatch(formData,type)
        }
      })
    },

    //关键词选择导入项目条件
    setSelectTable(){
      if(this.bean.taskType=='search'){
        this.$refs.searchForm.excelTableData =[]
        this.$refs.selectRef.selectData.map(item=>{
          item.toggleStatus = true
          this.$refs.searchForm.excelTableData.push(item)
        })
        this.$refs.selectRef.close()
      }else if(this.bean.taskType=='drugRuleStatistics'){
        this.$refs.drugRuleForm.excelTableData =[]
        this.$refs.selectDrugRuleRef.selectData.map(item=>{
          item.toggleStatus = true
          this.$refs.drugRuleForm.excelTableData.push(item)
        })
        this.$refs.selectDrugRuleRef.close()
      }

    },

    //选择窗口
    openSelect(){
      if(this.beforeUpload()){
        this.selectData=[]
        if(this.bean.taskType=='search'){
          this.$refs.selectRef.show(this.queryValues)
        }else if(this.bean.taskType=='drugRuleStatistics'){
          this.$refs.selectDrugRuleRef.show(this.queryValues)
        }

      }
    },

    openSelectCase(type){
      this.paramData=this.$refs.searchForm.excelTableData
      if(type=='drug'){
        this.paramData = this.$refs.drugRuleForm.excelTableData
      }
      this.$nextTick(() => {
        this.$refs.selectCaseRef.show(type)
      });
    },

    //改变就诊类型选项
    changeEtlSource(etlSource){
      this.changeVisittype(etlSource)
      this.getTagList(null,etlSource);

    },
    //his的医保收费清单汇总(按科室)医保收费清单汇总(按就诊) 没有(住院+门诊)
    changeVisittype(etlSource,taskType){
      if(!taskType){
        taskType = this.bean.taskType
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

    //改变是否自费就诊
    changeIsFundpay(taskType){
      if(!taskType){
        taskType = this.bean.taskType
      }
      if(taskType=='yearStatistics'){
        this.isFundpayOptions=[{code:'0',name:'不包含自费就诊数据'},{code:'1',name:'包含自费就诊数据'}]
      }else{
        this.isFundpayOptions=[{code:'0',name:'不包含自费就诊数据'}]
        this.form.setFieldsValue({isFundpay:'0'})
      }
    },

    //数据挖掘选择标签类型  医院标签/患者标签
    async changeTagType(tagType){
      this.tagType = tagType
      this.getTagList()
      this.$nextTick(() => {
        this.searchQuery()
      })
    },

    //年度统计
    changeYearFnType(fnType){
      this.$nextTick(() => {
        this.searchQuery()
      })
    },

    //年度统计 过滤字段
    changeColumnYear(taskType,dataStaticsLevel){
      if(taskType=='yearStatistics'&&'src'==dataStaticsLevel){
        this.$refs.searchQueryList.columns = this.$refs.searchQueryList.columns.filter(t=>t.dataIndex!=='orgnameSrc')
      }
    },


    selectOrgRiskTag(taskType,parentTagType){
      this.querytTaskType = taskType
      if(parentTagType){
        this.tagType = ''
      }else{
        this.tagType = 'org'
      }
      this.$nextTick(() => {
        this.searchQuery()
      })
    },

    //直接查询结果进行展示
    searchQuery(){

      this.form.validateFields((err, values) => {
        if(this.bean.taskType=='yearStatistics'){
          this.$refs.searchQueryList.changeColums(this.$refs.yearForm.fnType)
          this.changeColumnYear(this.$refs.yearForm.fnType,values.dataStaticsLevel)
        }else{
          this.$refs.searchQueryList.changeColums()
        }
        if (!err||this.bean.taskType=='riskStatistics') {
          let formData = Object.assign(this.model, values);
          formData.taskType = this.bean.taskType
          formData.orgs = formData.orgs && formData.orgs.length > 0 ? formData.orgs.join(',') : null
          if(orgs){
            let orgids = this.getOrgids(orgs)
            formData.orgids = orgids
          }else{
            formData.orgids=""
          }
          if (formData.chargedateStartdate) {
            if (typeof formData.chargedateStartdate == 'object') {
              formData.chargedateStartdate = formData.chargedateStartdate.format("YYYY-MM-DD")
            } else if (formData.chargedateStartdate.length == 4) {
              formData.chargedateStartdate = formData.chargedateStartdate + '-01-01'
            }
          }
          if (formData.chargedateEnddate) {
            if (typeof formData.chargedateEnddate == 'object') {
              formData.chargedateEnddate = formData.chargedateEnddate.format("YYYY-MM-DD")
            } else if (formData.chargedateEnddate.length == 4) {
              formData.chargedateEnddate = formData.chargedateEnddate + '-01-01'
            }
          }

          if(this.bean.taskType=='yearStatistics'){
            formData.taskType = this.$refs.yearForm.fnType
            this.$refs.searchQueryList.changeColums(formData.taskType)
            this.changeColumnYear(formData.taskType,formData.dataStaticsLevel)
            if(this.$refs.yearForm.fnType=='yearOrgOnlinePatientCount'&&this.selectOrgsArr.length!=1){
              this.$message.warning('请选择一家医院进行查询分析');
              return
            }
          }else if(this.bean.taskType=='riskStatistics'){
            this.$refs.searchQueryList.changeColums(this.$refs.riskForm.bean.taskType)
          }else{
            this.$refs.searchQueryList.changeColums()
          }

          //查询的参数
          if(this.bean.taskType=='riskStatistics'){
            this.$refs.searchQueryList.queryParam = Object.assign({
                orgs: formData.orgs,orgids:formData.orgids, etlSource: formData.etlSource, dataSource: formData.dataSource,
                chargedateStartdate: formData.chargedateStartdate, chargedateEnddate: formData.chargedateEnddate
              },
              this.$refs.riskForm.bean);
          }else if(this.bean.taskType=='yearStatistics'){
            this.$refs.searchQueryList.queryParam =Object.assign(formData, this.$refs.yearForm.bean);
          }
          if(this.$refs.searchQueryList.queryParam.orderby){
            this.$refs.searchQueryList.queryParam.orderby = this.$refs.searchQueryList.queryParam.orderby + " "+ this.$refs.searchQueryList.queryParam.orderbyType
          }

          this.$refs.searchQueryList.loadData(1);
          this.$refs.searchQueryList.showDetail = false
        }
      })
    },

    //查询明细
    searchQueryDetail(queryParam){
      //查询的参数
      this.$refs.searchQueryList.queryParam = Object.assign({orgs:this.model.orgs,etlSource:this.model.etlSource,dataSource:this.model.dataSource,
          chargedateStartdate:this.model.chargedateStartdate,chargedateEnddate:this.model.chargedateEnddate},
        queryParam);
      this.$refs.searchQueryList.loadData(1);
      this.$refs.searchQueryList.showDetail = true
    },

    //创建全年就诊清单任务
    createVisitTask(queryParam){
      this.form.validateFields((err, values) => {
        let formData = Object.assign({},this.model, values,queryParam);
        this.saveTaskByType(formData)
      })
    },

    //创建全年收费清单任务
    createChargeTask(queryParam){
      this.form.validateFields((err, values) => {
        let formData = Object.assign({},this.model, values,queryParam);
        this.saveTaskBatch(formData,'')
      })
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
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    div {
      padding: 0 5px;
    }
  }
  .list-item {
    border-bottom: 1px solid #e8e8e8;
    padding: 5px 0;
  }
  .fieldset {
    margin: 0 15px;
    padding: .35em .625em .75em;
    border-width: 2px;
    border-style: solid;
    border-color: silver silver silver rgb(95, 94, 94);
  }
  .success_btn{
    color: #fff;
    background-color: #009688;
    border-color: #009688;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
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

  .result_title{
    background-color: white;
    width: 100%;
    padding-left: 25px;
    padding-bottom: 12px;
    padding-top: 12px;
  }
  /deep/ .ant-card-body{
    padding-bottom: 0px;
    padding-top: 14px;
    padding-right: 24px;
    padding-left: 24px;
  }
</style>
