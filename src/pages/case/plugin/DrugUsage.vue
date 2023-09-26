<template>
        <a-row>
            <a-col :span="3" class="t-r">给药途径：</a-col>
            <a-col :span="21" >
                <input-medical-other-dict v-bind="{dict: 'usage', multi: true, separator: '|'}" v-model="value1" @change="onChange"></input-medical-other-dict>
            </a-col>
            <a-col :span="21" :offset="3" class="m-t-6 m-b-6">
                <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                           required :disabled="readonly" style="width: 100px"
                           v-model="logic" @change="onChange"></m-dict-select-tag>
            </a-col>
            <a-col :span="3" class="t-r">医嘱：</a-col>
            <a-col :span="21"  >
        <multi-tag-input separator="|" v-model="value2" @change="onChange"></multi-tag-input>
            </a-col>
        </a-row>

</template>

<script>
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import MultiTagInput from "@/pages/case/plugin/MultiTagInput"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  export default {
    name: 'drugUsage',
    components: {
      InputMedicalOtherDict,
      MultiTagInput,
      MDictSelectTag
    },
    props: {
      readonly: Boolean,
      value: Array,
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        value1: '',
        logic: 'AND',
        value2: ''

      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log('val === this.changeData', val, this.changeData)
          if (this.changeData === val) {
            return
          }
          let [value1, logic, value2] = val
          this.value1 = value1 || ''
          this.logic = logic || 'AND'
          this.value2 = value2 || ''
        }
      },
    },
    methods: {
      onChange() {
        this.$nextTick(() => {
          let val = [undefined,undefined,undefined]
          if (this.isStrNotBlank(this.value1)) {
            val[0] = this.value1
          }
          if (this.isStrNotBlank(this.value2)) {
            val[2] = this.value2
            if(val[0]){
              val[1] = this.logic
            }
          }
          if(val[0] === undefined && val[2] === undefined){
            val = undefined
          }
          this.$emit('change', this.changeData = val)
          console.log('change', val)
        })
      },
      isStrNotBlank(val) {
        return val !== undefined && val !== null && (val + '').length > 0
      },
    },
  }
</script>
<style scoped>

</style>
