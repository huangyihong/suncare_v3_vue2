<template>
    <div>
        <a-spin :spinning="confirmLoading">
            <a-button type="primary" @click="addRuleGroup" :disabled="ruleGroup.length === 3" v-if="!readonly">
                添加{{typeName}}条件组
            </a-button>
            <a-empty v-if="ruleGroup.length === 0 && !confirmLoading"></a-empty>
            <a-card hoverable style="margin-top: 10px" v-for="(item,index) in ruleGroup" :key="index">
                <a-card-meta>
                    <template slot="title">
                        {{item.groupName}}
                        <span style="float: right" :style="{color:primaryColor}" v-if="!readonly">
                        <a-icon type="edit" @click="openRuleGroupConfig(index)"/>
                        <a-divider type="vertical" style="margin: 0 20px"/>
                        <a-icon type="delete" @click="removeRuleGroup(index)"/>
                      </span>
                    </template>
                    {{item}}
                    <template slot="description">
                        <div style="line-height: 30px">
                            <template v-for="(groupItem,groupIndex) in item.diseaseGroups">
                                <div>
                                    <span v-if="groupIndex === 0" class="t-grey-666">疾病组：</span>
                                    <span v-else class="m-l-20">或 </span>
                                    <template v-for="(tagItem,tagIndex) in groupItem">
                                        <a-tag :key="tagItem.code">
                                            {{tagItem.name}}({{tagItem.code}})
                                        </a-tag>
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div style="line-height: 30px">
                            <template v-for="(groupItem,groupIndex) in item.treatGroups">
                                <div>
                                    <span v-if="groupIndex === 0" class="t-grey-666">项目组：</span>
                                    <span v-else class="m-l-20">或 </span>
                                    <template v-for="(tagItem,tagIndex) in groupItem">
                                        <a-tag :key="tagItem.code">
                                            {{tagItem.name}}({{tagItem.code}})
                                        </a-tag>
                                    </template>
                                </div>
                            </template>
                        </div>

                        <div style="line-height: 30px">
                            <template v-for="(testResult,index) in item.testResults">
                                <div>
                                    <span v-if="index === 0" class="t-grey-666">化验项目(组)结果：</span>
                                    <span v-else class="m-l-20">或 </span>
                                    <a-tag >
                                    {{testResult.itemType ==='ITEM'?'项目':'项目组'}}:
                                    {{testResult.itemName}}({{testResult.itemValue}})
                                    <span class="m-l-10">
                                        {{testResult.valueType === '1'?
                                        `定量范围： ${testResult.value} ${testResult.unit && testResult.unitName}`
                                        :`定性选择： ${testResult.unitName}`}}
                                    </span>
                                    </a-tag>
                                </div>
                            </template>
                        </div>

                    </template>
                </a-card-meta>
            </a-card>


        </a-spin>
        <medical-clinical-indication-group ref="modalForm" @close="UpdateRuleGroup"></medical-clinical-indication-group>
    </div>
</template>

<script>
  import { getAction } from '@/api/manage'

  import MedicalClinicalIndicationGroup from "@/pages/case/plugin/MedicalClinicalIndicationGroup"
  import { mixin } from '@/utils/mixin'
  import pick from 'lodash/pick'

  export default {
    name: 'IndicationSetGroup',
    mixins: [mixin],
    components: { MedicalClinicalIndicationGroup },
    props: ['readonly', 'value'],
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        url: {
          queryNameByCodes: '/medical/medicalRuleConfig/queryNameByCodes'
        },
        confirmLoading: false,
        ruleGroup: [],
        editGroupIndex: undefined,

      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log('val === this.changeData', val ,this.changeData)
          if(this.changeData === val){
            return
          }
          if (val && Array.isArray(val) && val.length > 0) {
            let array = [...val]
            // 组排序
            array.sort((a, b) => a.groupNo - b.groupNo)

            let codesMap = {
              diseaseGroups: new Set(),
              treatGroups: new Set(),
              treatments: new Set(),
            }
            // 构造通用组值 组内,组外| 返回两层数组
            let constructGroupValue = (r, extIndex, field) => {
              let codesStr = r['ext' + extIndex]
              if (codesStr && codesStr.length > 0) {
                let array = codesStr.split('|').map(r => r.split(','))
                array.flat().forEach(r => codesMap[field].add(r))
                return array.map(r => r.map(r1 => ({code: r1, name: r1})))
              }
            }
            this.ruleGroup = array.map(r => {
              let extIndex = 1
              let obj = {
                groupName: r['ext' + extIndex++],
                diseaseGroups: constructGroupValue(r, extIndex++, 'diseaseGroups'),
                treatGroups: constructGroupValue(r, extIndex++, 'treatGroups')
              }

              let testResultStr = r['ext' + extIndex++]
              if (testResultStr && testResultStr.length > 0) {
                let testResults = obj.testResults = JSON.parse(testResultStr)
                for(let testResult of testResults){
                  let codeType = testResult.itemType === 'ITEM'?'treatments': 'treatGroups'
                  testResult.itemName = testResult.itemValue
                  codesMap[codeType].add(testResult.itemValue)
                }
              }
              return obj
            })

            let param = {}
            for(let key in codesMap){
              let setVal = codesMap[key]
              if(setVal && setVal.size > 0){
                param[key] = Array.from(setVal).join(',')
              }
            }
            if(Object.keys(param).length > 0){
              this.loadData(param)
            }

            console.log('codesMap', codesMap)
            console.log('param', param)
          } else {
            this.ruleGroup = []
          }
        },
      },
      ruleGroup(val){
        this.onChange()
      }
    },
    methods: {
      loadData(param) {
        this.confirmLoading = true
        getAction(this.url.queryNameByCodes, param).then(res => {
          if (res.success) {
            let {diseaseGroups: diseaseGroupsMap = {},treatGroups: treatGroupsMap = {}, treatments: treatmentsMap = {} } = res.result
            this.ruleGroup.forEach(record => {
              record.diseaseGroups && record.diseaseGroups.forEach(group => {
                group.forEach(r => r.name = diseaseGroupsMap[r.code] || r.code )
              })
              record.treatGroups && record.treatGroups.forEach(group => {
                group.forEach(r => r.name = treatGroupsMap[r.code] || r.code)
              })
              record.testResults && record.testResults.forEach(testResult => {
                let map = testResult.itemType === 'ITEM'?treatmentsMap: treatGroupsMap
                testResult.itemName = map[testResult.itemValue] || testResult.itemValue
              })
            })
            console.log('loadData.over')
            // this.ruleGroup = [...this.ruleGroup]
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      clear() {
        this.ruleGroup = []
      },
      openRuleGroupConfig(index) {
        this.editGroupIndex = index
        this.$refs.modalForm.loadData(this.ruleGroup[index])
      },
      removeRuleGroup(index) {
        this.ruleGroup.splice(index, 1)
      },
      addRuleGroup() {
        this.ruleGroup.push({ groupName: `条件组${this.ruleGroup.length + 1}` })
      },
      UpdateRuleGroup(record) {
        this.ruleGroup.splice(this.editGroupIndex, 1, record)
      },
      onChange() {
        let array = []
        for (let [index,record] of this.ruleGroup.entries()) {
          let data = {}
          // 疾病组
          if(record.diseaseGroups && record.diseaseGroups.length > 0 ){
            data.ext2 = record.diseaseGroups.map(group => {
              return group.map(r => r.code).join(',')
            }).join('|')
          }
          // 项目组
          if(record.treatGroups && record.treatGroups.length > 0){
            data.ext3 = record.treatGroups.map(group => {
              return group.map(r => r.code).join(',')
            }).join('|')
          }
          if(record.testResults && record.testResults.length > 0){
            data.ext4 = JSON.stringify(record.testResults.map(r => {
              let obj = {...r}
              delete obj.itemName
              // delete obj.unitName
              return obj
            }))
          }

          if (Object.keys(data).length > 0) {
            Object.assign(data, {ext1: record.groupName, logic: 'OR', orderNo: index,})
            array.push(data)
          }
        }
        if(array.length > 0){
          array[0].logic = 'AND'
        }
        console.log('IndicationSetGroup.change', this.changeData)
        this.$emit('change', this.changeData = array)
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
