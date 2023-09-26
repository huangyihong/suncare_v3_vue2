<template>
    <div>
        <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" class="m-b-6" style="border: none">
            <breadcrumb :parent="{path:'/task/taskProjectList'}" style="margin-bottom: 4px">
                <!--<a-popconfirm placement="bottomRight" slot="right" v-if="onStep"
                              title="确定通过并进入下一步?" @confirm="() => passToNextStep(batchId)">
                  <a-button type="primary" @click="searchQuery" :loading="tabStatusLoading" :disabled="!canGoToNext"
                            v-has="'reviewSystem:leader'">
                    审核并通过
                  </a-button>
                </a-popconfirm>-->
            </breadcrumb>
            <a-row :gutter="8" style="font-size: 15px;">
                <a-col :xs="8">
                    <span style="font-weight: bold">项目名称</span>：{{project.projectName}}
                </a-col>
                <a-col :xs="8">
                    <span style="font-weight: bold">任务批次</span>：{{projectBatch.batchName}}
                </a-col>
                <a-col :xs="8">
                    <span style="font-weight: bold">风控月份</span>：{{projectBatch.month}}
                    <a style="float: right" @click="$refs.modalForm.edit(projectBatch)">批次详情</a>
                </a-col>
            </a-row>
        </a-card>
        <keep-alive v-if="tabCurrent">
            <component :ref="'tab-page_' + tabCurrent.type" :is="tabCurrent.component" :key="tabCurrent.type"
                       :batchId="batchId" :onStep="onStep" @refresh="setTabStatus"
                       v-bind="tabCurrent.params||{}">
                <template slot="tabs">
                    <a-tabs v-model="tabIndex" @change="tabChange" :animated="false">
                        <template v-for="(tab,index) in tabs">
                            <a-tab-pane :key="tab.type" v-if="ruleTypes.indexOf(tab.type) > -1">
                  <span slot="tab">
                    {{tab.title}}
                    <span class="m-l-10">
                      <a-icon type="loading" v-if="tab.status === 'running'"/>
                      <a-icon type="clock-circle" v-else-if="tab.status === 'wait'"/>
                      <a-popover placement="bottomRight" v-else-if="tab.status === 'abnormal'">
                        <div slot="title" style="padding: 3px 3px">
                          异常信息
                          <a-button type="primary" size="small" class="fr" @click="handleReRun(tab)">重跑失败规则</a-button>
                          <div style="clear: both"></div>
                        </div>
                        <template slot="content">
                          <div style="max-width: 500px">{{tab.msg}}</div>
                        </template>
                         <a-icon type="info-circle"/>
                      </a-popover>
                    </span>
                  </span>
                            </a-tab-pane>
                        </template>
                    </a-tabs>
                </template>
            </component>
        </keep-alive>
        <task-project-batch-modal ref="modalForm"></task-project-batch-modal>
    </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  // const TaskBatchBreakRuleDelList  = ()=> import(  '@/pages/task/TaskBatchBreakRuleDelList')
  const TaskBatchBreakRuleDelListCase = () => import('@/pages/task/TaskBatchBreakRuleDelListCase')
  const MedicalBreakDrugActionList = () => import( '@/pages/action/MedicalBreakDrugActionList')
  // const reviewSystemDrugView = () => import('@/pages/review/reviewSystemDrugView.vue')
  // const reviewSystemClinicalView = () => import('@/pages/review/reviewSystemClinicalView')
  import reviewSystemCommonView from '@/pages/review/reviewSystemCommonView'
  import { postAction } from '@/api-sv3/manage'

  import {
    taskProjectBatchNextStep,
    queryStepItemByBatchStep,
    queryBatchAndProjectById,
    // taskProjectBatchExecReRun
  } from '@/api-sv3/api'
  import { reviewMixin } from './mixin'

  export default {
    name: 'reviewSystemList',
    mixins: [reviewMixin],
    components: {
      Breadcrumb,
      // TaskBatchBreakRuleDelList,
      TaskBatchBreakRuleDelListCase,
      // MedicalBreakDrugActionList,
      // reviewSystemDrugView,
      // reviewSystemClinicalView,
      reviewSystemCommonView
    },
    data() {
      let tabs = [
        {
          title: "业务组模型",
          type: '01',
          component: 'TaskBatchBreakRuleDelListCase',
          params: { ruleType: 'CASE' },
        },
        {
          title: "违反模型",
          type: '11',
          component: 'TaskBatchBreakRuleDelListCase',
          params: { ruleType: 'NEWCASE' },
        },
        { title: "药品合规", type: '02', component: 'reviewSystemCommonView', params: { ruleType: 'DRUG' } },
        { title: "收费合规", type: '03', component: 'reviewSystemCommonView', params: { ruleType: 'CHARGE' } },
        { title: "合理诊疗", type: '07', component: 'reviewSystemCommonView', params: { ruleType: 'TREAT' } },
        { title: "合理用药", type: '08', component: 'reviewSystemCommonView', params: { ruleType: 'DRUGUSE' } },
        { title: "收费合规-测试", type: '09', component: 'reviewSystemCommonView', params: { ruleType: 'NEWCHARGE' } },
        { title: "合理诊疗-测试", type: '10', component: 'reviewSystemCommonView', params: { ruleType: 'NEWTREAT' } },
        { title: "药品合规-测试", type: '12', component: 'reviewSystemCommonView', params: { ruleType: 'NEWDRUG' } },
        // { title: "临床路径不合规", type: '04', component: 'MedicalBreakDrugActionList', params:{ ruleType:'3'}  },
        // {title:"违反KPI", type: '05'}
        {
          title: "临床路径",
          type: '06',
          component: 'reviewSystemCommonView',
          params: { ruleType: 'CLINICAL' },
        },
        {
          title: "特殊批次",
          type: '-1',
          component: 'reviewSystemCommonView',
          params: { ruleType: 'MANUAL' },
        },
      ]
      return {
        tabIndex: '01',
        tabs,
        tabCurrent: undefined,
        tabStatusLoading: false,
        ruleTypes: [],
        canGoToNext: true,
        step: 1,
        timer: undefined,
        url: {
          execReRun: this.$suncare_v3 + '/apiTask/taskProjectBatch/execReRun'
        }
      }
    },
    watch: {
      onStep(val) {
        if (val) {
          this.setTabStatus()
        }
      },
      projectBatch(val) {
        this.ruleTypes = val.ruleTypes ? val.ruleTypes.split(',') : this.tabs.map(r => r.type)
        console.log('this.ruleTypes', this.ruleTypes)
        this.tabChange(this.ruleTypes[0])
      }
    },
    methods: {
      // 定时查询运行状态
      setTabStatus() {
        if (this.timer) {
          return
        }
        let runningNum = 0
        let normalNum = 0
        this.tabStatusLoading = true
        queryStepItemByBatchStep({ batchId: this.batchId, step: 1 }).then(res => {
          if (res.success) {
            let result = res.result
            result.forEach(item => {
              if (item.status === 'normal') {
                normalNum++
              } else if (item.status === 'running') {
                runningNum++
              }
              let oldTab = this.tabs.find(tab => tab.type === item.itemId)
              if (oldTab) {
                if (oldTab.status && oldTab.status !== item.status) {
                  let pageComp = this.$refs['tab-page_' + oldTab.type]
                  if (pageComp) {
                    pageComp.loadData(1)
                  }
                }
                Object.assign(oldTab, item)
              }
            })
            this.tabs = [...this.tabs]
            this.canGoToNext = normalNum === result.length
            // 5秒循环获取
            if (runningNum > 0) {
              console.log(`正在运行${runningNum},5秒后定时获取`)
              this.timer = setTimeout(this.setTabStatus, 5000)
            } else if (this.timer) {
              console.log('没有正在运行,不定时获取')
              this.timer = undefined
            }
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.tabStatusLoading = false;
        })
      },
      tabChange(key) {
        this.tabIndex = key
        this.tabCurrent = this.tabs.find(item => item.type === key)
      },
      // 重跑一个规则类型
      handleReRun(tab) {
        this.$message.success('请求重跑请等待')
        let params = { batchId: this.batchId, ruleTypes: tab.type }
        postAction(this.url.execReRun, params).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            if (!this.timer) {
              this.setTabStatus()
            }
          } else {
            this.$message.warning(res.message);
            this.loading = false
          }
        })
      },
    },
    beforeDestroy() {
      if (this.timer) {
        console.log('退出页面,取消定时获取')
        clearTimeout(this.timer)
      }
    }
  }
</script>
<style scoped>

</style>
