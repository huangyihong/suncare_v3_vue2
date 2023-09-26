<template>
    <a-drawer
            :title="title"
            :width="800"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-row :gutter="8">
                    <a-col :md="10" :xs="24">
                        <a-form-item
                                :labelCol="labelColHalf"
                                :wrapperCol="wrapperColHalf"
                                label="项目编码">
                            <a-input placeholder="请选择" readOnly
                                     v-decorator="['itemCodes',validatorRules.required]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="10" :xs="24">
                        <a-form-item
                                :labelCol="labelColHalf"
                                :wrapperCol="wrapperColHalf"
                                label="项目名称">
                            <a-input placeholder="请选择" readOnly
                                     v-decorator="['itemNames',validatorRules.required]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4" :xs="24" class="t-r" v-if="!readonly">
                        <a-button type="primary" @click="selectVisible = true">选择项目
                        </a-button>
                    </a-col>
                </a-row>
                <a-form-item label="不合规行为">
                    <m-dict-select-tag dictCode="ACTION_LIST_CHARGE" :disabled="readonly"
                                       v-decorator="['actionId', validatorRules.required]"
                                       @select="actionSelect" search></m-dict-select-tag>
                </a-form-item>
                <a-spin :spinning="conditionLoading">
                    <template v-if="accessProps.length > 0">
                        <h3>准入条件</h3>
                        <div class="fieldset-box">
                            <a-row :gutter="12">
                                <template v-for="(item,index) in accessProps">
                                    <a-col :span="3">
                                        <m-dict-select-tag dictCode="CASE_RELATION_CHAR" v-if="index > 0"
                                                           required :disabled="readonly"
                                                           v-model="item.logic"></m-dict-select-tag>
                                    </a-col>
                                    <a-col :span="21">
                                        <a-form-item :label="item.title">
                                            <a-col :span="4" class="p-r-10" v-if="item.compareDict">
                                                <m-dict-select-tag
                                                        :dictCode="item.compareDict"
                                                        required :disabled="readonly"
                                                        v-model="item.compare"></m-dict-select-tag>
                                            </a-col>
                                            <a-col :span="item.compareDict?20:24">
                                                <multi v-slot="slotObj"
                                                       v-decorator="[item.field, item.required?validatorRules.requiredOnly:{}]"
                                                       :separator="item.separator"
                                                       v-if="item.multi">
                                                    <component :is="item.component" :disabled="readonly"
                                                               :value="slotObj.value" v-on="slotObj.on"
                                                               v-bind="item.param"></component>
                                                </multi>
                                                <component :is="item.component" :disabled="readonly"
                                                           v-decorator="[item.field, item.required?validatorRules.requiredOnly:{}]"
                                                           v-bind="item.param"
                                                v-else></component>
                                            </a-col>
                                        </a-form-item>
                                    </a-col>
                                </template>
                            </a-row>
                        </div>
                    </template>
                    <template v-if="judgeProps.length > 0">

                        <h3>判断条件</h3>
                        <div class="fieldset-box">
                            <template v-for="(item,index) in judgeProps">
                                <a-form-item :label="item.title" :wrapperCol="item.title?wrapperCol:{span:24}">
                                    <a-col :span="4" class="p-r-10" v-if="item.compareDict">
                                        <m-dict-select-tag
                                                :dictCode="item.compareDict"
                                                required :disabled="readonly"
                                                v-model="item.compare"></m-dict-select-tag>
                                    </a-col>
                                    <a-col :span="item.compareDict?20:24">
                                        <multi v-slot="slotObj"
                                               v-decorator="[item.field, item.required?validatorRules.requiredOnly:{}]"
                                               :separator="item.separator"
                                               v-if="item.multi">
                                            <component :is="item.component" :disabled="readonly"
                                                       :value="slotObj.value" v-on="slotObj.on"
                                                       v-bind="item.param"></component>
                                        </multi>
                                        <component :is="item.component" :disabled="readonly"
                                                   v-decorator="[item.field, item.required?validatorRules.requiredOnly:{}]"
                                                   v-bind="item.param"
                                                   v-else></component>
                                    </a-col>
                                </a-form-item>


                                <!--<a-form-item :label="item.title"
                                             v-bind="item.title && item.title!==''?{}:{labelCol:labelColNone,wrapperCol:wrapperColWhole}">
                                    <component :is="item.component" :disabled="readonly"
                                               v-decorator="[item.field, item.required?validatorRules.requiredOnly:{}]"
                                               v-bind="item.param"></component>

                                </a-form-item>-->
                            </template>
                        </div>
                    </template>
                </a-spin>
                <a-form-item label="所属地区">
                    <input-medical-other-dict placeholder="请选择所属地区"
                                              v-decorator="['ruleSourceCode', validatorRules.required]" dict="region"
                                              @select="([val]) => model.ruleSource = val && val.name || ''"
                                              :disable="readonly"></input-medical-other-dict>
                </a-form-item>
                <a-form-item label="政策依据">
                    <a-input placeholder="请输入政策依据" :readOnly="readonly"
                             v-decorator="['ruleBasis', validatorRules.required]"/>
                </a-form-item>
                <a-form-item label="提示信息">
                    <a-input placeholder="请输入提示信息" :readOnly="readonly"
                             v-decorator="['message', validatorRules.required]"/>
                </a-form-item>
                <a-form-item label="适用时间">
                    <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
                </a-form-item>
            </a-form>
        </a-spin>
        <div class="drawer-bottom fixed" v-show="visible">
            <a-button @click="handleCancel">关闭</a-button>
            <a-button type="primary" @click="handleOk" v-if="!readonly">确定</a-button>
        </div>

        <m-modal centered
                 title="选择收费项目信息"
                 width="80%"
                 :visible="selectVisible"
                 @ok="handleSelectOk"
                 @cancel="handleSelectClose"
                 cancelText="关闭">
            <select-medical-treat-project-equipment ref="selectRef" :selected="selectData" selectType="radio"
                                                    :fixedParam="{ state: '1' }"></select-medical-treat-project-equipment>
        </m-modal>
    </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"

  const SelectMedicalTreatProjectEquipment = () => import("@/pages/selectMulti/MedicalTreatProjectEquipment")

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  import FrequencyCompCharge2 from "@/pages/case/plugin/FrequencyCompCharge2"
  import ItemOrDiseaseGroup from "@/pages/case/plugin/ItemOrDiseaseGroup"
  import AgeCompMath from "@/pages/case/plugin/AgeCompMath2"
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  import inputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"

  import IndicationSetGroup from "@/pages/case/plugin/IndicationSetGroup"

  import Multi from '@/pages/selectInput/multi'

  export default {
    name: "MedicalDruguseModal",
    components: {
      MDictSelectTag,
      SelectMedicalTreatProjectEquipment,
      FrequencyCompCharge2,
      ItemOrDiseaseGroup,
      inputMedicalDrugGroup,
      AgeCompMath,
      OtherDictSelectTag,
      InputMedicalOtherDict,
      Multi,
      IndicationSetGroup

    },
    data() {
      this.actionToFreqMap = {
        /* '一次就诊': {value: '一次就诊', code: '1time'},
         '一日就诊': {value: '一日就诊', code: '1day'},
         '日均': {value: '日均次', code: 'avgday'},
         '一日': {value: '日均次', code: 'avgday'},
         '7天': {value: '7日内', code: '7day'},
         '一个月': {value: '一个月内', code: '1month'},
         '30天': {value: '一个月内', code: '1month'},
         '季度': {value: '三个月内', code: '3month'},
         '年': {value: '一年内', code: '1year'},*/
      }

      this.accessMap = {
        'freq': [{
          field: 'accessDiseaseGroup',
          component: 'inputMedicalDrugGroup',
          title: '疾病组',
          logic: 'AND',
          compare: '=',
          compareDict: 'EQ_NOT_COMPARE',
          param: { kind: '5', multi: true, separator: '|' },
          required: false,
          multiExt: false
        },
          {
            field: 'accessProjectGroup',
            component: 'inputMedicalDrugGroup',
            title: '项目组',
            logic: 'AND',
            compare: '=',
            compareDict: 'EQ_NOT_COMPARE',
            param: { kind: '1', multi: true, separator: '|' },
            required: false,
            multiExt: false
          }],
        'indication': [
          {
            field: 'accessSex',
            component: 'OtherDictSelectTag',
            title: '性别',
            logic: 'AND',
            compare: '=',
            param: { dictEname: 'sex' },
            required: false,
          },
          {
            field: 'accessAge',
            component: 'AgeCompMath',
            title: '年龄',
            logic: 'AND',
            compare: '=',
            param: {},
            required: false,
            multiExt: true  // 是否传入组件值为数组  [ext1, ext2]
          },

        ],
        'dept': [{
          field: 'accessHosplevel',
          component: 'InputMedicalOtherDict',
          title: '医院级别',
          logic: 'AND',
          compare: '=',
          param: { dict: 'HospLevel', multi: true, separator: '|' },
        },
          {
            field: 'accessOrgType',
            component: 'InputMedicalOtherDict',
            title: '医疗机构类型',
            logic: 'AND',
            compare: '=',
            param: { dict: 'Medical_Org_type', multi: true, separator: '|' },
            required: false,
          }],

      }
      this.judgeMap = {
        'freq': [{
          field: 'frequency',
          component: 'FrequencyCompCharge2',
          title: '请选择不合规行为',
          logic: 'AND',
          compare: '=',
          compareDict: 'COMMON_COMPARE',
          param: {},
          required: true,
          multiExt: true
        }],
        'age': [{
          field: 'age',
          component: 'AgeCompMath',
          title: '年龄',
          logic: 'AND',
          compare: '=',
          param: {},
          required: true,
          multiExt: true  // 是否传入组件值为数组  [ext1, ext2]
        }],
        'visittype': [{
          field: 'visittype',
          component: 'InputMedicalOtherDict',
          title: '就医方式',
          logic: 'AND',
          compare: '=',
          param: { dict: 'VisitType', multi: true, separator: '|' },
          required: true,
        }],
        'sex': [{
          field: 'sex',
          component: 'OtherDictSelectTag',
          title: '性别',
          logic: 'AND',
          compare: '=',
          param: { dictEname: 'sex' },
          required: true,
        }],
        'insurancetype': [{
          field: 'insurancetype',
          component: 'OtherDictSelectTag',
          title: '参保类型',
          logic: 'AND',
          compare: '=',
          param: { dictEname: 'medinsuranceType' },
          required: true,
        }],
        'hosplevel': [{
          field: 'hosplevel',
          component: 'InputMedicalOtherDict',
          title: '医院级别',
          logic: 'AND',
          compare: '=',
          param: { dict: 'HospLevel', multi: true, separator: '|' },
          required: false,
        },
          {
            field: 'orgType',
            component: 'InputMedicalOtherDict',
            title: '医疗机构类型',
            logic: 'AND',
            compare: '=',
            param: { dict: 'Medical_Org_type', multi: true, separator: '|' },
            required: false,
          }],
        'dept': [{
          field: 'dept',
          component: 'InputMedicalOtherDict',
          title: '科室',
          logic: 'AND',
          compare: '=',
          param: { dict: 'Department', multi: true, separator: '|' },
          required: true,
        }],
        'dayUnfitGroups': [{
          field: 'dayUnfitGroups',
          component: 'inputMedicalDrugGroup',
          title: '一日互斥项目组',
          logic: 'AND',
          compare: '=',
          param: { kind: '1', multi: false },
          required: true,
          multiExt: false,
          multi: true
        }],
        'unfitGroups': [{
          field: 'unfitGroups',
          component: 'inputMedicalDrugGroup',
          title: '互斥项目组',
          logic: 'AND',
          compare: '=',
          param: { kind: '1', multi: false },
          required: true,
          multiExt: false,
          multi: true
        }],
        'indication': [
          {
            field: 'indication',
            component: 'IndicationSetGroup',
            logic: 'AND',
            compare: '=',
            param: {  },
            required: true,
            multiExt: true,
            group: true
          }
        ],
        'fitGroups': [
          {
            field: 'fitTimeRange',
            component: 'MDictSelectTag',
            title: '时间范围',
            logic: 'AND',
            compare: '=',
            param: { dictCode: 'FIT_TIME_RANGE' },
            required: true,
          },
          {
            field: 'fitGroups',
            component: 'inputMedicalDrugGroup',
            title: '项目组',
            logic: 'AND',
            compare: '=',
            param: { kind: '1', multi: true, separator: '|' },
            required: true,
            multiExt: false,
            multi: true,
            separator: ','
          }
        ],
        'unExpense': [
          {
            field: 'unExpense',
            component: 'MDictSelectTag',
            title: '不能报销',
            logic: 'AND',
            compare: '=',
            param: { dictCode: 'YESNO', type: 'radio' },
            required: true,
          },
        ],
        'unCharge': [
          {
            field: 'unCharge',
            component: 'MDictSelectTag',
            title: '不能收费',
            logic: 'AND',
            compare: '=',
            param: { dictCode: 'YESNO', type: 'radio' },
            required: true,
          },
        ]
      }
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
          add: "/medical/medicalRuleConfig/add",
          edit: "/medical/medicalRuleConfig/edit",
          queryById: "/medical/medicalRuleConfig/queryById",
          queryConditionByRuleId: "/medical/medicalRuleConditionSet/queryByRuleId",
        },
        selectVisible: false,
        selectData: [],
        dateTimes: [undefined, undefined],
        conditionLoading: false,
        accessProps: [],
        judgeProps: []
      }
    },
    computed: {},
    watch: {},
    beforeMount() {
      this.confirmLoading = true
      this.$util.initDict('ACTION_TO_FREQ').then(data => {
        let obj = {}
        for (let item of data) {
          let [value, code] = item.value.split('_')
          obj[item.code] = { value, code }
        }
        this.actionToFreqMap = obj
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        let model = this.model = Object.assign({
          actionType: 'CHARGE', ruleType: 'CHARGE',
          startTime: '2000-01-01', endTime: '2099-12-31'
        }, record);
        this.dateTimes = [moment(model.startTime), moment(model.endTime)]
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(model, 'ruleId'
            , 'actionType', 'message', 'ruleSourceCode', 'ruleBasis', 'actionId', 'actionName'))
          let { itemCodes: code, itemNames: name } = model
          this.setSelectObj({ code, name })
          if (model.actionId) {
            this.actionSelect({ code: model.actionId, value: model.actionName })
          }

        });
        if (model.ruleId) {
          this.loadConditionData(model.ruleId)
        } else {
          this.accessProps = []
          this.judgeProps = []
        }
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
        this.conditionLoading = true
        getAction(this.url.queryConditionByRuleId, { ruleId }).then(res => {
          if (res.success) {
            let dataObj = {}
            res.result.forEach(r => {
              if(!dataObj[r.field]){
                dataObj[r.field] = []
              }
              dataObj[r.field].push(r)
            })
            let obj = {}
            for (let item of [...this.accessProps, ...this.judgeProps]) {
              let record = dataObj[item.field]
              if (record) {
                if(item.group){
                  obj[item.field] = record
                } else if (item.multiExt) {
                  record = record[0]
                  let extKeys = Object.keys(record).filter(r => r.startsWith('ext')).map(r => parseInt(r.substring(3)))
                  extKeys.sort((a, b) => a - b > 0? 1: -1)
                  obj[item.field] = extKeys.map(r => record['ext' + r])
                } else {
                  record = record[0]
                  obj[item.field] = record.ext1
                }
                item.logic = record.logic
                item.compare = record.compare
              } else {
                item.logic = 'AND'
                item.compare = '='
                obj[item.field] = undefined
              }
            }
            console.log('obj', obj)
            this.form.setFieldsValue(obj)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.conditionLoading = false
        })
      },
      actionSelect({ code, value }) {
        this.model.actionName = value
        if (!value) {
          return
        }

        let propIndex = code.match(/.[0-9]+/).index + 1
        let propName = code.substring(0, propIndex)
        console.log(code, propName, propIndex)

        this.accessProps = this.accessMap[propName] || []
        this.judgeProps = this.judgeMap[propName] || []

        if (propName === 'freq') {
          let freqItem
          for (let key in this.actionToFreqMap) {
            if (value.indexOf(key) > -1) {
              freqItem = this.actionToFreqMap[key]
              break;
            }
          }


          let item = this.judgeProps.find(r => r.field === 'frequency')
          item.title = freqItem.value
          item.param.period = freqItem.code

        } else if (propName === 'age') {

        }


      }
      ,
      close() {
        this.$emit('close');
        this.visible = false;
      }
      ,
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            try {
              let httpurl = '';
              let method = '';
              if (!this.model.ruleId) {
                httpurl += this.url.add;
                method = 'post';
              } else {
                httpurl += this.url.edit;
                method = 'put';
              }
              let formData = Object.assign({}, this.model, values);

              let accessConditions = []
              for (let [index, item] of this.accessProps.entries()) {
                let val = values[item.field]
                if (val) {
                  let obj = {
                    field: item.field,
                    logic: item.logic,
                    compare: item.compare || '=',
                    orderNo: 0,
                    groupNo: index
                  }
                  if (!Array.isArray(val)) {
                    val = [val]
                  }
                  val.forEach((r, i) => {
                    obj['ext' + (i + 1)] = r
                  })

                  accessConditions.push(obj)
                  delete formData[item.field]
                }
              }

              let judgeConditions = []
              for (let [index, item] of this.judgeProps.entries()) {
                let val = values[item.field]
                if (val) {
                  let obj = {
                    field: item.field,
                    logic: item.logic,
                    compare: item.compare || '=',
                    orderNo: 0,
                    groupNo: index
                  }

                  if(item.group){
                    val.forEach((r1, i) => {
                      judgeConditions.push({...obj, ...r1, orderNo: i})
                    })

                  } else {
                    if (!Array.isArray(val)) {
                      val = [val]
                    }
                    val.forEach((r, i) => {
                      obj['ext' + (i + 1)] = r
                    })
                    judgeConditions.push(obj)
                  }

                  delete formData[item.field]
                }
              }

              formData.accessConditions = accessConditions
              formData.judgeConditions = judgeConditions
              formData.startTime = this.dateTimes[0].format("YYYY-MM-DD");
              formData.endTime = this.dateTimes[1].format("YYYY-MM-DD");
              console.log(formData)
              // return
              that.confirmLoading = true;
              httpAction(httpurl, formData, method).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit('ok');
                } else {
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
                that.close();
              })
            } catch (e) {
              console.error(e)
            }
          }
        })
      }
      ,
      handleCancel() {
        this.close()
      }
      ,
      handleSelectOk() {
        let selectData = this.$refs.selectRef.getSelect()
        if (selectData.length > 0) {
          this.setSelectObj(selectData[0])
        }
        this.handleSelectClose()
      }
      ,
      handleSelectClose() {
        this.selectVisible = false
      }
      ,
      setSelectObj(obj) {
        if (obj.code && obj.code.length > 0) {
          this.selectData = [obj]
        } else {
          this.selectData = []
        }
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
