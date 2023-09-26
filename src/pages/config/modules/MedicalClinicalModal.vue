<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    destroyOnClose
    closable
    @close="close"
    :visible="visible">
    <a-tabs :defaultActiveKey="tabKey||'1'" @change="callback">
      <a-tab-pane tab="基础资料" key="1">
        <medical-clinical-info ref="baseInfo" :data="model" :scrollTo="scrollTo" :readOnly="disableSubmit"></medical-clinical-info>
      </a-tab-pane>
      <a-tab-pane tab="准入条件" key="2">
        <medical-clinical-access-group ref="approveGroup" :clinicalId="model.clinicalId" type="approve" :readOnly="disableSubmit"></medical-clinical-access-group>
      </a-tab-pane>
      <a-tab-pane tab="排除条件" key="3">
        <medical-clinical-access-group ref="rejectGroup" :clinicalId="model.clinicalId" type="reject"  :readOnly="disableSubmit"></medical-clinical-access-group>
      </a-tab-pane>
      <a-tab-pane tab="药品范围" key="4">
        <medical-clinical-range-group ref="drugRange" type="drug" :clinicalId="model.clinicalId" :readOnly="disableSubmit"></medical-clinical-range-group>
      </a-tab-pane>
      <a-tab-pane tab="项目范围" key="5">
        <medical-clinical-range-group ref="projectRange" type="project" :clinicalId="model.clinicalId" :readOnly="disableSubmit"></medical-clinical-range-group>
      </a-tab-pane>
    </a-tabs>
    <div class="drawer-bottom" v-if="!disableSubmit">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk" :loading="confirmLoading">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { queryClinicalById } from '@/api-sv3/api-medical'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MedicalClinicalInfo from '@/pages/config/modules/MedicalClinicalInfo'
  import MedicalClinicalRangeGroup from '@/pages/config/modules/MedicalClinicalRangeGroup'
  import MedicalClinicalAccessGroup from '@/pages/config/modules/MedicalClinicalAccessGroup'

  export default {
    name: "MedicalClinicalModal",
    components: {
      MedicalClinicalInfo,
      MedicalClinicalRangeGroup,
      MedicalClinicalAccessGroup,
    },
    data() {
      return {
        title: "操作",
        visible: false,
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
        disableSubmit: false, // 只读
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/medical/medicalClinical/addClinical",
          edit: "/medical/medicalClinical/editClinical",
        },
        tabKey: '1',
        scrollTo: undefined,

      }
    },
    beforeMount() {
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record, tabKey='1',scrollTo) {
        this.model = record
        this.visible = true
        this.tabKey = tabKey
        this.scrollTo = scrollTo
      },
      detail(id,readonly=true, tabKey='1',scrollTo){
        // this.confirmLoading = true
        queryClinicalById({id}).then(res=>{
          if(res.success){
            this.model = res.result
          }else{
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          // this.confirmLoading = false
        })
        this.visible = true
        this.tabKey = tabKey
        this.disableSubmit = readonly // 只读

      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        let fromData = this.model
        let baseInfoDom = this.$refs.baseInfo
        let approveGroup = this.$refs.approveGroup
        let rejectGroup = this.$refs.rejectGroup
        let drugRange = this.$refs.drugRange
        let projectRange = this.$refs.projectRange

        if (approveGroup) {
          fromData.approveGroup = approveGroup.getData()
        }

        if (rejectGroup) {
          fromData.rejectGroup = rejectGroup.getData()
        }

        if (drugRange) {
          fromData.drugRange = drugRange.getData()
        }
        if (projectRange) {
          fromData.projectRange = projectRange.getData()
        }
        if (baseInfoDom) {
          baseInfoDom.getData().then(data => {
            fromData.baseInfo = data
            this.postData(fromData)
          }).catch(e =>{
            this.$message.warn('基础资料信息没有填写完整')
          })
        } else {
          this.postData(fromData)
        }

      },
      postData(formData) {
        this.confirmLoading = true;
        let httpurl = '';
        let method = '';
        if (!formData.clinicalId) {
          httpurl += this.url.add;
          method = 'post';
        } else {
          httpurl += this.url.edit;
          method = 'put';
        }
        httpAction(httpurl, formData, method).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.$emit('ok');
            this.close();
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false;
        })
      },
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>
  .box-padding {
    padding: 16px 16px 0 16px;
  }
</style>
