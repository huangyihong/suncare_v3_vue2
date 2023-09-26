<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible">
    <a-spin :spinning="confirmLoading">
      <div>
        <span>已选项目列表</span>
        <span style="margin-bottom: 5px;float: right">
          <a-button @click="selectType = 'ATC';selectVisible = true" type="primary">ATC分类</a-button>
          <a-button @click="selectType = 'DRUG';selectVisible = true" type="primary" class="m-l-6">药品信息</a-button>
        </span>
      </div>
      <a-table
        size="small"
        :pagination="false"
        :columns="[{title: '药品名称',dataIndex: 'name',width: '50%'},
        {title: '药品编码',dataIndex: 'code',width: '30%'},
        {title: '类别',dataIndex: 'type',width: '10%',scopedSlots: { customRender: 'type' }},
        {title: '操作',scopedSlots: { customRender: 'action' }}]"
        :dataSource="selectData">
          <span slot="type" slot-scope="text, record, index">
            {{text === 'ATC'? 'ATC':'药品'}}
          </span>
        <a slot="action" slot-scope="text, record, index" @click="selectData.splice(index, 1)">
          移除
        </a>
      </a-table>
      <a-form style="margin-top: 20px" v-bind="formItemLayout" :form="form">
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
                      <input-medical-std-atc :placeholder="'请选择' + item.name"
                                             v-else-if="item.stdAtc"
                                             v-decorator="[item.field, validatorRules.required]"
                                             :separator="item.separator"
                                             :multi="item.multi" showKey>

                      </input-medical-std-atc>
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
          label="规则来源" v-bind="commonLayout">
          <a-input placeholder="请输入规则来源" v-decorator="['ruleSource', {}]"/>
        </a-form-item>
        <a-form-item
          label="政策依据" v-bind="commonLayout">
          <a-input placeholder="请输入政策依据" v-decorator="['ruleBasis', {}]"/>
        </a-form-item>
        <a-form-item
          label="医嘱信息" v-bind="commonLayout">
          <a-input placeholder="请输入医嘱信息" v-decorator="['docAdvice', {}]"/>
        </a-form-item>
     <!--   <a-form-item label="不合规行为" v-bind="commonLayout"
                     extra="根据限定范围自动生成">
          <a-input placeholder="根据限定范围自动生成" :value="model.actionName" readOnly/>
          &lt;!&ndash;<m-dict-select-tag-edit dictCode="ACTION_LIST" v-decorator="['actionId',validatorRules.required]">
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
             :title="`选择${selectInfo.name}`"
             width="80%"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             cancelText="关闭">
      <!--<select-medical-drug ref="selectRef" :selected="selectData"></select-medical-drug>-->
      <!--<select-other-dict ref="selectRef" :selected="selectData" :fixedParam="otherDictFilters"></select-other-dict>-->
      <component ref="selectRef"
                 :is="selectInfo.component"
                 v-bind="selectInfo.params"
                 :selected="selectInfoData"></component>
    </m-modal>
  </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import { queryDistinctDictByKinds } from '@/api-sv3/api-medical'
  import pick from 'lodash/pick'
  import moment from 'moment'

  moment.locale('zh-cn')
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"

  import SelectMedicalDrug from "@/pages/selectMulti/MedicalDrug"
  import SelectOtherDict from "@/pages/selectMulti/MedicalOtherDict"
  import MedicalDrug from "@/pages/selectMulti/MedicalDrug"
  import MedicalStdAtc from "@/pages/selectMulti/MedicalStdAtc"

  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"
  import AgeComp from "@/pages/case/plugin/AgeComp"
  import YesOrNoTextComp from "@/pages/case/plugin/YesOrNoTextComp"
  import TestResult from "@/pages/case/plugin/TestResult"
  import { drugLimitScope } from "@//pages/case/DrugRuleCommon"
  import InputMedicalStdAtc from "@/pages/selectInput/MedicalStdAtc"


  export default {
    name: "MedicalDrugRuleModal",
    components: {
      MDictSelectTag,
      MMultiSelectTag,
      SelectMedicalDrug,
      SelectOtherDict,
      MedicalDrug,
      InputMedicalOtherDict,
      InputMedicalDrugGroup,
      AgeComp,
      YesOrNoTextComp,
      InputMedicalStdAtc,
      MedicalStdAtc,
      TestResult,
    },
    data() {
      return {
        title: "操作",
        visible: false,
        selectVisible: false,
        model: {},
        commonParam: { ruleType: '1', actionType: 'DRUG' },
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
        commonLayout: {
          labelCol: { xs: { span: 24 }, sm: { span: 4 } },
          wrapperCol: { xs: { span: 24 }, sm: { span: 20 }, }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/medical/medicalDrugRule/saveMedicalDrugRule",
          edit: "/medical/medicalDrugRule/updateMedicalDrugRule",
          queryById: "/medical/medicalDrugRule/queryById",
        },
        limitGroup: drugLimitScope,
        kindDict: {},
        readonly: false,
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
        selectData: [],
        selectInfoData: [],
        dateTimes: [undefined,undefined]
      }
    },
    computed: {
      limitOptions() {
        return Array.from(this.limitGroup, item => item.name)
      }
    },
    watch: {
      selectType(val) {
        this.selectInfo = this.selectInfos[val]
        this.selectInfoData = this.selectData.filter(r => r.type === val)
      }
    },
    methods: {
      loadKindDict() {
        /*queryDistinctDictByKinds({ kinds: "4" }).then(res => {
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
        });*/
        //从项目分组、疾病分组、药品分组中取，治疗方式取自项目分组
        getAction('/config/medicalDrugGroup/queryGroupByKinds', { kinds: "1,5,7" }, 'get').then((res) => {
          if (res.success) {
            let data = res.result
            let obj = {}
            for (let i in data) {
              // 防止返回数据被格式化成数字格式
              obj[i.toString()] = Array.from(data[i], item => {
                return { code: item.groupCode, value: item.groupName }
              })
            }
            this.kindDict = Object.assign(this.kindDict, obj);
          } else {
            this.$message.warning(res.message);
          }
        });
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
        /* if (Object.keys(this.kindDict).length === 0) {
           this.loadKindDict()
         }*/
        this.form.resetFields();
        const model = this.model = { ...record, ...this.commonParam };
        this.dateTimes = [moment(record.startTime||'2000-01-01'), moment(record.endTime||'2099-12-31')]
        this.visible = true;
        // 选择项目列表
        if (model.drugCode && model.drugCode.length > 0) {
          let codes = model.drugCode.split(",")
          let names = model.drugNames.split(",")
          let types = model.drugTypes ? model.drugTypes.split(",") : new Array(codes.length).fill("ATC")
          this.selectData = codes.map((v, i) => ({
            name: names[i], code: v, type: types[i]
          }))
          this.selectInfoData = this.selectData.filter(r => r.type === this.selectType)
        } else {
          this.selectData = []
          this.selectInfoData = []
        }
        // 限定范围值
        // let switchItems = []
        let limitScopes = model.limitScope ? model.limitScope.split(",") : []
        for (let item of this.limitGroup) {
          let limitIndex = limitScopes.indexOf(item.code)
          if (limitIndex > -1) {
            let limit = model[item.field]
            item.switch = true
            if (item.group) {
              item.group = limit.split('|')
            } else {
              if (item.field === 'age') {
                limit = `${limit || '-1'}_${this.numBlankStrFormat(model.ageLow)},${this.numBlankStrFormat(model.ageHigh)}_${model.ageUnit || ''}_${model.ageLowCompare || ''},${model.ageHighCompare || ''}`
              } else if (item.field === 'testResult') {
                let testResultItemValue = `${model.testResultItemName}(${model.testResultItemCode})`
                limit = [model.testResultItemType, testResultItemValue,model.testResultValueType
                  ,model.testResultValue, model.testResultUnit].join('_')
              }
              item.value = model[item.field] = limit
            }
            // switchItems.push(item)
          } else {
            item.switch = false
            if (item.group) {
              item.group = ['']
            } else {
              item.value = ''
            }
          }
        }
        // switch = true的挪到第一位
        // this.limitGroup = this.limitGroup.filter(item => !item.switch)
        // this.limitGroup.unshift(...switchItems)
        let fields = ['ruleSource', 'ruleBasis', 'docAdvice', 'message', 'actionId']
        for (let item of this.limitGroup) {
          if (!item.group) {
            fields.push(item.field)
          }
        }

        this.$nextTick(() => {
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
              if (this.selectData.length === 0) {
                this.$notification.error({ message: '提示', description: '请选择药品' })
                return
              }
              // 构造提交表单
              let formData = Object.assign(this.model, values);
              formData.drugNames = this.selectData.map(v => v.name).join(",");
              formData.drugCode = this.selectData.map(v => v.code).join(",");
              formData.drugTypes = this.selectData.map(v => v.type).join(",");
              formData.startTime = that.dateTimes[0].format("YYYY-MM-DD");
              formData.endTime = that.dateTimes[1].format("YYYY-MM-DD");
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
                } else if (item.field === 'testResult') {
                  let [testResultItemType, testResultItemValue
                    ,testResultValueType,testResultValue,testResultUnit] = formData[item.field].split('_')
                  let charIndex = testResultItemValue.lastIndexOf('(')
                  let testResultItemName = testResultItemValue.substring(0,charIndex);
                  let testResultItemCode = testResultItemValue.substring(charIndex + 1,testResultItemValue.length - 1);
                  formData.testResultItemType = testResultItemType
                  formData.testResultItemCode = testResultItemCode
                  formData.testResultItemName = testResultItemName
                  formData.testResultValueType = testResultValueType
                  formData.testResultValue = testResultValue
                  formData.testResultUnit = testResultUnit
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
              console.log('formData', formData)
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
      },
      handleCancel() {
        this.close()
      },

      handleSelectOk() {
        this.selectInfoData = this.$refs.selectRef.getSelect()
        let type = this.selectType
        this.selectData = this.selectData.filter(r => r.type !== type)
        this.selectData.push(...this.selectInfoData.map(r => ({ ...r, type })))
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

</style>
