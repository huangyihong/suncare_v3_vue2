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
      dictCname: String,
      dictEname: String,
      showCode:Boolean,
    },
    data() {
      return {
        treeData:[],//树形数据
        treeDataInit,
        url: {
          treeList:"/config/medicalOtherDict/getTreeList",
        },
        iExpandedKeys:[''],
      }
    },
    watch:{
      dictCname:{
        handler() {
          this.initTreeData();
        },
      },
      dictEname:{
        handler() {
          this.initTreeData();
        },
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
        var param = {dictCname:this.dictCname,dictEname:this.dictEname}
        getAction(this.url.treeList,param,'get').then((res) => {
          if (res.success) {
            let children = this.setChildNodes(res.result);
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
            var param = {dictCname:that.dictCname,dictEname:that.dictEname,parentCode:treeNode.dataRef.key}
            getAction(this.url.treeList,param,'get').then((res) => {
              if (res.success) {
                let children = that.setChildNodes(res.result);
                treeNode.dataRef.children  = children;
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
          this.$emit('selectNode',selectedKeys[0])
          this.$emit('selectNodeInfo',info.selectedNodes[0])
        }
      },
      setChildNodes(datas){
        let that = this;
        let children = [];
        datas.forEach(function(val,index,arr){
          let item = {};
          if(that.showCode){
            item.title = '('+val.code+')'+val.value;
          }else{
            item.title = val.value;
          }

          item.key = val.code;
          children.push(item);
        });
        return children
      },
    }
  }
</script>
<style scoped>
</style>
