<template>
  <div class="table-page-search-wrapper background-white">
    <a-spin :spinning="confirmLoading">
      <template v-for="node in gradeNodeArray">
        <a-form layout="inline" style="margin-bottom: 10px">
          <a-row :gutter="8">
            <a-col :span="7">
              <a-form-item label="节点编号" v-bind="ruleFormItemLayout">
                <a-input :value="node.key" readOnly/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="节点名称" :labelCol="{sm: { span: 24 },md: { span: 6 } }"
                           :wrapperCol="{sm: { span: 24 },md: { span: 18 }}">
                <a-input :value="node.text" readOnly/>
              </a-form-item>
            </a-col>
            <!--<a-col :span="5" v-if="colSelectObj[node.key].length > 0">-->
            <a-col :span="5">
              <a-form-item label="打分" v-bind="ruleFormItemLayout" v-if="gradesObj[node.key]&&gradesObj[node.key].length > 0">
                <a-switch v-model="node.grade" :disabled="readonly"></a-switch>
              </a-form-item>
              <!--<a-form-item v-else>
                没有打分项
              </a-form-item>-->
            </a-col>
          </a-row>
          <div v-if="node.grade">
              <a-row :gutter="8" class="grade_area" v-for="(item,gradeIndex) in gradesObj[node.key]" :key="gradeIndex">
                <a-col :md="6" :sm="14">
                  <a-form-item label="参数选择" :labelCol="{sm: 24 ,md: 9  }" :wrapperCol="{sm: 24 ,md:15 }">
                    <a-select :dropdownMatchSelectWidth="false" v-model="item.colId"
                              showSearch placeholder="请先选择类型" :disabled="readonly" :filterOption="filterOption" >
                      <template v-for="(col,index) in colSelectObj[node.key]" >
                        <a-select-option :value="col.colId" :key="index"
                        >{{`${col.colDesc}(${col.colId})`}}
                        </a-select-option>
                      </template>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="10">
                  <a-form-item label="计算公式" v-bind="ruleFormItemLayout">
                    <a-select v-model="item.method" :disabled="readonly">
                      <a-select-option :value="item.id" v-for="item in methods" :key="item.id">
                        <span :title="item.tip">{{item.name}}</span>
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="5" :sm="8">
                  <a-form-item label="基准值" v-bind="ruleFormItemLayout" has-feedback
                               :validate-status="getValidStatus(node.key,gradeIndex,'standardVal')"
                               :help="getValidMsg(node.key,gradeIndex,'standardVal')">
                    <a-input tyle="number" v-model="item.standardVal" :readOnly="readonly"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="5" :sm="8">
                  <a-form-item label="权重(%)" v-bind="ruleFormItemLayout" has-feedback
                               :validate-status="getValidStatus(node.key,gradeIndex,'weight')"
                               :help="getValidMsg(node.key,gradeIndex,'weight')">
                    <a-input tyle="number" v-model="item.weight" :readOnly="readonly"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="2" :sm="8" v-if="!readonly">
                  <a-form-item style="white-space: nowrap;">
                    <a-icon type="plus-square" theme="twoTone" @click="addGrade(node,gradeIndex)"
                            style="font-size: 20px;margin: 5px"></a-icon>
                    <a-icon type="minus-square" theme="twoTone" @click="decGrade(node,gradeIndex)"
                            style="font-size: 20px" v-if="gradesObj[node.key].length > 1"></a-icon>
                  </a-form-item>
                </a-col>
              </a-row>
          </div>

        </a-form>
      </template>
    </a-spin>

  </div>
</template>
<script>
  import { getGradeColConfig } from '@/api-sv3/api-flow'

  let requireFun = val => !(val === undefined || val === null || (val+"").trim() === '')
  export default {
    name: 'sumupGrade',
    components: {},
    props: {
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        ruleFormItemLayout: {
          labelCol: {
            sm: { span: 24 },
            md: { span: 10 },
          },
          wrapperCol: {
            sm: { span: 24 },
            md: { span: 14 },
          },
        },
        selectCols: [],
        methods: [{ id: '0', name: '公式一', tip: '(值-基准值)/(最大值-基准值)*权重' }],
        confirmLoading: false,
        gradesObj: {},
        colIdsObj: {},
        colSelectObj: {},
        validateStatus: { 'standardVal': {}, 'weight': {} },
        validateMessage: { 'standardVal': {}, 'weight': {} },
        validateFields: {
          'standardVal': {
            valids: [requireFun],
            msgs: ['这是必填字段']
          },
          'weight': {
            valids: [requireFun, val => {
              let num = parseFloat(val);
              return num > 0 && num <= 100
            }],
            msgs: ['这是必填字段', '范围0 ~ 100(不包括0)']
          },
        },
        nodeArray: [],
        rules: [],
        afterSelectColGetFun: []
      };
    },
    beforeMount() {
      this.confirmLoading = true
      // 获取全部评分字段列表
      getGradeColConfig().then(res => {
        if (res.success) {
          let selectCols = res.result
          for (let col of selectCols) {
            col.colId = `${col.tabName}:${col.colName}`
          }
          this.selectCols = selectCols
          for (let fun of this.afterSelectColGetFun) {
            fun()
          }
          this.afterSelectColGetFun = []
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    methods: {
      addGrade(node, index) {
        let firstCol = this.colSelectObj[node.key][0]
        this.gradesObj[node.key].splice(index + 1, 0, {
          colId: firstCol.colId,
          /*evaluateTable: firstCol.tabName,
          evaluateField: firstCol.colName,
          evaluateFieldname: firstCol.colChnName,*/
          method: this.methods[0].id
        })

      },
      decGrade(node, index) {
        this.gradesObj[node.key].splice(index, 1)
      },
      // 验证字段
      toValidateField(nodeCode, index, val, field) {
        let noError = true
        let { valids, msgs } = this.validateFields[field]
        if (!this.validateStatus[field][nodeCode]) {
          this.$set(this.validateStatus[field], nodeCode, {})
        }
        if (!this.validateMessage[field][nodeCode]) {
          this.$set(this.validateMessage[field], nodeCode, {})
        }
        for (let [itemIndex, itemFun] of valids.entries()) {
          if (!itemFun(val)) {
            this.$set(this.validateStatus[field][nodeCode], index, 'error')
            this.$set(this.validateMessage[field][nodeCode], index, msgs[itemIndex])
            noError = false
            break
          } else {
            this.$set(this.validateStatus[field][nodeCode], index, undefined)
            this.$set(this.validateMessage[field][nodeCode], index, undefined)
          }
        }
        return noError
      },
      toValidate() {
        let hasNoError = true
        let totalWeight = 0
        let colIdObj = {}
        let gradeCount = 0
        for (let node of this.gradeNodeArray) {
          if (!node.grade) {
            continue
          }
          gradeCount++
          for (let [index, item] of this.gradesObj[node.key].entries()) {
            for (let field in this.validateFields) {
              if (!this.toValidateField(node.key, index, item[field], field)) {
                hasNoError = false
              }
            }
            totalWeight += parseFloat(item.weight)
            if (colIdObj[item.colId]) {
              this.$message.warn(item.evaluateFieldname + ':评分项不能相同')
              hasNoError = false
            } else {
              colIdObj[item.colId] = true
            }
          }
        }
        if (gradeCount > 0 && totalWeight !== 100) {
          this.$message.warn('权重和必须等于100')
          hasNoError = false
        }
        console.log('array', this.getData())
        return hasNoError
      },
      getData() {
        let array = []
        for (let node of this.gradeNodeArray) {
          if (!node.grade) {
            continue
          }
          let nodeCode = node.key
          for (let item of this.gradesObj[nodeCode]) {
            console.log('item', item)
            let { colId, method, standardVal, weight } = item
            let colItem = this.colSelectObj[node.key].find(col => col.colId === colId)
            array.push({
              nodeCode,
              evaluateTable: colItem.tabName,
              evaluateField: colItem.colName,
              evaluateFieldname: colItem.colChnName,
              method,
              standardVal,
              weight
            })
          }
        }
        return array
      },

      setData(nodeArray, ruleArray, gradeArray) {
        this.nodeArray = nodeArray
        for (let rule of ruleArray) {
          let array = this.colIdsObj[rule.nodeCode]
          if (!array) {
            this.colIdsObj[rule.nodeCode] = array = []
          }
          array.push(rule.tableName + ':' + rule.colName)
        }
      },
      setGrades(gradeArray) {
        if (this.selectCols.length === 0) {
          this.afterSelectColGetFun.push(() => this.setGrades(gradeArray))
          return
        }
        this.gradesObj = {}
        for (let item of gradeArray) {
          let nodeCode = item.nodeCode
          let grades = this.gradesObj[nodeCode]
          if (!grades) {
            this.$set(this.gradesObj, nodeCode, grades = [])
          }
          item.colId = `${item.evaluateTable}:${item.evaluateField}`
          grades.push(item)
          let colSelect = this.colSelectObj[nodeCode]
          if (!colSelect) {
            let colIds = this.colIdsObj[nodeCode]
            this.colSelectObj[nodeCode] = colSelect = colIds ?
              this.selectCols.filter(selectCol => colIds.some(colId => colId === selectCol.colId)) : []
          }
        }
        for (let node of this.gradeNodeArray) {
          let nodeCode = node.key
          this.$set(node, 'grade', !!this.gradesObj[nodeCode])
          if (node.grade) {
            continue
          }
          let grades = []
          let colSelect = this.colSelectObj[nodeCode]
          if (!colSelect) {
            let colIds = this.colIdsObj[nodeCode]
            this.colSelectObj[nodeCode] = colSelect = colIds ?
              this.selectCols.filter(selectCol => colIds.some(colId => colId === selectCol.colId)) : []
          }
          if (colSelect.length > 0) {
            let firstCol = colSelect[0]
            grades.push({
              colId: firstCol.colId,
              /*evaluateTable: firstCol.tabName,
              evaluateField: firstCol.colName,
              evaluateFieldname: firstCol.colDesc,*/
              method: this.methods[0].id
            })
          }
          this.$set(this.gradesObj, nodeCode, grades)
        }
      },
      getValidStatus(nodeCode, index, field) {
        return this.validateStatus[field][nodeCode] ? this.validateStatus[field][nodeCode][index] || '' : ''
      },
      getValidMsg(nodeCode, index, field) {
        return this.validateMessage[field][nodeCode] ? this.validateMessage[field][nodeCode][index] || '' : ''
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.indexOf(input) >= 0
      },
    },
    computed: {
      gradeNodeArray() {
        return this.nodeArray.filter(node => node.category === 'conditional' || node.category === 'rectangle')
      }
    }
  }
</script>
<style scoped>
  .table-page-search-wrapper .ant-form-item {
    margin-bottom: 5px;
  }

  .grade_area {
    padding-left: 10px;
    border-left: 2px solid #e8e8e8;
  }

  /*.table-page-search-wrapper .ant-form-item>.ant-form-item-label{*/
  /*font-size: 10px!important;*/
  /*}*/
</style>