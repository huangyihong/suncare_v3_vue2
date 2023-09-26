<template>
    <a-spin :spinning="confirmLoading">
        <template v-for="(group, groupIndex) in groups">
            <h3>第 {{groupIndex + 1}} 层
                <span style="font-size: 14px">
                    <a class="m-l-20" @click="tableColSet(group)">配置显示字段({{group.fields?group.fields.length:'0'}})</a>
                    <a class="m-l-20" @click="groups.splice(groupIndex, 1)">移除</a>
                </span>
            </h3>
            <div class="fieldset-box box-padding"
                 :style="focusIndex === groupIndex?`border: 1px solid ${primaryColor}`: ''"
                 @click="focusIndex = groupIndex">
                <div>
                    <div class="t-c" v-if="group.data.length === 0">未选择字段</div>
                    <draggable :options="{animation: 300}" v-model="group.data">
                        <div v-for="(item, index) in group.data" style="display: inline-block">
                            <a-tag :key="item.code" :color="primaryColor" closable
                                   @close.prevent="rmSelected(group, index)"
                                   :title="item.code" class="tag-style">{{item.value}}
                            </a-tag>
                        </div>
                    </draggable>
                </div>
                <div v-if="focusIndex === groupIndex">
                    <div style="border-top: #b9c1d6 1px dashed;margin: 10px 0"></div>
                    <template v-for="(item, index) in group.selectData">
                        <a-tag :key="item.code" color="#666" :closable="false"
                               :title="item.code" class="tag-style"
                               @click="addToGroupData(group, index)">{{item.value}}
                        </a-tag>
                    </template>
                </div>
            </div>
        </template>
        <a-button @click="groups.push({data: [], selectData: [...dataSource]});focusIndex = groups.length - 1;">增加统计层
        </a-button>


        <field-select ref="fieldSelectRef" :uniqueVal="uniqueVal"></field-select>
        <m-modal
                centered
                destroyOnClose
                title="请选择需要沉淀分组数据的项目批次"
                :width="500"
                :visible="selectVisible"
                @ok="handleSelectOk"
                @cancel="handleSelectClose"
                cancelText="关闭">
            <!--<task-action-field-col ref="selectRef" :selected="selectData" :param="{toSearch: '1'}"></task-action-field-col>-->
            <task-project-batch-tree-filter ref="selectRef" :param="{actionId: model.actionId}" tip="只显示存在当前不合规行为的项目批次"></task-project-batch-tree-filter>
        </m-modal>
    </a-spin>
</template>

<script>
  import draggable from 'vuedraggable'
  import debounce from 'lodash/debounce';
  import FieldSelect from '@/pages/probe/case/fieldSelect'
  import pick from 'lodash/pick'
  import { getAction } from '@/api/manage'
  import { postAction } from '@/api-sv3/manage'
  import TaskProjectBatchTreeFilter  from '@/pages/selectMulti/TaskProjectBatchTreeFilter'

  export default {
    name: 'Reorder',
    props: {},
    components: {
      draggable,
      FieldSelect,
      TaskProjectBatchTreeFilter,
    },
    data() {
      this.colTableDict = {
        'ORGID': 'STD_ORGANIZATION',
        'ORGNAME': 'STD_ORGANIZATION',
        'DOCTORID': 'DWB_DOCTOR',
        'CLIENTID': 'DWB_CLIENT',
        'TOGETHERID': 'APP_FK_INHOSPITAL_TOGETHER',
      }
      this.url = {
        queryColByConfigId: '/task/taskActionFieldCol/queryDelByConfigId',
        saveExtData: this.$suncare_v3 + '/apiTask/taskActionFieldConfig/saveExtData'
      }
      return {
        confirmLoading: false,
        groups: [{ data: [] }],
        dataSource: [],
        focusIndex: 0,
        uniqueVal: new Date().getTime(),
        maxItemNum: 3,
        selectVisible: false,
      }
    },
    computed: {
      primaryColor() {
        return this.$store.getters.color
      },
      height() {
        return this.$store.getters.height
      }
    },
    beforeMount() {
      // this.selectVisible = true
      /*this.confirmLoading = true
      this.$util.initDict('UNREASONABLE_GROUPBY').then(data => {
        this.dataSource = data
        this.groups.forEach(r => r.selectData = [...data])
      }).finally(() => {
        this.confirmLoading = false
      })*/
    },
    methods: {
      edit(record) {
        let {groupFields, id} = record
        this.model = record
        this.confirmLoading = true
        getAction(this.url.queryColByConfigId, { configId: id }).then(res => {
          if (res.success) {
            let data = res.result.map(r => ({
              colId: r.colId,
              code: r.tableName + '.' + r.colName,
              value: r.editName || r.colCnname
            }))
            this.dataSource = data
            this.groups.forEach(r => r.selectData = [...data])
            this.editData(groupFields)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })

      },
      editData(jsonStr) {
        if (jsonStr && jsonStr !== '[]') {
          let data = JSON.parse(jsonStr)
          this.groups = data.map(obj => {
            if (!obj.data && obj.code) {
              obj.data = [pick(obj, 'code', 'value')]
              delete obj.code
              delete obj.value
            }
            obj.data.forEach(r => {
              if (r.oCode) {
                r.code = r.oCode
                delete r.oCode
              }
              // 兼容旧的没有表数据
              if(r.code.indexOf('.') === -1){
                r.code = 'MEDICAL_UNREASONABLE_ACTION.' + r.code
              }
            })
            let codeSet = new Set(obj.data.map(r => r.code))
            let selectData = this.dataSource.filter(r => !codeSet.has(r.code))
            return { ...obj, selectData }
          })
          this.focusIndex = -1
        } else {
          this.groups = [{ data: [], selectData: [...this.dataSource] }]
          this.focusIndex = 0
        }
      },
      getData(callback) {
        let extIndex = 0
        let extFieldMap = {}
        let data = this.groups.filter(r => r && r.data && r.data.length > 0).map(r => {
          let { data, fields } = r
          let obj = {
            data: data.map(r => {
              let code
              if (!r.code.startsWith("MEDICAL_UNREASONABLE_ACTION")) {
                let extField = extFieldMap[r.code]
                if(!extField){
                  extField = 'EXT' + ++extIndex
                  extFieldMap[r.code] = extField
                }
                code = extField
              } else {
                code = r.code.substring(r.code.indexOf('.') + 1)
              }
              return {
                oCode: r.code,
                code,
                value: r.value,
              }

            })
          }
          if (fields && fields.length > 0) {
            obj.fields = fields
          }
          return obj
        })
        this.toSaveData = data
        if(extIndex > 0){
          this.extFieldMap = extFieldMap
          this.callback = callback
          this.openSelect()
          return
        }
        callback(JSON.stringify(this.toSaveData))
      },
      clear() {
        this.groups = [{ data: [], selectData: [...this.dataSource] }]
      },
      addToGroupData(group, index) {
        if (group.data.length === this.maxItemNum) {
          this.$message.warn('统计维度已是最大个数')
          return
        }
        group.data.push(...group.selectData.splice(index, 1))
      },
      rmSelected(group, index) {
        group.selectData.push(...group.data.splice(index, 1))

      },
      tableColSet(record) {
        let { code, fields } = record
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          mode: "multi",
          callback: (keys, titles) => {
            record.fields = keys.map((r, i) => ({ code: r, value: titles[i] }))
            this.groups.splice(this.groups.indexOf(record), 1, record)
          },
          // tableName: this.colTableDict[code],
          selected: fields && fields.map(r => r.code) || [],
          required: false,
        })
      },
      openSelect() {
        this.selectVisible = true
      },
      handleSelectOk() {
        this.selectVisible = false
        let data = this.$refs.selectRef.getSelect()
        if(data.length > 0){
          let dataSources = data[0].join(',')
          let projectIds = data[1].join(',')
          let batchIds = data[2].join(',')
          // let extFieldMap = JSON.stringify(this.extFieldMap)
          let groupFields = JSON.stringify(this.toSaveData)
          this.confirmLoading = true
          postAction(this.url.saveExtData, {groupFields, actionId: this.model.actionId,
            dataSources, projectIds, batchIds
          }).then(res => {
            if (res.success) {
              this.$message.success(res.result)
              this.handleSelectClose();
            } else {
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        } else {
          this.handleSelectClose();
        }
      },
      handleSelectClose() {
        this.selectVisible = false
        this.callback(JSON.stringify(this.toSaveData))
      },
    },
  }
</script>
<style scoped>
    .border-blue {
        border: 2px solid deepskyblue;
    }

    .tag-style {
        margin-bottom: 5px;
        font-size: 14px;
        line-height: 26px;
    }
</style>
