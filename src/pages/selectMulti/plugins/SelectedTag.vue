<template>
    <div @click="showSelectTags = !showSelectTags">

      <div class="ant-alert ant-alert-info m-b-8">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowRecords.length }}</a>项
        <!--{{Object.keys($listeners)}}-->
        <a style="margin-left: 24px" @click.stop="doAction('clear')">清空</a>
        <a style="margin-left: 24px" @click.stop="doAction('selectAllPage')" v-if="$listeners.selectAllPage">全选</a>
        <a style="margin-left: 24px" @click.stop="doAction('invertAllPage')" v-if="$listeners.invertAllPage">反选</a>
        <template v-if="$listeners.invertAll">
          <a style="margin-left: 24px" @click.stop="doAction('invertAll')">反选全部</a>
          <a-tooltip title="不按条件过滤选择" class="m-l-6">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
        </template>

        <a style="float:right;;margin-right: 10px">
          <a-icon type="right" :style="{transform: `rotate(${showSelectTags?'90':'0'}deg)`}"
                  style="transition: all 0.3s"/>
        </a>
      </div>
      <div style="margin-bottom:8px;" v-if="showSelectTags">
        <template v-for="(item,index) in selectedRowRecords.length <= 50?selectedRowRecords:selectedRowRecords.slice(0,50)">
          <a-tag closable @close="doAction('remove',index)" :key="item[code]" style="margin-top: 3px">
            <j-ellipsis :value="item[name]" :length="10"/>
          </a-tag>
        </template>
        <template v-if="selectedRowRecords.length > 50">
          <a-tag style="margin-top: 3px">
            ...+{{selectedRowRecords.length - 50 }}项
          </a-tag>
        </template>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'SelectedTag',
    components: {},
    props:{
      selectedRowRecords: {
        type: Array,
        default: ()=> []
      },
      code: String,
      name: String,
      invertAll: Boolean
    },
    data() {
      return {
        showSelectTags: false,
      }
    },
    methods: {
      doAction(action,param){
        this.$emit(action, param)
      }
    },
  }
</script>
<style scoped>

</style>
