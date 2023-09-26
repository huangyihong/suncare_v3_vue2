<template>
    <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            :load-data="onLoadData"
            @expand="onExpand"
            @select="onSelect"
            @check="onCheck"
    />
</template>
<script>
  import { getAction } from '@/api/manage'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'

  export default {
    props: {
      allDs: {
        type: Boolean,
        default: false
      }
    },
    data() {
      this.url = {
        queryProjectList: '/task/taskProject/queryList',
        queryBatchList: '/task/taskProjectBatch/queryList'
      }
      return {
        expandedKeys: [],
        checkedKeys: [],
        selectedKeys: [],
        treeData: [],
        selectedRowKeys:[],
        selectedRowRecords:[],
        selectProjectId:'',//选中的项目Id
      };
    },
    beforeMount(){
      this.loadData()
    },
    watch: {
      checkedKeys(val) {
        console.log('onCheck111', val);
      },
    },
    methods: {
      loadData(){

        this.$util.initDict('SOLR_DATA_SOURCE').then(data => {
          if(this.allDs){
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
                isDs: true,
                disabled: true //不能跨项目选中
              }
            ]
            this.expandedKeys = [ds]
          }

        })
      },
      onLoadData(treeNode) {
        return new Promise(resolve => {
          let nodeData = treeNode.dataRef
          if (nodeData.children) {
            resolve();
            return;
          }
          if(nodeData.isDs){
            getAction(this.url.queryProjectList, {dataSource: nodeData.key}).then(res => {
              if (res.success) {
                nodeData.children = res.result.map(r => {
                  return ({
                    title: r.projectName,
                    key: r.projectId,
                    isProject: true,
                    disabled: false
                  })
                })
                this.treeData = [...this.treeData];
              } else {
                this.$message.warning(res.message);
              }
            }).catch(e => {
              this.$message.error("获取数据失败：" + e.message)
            }).finally(() => {
              resolve();
            })
          }

          if(nodeData.isProject){
            getAction(this.url.queryBatchList, {projectId: nodeData.key}).then(res => {
              if (res.success) {
                nodeData.children = res.result.map(r => {
                  return ({
                    title: r.batchName,
                    key: r.batchId,
                    isLeaf: true,
                    projectId:nodeData.key,
                    disabled:nodeData.disabled
                  })
                })
                this.treeData = [...this.treeData];
              } else {
                this.$message.warning(res.message);
              }
            }).catch(e => {
              this.$message.error("获取数据失败：" + e.message)
            }).finally(() => {
              resolve();
            })
          }
        });
      },
      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
      },
      onCheck(checkedKeys,info) {
        this.checkedKeys = checkedKeys;
        this.disabledProejctCheck(checkedKeys,info)
      },
      onSelect(selectedKeys, info) {
        this.selectedKeys = selectedKeys;
      },
      getSelect(){
        let set = new Set(this.checkedKeys)
        // 0：数据源， 1：项目 2：批次
        let array = [[],[],[]]
        this.levelPushKey(set, this.treeData, array, 0)
        console.log('array',array)
        return array
      },
      levelPushKey(set, nodes, arr, index){
        for(let node of nodes){
          if(set.has(node.key)){
            this.removeChildKey(set, node)
            arr[index].push(node.key)
          } else if(node.children){
            this.levelPushKey(set, node.children, arr, index + 1)
          }
        }
      },
      removeChildKey(set, parentNode){
        let nodes = parentNode.children
        if(!nodes){
          return
        }
        for(let node of nodes){
          this.removeChildKey(set, node)
          set.delete(node.key)
        }
      },
      //不能跨项目选中 只能选中一个项目
      disabledProejctCheck(checkedKeys,info){
        let nodeData = info.node.dataRef
        let projectId = ''
        if(checkedKeys.length>0){
          projectId = nodeData.isProject?nodeData.key:nodeData.projectId
        }
        for(let node of this.treeData){
          if(node.children){
            for(let node2 of node.children){
              if(!projectId||node2.key==projectId){
                node2.disabled = false
              }else{
                node2.disabled = true
              }
              if(node2.children){
                for(let node3 of node2.children){
                  node3.disabled = node2.disabled
                }
              }
            }
          }
        }
      }
    },
  };
</script>