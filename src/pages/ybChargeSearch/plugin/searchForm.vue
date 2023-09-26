<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <template v-for="(item,index) in excelTableData">
          <div class="fieldset-box1 " style="float:left" :style="{width:'calc(100% - 50px)'}">
            <div style="float:left" :style="{width:'calc(100% - 20px)'}">
              <a-row :gutter="24">
                <a-col :md="6" :sm="12">
                  <a-form-item label="收费项目A关键字" style="margin-bottom:10px;">
                    <a-input placeholder="请输入收费项目A关键字" v-model="item.itemname"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="12">
                  <a-form-item label="收费项目B关键字" style="margin-bottom:10px;">
                    <a-input placeholder="请输入收费项目B关键字" v-model="item.itemname1"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="12">
                  <a-form-item label="收费项目名称类型" style="margin-bottom:10px;">
                    <m-dict-select-tag v-model="item.itemType" dictCode="ITEM_TYPE" :required="true"></m-dict-select-tag>
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="12">
                  <a-form-item label="重复收费类型" style="margin-bottom:10px;">
                    <m-dict-select-tag v-model="item.item1Type" dictCode="ITEM1_TYPE" :required="true"></m-dict-select-tag>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24" v-if="item.toggleStatus">
                <a-col :md="6" :sm="8">
                  <a-form-item label="收费项目B违规判断" style="margin-bottom:10px;">
                    <m-dict-select-tag v-model="item.item1Wgtype" dictCode="ITEM1_WGTYPE" :required="true"></m-dict-select-tag>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="超量检查的类型" style="margin-bottom:10px;">
                    <m-dict-select-tag v-model="item.qtyType" dictCode="QTY_TYPE" :required="true"></m-dict-select-tag>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="超量的数值(不含)" style="margin-bottom:10px;">
                    <a-input-number placeholder="请输入超量的数值" v-model="item.qtyNum" style="width:100%"></a-input-number>
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="8">
                  <a-form-item label="是否输出同一天的手术项目" style="margin-bottom:10px;">
                    <m-dict-select-tag v-model="item.isSameDay" dictCode="YESNO" :required="true"></m-dict-select-tag>
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="6">
                  <a-form-item label="违规案例提示" style="margin-bottom:10px;">
                    <a-input placeholder="请输入违规案例提示" v-model="item.wgRemark"></a-input>
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
const excelTableBean= {itemname:'',itemname1:'',itemType:'yb',item1Type:'oneday',item1Wgtype:'haveB',qtyType:'charge_qty',qtyNum:'',isSameDay:'0',
                     wgRemark:'', toggleStatus:true}
export default {
  name: "searchForm",
  components: {
    MDictSelectTag
  },
  data () {
    return {
      description: '收费明细查询表单',
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
