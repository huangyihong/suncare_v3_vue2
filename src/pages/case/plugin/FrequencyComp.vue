<template>
  <a-row :gutter="10">
    <a-col :span="6">
      <m-dict-select-tag placeholder="请选择" dictCode="FREQUENCY_PERIOD"
                         v-model="period" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :span="8">
      <m-dict-select-tag placeholder="请选择" dictCode="COMMON_COMPARE"
                         v-model="compare" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :span="8">
      <a-input placeholder="请输入" v-model.trim="frequency" @change="onChange"></a-input>
    </a-col>
    <a-col :span="2">
      次
    </a-col>
    <a-col :span="6">
      <m-dict-select-tag placeholder="请选择" dictCode="FREQUENCY_PERIOD"
                         v-model="period2" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :span="8">
      <m-dict-select-tag placeholder="请选择" dictCode="COMMON_COMPARE"
                         v-model="compare2" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :span="8">
      <a-input placeholder="请输入" v-model.trim="frequency2" @change="onChange"></a-input>
    </a-col>
    <a-col :span="2">
      次
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: 'FrequencyComp',
    props: ['value'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        selectVal: undefined,
        period: undefined,
        compare: undefined,
        frequency: undefined,
        period2: undefined,
        compare2: undefined,
        frequency2: undefined,
        inputChange: false
      }
    },
    watch: {
      value(val, oldVal) {
        console.log('FrequencyComp', val)
        if (!val) {
          if(this.inputChange){
            this.inputChange = false
            return
          }
          this.selectVal = this.period = this.compare = this.period2 = this.compare2 = this.frequency2 = undefined
          return
        }
        let [period, compare,frequency,period2,compare2,frequency2] = val.split('_')
        this.period = period === ''?undefined: period
        this.compare = compare === ''?undefined: compare
        this.frequency = frequency === ''?undefined: frequency
        this.period2 = period2 === ''?undefined: period2
        this.compare2 = compare2 === ''?undefined: compare2
        this.frequency2 = frequency2 === ''?undefined: frequency2
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=>{
          let val = ''
          if (this.isStrsNotBlank([this.period,this.compare,this.frequency]) ) {
            val += this.period + '_' + this.compare + '_' + this.frequency
          } else {
            val += '__'
          }
          if (this.isStrsNotBlank([this.period2,this.compare2,this.frequency2]) ) {
            val +='_' + this.period2 + '_' + this.compare2 + '_' + this.frequency2
          } else {
            val += '_' + '__'
          }
          this.inputChange = true
          if(val === '_____'){
            val = undefined
          }
          this.$emit('input', val)
          this.$emit('change', val)
          console.log('change', val)
          console.log('this.period', this.period)
        })

      },
      isStrNotBlank(val) {
        return val !== undefined && val !== null &&val.length > 0
      },
      isStrsNotBlank(array) {
        let bl = true
        for(let item of array){
          bl = this.isStrNotBlank(item) && bl
          if(!bl){
            return bl
          }
        }
        return bl
      }
    },
  }
</script>
<style scoped>

</style>
