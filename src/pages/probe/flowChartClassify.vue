<template>
    <div>
        <!--流程图-->
        <div :style="{height:  chartHeight}">
            <!--<div class="chart-title">流程组件</div>-->
            <div :id="paletteId" class="chart" style="float: left;width: 60px;" v-show="!readonly"></div>
            <!--<div class="chart-title">流程图示区</div>-->
            <!--<div class="chart" style="position: relative" :style="{paddingLeft: readonly?'0':'60px'}">-->
            <div class="chart" style="position: relative">
                <div :id="diagramId" style="height: inherit"></div>
                <a style="position: absolute;top:10px;right: 20px;z-index: 2">
                    <a-icon type="setting" class="chart-btn" style="font-size: 18px" @click="showSetting"></a-icon>
                </a>
                <a style="position: absolute;bottom:20px;width:30px;right: 20px;z-index: 2">
                    <a-slider v-model="scaleRate" vertical :step="5" style="height: 150px"
                              v-if="!chartSetting.mouseWheelBehavior"></a-slider>
                    <!--<a-icon @click="scaleRate = 50" type="undo" class="full-btn" style="margin-bottom: 30px"/>-->
                    <a-icon :type="isFull?'fullscreen-exit':'fullscreen'" class="chart-btn"
                            @click="changeChartFull(!isFull)"></a-icon>
                </a>
                <ul :id="menuId" class="ctxmenu">
                    <li id="cut" class="menu-item" @click="cxcommand($event,'KeyX')">剪切</li>
                    <li id="copy" class="menu-item" @click="cxcommand($event,'KeyC')">复制</li>
                    <li id="paste" class="menu-item" @click="cxcommand($event,'KeyV')">粘贴</li>
                    <li id="delete" class="menu-item" @click="cxcommand($event,'Delete')">删除</li>
                </ul>
            </div>

        </div>
        <div class="rule-area-tip" v-show="!tableNames || tableNames.length === 0">未选择配置项</div>
        <div class="rule-area-tip" v-show="!selectKey">未选择节点</div>
        <!--底部参数-->
        <a-tabs v-model="tabKey" @change="tabChange" v-show="selectKey && tableNames && tableNames.length > 0">
            <a-tab-pane tab="节点详情" key="1" :disabled="!selectKey" style=";overflow-x: auto" :forceRender="true">
                <rule-content ref="ruleRef"
                              class="p-t-10"
                              :actionBtnType="actionBtnType" @action="()=> {$emit('action')}"
                              :value="selectName"
                              @input="updateSelectNodeText"
                              :readonly="readonly" @test="test"
                              style="min-width: 900px"
                              :nodeKey="selectKey" :nodeCategory="selectCategory"
                              :uniqueVal="uniqueVal"
                              :tableNames="tableNames"
                              @tableNameChange="val => tableName = val"></rule-content>
            </a-tab-pane>
            <a-tab-pane tab="节点结果" key="2" :disabled="!selectTestKey" :forceRender="true">
                <node-result ref="resultRef" :nodeName="selectName" :nodeKey="selectTestKey" :nodeType="selectType"
                             :caseData="nodeTestParams" @getParams="key=>nodeTestParams = getTestParam([key])[0]"
                             :tableName="tableName"
                             :uniqueVal="uniqueVal"></node-result>
            </a-tab-pane>
        </a-tabs>
        <chart-setting ref="settingRef" :setting="chartSetting" @updateSetting="updateSetting"></chart-setting>

        <paste-text-modal ref="pasteModal" @ok="pasteTextOK"></paste-text-modal>
    </div>
</template>

<script>
  import RuleContent from '@/pages/probe/case/caseRuleClassify';
  import NodeResult from '@/pages/probe/case/nodeResult';
  import CaseResult from '@/pages/probe/case/caseResult';
  import ChartSetting from '@/pages/probe/chartSetting.vue';
  import FlowChart from './chart'

  import PasteTextModal from '@/components/PasteTextModal'

  export default {
    name: "flowChart",
    components: {
      RuleContent,
      NodeResult,
      CaseResult,
      ChartSetting,
      PasteTextModal,
    },
    props: {
      keyPre: {
        type: String,
        default: ''
      },
      diff: {
        type: String,
        default: ''
      },
      readonly: {
        type: Boolean,
        default: false
      },
      isSubmit: {
        type: Boolean,
        default: false
      },
      height: Number,
      actionBtnType: String,
      tableNames: Array
    },
    data() {
      this.deleteKeys = []
      return {
        flowChartObj: null,
        imgs: {
          start: require('@/assets/image/flowChart/start.png'),
          end: require('@/assets/image/flowChart/end.png'),
          rect: require('@/assets/image/flowChart/rect.png'),
          diam: require('@/assets/image/flowChart/diam.png'),
          rect_dws: require('@/assets/image/flowChart/rect.png'),
          diam_dws: require('@/assets/image/flowChart/diam.png'),
          rect_v: require('@/assets/image/flowChart/rect_v.png'),
          diam_v: require('@/assets/image/flowChart/diam_v.png'),
          /*  start: require('@/assets/image/flowChart/开始-3.png'),
            end: require('@/assets/image/flowChart/提交-3.png'),
            rect: require('@/assets/image/flowChart/计算-3.png'),
            diam: require('@/assets/image/flowChart/条件-3.png'),*/
        },
        chartHeight: null,
        isFull: false,
        selectKey: null,
        selectCategory: null,
        selectTestKey: null,
        selectName: '',
        scaleRate: 50,
        diagramId: 'diagram',
        paletteId: 'palette',
        menuId: 'contextMenu',
        tabKey: '1',
        nodeTestParams: null,
        caseTestParams: null,
        nodeDataArray: [],
        chartSetting: {},
        tableName: 'DWB',
        uniqueVal: new Date().getTime()
      }
    },
    beforeMount() {
      //  保证不冲突
      let diagramDiv = document.getElementById(this.diagramId)
      while (diagramDiv) {
        this.diagramId += '1'
        this.paletteId += '1'
        this.menuId += '1'
        diagramDiv = document.getElementById(this.diagramId)
      }

    },
    mounted() {
      this.changeChartFull()
      this.$nextTick(() => {
        this.initFlowChart()
      })

    },
    computed: {
      fixedHeader() {
        return this.$store.state.app.fixedHeader
      },
      primaryColor() {
        return this.$store.getters.color
      }
    },
    watch: {
      scaleRate(newVal, oldVal) {
        let disVal = newVal - 50
        this.flowChartObj.setScale(1 + (disVal < 0 ? disVal / 70 : disVal / 25))
      },
      /*selectCategory: {
        immediate: true,
        handler(val) {
          if (!val || val === 'start') {
            this.tabKey = '3'
          }
        }
      },*/
      readonly(val){
        this.flowChartObj.setReadOnly(val)
      }
    },
    methods: {
      initFlowChart() {
        this.chartSetting = this.$ls.get('flowChartSetting', {
          mouseWheelBehavior: false,
          lineToNode: false,
          grid: true,
        })
        let data = this.flowChartObj ? this.getFlowJson() : {}

        let returnKey
        this.flowChartObj = new FlowChart({
          readonly: this.readonly, isSubmit: this.isSubmit,
          diagramId: this.diagramId, paletteId: this.paletteId, menuId: this.menuId, data,
          setting: { ...this.chartSetting, primaryColor: this.primaryColor },
          imgs: this.imgs,
          nodeDelete: (nodes) => {
            console.log('nodeDelete', nodes)
            let keys = nodes.filter(r => r.data && r.data.type === 'rect' || r.data.type === 'diam').map(r => r.key)
            if(keys.length > 0){
              this.$refs.ruleRef.removeRules(this.deleteKeys = keys)
            }

           /* this.$nextTick(() => {
              if (this.selectKey === key) {
                this.selectKey = null
              }
            })*/
          },
          nodeCopy: (nodes) => {
            let nodeData = JSON.parse(JSON.stringify(nodes.map(n => {
                    let obj = { ...n.data }
                    delete obj.__gohashid
                    delete obj.points
                    return obj
                })
              )
            )
            let keys = nodeData.filter(n => n.key !== undefined && n.key !== null && !n.isGroup).map(n => n.key)
            let rules = this.getRules(keys)
            let copyStr = JSON.stringify({
              data: nodeData,
              rules: rules
            })
            this.$util.setCache('copyToClip', copyStr)
            console.log('nodeCopy.nodeKeys', keys)
            this.copyToClip(copyStr)
          },
          nodePaste: () => {
            let copyStr = this.$util.getCache('copyToClip')
            if (copyStr === null || copyStr === undefined || copyStr === '') {
              this.$refs.pasteModal.show()
            } else {
              this.pasteTextOK(copyStr)
            }
          },
          nodeAdd: (data) => {
            let { key, text } = data
            console.log('nodeAdd', data)
            if (text === '计算' || text === '条件' || text === '提交') {
              // this.flowChartObj.updateText(key, `${text}(${this.keyPre}${key})`)
              this.updateNodeText(key, `${text}(${this.keyPre}${key})`)
            }
          },
          selectLeave: (data) => {
            console.log('selectLeave',data)
            // 需要回退的话不执行
            if (returnKey) {
              return
            }
            let category = data.category
            if (category === 'rectangle' || category === 'conditional') {
              let key = data.key
              if(this.deleteKeys.indexOf(key) > -1){
                this.deleteKeys = []
                this.selectKey = null
              } else {
                console.log('this.selectKey', this.selectKey)
                if (this.selectKey && !this.$refs.ruleRef.validateData(key)) {
                  this.tabKey = '1'
                  this.$message.warning('参数组件填写不完整!')
                  this.$nextTick(() => {
                    this.selectNodeByKey(key)
                  })
                  returnKey = key
                } else {
                  this.selectKey = null
                }
              }

            }
            if (category === 'rectangle' || category === 'end') {
              this.selectTestKey = null
            }
            this.selectCategory = null
          },
          selectActive: (data) => {
            console.log('selectActive',data)
            // 需要回退的话不执行
            if (returnKey) {
              console.log('returnKey', returnKey)
              if (returnKey === data.key) {
                returnKey = undefined
              } else {
                return
              }
            }

            let category = data.category
            if (category === 'rectangle' || category === 'end') {
              this.selectTestKey = data.key
              if (category === 'end' && this.tabKey === '1') {
                this.tabKey = '2'
              }
            }
            this.selectCategory = category
            this.selectType = data.type
            this.selectName = data.text
            if (category === 'rectangle' || category === 'conditional') { // 节点
              this.selectType = data.type + '_dws'
              this.selectKey = data.key
              if (this.tabKey !== '1') {
                this.tabKey = '1'
              }
            }

          }
        })
      },
      pasteTextOK(text) {
        console.log('pasteTextOK', text)
        if (!text || text.trim().length === 0) {
          return
        }
        try {
          let { data, rules = [] } = JSON.parse(text)
          if (!data || data.length === 0) {
            throw new Error("缺少节点信息");
          }
          console.log(data, rules)
          let { nodeDataArray, linkDataArray } = JSON.parse(this.getFlowJson())
          let nodeDataNew = data.filter(n => n.key)
          let linkDataNew = data.filter(n => !n.key)
          // 流程中最小的key
          let keys = nodeDataArray.map(n => parseInt(n.key)).filter(n => !isNaN(n))
          let minKey = Math.min(...keys)
          if (isNaN(minKey) || keys.length === 0) {
            minKey = 0
          }
          console.log(keys, minKey)
          let keyMap = {}
          // 替换原先的key成新的
          nodeDataNew.sort((a, b) => a.isGroup ? -1 : 1)
          let { x, y } = this.flowChartObj.getPoint()
          let nodes = nodeDataNew.filter(n => n.loc)
          let pointXs = nodes.map(n => parseFloat(n.loc.substring(0, n.loc.indexOf(" "))))
          let pointYs = nodes.map(n => parseFloat(n.loc.substring(n.loc.indexOf(" ") + 1)))
          //  中间坐标
          let centerX = (Math.max(...pointXs) + Math.min(...pointXs)) / 2
          let centerY = (Math.max(...pointYs) + Math.min(...pointYs)) / 2
          // 与中间坐标的差值
          let addX = x - centerX
          let addY = y - centerY
          /*console.log(pointXs, centerX)
          console.log(pointYs, centerY)
          console.log(addX, addY)
          console.log(x, y)*/
          for (let node of nodeDataNew) {
            if (node.isGroup) {
              node.key = `分组${0 - (keyMap[node.key] = minKey -= 1)}`
            } else {
              node.key = keyMap[node.key] = minKey -= 1
              if (node.group) {
                node.group = `分组${0 - keyMap[node.group]}`
              }
            }
            if (node.loc) {
              let [x, y] = node.loc.split(" ")
              node.loc = parseFloat(x) + addX + " " + (parseFloat(y) + addY)
            }
          }
          for (let link of linkDataNew) {
            link.from = keyMap[link.from]
            link.to = keyMap[link.to]
          }
          for (let rule of rules) {
            rule.nodeCode = keyMap[rule.nodeCode]
          }

          console.log(nodeDataNew, linkDataNew)
          console.log('rules', rules)
          this.addJson({ nodeDataArray: nodeDataNew, linkDataArray: linkDataNew })
          this.addRules(rules)

        } catch (e) {
          console.error(e)
          this.$message.error('文本结构不符合规范')
        }
      },
      updateSelectNodeText(val) {
        this.selectName = val
        this.flowChartObj.updateText(this.selectKey, val)
      },
      updateNodeText(key, val) {
        if (key === this.selectKey) {
          this.selectName = val
        }
        this.flowChartObj.updateText(key, val)
      },
      updateSetting(setting) {
        this.flowChartObj.setSetting(setting)
        this.chartSetting = setting
      },
      tabChange(activeKey) {
      },
      // This is the general menu command handler, parameterized by the name of the command.
      cxcommand(event, val) {
        console.log(event, val)
        this.flowChartObj.cmd(val)
      },
      // 扩大流程图视图
      changeChartFull(full) {
        let headerHeight = this.fixedHeader ? 60 : 0
        if (full) {
          this.chartHeight = document.documentElement.offsetHeight - 100 - headerHeight
        } else {
          this.chartHeight = this.height || document.documentElement.offsetHeight - 300 - headerHeight
        }
        if (!this.height && this.chartHeight < 300) {
          this.chartHeight = 300
        }
        this.chartHeight += 'px'
        if (full !== undefined) {
          this.$emit("full", this.isFull = full)
          this.$nextTick(() => {
            //  取滚动的根节点
            let node = document.getElementById(this.diagramId);
            let offsetTop = node.offsetTop
            let offsetParent = node.offsetParent
            while (node && node.scrollHeight <= node.clientHeight) {
              node = node.parentNode
              if (offsetParent !== node.offsetParent) {
                offsetParent = node.offsetParent
                offsetTop += node.offsetTop;
              }
            }
            console.log('node', node)
            console.log('offsetTop', offsetTop)
            // 流程图滚动到最顶端
            if (node) {
              node.scrollTo({
                // top: offsetTop - headerHeight,
                top: offsetTop - headerHeight,
                behavior: "smooth"
              });
            }
          })

          setTimeout(() => {
            this.flowChartObj.refresh()
          }, 500)
        }
      },
      // 清除流程图数据
      clearChart(callback) {
        this.selectKey = null
        this.selectName = null
        this.flowChartObj.clear()
        this.nodeDataArray = []
        // 等待keyAttr变换后赋值
        this.$nextTick(() => {
          this.$refs.ruleRef.setRules([])
          if (callback) {
            callback()
          }
        })
      },
      setData({ rules = [], flowJson }) {
        this.tabKey = '3'
        this.selectKey = null
        this.selectCategory = null
        this.selectTestKey = null
        console.log('值为空')
        if (flowJson) {
          let jsonObj = JSON.parse(flowJson)
          let nodes = jsonObj.nodeDataArray || []
          let links = jsonObj.linkDataArray || []

          this.$nextTick(() => {
            // 选取第一个计算或条件节点
            let nodeSelect = nodes.find(node => node.category === 'start')
            if (!nodeSelect) {
              nodeSelect = nodes.find(node => node.category === 'rectangle' || node.category === 'conditional')
            }
            if (nodeSelect) {
              let nodeLink;
              do {
                nodeLink = links.find(link => link.from === nodeSelect.key)
                if (!nodeLink) {
                  nodeSelect = null
                  break
                }
                nodeSelect = nodes.find(node => node.key === nodeLink.to)
              } while (nodeSelect && nodeSelect.category !== 'rectangle' && nodeSelect.category !== 'conditional')
              if (nodeSelect) {
                this.selectNodeByKey(nodeSelect.key)
                console.log('选中', nodeSelect.key)
              }
            }
          })
          if (this.keyPre && this.keyPre.length > 0) {
            let updateCount = 0
            for (let node of nodes) {
              if (node.type === 'end' && node.text === '提交') {
                updateCount++;
                node.text = `提交(${this.keyPre}${node.key})`
              }
            }
            if (updateCount > 0) {
              flowJson = JSON.stringify(jsonObj)
            }
          }
          // this.selectNodeByKey(key)
          this.flowChartObj.updateData(flowJson)
          this.$refs.ruleRef.setRules(rules)
        } else {
          this.clearChart()
        }
      },
      getData() {
        let flowJsonStr = this.getFlowJson()
        let flowJson = JSON.parse(flowJsonStr)
        let keys = Array.from(flowJson.nodeDataArray, (node) => node.key.toString())
        return {
          rules: this.getRules(keys),
          flowJson: flowJsonStr
        }
      },
      getFlowJson() {
        return this.flowChartObj.getJson()
      },
      getRules(keys) {
        if (!keys) {
          let flowJson = JSON.parse(this.getFlowJson())
          keys = Array.from(flowJson.nodeDataArray, (node) => node.key.toString())
        }
        return this.$refs.ruleRef.getRules(keys)
      },
      addRules(array) {
        this.$refs.ruleRef.addRules(array)
      },
      removeRules(keys) {
        this.$refs.ruleRef.removeRules(keys)
      },
      getSubmitKeys() {
        let flowJson = JSON.parse(this.flowChartObj.getJson())
        let keys = []
        for (let node of flowJson.nodeDataArray) {
          if (node.submit === true) {
            keys.push(node.key.toString())
          }
        }
        return keys
      },
      // 移除分组(包含子节点)、连线、节点等
      removePartsByKeys(keys) {
        this.flowChartObj.removePartsByKeys(keys)
      },
      addJson(flowJson) {
        this.flowChartObj.addJson(flowJson)
      },
      addNode(type, text, loc) {
        return this.flowChartObj.addNode(type, text, loc)
      },
      addLink(from, to) {
        return this.flowChartObj.addLink(from, to)
      },
      validateData() {
        if (this.selectKey) {
          return this.$refs.ruleRef.validateData(this.selectKey)
        } else {
          return this.getRules().length > 0
        }

      },
      selectNodeByKey(key) {
        this.selectKey = key
        this.flowChartObj.selectNode(key)
      },
      setOutLoading(loading) {
        this.$emit('loading', loading)
      },
      refreshChart() {
        this.flowChartObj.refresh()
      },
      setAllowMove(allow) {
        this.flowChartObj.setAllowMove(allow)
      },
      setNodeArray() {
        let json = JSON.parse(this.getFlowJson())
        this.nodeDataArray = json.nodeDataArray
      },
      getTestParam(nodeCodes) {
        console.log('nodeCodes', nodeCodes)
        let json = JSON.parse(this.getFlowJson())
        let obj = {}
        for (let node of json.nodeDataArray) {
          obj[node.key] = { key: node.key, children: [] }
        }
        // 建树
        for (let link of json.linkDataArray) {
          let fromItem = obj[link.from]
          let toItem = obj[link.to]
          fromItem.children.push(toItem)
          toItem.parent = fromItem
        }
        let result = []

        nodeCodes.forEach(nodeCode => {
          // 要保留的节点
          let saveNodeKeys = []
          let item = obj[nodeCode]
          while (item) {
            saveNodeKeys.push(item.key)
            item = item.parent
          }
          let flowJson = { ...json }
          flowJson.nodeDataArray = json.nodeDataArray
            .filter(item => saveNodeKeys.some(key => key === item.key))
          flowJson.linkDataArray = json.linkDataArray
            .filter(item => saveNodeKeys.some(key => key === item.from) && saveNodeKeys.some(key => key === item.to))
          const isDWS = this.selectType.indexOf("_dws") > -1
          let rules = isDWS && nodeCodes.length === 1 ?
            this.getRules(nodeCodes) : this.getRules(saveNodeKeys)
          // 只有节点结果有动态字段列表
          /*      console.log('selectType', this.selectType)
                console.log('nodeCodes', nodeCodes)*/
          let cols = this.$refs.ruleRef.getCols(rules, nodeCodes.length === 1 ? undefined : "DWB_MASTER_INFO")
          console.log('flowJson', flowJson)
          console.log('rules', rules)
          console.log('cols', cols)
          result.push({ flowJson, rules, cols })
        })
        return result
      },

      showSetting() {
        console.log('this.$refs', this.$refs)
        this.$refs.settingRef.show()
      },
      test(nodeCode) {
        this.tabKey = '2'
        this.$nextTick(() => {
          this.$refs.resultRef.trail()
        })
      },
      /**
       * 复制内容到粘贴板
       * content : 需要复制的内容
       * message : 复制完后的提示，不传则默认提示"复制成功"
       */
      copyToClip(content, message = "已复制至粘贴板") {
        let aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        this.$message.success(message);
      }
    },

  }
</script>
<style lang="less" scoped>
    /*.chart-title {
      display: inline-block;
      !*margin: 0 32px 0 0;*!
      padding: 12px 16px;
      color: #1890ff;
      !*border-bottom: #1890ff 1px solid;*!
    }*/

    .chart {
        /*border-top: rgb(240, 242, 245) 2px solid;*/
        /*box-shadow: rgba(2, 144, 255, 0.2) 0px 0px 5px 1px;*/
        height: 100%;
        background-color: white;
        border-bottom: rgb(240, 242, 245) 3px solid;
        overflow: hidden;
    }

    .chart-btn {
        margin-top: 10px;
        font-size: 30px;
        transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);

        &:hover {
            padding: 2px;
            transform: scale(1.6);
            /*background-color: rgb(24, 144, 255);*/
            /*color: rgb(230, 247, 255)*/
        }
    }

    .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
        margin-bottom: 0;
    }

    .ctxmenu {
        display: none;
        position: absolute;
        opacity: 0;
        margin: 0;
        padding: 8px 0;
        z-index: 999;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
        list-style: none;
        background-color: #ffffff;
        border-radius: 4px;
    }

    .menu-item {
        display: block;
        position: relative;
        min-width: 60px;
        margin: 0;
        padding: 6px 16px;
        font: bold 12px sans-serif;
        color: rgba(0, 0, 0, .87);
        cursor: pointer;
    }

    .menu-item::before {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        content: "";
        width: 100%;
        height: 100%;
        background-color: #000000;
    }

    .menu-item:hover::before {
        opacity: .04;
    }

    .menu .menu {
        top: -8px;
        left: 100%;
    }

    .show-menu, .menu-item:hover .ctxmenu {
        display: block;
        opacity: 1;
    }

    .rule-area-tip{
        text-align: center;
        padding: 50px 0;
        color: #aaaaaa;
        font-size: 20px;
        letter-spacing: 3px;
    }
</style>
