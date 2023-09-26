<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <div class="fieldset-box1">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item  label="标签类型" style="margin-bottom:4px;">
                <a-select v-model="bean.tagType" @change="selectTagType">
                  <a-select-option value="tagStat">标签结果汇总</a-select-option>
                  <a-select-option value="org">医院标签</a-select-option>
                  <a-select-option value="patient">患者标签</a-select-option>
                  <a-select-option value="doctor">医生标签</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8" v-show="bean.tagType!='tagStat'">
              <a-form-item  label="标签名称" style="margin-bottom:4px;">
                <a-select
                  show-search
                  allowClear
                  v-model="tagNameId"
                  placeholder="请选择标签名称"
                  :dropdownMatchSelectWidth="false"
                  @change="selectTag"
                >
                  <a-select-option value="" v-if="bean.tagType=='patient'">患者标签汇总</a-select-option>
                  <a-select-option value="" v-else-if="bean.tagType=='doctor'">医生标签汇总</a-select-option>
                  <a-select-option value="" v-else-if="bean.tagType=='org'">可疑就诊标签汇总</a-select-option>
                  <a-select-option value="" v-else>请选择标签名称</a-select-option>
                  <a-select-option  v-for="(item,index) in tagList" :value="item.NAME+'#'+item.TAG_INDEX" :key="item.NAME+'#'+item.TAG_INDEX">{{item.TAGNAME}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="bean.tagType=='patient'">
              <a-col :md="8" :sm="8">
                <a-form-item label="患者ID" style="margin-bottom:4px;">
                  <a-input placeholder="请输入患者ID，多个患者ID用#分隔" v-model="bean.clientid"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="患者姓名" style="margin-bottom:4px;">
                  <a-input placeholder="请输入患者姓名，多个患者姓名用#分隔" v-model="bean.clientname"></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="bean.tagType=='doctor'">
              <a-col :md="8" :sm="8">
                <a-form-item label="科室" style="margin-bottom:4px;">
                  <a-input placeholder="请输入科室名称，多个科室名称用#分隔" v-model="bean.deptname"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="医生姓名" style="margin-bottom:4px;">
                  <a-input placeholder="请输入医生姓名，多个医生姓名用#分隔" v-model="bean.doctorname"></a-input>
                </a-form-item>
              </a-col>
            </template>

          </a-row>
        </div>
      </a-form>

    </div>
  </div>
</template>

<script>
export default {
  name: "yearForm",
  data () {
    return {
      description: '数据挖掘分析表单',
      tagList:[],
      bean:{tagId:'',tagType:'tagStat',taskType:'tagStatistics'},
      tagNameId:'',
    }
  },
  methods: {
    selectTag(val){
      let selectArr = this.tagList.filter(item=>item.NAME+'#'+item.TAG_INDEX == val);
      if(selectArr.length>0){
        this.bean.tagName = selectArr[0].NAME
        this.bean.taskType = selectArr[0].TAG_TYPE
        this.bean.tagId = selectArr[0].TAG_INDEX
      }else{
        this.bean.tagName=''
        this.bean.taskType='riskStatistics'
        if(this.bean.tagType=='patient'){
          this.bean.taskType = 'patientRiskGroupStatistics'
        }else if(this.bean.tagType=='doctor'){
          this.bean.taskType = 'doctorRiskGroupStatistics'
        }else if(this.bean.tagType=='org'){
        this.bean.taskType = 'suspiciousGroupStatistics'
        }
      }
      let parentTagType= this.bean.tagName?this.bean.tagName:this.bean.tagType
      //医院标签  动态改变列表项
      if(this.bean.tagType=='org'||parentTagType){
        if(this.bean.taskType=='suspiciousGroupStatistics'){
          parentTagType = ''
        }
        this.$emit('selectOrgRiskTag',this.bean.taskType,parentTagType);
      }
    },
    selectTagType(val){
      this.$emit('changeTagType',val);
      if(val=='patient'){
        this.bean.taskType = 'patientRiskGroupStatistics'
      }else if(val=='doctor'){
        this.bean.taskType = 'doctorRiskGroupStatistics'
      }else if(val=='tagStat'){
        this.bean.taskType = 'tagStatistics'
      }else if(val=='org'){
        this.bean.taskType = 'suspiciousGroupStatistics'
      }
      this.bean.tagName=''
    },

    clearExcelTable(){
      this.bean = Object.assign({}, {tagId:this.bean.tagId,tagType:this.bean.tagType,taskType:this.bean.taskType})
      this.tagNameId = ''
    },

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
