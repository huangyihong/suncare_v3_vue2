<template>
    <div class="background-white">
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
                        <a-form-item label="模板编码" v-if="nodeVCode">
                            <a-input :value="nodeVCode" readOnly></a-input>
                        </a-form-item>
                        <a-form-item label="所属表" v-else>
                            <!--<m-dict-select-tag ref="tableDictRef" placeholder="选择所属表" dictCode="DATA" :loaded="tableDwsLoaded"
                                               showKey search required v-model="tableName" @change="tableSelectChange"></m-dict-select-tag>
                            -->
                            <table-select-tag v-model="tableName" @change="tableSelectChange" :readonly="readonly"
                                              placeholder="选择所属表" required :loaded="tableDwsLoaded"
                                              :filter="tableFilter"></table-select-tag>
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
              <a-button type="primary" @click="()=> $emit('action')" v-if="actionBtnType">{{actionBtnType==='add'?'保存':'更新'}}流程</a-button>
              <a-button icon="bar-chart" v-if="nodeCategory === 'rectangle' && groups.length > 0" @click="test"
                        class="m-l-6" :title="tableName !== '' && tableName!=='DWB'? '仅试算当前节点':undefined">试算</a-button>
                        <!--<a-button @click="clearRule" v-show="!readonly && groups.length > 0" style="margin-left: 8px">清除</a-button>-->
            </span>
                </a-row>
                <!--<a-row :gutter="24" class="m-t-6" v-show="tableType === 'DWS'">
                  <a-col :span="12">
                    <a-form-item label="DWS表">
                      <m-dict-select-tag placeholder="选择所属表" dictCode="DATA" :filter="tableDwsFilter"
                                         showKey search v-model="tableName"></m-dict-select-tag>
                    </a-form-item>
                  </a-col>
                </a-row>-->
            </a-form>
        </div>
        <rule-detail ref="ruleRef" :tableName="tableName" :uniqueVal="uniqueVal" isWhereCol :readonly="readonly || nodeVCode"
                     @groupChange="val => groups = val"></rule-detail>
        <a-row :gutter="12" style="margin: 0;padding:0 20px 10px 20px" v-if="!readonly">
            <a-col :span="24" class="t-r" >
                <!--<a-button @click="$emit('cancelToVirtual')" v-if="nodeVCode">取消链接</a-button>-->
                <!--<a-button class="m-l-10" type="primary" @click="$emit('linkToVirtual')">{{nodeVCode?'重新':''}}链接到模板</a-button>-->
                <a-button class="m-l-10" @click="addGroup" v-if="!nodeVCode">增加组</a-button>
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
      nodeVCode: String,
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
      }
    },
    data() {
      return {
        tableType: 'DWB',
        tableName: '',
        name: '',
        groups: [],
        validateName: {
          status: '',
          help: ''
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
          if (this.nodeType.indexOf('_dws') > -1) {
            let groups = this.$refs.ruleRef.getGroup(val)
            if (groups.length > 0 && groups[0].length > 0) {
              for (let group of groups) {
                for (let item of group) {
                  if (item.tableName.startsWith("DWS")) {
                    tableName = item.tableName
                    break
                  }
                }
                if (tableName) {
                  break
                }
              }
            }
          } else {
            tableName = 'DWB'
          }
          this.$refs.ruleRef.nodeChange(val)
        } else {
          tableName = 'DWB'
        }

        if (this.tableName !== tableName) {
          this.$emit('tableNameChange', this.tableName = tableName)
        }
      }

    },
    beforeMount() {
      this.$util.initDict('DATA2').then(data => {
        let filterTables = data.map(r => r.code)
        this.tableFilter = r => filterTables.indexOf(r.code) === -1
      })
    },
    mounted() {
      let ruleFunNames = [
        'addGroup',
        'clearRule',
        'deleteGroups',
        'setRules',
        'getRules',
        'addRules',
        'removeRules',
        'getCols',
        'showSelect',
        'nodeChange']
      const that = this
      ruleFunNames.forEach(item => {
        that[item] = function(...arg) {
          console.log(item, arg)
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
        if (this.validateData(this.nodeKey)) {
          this.$emit('test', this.nodeKey)
        }
      },
      tableDwsLoaded(dicts) {
        let data = dicts.filter(item => item.code.startsWith("DWS"))
        data.unshift({ value: 'DWB表', code: 'DWB' })
        return data
      },
      tableSelectChange(val) {
        if (val !== 'DWB' && this.nodeType.indexOf('_dws') === -1 && this.nodeKey) {
          this.$emit('typeChange', this.nodeType + "_dws")
        }

        this.$refs.ruleRef.clearRule()

      },
      restoreTable(){
        this.tableName = 'DWB'
      },
      validateNameFun(val) {
        if (val && val.trim().length > 0) {
          this.validateName = {}
          return true
        } else {
          this.validateName = {
            status: 'error',
            help: '名称是必填项'
          }
          return false
        }
      },
      validateData(...arg) {
        return this.validateNameFun(this.name) && this.$refs.ruleRef.validateData(...arg)
      },
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
