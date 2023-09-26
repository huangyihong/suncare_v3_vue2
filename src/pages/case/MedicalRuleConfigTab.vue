<template>
  <a-drawer
    :title="title"
    :width="1200"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-tabs :active-key="tabKey||'1'" @change="changeTab">
      <a-tab-pane key="1">
        <span slot="tab">
          药品合规配置
          <a v-if="medicalRuleCofigCount.DRUG">({{medicalRuleCofigCount.DRUG}})</a>
        </span>
        <medical-drug-rule2-list :fixedParam1="fixedParam" :groupCode="groupCode" :initLoad="false"></medical-drug-rule2-list>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          收费合规配置
          <a v-if="medicalRuleCofigCount.CHARGE">({{medicalRuleCofigCount.CHARGE}})</a>
        </span>
        <medical-charge-rule2-list :fixedParam1="fixedParam" :groupCode="groupCode" :initLoad="false"></medical-charge-rule2-list>
      </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab">
          合理诊疗配置
          <a v-if="medicalRuleCofigCount.TREAT">({{medicalRuleCofigCount.TREAT}})</a>
        </span>
        <medical-treat-rule2-list :fixedParam1="fixedParam" :groupCode="groupCode" :initLoad="false"></medical-treat-rule2-list>
      </a-tab-pane>
      <a-tab-pane key="4">
        <span slot="tab">
          合理用药配置
          <a v-if="medicalRuleCofigCount.DRUGUSE">({{medicalRuleCofigCount.DRUGUSE}})</a>
        </span>
        <medical-druguse-rule2-list :fixedParam1="fixedParam" :groupCode="groupCode" :initLoad="false"></medical-druguse-rule2-list>
      </a-tab-pane>
      <a-tab-pane key="5">
        <span slot="tab">
          模型配置
          <a v-if="formalCaseCount">({{formalCaseCount}})</a>
        </span>
        <list-formal-case :fixedParam1="fixedParam" :groupCode="groupCode" :initLoad="false"></list-formal-case>
      </a-tab-pane>
    </a-tabs>

    <div class="drawer-bootom-button">
      <a-button  @click="handleCancel">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import MedicalDrugRule2List from '@/pages/case/MedicalDrugRule2List'
import MedicalChargeRule2List from '@/pages/case/MedicalChargeRule2List'
import MedicalTreatRule2List from '@/pages/case/MedicalTreatRule2List'
import MedicalDruguseRule2List from '@/pages/case/MedicalDruguseRule2List'
import listFormalCase from '@/pages/probe/listFormalCase'
import {getAction} from '@api/manage'
export default {
  name: "MedicalRuleConfigTab",
  components: {
    MedicalDrugRule2List,
    MedicalChargeRule2List,
    MedicalTreatRule2List,
    MedicalDruguseRule2List,
    listFormalCase,
  },
  data() {
    return {
      title:"操作",
      visible: false,
      tabKey: '1',
      fixedParam:{},
      medicalRuleCofigCount:{},
      formalCaseCount: 0,
      url:{
        selectRuleTypeCount:'/medical/medicalRuleConfig/selectRuleTypeCount',
        selectCount: '/formal/medicalFormalCase/selectCount',
      },
      groupCode:null,

    }
  },
  watch: {
    groupCode: {
      immediate: true,
      handler(val) {
        if(val){
          this.loadRuleConfigCount(this.fixedParam)
          this.loadFormalCaseCount(this.fixedParam)
        }
      }
    },
  },
  methods: {
    changeTab(key) {
      this.tabKey = key
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleCancel () {
      this.close()
    },
    loadData(params) {
      this.visible = true;
      this.tabKey = '1'
      this.title = params.title;
      this.fixedParam = params.param;
      this.groupCode = params.groupCode
    },
    loadRuleConfigCount(param){
      getAction(this.url.selectRuleTypeCount,param,'get').then((res) => {
        if (res.success) {
          this.medicalRuleCofigCount = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    loadFormalCaseCount(param){
      getAction(this.url.selectCount,param,'get').then((res) => {
        if (res.success) {
          this.formalCaseCount = res.result
        }else{
          this.$message.warning(res.message);
        }
      })

    },
  }
}
</script>
<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>