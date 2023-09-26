<template>
  <div>
    <a-alert :message="tip" banner v-if="tip" style="margin: 0 0 5px 0"/>
    <a-tree
      v-model="checkedKeys"
      checkable
      :expanded-keys="expandedKeys"
      :selected-keys="selectedKeys"
      :tree-data="treeData"
      :load-data="onLoadData"
      @expand="onExpand"
      @select="onSelect"
    />
  </div>

</template>
<script>
  import { getAction } from '@/api/manage'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'

  // 数据先distinct出批次ID再去查询批次和项目
  export default {
    props: {
      allDs: {
        type: Boolean,
        default: false
      },
      param: {
        type: Object,
        default: () => ({})
      },
      tip: String
    },
    data() {
      this.url = {
        // 参数为 SOLR结果表属性
        queryBatchAndProjectFilter: this.$suncare_v3 + '/apiTask/taskProjectBatch/queryBatchAndProjectFilter'
      }
      return {
        expandedKeys: [],
        checkedKeys: [],
        selectedKeys: [],
        treeData: [],
        selectedRowKeys: [],
        selectedRowRecords: []
      }
    },
    beforeMount() {
      this.loadData()
    },
    watch: {
      checkedKeys(val) {
        console.log('onCheck', val)
      }
    },
    methods: {
      loadData() {

        this.$util.initDict('SOLR_DATA_SOURCE').then(data => {
          if (this.allDs) {
            this.treeData = data.map(r => ({
              title: r.value,
              key: r.code,
              isDs: true
            }))
          } else {
            let ds = this.$store.getters.userInfo.dataSource
            let dsName = data.find(r => r.code === ds).value
            this.treeData = [
              {
                title: dsName,
                key: ds,
                isDs: true
              }
            ]
            this.expandedKeys = [ds]
          }

        })
      },
      onLoadData(treeNode) {
        console.log('treeNode', treeNode)
        return new Promise(resolve => {
          let nodeData = treeNode.dataRef
          if (nodeData.children) {
            resolve()
            return
          }
          getAction(this.url.queryBatchAndProjectFilter, this.param).then(res => {
            if (res.success) {
              const { batchList, projectList = [] } = res.result || {}
              nodeData.children = projectList.map(p => {
                return ({
                  title: p.projectName,
                  key: p.projectId,
                  children: batchList.filter(r => r.projectId === p.projectId).map(r => {
                    return ({
                      title: r.batchName,
                      key: r.batchId,
                      isLeaf: true
                    })
                  })
                })
              })
              this.treeData = [...this.treeData]
            } else {
              this.$message.warning(res.message)
            }
          }).catch(e => {
            this.$message.error('获取数据失败：' + e.message)
          }).finally(() => {
            resolve()
          })

        })
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys)
        this.expandedKeys = expandedKeys
      },
      onCheck(checkedKeys) {
        console.log('onCheck', checkedKeys)
        this.checkedKeys = checkedKeys
      },
      onSelect(selectedKeys, info) {
        console.log('onSelect', info)
        this.selectedKeys = selectedKeys
      },
      getSelect() {
        let set = new Set(this.checkedKeys)
        // 0：数据源， 1：项目 2：批次
        let array = [[], [], []]
        this.levelPushKey(set, this.treeData, array, 0)
        console.log('array', array)
        return array
      },
      levelPushKey(set, nodes, arr, index) {
        for (let node of nodes) {
          if (set.has(node.key)) {
            this.removeChildKey(set, node)
            arr[index].push(node.key)
          } else if (node.children) {
            this.levelPushKey(set, node.children, arr, index + 1)
          }
        }
      },
      removeChildKey(set, parentNode) {
        let nodes = parentNode.children
        if (!nodes) {
          return
        }
        for (let node of nodes) {
          this.removeChildKey(set, node)
          set.delete(node.key)
        }

      }
    }
  }
</script>