<template>
    <a-spin :spinning="confirmLoadings.length>0">
        <a-layout>

            <a-layout-sider width="380" :collapsedWidth="0" style="background: #fff;margin-right: 10px" collapsible
                            :trigger="null" v-model="sideCollapsed">
                <a-tabs v-model="activeTabKey" style="padding: 24px;min-width: 350px">
                    <a-tab-pane tab="待归纳" key="1">
                        <list-probe-case ref="listProbeRef" @loading="loading" @addCases="addCases"
                                         @cutCases="cutCases"></list-probe-case>
                    </a-tab-pane>
                    <a-tab-pane tab="模型库" key="2">
                        <list-formal-case ref="listFormalRef" @loadData="loadCaseData" @loading="loading"
                                          @statisticCase="statisticCaseShow"></list-formal-case>
                    </a-tab-pane>
                </a-tabs>
            </a-layout-sider>

            <a-layout style="padding: 24px 0 24px 12px;background: #fff;">
                <!--头部-->
                <a-layout-header style="padding: 0 20px 10px 0;background: #fff;height: auto">
                    <div class="table-page-search-wrapper">
                        <a-form layout="inline">
                            <a-row :gutter="12">
                                <template v-if="caseObj.caseId">
                                    <a-col :xl="6" :lg="16">
                                        <a-form-item label="模型名称" :label-col="{ span: 11 }"
                                                     :wrapper-col="{ span: 13 }">
                                            <a-input v-model="caseObj.caseName" read-only></a-input>
                                        </a-form-item>

                                    </a-col>
                                    <a-col :xl="3" :lg="8">
                                        <a-form-item label="状态" :label-col="{ span: 10 }"
                                                     :wrapper-col="{ span: 14 }">
                                            <a-input read-only
                                                     :value="filterDictText(statusDictOptions, caseObj.caseStatus)"></a-input>
                                        </a-form-item>
                                    </a-col>
                                  <a-col :xl="2" :lg="8">
                                    <a-form-item label="版本" :label-col="{ span: 10 }"
                                                 :wrapper-col="{ span: 14 }">
                                      <a-select v-model="caseObj.caseVersion" @change="versionChange" style="width: 80px">
                                        <a-select-option :value="item" v-for="(item,index) in versions" :key="index">{{item}}
                                        </a-select-option>
                                      </a-select>
                                    </a-form-item>
                                  </a-col>
                                </template>
                                <a-col :xl="caseObj.caseId?13:24" :lg="16" class="t-r" style="white-space: nowrap">
                                    <a-button type="primary"
                                              @click="statisticCase" :loading="statisticCaseLoading">流程统计</a-button>
                                    <span v-has="'sumup:action'">
                                        <a-button type="primary" v-if="caseObj.caseId" class="m-l-6"
                                                  @click="copyCreateFormal(caseObj.caseId)" v-has="'probe:add'">复制新增</a-button>
                                        <!--<a-button type="primary" class="m-l-6" @click="$refs.chartRef.openNodeSelect()">导入节点</a-button>-->
                                      <span class="m-l-6">
                                        <a-dropdown-button @click="openNodeSelect(true)">
                                        导入节点
                                        <a-menu slot="overlay">
                                          <a-menu-item key="1" @click="openNodeSelect(false)">导入节点（复制）</a-menu-item>
                                        </a-menu>
                                      </a-dropdown-button>
                                      </span>
                                      <template v-if="caseObj.caseId">
                                           <a-button type="primary" class="m-l-6"
                                                     @click="updateCase" v-if="lastVersion === caseObj.caseVersion" v-has="'probe:add'">模型修改</a-button>
                                            <!--<a-button type="primary" @click="updateCase" v-if="caseObj.caseStatus === 'wait'">模型修改</a-button>-->
                                            <!--<a-button type="primary" @click="detailCase" v-else>模型查看</a-button>-->
                                        </template>

                                        <a-button type="primary" class="m-l-6" @click="createCase" v-else v-has="'probe:add'">模型保存</a-button>
                                                            <!--<a-button type="primary" style="margin: 0 20px 0 8px">试算</a-button>-->
                                    </span>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                </a-layout-header>
                <a-layout-content>
                    <!--流程图-->

                    <main-content ref="chartRef" :readonly="caseObj.caseId && lastVersion !== caseObj.caseVersion"
                                  :isSubmit="true" :diff="caseObj.caseId"
                                  @full="changeChartFull" @loading="loading" ></main-content>

                </a-layout-content>

            </a-layout>
            <!--:title="caseObj.caseId?caseObj.caseStatus === 'wait'?'模型修改':'模型查看':'模型保存'"-->

            <a-drawer
                    :title="caseObj.caseId?'模型修改':'模型保存'"
                    placement="right"
                    :closable="false"
                    :maskClosable="modelClosable"
                    @close="modelVisible = false"
                    :visible="modelVisible"
                    width="1200px">
                <model-content ref="modelRef" :data="modelData"
                               @close="modelVisible = false" @ok="saveOK"
                               @innerLoading="loading => modelClosable = !loading"></model-content>
            </a-drawer>
        </a-layout>
    </a-spin>
</template>
<script>
  import { mapActions } from 'vuex'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import ListProbeCase from './listProbeCase';
  import ListFormalCase from './listFormalCase';
  import MainContent from '../flowChart';
  import ModelContent from './sumupModel';
  import {
    getFormalCaseById,
    getHisFormalCaseByVersion
  } from '@/api-sv3/api-flow'

  export default {
    name: 'sumupIndex',
    components: {
      MainContent,
      ModelContent,
      ListProbeCase,
      ListFormalCase
    },
    data() {
      return {
        modelVisible: false,
        modelClosable: true,
        modelData: {},
        sideCollapsed: false,
        activeTabKey: '1',
        confirmLoadings: [],
        actionRules: [],
        // 记录每个case的nodeData 和linkData坐标
        indexObj: {},
        caseObj: {},
        ruleReadonly: false,
        filterDictText: filterDictText,
        statusDictOptions: [],
        versions: [],
        lastVersion: undefined,
        statisticCaseLoading: false,
      }
    },
    beforeMount() {
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
        this.activeTabKey = '2'
        this.$nextTick(() => {
          this.$refs.listFormalRef.loadCaseFlow(caseId)
        })
      }
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
      addCases(cases) {
        if (this.caseObj.caseId) {
          this.caseObj = {}
          this.indexObj = {}
          this.ruleReadonly = false
          this.$refs.chartRef.setAllowMove(true)
          this.$refs.chartRef.clearChart(() => this.addCases(cases))
          return
        }
        let nodeDataArray = []
        let linkDataArray = []
        let actionRules = []
        console.log('cases', cases)
        for (let item of cases) {
          let { caseCode, caseName } = item
          let groupName = (caseName || '') + `(${caseCode})`
          let keyPre = caseCode.substring(caseCode.length - 4)
          let flow = JSON.parse(item.flowJson)

          let nodeKeys = []
          for (let nodeData of flow.nodeDataArray) {
            nodeData.key = keyPre + nodeData.key
            nodeData.group = groupName
            nodeKeys.push(nodeData.key)
          }
          flow.nodeDataArray.push({ key: groupName, isGroup: true })

          for (let linkData of flow.linkDataArray) {
            linkData.from = keyPre + linkData.from
            linkData.to = keyPre + linkData.to
          }
          let rules = item.rules
          for (let rule of rules) {
            rule.nodeCode = keyPre + rule.nodeCode
          }
          nodeDataArray.push(...flow.nodeDataArray)
          linkDataArray.push(...flow.linkDataArray)

          this.indexObj[item.caseId] = {
            nodeKeys: nodeKeys,
            groupKey: groupName,
            caseName,
            caseCode
          }
          // this.actionRules = this.actionRules.concat(rules)
          actionRules = actionRules.concat(rules)
        }
        console.log('nodeDataArray', nodeDataArray)
        console.log('linkDataArray', linkDataArray)
        console.log('actionRules', actionRules)
        this.$refs.chartRef.addJson({ nodeDataArray, linkDataArray })
        this.$refs.chartRef.addRules(actionRules)
        // this.$refs.chartRef.setData({rules: this.actionRules})
      },
      cutCases(ids) {
        let groupKeys = []
        let nodeKeys = []
        for (let id of ids) {
          let obj = this.indexObj[id]
          // this.actionRules.splice(obj.rules.start, obj.rules.n)
          groupKeys.push(obj.groupKey)
          nodeKeys = nodeKeys.concat(obj.nodeKeys)
          delete this.indexObj[id]
        }
        console.log('nodeKeys', nodeKeys)
        console.log('groupKeys', groupKeys)
        this.$refs.chartRef.removePartsByKeys(groupKeys)
        this.$refs.chartRef.removeRules(nodeKeys)
        // this.$refs.chartRef.setData({rules: this.actionRules})

      },
      createCase() {
        let keys = this.$refs.chartRef.getSubmitKeys()
        if (keys.length === 0) {
          this.$message.warn("请先勾选提交节点")
          return
        }
        this.modelVisible = true
        this.modelData = this.getDataBySubmitKeys(keys)
        // 获取被勾选的流程编号
        let nodeGroupCodes = this.modelData.nodeGroups.map(r => r.substring(r.lastIndexOf('(') + 1, r.length - 1))
        let caseObjs = Object.values(this.indexObj).filter(r => nodeGroupCodes.indexOf(r.caseCode) > -1)
        // 按编号排序
        caseObjs.sort((a, b) => a.caseCode > b.caseCode ? 1 : -1)
        this.modelData.caseCodes = caseObjs.map(r => r.caseCode).join(',')
        this.modelData.caseNames = caseObjs.map(r => r.caseName).join(',')
        console.log('this.modelData', this.modelData)
      },
      updateCase() {
        let keys = this.$refs.chartRef.getSubmitKeys()
        if (keys.length === 0) {
          this.$message.warn("请先勾选提交节点")
          return
        }
        this.modelVisible = true
        let data = this.getDataBySubmitKeys(keys)
        this.modelData = { ...this.caseObj, ...data }
        console.log(this.caseObj, data)
      },
      detailCase() {
        this.modelVisible = true
        this.modelData = this.caseObj
      },
      copyCreateFormal(caseId) {
        let keys = this.$refs.chartRef.getSubmitKeys()
        if (keys.length === 0) {
          this.$message.warn("请先勾选提交节点")
          return
        }
        this.modelVisible = true
        let data = this.getDataBySubmitKeys(keys)
        this.modelData = { ...this.caseObj, ...data, copyCreate: true }
      },
      getDataBySubmitKeys(keys) {
        let json = JSON.parse(this.$refs.chartRef.getFlowJson())
        console.log('json', json)
        console.log('SubmitKeys', keys)
        let obj = {}
        let submitItems = []
        let commentItems = []

        for (let node of json.nodeDataArray) {
          if (node.category === 'comment') {
            commentItems.push(node)
          }
          obj[node.key] = { key: node.key, children: [], group: node.group, type: node.type }
        }
        let keySet = new Set(keys) // 字符串
        // 建树
        for (let link of json.linkDataArray) {
          let fromItem = obj[link.from]
          let toItem = obj[link.to]
          if(!fromItem || !toItem){
            continue
          }
          fromItem.children.push(toItem)
          toItem.parent = fromItem
          if (keySet.has(link.to + '')) {
            submitItems.push(toItem)
          }
        }


        // 要保留的节点
        let saveNodeKeys = []
        // 保留的虚拟节点
        let virtualNodeKeys = new Set()
        // 涉及到的组
        let saveNodeInGroups = new Set()
        for (let item of submitItems) {
          saveNodeInGroups.add(item.group)
          while (item) {
            if(item.type.indexOf('_v') >-1){
              virtualNodeKeys.add(item.key)
            }
            saveNodeKeys.push(item.key)
            item = item.parent
          }
        }
        console.log('submitItems.length', submitItems.length)
        console.log('saveNodeKeys.length', saveNodeKeys.length)
        console.log('commentItems.length', commentItems.length)
        // 保存涉及组内的注解
        for (let node of commentItems) {
          if (saveNodeInGroups.has(node.group)) {
            saveNodeKeys.push(node.key)
          }
        }

        let flowJson = { ...json }
        console.log('saveNodeKeys', saveNodeKeys)
        flowJson.nodeDataArray = json.nodeDataArray
          .filter(item => saveNodeKeys.some(key => key === item.key))
        flowJson.nodeDataArray.forEach(item => {delete item.group; delete item.count})
        flowJson.linkDataArray = json.linkDataArray
          .filter(item => saveNodeKeys.some(key => key === item.from) && saveNodeKeys.some(key => key === item.to))
        console.log('flowJson', flowJson)
        let rules = this.$refs.chartRef.getRules(saveNodeKeys.filter(r => !virtualNodeKeys.has(r)))
        console.log('saveNodeInGroups', saveNodeInGroups)
        return { flowJson, rules, nodeGroups: Array.from(saveNodeInGroups) }
      },
      loadCaseData(data) {
        if (!data) {
          this.$message.error('模型不存在')
          return
        }
        console.log('loadCaseData', data)
        if (this.$refs.listProbeRef) {
          this.$refs.listProbeRef.clearSelection()
        }
        this.$refs.chartRef.setData(data)
        // if (data.caseStatus === 'wait') {
        this.ruleReadonly = false
        // this.$refs.chartRef.setAllowMove(true)
        // } else {
        //   this.ruleReadonly = true
        //   this.$refs.chartRef.setAllowMove(false)
        // }

        data.caseVersion = data.caseVersion.toFixed(2)
        if (data.versions) {
          this.lastVersion = data.caseVersion
          this.versions = data.versions.map(r => r.toFixed(2))
          if (this.versions.indexOf(data.caseVersion) === -1) {
            this.versions.push(data.caseVersion)
          }
        }
        this.caseObj = data
      },
      versionChange(version) {
        this.loading(true)
        const promiseQuery = this.lastVersion === version ? getFormalCaseById({ id: this.caseObj.caseId })
          : getHisFormalCaseByVersion({ caseId: this.caseObj.caseId, version })
        promiseQuery.then(res => {
          if (res.success) {
            this.loadCaseData(res.result)
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
      saveOK(data) {
        this.versions.push(this.lastVersion = data.caseVersion)

        this.caseObj = data
        this.modelClosable = true
        this.modelVisible = false
        if (this.$refs.listFormalRef) {
          this.$refs.listFormalRef.refresh()
        }

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
    }
  }
</script>
<style scoped>
    .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
        margin-bottom: 5px;
    }

</style>
