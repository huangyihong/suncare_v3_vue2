<template>
  <a-spin :spinning="confirmLoadings.length>0">
    <a-layout style="padding: 24px 0 24px 24px;background: #fff;">
      <a-layout style="padding-right: 10px;background: #fff;">
        <!--头部-->
        <a-layout-header style="background: #fff;height: auto;padding: 0 0 5px 0">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="12">
                <a-col :xxl="4" :lg="8" v-if="!isFormalCase">
                  <a-form-item label="流程编号" :label-col="{ span: 10}"
                               :wrapper-col="{ span: 14 }">
                    <a-input v-model="caseObj.caseCode" read-only></a-input>
                  </a-form-item>
                </a-col>
                <a-col v-bind="isFormalCase?{xxl:9,lg:11}:{xxl:4,lg:10}">
                  <a-form-item :label="isFormalCase?'模型名称':'流程名称'" :label-col="{ span: 10 }"
                               :wrapper-col="{ span: 14 }">
                    <a-input v-model="caseObj.caseName" :readOnly="isFormalCase"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xxl="3" :lg="6" v-if="!isFormalCase">
                  <a-form-item label="状态" :label-col="{ span: 10}"
                               :wrapper-col="{ span: 14}">
                    <a-input read-only :value="filterDictText(statusDictOptions, caseObj.caseStatus)"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xxl="isFormalCase?8:5" :lg="12" :xs="isFormalCase?20:24">
                  <a-form-item label="备注" :label-col="{ span: 6}"
                               :wrapper-col="{ span: 18}">
                    <a-input v-model="caseObj.caseRemark" :readOnly="isFormalCase"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xxl="isFormalCase?7:8" :lg="isFormalCase?1:12" :xs="isFormalCase?4:24" style="margin-bottom: 5px;padding-left: 5px;white-space: nowrap">
                  <span v-if="!isFormalCase && caseObj.caseId">
                    版本：{{caseObj.caseVersion.toFixed(2)}}
                  </span>
                  <span v-if="!isFormalCase" class="m-l-6">
                    <a-button type="primary" @click="saveCase" :disabled="isSubmited" v-has="'probe:add'">{{caseObj.caseId?'更新':'保存'}}</a-button>
                    <a-button type="primary" @click="createProbeCase(true)" class="m-l-6">新增</a-button>
                    <!--<a-button type="primary" @click="$refs.chartRef.addNode('start','start')" style="margin-left: 8px">新增节点</a-button>-->
                    <!--<a-button type="primary" @click="$refs.chartRef.openNodeSelect()" class="m-l-6">导入节点</a-button>-->
                     <span class="m-l-6">
                    <a-dropdown-button @click="openNodeSelect(true)">
                          导入节点
                          <a-menu slot="overlay">
                            <a-menu-item key="1" @click="openNodeSelect(false)">导入节点（复制）</a-menu-item>
                          </a-menu>
                        </a-dropdown-button>
                     </span>
                    <a-button type="primary" class="m-l-6"
                              @click="statisticCase" :loading="statisticCaseLoading">流程统计</a-button>
                    <!--<a-button type="primary" @click="console.log('data',$refs.chartRef.getData())" style="margin-left: 8px">输出数据</a-button>-->
                  </span>
                  <a-icon :type="sideCollapsed?'menu-fold':'menu-unfold'" @click="sideCollapse" style="float: right;line-height: 32px;font-size: 18px"></a-icon>
                  <!--<a-button @click="sideCollapsed=!sideCollapsed">{{sideCollapsed?'展开':'收缩'}}</a-button>-->
                </a-col>

              </a-row>
            </a-form>
          </div>
        </a-layout-header>
        <a-layout-content style="border: #f0f2f5 4px solid">
          <!--流程图-->
          <main-content ref="chartRef" :keyPre="keyPre" :diff="caseObj.caseId" @loading="loading" @full="changeChartFull"
                        :actionBtnType="!isSubmited && (caseObj.caseId?'update':'add')"
                        @action="saveCase"
                        :readOnly="isSubmited"
          ></main-content>
        </a-layout-content>
      </a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider collapsedWidth="0" collapsible :trigger="null" v-model="sideCollapsed" style="background: white"
                      width="300">
        <a-tabs defaultActiveKey="1" style="width: 300px">
          <a-tab-pane tab="探查库" key="1">
            <list-probe-case ref="listProbeRef" @loading="loading" @statisticCase="statisticCaseShow"
                             @loadData="loadData" @submit="submitEvent"></list-probe-case>
          </a-tab-pane>
          <a-tab-pane tab="模型库" key="2">
            <list-formal-case @loading="loading" @statisticCase="statisticCaseShow"
                              @loadData="loadData"></list-formal-case>
          </a-tab-pane>
          <a slot="tabBarExtraContent" style="vertical-align: middle;padding-right: 10px">
            <a-popover title="提示" trigger="hover" placement="bottomRight" >
              <a slot="content">
                1. 单/多选框勾选后按钮操作<br><br>
                2. 点击行显示模型
              </a>
              <a><a-icon type="exclamation-circle" /></a>
            </a-popover>
          </a>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </a-spin>
</template>

<script>
  import ListProbeCase from './listProbeCase';
  import ListFormalCase from './listFormalCase';
  import MainContent from '../flowChart';
  import { mapActions } from 'vuex'
  import { getProbeCaseCode, addProbeCase, updateProbeCase } from '@/api-sv3/api-flow'
  import {postAction as postAction_sv3} from '@/api-sv3/manage'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: "caseIndex",
    components: {
      MainContent,
      ListProbeCase,
      ListFormalCase,
    },
    data() {
      return {
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        caseObj: {
          caseCode: '',
          caseName: '',
          caseRemark: '',
        },
        isFormalCase: false,
        keyPre: '',
        sideCollapsed: false,
        confirmLoadings: [],
        statusDictOptions: [],
        filterDictText: filterDictText,
        statisticCaseLoading: false,

      }
    },
    computed:{
      isSubmited(){
        return this.caseObj.caseCode && this.caseObj.caseStatus === 'submited' || this.isFormalCase
      }
    },
    beforeMount() {
      this.changeChartFull()
      this.createProbeCase()
      //初始化字典 - 状态
      this.$store.dispatch('GetCacheAsync', { key: 'dict_submit_status', func: resolve => {
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
    },
    mounted() {
    },
    methods: {
      ...mapActions(['setSidebar']),
      openNodeSelect(link){
        this.$refs.chartRef.openNodeSelect(undefined, link)
      },
      // 扩大流程图视图
      changeChartFull(isFull) {
        // 两边侧边栏状态
        this.setSidebar(!isFull)
        this.sideCollapsed = isFull
      },
      loadData(data) {
        console.log('loadData',data)
        if(data){
          this.isFormalCase = data.isFormalCase
          this.caseObj = data
          if(this.isFormalCase){
            this.keyPre = ''
          } else{
            this.keyPre = this.caseObj.caseCode.substring(this.caseObj.caseCode.length - 4)
          }
          this.$nextTick(()=>{
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
        this.caseObj = {caseStatus: 'wait'}
        this.confirmLoadings.push(true)
        getProbeCaseCode().then(res => {
          if (res.success) {
            this.caseObj.caseCode = res.result
            this.keyPre = this.caseObj.caseCode.substring(this.caseObj.caseCode.length - 4)
          }
        }).finally(() => {
          this.confirmLoadings.pop()
        })
      },
      submitEvent(code){
        if(this.caseObj.caseCode===code){
          this.$set(this.caseObj,'caseStatus','submited')
        }

      },
      loading(isLoading) {
        if (isLoading) {
          this.confirmLoadings.push(true)
        } else {
          this.confirmLoadings.pop()
        }
      },
      saveCase() {
        if (!this.$refs.chartRef.validateData()) {
          this.$message.warning('参数组件填写不完整!')
          return
        }
        let { caseId, caseCode, caseName, caseRemark } = this.caseObj
        let formData = { caseId, caseCode,caseName, caseRemark, ...this.$refs.chartRef.getData() }
        console.log('formData', formData)
        this.confirmLoadings.push(true)
        if (!caseId) {
          addProbeCase(formData).then((res) => {
            if (res.success) {
              this.caseObj = res.result
              this.trialProbeFlowCnt(this.caseObj.caseId)
              this.$message.success(res.message);
              this.$refs.listProbeRef.loadData(1)
            } else {
              this.caseObj.caseId = null
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoadings.pop()
          })
        } else {
          updateProbeCase(formData).then((res) => {
            if (res.success) {
              this.trialProbeFlowCnt(this.caseObj.caseId)
              this.caseObj.caseVersion += 0.01
              this.$message.success(res.message);
              this.$refs.listProbeRef.loadData()
            } else {
              delete this.caseObj.caseId
              delete this.caseObj.caseStatus
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoadings.pop()
          })
        }

      },
      trialProbeFlowCnt(caseId){
        postAction_sv3(this.$suncare_v3 + '/apiCase/trialProbeFlowCnt', {caseId}).then(res => {
          if(res.success){
          }else{
            throw new Error(res.message)
          }
        })
      },
      sideCollapse() {
        this.sideCollapsed = !this.sideCollapsed
        setTimeout(() => {
          this.$refs.chartRef.refreshChart()
        }, 300)
      },
      statisticCaseShow(data, caseId){
        for(let item of data){
          this.$refs.chartRef.updateNodeCount(item.nodeCode, item.numFound)
        }
      },
      statisticCase(){
        let param = this.$refs.chartRef.getStatisticParam()
        if(!param.rules || param.rules === '[]'){
          return
        }
        this.statisticCaseLoading = true
        this.$refs.listProbeRef.execCaseStatistic(param).then(data => {
          this.$refs.chartRef.clearCount()
          for(let nodeCode in data){
            this.$refs.chartRef.updateNodeCount(nodeCode, data[nodeCode])
          }
        }).finally(()=> {
          this.statisticCaseLoading = false
        })
      }
    },

  }
</script>
<style scoped>
  .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
    margin-bottom: 10px;
  }
</style>
