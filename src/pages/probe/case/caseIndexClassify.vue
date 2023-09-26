<template>
    <a-spin :spinning="confirmLoadings.length>0">
        <a-layout style="padding: 24px 0 24px 24px;background: #fff;">
            <a-layout style="padding-right: 10px;background: #fff;">
                <!--头部-->
                <a-layout-header style="background: #fff;height: auto;padding: 0 0 5px 0">
                    <div class="table-page-search-wrapper">
                        <a-form layout="inline" :form="form" v-bind="formItemLayout">
                            <a-row :gutter="12">
                                <a-col :xxl="4" :xl="6" :md="12">
                                    <a-form-item label="流程编号" :label-col="{ span: 10}"
                                                 :wrapper-col="{ span: 14 }">
                                        <a-input v-decorator="['caseCode',requireRule]" read-only></a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="6" :xl="8" :md="12">
                                    <a-form-item label="特殊模型类型">
                                        <m-dict-select-tag :options="classifyConfigs"
                                                           v-decorator="['caseClassify',requireRule]" required
                                                           @select="caseClassifyChange" autoIncrease
                                                           search></m-dict-select-tag>
                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="8" :xl="10" :md="12">
                                    <a-form-item label="备注">
                                        <a-input v-decorator="['caseRemark', {}]"></a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="6" :xl="8" :md="12">
                                    <a-form-item label="模型名称" :label-col="{ span: 10 }"
                                                 :wrapper-col="{ span: 14 }">
                                        <a-input v-decorator="['caseName',requireRule]"></a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="8" :xl="8" :md="12">
                                    <a-form-item label="不合规行为">
                                        <input-medical-action-dict v-decorator="['actionId',requireRule]"
                                                                   @select="([val]) => caseObj.actionName = val && val.name || '' " hideButton>
                                        </input-medical-action-dict>
                                       <!-- <m-dict-select-tag-edit dictCode="ACTION_LIST"
                                                                v-decorator="['actionId',requireRule]"
                                                                @select="r => caseObj.actionName = r.value "
                                                                autoIncrease search></m-dict-select-tag-edit>-->

                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="8" :xl="8" :md="12">
                                    <a-form-item label="不合规行为类型">
                                        <m-dict-select-tag-edit dictCode="ACTION_TYPE"
                                                                v-decorator="['actionType',requireRule]"
                                                                @select="r => caseObj.actionTypeName = r.value "
                                                                autoIncrease search></m-dict-select-tag-edit>
                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="8" :xl="8" :md="12">
                                    <a-form-item label="适用时间">
                                        <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :xxl="8" :xl="8" :md="12">
                                    <a-form-item label="地区">
                                        <input-medical-other-dict placeholder="请选择所属地区"
                                                                  v-decorator="['ruleSourceCode', requireRule]"
                                                                  dict="region"
                                                                  hideButton
                                                                  @select="([val]) => caseObj.ruleSource = val && val.name || ''"
                                                                  ></input-medical-other-dict>
                                    </a-form-item>
                                </a-col>
                            <!--<a-col :xxl="8" :xl="8" :md="12" >
                              <a-form-item label="不合规行为">
                                <m-dict-select-tag-edit dictCode="ACTION_LIST" v-decorator="['actionId',requireRule]"
                                                        @select="r => caseObj.actionName = r.value " autoIncrease search></m-dict-select-tag-edit>
                              </a-form-item>
                            </a-col>
                            <a-col :xxl="8" :xl="8" :md="12" >
                              <a-form-item label="不合规行为类型">
                                <m-dict-select-tag-edit dictCode="ACTION_TYPE" v-decorator="['actionType',requireRule]"
                                                        @select="r => caseObj.actionTypeName = r.value " autoIncrease search></m-dict-select-tag-edit>
                              </a-form-item>
                            </a-col>-->
                            <a-col :xxl="8" :xl="8" :md="12">
                                <a-form-item label="不合规行为释义">
                                    <a-input v-decorator="['actionDesc',{}]"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :xxl="8" :xl="8" :md="12">
                                <a-form-item label="政策依据">
                                    <a-input v-decorator="['ruleBasis',{}]"></a-input>
                                </a-form-item>
                            </a-col>
                              <a-col :xxl="4" :xl="6" :md="12">
                                <a-form-item label="规则级别" v-bind="ruleFormItemLayoutHalf">
                                  <a-select placeholder="请选择规则级别" v-decorator="['ruleGrade', {}]"  :readOnly="readonly" :disabled="readonly">
                                    <a-select-option value="">请选择</a-select-option>
                                    <a-select-option value="1级">1级</a-select-option>
                                    <a-select-option value="2级">2级</a-select-option>
                                    <a-select-option value="3级">3级</a-select-option>
                                  </a-select>
                                </a-form-item>
                              </a-col>
                              <a-col :xxl="4" :xl="6" :md="12">
                                <a-form-item label="级别备注" v-bind="ruleFormItemLayoutHalf">
                                  <a-input placeholder="请输入级别备注" v-decorator="['ruleGradeRemark',{}]" :readOnly="readonly"></a-input>
                                </a-form-item>
                              </a-col>
                            <a-col :xxl="24" :xl="16" :md="24" class="t-r m-b-6"
                                   style="white-space: nowrap">
                  <span v-if="caseObj.caseId">
                    版本：
                    <a-select v-model="caseObj.caseVersion" @change="versionChange" style="width: 80px">
                            <a-select-option :value="item" v-for="(item,index) in versions" :key="index">{{item}}
                            </a-select-option>
                          </a-select>
                  </span>

                                <a-button type="primary" class="m-l-6" @click="saveCase" v-has="'probe:add'"
                                          v-if="lastVersion === caseObj.caseVersion">{{caseObj.caseId?'更新':'保存'}}
                                </a-button>
                                <a-button type="primary" class="m-l-6" @click="createProbeCase(true)">新增</a-button>
                                <!--<a-button type="primary" @click="$refs.chartRef.addNode('start','start')" style="margin-left: 8px">新增节点</a-button>-->
                                <!--<a-button type="primary" @click="openNodeSelect()" class="m-l-6">导入节点</a-button>-->
                                <!--<a-button type="primary" @click="console.log('data',$refs.chartRef.getData())" style="margin-left: 8px">输出数据</a-button>-->

                                <a-icon :type="sideCollapsed?'menu-fold':'menu-unfold'" @click="sideCollapse"
                                        class="m-l-20" style="line-height: 32px;font-size: 18px"></a-icon>
                                <!--<a-button @click="sideCollapsed=!sideCollapsed">{{sideCollapsed?'展开':'收缩'}}</a-button>-->
                            </a-col>

                            </a-row>
                        </a-form>
                    </div>
                </a-layout-header>
                <a-layout-content style="border: #f0f2f5 4px solid">
                    <!--流程图-->
                    <main-content ref="chartRef" :keyPre="keyPre" :diff="caseObj.caseId" @loading="loading"
                                  @full="changeChartFull"
                                  :actionBtnType="caseObj.caseId?'update':'add'" :tableNames="tableNames"
                                  :readonly="caseObj.caseId && lastVersion !== caseObj.caseVersion"
                                  @action="saveCase"
                    ></main-content>
                </a-layout-content>
            </a-layout>
            <!-- 侧边栏 -->
            <a-layout-sider collapsedWidth="0" collapsible :trigger="null" v-model="sideCollapsed"
                            style="background: white"
                            width="300">
                <list-formal-case @loading="loading" ref="listFormalRef"
                                  @loadData="loadData"></list-formal-case>
            </a-layout-sider>
        </a-layout>
        <!--<m-modal centered
                 title="选择节点"
                 width="80%"
                 :visible="selectNodeVisible"
                 @ok="handleSelectNodeOk"
                 @cancel="selectNodeVisible = false"
                 :destroyOnClose="true"
                 cancelText="关闭">
          <select-medical-flow-templ ref="selectNodeRef" :selected="[]"></select-medical-flow-templ>
        </m-modal>-->
    </a-spin>
</template>

<script>
  import ListProbeCase from './listProbeCase';
  import ListFormalCase from './listFormalCaseClassify';
  import MainContent from '../flowChartClassify';
  // import SelectMedicalFlowTempl from '@/pages/selectMulti/MedicalFlowTempl';
  import pick from 'lodash/pick'
  import { mapActions } from 'vuex'
  import { getAction, postAction } from '@/api/manage'
  import moment from 'moment'

  moment.locale('zh-cn')
  import {
    getProbeCaseCode, saveFormalCase
    , getHisFormalCaseByVersion, getFormalCaseById
  } from '@/api-sv3/api-flow'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import MDictSelectTagEdit from "@/components/dict_medical/MDictSelectTagEdit"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalActionDict from '@/pages/selectInput/MedicalActionDict'
  export default {
    name: "caseIndex",
    components: {
      MainContent,
      ListProbeCase,
      ListFormalCase,
      MDictSelectTagEdit,
      MDictSelectTag,
      InputMedicalOtherDict,
      InputMedicalActionDict
      // SelectMedicalFlowTempl
    },
    data() {
      return {
        url: {
          classifyConfig: '/medical/medicalSpecialCaseClassify/dict'
        },
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        },
        requireRule: { rules: [{ required: true, message: '这是必填字段' }] },
        caseObj: {
          caseCode: '',
          caseName: '',
          caseRemark: '',
        },
        keyPre: '',
        sideCollapsed: false,
        confirmLoadings: [],
        statusDictOptions: [],
        filterDictText: filterDictText,
        selectNodeVisible: false,
        tableNames: undefined,
        classifyConfigs: [],
        dateTimes: [undefined, undefined]
      }
    },
    computed: {},
    beforeMount() {
      this.changeChartFull()
      this.createProbeCase()
      this.loadClassifyConfig()
      //初始化字典 - 状态
      this.$store.dispatch('GetCacheAsync', {
        key: 'dict_submit_status', func: resolve => {
          initDictOptions('submit_status').then((res) => {
            if (res.success) {
              this.statusDictOptions = res.result;
              resolve(res.result)
            }
          });
        }
      }).then((data) => {
        this.statusDictOptions = data
      })
      let { caseId } = this.$route.query
      if (caseId) {
        this.$nextTick(() => {
          this.$refs.listFormalRef.loadCaseFlow(caseId)
        })
      }
    },
    methods: {
      ...mapActions(['setSidebar']),
      // 扩大流程图视图
      changeChartFull(isFull) {
        // 两边侧边栏状态
        this.setSidebar(!isFull)
        this.sideCollapsed = isFull
      },
      loadClassifyConfig() {
        this.confirmLoadings.push(true)
        getAction(this.url.classifyConfig, {}).then(res => {
          if (res.success) {
            let data = res.result
            this.classifyConfigs = data.map(r => ({
              code: r.classifyId, value: r.classifyName, tables: r.optionalTable.split(','),
              ...pick(r, 'actionName', 'actionTypeName', 'actionId', 'actionType')
            }))
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoadings.pop()
        })
      },
      loadData(data, version) {
        console.log('loadData', data)
        if (data) {
          this.tableNames = this.classifyConfigs.find(r => r.code === data.caseClassify).tables
          this.form.resetFields()
          this.form.setFieldsValue(pick(data, 'caseCode', 'caseName', 'caseRemark', 'actionId', 'actionType', 'actionName', 'actionTypeName', 'actionDesc'
            , 'ruleBasis', 'caseClassify', 'ruleSourceCode', 'ruleSource','ruleGrade','ruleGradeRemark'))
          this.caseObj = data
          this.dateTimes = [data.startTime?moment(data.startTime):undefined, data.endTime?moment(data.endTime): undefined]
          this.keyPre = this.caseObj.caseCode.substring(this.caseObj.caseCode.length - 4)
          data.caseVersion = data.caseVersion.toFixed(2)
          if(!version){
            this.lastVersion = data.caseVersion
            if (data.versions) {
              this.versions = data.versions.map(r => r.toFixed(2))
              if (this.versions.indexOf(data.caseVersion) === -1) {
                this.versions.push(data.caseVersion)
              }
            } else {
              this.versions = [data.caseVersion]
            }
          }
          this.$nextTick(() => {
            this.$refs.chartRef.setData(data)
          })

        } else {
          this.createProbeCase(true)
        }
      },
      createProbeCase(clear) {
        if (clear) {
          this.$refs.chartRef.setData({})
        }
        this.form.resetFields()
        this.caseObj = {ruleSourceCode: 'CHN', ruleSource: '中国'}
        this.lastVersion = undefined
        this.versions = []
        this.dateTimes = [moment('2000-01-01'), moment('2099-12-31')]
        this.confirmLoadings.push(true)
        getProbeCaseCode().then(res => {
          if (res.success) {
            let caseCode = res.result
            this.form.setFieldsValue({ caseCode, ruleSourceCode: 'CHN' })
            this.keyPre = caseCode.substring(caseCode.length - 4)
          }
        }).finally(() => {
          this.confirmLoadings.pop()
        })
      },
      versionChange(version) {
        this.loading(true)
        const promiseQuery = this.lastVersion === version ? getFormalCaseById({ id: this.caseObj.caseId })
          : getHisFormalCaseByVersion({ caseId: this.caseObj.caseId, version })
        promiseQuery.then(res => {
          if (res.success) {
            this.loadData(res.result, version)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.loading(false)
        })
      },
      loading(isLoading) {
        if (isLoading) {
          this.confirmLoadings.push(true)
        } else {
          this.confirmLoadings.pop()
        }
      },
      openNodeSelect() {
        this.selectNodeVisible = true
      },
      saveCase() {
        if (!this.$refs.chartRef.validateData()) {
          this.$message.warning('参数组件填写不完整!')
          return
        }
        this.form.validateFieldsAndScroll((err, values) => {
          console.log(err, values)
          if (!err) {
            let formData = Object.assign(this.caseObj, values, {
              ...this.$refs.chartRef.getData(),
              caseStatus: 'normal',
              startTime: this.dateTimes[0].format("YYYY-MM-DD"),
              endTime: this.dateTimes[1].format("YYYY-MM-DD")
            });

            console.log('formData', formData)
            this.confirmLoadings.push(true)
            saveFormalCase(formData).then((res) => {
              if (res.success) {
                let data = res.result
                this.versions.push(this.lastVersion = data.caseVersion.toFixed(2))
                this.caseObj = data
                this.$message.success(res.message);
                this.$refs.listFormalRef.loadData()
              } else {
                this.$message.warning(res.message);
              }
            }).finally(() => {
              this.confirmLoadings.pop()
            })
          }
        })


      },
      caseClassifyChange(r) {
        let tableNames = r.tables
        let oldTables = this.tableNames
        if (oldTables) {
          let noExistTable = oldTables.find(r => tableNames.indexOf(r) === -1)
          if (noExistTable) {
            this.$message.warn('配置表变化，可能需要重新配置规则')
          }
        }
        this.tableNames = tableNames
        Object.assign(this.caseObj, pick(r, 'actionName', 'actionTypeName'))
        this.form.setFieldsValue(pick(r, 'actionId', 'actionType'))

      },
      sideCollapse() {
        this.sideCollapsed = !this.sideCollapsed
        setTimeout(() => {
          this.$refs.chartRef.refreshChart()
        }, 300)
      }
    },

  }
</script>
<style scoped>
    .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
        margin-bottom: 10px;
    }
</style>
