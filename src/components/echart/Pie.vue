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
        default: '400px'
      },
      title: {
        type: String,
        default: '名称'
      },
      data: {
        type: Array,
        default: [{value:335, name:'直接访问'},
          {value:310, name:'邮件营销'},
          {value:274, name:'联盟广告'},
          {value:235, name:'视频广告'},
          {value:400, name:'搜索引擎'}
        ]
      },
      legendShow:{
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
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      data(){
        this.chart.setOption(this.getOption(),true)
      }
    },
    methods: {
      initChart() {
        this.chart = this.$echarts.init(this.$el, 'macarons')
        this.chart.setOption(this.getOption())
        this.chart.on('click', (params) => {
          this.$emit('click',params)
        });
      },
      getOption() {
        let option =  {
          grid: {
            top: 20,
            left: 0,
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [{
            type: 'pie',
            radius: ['10%', '80%'],
            center: ['50%', '55%'],
            // roseType: 'area',
            name: this.title,
            data: this.data
          }]
        }

        console.log('this.legendShow',this.legendShow)
        if(this.legendShow){
          option.legend = {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: Array.from(this.data, item => item.name)
          }
        }
        return option
      }
    }
  }
</script>
