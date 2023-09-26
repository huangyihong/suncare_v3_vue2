<template>
    <a-drawer
            :title="title"
            :width="1000"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible"
    >

        <a-spin :spinning="confirmLoading" class="p-b-50">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-form-item
                        label="是否特殊模型">
                    <m-dict-select-tag :options="[{code:'DWB', value: '否'},{code:'DWS', value: '是'}]"
                                       v-model="type" @change="typeChange"
                                       type="radio" ></m-dict-select-tag>
                </a-form-item>
                <a-form-item label="特殊模型类型" v-if="type === 'DWS'">
                    <m-dict-select-tag :options="classifyConfigs" v-decorator="['classifyId', validatorRules.required]"
                                       required
                                       @select="classifyChange" autoIncrease search></m-dict-select-tag>
                </a-form-item>
                <a-form-item
                        label="不合规行为">
                    <input-medical-action-dict v-decorator="['actionId', validatorRules.required]"
                                               :multi="multi"
                    @select="objs => model.actionName = objs.map(r => r.name).join(',')"></input-medical-action-dict>
                    <!--<m-multi-select-tag :options="actionData" v-decorator="['actionName', validatorRules.required]"
                                        dropdownMatchSelectWidth v-if="multi"></m-multi-select-tag>
                    <m-dict-select-tag placeholder="请选择不合规行为" :options="actionData"
                                       v-decorator="['actionName', validatorRules.required]"
                                       :disabled="disableSubmit" search dropdownMatchSelectWidth
                                       v-else></m-dict-select-tag>-->

                </a-form-item>
                <a-form-item
                        label="状态">
                    <m-dict-select-tag placeholder="请选择状态" dictCode="SWITCH_STATUS"
                                       :disabled="disableSubmit" required
                                       v-decorator="['status', validatorRules.required ]"/>
                </a-form-item>
                <!--<a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="字段(多值)">
                  <a-input placeholder="请输入字段(多值)" v-decorator="['fields', {}]" />
                </a-form-item>
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="字段名称(多值)">
                  <a-input placeholder="请输入字段名称(多值)" v-decorator="['fieldTitles', {}]" />
                </a-form-item>-->
                <template v-if="model.id">
                    <a-row>
                        <a-col :sm="12" :xs="24">
                            <a-form-item label="创建人"
                                         :labelCol="labelColHalf"
                                         :wrapperCol="wrapperColHalf"
                            >
                                <a-input readOnly :value="`${model.createUsername}(${model.createTime})`"/>
                            </a-form-item>
                        </a-col>
                        <a-col :sm="12" :xs="24">
                            <a-form-item label="修改人"
                                         :labelCol="labelColHalf"
                                         :wrapperCol="wrapperColHalf"
                            >
                                <a-input readOnly :value="`${model.updateUsername}(${model.updateTime})`"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </template>
            </a-form>
            <a-tabs type="card" @change="callback">
                <a-tab-pane key="1" :tab="`列字段(${colNum})`">
                    <task-action-col-config ref="colConfig" :type="type" :tables="classifyConfig.tables"
                                            @change="val => colNum = val.length"></task-action-col-config>
                </a-tab-pane>
                <a-tab-pane key="2" :tab="`搜索条件(${searchNum})`" :forceRender="true">
                    <task-action-col-search ref="searchConfig" :configId="model.id"
                            @change="val => searchNum = val.length"></task-action-col-search>
                </a-tab-pane>
            </a-tabs>


        </a-spin>
        <div class="drawer-bottom" v-if="!disableSubmit">
            <a-button @click="handleCancel">关闭</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
        </div>
    </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import TaskActionColConfig from '@/pages/task/plugin/TaskActionColConfig'
  import TaskActionColSearch from '@/pages/task/plugin/TaskActionColSearch'

  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'

  export default {
    name: "TaskActionFieldConfigModal",
    components: { MDictSelectTag, MMultiSelectTag, TaskActionColConfig, TaskActionColSearch, InputMedicalActionDict },
    data() {
      // this.actionDataMap = {}
      this.allFieldDataMap = {}
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
        labelColHalf: {
          xs: { span: 10 },
        },
        wrapperColHalf: {
          xs: { span: 14 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/task/taskActionFieldConfig/add",
          edit: "/task/taskActionFieldConfig/edit",
          classifyConfig: '/medical/medicalSpecialCaseClassify/dict',
        },
        disableSubmit: false,
        // actionData: [],
        multi: false,
        type: undefined,
        classifyConfigs: [],
        classifyConfig: {},
        paltFormDict: {},
        colNum: 0,
        searchNum: 0,
      }
    },
    computed: {
      primaryColor() {
        return this.$store.getters.color
      }
    },
    methods: {
      classifyChange(classifyConfig) {
        console.log('classifyChange', classifyConfig)
        this.classifyConfig = classifyConfig || {}
      },
      typeChange(type) {
        console.log('typeChange', type)
        this.form.setFieldsValue({ actionName: undefined })
        this.multi = !this.model.id && type === 'DWB'
        if(type === 'DWB'){
          this.classifyConfig = {}
          this.form.setFieldsValue({ classifyId: this.model.classifyId = '' })
        }
      },
      async initData() {

        await this.$refs.colConfig.initData()

        let res = await getAction(this.url.classifyConfig, {})
        if (res.success) {
          let data = res.result
          this.classifyConfigs = data.map(r => ({
            code: r.classifyId, value: r.classifyName,
            tables: r.optionalTable.split(','),
            ...pick(r, 'actionName', 'actionTypeName', 'actionId', 'actionType')
          }))
        } else {
          this.$message.warning(res.message);
          return
        }

        /*let dataMap = await this.$util.initDict([
          'ACTION_LIST',
          'ACTION_LIST_CHARGE',
          'LIMIT_SCOPE_TO_DRUG_ACTION',
          'LIMIT_SCOPE_TO_CHARGE_ACTION',
          'LIMIT_SCOPE_TO_TREAT_ACTION', ])
        // 选择字段
        let {
          ACTION_LIST_CHARGE: actionListCharge,
          ACTION_LIST: actionList,
          LIMIT_SCOPE_TO_DRUG_ACTION: limitScopeToDrug,
          LIMIT_SCOPE_TO_CHARGE_ACTION: limitScopeToCharge,
          LIMIT_SCOPE_TO_TREAT_ACTION: limitScopeToTreat
        } = dataMap

        let dwbActionSet = new Set([...actionList.map(r => r.value)
          , ...limitScopeToDrug.map(r => r.value)
          , ...limitScopeToCharge.map(r => r.value)
          , ...limitScopeToTreat.map(r => r.value)
          , ...actionListCharge.map(r => r.value)
        ])

        //dwb 排除dws的行为
        let dwbActions = this.dwbActions = Array.from(dwbActionSet)
        // 排序
        dwbActions.sort()
        this.actionData = dwbActions.map(r => ({ code: r, value: r }))*/
      },

      add(record = {}) {
        if(record.id){
          this.copyAddId = record.id
          delete record.id
          delete record.actionId
          delete record.actionName
        } else {
          this.copyAddId = undefined
        }
        this.edit(record);
      },
      edit(record) {
        this.visible = true;
        if (this.classifyConfigs.length === 0) {
          this.confirmLoading = true
          this.$nextTick(() => {
            this.initData().finally(() => {
              this.confirmLoading = false
              this.editData(record)
            })
          })

        } else {
          this.form.resetFields();
          this.$nextTick(() => {
            this.editData(record)
          })
        }
      },
      editData(record) {
        let model = this.model = Object.assign({ status: 'normal' }, record);
        this.typeChange(this.type = record.classifyId ? 'DWS' : 'DWB')
        console.log('editData', model)
        this.$nextTick(()=>{
          this.form.setFieldsValue(pick(model,'actionId', 'actionName', 'status', 'classifyId'))

          let configId = model.id || this.copyAddId
          if (!configId) {
            return
          }

          if (this.type === 'DWS') {
            this.classifyChange(this.classifyConfigs.find(r => r.code === model.classifyId), false)
          }
          this.$refs.colConfig.loadData(configId)
        })


      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            try {


              that.confirmLoading = true;
              let httpurl = '';
              let method = '';
              if (!this.model.id) {
                httpurl += this.url.add;
                method = 'post';
              } else {
                httpurl += this.url.edit;
                method = 'put';
              }
              let selectedData = this.$refs.colConfig.getData()
              if (selectedData.length === 0) {
                this.$message.warn('请选择显示字段')
                return
              }
              console.log('values',values)

              let formData = Object.assign(this.model, values, {platform: 'service'});
              formData.fields = selectedData.map(r => r.tableName + '.' + r.colName).join(',')
              formData.fieldTitles = selectedData.map(r => r.editName || r.colCnname).join(',')
              formData.cols = selectedData.map(r => ({colId: r.colId, colCnname: r.editName}) )
              formData.multi = this.multi

              if(this.$refs.searchConfig){
                let selectedData = this.$refs.searchConfig.getData()
                // if(selectedData.length > 0){
                  formData.searchs = selectedData.map(r => ({colId: r.colId, colCnname: r.editName}) )
                // }
              } else {
                formData.searchs = []
              }
              console.log(formData)
              httpAction(httpurl, formData, method).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit('ok');
                  that.close();
                } else {
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
              })
            } catch (e) {
              console.warn(e)
            }

          }
        })
      },
      handleCancel() {
        this.close()
      },

    }
  }
</script>

<style lang="less" scoped>

</style>
