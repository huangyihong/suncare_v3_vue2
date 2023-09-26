<template>
    <a-drawer
            :title="title"
            :width="'100%'"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible"
    >

       <!-- <a-row type="flex">
            <a-col flex="100px">100px</a-col>
            <a-col flex="auto">auto</a-col>
        </a-row>-->
        <a-row :gutter="24" v-bind="grid > 4?{style:{display: 'flex'}}:{}">
            <a-col v-bind="grid > 4?{style:{flex: 'auto'},class: 'drawer-scroll'}:{lg: 12}">
                <!--<druguse-instruction :selectData="selectData"></druguse-instruction>-->
                <druguse-instruction :selectData="selectData" @loaded="len => instructionNum=len"></druguse-instruction>
            </a-col>
            <a-col v-bind="grid > 4?{style:{flex: '0 0 800px'},class: 'drawer-scroll'}:{class: 'm-t-10', lg: 12}"
            style="position: initial">
                <a-spin :spinning="confirmLoading">
                    <a-form :form="form">
                        <a-form-item
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="药品来源">
                            <m-dict-select-tag :options="[{code:'ATC', value: 'ATC分类'},{code:'DRUG', value: '药品信息'}]"
                                               v-decorator="['itemTypes',{}]" @change="val => setSelectObj([])"
                                               type="radio" :disabled="readonly || (selectData.length > 0 && isAdd)"
                                               required></m-dict-select-tag>
                            <span class="fr" v-if="!readonly">
                                <a-button type="primary"
                                          @click="selectType = form.getFieldValue('itemTypes');selectVisible = true">选择药品</a-button>
                            </span>
                        </a-form-item>

                        <a-table
                                size="small"
                                :pagination="false"
                                :columns="[
                                    {title: '药品名称',dataIndex: 'name',width: '50%'},
                                    {title: '药品编码',dataIndex: 'code',width: '30%'},
                                    {title: '操作',scopedSlots: { customRender: 'action' }}
                                ]"
                                :dataSource="selectData"
                                v-if="isAdd">
                            <a slot="action" slot-scope="text, record, index" @click="selectData.splice(index, 1)">
                                移除
                            </a>
                        </a-table>

                        <a-row :gutter="8" v-else>
                            <a-col :md="12" :xs="24">
                                <a-form-item
                                        :labelCol="labelColHalf"
                                        :wrapperCol="wrapperColHalf"
                                        label="药品编码">
                                    <a-input placeholder="请选择" readOnly
                                             v-decorator="['itemCodes',validatorRules.required]"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :md="12" :xs="24">
                                <a-form-item
                                        :labelCol="labelColHalf"
                                        :wrapperCol="wrapperColHalf"
                                        label="药品名称">
                                    <a-input placeholder="请选择" readOnly
                                             v-decorator="['itemNames',validatorRules.required]"></a-input>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <!--<a-form-item
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="规则编码"
                                v-if="!isAdd">
                            <a-input placeholder="请输入" :readOnly="readonly"
                                     v-decorator="['ruleCode',validatorRules.required]" ></a-input>
                        </a-form-item>-->
                        <h3>准入条件</h3>
                        <div class="fieldset-box">
                            <a-form-item
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    label="性别">
                                <m-dict-select-tag dictCode="GB/T2261.1" :disabled="readonly"
                                                   v-decorator="['sex',{}]"></m-dict-select-tag>
                            </a-form-item>
                            <a-form-item
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    label="年龄">
                                <age-comp :disabled="readonly" v-decorator="['age',{}]"></age-comp>
                                <!--<a-row :gutter="8">
                                  <a-col :span="7">
                                    <a-input-number :step="1" :min="0" :max="200" placeholder="" v-decorator="['ageMin', {}]"
                                                    placeholder="最小" class="w-b-100"></a-input-number>
                                  </a-col>
                                  <a-col :span="4" class="t-c">~</a-col>
                                  <a-col :span="7">
                                    <a-input-number :step="1" :min="0" :max="200" placeholder="" v-decorator="['ageMax', {}]"
                                                    placeholder="最大" class="w-b-100"></a-input-number>
                                  </a-col>
                                  <a-col :span="6">
                                    <m-dict-select-tag placeholder="单位" dictCode="AGE_UNIT" required valueEqName
                                                       v-decorator="['ageUnit', {}]"/>
                                  </a-col>
                                </a-row>-->
                            </a-form-item>
                        </div>
                        <h3>判断条件</h3>
                        <div class="fieldset-box">
                            <a-spin :spinning="conditionLoading">
                                <indication-set-group v-model="indicationGroups" :readonly="readonly"></indication-set-group>
                            </a-spin>
                            <!--<druguse-rule-group ref="ruleGroup" :readonly="readonly"></druguse-rule-group>-->
                        </div>
                        <a-form-item
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="不合规行为">
                            <input-medical-action-dict v-decorator="['actionId',validatorRules.required]"
                                                       @select="([val]) => model.actionName = val && val.name || '' " hideButton>
                            </input-medical-action-dict>
                            <!--<m-dict-select-tag-edit dictCode="ACTION_LIST" :disabled="readonly"
                                                    v-decorator="['actionId', validatorRules.required]"
                                                    @select="r => model.actionName = r.value " autoIncrease
                                                    search></m-dict-select-tag-edit>-->
                        </a-form-item>
                        <a-form-item
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="提示信息">
                            <a-input placeholder="请输入提示信息" :readOnly="readonly" v-decorator="['message', {}]"/>
                        </a-form-item>
                        <a-form-item
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="政策依据">
                            <a-input placeholder="请输入政策依据" :readOnly="readonly" v-decorator="['ruleBasis', {}]"/>
                        </a-form-item>
                        <a-form-item
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                                label="政策依据类别">
                            <other-dict-select-tag placeholder="请选择" :disabled="readonly"
                                                   v-decorator="['ruleBasisType', {}]" dictEname="rule_sourcetype"/>
                        </a-form-item>
                    </a-form>
                </a-spin>
                <div class="drawer-bottom">
                    <a-button @click="handleCancel">关闭</a-button>
                    <a-button type="primary" @click="handleOk" v-if="!readonly" :loading="confirmLoading">确定</a-button>
                </div>
            </a-col>
        </a-row>

        <m-modal centered
                 :title="`选择${selectInfo.name}`"
                 width="80%"
                 :visible="selectVisible"
                 @ok="handleSelectOk"
                 @cancel="handleSelectClose"
                 cancelText="关闭">
            <component ref="selectRef"
                       :is="selectInfo.component"
                       v-bind="selectInfo.params"
                       :selectType="model.ruleId?'radio':'checkbox'"></component>
        </m-modal>
    </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"

  // import DruguseRuleGroup from "@/pages/case/plugin/DruguseRuleGroup"
  import IndicationSetGroup from '@/pages/case/plugin/IndicationSetGroup'

  const MedicalDrug = () => import("@/pages/selectMulti/MedicalDrug")
  const MedicalStdAtc = () => import("@/pages/selectMulti/MedicalStdAtc")

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MDictSelectTagEdit from "@/components/dict_medical/MDictSelectTagEdit"
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"
  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'

  import DruguseInstruction from "@/pages/case/plugin/DruguseInstruction"
  import AgeComp from "@/pages/case/plugin/AgeCompMath"


  export default {
    name: "MedicalDruguseModal",
    components: {
      IndicationSetGroup,
      // DruguseRuleGroup,
      MedicalDrug,
      MedicalStdAtc,
      MDictSelectTag,
      MDictSelectTagEdit,
      OtherDictSelectTag,
      InputMedicalActionDict,

      DruguseInstruction,
      AgeComp
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
          sm: { span: 19 },
        },
        labelColHalf: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/medical/medicalDruguse/add",
          edit: "/medical/medicalDruguse/edit",
          queryById: "/medical/medicalDruguse/queryById",
          queryConditionByRuleId: "/medical/medicalRuleConditionSet/queryByRuleId",
        },
        selectInfos: {
          'ATC': {
            name: 'ATC分类',
            component: 'MedicalStdAtc',
            params: { fixedParam: { state: '1' } },
          },
          'DRUG': {
            name: '药品信息',
            component: 'MedicalDrug',
            params: {},
          }
        },
        selectInfo: {},
        selectType: undefined,
        selectVisible: false,
        selectData: [],
        selectInfoData: [],
        instructionNum: 0,
        isAdd: false,
        conditionLoading: false,
        indicationGroups: []
      }
    },
    computed: {
      grid() {
        return this.$store.getters.grid
      },
    },
    watch: {
      selectType(val) {
        this.selectInfo = this.selectInfos[val]
      }
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        let model = this.model = Object.assign({ actionType: 'DRUGUSE' }, record);
        this.visible = true;
        this.isAdd = !record.ruleId

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(model, 'ruleId', 'ruleCode','itemTypes', 'sex'
            , 'actionType', 'message', 'ruleBasis', 'ruleBasisType', 'actionId', 'actionName'))
          if (this.isAdd) {
            this.setSelectObj([])
          } else {
            let { itemCodes: code, itemNames: name } = model
            this.$nextTick(()=> {
              this.setSelectObj([{ code, name }])
            })
            if (model.age && model.ageUnit) {
              this.form.setFieldsValue({ age: model.age + '_' + model.ageUnit })
            }
          }

          this.loadConditionData(model.ruleId)

        });

      },
      detail(id, readonly = true) {
        this.readonly = readonly
        this.confirmLoading = true
        getAction(this.url.queryById, { id }).then(res => {
          if (res.success) {
            this.edit(res.result)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
        this.visible = true
      },
      loadConditionData(ruleId) {
        if(!ruleId){
          this.indicationGroups = []
          return
        }
        this.conditionLoading = true
        getAction(this.url.queryConditionByRuleId, { ruleId }).then(res => {
          if (res.success) {
            this.indicationGroups = res.result
            console.log('indicationGroups', this.indicationGroups)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.conditionLoading = false
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
              if (!this.model.ruleId) {
                httpurl += this.url.add;
                method = 'post';
              } else {
                httpurl += this.url.edit;
                method = 'put';
              }

              let formData = Object.assign(this.model, values);
              if (formData.age) {
                let [age, ageUnit] = formData.age.split('_')
                formData.age = age
                formData.ageUnit = ageUnit
              } else {
                formData.age = ''
                formData.ageUnit = ''
              }

              if (this.selectData.length === 0) {
                this.$message.warn('请选择药品')
                return
              }

              formData.itemCodes = this.selectData.map(r => r.code).join(',')
              formData.itemNames = this.selectData.map(r => r.name).join(',')

              //时间格式化
              formData.ruleGroups = this.indicationGroups
              console.log(formData)
              // return
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
              console.error(e)
            }
          }
        })
      },
      handleCancel() {
        this.close()
      },
      handleSelectOk() {
        let selectData = this.$refs.selectRef.getSelect()
        this.setSelectObj(selectData)
        this.handleSelectClose()
      },
      handleSelectClose() {
        console.log('handleSelectClose')

        this.selectVisible = false
      },
      setSelectObj(data) {
        this.selectData = data
        let obj = data.length > 0 ? data[0] : {}
        console.log('setSelectObj', obj)
        this.form.setFieldsValue({ itemCodes: obj.code, itemNames: obj.name })
      }
    }
  }
</script>

<style lang="less" scoped>
    .drawer-scroll {
        height: calc(100vh - 104px);
        overflow-y: auto;
    }
</style>
