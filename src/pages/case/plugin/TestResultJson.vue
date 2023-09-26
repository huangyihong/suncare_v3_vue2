<template>
    <div class="fieldset-box-group">
        <a-row>
            <a-col :span="16">
                <a-input placeholder="请点击选择" :value="itemValue && itemValue.length > 0 && `${itemName}(${itemValue})`"
                         readOnly @click="showSelect()">
                    <a-select slot="addonBefore" v-model="itemType" style="width: 90px"
                              @change="()=>{itemValue=undefined;onChange()}">
                        <a-select-option value="ITEM">
                            项目
                        </a-select-option>
                        <a-select-option value="GROUP">
                            项目组
                        </a-select-option>
                    </a-select>
                </a-input>
            </a-col>
            <a-col :span="8" class="t-r">
                <a-radio-group v-model="valueType"
                               @change="()=>{value1 = value2 = undefined;onChange()}">
                    <a-radio value="1">
                        定量
                    </a-radio>
                    <a-radio value="2">
                        定性
                    </a-radio>
                </a-radio-group>
            </a-col>
        </a-row>
        <a-row v-if="valueType === '2'">
            <a-col :span="4">
                定性选择：
            </a-col>
            <a-col :span="20">
                <other-dict-select-tag placeholder="请选择" dictEname="test_tip"
                                       v-model="value1" @select="obj => {unitName = obj.value;onChange()}"/>

                <!-- <m-dict-select-tag placeholder="请选择" dictCode="FREQUENCY_PERIOD"
                                    v-model="value1" @change="onChange"></m-dict-select-tag>-->
            </a-col>
        </a-row>
        <a-row v-else-if="valueType === '1'">
            <a-col :span="4">
                定量范围：
            </a-col>
            <a-col :span="15">
                <a-col :span="11">
                    <a-input-group compact>
                        <a-input-number :min="0" :step="1" placeholder="不限"
                                        v-model.lazy="value1" @change="onChange"
                                        style="width: 60%">
                        </a-input-number>
                        <a-select placeholder="请选择 " style="width: 40%"
                                  v-model="compare1" @change="onChange">
                            <a-select-option value="<"><</a-select-option>
                            <a-select-option value="<="><=</a-select-option>
                        </a-select>
                    </a-input-group>
                </a-col>
                <a-col :span="2" class="t-c">
                    ~
                </a-col>
                <a-col :span="11">
                    <a-input-group compact>
                        <a-select placeholder="请选择" style="width: 40%"
                                  v-model="compare2" @change="onChange">
                            <a-select-option value="<"><</a-select-option>
                            <a-select-option value="<="><=</a-select-option>
                        </a-select>
                        <a-input-number :step="1" placeholder="不限"
                                        v-model.lazy="value2" @change="onChange"
                                        style="width: 60%">
                        </a-input-number>
                    </a-input-group>

                </a-col>
            </a-col>
            <a-col :span="5" class="p-l-10">
                <!--testvalueunit-->
                <other-dict-select-tag placeholder="请选择" dictEname="testvalueunit"
                                       v-model="unit" @select="obj => {unitName = obj.value;onChange()}"/>
                <!-- <m-dict-select-tag placeholder="请选择" dictCode="FREQUENCY_PERIOD"
                                    v-model="unit" @change="onChange"></m-dict-select-tag>-->
            </a-col>
        </a-row>
        <component ref="selectRef" :is="selectInfo.component" v-bind="selectInfo.params"
                   @ok="handleSelectOk"></component>
    </div>
</template>

<script>
  // import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  const MedicalTreatProject = () => import("@/pages/selectSingle/MedicalTreatProject")
  const MedicalGroup = () => import("@/pages/selectSingle/MedicalGroup")
  import pick from 'lodash/pick'

  export default {
    name: 'TestResult',
    props: ['value'],
    components: {
      // MDictSelectTag,
      OtherDictSelectTag,
      MedicalTreatProject,
      MedicalGroup
    },
    data() {
      this.selectInfos = {
        'ITEM': {
          name: '项目',
          component: 'MedicalTreatProject',
          params: {},
        },
        'GROUP': {
          name: '项目组',
          component: 'MedicalGroup',
          params: { kind: '1' },
        }
      }
      return {
        itemValue: '',
        itemName: '',
        itemType: 'ITEM',
        valueType: '1',
        // value: undefined,
        value1: undefined,
        value2: undefined,
        compare1: '<',
        compare2: '<',
        unit: undefined,
        unitName: undefined,
        selectInfo: {},
        emitValue: undefined
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log('TestResult.value', val, val === this.emitValue)
          if (val === this.emitValue) {
            return
          }
          this.emitValue = val
          if (!this.isStrNotBlank(val)) {
            this.value1 = this.value2 = this.unit = undefined
            return
          }
          // this.emitValue = val
          let { itemType, itemValue, itemName, valueType, value, unit } = typeof val === 'string' ? JSON.parse(val) : val
          this.itemType = itemType
          this.itemValue = itemValue
          this.itemName = itemName
          this.valueType = valueType
          if (valueType === '2') {
            this.value1 = value
          } else {
            let [val1, val2] = value.split(',').map(r => r.trim())
            this.compare1 = val1.startsWith('(') ? '<' : '<='
            this.compare2 = val2.endsWith(')') ? '<' : '<='
            val1 = parseFloat(val1.substring(1))
            this.value1= isNaN(val1)?undefined: val1
            val2 = parseFloat(val2.substring(0, val2.length - 1))
            this.value2 = isNaN(val2)?undefined:val2
            this.unit = unit
          }
        },
      },
      itemType: {
        immediate: true,
        handler(val) {
          this.selectInfo = this.selectInfos[val]
        }
      }
    },
    methods: {
      showSelect() {
        this.$refs.selectRef.show()
      },
      handleSelectOk(obj) {
        this.itemValue = obj.code
        this.itemName = obj.name
        this.onChange()
      },
      onChange() {
        this.$nextTick(() => {
          let val
          console.log('onChange', this.itemType, this.itemValue, this.valueType, this.value1, this.value2, this.unit)
          if (this.isStrNotBlank(this.itemValue)) {
            if (this.valueType === '2') {
              if (this.isStrNotBlank(this.value1)) {
                val = {
                  ...pick(this, 'itemType', 'itemValue', 'itemName', 'valueType', 'unitName'),
                  value: this.value1
                }
              }
            } else if (this.isStrNotBlank(this.unit) && (this.isStrNotBlank(this.value1) || this.isStrNotBlank(this.value2))) {
              let compareChar = this.compare1 === '<' ? '(' : '['
              let compareChar2 = this.compare2 === '<' ? ')' : ']'
              let value = compareChar + (this.isStrNotBlank(this.value1)?this.value1:'')
                + ',' + (this.isStrNotBlank(this.value2)?this.value2:'') + compareChar2
              val = { ...pick(this, 'itemType', 'itemValue', 'itemName', 'valueType', 'unit', 'unitName'), value }
            }
          }
          if (val) {
            val = JSON.stringify(val)
          }
          if (this.value !== val) {
            console.log('change', val)
            this.emitValue = val
            this.$emit('input', val)
            this.$emit('change', val)
          }

        })
      },
      isStrNotBlank(val) {
        return val !== undefined && val !== null && (val + '').length > 0
      },
      isStrsNotBlank(array) {
        let bl = true
        for (let item of array) {
          bl = this.isStrNotBlank(item) && bl
          if (!bl) {
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
