<template>
    <a-drawer
            title="判定条件组"
            :width="800"
            placement="right"
            closable
            @close="close"
            :visible="visible">
        <a-form :form="form">
            <a-form-item label="条件组名称"  v-bind="formItemLayout">
                <a-input v-decorator="['groupName', validatorRules.required]" ></a-input>
            </a-form-item>
            <a-form-item label="疾病组"  v-bind="formItemLayout">
                <multi v-slot="slotObj"
                       v-decorator="['diseaseGroups', {}]"
                       separator="||">
                    <input-medical-drug-group :disabled="readonly" kind="5" separator=",,"
                                              :value="slotObj.value" v-on="slotObj.on"
                                              multi wholeValue></input-medical-drug-group>
                </multi>
            </a-form-item>
            <a-form-item label="项目组"  v-bind="formItemLayout">
                <multi v-slot="slotObj"
                       v-decorator="['treatGroups', {}]"
                       separator="||">
                    <input-medical-drug-group :disabled="readonly" kind="1" separator=",,"
                                              :value="slotObj.value" v-on="slotObj.on"
                                              multi wholeValue></input-medical-drug-group>
                </multi>
            </a-form-item>
            <a-form-item label="药品组"  v-bind="formItemLayout">
                <multi v-slot="slotObj"
                       v-decorator="['drugGroups', {}]"
                       separator="||">
                    <input-medical-drug-group :disabled="readonly" kind="7" separator=",,"
                                              :value="slotObj.value" v-on="slotObj.on"
                                              multi wholeValue></input-medical-drug-group>
                </multi>
            </a-form-item>
            <a-form-item label="化验项目(组)"  v-bind="formItemLayout">
                <multi v-slot="slotObj"
                       v-decorator="['testResults', {}]"
                       separator="::"
                       buttonText="增加组 或关系">
                    <test-result-json :disabled="readonly"
                                      :value="slotObj.value" v-on="slotObj.on"
                    ></test-result-json>
                </multi>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script>
  import InputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"
  import InputMedicalTreatProject from "@/pages/selectInput/MedicalTreatProject"
  import TestResultJson from "@/pages/case/plugin/TestResultJson"
  import { druguseLimitScope } from "@/pages/case/DrugRuleCommon"
  import Multi from '@/pages/selectInput/multi'

  import pick from 'lodash/pick'

  export default {
    name: 'MedicalDruguserRuleGroup',
    components: {
      InputMedicalDrugGroup,
      InputMedicalTreatProject,
      TestResultJson,
      Multi
    },
    data() {
      return {
        visible: false,
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        },
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },

      }
    },
    beforeMount() {

    },
    methods: {
      loadData(record) {

        let {diseaseGroups, treatGroups, testResults, drugGroups} = record
        // 数组拼接字符串
        let diseaseGroupsVal = diseaseGroups && diseaseGroups.map(s => s.map(r => `${r.code}:${r.name}`).join(',,')).join("||")
        // 数组拼接字符串
        let treatGroupsVal = treatGroups && treatGroups.map(s => s.map(r => `${r.code}:${r.name}`).join(',,')).join("||")
        // 数组拼接字符串
        let drugGroupsVal = drugGroups && drugGroups.map(s => s.map(r => `${r.code}:${r.name}`).join(',,')).join("||")
        // 剪切方括号 []
        let testResultsVal = testResults && testResults.map(r => JSON.stringify(r)).join("::")

        console.log('testResultsVal',testResultsVal)
        this.visible = true
        this.form.resetFields()
        this.$nextTick(()=>{
          this.form.setFieldsValue({ ...pick(record,'groupName')
            , diseaseGroups: diseaseGroupsVal
            , treatGroups: treatGroupsVal
            , drugGroups: drugGroupsVal
            , testResults: testResultsVal})
        })
      },
      close() {
        this.form.validateFieldsAndScroll((err, values) => {
          try {
            if (!err) {
              console.log('values',values)
              let {diseaseGroups, treatGroups,drugGroups, testResults, groupName} = values
              let obj = {groupName}
              if(diseaseGroups && diseaseGroups.length > 0){
                obj.diseaseGroups = diseaseGroups.split('||').map(r => r.split(',,').map(r1 => {
                  let [code, name] = r1.split(":")
                  return {code, name}
                }))
              }
              if(treatGroups && treatGroups.length > 0){
                obj.treatGroups = treatGroups.split('||').map(r => r.split(',,').map(r1 => {
                  let [code, name] = r1.split(":")
                  return {code, name}
                }))
              }
              if(drugGroups && drugGroups.length > 0){
                obj.drugGroups = drugGroups.split('||').map(r => r.split(',,').map(r1 => {
                  let [code, name] = r1.split(":")
                  return {code, name}
                }))
              }
              if(testResults && testResults.length > 0){
                obj.testResults = testResults.split('::').map(r => JSON.parse(r))
              }
              this.$emit('close', obj)
              this.visible = false
            }
          } catch (e) {
            console.warn(e)
          }

        })

      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
