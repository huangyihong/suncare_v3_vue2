<template>
  <a-row :gutter="10" style="line-height: 40px">
    <a-col :md="3" :xs="8">
    </a-col>
    <a-col :md="3" :xs="8" class="t-c">
      项目组：
    </a-col>
    <a-col :md="18" :xs="24" style=" margin-bottom: 12px;">
      <input-medical-drug-group kind="1" v-model="value1" multi separator="|" @change="onChange"></input-medical-drug-group>
    </a-col>
    <a-col :md="3" :xs="8">
      <m-dict-select-tag dictCode="CASE_RELATION_CHAR" :value="logic"
                         class="w-b-100" disabled required></m-dict-select-tag>
    </a-col>
    <a-col :md="3" :xs="8" class="t-c">
      药品组：
    </a-col>
    <a-col :md="18" :xs="24">
      <input-medical-drug-group kind="7" v-model="value2" multi separator="|" @change="onChange"></input-medical-drug-group>
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import inputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"

  export default {
    name: 'ItemOrDrugGroup',
    props: ['value'],
    model: {
      prop: 'value',
      event: 'change'
    },
    components: {
      MDictSelectTag,
      inputMedicalDrugGroup
    },
    data() {
      return {
        value1: undefined,
        logic: 'OR',
        value2: undefined,
      }
    },
    watch: {
      value(val, oldVal) {
        if(val === this.thisValue) {
          return
        }
        if (!val) {
          this.value1 = this.value2 = undefined
          return
        }
        let [value1, logic, value2] = val
        this.value1 = value1
        this.value2 = value2
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=>{
          let val
          if (this.isStrNotBlank(this.value1) || this.isStrNotBlank(this.value2)) {
            val = [this.value1, this.logic, this.value2]
          }
          this.$emit('change', this.thisValue = val)
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
