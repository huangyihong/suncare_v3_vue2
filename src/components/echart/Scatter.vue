<template>
  <div :class="className" :style="{height:height,width:width}" style="min-width: 250px"></div>
</template>

<script>
  import resize from '@/mixins/chartResize'
  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'scatter'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      },
      title: {
        type: String,
        default: ''
      },
      xAxis: {
        type: Object,
        default: {
          type: 'category',
          name: '日期',
        },
      },
      yAxis: {
        type: Object,
        default: {
          type: 'value',
          name: '入院人次',
        },
      },
      series: {
        type: Object,
        default: {
          symbolSize: 10,
          data:[],
          type: 'scatter'
        }
      },
    },
    data() {
      return {
        chart: null,
      }
    },
    mounted() {
      this.initChart()
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      series(){
        this.chart.setOption(this.getOption(),true)
      }
    },
    methods: {
      initChart() {
        this.chart = this.$echarts.init(this.$el, 'macarons')
        this.chart.setOption(this.getOption())
      },
      changeOption(option){
        if(!this.chart){
          this.$nextTick(() => {
            this.initChart()
          })
        } else {
          this.chart.setOption(option, true)
        }
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
          },
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series
        };
        return option
      }
    }
  }
</script>
