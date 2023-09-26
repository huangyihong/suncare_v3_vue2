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
        //树形数据
        treeData: [
          {
            title: '全部',
            key: 'ALL',
            type: 'PROVINCE'
          }
        ],
        url: {
          treeList: '/config/medicalOrgan/getMasterOrgTreeList'
        },
        iExpandedKeys: ['ALL']
      }
    },
    watch: {},
    beforeMount() {
      // this.initTreeData();//加载树节点数据
    },
    mounted() {
    },
    methods: {
      //加载树节点数据
      initTreeData() {
        let param = {}
        getAction(this.url.treeList, param, 'get').then((res) => {
          if (res.success) {
            let children = this.setChildNodes(res.result, null)
            this.treeData[0].children = children
          } else {
            var that = this
            that.$message.warning(res.message)
          }
        })
      },
      //异步加载树节点
      onLoadData(treeNode) {
        let that = this
        return new Promise(resolve => {
          if (treeNode.dataRef.children || !treeNode.dataRef.key) {
            resolve()
            return
          }
          setTimeout(() => {
            let param = treeNode.dataRef.key === 'ALL' ? {} : {
              type: treeNode.dataRef.type,
              parentCode: treeNode.dataRef.key
            }
            getAction(this.url.treeList, param, 'get').then((res) => {
              if (res.success) {
                let children = that.setChildNodes(res.result, treeNode.dataRef.key)
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
        console.dir(info)
        if (info.selectedNodes[0]) {
          if (info.node.dataRef.key) {
            let selectKey = info.node.dataRef.key
            if (selectKey == 'ALL') {
              selectKey = ''
            }
            this.$emit('selectNode', selectKey, '')
          } else {
            let parentKey = info.node.$parent.dataRef.key
            this.$emit('selectNode', parentKey === 'ALL'? '':parentKey, info.node.$parent.dataRef.type + '_CODE')
          }
        }
      },
      setChildNodes(datas, parentCode) {
        let children = []
        datas.filter(item => !item.CODE && item.VALUE === '空值')
          .forEach(val => {
            this.pushChildren(val, children, parentCode)
          })
        datas.filter(item => item.CODE && item.VALUE !== '空值')
          .forEach(val => {
          this.pushChildren(val, children, parentCode)
        })
        return children
      },
      pushChildren(val, children, parentCode) {
        if (parentCode && val.CODE === parentCode) {
          return
        }
        let item = {}
        if (this.showCode) {
          item.title = '(' + val.CODE + ')' + val.VALUE
        } else {
          item.title = val.VALUE
        }

        item.key = val.CODE
        item.type = val.type
        children.push(item)
      }
    }
  }
</script>
<style scoped>
</style>
