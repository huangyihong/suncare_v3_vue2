<template>
  <a-row :gutter="10" style="line-height: 40px">
    <a-col :md="3" :xs="8">
    </a-col>
    <a-col :md="3" :xs="6" class="t-c">
      疾病组：
    </a-col>
    <a-col :md="3" :xs="8">
      <m-dict-select-tag :options="[{code:'=', value: '='},{code:'≠', value: '≠'}]"
                         required
                         :disabled="readonly" class="w-b-100"
                         v-model="compare" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :md="15" :xs="24">
      <input-medical-drug-group kind="5" v-model="diseaseGroups" multi @change="onChange"></input-medical-drug-group>
    </a-col>
    <a-col :md="3" :xs="8">
      <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                         required
                         :disabled="readonly" class="w-b-100"
                         v-model="logic" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :md="3" :xs="8" class="t-c">
      项目组：
    </a-col>
    <a-col :md="3" :xs="8">
      <m-dict-select-tag :options="[{code:'=', value: '='},{code:'≠', value: '≠'}]"
                         required
                         :disabled="readonly" class="w-b-100"
                         v-model="compare1" @change="onChange"></m-dict-select-tag>
    </a-col>
    <a-col :md="15" :xs="24">
      <input-medical-drug-group kind="1" v-model="itemGroups" multi @change="onChange"></input-medical-drug-group>
    </a-col>
  </a-row>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import inputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"

  export default {
    name: 'FrequencyComp',
    props: ['value'],
    components: {
      MDictSelectTag,
      inputMedicalDrugGroup
    },
    data() {
      return {
        selectVal: undefined,
        compare: undefined,
        diseaseGroups: undefined,
        logic: undefined,
        compare1: undefined,
        itemGroups: undefined,
      }
    },
    watch: {
      value(val, oldVal) {
        console.log('FrequencyComp2', val)
        if (!val) {
          this.selectVal = this.period = this.compare = this.frequency = undefined
          this.thisValue = ''
          return
        }
        if(val === this.thisValue) {
          return
        }
        this.thisValue = ''
        let [compare, diseaseGroups,logic, compare1, itemGroups] = val
        this.compare = compare
        this.diseaseGroups = diseaseGroups
        this.logic = logic
        this.compare1 = compare1
        this.itemGroups = itemGroups
      }
    },
    methods: {
      onChange() {
        this.$nextTick(()=>{
          let val = [undefined, undefined, undefined, undefined, undefined]
          console.log(this.compare,this.diseaseGroups, this.logic, this.compare1,this.itemGroups)
          if (this.isStrsNotBlank([this.compare,this.diseaseGroups]) ) {
            val[0] = this.compare
            val[1] = this.diseaseGroups
          }

          if (this.isStrsNotBlank([this.compare1,this.itemGroups]) ) {
            val[3] = this.compare1
            val[4] = this.itemGroups
          }

          if(val[0] === undefined  && val[3] === undefined){
            val = undefined
          } else if(val[0] !== undefined && val[3] !== undefined){
            val[2] = this.logic
          }

          this.thisValue = val
          console.log('val',val)
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
