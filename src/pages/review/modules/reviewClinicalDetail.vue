<template>
  <div class="this-page background-grey">
    <a-card size="small" title="医疗费用" :loading="clinicalLoading.length > 0" class="ant-card-contain-grid" style="border-bottom: none;">
      <card-grid-item title="路径标准费用区间"
                      :value="`${clinical.inhospPayMin||''} - ${clinical.inhospPayMax||''}`"></card-grid-item>
      <card-grid-item title="当前医疗费用" :value="masterInfo.totalfee"></card-grid-item>
      <card-grid-item title="比较结果"
                      :value="drugCompResult(clinical.inhospPayMin,clinical.inhospPayMax,masterInfo.totalfee)"></card-grid-item>
    </a-card>
    <a-card size="small" title="住院天数" :loading="clinicalLoading.length > 0" class="ant-card-contain-grid">
      <card-grid-item title="路径标准天数区间"
                      :value="`${clinical.inhospDaysMin||''} - ${clinical.inhospDaysMax||''}`"></card-grid-item>
      <card-grid-item title="当前住院天数" :value="masterInfo.zyDays"></card-grid-item>
      <card-grid-item title="比较结果"
                      :value="inHospCompResult(clinical.inhospDaysMin,clinical.inhospDaysMax,masterInfo.zyDays)"></card-grid-item>
    </a-card>
    <a-card size="small" title="药品明细" :loading="clinicalRangeLoading.length > 0" class="ant-card-contain-grid">
      <card-grid-item title="实际使用药品品种数量" :value="chargeDrugs.length" :col="4"></card-grid-item>
      <card-grid-item title="符合路径品种数量" :col="4">
        <charge-item-list-pop :data="existDrugs"><a>{{drugResult.exist}}</a></charge-item-list-pop>
      </card-grid-item>
      <card-grid-item title="符合路径品种数量占比" :value="percent(drugResult.exist,chargeDrugs.length)" :col="4"></card-grid-item>
      <card-grid-item title="符合路径品种金额占比" :value="percent(drugResult.fee,masterInfo.totalfee)" :col="4"></card-grid-item>
      <card-grid-item title="长期医嘱药品与临时医嘱药品使用比例" :value="intRatio(drugResult.longNum,drugResult.shotNum)" :col="4"></card-grid-item>
      <card-grid-item title="必需与可选择医嘱药品使用比例" :value="intRatio(drugResult.requireNum,drugResult.optionalNum)" :col="4"></card-grid-item>
    </a-card>
<!--exist: 0,fee: 0,longNum: 0,shotNum: 0,requireNum: 0,optionalNum: 0,-->
    <a-card size="small" title="项目明细" :loading="clinicalRangeLoading.length > 0" class="ant-card-contain-grid">
      <card-grid-item title="实际使用项目数量" :value="chargeProjects.length" :col="4"></card-grid-item>
      <card-grid-item title="符合路径项目数量" :value="projectResult.exist" :col="4">
        <charge-item-list-pop :data="existProjects"><a>{{projectResult.exist}}</a></charge-item-list-pop>
      </card-grid-item>
      <card-grid-item title="符合路径项目数量占比" :value="percent(projectResult.exist,chargeProjects.length)" :col="4"></card-grid-item>
      <card-grid-item title="符合路径项目金额占比" :value="percent(projectResult.fee,masterInfo.totalfee)" :col="4"></card-grid-item>
      <card-grid-item title="长期医嘱项目与临时项目使用比例" :value="intRatio(projectResult.longNum,projectResult.shotNum)" :col="4"></card-grid-item>
      <card-grid-item title="必需与可选择项目使用比例" :value="intRatio(projectResult.requireNum,projectResult.optionalNum)" :col="4"></card-grid-item>
    </a-card>
    <br>
  </div>
</template>

<script>
  import { getAction,postAction} from '@/api-sv3/manage'

  import {
    queryClinicalById,
    queryRangeGroupByClinicalId,
    // queryChargeItemByVisitId,
    // queryDwbMasterInfoByVisitid,
    queryRangeGroupAndItemByClinicalId,
  } from '@/api-sv3/api-medical'
  import ChargeItemListPop from '@/pages/review/plugins/ChargeItemListPop'
  export default {
    name: 'reviewClinicalDetail',
    props: {
      clinicalId: {
        type: String,
        required: true
      },
      visitid: {
        type: String,
        required: true
      },
    },
    components: {
      ChargeItemListPop,
      cardGridItem: {
        props: ["title", "value", "col"],
        render() {
          return (
            <a-col xs={8} xxl={this.col}>
              <a-card-grid hoverable={true} style="padding:1px;width:100%;text-align:center">
                <div style="padding: 12px;white-space: nowrap;background:#fafafa"
                >  {this.title}</div>
                <div style="padding: 12px;white-space: nowrap;border-top:1px solid #e8e8e8"
                >  {this.$slots.default ? this.$slots.default :this.value || '-'}</div>
              </a-card-grid>
            </a-col>
          );
        }
      }
    },
    data() {
      return {
        masterInfo: {},
        clinical: {},
        clinicalDrugRanges: [],
        clinicalProjectRanges: [],
        clinicalLoading: [],
        clinicalRangeLoading: [],
        chargeProjects: [],
        chargeDrugs: [],
        existProjects: [],
        existDrugs: [],
        drugResult: {},
        projectResult: {},
        rangeGroupAndItem: undefined
      }
    },
    beforeMount() {
      this.loadClinicalData(this.clinicalId)
      this.loadMasterInfoData(this.visitid)
      this.loadClinicalRangeData(this.clinicalId)
      this.loadChargeData(this.visitid)
      this.loadRangeGroupAndItem(this.clinicalId)
    },
    watch: {

    },
    methods: {
      loadMasterInfoData(visitid) {
        this.clinicalLoading.push(true)
        this.clinicalRangeLoading.push(true)
        getAction(this.$suncare_v3 + "/review/queryDwbMasterInfoByVisitid",{ visitid }).then(res => {
          if (res.success) {
            this.masterInfo = res.result || {}
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.clinicalLoading.pop()
          this.clinicalRangeLoading.pop()
        })
      },
      loadClinicalData(id) {
        this.clinicalLoading.push(true)
        queryClinicalById({ id }).then(res => {
          if (res.success) {
            this.clinical = res.result || {}
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.clinicalLoading.pop()
        })
      },
      loadClinicalRangeData(id) {
        this.clinicalRangeLoading.push(true)
        queryRangeGroupByClinicalId({ clinicalId: id }).then(res => {
          if (res.success) {
            let data = res.result
            for (let item of data) {
              if (item.groupType === 'drug') {
                this.clinicalDrugRanges.push(item)
              } else {
                this.clinicalProjectRanges.push(item)
              }
            }
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.clinicalRangeLoading.pop()
        })
      },
      loadChargeData(visitid) {
        this.clinicalRangeLoading.push(true)
        getAction(this.$suncare_v3 + "/review/queryChargeItemByVisitId",{ visitid }).then(res => {
          if (res.success) {
            let data = res.result
            // 药品=400  500 600 手术=703 耗材=800  801
            data.forEach(item => {
              if (['400', '500', '600', '703', '800', '801'].indexOf(item.CHARGECLASS_ID) > -1) {
                this.chargeDrugs.push(item)
              } else {
                this.chargeProjects.push(item)
              }
            })
            this.setRangeResult()
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.clinicalRangeLoading.pop()
        })
      },
      loadRangeGroupAndItem(clinicalId) {
        this.clinicalRangeLoading.push(true)
        queryRangeGroupAndItemByClinicalId({ clinicalId }).then(res => {
          if (res.success) {
            this.rangeGroupAndItem = res.result
            this.setRangeResult()
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.clinicalRangeLoading.pop()
        })
      },

      setRangeResult() {
        if (!this.rangeGroupAndItem) {
          return
        }
        let { drugGroups, projectGroups, drugItems, projectItems } = this.rangeGroupAndItem
        // 计算 药品结果
        this.drugResult = this.chargeItemResult(drugGroups,drugItems,this.chargeDrugs,this.existDrugs)
        // 计算 项目结果
        this.projectResult = this.chargeItemResult(projectGroups,projectItems,this.chargeProjects,this.existProjects)

      },

      chargeItemResult(drugGroups,drugItems,chargeItems,existItems ){
        // 初始值
        let drugResult = {
          exist: 0,
          fee: 0,
          longNum: 0,
          shotNum: 0,
          requireNum: 0,
          optionalNum: 0,
        }
        if(chargeItems.length === 0)
          return drugResult
        // groupCode - group 对象
        const drugGroupObj = drugGroups.reduce((array, item) => {
          return { ...array, [item.groupCode]: item }
        }, {})

        // existItems = [] 会使监听失效
        for(let chargeItem of chargeItems){
          let drug = drugItems.find(drugItem => drugItem.code === chargeItem.ITEMCODE)
          if(drug){
            let group = drugGroupObj[drug.groupCode]
            existItems.push({...drug,fee:chargeItem['sum(FEE)'],...group})
          }
        }

        drugResult.exist = existItems.length
        drugResult.fee = existItems.reduce((total,item)=> total + item.fee,0)
        let existLongItems = existItems.filter(item => item.adviceAttr === 'long')
        let existShortItems = existItems.filter(item => item.adviceAttr === 'short')
        let existRequireItems = existItems.filter(item => item.requireAttr === 'require')
        let existOptionalItems = existItems.filter(item => item.optionalAttr === 'optional')
        drugResult.longNum = existLongItems.length
        drugResult.shotNum = existShortItems.length
        drugResult.requireNum = existRequireItems.length
        drugResult.optionalNum = existOptionalItems.length
        return drugResult;
      },
      drugCompResult(min, max, val) {
        let result = this.compareResult(min, max, val)
        if (typeof result === Number) {
          if (result === 0) {
            return <span style="color:green">正常</span>
          } else if (result > 0) {
            return <span style="color:red">高：{this.percent(val - max,max)}</span>
          } else {
            return <span style="color:red">低：{this.percent(min - val,min)}</span>
          }
        } else {
          return result
        }
      },
      inHospCompResult(min, max, val) {
        let result = this.compareResult(min, max, val)
        if (typeof result === 'number' && !isNaN(result)) {
          if (result === 0) {
            return <span style="color:green">正常</span>
          } else if (result > 0) {
            return <span style="color:red">高：{val - max}</span>
          } else {
            return <span style="color:red">低：{min - val}</span>
          }
        } else {
          return result
        }
      },
      intRatio(num1,num2){
        if(num1 === undefined || num1 === null || num2 === undefined || num2 === null){
          return `${num1||0} : ${num2||0}`
        }
        if(num1 === 0 || num2 === 0){
          return `${num1||0} : ${num2||0}`
        }
        let gcd = this.calcGCD(num1,num2)
        return `${num1/gcd} : ${num2/gcd}`
      },
      percent(num1, num2){
        if(num1 === undefined || num1 === null || num2 === undefined || num2 === null){
          return '-'
        }
        if(num2 === 0){
          return '-'
        }
        return (num1* 100.0 / num2).toFixed(2) + '%'
      },
      compareResult(min, max, val) {
        if (val === undefined || val === null) {
          return
        }
        if (min === undefined || min === null && (max === undefined || max === null)) {
          return
        }

        if (min !== undefined && min !== null) {
          if (val < min) {
            return -1
          }
        }
        if (max !== undefined && max !== null) {
          if (val > max) {
            return 1
          }
        }
        return 0

      },
       calcGCD(m, n) {
        //求最大公约数
        if(m < n){
          [m, n] = [n, m]
        }
        let u = m;
        let v = n;
        while (v != 0) {
          [u, v] = [v, u % v];
        }
        return u;
      }
    },
    computed: {}
  }
</script>
<style lang="less" scoped>
  .grid {
    padding: 12px 24px;
    white-space: nowrap;
  }
</style>
