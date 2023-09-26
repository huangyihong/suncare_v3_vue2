<template>
  <a-row :gutter="12">
    <a-col :span="6">
      <a-select placeholder="选择频率" v-model="selectVal" @change="onChange">
        <a-select-option value="=">等于</a-select-option>
        <a-select-option value="<>">不等于</a-select-option>
      </a-select>
    </a-col>
    <a-col :span="18">
      <input-medical-drug-group v-model="codesVal" kind="5" separator="|" multi  @change="onChange"></input-medical-drug-group>
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import InputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"
  export default {
    name: 'DiseasegroupFreq',
    props: ['value'],
    components: {
      MDictSelectTag,
      InputMedicalDrugGroup
    },
    data() {
      return {
        selectVal: undefined,
        codesVal: undefined,
      }
    },
    watch: {
      value(val, oldVal) {
        console.log('ds',val)
        if (!val) {
          this.codesVal = undefined
          return
        }
        let [v1, v2] = val.split('-')
        this.selectVal = v1
        this.codesVal = v2
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=> {
          let val
          if (this.codesVal !== undefined && this.codesVal !== null && this.codesVal.length > 0) {
            val = this.selectVal + '-' + this.codesVal
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
