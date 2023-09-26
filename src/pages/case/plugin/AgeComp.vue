<template>
  <div>
    <m-dict-select-tag placeholder="请选择(单选)" dictCode="AGE_RANGE" required
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
    props: ['value'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        readonly: false,
        selectVal: undefined,
        unit: undefined,
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
      }
    },
    watch: {
      value(val, oldVal) {
        if (!val) {
          this.value1 = this.value2 = undefined
          return
        }
        console.log('val', val)
        let [selVal, range, unit, compare] = val.split('_')
        let [val1Str, val2Str] = range.split(',')
        this.value1 = val1Str && val1Str !== '-1' ? parseInt(val1Str) : undefined
        this.value2 = val2Str && val2Str !== '-1' ? parseInt(val2Str) : undefined
        let [c1, c2] = (compare || '<=,<=').split(',')
        this.compare1 = c1
        this.compare2 = c2
        this.readonly = selVal !== '-1'
        console.log('selVal', selVal)
        this.selectVal = selVal
        this.unit = unit
        /*let index = -1
        for (let [i, item] of this.selRangeArray.entries()) {
          let [v1, v2] = item.value
          if (unit === item.unit && this.value1 === v1 && this.value2 === v2) {
            index = i
          }
        }
        if (index > -1) {
          index++
          this.readonly = true
        } else {
          this.readonly = false
        }*/
      }
    },
    methods: {
      selectChange(val) {

        console.log('selectChange', val)

        if (val === '-1') {
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
      onChange() {
        this.$nextTick(() => {
          let val = `${this.numBlankStrFormat(this.value1)},${this.numBlankStrFormat(this.value2)}`
          if (val !== '-1,-1') {
            val = `${this.selectVal}_${val}_${this.unit || ''}` + `_${this.compare1},${this.compare2}`
          }
          this.$emit('input', val)
          this.$emit('change', val)
          console.log('change', val)
        })
      },
      numBlankStrFormat(val) {
        return val !== undefined && val !== null ? val : -1
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
