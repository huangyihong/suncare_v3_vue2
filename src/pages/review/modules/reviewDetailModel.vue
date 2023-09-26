<template>
  <m-modal
    ref="modal"
    centered
    :title="title"
    :bodyStyle="{padding: '10px 24px 0 24px'}"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    destroyOnClose
    @cancel="handleCancel"
    @max="isMax=> {isMax? heightRatio+=0.2: heightRatio-=0.2}"
    :footer="null">
    <a-tabs hideAdd type="editable-card" v-model="activeKey" @edit="onEdit">
      <a-tab-pane tab="当前就诊信息" key="1" :closable="false">
        <medical-case-info-modal :medicalUnreasonableActionVo="medicalUnreasonableActionVo"
                                 :visitid="visitid"
                                 :batchId="batchId"
                                 :height="tabHeight"></medical-case-info-modal>
      </a-tab-pane>
      <a-tab-pane tab="违反规则" key="2" :closable="false" v-if="batchId">
        <review-rule-model ref="ruleModel"
                           :visitid="visitid"
                           :batchId="batchId"
                           @detail="addCaseDetailTab"
                           style="overflow:auto;transition: height .3s"
                           :style="{height: tabHeight}"></review-rule-model>
      </a-tab-pane>
      <a-tab-pane tab="历史就诊信息" key="3" :closable="false">
        <review-client-mater-info :visitid="visitid" @detail="addVisitInfoTab"></review-client-mater-info>
      </a-tab-pane>
   <!--   <a-tab-pane tab="医嘱信息" key="3" :closable="false">
        <review-order :medicalUnreasonableActionVo="medicalUnreasonableActionVo"
                      :visitid="visitid"></review-order>
      </a-tab-pane>-->
      <!--<a-tab-pane tab="流程信息" key="2">
        <review-log-model :reviewId="medicalUnreasonableActionVo.id"
                          style="overflow:auto" :style="{height: tabHeight}"></review-log-model>
      </a-tab-pane>-->
      <slot></slot>
      <template v-for="(tab,index) in tabs">
        <a-tab-pane :tab="tab.title" :key="tab.key" :closable="tab.closable">
            <component :is="tab.component" @max="isMax=>{$refs.modal.max(isMax)}"
                       v-bind="tab.param||{}" :height="tabHeight"></component>
        </a-tab-pane>
      </template>
    </a-tabs>
  </m-modal>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"

  const MedicalCaseInfoModal = () => import("./medicalCaseInfoModal")
  // import ReviewLogModel from "./reviewLogModel"
  const reviewRuleModel = () => import("./reviewRuleModel")
  const CaseDetail = () => import('@/pages/probe/caseDetail')
  const ClinicalDetail = () => import( '@/pages/review/modules/reviewClinicalDetail')
  // const reviewOrder = () => import( '@/pages/review/modules/reviewOrder')
  const reviewClientMaterInfo = () => import( '@/pages/review/modules/reviewClientMaterInfo')

  import { mapGetters } from 'vuex'

  export default {
    name: "ReviewDetailModal",
    components: {
      MedicalCaseInfoModal,
      // ReviewLogModel,
      reviewRuleModel,
      CaseDetail,
      ClinicalDetail,
      // reviewOrder
      reviewClientMaterInfo,
    },
    props: {
      batchId: String,
    },
    data() {
      return {
        title: "就诊信息详情",
        visible: false,
        model: {},
        confirmLoading: false,
        activeKey: '1',
        tabs: [],
        medicalUnreasonableActionVo: undefined,
        visitid: undefined,
        heightRatio: 0.8,
      }
    },
    computed: {
      ...mapGetters(["height"]),
      tabHeight() {
        let y = this.height * this.heightRatio - 111
        return (y < 200 ? 200 : y) + 'px'
      }
    },
    methods: {
      close() {
        this.$emit('close');
        this.tabs = []
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },
      loadData(param, tabKey = '1') {
        this.activeKey = tabKey
        if (typeof param === 'string') {
          this.visitid = param
          this.medicalUnreasonableActionVo = undefined
        } else {
          this.visitid = param.visitid
          this.medicalUnreasonableActionVo = Object.assign({}, param);
        }
        this.visible = true;
      },
      addCaseDetailTab({ id, name, type }) {
        const activeKey = `rule-${id}`;
        if (this.tabs.findIndex(tab => tab.key === activeKey) < 0) {
          let tab = {
            key: activeKey,
            title: name,
            type: 'rule'
          }
          if (type === 'CASE') {
            // tab.jsx = <case-detail batchId={this.batchId} caseId={ruleId} vOn:max={isMax=>this.$refs.modal.max(isMax)}/>
            tab.component = 'CaseDetail'
            tab.param = {
              batchId: this.batchId,
              caseId: id,
            }
          } else if (type === 'CLINICAL') {
            // tab.jsx = <clinical-detail visitid={this.visitid} clinicalId={ruleId} vOn:max={isMax=>this.$refs.modal.max(isMax)}/>
            tab.component = 'ClinicalDetail'
            tab.param = {
              visitid: this.visitid,
              clinicalId: id,
            }
          }
          console.log('tab', tab)
          this.tabs.push(tab);
        }
        this.activeKey = activeKey;
      },
      addVisitInfoTab({visitid, visitdate}){
        if(visitid === this.visitid){
          this.activeKey = '1'
          return
        }
        const activeKey = `visit-${visitid}`;
        if (this.tabs.findIndex(tab => tab.key === activeKey) < 0) {
          let tab = {
            key: activeKey,
            title: visitdate + "-就诊",
            type: 'visit'
          }
          tab.component = 'MedicalCaseInfoModal'
          tab.param = {
            visitid,
          }
          this.tabs.push(tab);
        }

        this.activeKey = activeKey;
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      remove(targetKey) {
        let index = this.tabs.findIndex(tab => tab.key === targetKey)
        let tab = this.tabs.splice(index, 1)[0];
        console.log('tab',tab)
        if (this.activeKey === targetKey) {
          if (this.tabs.length > 0) {
            this.activeKey = this.tabs[index - 1 < 0 ? 0 : (index - 1)].key
          } else {

            this.activeKey = tab.type === 'visit'?'3':'2'
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
