<template>
    <div class="background-white" >
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="24">
                    <!-- <a-col :span="5" v-if="keyPre">
                       <a-form-item label="节点编号">
                         <a-input readOnly :value="keyPre + nodeKey"></a-input>
                       </a-form-item>
                     </a-col>-->
                    <!--  <a-col :span="5">
                        <a-form-item label="节点类型">
                          <a-select v-model="tableType" :disabled="readonly" @change="tableTypeChange">
                            <a-select-option value="DWB">DWB</a-select-option>
                            <a-select-option value="DWS">DWS</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col> -->
                    <a-col :span="7">
                        <a-form-item label="所属表">
                            <!--<m-dict-select-tag ref="tableDictRef" placeholder="选择所属表" dictCode="DATA" :loaded="tableDwsLoaded"
                                               showKey search required v-model="tableName" @change="tableSelectChange"></m-dict-select-tag>
                            --><table-select-tag v-model="tableName" @change="tableSelectChange" :readonly="readonly"
                                     placeholder="选择所属表" required :filter="tableFilter"></table-select-tag>
                        </a-form-item>
                    </a-col>
                    <a-col :span="10">
                        <a-form-item label="节点名称"
                                     has-feedback
                                     :validate-status="validateName.status"
                                     :help="validateName.help">
                            <a-input v-bind="$attrs"
                                     v-model="name"
                                     @input="nameInput"
                                     :readOnly="readonly"
                            ></a-input>
                        </a-form-item>
                    </a-col>
                    <span style="overflow: hidden;">
              <a-button type="primary" @click="()=> $emit('action')" v-has="'probe:add'"
                        v-if="actionBtnType">{{actionBtnType==='add'?'保存':'更新'}}流程</a-button>
            <a-button icon="bar-chart" v-if="nodeCategory === 'rectangle' && groups.length > 0" @click="test"
                      class="m-l-6">试算</a-button>
                    </span>
                </a-row>

            </a-form>
        </div>
        <rule-detail ref="ruleRef" :tableName="tableName" :uniqueVal="uniqueVal" isWhereCol
                     :readonly="readonly" :dwsLimit="false"
                     @groupChange="val => groups = val" ></rule-detail>
        <a-row :gutter="12" style="margin: 0;padding:0 20px 10px 20px">
            <a-col :span="3" :offset="21" class="t-c">
                <a-button @click="addGroup" v-if="!readonly">增加组</a-button>
            </a-col>
        </a-row>
    </div>
</template>

<script>

  import { getRuleColConfig, } from '@/api-sv3/api-flow'
  import RuleDetail from '@/pages/probe/case/caseRuleDetail'
  import pick from 'lodash/pick'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import tableSelectTag from "@/pages/probe/case/tableSelectTag"

  export default {
    name: "fillParams",
    components: {
      RuleDetail,
      MDictSelectTag,
      tableSelectTag
    },
    props: {
      actionBtnType: String,
      value: String,
      nodeKey: String,
      nodeType: String,
      nodeCategory: {
        type: String,
        default: 'rectangle'
      },
      // keyPre: String,
      readonly: {
        type: String,
        default: false
      },
      uniqueVal: {
        type: Number,
        default: new Date().getTime()
      },
      tableNames: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        tableType: 'DWB',
        tableName: '',
        name: '',
        groups:[],
        validateName:{
          status: '',
          help:''
        },
        tableFilter: r => true
      }
    },
    watch: {
      value(val) {
        this.name = val
        this.validateNameFun(val)
      },
      nodeKey(val, oldVal) {
        console.log('nodeKey', val)
        let tableName
        if (val) {
          let groups =  this.$refs.ruleRef.getGroup(val)
          console.log('groups',groups)
          if(groups.length > 0 && groups[0].length > 0){
            tableName = groups[0][0].tableName
          } else {
            tableName = this.tableNames[0]
          }
          this.$refs.ruleRef.nodeChange(val)
        }
        if(this.tableName !== tableName){
          this.$emit('tableNameChange', this.tableName =  tableName)
        }
        console.log('tableName', this.tableName)
      },
      tableNames(val){
        if(val){
          this.tableFilter = r => val.indexOf(r.code) > -1
        }

      }
    },
    mounted(){
      let ruleFunNames = [
        'addGroup',
        'clearRule',
        'deleteGroups',
        'setRules',
        'getRules',
        'addRules',
        'removeRules',
        'getCols',
        'showSelect']
      const that = this
      ruleFunNames.forEach(item => {
        that[item] = function(...arg) {
          console.log(item,arg)
          return that.$refs.ruleRef[item](...arg)
        }
      })
    },
    methods: {
      nameInput(e) {
        this.name = e.target.value
        // this.validateName(this.name)
        this.$emit('input', this.name)
      },
      test() {
        if (this.validateData(this.nodeKey)){
          this.$emit('test', this.nodeKey)
        }
      },
      tableSelectChange(val){
        /*let type = this.nodeCategory === 'rectangle'?'rect':'diam'
        if(val !== 'DWB'){
          type = type + "_classify"
        }
        if(this.nodeKey){
          this.$emit('typeChange',type)
        }*/
        this.$refs.ruleRef.clearRule()

      },
      validateNameFun(val){
        if(val && val.trim().length > 0){
          this.validateName = {
          }
          return true
        } else {
          this.validateName = {
            status: 'error',
            help:'名称是必填项'
          }
          return false
        }
      },
      validateData(...arg){
        return this.validateNameFun(this.name) && this.$refs.ruleRef.validateData(...arg)
      }
    }
  }
</script>
<style scoped>

    .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
        margin-bottom: 0;
    }

    .ant-form > .ant-row {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

</style>
