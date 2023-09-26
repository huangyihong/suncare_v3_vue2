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
        default: 'chart'
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
        default: '某项比率'
      },
      data: {
        type: Object,
        default: {value: 50.0, name: '比率'}
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
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      option(val){
        if(!val){
          return
        }
        if(!this.chart){
          this.$nextTick(() => {
            this.initChart()
          })
        } else {
          this.chart.setOption(this.getOption(this.type), true)
        }
      },
      type(val) {
        if(this.option){
          this.chart.setOption(this.getOption(val), true)
        }

      }
    },
    methods: {
      initChart() {
        this.chart = this.$echarts.init(this.$el, 'macarons')
        this.chart.setOption(this.getOption())
      },
      getOption() {
        return {
          tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
          },
          detail : {//最下边数值的设置
            show : true,
            offsetCenter: ['0', '50'],       // x, y，单位px
            formatter:'{value}%',
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: '#3ebf27',
              fontSize : 18
            }
          },
          series: [
            {
              name: this.title,
              type: 'gauge',
              detail : {//最下边数值的设置
                offsetCenter: ['0', '120'],       // x, y，单位px
                formatter:'{value}%',
                /* textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                   color: '#3ebf27',
                   fontSize : 18
                 }*/
              },
              data: [this.data]
            },
          ],
        }

      }
    }
  }
</script>
