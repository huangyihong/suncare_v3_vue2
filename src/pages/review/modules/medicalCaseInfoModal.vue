<template>
  <a-layout >
    <a-layout-sider style="background-color: white">
      <a-anchor class="m-t-20" :affix="false" showInkInFixed :getContainer="modalBody" @click="handleClick">
        <!--<a-anchor-link :href="'#actionInfo'+anchorSuffix" title="医保风控信息" v-if="medicalUnreasonableActionVo"/>-->
        <a-anchor-link :href="'#caseInfo'+anchorSuffix" title="就诊信息"/>
        <!-- <a-anchor-link :href="'#recipe" title="处方信息" />-->
        <a-anchor-link :href="'#diag'+anchorSuffix" title="诊断信息"/>
        <a-anchor-link :href="'#cost'+anchorSuffix" title="费用信息"/>
        <a-anchor-link :href="'#docAdvice'+anchorSuffix" title="医嘱明细"/>
        <a-anchor-link :href="'#patient'+anchorSuffix" :title="`病人详情${dwbClientShow?'':'(空)'}`"/>
        <a-anchor-link :href="'#medical'+anchorSuffix" :title="`医院/科室详情${dwbOrganizationShow?'':'(空)'}`"/>
        <a-anchor-link :href="'#doctor'+anchorSuffix" :title="`医生详情${dwbDoctorShow?'':'(空)'}`"/>
        <a-anchor-link :href="'#moreInfo'+anchorSuffix" title="更多信息"/>
      </a-anchor>
    </a-layout-sider>
    <a-layout-content :id="'content'+anchorSuffix" style="background: #f0f2f5;overflow: auto" :style="{height:height}">
      <!--<div :id="'actionInfo'+anchorSuffix" class="content-item" v-if="medicalUnreasonableActionVo">
        <a-card hoverable title="医保风控信息" :loading="actionLoading">
          <detail-list>
            <detail-list-item term="风控月份">{{medicalUnreasonableActionVo.month}}</detail-list-item>
            <detail-list-item term="疑似程度">
              <span v-if="medicalUnreasonableActionVo.firReviewStatus==='init'">待处理</span>
              <span style="color: #09b909;" v-if="medicalUnreasonableActionVo.firReviewStatus==='white'">白名单</span>
              <span style="color: red;" v-if="medicalUnreasonableActionVo.firReviewStatus==='blank'">黑名单</span>
              <span style="color: #b9adad;" v-if="medicalUnreasonableActionVo.firReviewStatus==='grey'">灰名单</span>
            </detail-list-item>
          </detail-list>
          <detail-list>
            <a-row class="title" style="font-size: 14px">
              <a-col :span="12">不合规行为名称</a-col>
              <a-col :span="12">不合规行为类型</a-col>
            </a-row>
            <a-row style="padding: 0 10px">
              <a-empty v-if="!behaviors"></a-empty>
              <template v-else v-for="item in behaviors">
                <a-col :span="12">{{item.actionName}}</a-col>
                <a-col :span="12">{{filterDictText(actionType_dict,item.actionType)}}</a-col>
              </template>
            </a-row>
          </detail-list>
        </a-card>
      </div>-->
      <div :id="'caseInfo'+anchorSuffix" class="content-item">
        <a-card hoverable title="就诊信息" :loading="dwbMasterInfoLoading">
          <detail-list>
            <detail-list-item term="姓名">{{dwbMasterInfoVo.clientname}}</detail-list-item>
            <detail-list-item term="性别">{{dwbMasterInfoVo.sex}}</detail-list-item>
            <detail-list-item term="年龄">{{dwbMasterInfoVo.yearage}}</detail-list-item>
            <detail-list-item term="就诊日期">{{dwbMasterInfoVo.visitdate}}</detail-list-item>
            <detail-list-item term="就诊类型">{{dwbMasterInfoVo.visittype}}</detail-list-item>
            <detail-list-item term="就诊机构">{{dwbMasterInfoVo.orgname}}</detail-list-item>
            <detail-list-item term="就诊ID">{{visitidVal}}</detail-list-item>
            <!--<detail-list-item term="就诊科室">{{dwbMasterInfoVo.deptname}}</detail-list-item>-->
            <detail-list-item term="医疗付费方式名称">{{dwbMasterInfoVo.payway}}</detail-list-item>
            <!--<detail-list-item term="投保类型">{{dwbMasterInfoVo.insurancetype}}</detail-list-item>-->
            <detail-list-item term="就诊总金额">{{dwbMasterInfoVo.totalfee}}</detail-list-item>
            <detail-list-item term="医保基金支付金额">{{dwbMasterInfoVo.fundpay}}</detail-list-item>
            <detail-list-item term="本次医保/农合可补费用">{{dwbMasterInfoVo.fundCover}}</detail-list-item>
            <detail-list-item term="乙类自付费用">{{dwbMasterInfoVo.selfpay2}}</detail-list-item>
            <detail-list-item term="丙类自付费用">{{dwbMasterInfoVo.selfpay3}}</detail-list-item>
            <detail-list-item term="其中药品总费用">{{dwbMasterInfoVo.drugfee}}</detail-list-item>
            <detail-list-item term="住院天数">{{dwbMasterInfoVo.zyDaysCalculate}}</detail-list-item>


            <!--<detail-list>
              <detail-list-item term="住院日期">{{dwbMasterInfoVo.visitdate}}</detail-list-item>
              <detail-list-item term="就诊医生">{{dwbMasterInfoVo.doctorname}}</detail-list-item>
              <detail-list-item term="就诊机构">{{dwbMasterInfoVo.orgname}}</detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="就诊科室">{{dwbMasterInfoVo.deptname}}</detail-list-item>
              <detail-list-item term="投保类型">{{dwbMasterInfoVo.insurancetype}}</detail-list-item>
              <detail-list-item term="住院总金额">{{dwbMasterInfoVo.totalfee}}</detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="出院日期">{{dwbMasterInfoVo.leavedate}}</detail-list-item>
              <detail-list-item term="住院天数">{{dwbMasterInfoVo.zyDays}}</detail-list-item>
            </detail-list>-->


          </detail-list>
         <!-- <detail-list :col=1>
            <detail-list-item term="就诊流水号">{{dwbMasterInfoVo.visitid}}</detail-list-item>
          </detail-list>-->

        </a-card>
      </div>
      <div :id="'diag'+anchorSuffix" class="content-item">
      <a-card hoverable title="诊断信息">
        <dwb-diag-list :visitid="visitidVal" class="card-padding0"></dwb-diag-list>
      </a-card>
    </div>
      <!--<div :id="'recipe" >-->
      <!--<a-card style="margin: 10px" hoverable title="处方信息">-->
      <!--<medical-col-config-list></medical-col-config-list>-->
      <!--</a-card>-->
      <!--</div>-->
      <div :id="'cost'+anchorSuffix" class="content-item">
        <a-card hoverable title="费用信息">
          <detail-list>
            <detail-list-item term="总金额">{{dwbMasterInfoVo.totalfee}}元</detail-list-item>
            <detail-list-item term="现金支付">{{dwbMasterInfoVo.selfpay}}元</detail-list-item>
            <detail-list-item term="医保支付">{{dwbMasterInfoVo.indivAcctPay}}元</detail-list-item>
            <detail-list-item term="统筹支付">{{dwbMasterInfoVo.poolAcctPay}}元</detail-list-item>
            <detail-list-item term="药品费">{{dwbMasterInfoVo.drugfee}}元</detail-list-item>
          </detail-list>
          <!--<a-divider class="m-b-8"></a-divider>
          <detail-list>
            <detail-list-item term="医保费用支付方式">{{dwbMasterInfoVo.payway}}元</detail-list-item>
            <detail-list-item term="起付线金额">{{dwbSettlement.UNDER_INITIAL_LINE_FEE}}元</detail-list-item>
            <detail-list-item term="报销比例">{{dwbSettlement.FUND_PROP}}元</detail-list-item>
            <detail-list-item term="个人账户支付">{{dwbSettlement.INDIV_ACCT_PAY}}元</detail-list-item>
            <detail-list-item term="统筹金">{{dwbSettlement.FUNDPAY}}元</detail-list-item>
          </detail-list>-->
          <a-divider class="m-b-8"></a-divider>
          <dwb-charge-detail-list :visitid="visitidVal" class="card-padding0"></dwb-charge-detail-list>
          <template v-if="batchId">
            <a-divider class="m-b-8">违规项目</a-divider>
            <dwb-charge-detail-rela-item-list :visitid="visitidVal" :batchId="batchId" class="card-padding0"></dwb-charge-detail-rela-item-list>
          </template>
        </a-card>
      </div>
      <div :id="'docAdvice'+anchorSuffix" class="content-item">
        <a-card hoverable title="医嘱明细" :loading="dwbMasterInfoLoading">
          <detail-list>
            <detail-list-item term="就诊医疗机构">{{dwbMasterInfoVo.orgname}}</detail-list-item>
            <detail-list-item term="就诊科室名称">{{dwbMasterInfoVo.deptname}}</detail-list-item>
            <detail-list-item term="就诊类型">{{dwbMasterInfoVo.visittype}}</detail-list-item>
            <!--<detail-list-item term="处方号">{{dwbMasterInfoVo.prescriptno}}</detail-list-item>-->
            <detail-list-item term="医嘱医生姓名">{{dwbMasterInfoVo.doctorname}}</detail-list-item>
          </detail-list>
          <dwb-order :visitid="visitidVal"></dwb-order>
        </a-card>
      </div>
      <div :id="'patient'+anchorSuffix" class="content-item">
        <a-card hoverable title="病人详情" :loading="dwbClientLoading">
          <empty-content :show="dwbClientShow">

            <detail-list>
              <detail-list-item term="姓名">{{dwbClientVo.clientname}}</detail-list-item>
              <detail-list-item term="性别">{{dwbClientVo.sex}}</detail-list-item>
              <detail-list-item term="出生日期">{{dwbClientVo.birthday}}</detail-list-item>
              <detail-list-item term="证件号码">{{dwbClientVo.idNo}}</detail-list-item>
              <detail-list-item term="投保类型">{{dwbClientVo.insurancetype}}</detail-list-item>
              <detail-list-item term="民族">{{dwbClientVo.nation}}</detail-list-item>
              <detail-list-item term="单位名称">{{dwbClientVo.workplacename}}</detail-list-item>
              <detail-list-item term="联系电话">{{dwbClientVo.contactorphone}}</detail-list-item>
              <detail-list-item term="联系地址">
                {{dwbClientVo.addrprovince}}{{dwbClientVo.addrcity}}{{dwbClientVo.addrcounty}}
              </detail-list-item>
            </detail-list>
          </empty-content>
        </a-card>
      </div>
      <div :id="'medical'+anchorSuffix" class="content-item">
        <a-card hoverable title="医院/科室详情" :loading="dwbOrganizationLoading">
          <empty-content :show="dwbOrganizationShow">
            <detail-list>
              <detail-list-item term="医院名称">{{dwbOrganizationVo.orgname}}</detail-list-item>
              <detail-list-item term="医院级别">{{dwbOrganizationVo.hosplevelName}}</detail-list-item>
              <detail-list-item term="医院等级">{{dwbOrganizationVo.hospgradeName}}</detail-list-item>
              <detail-list-item term="科室名称">{{dwbMasterInfoVo.deptname}}</detail-list-item>
              <detail-list-item term="医院地址">{{dwbOrganizationVo.orgaddress}}</detail-list-item>
              <detail-list-item term="联系电话">{{dwbOrganizationVo.orgphone}}</detail-list-item>
            </detail-list>
          </empty-content>
        </a-card>
      </div>
      <div :id="'doctor'+anchorSuffix" class="content-item">
        <a-card hoverable title="医生详情" :loading="dwbDoctorLoading">
          <empty-content :show="dwbDoctorShow">
            <detail-list>
              <detail-list-item term="医生姓名">{{dwbDoctorVo.doctorname}}</detail-list-item>
              <detail-list-item term="医生性别">{{dwbDoctorVo.sex}}</detail-list-item>
              <detail-list-item term="职称">{{dwbDoctorVo.technicaltitle}}</detail-list-item>
              <detail-list-item term="证件号码">{{dwbDoctorVo.idNo}}</detail-list-item>
              <detail-list-item term="职业证书号">{{dwbDoctorVo.practicecertifyNo}}</detail-list-item>
              <detail-list-item term="联系电话">{{dwbDoctorVo.phone}}</detail-list-item>
            </detail-list>
          </empty-content>

        </a-card>
      </div>
      <div :id="'moreInfo'+anchorSuffix" class="content-item">
        <a-card hoverable title="更多信息" :loading="dwbMasterInfoColsLoading">
          <div slot="extra">
            <a-affix :target="modalBody">
              <a-input placeholder="字段中文名" v-model.trim="colChnName" style="width: 200px">
                <a-icon slot="prefix" type="search"/>
              </a-input>
            </a-affix>
          </div>
          <detail-list>
            <template v-for="col in dwbMasterInfoColsShow">
              <detail-list-item :term="col.colChnName">
                <!--{{col.colName}}-->
                <div class="t-red">{{dwbMasterInfoVo[col.colName] || ' '}}</div>
              </detail-list-item>
            </template>
          </detail-list>

        </a-card>
      </div>

    </a-layout-content>
  </a-layout>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { querySysDictByType, querySysDictByTypes, queryEntityColByTable } from '@/api-sv3/api'
  import DetailList from '@/components/tools/DetailList'
  import DwbChargeDetailList from "./dwbChargeDetailList"
  import dwbChargeDetailRelaItemList from "@/pages/review/modules/dwbChargeDetailRelaItemList"
  import DwbDiagList from "./dwbDiagList"
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'
  const dwbOrder = () => import( '@/pages/review/modules/dwbOrder')

  const DetailListItem = DetailList.Item


  export default {
    name: "MedicalCaseInfoModal",
    components: {
      DetailList,
      DetailListItem,
      DwbChargeDetailList,
      dwbChargeDetailRelaItemList,
      DwbDiagList,
      dwbOrder,
      emptyContent: {
        props: ["show"],
        render() {
          return this.show?this.$slots.default:(<a-empty/>)
        }
      }
    },
    props: ['medicalUnreasonableActionVo', 'visitid','height', 'batchId'],
    data() {
      return {
        filterDictText,
        title: "操作",
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        url: {
          queryDwbMasterInfoByVisitid: this.$suncare_v3 +this.$gp_database+ "/review/queryDwbMasterInfoByVisitid",
          queryDwbClientByClientid: this.$suncare_v3 +this.$gp_database+ "/review/queryDwbClientByClientid",
          queryDwbOrganizationByOrgid: this.$suncare_v3 +this.$gp_database+ "/review/queryDwbOrganizationByOrgid",
          queryDwbDoctorByDoctorid: this.$suncare_v3 +this.$gp_database+ "/review/queryDwbDoctorByDoctorid",
          queryDwbSettlementByVisitid: this.$suncare_v3 +this.$gp_database+ "/review/queryDwbSettlementByVisitid",
          queryByBatchCase: this.$suncare_v3 + "/formal/medicalFormalBehavior/queryByBatchCase",
        },
        actionType_dict: [],//医疗字典数据
        medicalUnreasonableActionVo: {},//医保风控信息
        dwbMasterInfoVo: {},//就诊信息
        dwbClientVo: {},//病人信息
        dwbOrganizationVo: {},//医院信息
        dwbDoctorVo: {},//医生信息
        dwbMasterInfoCols: [],// 主表字段
        dwbMasterInfoColsShow: [],// 过滤后的主表字段
        behaviors: null,//不合规行为
        actionLoading: false,
        dwbMasterInfoLoading: false,
        dwbClientLoading: false,
        dwbOrganizationLoading: false,
        dwbDoctorLoading: false,
        dwbMasterInfoColsLoading: false,
        // 模糊搜索字段名称
        colChnName: '',
        dwbDoctorShow: true,
        dwbOrganizationShow: true,
        dwbClientShow: true,
        anchorSuffix: -1,
        visitidVal: ''
      }
    },
    beforeMount() {
      this.initMedicalDict();
      this.loadDwbMasterCols()
      let contentDiv
      do  {
        this.anchorSuffix++;
        contentDiv = document.getElementById('content' + this.anchorSuffix)
      } while (contentDiv)
      console.log(this.anchorSuffix,contentDiv)
    },
    watch: {
      // 现在只有不合规审核流程用到这个
      medicalUnreasonableActionVo: {
        immediate: true,
        handler(val) {
          if (val) {
            // this.loadBreakBehaviorRelation(this.medicalUnreasonableActionVo.batchId,this.medicalUnreasonableActionVo.reviewCaseIds)
            //就诊信息
            this.loadDwbMasterInfo(this.medicalUnreasonableActionVo.visitid);
            //病人信息
            this.loadDwbClient(this.medicalUnreasonableActionVo.clientid);
            //医院信息
            this.loadDwbOrganization(this.medicalUnreasonableActionVo.orgid);
            //医生信息
            this.loadDwbDoctor(this.medicalUnreasonableActionVo.doctorid);
            // 更多信息
          }
        },
      },
      visitid: {
        immediate: true,
        handler(id) {
          console.log('visitid', id)
          if (id && !this.medicalUnreasonableActionVo) {
            this.loadDwbMasterInfo(id, (record) => {
              if (!record)
                return
              //病人信息
              this.loadDwbClient(record.clientid);
              //医院信息
              this.loadDwbOrganization(record.orgid);
              //医生信息
              this.loadDwbDoctor(record.doctorid);
            })
          }
        },
      },
      colChnName(val, oldVal) {
        console.log(val, oldVal)
        if (oldVal.length > 0 && val.includes(oldVal)) {
          this.dwbMasterInfoColsShow = this.dwbMasterInfoColsShow.filter(item => item.colChnName && item.colChnName.includes(val))
        } else if (val.length > 0) {
          this.dwbMasterInfoColsShow = this.dwbMasterInfoCols.filter(item => item.colChnName && item.colChnName.includes(val))
        } else {
          this.dwbMasterInfoColsShow = [...this.dwbMasterInfoCols]
        }
      }
    },
    methods: {
      modalBody() {
        //return document.getElementsByClassName('ant-modal-body')[0];
        return document.getElementById('content' + this.anchorSuffix);
      },
      //初始医疗字典数据
      initMedicalDict() {
        this.$util.initDict('ACTION_JKLX').then(data => {
          this.actionType_dict = data
        })
      },
      handleClick(e, link) {
        e.preventDefault();
        console.log(link);
      },
      // 不合规行为关联信息
      loadBreakBehaviorRelation(batchId, caseId) {
        this.actionLoading = true;
        console.log('caseId',caseId)
        if(Array.isArray(caseId)){
          caseId = caseId.join(",")
        }
        let param = { batchId, caseId };
        this.behaviors = []
        getAction(this.url.queryByBatchCase, param).then((res) => {
          if (res.success) {
            this.behaviors = res.result;
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.actionLoading = false;
        })
      },
      //就诊信息
      loadDwbMasterInfo(visitid, callback) {
        if (this.isBlank(visitid)) {
          this.dwbMasterInfoLoading = false
          return
        }
        this.visitidVal = visitid
        const that = this;
        this.dwbMasterInfoLoading = true;
        let param = { visitid: visitid };
        getAction(this.url.queryDwbMasterInfoByVisitid, param).then((res) => {
          if (res.success) {
            let record = res.result
            for (let field in record) {
              let val = record[field]
              if (Number.isFinite(val) && !(val % 1 === 0)) {
                record[field] = val.toFixed(2)
              }
            }
            this.dwbMasterInfoVo = record || {}
            if (callback) {
              callback(record)
            }
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbMasterInfoLoading = false;
        })
      },
      //病人信息
      loadDwbClient(clientid) {
        if (this.isBlank(clientid)) {
          this.dwbClientShow = false
          return
        }
        const that = this;
        this.dwbClientShow = true;
        this.dwbClientLoading = true;
        let param = { clientid: clientid };
        // let param = {clientid:'FN2009121019004806'};
        getAction(this.url.queryDwbClientByClientid, param).then((res) => {
          if (res.success) {
            let data = res.result
            this.dwbClientVo = data || {};
            this.dwbClientShow = !!data
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbClientLoading = false;
        })
      },
      //医院信息
      loadDwbOrganization(orgid) {
        if (this.isBlank(orgid)) {
          this.dwbOrganizationShow = false
          return
        }
        const that = this;
        this.dwbOrganizationShow = true;
        this.dwbOrganizationLoading = true;
        let param = { orgid: orgid };
        getAction(this.url.queryDwbOrganizationByOrgid, param).then((res) => {
          if (res.success) {
            let data = res.result
            this.dwbOrganizationVo = data || {};
            this.dwbOrganizationShow = !!data
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbOrganizationLoading = false;
        })
      },
      //医生信息
      loadDwbDoctor(doctorid) {
        if (this.isBlank(doctorid)) {
          this.dwbDoctorShow = false
          return
        }
        const that = this;
        this.dwbDoctorShow = true;
        this.dwbDoctorLoading = true;
        let param = { doctorid: doctorid };
        // let param = { doctorid: '9405' };
        getAction(this.url.queryDwbDoctorByDoctorid, param).then((res) => {
          if (res.success) {
            let data = res.result
            this.dwbDoctorVo = data || {};
            this.dwbDoctorShow = !!data
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbDoctorLoading = false;
        })
      },
      /*loadDwbSettlement(visitid) {
        getAction(this.url.queryDwbSettlementByVisitid, {visitid}).then((res) => {
          if (res.success) {
            this.dwbSettlement = res.result|| {}
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          // this.dwbDoctorLoading = false;
        })
      },*/
      // 更多信息
      loadDwbMasterCols() {
        this.dwbMasterInfoColsLoading = true;
        queryEntityColByTable({ tableName: 'DWB_MASTER_INFO' }).then(res => {
          if (res.success) {
            this.dwbMasterInfoCols = res.result;
            this.dwbMasterInfoCols.forEach(item => {
              item.colName = this.toHump(item.colName)
              // console.log(item.colChnName,item.colName)
            })
            this.dwbMasterInfoColsShow = [...this.dwbMasterInfoCols]
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbMasterInfoColsLoading = false;
        })
      },
      isBlank(str){
        return !str || str.trim().length === 0;
      },
      toHump(col) {
        let array = col.split("_")
        for (let i = 1; i < array.length; i++) {
          let item = array[i].trim()
          if (item.length === 0)
            continue
          array[i] = item.charAt(0) + item.substring(1, item.length).toLowerCase()
        }
        array[0] = array[0].toLowerCase()
        return array.join("")
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    &:first-child {
      padding: 0 5px;
    }
  }

  .content-item {
    padding: 10px 10px 0 10px;
    .ant-card-hoverable{
      cursor: auto;
    }
  }

  .content-item:last-child {
    padding: 10px 10px 10px 10px;
  }
</style>
