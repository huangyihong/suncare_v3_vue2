<template>
  <a-row :gutter="10">
    <!--<a-col :span="6">
      <a-input :value="period" @change="onChange" readOnly></a-input>
    </a-col>
    <a-col :span="8">
      <m-dict-select-tag placeholder="请选择" dictCode="COMMON_COMPARE"
                         v-model="compare" @change="onChange"></m-dict-select-tag>
    </a-col>-->
    <a-col :span="20">
      <a-input placeholder="请输入" v-model.trim="frequency" @change="onChange"></a-input>
    </a-col>
    <a-col :span="4">
      数量
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: 'FrequencyComp',
    props: ['value', 'period'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        selectVal: undefined,
        period: undefined,
        compare: undefined,
        frequency: undefined,
        inputChange: false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log('FrequencyComp2', val)
          if (val === this.thisValue) {
            return
          }
          this.thisValue = ''
          let [period, frequency] = val || []
          this.frequency = frequency
        },
      },
      period(){
        this.onChange()
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=>{
          let val
          if (this.isStrsNotBlank([this.period,this.frequency]) ) {
            val = [this.period,this.frequency]
          } else {
            val = undefined
          }
          this.thisValue = val
          this.$emit('input', val)
          this.$emit('change', val)
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
