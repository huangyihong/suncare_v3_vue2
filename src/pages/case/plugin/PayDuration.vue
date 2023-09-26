<template>
  <a-row :gutter="12">
    <a-col :span="8">
      <m-dict-select-tag placeholder="请选择(单选)" dictCode="VISIT_PERIOD" required
                         v-model="selectVal" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :span="8">
      <a-input-number :step="1" placeholder="请输入时间" v-model.lazy="rangeVal" @change="onChange" style="width: 100%">
      </a-input-number>
    </a-col>
    <a-col :span="8">
      <m-dict-select-tag placeholder="请选择时间单位" dictCode="AGE_UNIT" required
                         v-model="unit" @change="onChange"></m-dict-select-tag>
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: 'PayDuration',
    props: ['value'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        selectVal: undefined,
        rangeVal: undefined,
        unit: undefined,
      }
    },
    watch: {
      value(val, oldVal) {
        if (!val) {
          this.rangeVal = undefined
          return
        }
        let [period, range, unit] = val.split('-')
        this.selectVal = period
        this.rangeVal = parseInt(range)
        this.unit = unit
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=>{
          let val
          if (this.rangeVal !== undefined && this.rangeVal !== null) {
            val = this.selectVal + '-' + this.rangeVal + '-' + this.unit
          }
          this.$emit('input', val)
          this.$emit('change', val)
          console.log('this.unit',this.unit)
          console.log('change', val)
        })

      },
    },
  }
</script>
<style scoped>

</style>
