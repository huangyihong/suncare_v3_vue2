<template>
  <div>
    <line-stack ref="lineStack" :width="width" :height="height"></line-stack>
  </div>
</template>

<script>
import LineStack from '@/components/echart/LineStack'
export default {
  components: {LineStack},
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
  },
  data() {
    return {
      xdata: [],
      seriesData1:[],
      seriesData2:[],
      seriesData3:[],
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
    initChart(dataSource) {
      this.xdata = []
      this.seriesData1 = []
      this.seriesData2 = []
      this.seriesData3 = []
      dataSource.map(t=>{
        this.xdata.push(t.ddate)
        this.seriesData1.push(t.admitCnt)
        this.seriesData2.push(t.leaveCnt)
        this.seriesData3.push(t.inhospitalCnt)
      })
      this.$nextTick(() => {
        this.$refs.lineStack.changeOption(this.getOption())
      })
    },
    getOption() {
      let option = {
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['入院人次', '出院人次', '在院人次']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView:{},
            saveAsImage: {},
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '入院人次',
            type: 'line',
            stack: '总量',
            data: this.seriesData1
          },
          {
            name: '出院人次',
            type: 'line',
            stack: '总量',
            data: this.seriesData2
          },
          {
            name: '在院人次',
            type: 'line',
            stack: '总量',
            data: this.seriesData3
          }
        ]
      };
      return option
    }
  }
}
</script>
