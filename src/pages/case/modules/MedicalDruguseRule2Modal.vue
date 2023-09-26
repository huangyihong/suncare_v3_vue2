<template>
  <a-drawer
    :title="title"
    :width="'90%'"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
  >

    <!-- <a-row type="flex">
         <a-col flex="100px">100px</a-col>
         <a-col flex="auto">auto</a-col>
     </a-row>-->
    <a-row :gutter="24" v-bind="grid > 5?{style:{display: 'flex'}}:{}">
      <a-col v-bind="grid > 5?{style:{flex: 'auto'},class: 'drawer-scroll'}:{lg: 12}">
        <!--<druguse-instruction :selectData="selectData"></druguse-instruction>-->
        <druguse-instruction :selectData="selectData" @loaded="len => instructionNum=len"></druguse-instruction>
      </a-col>
      <a-col v-bind="grid > 5?{style:{flex: '0 0 750px'},class: 'drawer-scroll'}:{class: 'm-t-10', lg: 12}"
             style="position: initial">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-row :gutter="8">
                  <a-col :span="24" v-if="isAdd">
                    <at-table
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
                    </at-table>
                  </a-col>
                  <template v-else>
                    <a-col :md="9" :xs="24">
                        <a-form-item
                                :labelCol="labelColHalf"
                                :wrapperCol="wrapperColHalf"
                                label="药品编码">
                            <a-input placeholder="请选择" readOnly
                                     v-decorator="['itemCodes',validatorRules.required]"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="9" :xs="24">
                        <a-form-item
                                :labelCol="labelColHalf"
                                :wrapperCol="wrapperColHalf"
                                label="药品名称">
                            <a-input placeholder="请选择" readOnly
                                     v-decorator="['itemNames',validatorRules.required]"></a-input>
                        </a-form-item>
                    </a-col>
                  </template>
                    <a-col class="t-r"
                           v-bind="isAdd?{span: 24, class: ['m-t-6']}: {md: 6,xs: 24}"
                           v-if="!disableSubmit">
                        <a-form-item :wrapperCol="{span:24}">
                            <a-button @click="openSelect('ATC')" :type="selectType === 'ATC'?'primary': undefined">ATC</a-button>
                            <a-button @click="openSelect('DRUG')" :type="selectType === 'DRUG'?'primary': undefined" class="m-l-6">药品</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="规则类别">
                    <m-dict-select-tag :dictCode="ruleLimitDictCode" :disabled="disableSubmit"
                                       v-decorator="['ruleLimit', validatorRules.required]"
                                       @select="limitSelect" search></m-dict-select-tag>
                </a-form-item>
                <a-row :gutter="8">
                  <a-col :md="12" :xs="24">
                    <a-form-item
                      :labelCol="labelColHalf"
                      :wrapperCol="wrapperColHalf"
                      label="规则级别">
                      <a-select placeholder="请选择规则级别" v-decorator="['ruleGrade', {}]" :readOnly="disableSubmit" :disabled="disableSubmit">
                        <a-select-option value="">请选择</a-select-option>
                        <a-select-option value="1级">1级</a-select-option>
                        <a-select-option value="2级">2级</a-select-option>
                        <a-select-option value="3级">3级</a-select-option>
                      </a-select>

                    </a-form-item>
                  </a-col>
                  <a-col :md="12" :xs="24">
                    <a-form-item
                      :labelCol="labelColHalf"
                      :wrapperCol="wrapperColHalf"
                      label="级别备注">
                      <a-input placeholder="请输入级别备注" v-decorator="['ruleGradeRemark',{}]" :readOnly="disableSubmit"></a-input>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-spin :spinning="conditionLoading">
                    <template v-if="accessProps.length > 0">
                        <h3>准入条件</h3>
                        <div class="fieldset-box">
                            <a-row :gutter="12">
                                <template v-for="(item,index) in accessProps">
                                    <a-col :span="3">
                                        <m-dict-select-tag dictCode="CASE_RELATION_CHAR" v-if="index > 0"
                                                           required :disabled="disableSubmit"
                                                           v-model="item.logic"></m-dict-select-tag>
                                    </a-col>
                                    <a-col :span="21">
                                        <a-form-item :label="item.title">
                                            <a-col :span="4" class="p-r-10" v-if="item.compareDict">
                                                <m-dict-select-tag
                                                        :dictCode="item.compareDict"
                                                        required :disabled="disableSubmit"
                                                        v-model="item.compare"
                                                        v-on="item.compareChange?{change: val => item.compareChange(val)}:{}"
                                                ></m-dict-select-tag>
                                            </a-col>
                                            <a-col :span="item.compareDict?20:24">
                                                <multi v-slot="slotObj"
                                                       v-decorator="[item.field, item.required?item.requiredRule||validatorRules.requiredOnly:{}]"
                                                       :separator="item.separator"  v-bind="item.multiParam || {}"
                                                       v-if="item.multi">
                                                    <component :is="item.component" :disabled="disableSubmit" :readonly="disableSubmit" :disable="disableSubmit"
                                                               :value="slotObj.value" v-on="slotObj.on"
                                                               v-bind="item.param"></component>
                                                </multi>
                                                <component :is="item.component" :disabled="disableSubmit" :readonly="disableSubmit" :disable="disableSubmit"
                                                           v-decorator="[item.field, item.required?item.requiredRule||validatorRules.requiredOnly:{}]"
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
                                                required :disabled="disableSubmit"
                                                v-model="item.compare"></m-dict-select-tag>
                                    </a-col>
                                    <a-col :span="item.compareDict?20:24">
                                        <multi v-slot="slotObj"
                                               v-decorator="[item.field, item.required?item.requiredRule||validatorRules.requiredOnly:{}]"
                                               :separator="item.separator" v-bind="item.multiParam || {}"
                                               v-if="item.multi">
                                            <component :is="item.component" :disabled="disableSubmit" :readonly="disableSubmit" :disable="disableSubmit"
                                                       :value="slotObj.value" v-on="slotObj.on"
                                                       v-bind="item.param"></component>
                                        </multi>
                                        <component :is="item.component" :disabled="disableSubmit" :readonly="disableSubmit" :disable="disableSubmit"
                                                   v-decorator="[item.field, item.required?item.requiredRule||validatorRules.requiredOnly:{}]"
                                                   v-bind="item.param"
                                                   v-else></component>
                                    </a-col>
                                </a-form-item>


                                <!--<a-form-item :label="item.title"
                                             v-bind="item.title && item.title!==''?{}:{labelCol:labelColNone,wrapperCol:wrapperColWhole}">
                                    <component :is="item.component" :disabled="disableSubmit"
                                               v-decorator="[item.field, item.required?validatorRules.requiredOnly:{}]"
                                               v-bind="item.param"></component>

                                </a-form-item>-->
                            </template>
                        </div>
                    </template>
                </a-spin>
                <a-form-item label="不合规行为">
                    <input-medical-action-dict v-decorator="['actionId',validatorRules.required]"
                                               @select="([val]) => model.actionName = val && val.name || '' " hideButton>
                    </input-medical-action-dict>
                    <!--<m-dict-select-tag-edit dictCode="ACTION_LIST"
                                            v-decorator="['actionId',validatorRules.required]"
                                            @select="r => model.actionName = r.value "
                                            autoIncrease search></m-dict-select-tag-edit>-->
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="政策依据类别">
                    <other-dict-select-tag placeholder="请选择" :disabled="disableSubmit"
                                           v-decorator="['ruleBasisType', validatorRules.required]" dictEname="rule_sourcetype"/>
                </a-form-item>
                <a-form-item label="政策依据">
                    <a-input placeholder="请输入政策依据" :readOnly="disableSubmit"
                             v-decorator="['ruleBasis', validatorRules.required]"/>
                </a-form-item>
                <a-form-item label="所属地区">
                    <input-medical-other-dict placeholder="请选择所属地区"
                                              v-decorator="['ruleSourceCode', validatorRules.required]" dict="region"
                                              @select="([val]) => model.ruleSource = val && val.name || ''"
                                              :disable="disableSubmit"></input-medical-other-dict>
                </a-form-item>
                <a-form-item label="提示信息">
                    <a-input placeholder="请输入提示信息" :readOnly="disableSubmit"
                             v-decorator="['message', validatorRules.required]"/>
                </a-form-item>
                <a-form-item label="适用时间">
                    <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="disableSubmit"/>
                </a-form-item>
                <template v-if="!model.ruleId">
                  <a-form-item label="新增时间">
                    <a-input  v-decorator="['createTime', {}]" readOnly/>
                  </a-form-item>
                  <a-form-item label="新增人">
                    <a-input v-decorator="['createUsername', {}]" readOnly/>
                  </a-form-item>
                </template>
                <a-form-item label="操作原因">
                  <a-input placeholder="请输入操作原因" :readOnly="disableSubmit"
                           v-decorator="['updateReason', {}]"/>
                </a-form-item>
                <template v-if="model.ruleId">
                  <a-form-item label="修改时间">
                    <a-input v-decorator="['updateTime', {}]" readOnly/>
                  </a-form-item>
                  <a-form-item label="修改人">
                    <a-input v-decorator="['updateUsername', {}]" readOnly/>
                  </a-form-item>
                </template>
            </a-form>
        </a-spin>
        <div class="drawer-bottom fixed" v-show="visible">
            <a-button @click="handleCancel">关闭</a-button>
            <a-button type="primary" @click="handleOk" v-if="!disableSubmit">确定</a-button>
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
            <component ref="selectRef" :selectType="isAdd?undefined: 'radio'"
                       :is="selectInfo.component" v-bind="selectInfo.params"></component>
        </m-modal>

    </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MedicalDrug from "@/pages/selectMulti/MedicalDrug"
  import MedicalStdAtc from "@/pages/selectMulti/MedicalStdAtc"

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  import AgeCompMath from "@/pages/case/plugin/AgeCompMath2"
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'

  import IndicationSetGroup from "@/pages/case/plugin/IndicationSetGroup"

  import Multi from '@/pages/selectInput/multi'
  import DruguseInstruction from "@/pages/case/plugin/DruguseInstruction"
  import { mapGetters } from 'vuex'
  export default {
    name: "MedicalDrugModal",
    components: {
      MedicalDrug,
      MedicalStdAtc,
      MDictSelectTag,
      AgeCompMath,
      OtherDictSelectTag,
      InputMedicalOtherDict,
      Multi,
      IndicationSetGroup,
      InputMedicalActionDict,
      DruguseInstruction,
    },
    data() {
      this.ruleLimitDictCode = 'RULE_LIMIT_DRUGUSE'
      this.ruleType = 'DRUGUSE'
      this.selectInfos = {
        'ATC': {
          name: 'ATC分类',
            component: 'MedicalStdAtc',
            params: { fixedParam: { state: '1' } },
        },
        'DRUG': {
          name: '药品信息',
            component: 'MedicalDrug',
            params: { fixedParam: { state: '1' } },
        }
      }
      this.accessMap = {
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
      }
      this.judgeMap = {
        'indication': [
          {
            field: 'reviewHisDisease',
            component: 'MDictSelectTag',
            title: '是否审核历史疾病',
            logic: 'AND',
            compare: '=',
            param: { dictCode: 'YESNO', type: 'radio' },
            required: true,
          },
          {
            field: 'excludeInHosp',
            component: 'MDictSelectTag',
            title: '是否排除住院数据',
            logic: 'AND',
            compare: '=',
            param: { dictCode: 'YESNO', type: 'radio' },
            required: false,
          },
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

      }
      return {
        title: "操作",
        visible: false,
        disableSubmit: false,
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
          addBatch: "/medical/medicalRuleConfig/addBatch",
          edit: "/medical/medicalRuleConfig/edit",
          queryById: "/medical/medicalRuleConfig/queryById",
          queryConditionByRuleId: "/medical/medicalRuleConditionSet/queryByRuleId",
        },
        selectVisible: false,
        // selectItem: {},
        dateTimes: [undefined, undefined],
        conditionLoading: false,
        accessProps: [],
        judgeProps: [],
        selectType: 'ATC',
        isAdd: false,
        selectData: []
      }
    },
    computed: {
      selectInfo(){
        return this.selectInfos[this.selectType]
      },
      grid() {
        return this.$store.getters.grid
      },
    },
    watch: {},
    beforeMount() {
      //当前用户信息
      this.userInfoBean = this.userInfo()

      this.confirmLoading = true
      this.$util.initDict([this.ruleLimitDictCode]).then(data => {
        this.ruleLimitMap = data[this.ruleLimitDictCode].reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
        if(this.afterDictLoad){
          this.afterDictLoad()
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    methods: {
      ...mapGetters(["userInfo"]),
      //设置新增字段信息
      setCreateField(record){
        record.createUsername = this.userInfoBean.realname;
        record.createUser = this.userInfoBean.id;
        record.createTime = new Date();
        return record;
      },
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        let model = this.model = Object.assign({
          actionType: this.ruleType, ruleType: this.ruleType,
          startTime: '2000-01-01', endTime: '2099-12-31'
        }, record);
        if(!model.ruleId){
          model = this.setCreateField(model)
        }
        this.dateTimes = [moment(model.startTime), moment(model.endTime)]
        this.visible = true;
        this.isAdd = !record.ruleId

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(model, 'ruleId'
            , 'actionType', 'message', 'ruleSourceCode','ruleBasisType', 'ruleBasis'
            , 'actionId', 'actionName', 'ruleLimit','createUsername','updateUsername','updateReason','ruleGrade','ruleGradeRemark'))
          //时间格式化
          this.form.setFieldsValue({createTime:model.createTime?moment(model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:model.updateTime?moment(model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          if (this.isAdd) {
            this.setSelectObj([])
          } else {
            let { itemCodes: code, itemNames: name } = model
            this.$nextTick(()=> {
              this.setSelectObj([{ code, name }])
            })
          }
          if (model.actionId) {
            let func = ()=> this.limitSelect({ code: model.ruleLimit, value: this.ruleLimitMap[model.ruleLimit]})
            if(this.ruleLimitMap){
              func()
            } else {
              this.afterDictLoad = func
            }
          }

        });
        if (model.ruleId) {
          this.loadConditionData(model.ruleId)
        } else {
          this.accessProps = []
          this.judgeProps = []
        }
      },
      detail(id, disableSubmit = true) {
        this.disableSubmit = disableSubmit
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
      openSelect(selectType){
        if(selectType !== this.selectType){
          this.setSelectObj([])
        }
        this.selectType = selectType
        this.selectVisible = true
      },
      loadConditionData(ruleId) {
        this.conditionLoading = true
        getAction(this.url.queryConditionByRuleId, { ruleId }).then(res => {
          if (res.success) {
            let dataObj = {}
            res.result.forEach(r => {
              if (!dataObj[r.field]) {
                dataObj[r.field] = []
              }
              dataObj[r.field].push(r)
            })
            let obj = {}
            for (let item of [...this.accessProps, ...this.judgeProps]) {
              let record = dataObj[item.field]
              if (record) {
                if (item.group) {
                  // 值传入组件为相同field的对象数组 [{ext1, ext2},{ext1, ext2}]
                  obj[item.field] = record
                } else if (item.multiExt) {
                  // 值传入组件为数组 [ext1, ext2]
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
      limitSelect({ code, value }) {
        if (!value) {
          return
        }

       /* let propIndex = code.match(/.[0-9]+/).index + 1
        let propName = code.substring(0, propIndex)*/

        this.accessProps = this.accessMap[code] || []
        this.judgeProps = this.judgeMap[code] || []

        /* if (propName === 'freq') {
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

         }*/
      },
      accessVisittypeChange(val){
        let item = this.accessProps.find(r => r.field === 'accessVisittype')
        item.param.separator = val === '≠'?',': '|'
        this.form.setFieldsValue({[item.field]: undefined})
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
              let httpurl = '';
              let method = '';
              if (!this.model.ruleId) {
                httpurl += this.url.addBatch;
                method = 'post';
              } else {
                httpurl += this.url.edit;
                method = 'put';
              }
              let formData = Object.assign({}, this.model, values, {itemTypes: this.selectType});

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

                  if (item.group) {
                    val.forEach((r1, i) => {
                      judgeConditions.push({ ...obj, ...r1, orderNo: i })
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

              if (this.selectData.length === 0) {
                this.$message.warn('请选择药品')
                return
              }

              formData.itemCodes = this.selectData.map(r => r.code).join(',')
              formData.itemNames = this.selectData.map(r => r.name).join(',')

              formData.accessConditions = accessConditions
              formData.judgeConditions = judgeConditions
              formData.startTime = this.dateTimes[0].format("YYYY-MM-DD");
              formData.endTime = this.dateTimes[1].format("YYYY-MM-DD");
              delete formData.createUser
              delete formData.createUsername
              delete formData.createTime
              delete formData.updateUser
              delete formData.updateUsername
              delete formData.updateTime
              console.log(formData)
              // return
              that.confirmLoading = true;
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
      }
      ,
      handleCancel() {
        this.close()
      }
      ,
      handleSelectOk() {
        let selectData = this.$refs.selectRef.getSelect()
        if (selectData.length > 0) {
          this.setSelectObj(selectData)
        }
        this.handleSelectClose()
      }
      ,
      handleSelectClose() {
        this.selectVisible = false
      }
      ,
      setSelectObj(data) {
        // this.selectItem = obj
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
