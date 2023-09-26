<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <div style="padding: 10px">
        <a-row :gutter="12" class="title t-c" style="margin: 0;padding: 0 10px">
          <!--<a-col :span="3" class="title-item">组外条件</a-col>-->
          <a-col :span="3" class="title-item">组内条件</a-col>
          <a-col :span="readonly?14:11" class="title-item">选择字段</a-col>
          <a-col :span="3" class="title-item">比较符</a-col>
          <a-col :span="4" class="title-item">值</a-col>
          <!--<a-col :span="1" class="title-item"></a-col>-->
          <!--<a-col :span="3" class="title-item" v-if="!readonly">行操作</a-col>-->
        </a-row>
        <a-empty class="m-t-6" v-show="groups.length === 0"></a-empty>
        <template v-for="(group,groupIndex) in groups">
          <a-row :gutter="24" style="margin: 0;padding: 10px">
            <a-col :span="6" :offset="18" v-if="groupIndex > 0">

              <a-form-model-item class="form-item" label="组间条件" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }">
                <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                                   required
                                   :disabled="readonly" class="w-b-100"
                                   v-model="group[0].logic"></m-dict-select-tag>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div style="padding: 10px;border: 1px solid #999999">
            <template v-for="(item,itemIndex) in group">
              <a-form-model ref="formRef" layout="inline" :model="item">
                <!--  <a-row :gutter="24" v-if="itemIndex === 0 && groupIndex > 0" style="margin: 0">
                    <a-col :span="6" :offset="18">
                    <a-form-model-item class="form-item" label="组间条件" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }">
                      <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                                         required
                                         :disabled="readonly"
                                         v-model="item.logic"
                                         v-if="itemIndex === 0 && groupIndex > 0"></m-dict-select-tag>
                    </a-form-model-item>
                    </a-col>
                  </a-row>-->
                <a-row :gutter="12" style="margin: 0">
                  <!--<a-col :span="3">
                    <a-form-model-item class="form-item">
                      <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                                         required
                                         :disabled="readonly"
                                         v-model="item.logic"
                                         v-if="itemIndex === 0 && groupIndex > 0"></m-dict-select-tag>
                    </a-form-model-item>
                  </a-col>-->
                  <!--组内条件-->
                  <a-col :span="3">
                    <a-form-model-item class="form-item" v-bind="formItemLayout">
                      <m-dict-select-tag dictCode="CASE_RELATION_CHAR"
                                         required
                                         :disabled="readonly"
                                         v-model="item.logic"
                                         v-if="itemIndex > 0"></m-dict-select-tag>
                      <!--<span class="bracket" v-else>(</span>-->
                    </a-form-model-item>
                  </a-col>
                  <!-- 选择字段-->
                  <a-col :span="readonly?14:11">
                    <a-form-model-item class="form-item" prop="colId" :rules="validatorRules.required"
                                       v-bind="formItemLayout">
                      <!--  <a-tooltip placement="top" :mouseEnterDelay="0.5" destroyTooltipOnHide>
                          <span slot="title" v-html="getTipInfo(item.colId)" v-if="item.colId"></span>
                          <a-input placeholder="请选择字段" readonly style="cursor: pointer"  @click="readonly?()=>{}:openFieldSelect(item,groupIndex,itemIndex)"
                                   :value="getFieldName(item.colId)"></a-input>
                        </a-tooltip>-->
                      <!--@click="readonly?()=>{}:openFieldSelect(item,groupIndex,itemIndex)"-->
                      <a-input placeholder="请选择字段" readOnly style="cursor: pointer"
                               v-on="readonly?{}:{mousedown:clickBefore,mouseup:(e)=> clickAfter(e,()=>{openFieldSelect(item,groupIndex,itemIndex)})}"
                               :value="getFieldName(item.colId)" :title="getTipInfo(item.colId)"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <!--比较符-->
                  <a-col :span="3">
                    <a-form-model-item class="form-item" v-bind="formItemLayout">
                      <m-dict-select-tag dictCode="CASE_COMPARE_CHAR" required
                                         v-model="item.compareType" v-bind="item.compareChartProp||{}"
                                         :disabled="readonly || item.inputType === '1'"></m-dict-select-tag>
                    </a-form-model-item>
                  </a-col>
                  <!--值-->
                  <a-col :span="4">
                    <a-form-model-item class="form-item" prop="compareValue" :rules="validatorRules.required"
                                       v-bind="formItemLayout">
                      <!--值为选择分组项-->
                      <m-dict-input v-if="item.compareType.endsWith('in')" v-model="item.compareValue"
                                    :name="item.compareName"
                                    @click="readonly?()=>{}:openSelect(groupIndex, itemIndex, 'dict')"></m-dict-input>

                      <!--值为输入项-->
                      <template v-else-if="!item.inputType || item.inputType === '0'">
                        <a-input-number :step="0.01" :disabled="readonly" v-model="item.compareValue"
                                        v-if="item.dataType && (item.dataType.indexOf('NUMBER') > -1 || item.dataType.indexOf('DECIMAL')) > -1"
                                        style="width: 100%"></a-input-number>
                        <!-- <a-input :disabled="readonly" v-model.number="item.compareValue" type="number"
                                         v-else-if="item.dataType.indexOf('NUMBER') > -1"
                                         ></a-input>-->
                        <j-date :readOnly="readonly" :show-time="true" :title="item.compareValue"
                                v-model="item.compareValue" placeholder="选择日期时间"
                                date-format="YYYY-MM-DD HH:mm:ss"
                                v-else-if="item.dataType && item.dataType.indexOf('DATE') > -1"
                                style="width: 100%;min-width: auto"></j-date>
                        <a-input :readOnly="readonly" v-model="item.compareValue" :title="item.compareValue"
                                 v-else>
                                 <!--v-if="item.compareType.indexOf('like') > -1 ||item.compareType==='regx'|| !item.dataType || item.dataType.indexOf('VARCHAR') > -1">-->
                          <a-icon type="edit" slot="suffix" style="color: #aaa;"/>
                        </a-input>
                      </template>
                      <!--值为字典项-->
                      <a-select v-else-if="item.inputType === '1'" v-model="item.compareValue"
                                :dropdownMatchSelectWidth="false" showSearch :filterOption="filterOption"
                                :disabled="readonly">
                        <a-select-option :value="dict.code" v-for="dict in item.inputDict" :key="dict.code">
                          {{dict.value}}
                        </a-select-option>
                      </a-select>
                      <template v-else-if="item.inputType === '3'">
                        <m-group-item-input v-if="item.compareType === '=' || item.compareType === '<>'" v-model="item.compareValue"
                                            :name="item.compareName" :kind="item.groupKind"
                                            :valueEqName="item.valueEqName"
                                            @click="readonly?()=>{}:openSelect(groupIndex, itemIndex, 'groupItem')"
                                            readonly></m-group-item-input>
                        <a-input :readOnly="readonly"
                                 v-model="item.compareValue" :title="item.compareValue"
                                 v-else>
                          <a-icon type="edit" slot="suffix" style="color: #aaa;"/>
                        </a-input>
                      </template>
                      <template v-else-if="item.inputType === '4'">
                        <m-group-input v-if="item.compareType === '=' || item.compareType === '<>'" v-model="item.compareValue"
                                       :name="item.compareName"
                                       :kind="item.groupKind"
                                       :valueEqName="item.valueEqName"
                                       @click="readonly?()=>{}:openSelect(groupIndex, itemIndex, 'group')" readOnly></m-group-input>
                        <a-input :readOnly="readonly"
                                 v-model="item.compareValue" :title="item.compareValue"
                                 v-else>
                          <a-icon type="edit" slot="suffix" style="color: #aaa;"/>
                        </a-input>
                      </template>
                      <template v-else-if="item.inputType === '5'">
                        <m-org-input v-if="item.compareType === '=' || item.compareType === '<>'" v-model="item.compareValue"
                                     :name="item.compareName"
                                     :valueEqName="item.valueEqName"
                                     @click="readonly?()=>{}:openSelect(groupIndex, itemIndex, 'org')" readOnly></m-org-input>
                        <a-input :readOnly="readonly"
                                 v-model="item.compareValue" :title="item.compareValue"
                                 v-else>
                          <a-icon type="edit" slot="suffix" style="color: #aaa;"/>
                        </a-input>
                      </template>
                    </a-form-model-item>
                  </a-col>
                  <!--<a-col :span="1">
                    <span class="bracket" v-if="itemIndex === (group.length - 1)">)</span>
                  </a-col>-->
                  <!--增减操作-->
                  <a-col :span="3" class="t-c" style="line-height: 40px;height: 40px;font-size: 20px;color: #aaa;"
                         v-if="!readonly">
                    <a-icon type="plus-circle" class="m-r-10" @click="addItem(groupIndex,itemIndex)"></a-icon>
                    <a-icon type="minus-circle" @click="decItem(groupIndex,itemIndex)" v-if="!item.required"></a-icon>
                  </a-col>
                </a-row>
              </a-form-model>
            </template>
          </div>
        </template>

      </div>
      <field-select ref="fieldSelectRef" :uniqueVal="uniqueVal"></field-select>
      <m-modal v-if="selectComp"
              :title="'请选择' + selectComp.name"
              :visible="selectCompVisible"
              @ok="handleSelectCompOk"
              @cancel="handleSelectCompClose">
        <component ref="selectComp" :selected="selected"
                   :is="selectComp.component" v-bind="selectComp.param"></component>
      </m-modal>

  <!--    <medical-dict-select ref="dictSelectRef" @ok="openSelected"></medical-dict-select>
      <medical-group-select ref="groupSelectRef" @ok="openSelected"
                            :kind="openSelectItem.groupKind"></medical-group-select>
      <medical-group-item-select ref="groupItemSelectRef" @ok="openSelected"
                                 :kind="openSelectItem.groupKind"></medical-group-item-select>
      <medical-org-select ref="orgSelectRef" @ok="openSelected"></medical-org-select>-->
    </a-spin>
  </div>
</template>

<script>

  import { getRuleColConfig, } from '@/api-sv3/api-flow'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MedicalDictSelect from "@/pages/selectMulti/MedicalDict"
  import MedicalGroupSelect from "@/pages/selectMulti/MedicalGroup"
  import MedicalGroupItemSelect from "@/pages/selectMulti/MedicalGroupItem"
  import MedicalOrgSelect from "@/pages/selectMulti/MedicalOrg"
  import JDate from '@/components/jeecg/JDate'
  import FieldSelect from '@/pages/probe/case/fieldSelect'
  import MDictInput from '@/pages/probe/case/rulePlugin/MDictInput'
  import MGroupInput from '@/pages/probe/case/rulePlugin/MGroupInput'
  import MGroupItemInput from '@/pages/probe/case/rulePlugin/MGroupItemInput'
  import MOrgInput from '@/pages/probe/case/rulePlugin/MOrgInput'

  export default {
    name: "caseRuleDetail",
    components: {
      MedicalDictSelect,
      MDictSelectTag,
      MedicalGroupSelect,
      MedicalGroupItemSelect,
      MedicalOrgSelect,
      JDate,
      FieldSelect,
      MDictInput,
      MGroupInput,
      MGroupItemInput,
      MOrgInput,
    },
    props: {
      readonly: Boolean,
      tableName: String,
      uniqueVal: String,
      isWhereCol: Boolean,
      dwsLimit: {
        type: Boolean,
        default:true
      }
    },
    data() {
      this.timeFieldRemoveTble = [
        'DWS_PATIENT_1VISIT_DRUGCLASSSUM',	//病人+单次就诊+药品分类
        'DWS_PATIENT_1VISIT_ITEMSUM',	//病人+单次就诊+诊疗项目
        'DWS_PATIENT_1VISIT_TREATCLASSSUM',	//病人+单次就诊+诊疗项目分类
        'DWS_MZAPART_DAYS',	//业务规则-相邻两次门急诊相隔天数
        'DWS_ZYAPART_DAYS',	//业务规则-相邻两次住院相隔天数
        'DWS_RXAPART_DAYS',	//业务规则-医生相邻两次处方相隔时间
        'DWS_CLINIC_INHOSPITAL',// dws_业务规则-住院期间门诊就诊
        'DWS_TESTDATE_LEAVEDATE', //dws_业务规则-同一次就诊化验执行日期晚于出院日期
        'DWS_CHECKDATE_LEAVEDATE', //dws_业务规则-同一次就诊检查执行日期晚于出院日期
        'DWS_INHOSPITAL_OVERLAP',//dws_业务规则-重叠住院
        'DWS_TAG_COMPARE_HIS_YB',
      ]
      this.selectCompObj = {
        'dict': {
          name: '字典项',
          component: 'MedicalDictSelect',
          param: {}
        },
        'group': {
          name: '',
          component: 'MedicalGroupSelect',
          param: {}
        },
        'groupItem': {
          name: '',
          component: 'MedicalGroupItemSelect',
          param: {}
        },
        'org': {
          name: '组织机构',
          component: 'MedicalOrgSelect',
          param: {}
        },
      }
      return {
        name: '',
        key: null,
        groups: [],
        defItem: {
          logic: 'AND',
          tableName: '',
          colName: '',
          compareType: '=',
          compareValue: '',
        },
        validateFields: {
          'colId': '请选择字段',
          'compareValue': '请完善比较值'
        },
        validatorRules: {
          required: [{
            validator: (rule, value, callback) => {
              if (this.isBlank(value)) {
                callback(new Error(this.validateFields[rule.field]));
              } else {
                callback();
              }
            }
          }],
        },
        ruleObj: {},
        colsObjDictSetAfter: [],
        tableNameObj: {},
        sysDict: {},
        confirmLoading: false,
        formItemLayout: {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        },
        openSelectIndex: [],
        mousedownX: 0,
        mousedownY: 0,
        selectComp: undefined,
        selectCompVisible: false,
        selected: []
      }
    },
    computed: {
      colDict() {
        return this.$store.getters.colDict
      }
    },
    watch: {
      groups(val) {
        this.$emit('groupChange', val)
      },
      colDict(val) {
        console.log('colDict.len', Object.keys(val).length)
        if (Object.keys(val).length > 0) {
          this.setColMap()
        }
      }
    },
    beforeMount() {
      if (Object.keys(this.colDict).length === 0) {
        this.confirmLoading = true
      }

      this.initDictConfig()
    },
    methods: {
      clickBefore({ x, y }) {
        this.mousedownX = x
        this.mousedownY = y
      },
      clickAfter({ x, y }, fun) {
        if (Math.abs(x - this.mousedownX) < 10 && Math.abs(y - this.mousedownY) < 10) {
          fun()
        }
      },
      nodeChange(val) {
        if (Object.keys(this.colDict).length === 0) {
          this.colsObjDictSetAfter.push(() => {
            this.nodeChange(val)
          })
          return
        }
        let dictTypes = []
        let itemDictSets = []
        let groups = this.ruleObj[val] || []
        console.log('groups', groups)
        for (let group of groups) {
          for (let item of group) {
            let col = this.colDict[item.colId]
            if (col && col.whereInputType + '' === '1' && !item.inputDict) {
              if (this.sysDict[col.whereInputType]) {
                item.inputDict = this.sysDict[col.whereInputType]
              } else {
                item.inputType = '1'
                item.selectType = col.selectType
                itemDictSets.push(item)
                dictTypes.push(col.selectType)
              }
            } else {
              item.dataType = col && col.dataType
              if (item.compareType.indexOf("in") > -1) {
                // item.inputType = '2'
              } else {
                Object.assign(item, this.getItemAttr(item.tableName, item.colName))
              }
            }
          }
        }
        if (dictTypes.length > 0) {
          this.confirmLoading = true
          this.$util.initDict(dictTypes).then(data => {
            Object.assign(this.sysDict, data)
            for (let item of itemDictSets) {
              item.inputDict = this.sysDict[item.selectType]
            }
            this.ruleObj[val] = this.groups = groups
          }).finally(() => {
            this.confirmLoading = false
          })
        } else {
          this.ruleObj[val] = this.groups = groups
        }
      },
      initDictConfig() {
        // console.log("--我才是真的方法!--")
        //初始化字典 - 状态
        this.$util.initDict('DATA').then(data => {
          for (let item of data) {
            this.tableNameObj[item.code] = item.value
          }
        })
      },
      setColMap() {
        this.confirmLoading = false
        for (let item of this.colsObjDictSetAfter) {
          item()
        }
        this.colsObjDictSetAfter = []
      },
      openFieldSelect(item, groupIndex, itemIndex) {
        // this.$refs.fieldSelectRef.show()
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          callback: col => {
            this.fieldSelectOK(col, groupIndex, itemIndex)
          },
          tableName: this.tableName,
          selectedObj: item.colId?item:undefined,
          isWhereCol: this.isWhereCol
        })
      },
      fieldSelectOK(col, groupIndex, itemIndex) {
        // this.$refs.fieldSelectRef.show(false)
        let { tabName, colName, colId, whereInputType, selectType } = col
        let item = { ...this.groups[groupIndex][itemIndex], ...{ tableName: tabName, colName, colId, validate: {} } }
        console.log('whereInputType',whereInputType)
        if (whereInputType + '' === '1') {
          this.getSysDicByType(selectType, (dict) => {
            Object.assign(item, {
              compareChartProp: undefined,
              inputType: whereInputType + '',
              inputDict: dict,
              compareType: '=',
              compareValue: dict[0].code,
            })
          })
        } else {
          Object.assign(item, {
            ...this.getItemAttr(tabName, colName),
            compareType: '=',
            compareValue: null,
            dataType: col.dataType
          })
        }
        // 虚拟字段过滤比较符
        if (col.colType + '' === '2' && !item.compareChartProp) {
          item.compareChartProp = { filter: this.colType2CompareFilter }
        }
        // console.log('item',item)
        this.$set(this.groups[groupIndex], itemIndex, item)
      },
      // 虚拟字段过滤比较符
      colType2CompareFilter(item) {
        return !(item.code.indexOf('in') >= 0 || item.code.indexOf('like') >= 0)
      },
      // 项目和项目组过滤比较符
      colType34CompareFilter(item) {
        return item.code === '=' || item.code === '<>' || item.code.indexOf('like') >= 0
      },
      getItemAttr(tableName, colName) {
        let obj = { inputType: undefined, compareChartProp: undefined }

        if(colName === 'DRUGGROUP_CODE' || colName === 'DRUGCODEGROUP'){ // STD_ || DWB_CHARGE
          obj.inputType = '4'
          obj.groupKind = '7'
        } else if(colName === 'DRUGGROUP_NAME'){
          obj.inputType = '4'
          obj.groupKind = '7'
          obj.valueEqName = true
        } else if(colName === 'DIAGGROUP_CODE' || colName === 'DISEASECODEGROUP'){
          obj.inputType = '4'
          obj.groupKind = '5'
        } else if(colName === 'DIAGGROUP_NAME'){
          obj.inputType = '4'
          obj.groupKind = '5'
          obj.valueEqName = true
        } else if(colName === 'TREATGROUP_CODE' || colName === 'TREATCODEGROUP'){
          obj.inputType = '4'
          obj.groupKind = '1'
        } else if(colName === 'TREATGROUP_NAME'){
          obj.inputType = '4'
          obj.groupKind = '1'
          obj.valueEqName = true
        } else if(colName === 'DRUGCODE'){
          obj.inputType = '3'
          obj.groupKind = '7'
        } else if(colName === 'TREATCODE'){
          obj.inputType = '3'
          obj.groupKind = '1'
        } else if(colName === 'DISEASECODE'){
          obj.inputType = '3'
          obj.groupKind = '5'
        } else if(colName === 'DISEASENAME'){
          obj.inputType = '3'
          obj.groupKind = '5'
          obj.valueEqName = true
        } else if (colName === 'ORGID') {
          obj.inputType = '5'
        } else if (colName === 'ORGNAME') {
          obj.inputType = '5'
          obj.valueEqName = true
        }

        if(obj.inputType === '4'){
          obj.compareChartProp = { filter: this.colType34CompareFilter }
        } else if (obj.inputType === '3'){
          obj.compareChartProp = { filter: this.colType34CompareFilter }
        } else if(obj.inputType === '5'){
          obj.compareChartProp = { filter: this.colType34CompareFilter }
        }

        return obj
      },
      getFieldName(colId) {
        let col = this.colDict[colId]
        return col ? `${col.colChnName}(${col.colId})` : colId
      },
      getTipInfo(colId) {
        let col = this.colDict[colId]
        return col ? `字段名：${col.colName}\n字段中文名：${col.colChnName}\n所属表：${col.tabName}\n所属表中文名：${this.tableNameObj[col.tabName]}` : colId
      },
      openSelect(groupIndex, itemIndex, type) {
        this.openSelectIndex = [groupIndex, itemIndex]
        let selectComp = this.selectComp = this.selectCompObj[type]
        if(type.startsWith('group')){
          let item = this.groups[groupIndex][itemIndex]
          selectComp.param = {kind: item.groupKind}
        } else {
          selectComp.param = {}
        }
        this.selectCompVisible = true
      },
      handleSelectCompOk(){
        let selected = this.$refs.selectComp.getSelect()
        let [groupIndex, itemIndex] = this.openSelectIndex
        let selectItem = this.groups[groupIndex][itemIndex]
        if(selected.length > 0){
          let {code, name} = selected[0]
          this.$set(selectItem, 'compareValue', code);
          this.$set(selectItem, 'compareName', name);
        }
        for(let i = 1; i < selected.length; i++){
          let {code, name} = selected[i]
          let item = this.addItem(groupIndex, itemIndex + i - 1, false)
          Object.assign(item, selectItem)
          item.logic = 'OR'
          item.compareValue = code
          item.compareName = name
        }
        this.selected = []
        this.handleSelectCompClose()
      },
      handleSelectCompClose(){
        this.selectCompVisible = false
      },
      getSysDicByType(type, callback) {
        if (this.sysDict[type]) {
          callback(this.sysDict[type])
          return
        }
        console.log('获取字典', type)
        this.confirmLoading = true
        this.$util.initDict(type).then(data => {
          this.sysDict[type] = data
          callback(data)
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      // 验证字段
      isBlank(val) {
        if (val === undefined || val === null || val.toString().trim() === '') {
          return true
        }
      },
      // 验证组
      validateData(key) {
        let forms = this.$refs.formRef
        if (!forms) {
          forms = []
        } else if (!Array.isArray(forms)) {
          forms = [forms]
        }
        forms.forEach(form => form.validate(valid => valid))

        let hasNoError = true
        let hasTimeField = false
        let itemCount = forms.length
        /*forms.forEach(form =>{
          if (form.model.colName === 'DURATIONTYPE') {
            hasTimeField = true
          }
          form.fields.forEach(field => {
            if(field.validateState === 'error'){
              hasNoError = false
            }
          })
        })
        console.log('forms',forms)*/

        let groups = this.ruleObj[key] || []
        console.log('groups', groups)
        for (let group of groups) {
          for (let item of group) {
            if (item.colName === 'DURATIONTYPE') {
              hasTimeField = true
            }
            for (let field in this.validateFields) {
              if (this.isBlank(item[field])) {
                hasNoError = false
              }
            }
          }
        }
        console.warn('this.tableName', this.tableName)
        if (this.dwsLimit && this.tableName.startsWith("DWS") && this.timeFieldRemoveTble.indexOf(this.tableName) === -1) {
          if (!hasTimeField) {
            this.$message.warn('DWS表必选时间类型字段')
            hasNoError = false
          } else if (itemCount < 2) {
            this.$message.warn('DWS表必需填写一项除了时间之外的字段规则')
            hasNoError = false
          }
        } else if (itemCount < 1) {
          this.$message.warn('必需填写一项字段规则')
          hasNoError = false
        }
        console.log('验证：' + hasNoError)
        return hasNoError
      },
      addGroup(open = true) {
        let item = { ...this.defItem }
        this.groups.push([item])
        if (open) {
          this.openFieldSelect(item, this.groups.length - 1, 0)
        }
        console.log('this.groups.item', item)
      },
      addItem(groupIndex, itemIndex, open = true) {
        let lastItem = this.groups[groupIndex][itemIndex]
        let item = { ...this.defItem, logic: lastItem.logic }
        this.groups[groupIndex].splice(itemIndex + 1, 0, item);
        if (open) {
          this.openFieldSelect(item, groupIndex, itemIndex + 1)
        }
        return item
      },
      decItem(groupIndex, itemIndex) {
        this.groups[groupIndex].splice(itemIndex, 1)
        if (this.groups[groupIndex].length === 0) {
          this.groups.splice(groupIndex, 1)
        }

      },
      clearRule() {
        this.groups.splice(0, this.groups.length)
      },
      getGroup(key) {
        return this.ruleObj[key] || []
      },
// 返回给后台的数据
      getRules(keys) {
        let array = []
        keys = Array.from(keys, key => key.toString())
        for (let key in this.ruleObj) {
          if (keys) {
            if (keys.indexOf(key.toString()) < 0) {
              continue
            }
          }
          let groups = this.ruleObj[key]
          if (groups.length === 0)
            continue
          for (let [groupIndex, group] of groups.entries()) {
            for (let [itemIndex, item] of group.entries()) {
              let { logic, tableName, colName, compareType, compareValue } = item
              let obj = { logic, tableName, colName, compareType, compareValue }
              obj.groupNo = groupIndex
              obj.nodeCode = key
              obj.orderNo = itemIndex
              array.push(obj)
            }
          }
        }

        return array
      },
      // 试算获取字段信息
      getCols(rules = [], tableName) {
        const res = new Map();
        const isDWS = tableName ? false : this.tableName !== 'DWB'
        const filterTable = isDWS ? this.tableName : 'DWB_MASTER_INFO'
        let result = []
        let colIds = this.$ls.get('displayCol' + (tableName || this.tableName))
        // 默认配置的显示字段
        if (!colIds || colIds.length === 0) {
          colIds = []
          for (let colId in this.colDict) {
            let col = this.colDict[colId]
            if (col.tabName === filterTable) {
              // console.log('col.isDisplayCol',col.isDisplayCol)
            }
            if (col.tabName === filterTable && col.isDisplayCol + '' === '1') {
              colIds.push(colId)
            }
          }
        }

        // 规则字段
        let ruleColIds = isDWS ? rules.map(rule => `${rule.tableName}:${rule.colName}`) : []
        colIds.push(...ruleColIds)
        for (let colId of colIds) {
          let col = this.colDict[colId]
          if (col && !res.has(col.colName)) {
            res.set(col.colName, 1)
            result.push({
              dataIndex: col.colName,
              title: col.colChnName,
              orderBy: col.colOrder // 排序
            })
          }
        }
        console.log('getCols', result)
        return result
      },
      removeRules(keys = []) {
        keys.forEach(key => {
          this.deleteGroups(key)
        })
      },
      getRuleObj(data) {
        console.log('ruleData', data)
        let ruleObj = {}
        // 通过节点ID归类
        data.forEach(item => {
          if (!ruleObj[item.nodeCode]) {
            ruleObj[item.nodeCode] = []
          }
          item.colType = "ALL"
          item.colId = `${item.tableName}:${item.colName}`
          ruleObj[item.nodeCode].push(item)
        })
        for (let key in ruleObj) {
          // 根据分组顺序和组内顺序排序
          ruleObj[key].sort((item1, item2) => {
            if (item1.groupNo > item2.groupNo || item1.orderNo > item2.orderNo) {
              return 1
            } else return -1
          })
          let tempArray = []
          let array = []
          let groupNo = ''
          // 合并分组
          ruleObj[key].forEach(item => {
            if (groupNo === item.groupNo) {
              tempArray.push(item)
            } else {
              array.push(tempArray = [item])
              groupNo = item.groupNo
            }
          })
          ruleObj[key] = array
        }
        console.log('ruleObj', ruleObj)
        return ruleObj
      },
      // 设置字段
      setRules(data) {
        this.groups = []
        this.ruleObj = this.getRuleObj(data)
      },
      addRules(data) {
        this.ruleObj = Object.assign(this.ruleObj, this.getRuleObj(data))
      },
      deleteGroups(key) {
        console.log(key, this.ruleObj)
        delete this.ruleObj[key]
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.indexOf(input) >= 0
      },
      getAllGroup() {
        console.log('ruleObj', this.ruleObj)
        console.log('groups', this.groups)
        return this.groups
      },
    },
  }
</script>
<style scoped>
  .bracket {
    font-size: 20px;
    line-height: 30px;
    font-weight: bold;
  }

  /*

    .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
      margin-bottom: 0;
    }

    .ant-form > .ant-row {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  */
  .form-item {
    width: 100%;
    margin: 0;
  }

  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
  }

  .title-item {
    padding: 5px 5px;
  }
</style>
