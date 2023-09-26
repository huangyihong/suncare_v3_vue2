<template>
    <div>
        <m-dict-select-tag dictCode="DRUG_CATEGORY_SOURCE" class="radius-right-none" style="width: 120px"
                           v-model="type" @change="typeChange" required></m-dict-select-tag>
        <component :is="inputSelectComp" kind="7" :multi="false" v-model="value1" @change="onChange"
                   class="radius-left-none inline-block" style="width: calc(100% - 120px)"></component>
    </div>
</template>

<script>
  import InputMedicalStdAtc from '@/pages/selectInput/MedicalStdAtc'
  import inputMedicalDrugGroup from "@/pages/selectInput/MedicalDrugGroup"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  export default {
    name: 'InputMedicalStdAtcDrugGroup',
    components: {
      InputMedicalStdAtc,
      inputMedicalDrugGroup,
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
        type: 'ATC',
        value1: ''
      }
    },
    computed: {
      inputSelectComp(){
        return {
          'ATC': 'InputMedicalStdAtc',
          'DRUGGROUP': 'inputMedicalDrugGroup',
        }[this.type]
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
          let [value1, type] = val || []
          this.type = type || 'ATC'
          this.value1 = value1
        }
      }
    },
    methods: {
      typeChange(){
        this.value1 = ''
        this.onChange()
      },
      onChange() {
        this.$nextTick(() => {
          let val
          if (this.isStrNotBlank(this.type) && this.isStrNotBlank(this.value1)) {
            val = [this.value1, this.type]
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
