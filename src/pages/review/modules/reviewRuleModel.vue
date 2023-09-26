<template>

  <a-spin :spinning="confirmLoading">
    <!--<template v-for="ruleObj in ruleObjs">
      <a-card v-show="ruleObj.data.length > 0 || confirmLoading" :key="ruleObj.type" size="small"
              :title="ruleObj.type === '06'&&unreasonableActionId?undefined:ruleObj.title" :headStyle="{backgroundColor:'#f6f6f6'}"
              class="m-b-10">
        <template v-if="ruleObj.type === '06' && unreasonableActionId" slot="title">
          {{ruleObj.title}}
          <span class="fr">主要临床路径：
          <m-select-pop-tag :options="clinicalOptions" :value="clinicalId" required
                            @ok="clinicalSelect"></m-select-pop-tag>
          </span>
        </template>
        <template v-for="(rule, index) in ruleObj.data">
          <a-card-grid :key="rule.ruleId" @click="detail(rule)" style="cursor: pointer;padding: 16px"
                       :style="{width,color:rule.ruleId===currentRuleId?primaryColor:undefined}">
            {{rule.ruleName}}
          </a-card-grid>
        </template>
      </a-card>
    </template>
  </a-spin>
  <review-rule-drug-list :visitid="visitid" :batchId="batchId" ruleType="1" title="违反药品合规"
                         class="m-b-10"></review-rule-drug-list>
  <review-rule-drug-list :visitid="visitid" :batchId="batchId" ruleType="2" title="违反收费合规"
                         class="m-b-10"></review-rule-drug-list>-->


    <template v-for="(item,type) in typeMap">
      <a-card :key="type" :title="item.title" :headStyle="{backgroundColor:'#f6f6f6'}"
              size="small" class="m-b-10 m-t-10 card-padding0" v-if="item.data.length > 0">
        <template v-if="type === 'CASE' || type === 'CLINICAL'" slot="title">
          {{item.title}}
          <p class="fr t-grey-aaa" style="font-size: 12px;">点击查看详情</p>
        </template>
        <!--<template v-for="(rule, index) in item.data">
          <a-card-grid :key="rule.id" @click="detail(rule)" style="cursor: pointer;padding: 16px"
                       :style="{width,color:rule.id===currentRuleId?primaryColor:undefined}">
            {{rule.name}}
          </a-card-grid>
        </template>-->
        <review-rule-info-list :data="item.data" :type="type" :title="item.colTitle"></review-rule-info-list>
      </a-card>
    </template>
    <!--<component :is="selectInfo.detailComponent" ref="detailRef"></component>-->
  </a-spin>

</template>

<script>
  import { getAction } from '@/api/manage'
  import { mixin } from '@/utils/mixin'
  import MSelectPopTag from '@/components/dict_medical/MSelectPopTag'

  import { updateUnreasonableById } from '@/api-sv3/api-medical'
  // import reviewRuleDrugList from '@/pages/review/modules/reviewRuleDrugList'
  import reviewRuleInfoList from '@/pages/review/modules/reviewRuleInfoList'
  // const MedicalDrugRuleModal = () => import('@/pages/case/modules/MedicalDrugRuleModal')
  // const MedicalChargeRuleModal = () => import('@/pages/case/modules/MedicalChargeRuleModal')

  export default {
    name: 'reviewRuleModel',
    mixins: [mixin],
    components: {
      // CaseDetail
      MSelectPopTag,
      // reviewRuleDrugList,
      reviewRuleInfoList
      // MedicalDrugRuleModal,
      // MedicalChargeRuleModal
    },
    props: ['unreasonableActionId', 'pushed', 'visitid', 'batchId'],
    data() {
      return {
        url: {
          breakCaseList: this.$suncare_v3 + '/review/queryBreakRule',
        },
        typeMap: {
          CASE: {
            title: '违反模型',
            colTitle: '模型',
            data:[]
          },
          CLINICAL: {
            title: '临床路径',
            colTitle: '临床路径',
            data:[]
          },
          DRUG: {
            title: '药品合规',
            colTitle: '药品',
            data:[]
          },
          CHARGE: {
            title: '收费合规',
            colTitle: '收费项目',
            data:[]
          },
          TREAT: {
            title: '合理诊疗',
            colTitle: '诊疗项目',
            data:[]
          },
          DRUGUSE: {
            title: '合理用药',
            colTitle: '药品',
            data:[]
          },
          NEWCHARGE: {
            title: '收费合规-测试',
            colTitle: '收费项目',
            data:[]
          },
          NEWTREAT: {
            title: '合理诊疗-测试',
            colTitle: '诊疗项目',
            data:[]
          },
          NEWDRUG: {
            title: '药品合规-测试',
            colTitle: '药品',
            data:[]
          },
          MANUAL: {
            data:[]
          }
        },
        confirmLoading: false,
        currentRuleId: undefined,
      }
    },
    beforeMount() {
      this.loadData()
    },
    methods: {
      loadData() {
        if (this.confirmLoading) {
          return
        }
        this.confirmLoading = true;
        getAction(this.url.breakCaseList,
          { visitid: this.visitid, batchId: this.batchId }).then((res) => {
          if (res.success) {
            let data = res.result
            for(let r of data){
              let type = r.BUSI_TYPE || 'CASE'
              /*this.typeMap[type].data.push({
                type,
                name: r.CASE_NAME,
                id: r.CASE_ID,
              })*/

              this.typeMap[type].data.push(r)
            }
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false;
        })
      },
      clinicalSelect(item) {
        if (item.code === this.clinicalId)
          return
        this.clinicalId = item.code
        this.saveClinicalSelect(item.code, item.value)
      },
      saveClinicalSelect(id, name) {
        let params = {
          id: this.unreasonableActionId,
          clinicalId: id,
          clinicalName: name,
        }
        updateUnreasonableById(params).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      detail(rule) {
        if(rule.type === 'CASE' || rule.type ==='CLINICAL'){
          this.$emit('detail', rule)
          this.currentRuleId = rule.id
        }

      },
    },
    computed: {
      grid() {
        return this.$store.getters.grid
      },
      width() {
        return 100 / parseInt(this.grid / 2 + 1) + '%'
      },
    }
  }
</script>
<style scoped>

</style>
