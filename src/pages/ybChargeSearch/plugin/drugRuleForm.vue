<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <template v-for="(item,index) in excelTableData">
          <div class="fieldset-box1 " style="float:left" :style="{width:'calc(100% - 50px)'}">
            <div style="float:left" :style="{width:'calc(100% - 20px)'}">
              <a-row :gutter="24">
                <a-col :md="8" :sm="12">
                  <a-form-item label="药品名称" style="margin-bottom:10px;">
                    <a-input placeholder="请输入药品名称" v-model="item.drugName"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="12">
                  <a-form-item label="药品大类" style="margin-bottom:10px;">
                    <a-input placeholder="请输入药品大类" v-model="item.drugType"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="12">
                  <a-form-item label="药品小类" style="margin-bottom:10px;">
                    <a-input placeholder="请输入药品小类" v-model="item.drugTypeSmall"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24" v-if="item.toggleStatus">
                <a-col :md="8" :sm="12">
                  <a-form-item label="限制类型" style="margin-bottom:10px;">
                    <m-dict-select-tag v-model="item.limitType" dictCode="DC_DRUG_LIMIT_TYPE" :required="true"></m-dict-select-tag>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="限制内容" style="margin-bottom:10px;">
                    <a-input placeholder="年龄举例: >=4,<18" v-model="item.limitContent"></a-input>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="12">
                  <a-form-item label="备注" style="margin-bottom:10px;">
                    <a-input placeholder="请输入备注" v-model="item.remark"></a-input>
                  </a-form-item>
                </a-col>

              </a-row>
            </div>
            <div style="width:20px;float:left" class="rotate90">
              <a @click="item.toggleStatus=!item.toggleStatus"  class="m-l-6 " style="font-size:16px;">
                <a-icon :type="item.toggleStatus ? 'double-left' : 'double-right'" />
              </a>
            </div>

          </div>
          <div style="font-size: 20px;color: #aaa;padding:0 16px;width:50px;float:left">
            <a-icon type="plus-circle" class="m-r-10" @click="addExcelTable"></a-icon>
            <a-icon type="minus-circle" @click="delExcelTable(index)" v-if="excelTableData.length>1"></a-icon>
          </div>
        </template>
      </a-form>

    </div>
  </div>
</template>

<script>
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
const excelTableBean= {drugName:'',drugType:'',drugTypeSmall:'',limitType:'age',limitContent:'',remark:'',toggleStatus:true}
export default {
  name: "drugForm",
  components: {
    MDictSelectTag
  },
  data () {
    return {
      description: '药品收费违规查询表单',
      excelTableData:[Object.assign({}, excelTableBean)],
    }
  },
  methods: {
    addExcelTable(){
      let bean = Object.assign({}, excelTableBean);
      bean.toggleStatus = false
      this.excelTableData.push(bean)
    },
    delExcelTable(data_index){
      this.excelTableData.splice(data_index,1)
    },
    clearExcelTable(){
      this.excelTableData = [Object.assign({}, excelTableBean)]
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
