<template>
  <m-modal centered
           title="全年日入院人次散点图"
           :width="1000"
           :destroyOnClose="false"
           @cancel="hide"
           :visible="visible"
           @max="max"
           :showMax="false"
           :footer="null">
    <a-spin :spinning="loading">
      <Scatter :width="width" :height="height" ref="scatter"/>
    </a-spin>

  </m-modal>
</template>

<script>
import Scatter from '@/components/echart/Scatter'
import {getAction } from '@/api/manage'
export default {
  components: {Scatter},
  data() {
    return {
      visible:false,
      loading:false,
      chart: null,
      width:'960px',
      height:'500px',
      url: {
        getDataminingOrgSum: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getDataminingOrgSum",
      },
      data:[ ],
    }
  },
  methods: {
    hide(){
      this.visible = false
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    initChart(queryParam) {
      this.visible = true
      this.loading = true
      getAction(this.url.getDataminingOrgSum, queryParam).then((res) => {
        if (res.success) {
          this.data = []
          res.result.map(t=>{
            this.data.push([t.DDATE,t.ADMIT_CNT])
          })
          this.$nextTick(() => {
            this.$refs.scatter.changeOption(this.getOption())
          })
          this.loading = false
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    getOption() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          },
          formatter: function (param) {
            let data = param[0].data
            return '日期: '+data[0]+ '<br/>'+
              '入院人次: ' + data[1];
          }
        },
        toolbox: {
          show: true,
          feature: {
            dataView:{},
            saveAsImage: {},
          }
        },
        xAxis: {
          type: 'category',
          name: '日期',
        },
        yAxis: {
          type: 'value',
          name: '入院人次',
        },
        series: [
          {
            symbolSize: 10,
            data:this.data,
            type: 'scatter'
          }
        ]
      };
      return option
    }
  }
}
</script>
