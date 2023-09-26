<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :xxl="8" :sm="10" :xs="24">
            <a-form-item label="模型名称">
              <a-input v-decorator="['caseName']" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="4" :xs="8">
            <a-form-item label="版本号">
              <a-input readOnly :value="caseObj.caseVersion || '1.0'"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="5" :xs="8" v-if="caseObj.caseId">
            <a-form-item label="创建人">
              <a-input readOnly :value="caseObj.createUsername"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="5" :xs="8" v-if="caseObj.caseId">
            <a-form-item label="创建时间">
              <a-input readOnly :value="caseObj.createTime"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :xs="24">
            <a-form-item label="模型描述">
              <a-input v-decorator="['caseRemark']" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="4" :xs="8">
            <a-form-item label="不合规行为">
              <input-medical-action-dict v-decorator="['actionId']" :disable="readonly"></input-medical-action-dict>
              <!--<a-input v-decorator="['actionName']" :readOnly="readonly"/>-->
             <!-- <m-dict-select-tag dictCode="ACTION_LIST" v-decorator="['actionId']"
                                     :disabled="readonly"></m-dict-select-tag>-->
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="4" :xs="8">
            <a-form-item label="不合规行为类型">
              <a-input v-decorator="['actionTypeName']" :readOnly="readonly"/>
              <!--<m-dict-select-tag dictCode="ACTION_TYPE" v-decorator="['actionType']"
                                 :disabled="readonly"></m-dict-select-tag>-->
            </a-form-item>
          </a-col>
          <a-col :lg="12" :xs="24">
            <a-form-item label="不合规行为释义">
              <a-input v-decorator="['actionDesc']" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :xs="24">
            <a-form-item label="政策依据">
              <a-input v-decorator="['ruleBasis']" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :xs="24">
            <a-form-item label="适用时间">
              <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :xs="24">
            <a-form-item label="地区">
              <input-medical-other-dict placeholder="请选择所属地区"
                                        v-decorator="['ruleSourceCode']"
                                        dict="region"
                                        disable></input-medical-other-dict>
            </a-form-item>
          </a-col>
          <a-col :lg="12" :xs="24">
            <a-form-item label="操作原因" v-bind="ruleFormItemLayoutHalf">
              <a-textarea placeholder="请输入操作原因" v-decorator="['updateRemark', {}]" :rows="3" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="4" :xs="8">
            <a-form-item label="规则级别" v-bind="ruleFormItemLayoutHalf">
              <a-select placeholder="请选择规则级别" v-decorator="['ruleGrade', {}]" :readOnly="readonly" :disabled="readonly">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="1级">1级</a-select-option>
                <a-select-option value="2级">2级</a-select-option>
                <a-select-option value="3级">3级</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :sm="4" :xs="8">
            <a-form-item label="级别备注" v-bind="ruleFormItemLayoutHalf">
              <a-input placeholder="请输入级别备注" v-decorator="['ruleGradeRemark',{}]" :readOnly="readonly"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" v-if="relaItemCodes.length > 0">
            <a-form-item label="关联项目类型">
              <a-row :gutter="12">
                <a-col :xs="24" :lg="9" :xxl="6">
                  <a-input :value="relaTypeItem.value" :readOnly="readonly"></a-input>
                  <div>
                    项目数：<a>{{relaItemLoading?'正在加载':relaItems.length}}</a>
                    <a-radio-group v-model="relaItemShowType" class="m-l-10" v-show="relaItems.length > 10">
                      <a-radio value="part">
                        显示部分
                      </a-radio>
                      <a-radio value="all">
                        显示全部
                      </a-radio>
                    </a-radio-group>
                  </div>
                </a-col>
                <a-col :xs="24" :lg="15" :xxl="18">
                  <a-select
                          mode="multiple"
                          v-model="relaItemCodes"
                          :open="false"
                          :showArrow="false"
                          :maxTagCount="relaItemShowType ==='all'?99999999:10"
                          placeholder="请选择"
                          :loading="relaItemLoading">
                    <a-select-option v-for="item in relaItems" :key="item.code" :value="item.code">
                      {{item.name}}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <h3>模型详细</h3>
      <div class="fieldset-box">
        <grade-content ref="gradeRef" :readOnly="readonly&&!grade"></grade-content>
      </div>
      <h3>流程详细</h3>
      <div class="fieldset-box">
        <flow-chart ref="chartRef" :height="300" :readOnly="true" :ruleReadonly="true" :isSubmit="false"
                    :diff="caseObj.caseId"
                    @full="changeChartFull"></flow-chart>
      </div>
    </a-spin>
  </div>
</template>
<script>
  import GradeContent from '@/pages/probe/sumup/sumupGrade'
  import pick from 'lodash/pick'
  import moment from 'moment'
  import flowChart from '@/pages/probe/flowChart'
  moment.locale('zh-cn')
  import {
    getHisFormalCaseById,
            getHisFormalCaseGrade,
            getFormalCaseById,
            getFormalCaseGrade
  } from '@/api-sv3/api-flow'
  import { getAction } from '@/api/manage'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'

  export default {
    name: 'caseDetail',
    components: {
      GradeContent,
      MDictSelectTag,
      flowChart,
      InputMedicalOtherDict,
      InputMedicalActionDict
    },
    props: {
      batchId: String, // 为空默认最新
      notHis: Boolean, // batchId 为空默认true
      caseId: String,
      grade: Boolean,
    },
    data() {
      return {
        form: this.$form.createForm(this),
        flowChart: null,
        scaleRate: 50,
        caseObj: {},
        rules: [],
        confirmLoading: false,
        readonly: true,
        diagramId: 'diagram',
        chartSetting: {},
        id: '',
        dateTimes: [undefined,undefined],
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
        relaTypeItem: {},
        relaItems: [],
        relaItemCodes: [],
        relaItemShowType: 'part',
        relaItemLoading: false,
      };
    },
    computed: {},
    watch: {
      caseId:{
        immediate:true,
        handler(val) {
          if(val)
            this.loadData(val)
        },
      },
    },
    methods: {
      loadData(id) {
        if (typeof id !== 'string') {
          this.initData(id)
          return
        }
        if(id === this.id){
          return
        }
        this.id = id
        this.loadRealItemData(id);
        this.confirmLoading = true
        let queryApi = !this.batchId || this.notHis ? getFormalCaseById : getHisFormalCaseById
        queryApi({ id, batchId: this.batchId }).then((res) => {
          if (res.success) {
            let data = res.result
            this.initData(data)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      loadRealItemData(caseId){
        this.relaItemCodes = []
        this.relaItems = []
        this.relaItemLoading = true
        getAction(this.url.queryRealItemByCaseId, { caseId }).then(res => {
          if (res.success) {
            let data = res.result
            if (data) {
              this.relaItemType = data.type
              this.relaTypeItem = this.relaTypeDict.find(item => item.code === this.relaItemType) || {}
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
      },
      // 基础信息赋值
      initData(data) {
        this.caseObj = data
        this.dateTimes = [moment(data.startTime||'2000-01-01'), moment(data.endTime||'2099-12-31')]
        this.form.setFieldsValue(pick(this.caseObj,'caseName', 'caseRemark', 'caseStatus',
          'actionId', 'actionName', 'actionType', 'actionTypeName', 'actionDesc'
                , 'ruleBasis', 'ruleSourceCode', 'ruleSource', 'updateRemark','ruleGrade','ruleGradeRemark'))
        this.initChart(data)
        this.initGrade(data, this.batchId)
      },
      // 流程图规则赋值
      initChart(data) {
        this.$refs.chartRef.setData(data)
        this.$refs.chartRef.setAllowMove(true)
      },
      initGrade({ caseId, rules, flowJson }, batchId) {
        let flowJsonObj = JSON.parse(flowJson)
        this.$refs.gradeRef.setData(flowJsonObj.nodeDataArray, rules)
        this.confirmLoading = true
        let queryApi = !this.batchId || this.notHis ? getFormalCaseGrade:getHisFormalCaseGrade
        queryApi({ caseId, batchId }).then((res) => {
            if (res.success) {
              this.$refs.gradeRef.setGrades(res.result)
            } else {
              this.$message.warning("获取评分数据失败:" + res.message);
            }
          }).finally(() => {
            this.confirmLoading = false
          })
      },
      changeChartFull(isFull) {
        console.log('isFull', isFull)
        this.$emit('max', isFull)
      },
      refreshChart() {
        this.$refs.chartRef.refreshChart()
      },
      getGrade(){
        if (!this.$refs.gradeRef.toValidate()) {
          return
        }
        return this.$refs.gradeRef.getData()
      }
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
