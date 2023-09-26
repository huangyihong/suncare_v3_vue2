<template>


  <m-modal centered
           width="80%"
           :visible="visible"
           :footer="null"
           :destroyOnClose="true"
           @cancel="handleCancel"
  >
    <template slot="title">
      <!--<a-tabs v-model="tabs">
        <a-tab-pane key="case" tab="服务项目相关案例">
          <yb-charge-case-form ref="caseForm" :paramData="paramData"></yb-charge-case-form>
        </a-tab-pane>

        <a-tab-pane key="drug" tab="限制性用药案例">
          <yb-charge-drug-form ref="drugForm" :paramData="paramData"></yb-charge-drug-form>
        </a-tab-pane>

      </a-tabs>-->

      <yb-charge-case-form ref="caseForm" :paramData="paramData" v-if="tabs=='case'"></yb-charge-case-form>
      <yb-charge-drug-form ref="drugForm" :paramData="paramData" v-else></yb-charge-drug-form>
    </template>
  </m-modal>


</template>

<script>

import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, deleteAction, getAction} from '@/api/manage'
import ybChargeCaseForm from './ybChargeCaseForm'
import ybChargeDrugForm from './ybChargeDrugForm'

export default {
  name: "selectYbChargeCaseList",
  /*mixins: [JeecgListMixin],*/
  components: {
    ybChargeCaseForm,
    ybChargeDrugForm
  },
  props: ['paramData'],
  data() {
    return {
      description: '违规案例库管理页面',
      tabs: 'case',
      hasSelected: false,
      hasExamine: false,
      visible: false,


    }
  },
  computed: {},
  watch: {},
  methods: {
    show(type) {
      this.tabs = type
      this.visible = true

    },
    close() {
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
  },

}
</script>
<style lang="less">


</style>
