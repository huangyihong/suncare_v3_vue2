<template>
  <div>
    <a-cascader :options="options"
                @change="onChange"
                :placeholder="placeholder"
                :loadData="onLoadData"
                changeOnSelect
                allowClear
                v-model="selectValue"/>
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
    },
    data() {
      return {
        options:[],//树形数据
        url: {
          treeList:"/config/medicalOtherDict/getTreeAllList",//获取全部数据  后台redis缓存
          //treeList:"/config/medicalOtherDict/getCascaderTreeList",
          //getSelectTreeList:"/config/medicalOtherDict/getCascaderSelectTreeList",
        },
        selectValue:[],
      }
    },
    watch:{
      defaultValue:{
        immediate:true,
        handler() {
          //this.init()
          this.selectValue = this.defaultValue
        },
      },
    },
    beforeMount() {
      this.init()
    },
    mounted(){

    },
    methods: {
      init () {
//        if(this.defaultValue&&this.defaultValue.length>0){
//          this.initSelectTreeData()//选中值的加载初始树并回显
//        }else{
          this.initTreeData()//加载树节点数据
//        }
      },
      //加载树节点数据
      initTreeData(){
        let param = {dictCname:this.dictCname,dictEname:this.dictEname}
        getAction(this.url.treeList,param,'get').then((res) => {
          if (res.success) {
            this.options = res.result;
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      //加载树节点数据
      initSelectTreeData(){
        this.selectValue = []
        let param = {dictCname:this.dictCname,dictEname:this.dictEname,parentCodes:this.defaultValue.join(',')}
        getAction(this.url.getSelectTreeList,param,'get').then((res) => {
          if (res.success) {
            this.options = res.result
            this.selectValue = this.defaultValue
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      //异步加载树节点
      onLoadData(selectedOptions) {
        let that = this;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
//        setTimeout(() => {
//          targetOption.loading = false;
          let param = {dictCname:that.dictCname,dictEname:that.dictEname,parentCode:targetOption.value}
          getAction(this.url.treeList,param,'get').then((res) => {
            if (res.success) {
              let children = that.setChildNodes(res.result);
              if(children.length>0){
                targetOption.children = children;
              }else{
                targetOption.isLeaf = true;
              }
              that.options = [...that.options]
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            targetOption.loading = false;
          })
//        }, 1000);
      },

      setChildNodes(datas){
        let children = [];
        datas.forEach(function(val){
          let item = {};
          item.label = val.label;
          item.value = val.value;
          item.isLeaf = false;
          children.push(item);
        });
        return children
      },
      //选中节点
      onChange(value,selectedOptions) {
        this.$emit('change',value,selectedOptions)
      },
    }
  }
</script>
<style scoped>
</style>
