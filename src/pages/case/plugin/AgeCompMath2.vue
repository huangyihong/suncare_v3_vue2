<!--返回  [年龄范围，单位]-->
<template>
  <div>
    <m-dict-select-tag placeholder="请选择(单选)" dictCode="AGE_RANGE" :disabled="disabled"
                       v-model="selectVal" @change="selectChange"></m-dict-select-tag>
    <a-row>
      <a-col :span="8">
        <a-input-group compact>
          <a-input-number :min="0" :step="1" placeholder="不限" v-model.lazy="value1" :disabled="readonly"
                          @change="onChange" style="width: 60%">
          </a-input-number>
          <a-select placeholder="选择包含状态" v-model="compare1" :disabled="readonly" style="width: 40%">
            <a-select-option value="<"><</a-select-option>
            <a-select-option value="<="><=</a-select-option>
          </a-select>
        </a-input-group>
      </a-col>
      <a-col :span="3" class="t-c">
        年龄
      </a-col>
      <a-col :span="8">
        <a-input-group compact>
          <a-select placeholder="选择包含状态" v-model="compare2" :disabled="readonly" style="width: 40%">
            <a-select-option value="<"><</a-select-option>
            <a-select-option value="<="><=</a-select-option>
          </a-select>
          <a-input-number :step="1" placeholder="不限" v-model.lazy="value2" :disabled="readonly" @change="onChange"
                          style="width: 60%">
          </a-input-number>
        </a-input-group>
      </a-col>
      <a-col :span="5" class="p-l-10">
        <m-dict-select-tag placeholder="请选择(单选)" dictCode="AGE_UNIT" :disabled="readonly"
                           v-model="unit" @change="onChange" required></m-dict-select-tag>
      </a-col>
    </a-row>

  </div>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: 'AgeComp',
    props: ['value', 'disabled'],
    model: {
      prop: 'value',
      event: 'change'
    },
    components: {
      MDictSelectTag
    },
    data() {
      return {
        readonly: false,
        selectVal: '-1',
        unit: 'year',
        selRangeArray: [
          { value: [0, 28], unit: 'day', compare: ['<=', '<='] },
          { value: [0, 1], unit: 'year', compare: ['<=', '<='] },
          { value: [0, 3], unit: 'year', compare: ['<=', '<='] },
          { value: [3, 6], unit: 'year', compare: ['<', '<='] },
          { value: [6, 12], unit: 'year', compare: ['<', '<='] },
          { value: [0, 14], unit: 'year', compare: ['<=', '<='] },
          { value: [14, 18], unit: 'year', compare: ['<', '<='] },
          { value: [18, undefined], unit: 'year', compare: ['<=', '<'] },
          { value: [60, undefined], unit: 'year', compare: ['<=', '<'] },
        ],
        value1: undefined,
        value2: undefined,
        compare1: '<=',
        compare2: '<=',
        thisValue: ''
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val, oldVal) {
          if (!val || (!val[0] && !val[1])) {
            this.init()
            this.thisValue = ''
            return
          }
          if (val === this.thisValue) {
            return
          }
          this.thisValue = ''
          let [selVal, unit] = val

          let [val1Str, val2Str] = selVal.substring(1, selVal.length - 1).split(',')
          this.value1 = val1Str && val1Str.length > 0 ? parseInt(val1Str) : undefined
          this.value2 = val2Str && val2Str.length > 0 ? parseInt(val2Str) : undefined

          let c1 = selVal.charAt(0) === '[' ? '<=' : '<'
          let c2 = selVal.charAt(selVal.length - 1) === ']' ? '<=' : '<'
          this.compare1 = c1
          this.compare2 = c2
          this.unit = unit

          this.selectVal = '-1'
          for (let [index, item] of this.selRangeArray.entries()) {
            if (this.unit === item.unit
              && this.value1 === item.value[0]
              && this.value2 === item.value[1]
              && this.compare1 === item.compare[0]
              && this.compare2 === item.compare[1]) {
              this.selectVal = index + 1 + ''
            }
          }
          this.readonly = this.selectVal !== '-1'
        }
      }
    },
    methods: {
      selectChange(val) {
        // 清除选择
        if(!val){
          this.init()
        } else if (val === '-1') {
          this.readonly = false
        } else {
          let { value, unit, compare } = this.selRangeArray[parseInt(val) - 1]
          this.value1 = value[0]
          this.value2 = value[1]
          this.compare1 = compare[0]
          this.compare2 = compare[1]
          this.unit = unit
          this.readonly = true
        }
        this.onChange()
      },
      init(){
        Object.assign(this, {
          unit: 'year',
          value1: undefined,
          value2: undefined,
          compare1: '<=',
          compare2: '<=',
          selectVal: '-1',
          readonly: false
        })
      },
      onChange() {
        this.$nextTick(() => {
          let val = `${this.numBlankStrFormat(this.value1)},${this.numBlankStrFormat(this.value2)}`
          if(val !== ','){
            val = [`${this.compare1 === '<='? '[':'('}${val}${this.compare2 === '<='? ']':')'}`, this.unit]
          } else {
            val = undefined
          }
          this.thisValue = val
          this.$emit('change', val)
          console.log('AgeCompVal.change', val,)
        })
      },
      numBlankStrFormat(val) {
        return val !== undefined && val !== null ? val : ''
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
