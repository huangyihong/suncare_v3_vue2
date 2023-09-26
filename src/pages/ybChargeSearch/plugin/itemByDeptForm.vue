<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <div class="fieldset-box1">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
            <a-form-item  label="科室名称" style="margin-bottom:4px;">
              <a-select
                show-search
                allowClear
                mode="multiple"
                :max-tag-count="3"
                v-model="bean.deptname"
                placeholder="模糊检索,多个科室检索用#分隔"
                :filter-option="filterOption"
              >
                <a-select-option  v-for="(item,index) in deptList" :value="item.DEPTNAME" :key="item.DEPTNAME">{{item.DEPTNAME}}</a-select-option>
              </a-select>
            </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item style="margin-bottom:4px;">
                <a-checkbox-group  @change="selectType">
                  <a-checkbox value="deptStatistics">科室就诊金额前10</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>

    </div>
  </div>
</template>

<script>
export default {
  name: "itemByDeptForm",
  data () {
    return {
      description: '医保收费项目汇总按科室表单',
      deptList:[],
      bean:{},
    }
  },
  methods: {
    //科室查询过滤
    filterOption(input, option) {
      let val = input
      let item = option.componentOptions.children[0].text

      if(val == item){//把value相同的搜索出来
        return true;
      }
      if(item.indexOf(val) != -1){//名称中包含的搜索出来
        return true;
      }
      if(val){
        val = val.replace(/，/ig,',');
        var valArr1 = val.split('#')
        for(var j = 0; j < valArr1.length; j++) {
          var flag = true;
          var valArr2 = valArr1[j].split(',')
          for(var i = 0; i < valArr2.length; i++) {
            if(item.indexOf(valArr2[i]) == -1){//不包含
              flag =  false
            }
          }
          if(flag){
            return true
          }
        }
        return false
      }
      return false;//不知道的就不管了
    },
    selectType(vals){
      if(vals&&vals.length>0){
        this.bean.taskType = vals.join(',')
      }else{
        delete this.bean.taskType
      }
    }

  }
}
</script>
<style lang="less" scoped>
  .rotate90{
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .fieldset-box1 {
    padding: 16px;
    border: 1px solid rgb(153,153,153);
    border-radius: 2px;
    //display: inline-block;
    width: 100%;
    position: relative;
    margin: 0 0 16px;
    transition: all 0.2s;
  }
</style>
