<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import resize from '@/mixins/chartResize'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      xAxis: {
        type: Array,
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      series: {
        type: Object,
        default: {
          name: "示例",
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      },
      xShow: {
        type: Boolean,
        default: true
      },
      yShow: {
        type: Boolean,
        default: true
      }

    },
    data() {
      return {
        chart: null,
      }
    },
    mounted() {
      this.initChart()
    },
    watch: {
      series(){
        this.chart.setOption(this.getOption(),true)
      }
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = this.$echarts.init(this.$el, 'macarons')
        this.chart.setOption(this.getOption(),true)
        this.chart.on('click', (params) => {
          this.$emit('click',params)
        });
      },
      getOption() {
        let option = {
          grid: {
            top: 20,
            left: 0,
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          xAxis: [{
            type: 'category',
            data: this.xAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              rotate: 20,
              formatter: function (value) {
                let res = value;
                if (res.length > 8) {
                  res = res.substring(0, 8) + "..";
                }
                return res;
              }
            },
            show: this.xShow
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            show: this.yShow
          }],
          series: [{
            type: 'bar',
            barWidth: '60%',
            barMaxWidth: 40,
            ...this.series
          }]
        }
        return option
      }
    }
  }
</script>
