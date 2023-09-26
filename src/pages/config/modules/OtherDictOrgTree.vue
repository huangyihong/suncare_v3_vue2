<template>
  <div>
    <a-tree :treeData="treeData" :loadData="onLoadData" @select="onSelect" :expandedKeys="iExpandedKeys"
            @expand="onExpand"/>
  </div>

</template>
<script>
  import { getAction } from '@/api/manage'

  export default {
    components: {},
    props: {
      showCode: Boolean
    },
    data() {
      return {
        treeData: [{
          title: '全部',
          key: 'ALL',
        }],//树形数据
        url: {
          treeList: '/config/medicalOtherDict/getRegionInOrgTreeList'
          // treeList:"/config/medicalOtherDict/getRegionInOrgTreeList",
        },
        iExpandedKeys: ['ALL'],
        dictEname: 'region'
      }
    },
    watch: {
      dictCname: {
        handler() {
          this.treeData = [{
            title: '全部',
            key: 'ALL',
          }]
        }
      },
      dictEname: {
        handler() {
          this.treeData = [{
            title: '全部',
            key: 'ALL',
          }]
        }
      }
    },

    mounted() {
    },
    methods: {

      //异步加载树节点
      onLoadData(treeNode) {
        let that = this
        return new Promise(resolve => {
          console.log('treeNode.dataRef',treeNode.dataRef)
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            let param = {
              dictCname: that.dictCname,
              dictEname: that.dictEname,
            }
            if(treeNode.dataRef.key !== 'ALL'){
              Object.assign(param, {
                parentCode: treeNode.dataRef.key,
                type: treeNode.dataRef.type
              })
            }
            getAction(this.url.treeList, param, 'get').then((res) => {
              if (res.success) {
                let children = that.setChildNodes(res.result)
                treeNode.dataRef.children = children
                that.treeData = [...this.treeData]
                resolve()
              } else {
                that.$message.warning(res.message)
              }
            })
          }, 1000)
        })
      },
      onExpand(expandedKeys) {
        this.iExpandedKeys = expandedKeys
      },
      //点击树节点
      onSelect(selectedKeys, info) {
        if (info.selectedNodes[0]) {
          this.$emit('selectNode', selectedKeys[0], '')
          this.$emit('selectNodeInfo', info.selectedNodes[0])
        }
      },
      setChildNodes(datas) {
        let that = this
        let children = []
        datas.forEach(function(val, index, arr) {
          let item = {}
          if (that.showCode) {
            item.title = '(' + val.code + ')' + val.value
          } else {
            item.title = val.value
          }

          item.isLeaf = val.actionType === 'VILLAGE_CODE'
          item.type = val.actionType

          item.key = val.code
          children.push(item)
        })
        return children
      }
    }
  }
</script>
<style scoped>
</style>
