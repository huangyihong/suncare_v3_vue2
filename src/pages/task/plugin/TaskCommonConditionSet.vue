<template>
    <a-spin :spinning="confirmLoading">
        <template v-for="(item,index) in options">
            <a-form-item :label="item.title"
                         v-bind="{...formProp, ...item.title?{}:{labelCol: {span: 0},wrapperCol:{span:24}}}"
            >
                <a-col :span="4" class="p-r-10" v-if="item.compareDict">
                    <m-dict-select-tag
                            :dictCode="item.compareDict"
                            required :disabled="readonly"
                            v-model="item.compare"></m-dict-select-tag>
                </a-col>
                <a-col :span="item.compareDict?20:24">
                    <multi v-slot="slotObj"
                           v-decorator="[item.field, item.required?item.requiredRule||validatorRules.requiredOnly:{}]"
                           :separator="item.separator" v-bind="item.multiParam || {}"
                           v-if="item.multi">
                        <component :is="item.component" :disabled="readonly"
                                   :value="slotObj.value" v-on="slotObj.on"
                                   v-bind="item.param"></component>
                    </multi>
                    <component :is="item.component" :disabled="readonly"
                               v-decorator="[item.field, item.required?item.requiredRule||validatorRules.requiredOnly:{}]"
                               v-bind="item.param"
                               v-else></component>
                </a-col>
            </a-form-item>

        </template>
    </a-spin>
</template>

<script>
  import { getAction } from '@/api/manage'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import InputMedicalOtherDict from "@/pages/selectInput/MedicalOtherDict"
  import InputMedicalDiseaseDiag from "@/pages/selectInput/MedicalDiseaseDiag"
  import Multi from '@/pages/selectInput/multi'
  export default {
    name: 'taskCommonConditionSet',
    components: {
      MDictSelectTag,
      InputMedicalOtherDict,
      InputMedicalDiseaseDiag,
      Multi,
    },
    props: {
      options: {
        type: Array,
        default: () => ([])
      },
      formProp: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        url: {
          queryConditionByRuleId: "/task/taskCommonConditionSet/queryByRuleId",
        },
        confirmLoading: false,
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
      }
    },
    methods: {
      loadData(ruleId, callback = () => {}) {
        this.confirmLoading = true
        getAction(this.url.queryConditionByRuleId, { ruleId }).then(res => {
          if (res.success) {
            let data = res.result
            if(data.length === 0){
              return
            }
            let dataObj = {}
            data.forEach(r => {
              if (!dataObj[r.field]) {
                dataObj[r.field] = []
              }
              dataObj[r.field].push(r)
            })
            let obj = {}
            for (let item of this.options) {
              let record = dataObj[item.field]
              if (record) {
                if (item.group) {
                  // 值传入组件为相同field的对象数组 [{ext1, ext2},{ext1, ext2}]
                  obj[item.field] = record
                } else if (item.multiExt) {
                  // 值传入组件为数组 [ext1, ext2]
                  record = record[0]
                  let extKeys = Object.keys(record).filter(r => r.startsWith('ext')).map(r => parseInt(r.substring(3)))
                  extKeys.sort((a, b) => a - b > 0? 1: -1)
                  obj[item.field] = extKeys.map(r => record['ext' + r])
                } else {
                  record = record[0]
                  obj[item.field] = record.ext1
                }
                item.logic = record.logic
                item.compare = record.compare
              } else {
                item.logic = 'AND'
                item.compare = '='
                obj[item.field] = undefined
              }
            }
            console.log('obj', obj)
            callback(obj)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      getData(values){
        let conditionSets = []
        for (let [index, item] of this.options.entries()) {
          let val = values[item.field]
          if (val) {
            let obj = {
              field: item.field,
              logic: item.logic,
              compare: item.compare || '=',
              orderNo: 0,
              groupNo: index
            }

            if (item.group) {
              val.forEach((r1, i) => {
                conditionSets.push({ ...obj, ...r1, orderNo: i })
              })

            } else {
              if (!Array.isArray(val)) {
                val = [val]
              }
              val.forEach((r, i) => {
                obj['ext' + (i + 1)] = r
              })
              conditionSets.push(obj)
            }

            delete values[item.field]
          }
        }
        return conditionSets
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
