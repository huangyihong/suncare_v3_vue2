<template>
  <div>
    <a-tree-select
      v-model="selectValue"
      tree-data-simple-mode
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      :placeholder="placeholder"
      :load-data="onLoadData"
      @select="onSelect"
    />
  </div>

</template>
<script>
  import { getAction } from '@/api/manage'
  export default {
    components: {

    },
    props: {
      dictCname: String,
      dictEname: String,
      placeholder: String,
      defaultValue:[],
      showCode:Boolean,
    },
    data() {
      return {
        treeData:[],//树形数据
        url: {
          treeList:"/config/medicalOtherDict/getTreeList",
        },
        selectValue:[],
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
      },
      defaultValue:{
        immediate:true,
        handler() {
          this.selectValue = this.defaultValue
        },
      },
    },
    beforeMount() {
      this.initTreeData();//加载树节点数据
    },
    mounted(){
      if(this.defaultValue){
        this.selectValue = this.defaultValue
      }
    },
    methods: {
      //加载树节点数据
      initTreeData(){
        var param = {dictCname:this.dictCname,dictEname:this.dictEname}
        getAction(this.url.treeList,param,'get').then((res) => {
          if (res.success) {
            this.treeData = this.setChildNodes(res.result,null);
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
          setTimeout(() => {
            var param = {dictCname:that.dictCname,dictEname:that.dictEname,parentCode:treeNode.dataRef.id}
            getAction(this.url.treeList,param,'get').then((res) => {
              if (res.success) {
                let children = that.setChildNodes(res.result,treeNode.dataRef.id);
                this.treeData = this.treeData.concat(children)
                resolve();
              }else{
                that.$message.warning(res.message);
              }
            })
          }, 1000);
        });
      },
      setChildNodes(datas,parentCode){
        let that = this;
        let children = [];
        datas.forEach(function(val,index,arr){
          let item = {};
          if(that.showCode){
            item.title = '('+val.code+')'+val.value;
          }else {
            item.title = val.value;
          }
          item.id = val.code
          item.pId = parentCode
          item.value = val.value
          children.push(item);
        });
        return children
      },
      onSelect(value, node, extra) {
        this.$emit('select',value,node.dataRef)
      },

    }
  }
</script>
<style scoped>
</style>
