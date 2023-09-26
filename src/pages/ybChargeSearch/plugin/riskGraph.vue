<template>
  <m-modal centered
           :title="title"
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
      title:'散点图',
      visible:false,
      loading:false,
      chart: null,
      width:'960px',
      height:'500px',
      url: {
        getDataminingGraphData: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/genTaskTypeResult",
      },
      data:[ ],
      x_meaning:'日期',
      y_meaning:'入院人次',
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
      getAction(this.url.getDataminingGraphData, queryParam).then((res) => {
        if (res.success) {
          this.data = []
          res.result.map(t=>{
            this.data.push([t.X_METER,t.Y_METER])
          })
          if(res.result.length>0){
            this.x_meaning = res.result[0].X_MEANING
            this.y_meaning = res.result[0].Y_MEANING
          }
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
      let that = this
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
            return that.x_meaning+': '+data[0]+ '<br/>'+
              that.y_meaning+': ' + data[1];
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
          name: this.x_meaning,
        },
        yAxis: {
          type: 'value',
          name: this.y_meaning,
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
