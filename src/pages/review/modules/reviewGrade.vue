<template>
  <a-layout style="background-color: #fff">
    <a-layout-sider class="o-hidden" :trigger="null" width="225" style="background-color: #fff">
      <a-card :bordered="false" title="模型列表" size="small" class="card-padding0">
        <a-dropdown placement="bottomCenter" slot="extra">
          <a-menu slot="overlay">
            <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            树操作
            <a-icon type="down"/>
          </a>
        </a-dropdown>
        <a-spin :spinning="confirmLoading">
          <a-empty v-if="!confirmLoading && nodeList.length === 0" class="m-t-20"></a-empty>
          <a-directory-tree :selectedKeys="selectedKeys" :expandedKeys="expandedKeys"
                            @select="onSelect" @expand="onExpand" :showIcon="false">

            <!--<a-icon slot="switcherIcon" type="down" />-->
            <!--<div slot="switcherIcon"></div>-->
            <template v-for="pNode in nodeList">
              <a-tree-node :key="pNode.busiId" :title="pNode.busiName" :selectable="false">
                <template v-for="node in pNode.children">
                  <a-tree-node :key="node.caseId"
                               :title="`${node.caseName}${node.reviewAcount != null?`(${node.reviewAcount})`:''}`">
                    <!--:selectable="node.status !== 'abnormal'">-->
                    <!-- <template slot="icon">
                       <a-icon type="loading" v-if="node.status === 'running'"/>
                       <a-icon type="clock-circle" v-else-if="node.status === 'wait'"/>
                       <a-icon type="info-circle" v-else-if="node.status === 'abnormal'"/>
                     </template>-->
                  </a-tree-node>
                </template>

              </a-tree-node>
            </template>
          </a-directory-tree>
        </a-spin>
      </a-card>
      <!--   <template v-for="node in nodeList">
           <div :key="node.caseId" :title="`${node.caseName}(${node.busiName})`" style="padding: 5px"
                :class="{'selected': node.caseId === selectedKey}" class="pointer" @click="onSelect(node.caseId)">
             {{node.caseName}}({{node.busiName}})</div>
         </template>-->
    </a-layout-sider>

    <a-layout-content style="padding-left: 10px;border: 5px; border-left-style: outset;">
      <case-detail ref="caseDetail" :batchId="batchId" :notHis="false" :grade="true"
                   @max="val => $emit('max',val)"></case-detail>
    </a-layout-content>

  </a-layout>
</template>

<script>
  import { getAction } from '@/api-sv3/manage'

  const CaseDetail = () => import('@/pages/probe/caseDetail')

  export default {
    name: 'reviewGrade',
    props: ['batchId'],
    components: {
      CaseDetail
    },
    data() {
      return {
        url: {
          nodeList: '/task/taskBatchBreakRuleDel/querySimpleByBatchId'
        },
        nodeList: [],
        selectedKeys: [],
        expandedKeys: [],
        confirmLoading: true,
        // selectedKey: undefined
      }
    },
    beforeMount() {
      this.loadNodeData()
    },
    methods: {
      loadNodeData() {
        this.confirmLoading = true
        getAction(this.url.nodeList, { batchId: this.batchId, ruleType: '01', status: 'audited' }).then(res => {
          if (res.success) {
            let data = res.result
            let busiList = []
            let busisObj = {}
            for (let item of data) {
              let obj = busisObj[item.busiId]
              if (!obj) {
                busisObj[item.busiId] = obj = { busiId: item.busiId, busiName: item.busiName, children: [] }
                busiList.push(obj)
              }
              obj.children.push(item)
            }
            this.nodeList = busiList
            if (this.nodeList.length > 0) {
              this.$nextTick(() => {
                this.expandAll()
                this.onSelect([this.nodeList[0].children[0].caseId])
              })
            }

          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      onSelect(keys, event) {
        this.selectedKeys = keys
        this.$refs.caseDetail.loadData(keys[0])
      },
      onExpand(keys, event) {
        this.expandedKeys = keys
      },
      expandAll() {
        this.onExpand(this.nodeList.map(item => item.busiId))
      },
      closeAll() {
        this.expandedKeys = []
      },
      getData() {
        return {
          caseId: this.selectedKeys[0],
          grades: this.$refs.caseDetail.getGrade()
        }
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
