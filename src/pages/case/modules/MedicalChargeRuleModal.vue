<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-spin :spinning="confirmLoading">

      <div>
        <span>已选项目列表</span>
        <a-button @click="selectVisible=true" style="margin-bottom: 5px;float: right">选择</a-button>
      </div>
      <a-table
        size="small"
        :pagination="false"
        :columns="[{title: '收费项目',dataIndex: 'name',width: '70%'},
        {title: '项目编码',dataIndex: 'code',width: '30%'}]"
        :dataSource="selectData"
      ></a-table>
      <a-form style="margin-top: 20px" v-bind="formItemLayout" :form="form">
        <a-form-item
          label="收费分类" :labelCol="{xs: { span: 24 },sm: { span: 3 },}"
          :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
          <m-multi-select-tag placeholder="请选择(多选)" dictCode="BM_CFLB00"
                              v-decorator="['chargeTypes', {}]"></m-multi-select-tag>
        </a-form-item>
  <!--      <a-form-item
          label="数量/频次1" :labelCol="{xs: { span: 24 },sm: { span: 3 },}"
          :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
          <a-row :gutter="10">
            <a-col :span="6">
              <m-dict-select-tag placeholder="请选择" dictCode="FREQUENCY_PERIOD"
                                 v-decorator="['period', {}]"></m-dict-select-tag>
            </a-col>
            <a-col :span="8">
              <m-dict-select-tag placeholder="请选择" dictCode="COMMON_COMPARE"
                                 v-decorator="['compare', {}]"></m-dict-select-tag>
            </a-col>
            <a-col :span="8">
              <a-input placeholder="请输入" v-decorator="['frequency', {}]"></a-input>
            </a-col>
            <a-col :span="2">
              次
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          label="数量/频次2" :labelCol="{xs: { span: 24 },sm: { span: 3 },}"
          :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
          <a-row :gutter="10">
            <a-col :span="6">
              <m-dict-select-tag placeholder="请选择" dictCode="FREQUENCY_PERIOD"
                                 v-decorator="['twoPeriod', {}]"></m-dict-select-tag>
            </a-col>
            <a-col :span="8">
              <m-dict-select-tag placeholder="请选择" dictCode="COMMON_COMPARE"
                                 v-decorator="['twoCompare', {}]"></m-dict-select-tag>
            </a-col>
            <a-col :span="8">
              <a-input placeholder="请输入" v-decorator="['twoFrequency', {}]"></a-input>
            </a-col>
            <a-col :span="2">
              次
            </a-col>
          </a-row>
        </a-form-item>-->

        <h3>限定范围</h3>
        <div class="fieldset-box">
          <template v-for="(item,index) in limitGroup">
            <a-form-item :label="item.name">
              <a-row>
                <a-col :span="2">
                  <a-switch v-model="item.switch"></a-switch>
                </a-col>
                <a-col :span="22">
                  <a-row v-if="item.switch">
                  <span v-if="item.group">
                    <template v-for="(groupItem,groupIndex) in item.group">
                      <a-col :span="22" :key="groupIndex">
                    <!--    <m-multi-select-tag placeholder="请选择(多选)" :options="kindDict[item.kind]"
                                            v-model="item.group[groupIndex]" v-if="item.kind"></m-multi-select-tag>-->
                        <input-medical-drug-group v-model="item.group[groupIndex]" :kind="item.kind" v-if="item.kind"
                                                  showKey multi></input-medical-drug-group>
                        <m-multi-select-tag placeholder="请选择(多选)" :dictCode="item.dict"
                                            v-model="item.group[groupIndex]" v-else-if="item.dict"></m-multi-select-tag>
                        <input-medical-other-dict :placeholder="'请选择' + item.name"
                                                  v-else-if="item.oDict"
                                                  v-model="item.group[groupIndex]"
                                                  :dict="item.oDict"
                                                  :multi="item.multi" showKey>
                        </input-medical-other-dict>
                      </a-col>
                      <a-col :span="2" :key="groupIndex">
                        <span style="font-size: 30px;vertical-align: middle;margin-left: 5px">
                          <a-icon type="minus-square" theme="twoTone" @click="decLimitItem(index,groupIndex)"
                          ></a-icon>
                        </span>
                      </a-col>
                    </template>
                  </span>

                    <a-col :span="24" v-else>
                      <template v-if="item.component">
                        <component :is="item.component" v-decorator="[item.field, validatorRules.required]"
                                   v-bind="item.params||{}"></component>
                      </template>
                      <template v-else-if="item.input">
                        <a-input-number v-if="item.type=== 'number'"
                                        placeholder="请输入"
                                        v-decorator="[item.field, validatorRules.requiredOnly]"
                                        v-bind="item.param||{}" class="w-b-100"></a-input-number>
                        <a-input v-else
                                 placeholder="请输入"
                                 v-decorator="[item.field, validatorRules.required]"></a-input>
                      </template>

                      <template v-else-if="item.dict">
                        <m-multi-select-tag placeholder="请选择(多选)" v-if="item.multi" :dictCode="item.dict"
                                            :separator="item.separator"
                                            v-decorator="[item.field, validatorRules.required]"></m-multi-select-tag>
                        <m-dict-select-tag placeholder="请选择(单选)" v-else :dictCode="item.dict"
                                           v-decorator="[item.field, validatorRules.required]"
                                           required></m-dict-select-tag>
                      </template>
                      <input-medical-other-dict :placeholder="'请选择' + item.name"
                                                v-else-if="item.oDict"
                                                v-decorator="[item.field, validatorRules.required]"
                                                :dict="item.oDict"
                                                :separator="item.separator"
                                                :multi="item.multi" showKey>

                      </input-medical-other-dict>
                      <input-medical-drug-group :kind="item.kind" v-else-if="item.kind"
                                                v-decorator="[item.field, validatorRules.required]"
                                                :separator="item.separator"
                                                showKey multi></input-medical-drug-group>
                    </a-col>
                    <a-col :span="3" v-if="item.group">
                      <a-button @click="addLimitItem(index)">增加组</a-button>
                    </a-col>
                  </a-row>
                </a-col>


              </a-row>

            </a-form-item>

          </template>

        </div>
        <a-form-item
          label="规则来源" :labelCol="{xs: { span: 24 },sm: { span: 3 },}"
          :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
          <a-input placeholder="请输入规则来源" v-decorator="['ruleSource', {}]"/>
        </a-form-item>
        <a-form-item
          label="政策依据" :labelCol="{xs: { span: 24 },sm: { span: 3 },}"
          :wrapperCol="{xs: { span: 24 },sm: { span: 21 },}">
          <a-input placeholder="请输入政策依据" v-decorator="['ruleBasis', {}]"/>
        </a-form-item>
        <!--<a-form-item label="不合规行为" v-bind="commonLayout"
                     extra="根据限定范围自动生成">
          <a-input placeholder="根据限定范围自动生成" :value="model.actionName" readOnly/>
         &lt;!&ndash; <m-dict-select-tag-edit dictCode="ACTION_LIST" v-decorator="['actionId',validatorRules.required]">
          </m-dict-select-tag-edit>&ndash;&gt;
        </a-form-item>
        <a-form-item label="不合规行为类型" v-bind="commonLayout">
          <m-dict-select-tag-edit dictCode="ACTION_TYPE" v-decorator="['actionType',validatorRules.required]">
          </m-dict-select-tag-edit>
        </a-form-item>-->
        <a-form-item
          label="提示信息" v-bind="commonLayout">
          <a-textarea
            placeholder="请输入提示信息"
            v-decorator="['message', {}]"
            :autoSize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item
          label="数据时间" v-bind="commonLayout">
          <a-range-picker v-model="dateTimes" :allowClear="false"/>
        </a-form-item>

      </a-form>
    </a-spin>
    <div class="drawer-bottom" v-if="!readonly">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk" :loading="confirmLoading">确定</a-button>
    </div>
    <m-modal centered
             title="选择收费项目信息"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <!--<select-medical-treat-project ref="selectRef" :selected="selectData"></select-medical-treat-project>-->
      <select-medical-treat-project-equipment ref="selectRef" :selected="selectData"
                                              :fixedParam="selectModalFilters"></select-medical-treat-project-equipment>
    </m-modal>

  </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import { queryDistinctDictByKinds } from '@/api-sv3/api-medical'
  import pick from 'lodash/pick'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"

  import SelectMedicalTreatProject from "@/pages/selectMulti/MedicalTreatProject"
  import SelectMedicalTreatProjectEquipment from "@/pages/selectMulti/MedicalTreatProjectEquipment"
  import InputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  // import InputMedicalTreatProjectEquipment from "@/pages/selectInput/MedicalTreatProjectEquipment.vue"
  import InputMedicalOrg from "@/pages/selectInput/MedicalOrg"
  import AgeComp from "@/pages/case/plugin/AgeComp"
  import PayDuration from "@/pages/case/plugin/PayDuration"
  import CountComp from "@/pages/case/plugin/CountComp"
  import YesOrNoTextComp from "@/pages/case/plugin/YesOrNoTextComp"
  import DiseasegroupFreq from "@/pages/case/plugin/DiseasegroupFreq"
  import FrequencyComp from "@/pages/case/plugin/FrequencyComp"
  import { chargeLimitScope } from "@//pages/case/DrugRuleCommon"
  import moment from 'moment'

  moment.locale('zh-cn')
  export default {
    name: "MedicalDrugRuleModal",
    components: {
      MDictSelectTag,
      MMultiSelectTag,
      SelectMedicalTreatProject,
      SelectMedicalTreatProjectEquipment,
      InputMedicalDrugGroup,
      InputMedicalOtherDict,
      InputMedicalOrg,
      // InputMedicalTreatProjectEquipment,
      AgeComp,
      PayDuration,
      CountComp,
      YesOrNoTextComp,
      DiseasegroupFreq,
      FrequencyComp
    },
    data() {
      return {
        title: "操作",
        visible: false,
        selectVisible: false,
        model: {},
        commonParam: { ruleType: '2', actionType: 'CHARGE' },
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
        /*   formItemLayoutHalf: {
             labelCol: {
               xs: { span: 24 },
               sm: { span: 8 },
             },
             wrapperCol: {
               xs: { span: 24 },
               sm: { span: 16 },
             },
           },*/
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/medical/medicalDrugRule/saveMedicalDrugRule",
          edit: "/medical/medicalDrugRule/updateMedicalDrugRule",
          queryById: "/medical/medicalDrugRule/queryById",

        },

        selectData: [],
        limitGroup: chargeLimitScope,
        kindDict: {},
        selectModalFilters: { state: '1' },
        dateTimes: [undefined,undefined]
      }
    },
    beforeMount() {
      // this.loadKindDict()
    },
    computed: {
      limitOptions() {
        return Array.from(this.limitGroup, item => item.name)
      }
    },
    methods: {
      loadKindDict() {
        queryDistinctDictByKinds({ kinds: "1,2,4,5,7" }).then(res => {
          if (res.success) {
            let data = res.result
            let obj = {}
            for (let i in data) {
              // 防止返回数据被格式化成数字格式
              obj[i.toString()] = Array.from(data[i], item => {
                return { code: item.groupCode, value: item.groupName }
              })
            }
            this.kindDict = obj
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      addLimitItem(index) {
        let item = this.limitGroup[index]
        item.group.push('')
      },
      decLimitItem(index, groupIndex) {
        let item = this.limitGroup[index]
        item.group.splice(groupIndex, 1)
      },
      add(record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.ruleId
        } else {
          newRecord = {}
        }
        this.edit(newRecord);
      },

      edit(record) {
        const model = this.model = {...record, ...this.commonParam};
        this.dateTimes = [moment(record.startTime||'2000-01-01'), moment(record.endTime||'2099-12-31')]
        this.visible = true;
        // 选择项目列表
        if (model.chargeItemCodes && model.chargeItemCodes.length > 0) {
          let codes = model.chargeItemCodes.split(",")
          let names = model.chargeItems.split(",")
          this.selectData = codes.map((v, i) => {
            return { name: names[i], code: v }
          })
        } else {
          this.selectData = []
        }
        // 限定范围值
        // let switchItems = []
        let limitScopes = model.limitScope ? model.limitScope.split(",") : []
        for (let item of this.limitGroup) {
          let limitIndex = limitScopes.indexOf(item.code)
          if (limitIndex > -1) {
            item.switch = true
            let limit = model[item.field]
            if (item.group) {
              item.group = limit.split('|')
            } else {
              if (item.field === 'age') {
                console.log('limit', limit)
                limit = `${limit || '-1'}_${this.numBlankStrFormat(model.ageLow)},${this.numBlankStrFormat(model.ageHigh)}_${model.ageUnit || ''}_${model.ageLowCompare || ''},${model.ageHighCompare || ''}`
                model.age = limit
              } else if (item.field === 'payDuration') {
                limit = `${model.payDurationPeriod || ''}-${limit}-${model.payDurationUnit || ''}`
                model.payDuration = limit
              } else if (item.field === 'count') {
                limit = `${model.countPeriod || ''}-${limit}`
                model.count = limit
              } else if (item.field === 'diseasegroupFreq') {
                limit = `${limit || '='}-${model.diseasegroupCodes || ''}`
                model.diseasegroupFreq = limit
              } else if (item.field === 'frequency') {
                limit = `${model.period || ''}_${model.compare || ''}_${model.frequency || ''}_${model.twoPeriod || ''}_${model.twoCompare || ''}_${model.twoFrequency || ''}`
                model.frequency = limit
              }
              item.value = limit
            }
            // switchItems.push(item)
          } else {
            item.switch = false
            if (item.group) {
              item.group = ['']
            }
          }
        }
        // switch = true的挪到第一位
        // this.limitGroup = this.limitGroup.filter(item => !item.switch)
        // this.limitGroup.unshift(...switchItems)
        let fields = ['chargeTypes','ruleSource','ruleBasis', 'message', 'actionId']
        for (let item of this.limitGroup) {
          if (!item.group) {
            fields.push(item.field)
          }
        }

        this.$nextTick(() => {
          this.form.resetFields();
          this.form.setFieldsValue(pick(model, fields))
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
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            let httpurl = '';
            let method = '';
            if (!this.model.ruleId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            console.log('values', values)
            // 构造提交表单
            let formData = Object.assign(this.model, values);
            formData.chargeItems = this.selectData.map(v => v.name).join(",");
            formData.chargeItemCodes = this.selectData.map(v => v.code).join(",");

            if (formData.frequency !== '1') {
              if (this.selectData.length + (formData.chargeTypes && formData.chargeTypes.length > 0 ? formData.chargeTypes.split(",").length : 0) > 1) {
                this.$notification.error({ message: '提示', description: "多个收费项目、收费分类仅支持数量/频次1为1次" });
                return;
              }
            }

            if (formData.twoFrequency !== '1') {
              if (this.selectData.length + (formData.chargeTypes && formData.chargeTypes.length > 0 ? formData.chargeTypes.split(",").length : 0) > 1) {
                this.$notification.error({ message: '提示', description: "多个收费项目、收费分类仅支持数量/频次2为1次" });
                return;
              }
            }

            let limitScope = []
            for (let item of this.limitGroup) {
              if (!item.switch) {
                if (item.field === 'age') {
                  formData.age = ''
                  formData.ageLow = -1
                  formData.ageHigh = -1
                  formData.ageLowCompare = ''
                  formData.ageHighCompare = ''
                  formData.ageUnit = ''
                } else if (item.field === 'payDuration') {
                  formData.payDurationPeriod = ''
                  formData.payDuration = -1
                  formData.payDurationUnit = ''
                } else if (item.field === 'count') {
                  formData.countPeriod = ''
                  formData.count = -1
                } else if (item.field === 'diseasegroupFreq') {
                  formData.diseasegroupFreq = ''
                  formData.diseasegroupCodes = ''
                } else if(item.field === 'frequency') {
                  formData.period = ''
                  formData.compare = ''
                  formData.frequency = ''
                  formData.twoPeriod = ''
                  formData.twoCompare = ''
                  formData.twoFrequency = ''
                } else {
                  formData[item.field] = ''
                }
                continue
              }
              if (item.field === 'age') {
                let [age, ageRange, ageUnit, ageCompare] = formData[item.field].split('_')
                let [ageLow, ageHigh] = ageRange.split(',')
                let [ageLowCompare, ageHighCompare] = ageCompare.split(',')
                formData.age = age
                formData.ageLow = ageLow
                formData.ageHigh = ageHigh
                formData.ageLowCompare = ageLowCompare
                formData.ageHighCompare = ageHighCompare
                formData.ageUnit = ageUnit
              } else if (item.field === 'payDuration') {
                let [v1, v2, v3] = formData[item.field].split('-')
                formData.payDurationPeriod = v1
                formData.payDuration = parseInt(v2)
                formData.payDurationUnit = v3
              } else if (item.field === 'count') {
                let [v1, v2] = formData[item.field].split('-')
                formData.countPeriod = v1
                formData.count = parseInt(v2)
              } else if (item.field === 'diseasegroupFreq') {
                let [v1, v2] = formData[item.field].split('-')
                formData.diseasegroupFreq = v1
                formData.diseasegroupCodes = v2
              } else if (item.field === 'frequency') {
                let [period, compare,frequency,period2,compare2,frequency2] = formData[item.field].split('_')
                formData.period = period
                formData.compare = compare
                formData.frequency = frequency
                formData.twoPeriod = period2
                formData.twoCompare = compare2
                formData.twoFrequency = frequency2
              }
              if (item.group) {
                let values = []
                for (let groupItem of item.group) {
                  if (groupItem !== undefined && groupItem != null && groupItem.length > 0) {
                    values.push(groupItem)
                  }
                }
                if (values.length > 0) {
                  let valueArray = values.map(v => v.split(",")).flat()
                  let valueArraySet = new Set(valueArray)
                  if (valueArray.length > valueArraySet.size) {
                    this.$notification.error({ message: '提示', description: `【${item.name}】组之间选择项重复` })
                    return
                  }
                  formData[item.field] = values.join("|")
                  limitScope.push(item.code)
                } else {
                  this.$notification.error({ message: '提示', description: `【${item.name}】组选择项不能为空` })
                  return
                }
              } else {
                /*let value = formData[item.field]
               if(value === undefined || value === null || value.length === 0) {
                 delete formData[item.field]
                 continue
               }*/
                limitScope.push(item.code)
              }
            }
            if (limitScope.length > 0) {
              formData.limitScope = limitScope.join(",")
            } else {
              this.$notification.error({ message: '提示', description: '请选择限定范围' })
              return
            }
            formData.startTime = that.dateTimes[0].format("YYYY-MM-DD");
            formData.endTime = that.dateTimes[1].format("YYYY-MM-DD");
            console.log('formData', formData)
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


          }
        })
      },
      handleCancel() {
        this.close()
      },
      handleSelectOk() {
        this.selectData = this.$refs.selectRef.getSelect()
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      numBlankStrFormat(val) {
        return val !== undefined && val !== null ? val : ''
      }
    }
  }
</script>

<style lang="less" scoped>
  /** Button按钮间距 */
  .bottom-area {
    margin-top: 30px;

    .ant-btn {
      margin: 0 30px 30px 0;
      float: right;
    }
  }
</style>
