<template>
  <a-row :gutter="12">
    <a-col :span="12">
      <m-dict-select-tag dictCode="VISIT_PERIOD" required v-model="selectVal" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :span="12">
      <a-input-number :step="1" placeholder="请输入周期内限定数量" v-model.lazy="rangeVal" @change="onChange" style="width: 100%">
      </a-input-number>
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: 'CountComp',
    props: ['value'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        selectVal: undefined,
        rangeVal: undefined,
      }
    },
    watch: {
      value(val, oldVal) {
        if (!val) {
          this.rangeVal = undefined
          return
        }
        let [period, range] = val.split('-')
        this.selectVal = period
        this.rangeVal = parseInt(range)
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=>{
          let val
          if (this.rangeVal !== undefined && this.rangeVal !== null) {
            val = this.selectVal + '-' + this.rangeVal
          }
          this.$emit('input', val)
          this.$emit('change', val)
          console.log('change', val)
        })

      },
    },
  }
</script>
<style scoped>

</style>
