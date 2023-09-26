<template>
  <a-form-model
    ref="ruleForm"
    :rules="rules"
    :model="this"
    class="fieldset-box-group"
  >
    <a-form-model-item
      label="项目组"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <a-row :gutter="8">
        <a-col :md="4" :xs="24">
          <m-dict-select-tag dictCode="EQ_NOT_COMPARE" required :disabled="disabled"
                             v-model="value2" @change="onChange"/>
        </a-col>
        <a-col :md="20" :xs="24">
          <input-medical-drug-group v-model="value3" kind="1" separator="|" multi @change="onChange"/>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item
      label="一日就诊"
      style="margin-bottom: 0"
      prop="value1"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <a-row :gutter="8">
        <a-col :md="4" :xs="24">
          <m-dict-select-tag dictCode="COMMON_COMPARE" required :disabled="disabled"
                             v-model="compare"  @change="onChange"/>
        </a-col>
        <a-col :md="20" :xs="24">
          <frequency-comp-charge2 v-model="value1" :period="period" @change="onChange"/>
        </a-col>
      </a-row>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
  import FrequencyCompCharge2 from '@/pages/case/plugin/FrequencyCompCharge2'
  import inputMedicalDrugGroup from '@/pages/selectInput/MedicalDrugGroup'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

  export default {
    name: 'freq2Judge',
    props: ['value', 'period', 'disabled', 'index'],
    model: {
      prop: 'value',
      event: 'change'
    },
    components: {
      FrequencyCompCharge2,
      inputMedicalDrugGroup,
      MDictSelectTag
    },
    data() {
      return {
        compare: '=',
        value1: undefined,
        value2: '=',
        value3: undefined,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 }
        },
        rules: {
          value1: [{ required: true, message: '这是必填项' }]
        }
      }
    },
    watch: {
      value: {
        immediate:true,
        handler(val) {
          console.log('freq2Judge.value', val)
          if (val === this.thisValue) {
            return
          }
          if (!val) {
            this.value1 = this.value2 = undefined
            return
          }
          let { compare: compare, ext1: period, ext2: val1, ext3: val2, ext4: val3 } = val
          this.value1 = [period, val1]
          this.value2 = val2
          this.value3 = val3
          this.compare = compare
          console.log('this.value1',this.value1)

        }
      }

    },
    methods: {
      onChange() {
        this.$nextTick(() => {
          let val
          if (this.value1 !== undefined) {
            // val = [this.period, this.value1, this.value2]
            val = {
              compare: this.compare,
              ext1: this.period,
              ext2: this.value1[1],
              ext3: this.value2,
              ext4: this.value3,
              logic: this.index === 0? 'AND': 'OR'
            }
            /* if (this.value2 !== undefined && this.value2.length > 0) {
               val.push(this.value2)
             }*/
          }
          // this.$emit('input', val)
          this.$emit('change', this.thisValue = val)
          console.log('change', val)
          console.log('this.value1', this.value1)
          console.log('this.value2', this.value2)
        })

      }
    }
  }
</script>
<style scoped>

</style>
