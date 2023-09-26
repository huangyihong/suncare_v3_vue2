

<template>
    <div class="fieldset-box-group">
    <a-row :gutter="12">
        <a-col :offset="3" :span="21">
            <a-col :span="6" class="t-r title">
                医院级别:
            </a-col>
            <a-col :span="18" >
                <input-medical-other-dict dict="HospLevel" multi separator="|"
                                      v-model="value1" @change="onChange"></input-medical-other-dict>
            </a-col>

        </a-col>
        <a-col :span="3">
            <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                               required v-model="logic" @change="onChange"></m-dict-select-tag>
        </a-col>
        <a-col :span="21">
            <a-col :span="6" class="t-r title">
                卫生机构类别:
            </a-col>
            <a-col :span="18" >
                <input-medical-other-dict dict="Medical_Org_type" multi separator="|"
                                      v-model="value2" @change="onChange"></input-medical-other-dict>
            </a-col>
        </a-col>
    </a-row>
    </div>
</template>

<script>
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: 'HospLevelAndType',
    components: {
      InputMedicalOtherDict,
      MDictSelectTag
    },
    props: {
      value: Object,
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        value1: undefined,
        value2: undefined,
        logic: 'AND'
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
            this.value1 = this.value2 = undefined
            return
          }
          this.thisValue = ''
          console.log('val', val)

          let {ext1, ext2, ext3} = val
          this.value1 = ext1
          this.logic = ext2 || 'AND'
          this.value2 = ext3
        }
      }
    },
    methods: {
      onChange() {
        this.$nextTick(() => {
          let val = {}
          if (this.isStrNotBlank(this.value1)) {
            val.ext1 = this.value1
          }
          if (this.isStrNotBlank(this.value2)) {
            val.ext3 = this.value2
            if(val.ext1){
              val.ext2 = this.logic
            }
          }
          this.thisValue = val
          this.$emit('change', val)
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
    .title{
        color: rgba(0, 0, 0, 0.85)
    }

</style>
