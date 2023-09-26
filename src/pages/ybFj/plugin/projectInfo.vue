<template>
  <!-- 介绍 -->
  <div class="cardBorder">
    <div class="fb">{{item.projectName}}   <a-tag color="#faad14" style="margin-left: 40px">紧急程度：{{filterDictText(dictOptins.URGENT_LEVEL,item.urgentLevel)||''}}</a-tag></div>
    <div class=" m-t-10 disCC">
      <span class="ft-12 W25">负责人：{{item.actionFzr}}</span>
      <span class="ft-12 W25">检查计划编号：{{item.projectNo}}</span>
      <span class="ft-12 W25">检查计划模板：标准检查模板</span>
      <span class="ft-12 W25">创建时间：{{item.createTime?item.createTime.substring(0,10):''}}</span>
    </div>
    <div class="disCC">
      <span class="ft-12 W25">当前状态：{{filterDictText(dictOptins.FJ_PROJECT_STATE,item.projectState)||''}}</span>
      <span class="ft-12 W25">检查小组：{{item.actionTeam}}</span>
      <span class="ft-12 W25">检查开始时间：{{item.actionDate}}</span>
      <span class="ft-12 W25">检查时间范围：{{item.checkStartdate}}~{{item.checkEnddate}}</span>
    </div>
    <slot name="eidtProjectBtn"></slot>
  </div>
</template>

<script>

import { filterDictText} from '@/components/dict/JDictSelectUtil'
export default {
  name: "projectInfo",
  props:['item'],
  components: {

  },
  data() {
    return {
      item:{},
      dictOptins:{},
    }
  },
  beforeMount() {
    let keys = ['URGENT_LEVEL', 'FJ_PROJECT_STATE']
    this.$util.initDict(keys).then(obj => {
      this.dictOptins = obj
      for (let key in this.dictOptins){
        this.dictOptins[key] = this.dictOptins[key].map(item =>{
          return {
            text: item.value,
            value: item.code
          }
        })
      }
    })
  },
  methods: {
    filterDictText,
  }
}
</script>
<style lang="less" scoped>
  .disRow {
    display: flex;
    flex-direction: row
  }
  .disCC {
    display: flex;
    justify-content: space-between;
    align-items: center
  }
  .cardBorder {
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    padding: 10px;
  }
  .fb {
    font-weight: bold
  }
  .W25 {
    width: 25%
  }


</style>