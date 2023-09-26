<template>
    <a-card :loading="echartLoading" size="small" :title="title" :body-style="{padding: '0 10px'}" hoverable>
        <!--<div class="t-c">{{title}}</div>-->
        <a-dropdown slot="extra">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{chartSelectDict[chartSelect]}} <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
                <a-menu-item v-for="(item,index) in chartSelectDict" :key="index" @click="chartSelect = index">
                    {{item}}
                </a-menu-item>
            </a-menu>
        </a-dropdown>
        <echart height="200px" :type="chartSelect" :option="echartOption" :title="title" :legendShow="false"
                v-if="echartOption"></echart>
        <a-empty v-else></a-empty>
    </a-card>
</template>

<script>
  import { getAction,postAction } from '@/api/manage'
  import echart from '@/pages/probe/case/echart.vue'
  export default {
    name: 'MiniEchart',
    props: ['params', 'field', 'isDWS', 'title'],
    components: {echart},
    data() {
      return {
        echartLoading: false,
        chartSelect: 'bar',
        echartOption: undefined,
        chartSelectDict: {
          'bar': '柱状图',
          'line': '折线图',
          'pie': '饼状图'
        },
      }
    },
    watch: {
      params(val){
        console.log('MiniEchart.params',val)
        if(val){
          this.loadData(this.field)
        }
      }
    },
    methods: {
      loadData(facetField,name = '全部') {
        let min, max
        if (name !== '全部') {
          if (name.indexOf("~") === -1) {
            this.$message.warning('不能够下钻，已到最底部')
            return
          } else {
            [min, max] = name.split('~')
          }
        }
        this.echartLoading = true
        postAction(this.$suncare_v3 + "/engine/trail/echart",{
          ...this.params, facetField: facetField, min, max,
          gapType: 'eq', isDWS: this.isDWS
        }).then(res => {
          if (res.success) {
            this.echartOption = res.result;
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.echartLoading = false;
        })
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
