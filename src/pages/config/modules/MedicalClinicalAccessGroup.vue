<template>
  <a-spin :spinning="confirmLoading">
    <a-button type="primary" @click="addAccessGroup" v-if="!readonly">添加{{typeName}}条件组</a-button>
    <a-empty v-if="list.length === 0 && !confirmLoading"></a-empty>
    <template v-for="(group,index) in list">
      <a-card hoverable style="margin-top: 10px">
        <a-card-meta>
          <template slot="title">
            {{group.groupName}}
            <span style="float: right" :style="{color:primaryColor}" v-if="!readonly">
                <!--<a @click="openAccessGroupConfig(group)">配置</a>-->
                <a-icon type="edit" @click="openAccessGroupConfig(group)"/>
                <a-divider type="vertical" style="margin: 0 20px"/>
              <!--<a @click="removeAccessGroup(index)">移除</a>-->
                <a-icon type="delete" @click="removeAccessGroup(index)"/>

              </span>

          </template>
          <template slot="description">
            <template v-if="group.patientAgeMin || group.patientAgeMax">
              <!--<div>年龄范围：{{group.patientAgeMin?`${group.patientAgeMin}(${group.patientAgeUnit})`:''}} - {{group.patientAgeMax?`${group.patientAgeMax}(${group.patientAgeUnit})`:''}}</div>-->
              <div>年龄范围：{{group.patientAgeMin}} - {{group.patientAgeMax}}
              <span style="margin-left: 30px">单位：{{group.patientAgeUnit}}</span></div>
            </template>
            <template v-if="group.hospBelongTo">
              <div>就诊医疗机构隶属关系：{{filterDictText(hospBelongToDict,group.hospBelongTo)}}</div>
            </template>
            <template v-for="(item,itemIndex) in group.list">
              <div style="line-height: 30px">{{item.title}}：
                <template v-for="(record,tagIndex) in item.data">
                  <!--<a-tooltip :title="record.desc" :key="record.code" >-->
                  <a-tag :key="record.code" :closable="!readonly"
                         @close="removeTag(index,itemIndex,tagIndex)">{{`${record.name}(${record.code})`}}
                    <a :style="{color: primaryColor}">{{record.desc}}</a>
                  </a-tag>
                  <!--</a-tooltip>-->

                </template>
              </div>
            </template>
          </template>
        </a-card-meta>
      </a-card>
    </template>
    <!--<a-card title="条件组" :headStyle="{backgroundColor:'#f6f6f6'}" style="margin-bottom: 20px">
      <a slot="extra" @click="addAccessGroup">添加</a>
      <template v-for="group in list">
        <a-card-grid style="width:50%;padding: 16px">
          &lt;!&ndash;:style="{color:rule.ruleId===currentRuleId?primaryColor:undefined}"&ndash;&gt;
          {{group.groupName}} <a style="float: right" @click="openAccessGroupConfig(group)">配置</a>
        </a-card-grid>
      </template>
    </a-card>-->
    <medical-clinical-access-group-detail ref="accessGroupRef" @close="detailOk"
                                          v-if="!readonly"></medical-clinical-access-group-detail>
  </a-spin>
</template>

<script>
  import { mixin } from '@/utils/mixin'
  import MedicalClinicalAccessGroupDetail from '@/pages/config/modules/MedicalClinicalAccessGroupDetail'
  import { queryAccessGroupByClinicalId } from '@/api-sv3/api-medical'
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'

  export default {
    name: 'MedicalClinicalAccessGroup',
    components: { MedicalClinicalAccessGroupDetail },
    mixins: [mixin],
    props: {
      clinicalId: String,
      readonly: {
        type: Boolean,
        required: false
      },
      type: String
    },
    computed: {
      typeName() {
        return this.type === 'reject' ? '排除' : '准入'
      }
    },
    data() {
      return {
        confirmLoading: false,
        list: [],
        editGroup: undefined,
        hospBelongToDict: [],
        filterDictText,
      }
    },
    watch: {
      clinicalId: {
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.queryData(val)
          }
        },
      }
    },
    beforeMount() {
      this.$util.initDict('StartupCorp').then(data => {
        this.hospBelongToDict = data
      })
    },
    methods: {
      queryData(clinicalId) {
        this.confirmLoading = true
        queryAccessGroupByClinicalId({ clinicalId, groupType: this.type }).then(res => {
          if (res.success) {
            let { accessGroups, diseaseGroups, operations, projects, drugGroups, pathologys } = res.result
            // let selectInfoObj = this.$refs.accessGroupRef.selectInfoObj
            this.list = accessGroups.map(group => {
              let {
                diseaseGroups: diseaseGroupsStr, operations: operationsStr,
                checkItems: checkItemsStr, labworkItems: labworkItemsStr, drugGroups: drugGroupsStr,
                pathologys: pathologysStr,checkItemsDesc
              } = group
              let obj = {
                groupId: group.groupId,
                groupName: group.groupName,
                patientAgeMin: group.patientAgeMin,
                patientAgeMax: group.patientAgeMax,
                patientAgeUnit: group.patientAgeUnit,
                hospBelongTo: group.hospBelongTo,
              }
              let list = obj.list = []
              if (diseaseGroupsStr && diseaseGroupsStr.length > 0) {
                let thisData = diseaseGroupsStr.split(",").map(code => {
                  let obj = diseaseGroups.find(item => item.groupCode === code)
                  return obj ? {
                    code: obj.groupCode,
                    name: obj.groupName,
                    remark: obj.remark,
                  } : null
                }).filter(item => !!item)
                list.push({
                  field: 'diseaseGroups', title: '疾病组', data: thisData
                })
              }
              if (operationsStr && operationsStr.length > 0) {
                let thisData = operationsStr.split(",").map(code => operations.find(item => item.code === code))
                if (thisData.length > 0) {
                  list.push({
                    field: 'operations',
                    title: '手术或操作编码/名称',
                    data: thisData
                  })
                }
              }
              if (checkItemsStr && checkItemsStr.length > 0) {
                let thisData = checkItemsStr.split(",").map(code => projects.find(item => item.code === code))
                if (thisData.length > 0) {
                  if(checkItemsDesc){
                    let descArray = checkItemsDesc.split(",")
                    for(let [index,desc] of descArray.entries()){
                      thisData[index].desc = desc
                    }
                  }

                  list.push({
                    field: 'checkItems',
                    title: '检查化验项目',
                    data: thisData
                  })
                }
              }
              /*if(labworkItemsStr && labworkItemsStr.length > 0){
                list.push({
                  field: 'labworkItems', title: '化验项目',data:labworkItemsStr.split(",").map(code => projects.find(item => item.code === code))
                })
              }*/
              if (drugGroupsStr && drugGroupsStr.length > 0) {
                let thisData = drugGroupsStr.split(",").map(code => {
                  let obj = drugGroups.find(item => item.groupCode === code)
                  return obj ? {
                    code: obj.groupCode,
                    name: obj.groupName,
                    remark: obj.remark,
                  } : null
                }).filter(item => !!item)
                if (thisData.length > 0) {
                  list.push({
                    field: 'drugGroups', title: '药品组', data: thisData
                  })
                }

              }

              if (pathologysStr && pathologysStr.length > 0) {
                let thisData = pathologysStr.split(",").map(code => {
                  let obj = pathologys.find(item => item.code === code)
                  return obj ? {
                    code: obj.code,
                    name: obj.name,
                    remark: obj.descript,
                  } : null
                }).filter(item => !!item)
                if (thisData.length > 0) {
                  list.push({
                    field: 'pathologys', title: '病理形态编码/名称', data: thisData
                  })
                }

              }
              return obj
            })
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      addAccessGroup() {
        this.list.push({
          groupName: `${this.typeName}条件组${this.list.length + 1}`
        })
      },
      removeAccessGroup(index) {
        this.list.splice(index, 1)
      },
      openAccessGroupConfig(group) {
        this.$refs.accessGroupRef.edit(this.editGroup = group)
      },
      removeTag(groupIndex, itemIndex, tagIndex) {
        setTimeout(() => {
          let data = this.list[groupIndex].list[itemIndex].data
          data.splice(tagIndex, 1)
          if (data.length === 0) {
            this.list[groupIndex].list.splice(itemIndex, 1)
          }
        }, 300)
      },
      detailOk(data) {
        data.groupId = this.editGroup.groupId
        let index = this.list.indexOf(this.editGroup)
        this.list.splice(index, 1, data)
      },
      getData() {
        return this.list.map((group,index) => {
          let obj = {
            groupId: group.groupId,
            groupName: group.groupName,
            groupType: this.type,
            groupNo: index + 1,
            patientAgeMin: group.patientAgeMin,
            patientAgeMax: group.patientAgeMax,
            patientAgeUnit: group.patientAgeUnit,
            hospBelongTo: group.hospBelongTo,
          }
          if (group.list && group.list.length > 0) {
            for (let item of group.list) {
              let data = item.data
              obj[item.field] = data.map(record => record.code).join(",")
              obj[item.field + 'Desc'] = data.map(record => record.desc).join(",")
            }
          }
          return obj
        })
      },
    },
  }
</script>
<style scoped>

</style>
