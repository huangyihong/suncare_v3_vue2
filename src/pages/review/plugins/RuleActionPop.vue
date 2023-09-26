<template>
    <a-popover title="操作" trigger="click" placement="right" v-model="visible">
        <template slot="content">
            <div v-show="detailIds.length === 0" class="p-t-10 p-b-10 t-c">
                未沉淀规则数据
            </div>
            <a-spin :spinning="tipLoading">
                <template v-for="(ruleId,index) in detailIds">
                    <div class="pointer hover" style="padding: 5px" @click="detail(ruleId)">
                        <span v-if="detailIds.length === 1">修改规则配置</span>
                        <span v-else>修改规则配置{{index + 1}}</span>
                    </div>
                    <a-divider style="margin:0"/>
                </template>
                <template v-if="ruleTypeObj[ruleType]">
                    <template v-if="ruleTypeObj[ruleType].execUrl === execByRuleId">
                        <div class="pointer hover" style="padding: 5px" @click="reRunItem(undefined, detailIds[0])"
                             v-if="detailIds.length > 0">规则重跑
                        </div>
                    </template>
                    <div class="pointer hover" style="padding: 5px" @click="reRunItem(code)"
                         v-else>违规项目重跑
                    </div>
                </template>
            </a-spin>
        </template>
        <span><a>{{value}}</a> {{code}}</span>
        <component :is="detailComp" ref="detailRef"></component>

    </a-popover>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { postAction } from '@/api-sv3/manage'

  const MedicalDrugRuleModal = () => import('@/pages/case/modules/MedicalDrugRuleModal')
  const MedicalDrugRule2Modal = () => import('@/pages/case/modules/MedicalDrugRule2Modal')
  const MedicalChargeRuleModal = () => import('@/pages/case/modules/MedicalChargeRuleModal')
  const MedicalChargeRule2Modal = () => import('@/pages/case/modules/MedicalChargeRule2Modal')
  const MedicalTreatRuleModal = () => import('@/pages/case/modules/MedicalTreatRuleModal')
  const MedicalTreatRule2Modal = () => import('@/pages/case/modules/MedicalTreatRule2Modal')
  const MedicalDruguseRule2Modal = () => import('@/pages/case/modules/MedicalDruguseRule2Modal')
  const MedicalClinicalModal = () => import('@/pages/config/modules/MedicalClinicalModal')
  const MedicalYbDrugModal = () => import('@/pages/config/modules/MedicalYbDrugModal')

  export default {
    name: 'RuleActionPop',
    components: {
      MedicalDrugRule2Modal,
      MedicalDrugRuleModal,
      MedicalChargeRuleModal,
      MedicalChargeRule2Modal,
      MedicalTreatRuleModal,
      MedicalTreatRule2Modal,
      MedicalDruguseRule2Modal,
      MedicalClinicalModal,
      MedicalYbDrugModal
    },
    props: ['value', 'code', 'batchId', 'ruleType', 'ruleIds', 'actionTypeId'],
    data() {
      this.termItemCodeUrl = this.$suncare_v3 + '/apiReviewFirst/termItemCode'
      let execDrugUrl = this.$suncare_v3 + '/apiTask/taskProjectBatch/execDrug'
      let execByRuleId = this.execByRuleId = '/apiTask/taskProjectBatch/execByRuleId'
      return {
        tipLoading: false,
        visible: false,
        componentObj: {
          'DRUG': 'MedicalDrugRuleModal',
          'CHARGE': 'MedicalChargeRuleModal',
          'TREAT': 'MedicalTreatRuleModal',
          'DRUGUSE': 'MedicalDruguseRule2Modal',
          'CLINICAL': 'MedicalClinicalModal',
          'NEWCHARGE': 'MedicalChargeRule2Modal',
          'NEWTREAT': 'MedicalTreatRule2Modal',
          'NEWDRUG': 'MedicalDrugRule2Modal',
        },
        ruleTypeObj: {
          'DRUG': { execUrl: execDrugUrl },
          'CHARGE': { execUrl: execDrugUrl },
          'TREAT': { execUrl: execDrugUrl },
          'DRUGUSE': {execUrl: execByRuleId},
          'CLINICAL': { execUrl: execByRuleId },
          'NEWCHARGE': { execUrl: execByRuleId },
          'NEWTREAT': { execUrl: execByRuleId },
          'NEWDRUG': { execUrl: execByRuleId },
        },
        detailIds: []
      }
    },
    computed: {
      detailComp(){
        if(this.actionTypeId === 'DRUGREPEAT'){
          return 'MedicalYbDrugModal'
        }
        return this.componentObj[this.ruleType]
      }
    },
    watch: {
      ruleIds: {
        immediate: true,
        handler(val) {
          if (val) {
            this.detailIds = [...val]
            this.detailIds.sort()
          } else {
            this.detailIds = []
          }
        },
      },
    },
    methods: {
      reRunItem(itemCode, ruleId) {
        this.tipLoading = true
        getAction(this.termItemCodeUrl, { batchId: this.batchId, ruleType: this.ruleType, itemCode, ruleId }).then(res => {
          if (res.success) {
            let { count, pushCount } = res.result
            this.visible = false
            let that = this
            this.$confirm({
              title: (<div>该规则共涉及<span class="t-red"> {count} </span>条违规结果，其中
                <span class="t-red"> {pushCount} </span>条已经推送</div>),
              content: '还要继续重跑吗',
              onOk() {
                if(ruleId){
                  that.reRunRule(ruleId)
                } else {
                  that.reRunDrug(itemCode)
                }
              },
              onCancel() {
              },
            });
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.tipLoading = false
        })
      },
      reRunDrug(itemCode) {
        postAction(this.ruleTypeObj[this.ruleType].execUrl, {
          batchId: this.batchId,
          ruleType: this.ruleType,
          itemCode
        }).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.$emit('refresh')
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
      reRunRule(ruleId) {
        postAction(this.ruleTypeObj[this.ruleType].execUrl, {
          batchId: this.batchId,
          ruleType: this.ruleType,
          ruleId
        }).then(res => {
          if (res.success) {
            this.$message.success(res.message);
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
      detail(id) {
        console.log('ruleId', id)
        this.visible = false
        this.$refs.detailRef.detail(id, false)
      },
    },
  }
</script>
<style scoped>

</style>
