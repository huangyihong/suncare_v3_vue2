<template>
  <div style="width: 220px;">
    <a-tree :treeData="treeData" :loadData="onLoadData" @select="onSelect" :expandedKeys="iExpandedKeys" @expand="onExpand" style="width: 220px;"/>
  </div>

</template>
<script>
  const treeDataInit = [
    {
      title: '全部',
      key: '',
      children:[

      ]
    }
  ]
  import { getAction } from '@/api/manage'
  export default {
    components: {

    },
    props: {
      mdcCatalogV: String,
      adrgCatalogV: String,
      showCode:Boolean,
    },
    data() {
      return {
        treeData:[],//树形数据
        treeDataInit,
        url: {
          treeList:"/drg/drgCatalogDetail/getTreeList",
        },
        iExpandedKeys:[''],
      }
    },
    beforeMount() {
      this.initTreeData();//加载树节点数据

    },
    mounted(){
    },
    methods: {
      //加载树节点数据
      initTreeData(){
        if(!this.mdcCatalogV){
          return;
        }
        var param = {mdcCatalogV:this.mdcCatalogV}
        getAction(this.url.treeList,param,'get').then((res) => {
          if (res.success) {
            let children = this.setChildNodes(res.result,this.adrgCatalogV?false:true,'');
            this.treeData = this.treeDataInit;
            this.treeData[0].children = children;
            this.iExpandedKeys = [''];
          }else{
            var that=this;
            that.$message.warning(res.message);
          }
        })
      },
      //异步加载树节点
      onLoadData(treeNode) {
        let that = this;
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve();
            return;
          }
          setTimeout(() => {
            var param = {adrgCatalogV:that.adrgCatalogV,mdcCatalogCode:treeNode.dataRef.key}
            getAction(this.url.treeList,param,'get').then((res) => {
              if (res.success) {
                if(res.result.length==0){
                  treeNode.dataRef.isLeaf = true
                }else{
                  let children = that.setChildNodes(res.result,true,treeNode.dataRef.key);
                  treeNode.dataRef.children  = children;
                }
                that.treeData = [...this.treeData];
                resolve();
              }else{
                that.$message.warning(res.message);
              }
            })
          }, 1000);
        });
      },
      onExpand(expandedKeys) {
        this.iExpandedKeys = expandedKeys
      },
      //点击树节点
      onSelect(selectedKeys, info) {
        if(info.selectedNodes[0]){
          console.log('selectNodeInfo',info.selectedNodes[0])
          this.$emit('selectNode',selectedKeys[0])
          this.$emit('selectNodeInfo',info.selectedNodes[0])
        }
      },
      setChildNodes(datas,isLeaf,parent){
        let that = this;
        let children = [];
        datas.forEach(function(val,index,arr){
          let item = {};
          if(that.showCode){
            item.title = '('+val.code+')'+val.name;
          }else{
            item.title = val.name;
          }

          item.key = val.code;
          item.isLeaf = isLeaf
          item.parent = parent
          children.push(item);
        });
        return children
      },
    }
  }
</script>
<style scoped>
</style>
