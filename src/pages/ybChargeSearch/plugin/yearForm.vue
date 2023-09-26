<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <div class="fieldset-box1">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="功能列表" style="margin-bottom:4px;">
                <a-select  v-model="fnType" @change="selectFnType">
                  <a-select-option value="yearStatistics">年度统计</a-select-option>
                  <a-select-option value="yearUserateStatistics">医保项目使用率汇总</a-select-option>
                  <a-select-option value="yearSurgeryStatistics">医院手术情况统计</a-select-option>
                  <a-select-option value="yearOrgOnlinePatientCount">医院每日在院人数统计</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="显示排序" style="margin-bottom:4px;">
                <a-select show-search v-model="bean.orderby">
                  <template v-if="fnType=='yearStatistics'">
                    <a-select-option value="sum_totalfee">医疗费用总额</a-select-option>
                    <a-select-option value="orgname">机构名称</a-select-option>
                    <a-select-option value="sum_fundpay">基金使用金额</a-select-option>
                    <a-select-option value="total_count">就诊人次</a-select-option>
                    <a-select-option value="zy_count">住院人次</a-select-option>
                    <a-select-option value="mz_count">门诊人次</a-select-option>
                  </template>
                  <template v-else-if="fnType=='yearUserateStatistics'">
                    <a-select-option value="userate">医保项目使用率</a-select-option>
                    <a-select-option value="fee">医疗费用总额</a-select-option>
                  </template>
                  <template v-else-if="fnType=='yearSurgeryStatistics'">
                    <a-select-option value="cnt_sum">全年次数</a-select-option>
                    <a-select-option value="avg_day_cnt">日均次数</a-select-option>
                    <a-select-option value="max_day_cnt">日最大次数</a-select-option>
                  </template>
                  <template v-else-if="fnType=='yearOrgOnlinePatientCount'">
                    <!--<a-select-option value="inhospital_cnt">在院住院人数</a-select-option>
                    <a-select-option value="admit_cnt">每日新增住院人数</a-select-option>
                    <a-select-option value="leave_cnt">每日出院人数</a-select-option>
                    <a-select-option value="yyear">统计年度</a-select-option>-->
                    <a-select-option value="ddate">日期</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="6">
              <a-form-item style="margin-bottom:4px;">
                <a-radio-group  v-model="bean.orderbyType">
                  <a-radio value="desc">降序</a-radio>
                  <a-radio value="asc">升序</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <template v-if="fnType=='yearUserateStatistics'">
              <a-col :md="6" :sm="8">
                <a-form-item label="收费项目大类" style="margin-bottom:4px;">
                  <a-select allowClear mode="multiple" @change="selectItemname">
                    <a-select-option value="药品">药品</a-select-option>
                    <a-select-option value="耗材">耗材</a-select-option>
                    <a-select-option value="诊疗">诊疗</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="fnType=='yearSurgeryStatistics'">
              <a-col :md="6" :sm="8">
                <a-form-item label="手术名称" style="margin-bottom:4px;">
                  <a-input placeholder="请输入手术名称" v-model="bean.surgeryName"></a-input>
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
      description: '年度统计指标表单',
      bean:{orderby:'sum_totalfee',orderbyType:'desc',itemname:'',surgeryName:''},
      fnType:'yearStatistics',
    }
  },
  methods: {
    selectFnType(val){
      this.bean.itemname = ''
      this.bean.surgeryName = ''
      if(val=='yearStatistics'){
        this.bean.orderby = 'sum_totalfee'
      }else if(val=='yearUserateStatistics'){
        this.bean.orderby = 'userate'
      }else if(val=='yearSurgeryStatistics'){
        this.bean.orderby = 'cnt_sum'
      }else if(val=='yearOrgOnlinePatientCount'){
        this.bean.orderby = 'ddate'
        this.bean.orderbyType = 'asc'
      }

      this.$emit('changeYearFnType',val);
    },
    selectItemname(valArr){
      if(valArr&&valArr.length>0){
        this.bean.itemname = valArr.join('|')
      }else{
        this.bean.itemname = ''
      }
    },
    clearExcelTable(){
      this.bean = Object.assign({}, {orderby:this.bean.orderby,orderbyType:this.bean.orderbyType,itemname:'',surgeryName:''})
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
