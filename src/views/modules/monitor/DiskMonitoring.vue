<template>
  <a-card title="磁盘监控">
    <a-row>
      <template v-if="gaugeData.length>0">
        <a-col :span="8" v-for="(item,index) in gaugeData" :key=" 'diskInfo'+index ">
          <gauge title="磁盘使用率" :data="item"></gauge>
        </a-col>
      </template>

    </a-row>
  </a-card>
</template>

<script>
  import { getAction } from '@/api/manage'
  import Gauge from '@/components/echart/Gauge'

  export default {
    name: 'DiskMonitoring',
    components:{
      Gauge,
    },
    data() {
      return {
        url:{
          queryDiskInfo:'actuator/redis/queryDiskInfo',
        },
        gaugeData: []
      }
    },
    beforeMount() {
      getAction(this.url.queryDiskInfo).then((res)=>{
        if(res.success){
          let result = res.result
          let data = []
          for(let i=0; i < result.length;i++){
            let item = result[i]
            let value = (item.max - item.rest) / item.max * 100
            data.push({value: value.toFixed(2), name: '磁盘' + (i + 1)})
          }
          this.gaugeData = data
        }
      })
    }
  }
</script>

<style scoped>

</style>