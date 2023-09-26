<template>
  <div class="box table-page-search-wrapper">
    <a-form :form="form" layout="inline">
    <template v-for="(item,index) in excelTableData">
      <a-row :gutter="24" style="margin-bottom:6px;">
        <a-col :md="2" class="t-r"><span class="title">条件{{index+1}}:</span></a-col>
        <a-col :md="2" class="colitem">
          <a-form-item :required="true" :validateStatus="item.logic_validateStatus" :help="item.logic_help" v-if="index>0">
          <a-select placeholder="请选择" v-model="item.logic" @change="(v)=>handleChangeCol(v,index,'logic')">
            <a-select-option value="and"> 且</a-select-option>
            <a-select-option value="or"> 或</a-select-option>
            <a-select-option value="not"> 非</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="3" class="colitem">
          <a-form-item :required="true" :validateStatus="item.whereType_validateStatus" :help="item.whereType_help" >
          <a-select placeholder="请选择" allowClear v-model="item.whereType" @change="(v)=>handleChangeCol(v,index,'whereType')">
            <a-select-option  value="age">年龄</a-select-option>
            <a-select-option  value="dayAge">天龄</a-select-option>
            <a-select-option  value="weight">出生体重(g)</a-select-option>
            <a-select-option  value="zyDays">住院天数</a-select-option>
            <a-select-option  value="leavetype">离院方式</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="3" class="colitem">
          <a-form-item :required="true" :validateStatus="item.compareType_validateStatus" :help="item.compareType_help" >
          <a-select placeholder="请选择" v-model="item.compareType"  @change="(v)=>handleChangeCol(v,index,'compareType')">
            <a-select-option value=">" v-if="item.whereType!='leavetype'"> ></a-select-option>
            <a-select-option value=">=" v-if="item.whereType!='leavetype'"> >=</a-select-option>
            <a-select-option value="="> =</a-select-option>
            <a-select-option value="<=" v-if="item.whereType!='leavetype'"> <=</a-select-option>
            <a-select-option value="<" v-if="item.whereType!='leavetype'"> <</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="3" class="colitem">
          <a-form-item :required="true" :validateStatus="item.compareValue_validateStatus" :help="item.compareValue_help" >
            <a-input placeholder="请输入值" v-model="item.compareValue" @blur="(e)=>handleChangeCol(e.target.value,index,'compareValue')" v-if="item.whereType!='leavetype'"/>
            <a-select placeholder="请选择" v-model="item.compareValue"  @change="(v)=>handleChangeCol(v,index,'compareValue')" v-else>
              <a-select-option  value="1">医嘱离院</a-select-option>
              <a-select-option  value="2">医嘱转院</a-select-option>
              <a-select-option  value="3">医转社区卫生服务机构/乡镇卫生院</a-select-option>
              <a-select-option  value="4">非医嘱离院</a-select-option>
              <a-select-option  value="5">死亡</a-select-option>
              <a-select-option  value="9">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="3" class="colitem" >
          <a-form-item :required="true" :validateStatus="item.compareLogic_validateStatus" :help="item.compareLogic_help" v-if="item.whereType!='leavetype'">
          <a-select placeholder="请选择" v-model="item.compareLogic" @change="(v)=>handleChangeCol(v,index,'compareLogic')">
            <a-select-option value="and"> 且</a-select-option>
            <a-select-option value="or"> 或</a-select-option>
            <a-select-option value="not"> 非</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="3" class="colitem" >
          <a-form-item :required="true" :validateStatus="item.compareType2_validateStatus" :help="item.compareType2_help" v-if="item.whereType!='leavetype'">
          <a-select placeholder="请选择" v-model="item.compareType2" @change="(v)=>handleChangeCol(v,index,'compareType2')">
            <a-select-option value=">"> ></a-select-option>
            <a-select-option value=">="> >=</a-select-option>
            <a-select-option value="="> =</a-select-option>
            <a-select-option value="<="> <=</a-select-option>
            <a-select-option value="<"> <</a-select-option>
          </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="3" class="colitem" >
          <a-form-item :required="true" :validateStatus="item.compareValue2_validateStatus" :help="item.compareValue2_help" v-if="item.whereType!='leavetype'">
          <a-input placeholder="请输入值" v-model="item.compareValue2" @blur="(e)=>handleChangeCol(e.target.value,index,'compareValue2')"/>
          </a-form-item>
        </a-col>
        <a-col :md="2" class="colitem">
          <a-icon type="plus-circle" class="m-r-10 icon" @click="addExcelTable"></a-icon>
          <a-icon type="minus-circle" class="icon" @click="delExcelTable(index)" v-if="excelTableData.length>1"></a-icon>
        </a-col>
      </a-row>
    </template>
    </a-form>
  </div>
</template>

<script>
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
const excelTableBean= {logic:undefined,whereType:undefined,compareType:undefined,compareValue:'',compareLogic:undefined,compareType2:undefined,compareValue2:'',
  }
export default {
  name: "ConditionForm",
  components: {
    MDictSelectTag
  },
  data () {
    return {
      form: this.$form.createForm(this),
      description: '分组条件限制',
      excelTableData:[Object.assign({}, excelTableBean)],
    }
  },
  methods: {
    addExcelTable(){
      let bean = Object.assign({}, excelTableBean);
      this.excelTableData.push(bean)
    },
    delExcelTable(data_index){
      this.excelTableData.splice(data_index,1)
    },
    clearExcelTable(){
      this.excelTableData = [Object.assign({}, excelTableBean)]
    },
    handleChangeCol(value,index,colname){
      if(value){
        this.excelTableData[index][colname+'_help']=''
        this.excelTableData[index][colname+'_validateStatus']=''
      }
      if(colname=='whereType'&&value=='leavetype'){
        this.excelTableData[index].compareType = '='
        this.excelTableData[index].compareLogic = undefined
        this.excelTableData[index].compareType2 = undefined
        this.excelTableData[index].compareValue2 = undefined
      }
    },
    validate(){
      let flag = false
      let cols = ['logic','whereType','compareType','compareValue']
      this.excelTableData.forEach(function(vo,index){
        cols.forEach(function(col,colIndex){
          if(!(index==0&&colIndex==0)&&!vo[col]){
            vo[col+'_help']='必填'
            vo[col+'_validateStatus']='error'
            flag = true
            console.log(index,colIndex,vo[col])
          }else{
            vo[col+'_help']=''
            vo[col+'_validateStatus']=''
          }
        })
      })
      if(flag){
        this.$forceUpdate()
      }
      return flag
    }

  }
}
</script>
<style lang="less" scoped>
  .box{
    margin-top:-20px;
    margin-bottom:10px
  }
  .title{
    line-height: 30px;
  }
  .colitem{
    padding-left: 4px!important;
    padding-right: 0px!important;
  }
 .icon{
   line-height: 30px;
   color:green;
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item{
    margin-bottom:10px!important;
  }


</style>
