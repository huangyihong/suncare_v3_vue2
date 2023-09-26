<!--限特定人群条件组-->
<template>
  <div class="fieldset-box-group">
    <a-row :gutter="6">
      <a-col :span="3" class="t-r title">
         年龄：
      </a-col>
      <a-col :span="21">
        <age-comp-math :disabled="disabled" v-model="ageArray" @change="onChange"/>
      </a-col>
      <a-col :span="12">
        <a-col :span="6" class="t-r title">
          疾病组：
        </a-col>
        <a-col :span="6">
          <m-dict-select-tag dictCode="EQ_NOT_COMPARE" required :disabled="disabled"
                             v-model="diseaseGroupsCompare" @change="onChange"></m-dict-select-tag>
        </a-col>
        <a-col :span="12">
          <input-medical-drug-group kind="5" v-model="diseaseGroups" :multi="false" @change="onChange"
                                    :disabled="disabled" hideButton></input-medical-drug-group>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-col :span="6" class="t-r title">
          药品组：
        </a-col>
        <a-col :span="6">
          <m-dict-select-tag dictCode="EQ_NOT_COMPARE" required :disabled="disabled"
                             v-model="drugGroupsCompare" @change="onChange"></m-dict-select-tag>
        </a-col>
        <a-col :span="12">
          <input-medical-drug-group kind="7" v-model="drugGroups" :multi="false" @change="onChange"
                                    :disabled="disabled" hideButton></input-medical-drug-group>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-col :span="6" class="t-r title">
          项目组：
        </a-col>
        <a-col :span="6">
          <m-dict-select-tag dictCode="EQ_NOT_COMPARE" required :disabled="disabled"
                             v-model="itemGroupsCompare" @change="onChange"></m-dict-select-tag>
        </a-col>
        <a-col :span="12">
          <input-medical-drug-group kind="1" v-model="itemGroups" :multi="false" @change="onChange"
                                    :disabled="disabled" hideButton></input-medical-drug-group>
        </a-col>
      </a-col>
      <a-col :span="12">
        <a-col :span="6" class="t-r title">
          医嘱：
        </a-col>
        <a-col :span="8">
          <m-dict-select-tag dictCode="LIKE_NOT_COMPARE" required :disabled="disabled"
                             v-model="adviceCompare" @change="onChange"></m-dict-select-tag>
        </a-col>
        <a-col :span="10">
          <a-input :disabled="disabled" v-model.trim="advice"  @change="onChange"/>
        </a-col>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import AgeCompMath from '@/pages/case/plugin/AgeCompMath2'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
  import inputMedicalDrugGroup from '@/pages/selectInput/MedicalDrugGroup'


  export default {
    name: 'Xtdrq',
    components: {
      AgeCompMath,
      inputMedicalDrugGroup,
      MDictSelectTag
    },
    props: {
      value: Object,
      multiIndex: Number,
      disabled: Boolean
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        ageArray: undefined,
        diseaseGroupsCompare: '=',
        diseaseGroups:undefined,
        drugGroupsCompare : '=',
        drugGroups:undefined,
        itemGroupsCompare: '=',
        itemGroups:undefined,
        adviceCompare: 'like',
        advice:undefined
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val === this.thisValue) {
            return
          }
          if (!val) {
            this.ageArray = this.diseaseGroups = this.drugGroups = this.itemGroups = this.advice = undefined
            this.diseaseGroupsCompare = this.drugGroupsCompare = this.itemGroupsCompare = '='
            this.adviceCompare = 'like'
            return
          }
          this.thisValue = ''

          let { ext1, ext2, ext3, ext4, ext5, ext6, ext7, ext8, ext9, ext10 } = val
          this.ageArray = [ext1, ext2]

          this.diseaseGroupsCompare = ext3
          this.diseaseGroups = ext4
          this.drugGroupsCompare = ext5
          this.drugGroups = ext6
          this.itemGroupsCompare = ext7
          this.itemGroups = ext8
          this.adviceCompare = ext9
          this.advice = ext10
        }
      }
    },
    methods: {
      onChange() {
        this.$nextTick(() => {
          let val = {}
          if (this.ageArray && this.isStrNotBlank(this.ageArray[0]) && this.isStrNotBlank(this.ageArray[1])) {
            [val.ext1, val.ext2] = this.ageArray
          }
          if (this.isStrNotBlank(this.diseaseGroups)) {
            val.ext3 = this.diseaseGroupsCompare
            val.ext4 = this.diseaseGroups
          }
          if (this.isStrNotBlank(this.drugGroups)) {
            val.ext5 = this.drugGroupsCompare
            val.ext6 = this.drugGroups
          }
          if (this.isStrNotBlank(this.itemGroups)) {
            val.ext7 = this.itemGroupsCompare
            val.ext8 = this.itemGroups
          }
          if (this.isStrNotBlank(this.advice)) {
            val.ext9 = this.adviceCompare
            val.ext10 = this.advice
          }
          if(Object.keys(val) === 0){
            val = undefined
          } else {
            val.logic = this.multiIndex === 0? 'AND':'OR'
          }
          this.thisValue = val
          this.$emit('change', val)
        })
      },
      isStrNotBlank(val) {
        return val !== undefined && val !== null && (val + '').length > 0
      },
    }
  }
</script>
<style scoped>
  .title {
    color: rgba(0, 0, 0, 0.85)
  }

</style>
