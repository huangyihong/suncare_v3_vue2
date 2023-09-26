<template>
    <div>
        <a-spin :spinning="confirmLoading">
            <h3>模型信息</h3>
            <div class="fieldset-box">
                <a-form :form="form" v-bind="ruleFormItemLayout">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-form-item label="模型名称" v-bind="ruleFormItemLayoutHalf">
                                <a-input v-decorator="['caseName',requireRule]" :readOnly="readonly"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="模型状态" v-bind="ruleFormItemLayoutHalf">
                                <m-dict-select-tag placeholder="选择模型状态" dictCode="SWITCH_STATUS" required
                                                   v-decorator="['caseStatus']"
                                                   :disabled="readonly"></m-dict-select-tag>                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-form-item label="创建人" v-if="caseObj.caseId" v-bind="ruleFormItemLayoutHalf">
                                <a-input readOnly :value="caseObj.createUsername"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="创建时间" v-if="caseObj.caseId" v-bind="ruleFormItemLayoutHalf">
                                <a-input readOnly :value="caseObj.createTime"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-form-item label="模型描述">
                        <a-textarea :autosize="{ minRows: 1, maxRows: 5 }" v-decorator="['caseRemark']"
                                    :readOnly="readonly"/>
                    </a-form-item>
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-form-item label="不合规行为" v-bind="ruleFormItemLayoutHalf">
                                <input-medical-action-dict v-decorator="['actionId',requireRule]"
                                                           @select="([val]) => model.actionName = val && val.name || '' " hideButton>
                                </input-medical-action-dict>
                                <!--<m-dict-select-tag-edit dictCode="ACTION_LIST" v-decorator="['actionId',requireRule]"
                                                        @select="r => model.actionName = r.value " autoIncrease search></m-dict-select-tag-edit>
                            -->
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="不合规行为类型" v-bind="ruleFormItemLayoutHalf">
                                <m-dict-select-tag-edit dictCode="ACTION_TYPE" v-decorator="['actionType',requireRule]"
                                                        @select="r => model.actionTypeName = r.value " autoIncrease search></m-dict-select-tag-edit>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="不合规行为释义" v-bind="ruleFormItemLayoutHalf">
                                <a-input v-decorator="['actionDesc']" :readOnly="readonly"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="政策依据" v-bind="ruleFormItemLayoutHalf">

                                <a-input v-decorator="['ruleBasis']" :readOnly="readonly"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-form-item label="适用时间" v-bind="ruleFormItemLayoutHalf">
                                <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="地区" v-bind="ruleFormItemLayoutHalf">
                                <input-medical-other-dict placeholder="请选择所属地区"
                                                          v-decorator="['ruleSourceCode', requireRule]" dict="region"
                                                          @select="([val]) => model.ruleSource = val && val.name || ''"
                                                          :disable="readonly"></input-medical-other-dict>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-form-item label="关联项目类型">
                        <a-row :gutter="12">
                            <a-col :span="10">
                                <m-dict-select-tag placeholder="选择项目类型" dictCode="CASE_RELA_TYPE"
                                                   v-model="relaItemType" :disabled="readonly"
                                                   @change="relaTypeChange"></m-dict-select-tag>
                            </a-col>
                            <a-col :span="14">
                                已选项目数：<a>{{relaItemLoading?'正在加载':relaItems.length}}</a>
                                <a-button type="primary" class="m-l-20" @click="showCaseItemSelect"
                                          :loading="relaItemLoading"
                                          v-if="!readonly">选择
                                </a-button>
                                <a-radio-group v-model="relaItemShowType" class="m-l-20" v-show="relaItems.length > 10">
                                    <a-radio value="part">
                                        显示部分
                                    </a-radio>
                                    <a-radio value="all">
                                        显示全部
                                    </a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <a-form-item label="关联项目">
                        <a-select
                                mode="multiple"
                                v-model="relaItemCodes"
                                :open="false"
                                :showArrow="false"
                                :maxTagCount="relaItemShowType ==='all'?99999999:10"
                                placeholder="请选择"
                                :loading="relaItemLoading"
                                @change="relaItemDelete"
                                allowClear>
                            <a-select-option v-for="item in relaItems" :key="item.code" :value="item.code">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="归纳的流程">
                        <span v-show="caseObjs.length === 0">未统计</span>
                        <template v-for="item in caseObjs">
                            <a-tag>{{item.caseName}}({{item.caseCode}})</a-tag>
                        </template>
                    </a-form-item>
                  <a-row :gutter="8">
                    <a-col :span="12">
                      <a-form-item label="模型ID" v-bind="ruleFormItemLayoutHalf">
                        <a-input v-decorator="['caseId']" readOnly/>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="操作原因" v-bind="ruleFormItemLayoutHalf">
                        <a-textarea placeholder="请输入操作原因" v-decorator="['updateRemark', {}]" :rows="3" :readOnly="readonly"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="8">
                    <a-col :span="12">
                      <a-form-item label="规则级别" v-bind="ruleFormItemLayoutHalf">
                        <a-select placeholder="请选择规则级别" v-decorator="['ruleGrade', {}]" :readOnly="readonly" :disabled="readonly">
                          <a-select-option value="">请选择</a-select-option>
                          <a-select-option value="1级">1级</a-select-option>
                          <a-select-option value="2级">2级</a-select-option>
                          <a-select-option value="3级">3级</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="级别备注" v-bind="ruleFormItemLayoutHalf">
                        <a-input placeholder="请输入级别备注" v-decorator="['ruleGradeRemark',{}]" :readOnly="readonly"></a-input>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
            </div>
            <h3>模型详细</h3>
            <div class="fieldset-box">
                <grade-content ref="gradeRef" :readOnly="readonly"></grade-content>
            </div>
            <h3>流程详细</h3>
            <div class="fieldset-box">
        <span v-if="!chartSetting.mouseWheelBehavior"
              style="position: absolute;bottom:20px;right: 5px;width:50px;z-index: 999">
          <a-slider v-model="scaleRate" vertical :step="5" style="height: 100px"/>
        </span>
                <div :id="diagramId" style="height: 300px"></div>
            </div>
            <a-row :style="{textAlign:'right',marginTop: '10px'}">
                <a-button :style="{marginRight: '8px'}" @click="$emit('close',true)">
                    {{readonly?'关闭':'取消'}}
                </a-button>
                <a-button type="primary" @click="saveCase" :loading="confirmLoading" v-if="!readonly">确定</a-button>
            </a-row>
        </a-spin>
        <m-modal
                :title="'选择'+ relaTypeItem.value"
                :visible="caseItemSelectVisible"
                @ok="handleCaseItemSelectOk"
                @cancel="handleCaseItemCancel"
                v-if="!readonly">
            <component :is="relaTypeItem.component" ref="caseItemSelectRef"
                       :selected="relaItems" v-bind="relaTypeItem.params||{}"></component>
        </m-modal>
    </div>
</template>
<script>
  import GradeContent from './sumupGrade'
  import moment from 'moment'

  moment.locale('zh-cn')
  import { mapGetters } from 'vuex'
  import { getAction} from '@/api/manage'
  import {postAction as postAction_sv3} from '@/api-sv3/manage'
  import FlowChart from '../chart'
  import { saveFormalCase, getFormalCaseGrade, getFormalCaseById } from '@/api-sv3/api-flow'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MDictSelectTagEdit from "@/components/dict_medical/MDictSelectTagEdit"
  import pick from 'lodash/pick'

  const MedicalEquipment = () => import("@/pages/selectMulti/MedicalEquipment")
  const MedicalGroup = () => import("@/pages/selectMulti/MedicalGroup")
  const MedicalOtherDict = () => import("@/pages/selectMulti/MedicalOtherDict")
  const MedicalTreatProject = () => import("@/pages/selectMulti/MedicalTreatProject")
  const MedicalChineseDrug = () => import("@/pages/selectMulti/MedicalChineseDrug")
  const MedicalStdAtc = () => import("@/pages/selectMulti/MedicalStdAtc")
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'
  export default {
    name: 'sumupSubmit',
    components: {
      GradeContent,
      MDictSelectTag,
      MDictSelectTagEdit,
      MedicalEquipment,
      MedicalGroup,
      MedicalOtherDict,
      MedicalTreatProject,
      MedicalChineseDrug,
      MedicalStdAtc,
      InputMedicalOtherDict,
      InputMedicalActionDict
    },
    props: ['data', 'formalId'],
    data() {
      return {
        form: null,
        tailFormItemLayout: {
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        },
        ruleFormItemLayout: {
          labelCol: {
            sm: { span: 24 },
            md: { span: 3 },
          },
          wrapperCol: {
            sm: { span: 24 },
            md: { span: 21 },
          },
        },
        ruleFormItemLayoutHalf: {
          labelCol: {
            sm: { span: 24 },
            md: { span: 6 },
          },
          wrapperCol: {
            sm: { span: 24 },
            md: { span: 18 },
          },
        },
        requireRule: { rules: [{ required: true, message: '这是必填字段' }] },
        imgs: {
          start: require('@/assets/image/flowChart/start.png'),
          end: require('@/assets/image/flowChart/end.png'),
          rect: require('@/assets/image/flowChart/rect.png'),
          diam: require('@/assets/image/flowChart/diam.png'),
          rect_v: require('@/assets/image/flowChart/rect_v.png'),
          diam_v: require('@/assets/image/flowChart/diam_v.png'),
        },
        flowChart: null,
        scaleRate: 50,
        caseObj: {},
        rules: [],
        selectCols: [],
        confirmLoading: false,
        readonly: false,
        diagramId: 'diagram',
        chartSetting: {},
        relaTypeDict: [
          { code: 'peoject', component: 'MedicalTreatProject', value: '项目' },
          { code: 'peojectGroup', component: 'MedicalGroup', value: '项目组', params: { kind: '1' } },
          { code: 'drug', component: 'MedicalStdAtc', value: '药品', params: { fixedParam: { state: '1' } } },
          { code: 'drugGroup', component: 'MedicalGroup', value: '药品组', params: { kind: '7' } },
          { code: 'chineseDrug', component: 'MedicalChineseDrug', value: '中草药' },
          { code: 'equipment', component: 'MedicalEquipment', value: '医疗器械' }
        ],
        url: {
          queryRealItemByCaseId: '/formal/medicalFormalCaseItemRela/queryByCaseId'
        },
        relaItemType: undefined,
        relaItems: [],
        relaItemCodes: [],
        relaItemShowType: 'part',
        caseItemSelectVisible: false,
        relaTypeItem: {},
        relaItemLoading: false,
        model: {},
        dateTimes: [undefined, undefined],
        caseObjs: []
      };
    },
    computed: {
      primaryColor() {
        return this.$store.getters.color
      }
    },
    beforeMount() {
      //  保证不冲突
      let diagramDiv = document.getElementById(this.diagramId)
      while (diagramDiv) {
        this.diagramId += '1'
        diagramDiv = document.getElementById(this.diagramId)
      }
      this.form = this.$form.createForm(this, { name: 'case' });
    },
    mounted() {
      if (this.data) {
        this.initData(this.data)
        this.setData(this.data)
      } else if (this.formalId) {
        this.loadData(this.formalId)
      }
    },
    watch: {
      data(val, oldVal) {
        this.initData(val)
        this.setData(val)
      },
      formalId(val, oldVal) {
        this.loadData(val)
      },
      scaleRate(newVal, oldVal) {
        let disVal = newVal - 50
        this.flowChart.setScale(0.5 + disVal / 110)
      },
      confirmLoading(newVal, oldVal) {
        this.$emit('innerLoading', newVal)
      }
    },
    methods: {
      ...mapGetters(["nickname"]),
      filterDictText,
      showCaseItemSelect() {
        let type = this.relaItemType
        if (type === undefined || type === null || type === '') {
          this.$message.warn("请先选择关联项目类型")
          return
        }
        this.caseItemSelectVisible = true
      },
      handleCaseItemSelectOk() {
        this.relaItems = this.$refs.caseItemSelectRef.getSelect()
        this.relaItemCodes = this.relaItems.map(r => r.code)
        this.handleCaseItemCancel()
      },
      relaTypeChange(val) {
        this.relaItems = []
        this.relaItemCodes = []
        this.relaTypeItem = this.relaTypeDict.find(item => item.code === val) || {}
      },
      handleCaseItemCancel() {
        this.caseItemSelectVisible = false
      },
      relaItemDelete(keys){
        if(keys.length === 0){
          this.relaItems = []
        } else {
          let keySet = new Set(keys)
          this.relaItems = this.relaItems.filter(r => keySet.has(r.code))
        }
      },
      loadData(id) {
        this.confirmLoading = true
        getFormalCaseById({ id: id }).then((res) => {
          if (res.success) {
            let data = res.result
            this.initData(data)
            this.setData(data)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      initData(data) {
        // console.log('data.caseStatus', data.caseStatus)
        // this.readonly = !( !data.caseStatus ||data.caseStatus === 'wait')
        this.readonly = false
        this.caseObj = data
        if(data.caseCodes && data.caseCodes.length > 0){
          let caseCodes = data.caseCodes.split(',')
          let caseNames = data.caseNames && data.caseNames.split(',') || []
          this.caseObjs = caseCodes.map((r,index) => ({caseCode: r, caseName: caseNames[index]}))
        } else {
          this.caseObjs = []
        }
        this.model = {}
        this.dateTimes = [moment(data.startTime || '2000-01-01'), moment(data.endTime || '2099-12-31')]
        let caseId = this.caseObj.caseId
        if(this.copyCreate = data.copyCreate){
          delete data.caseId
          delete data.copyCreate
        }

        if (caseId) {
          this.relaItemLoading = true
          getAction(this.url.queryRealItemByCaseId, { caseId }).then(res => {
            if (res.success) {
              let data = res.result || {}
              this.relaTypeChange(this.relaItemType = data.type)
              if (this.relaItemType) {
                let itemIds = data.itemIds ? data.itemIds.split(',') : []
                let itemNames = data.itemNames ? data.itemNames.split(',') : []
                if (itemNames.length < itemIds.length) {
                  for (let i = itemNames.length, len = itemIds.length; i < len; i++) {
                    itemNames.push(itemIds[i])
                  }
                }
                this.relaItemCodes = itemIds
                this.relaItems = itemIds.map((code, index) => {
                  return {
                    code,
                    name: itemNames[index]
                  }
                })
              }
            } else {
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.relaItemLoading = false
          })
        } else {
          this.relaTypeChange(this.relaItemType = this.relaTypeDict[0].code)
          Object.assign(this.caseObj, {ruleSourceCode: 'CHN', ruleSource: '中国'})
        }
        this.form.resetFields();
        this.form.setFieldsValue(pick(this.caseObj,
          'caseId','caseName', 'caseRemark', 'caseStatus',
          'actionId', 'actionName', 'actionType', 'actionTypeName', 'actionDesc'
          , 'ruleBasis', 'ruleSourceCode', 'ruleSource', 'updateRemark','ruleGrade','ruleGradeRemark'
        ))
      },
      setData(caseObj) {
        console.log('caseObj', caseObj)
        let { flowJson, rules } = caseObj
        let flowJsonStr
        if (typeof flowJson === 'string') {
          flowJsonStr = flowJson
          flowJson = JSON.parse(flowJson)
        } else {
          flowJsonStr = JSON.stringify(flowJson)
        }
        this.$refs.gradeRef.setData(flowJson.nodeDataArray, rules)
        if (caseObj.caseId) {
          this.confirmLoading = true
          getFormalCaseGrade({ caseId: caseObj.caseId }).then((res) => {
            if (res.success) {
              this.$refs.gradeRef.setGrades(res.result)
            } else {
              this.$message.warning("获取评分数据失败:" + res.message);
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        } else {
          this.$refs.gradeRef.setGrades([])
        }
        // this.flowChart.updateData(flowJsonStr)
        this.rules = rules
        if (this.flowChart) {
          this.flowChart.updateData(flowJsonStr)
        } else {
          this.chartSetting = this.$ls.get('flowChartSetting', {
            mouseWheelBehavior: false,
            lineToNode: false,
            grid: true,
          })
          // 在mounted初始化 可能第一次更新数据的时候是空白，还未渲染完成
          this.flowChart = new FlowChart({
            readonly: true, diagramId: this.diagramId, imgs: this.imgs, scale: 0.5,
            setting: { ...this.chartSetting, primaryColor: this.primaryColor },
            data: flowJsonStr
          })
          console.log('this.chartSetting', this.chartSetting)
        }
        this.flowChart.setAllowMove(!this.readonly)
      },
      saveCase() {
        this.form.validateFieldsAndScroll((err, values) => {
          console.log(err, values)
          if (!err) {
            try {
              if (!this.$refs.gradeRef.toValidate()) {
                console.log('gradeRef')
                return
              }
              console.log('confirmLoading', this.confirmLoading)

              this.confirmLoading = true;
              let formData = Object.assign(this.caseObj, values, {
                flowJson: this.flowChart.getJson(),
                rules: this.rules,
                grades: this.$refs.gradeRef.getData(),
                relaItemType: this.relaItemType,
                relaItemIds: this.relaItems.map(item => item.code),
                relaItemNames: this.relaItems.map(item => item.name),
                startTime: this.dateTimes[0].format("YYYY-MM-DD"),
                endTime: this.dateTimes[1].format("YYYY-MM-DD")
              }, this.model);
              console.log('formData', formData)
              saveFormalCase(formData).then((res) => {
                if (res.success) {
                  this.trialFormalFlowCnt(res.result.caseId)
                  this.$message.success(res.message);
                  this.$emit('ok', res.result);
                } else {
                  this.$message.warning(res.message);
                }
              }).finally(() => {
                this.confirmLoading = false
              })
            } catch (e) {
              console.error(e)
            }


          }
        })
      },
      trialFormalFlowCnt(caseId){
        postAction_sv3(this.$suncare_v3 + '/apiCase/trialFormalFlowCnt', {caseId}).then(res => {
          if(res.success){
          }else{
            throw new Error(res.message)
          }
        })
      },
    }
  }
</script>
<style scoped>
    .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
        margin-bottom: 0;
    }

    .ant-form-item {
        margin-bottom: 10px;
    }
</style>
