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
        default: 'line-stack'
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
      series: {
        type: Object,
        default: []
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
          title: {
            text: this.title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [

          ]
        };
        return option
      }
    }
  }
</script>
