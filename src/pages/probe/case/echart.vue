<template>
  <div v-if="option">
    <e-pie :height="height" :title="title" :data="pieData" @click="clickEvent" v-if="type === 'pie'" :legendShow="legendShow"></e-pie>
    <e-bar :height="height" :xAxis="option.xAxis" :series="option.series[0]" @click="clickEvent" v-else-if="type === 'bar'"></e-bar>
    <e-line :height="height" :xAxis="option.xAxis" :series="option.series[0]" @click="clickEvent" v-else></e-line>
  </div>
</template>

<script>
  import EBar from '@/components/echart/Bar'
  import EPie from '@/components/echart/Pie'
  import ELine from '@/components/echart/Line'

  export default {
    components: { EBar, EPie, ELine },
    props: {
      height: {
        type: String,
        default: '400px'
      },
      type: {
        type: String,
        default: 'bar'
      },
      legendShow:{
        type: Boolean,
        default: true
      },
      option: {
        type: Object,
        /*default: () => {
          return {
            series: [{
              name: "就诊医疗机构名称",
              data: [ 248872,
                246130,
                244381,
                227632,
                227228,
                208889,
                183111,
                179872,
                170585,
                163445]
            }],
            xAxis:
              [
                "阜南县龙王乡卫生院",
                "阜南县朱寨镇中心卫生院",
                "阜南县淮河社区卫生服务中心",
                "阜南县鹿城镇卫生院",
                "阜南县鹿城镇城北社区卫生服务中心",
                "阜南县地城镇中心卫生院",
                "阜南县人民医院",
                "阜南县焦陂镇中心卫生院",
                "阜南县许堂乡卫生院",
                "阜南县柴集镇中心卫生院"
              ]
          }
        }*/
      },
    },
    data() {
      return {}
    },
    watch: {
      option(val){
        console.log('option变化')
      },
      type(val){
        console.log('type',val)
      }
    },
    methods: {
      clickEvent(params){
        this.$emit('click',params)
      }
    },
    computed: {
      title() {
        return this.option.series[0].name
      },
      pieData() {
        return Array.from(this.option.series[0].data,
          (val, index) => {
            return { value: val, name: this.option.xAxis[index] }
          })
      }
    }
  }
</script>
