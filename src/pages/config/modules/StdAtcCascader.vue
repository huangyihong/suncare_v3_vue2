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
    state: String,
    placeholder: String,
    defaultValue:[],
  },
  data() {
    return {
      options:[],//树形数据
      url: {
        treeList:"/config/medicalStdAtc/getCascaderTreeList",
        getSelectTreeList:"/config/medicalStdAtc/getCascaderSelectTreeList",
      },
      selectValue:[],
    }
  },
  watch:{
    defaultValue:{
      immediate:true,
      deep:true,
      handler() {
        this.selectValue = this.defaultValue
      },
    },
  },
  beforeMount() {
    if(this.defaultValue&&this.defaultValue.length>0){
      this.initSelectTreeData()//选中值的加载初始树并回显
    }else{
      this.initTreeData()//加载树节点数据
    }
  },
  mounted(){
    if(this.defaultValue){
      this.selectValue = this.defaultValue
    }
  },
  methods: {
    //加载树节点数据
    initTreeData(){
      let param = {state:this.state,levelNum:1}
      getAction(this.url.treeList,param,'get').then((res) => {
        if (res.success) {
          this.options = res.result;
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
      setTimeout(() => {
        targetOption.loading = false;
        let param = {state:this.state,parentCode:targetOption.value,levelNum:selectedOptions.length+1}
        getAction(this.url.treeList,param,'get').then((res) => {
          if (res.success) {
            let children = that.setChildNodes(res.result);
            if(children.length>0){
              targetOption.children = children;
            }else{
              targetOption.isLeaf = true;
            }
            that.options = [...that.options];
          }else{
            that.$message.warning(res.message);
          }
        })
      }, 1000);
    },
    //加载树节点数据
    initSelectTreeData(){
      let param = {state:this.state,parentCodes:this.defaultValue.join(',')}
      getAction(this.url.getSelectTreeList,param,'get').then((res) => {
        if (res.success) {
          this.options = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
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
