<template>
  <div  :style="{height:height,width:width}"></div>
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
      default: '500px'
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

      /* var myDate = new Date;
       var year = myDate.getFullYear();
       var i = 1;
       let now = new Date(year, 0, 0);
       let oneDay = 24 * 3600 * 1000;
       var j = true;
       var arrallyeardate = [];
       do {
         now = new Date(+now + oneDay);
         var month = now.getMonth() + 1;
         arrallyeardate.push([now.getFullYear() + "-" + month + "-" + now.getDate(),Math.random()*10]);
         if (month == 12 && now.getDate() == 31) {
           var j = false;
         }
       } while (j)//通过do..while..语句循环查询本年每天日期
      // console.log(arrallyeardate); //打印的是本年每天的日期
      /!* var data = [];
       for (var k = 1; k <= arrallyeardate.length; k++) {
         data.push(randomRange(0, 500))
       }*!/*/

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
            data:
//            arrallyeardate,
              [
                ['2021-01-09', 8.04],
                ['2021-02-09', 6.95],
                ['2021-03-09', 7.58],
                ['2021-04-09', 8.81],
                ['2021-05-09', 8.33],
                ['2021-06-09', 7.66],
                ['2021-07-09', 6.81],
                ['2021-07-09', 6.33],
                ['2021-07-19', 8.96],
                ['2021-07-29', 6.82],
                ['2021-08-09', 7.2],
                ['2021-08-19', 7.2],
                ['2021-08-29', 4.23],
                ['2021-09-09', 7.83],
                ['2021-09-19', 4.47],
                ['2021-09-29', 3.33],
                ['2021-10-09', 4.96],
                ['2021-11-09', 7.24],
                ['2021-12-29', 6.26],
                ['2021-12-29', 8.84],
                ['2021-12-30', 5.82],
                ['2021-12-31', 5.68]
              ],
            type: 'scatter'
          }
        ]
      };
      return option
    }
  }
}
</script>
