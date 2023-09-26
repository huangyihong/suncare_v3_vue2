<template>
    <div>
        <a-select placeholder="请选择输入方式"
                  v-model="type"
                  @change="val => {code = undefined;onChange()}"
                  class="radius-right-none" style="width: 120px">
            <a-select-option value="m">医疗字典</a-select-option>
            <a-select-option value="o">其他字典</a-select-option>
        </a-select>
        <template v-if="type === 'm'">
            <input-medical-dict v-model="code" @change="onChange" v-bind="$attrs"
                                class="radius-left-none" style="display: inline-block;width: calc(100% - 120px)"></input-medical-dict>
        </template>
        <template v-else-if="type === 'o'">
            <a-input placeholder="请输入字典编码" v-model.lazy="code" @input="e => onChange(e.target.value)"
                     class="radius-left-none" style="display: inline-block;width: calc(100% - 120px);vertical-align: inherit"></a-input>
           <!-- <input-medical-other-dict v-model="code" @change="onChange" v-bind="$attrs"
                                class="radius-left-none" style="display: inline-block;width: calc(100% - 120px)"></input-medical-other-dict>
       -->
        </template>
    </div>
</template>

<script>
  import InputMedicalDict from "@/pages/selectInput/MedicalDict"
  // import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"

  export default {
    name: 'MedicalDictOrOther',
    components: {
      InputMedicalDict
      // , InputMedicalOtherDict
    },
    props:{
      value: {
        type: String
      },
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      this.typeSeparator = ':'
      return {
        type: 'm',
        code: undefined,
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if(val === this.emitValue){
            return
          }
          if(val && val.length > 0 && val.charAt(1) === this.typeSeparator){
            this.type = val.charAt(0)
            this.code = val.substring(2)
          } else {
            this.type = 'm'
            this.code = undefined
          }
        }
      }
    },
    methods: {
      onChange(code){
        console.log('code', code)
        let val = ''
        if(code && code.length > 0){
          val = this.type + this.typeSeparator + code
        }
        this.$emit('change', this.emitValue = val)
      }
    },
  }
</script>
<style scoped>

</style>
