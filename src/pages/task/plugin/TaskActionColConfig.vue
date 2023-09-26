<template>
    <a-spin :spinning="confirmLoading" ref="rootDom">
        <a-button type="primary" class="fr" style="margin-top: -55px"  @click="openSelect">选择</a-button>
        <a-affix :offset-top="0" :target="modalBody">
            <a-row class="title list-item" :gutter="8">
                <a-col :span="6">字段名称</a-col>
                <a-col :span="8">表名称(来源)</a-col>
                <a-col :span="6">字段英文名称(来源)</a-col>
                <!--<a-col :span="3" class="t-c">适用平台</a-col>-->
                <a-col :span="4" class="t-c">操作</a-col>
            </a-row>
        </a-affix>

        <draggable :options="{animation: 300}" v-model="selectedData" handle=".move-item">
            <a-row v-for="(item,index) in selectedData" :key="item.colId" :gutter="8" class="list-item"
                   :class="{'disabled': item.status === 'stop'}">
                <a-col :span="6">
                    <template v-if="item.edit">
                        <a-input v-model="item.editName">
                                <span slot="suffix">
                                    <a-icon type="reload" style="margin-right: 3px;font-size: 10px"
                                            @click="delEditName(index)" v-if="item.editName"/>
                                    <a-icon :type="item.edit?'check':'edit'"
                                            @click="toEditName(index, item.edit)"/>
                                </span>
                        </a-input>
                    </template>
                    <span v-else>
                            {{item.editName || item.colCnname}}
                            <span class="fr">
                            <a-icon type="reload" style="margin-right: 3px;font-size: 10px"
                                    @click="delEditName(index)" v-if="item.editName"/>
                            <a-icon :type="item.edit?'check':'edit'"
                                    @click="toEditName(index, item.edit)"/>
                        </span>
                        </span>
                </a-col>
                <a-col :span="8" style="font-family: monospace">{{item.tableName}}</a-col>
                <a-col :span="6" style="font-family: monospace">{{item.colName}}</a-col>
                <!--<a-col :span="3" class="t-c">{{paltFormDict[item.platform]}}</a-col>-->
                <a-col :span="4" class="t-c">
                    <a style="cursor: pointer" @click="rmSelected(index)" title="移除"><a-icon type="minus-circle" /></a>
                    <a-divider type="vertical"/>
                    <a style="cursor: pointer" class="move-item" title="拖动"><a-icon type="ordered-list"/></a>
                </a-col>
            </a-row>
        </draggable>
        <task-action-field-col-select-modal
                ref="selectModal" :selected="selectedData" @ok="data => selectedData = data.map(r => ({...r}))"></task-action-field-col-select-modal>

    </a-spin>
</template>

<script>
  import TaskActionFieldColSelectModal from '@/pages/task/modules/TaskActionFieldColSelectModal'
  import draggable from 'vuedraggable'

  import { getAction } from '@/api/manage'

  export default {
    name: 'TaskActionColConfig',
    components: {TaskActionFieldColSelectModal, draggable},
    props: ['type', 'tables'],
    data() {
      this.allFieldDataMap = {}
      return {
        confirmLoading: false,
        url: {
          listAllCol: '/task/taskActionFieldCol/listAll',
          queryColByConfigId: '/task/taskActionFieldCol/queryByConfigId'
        },
        selectedData: [],
        // 就诊ID、疾病诊断名称、不合规行为类型、不合规行为、名称、就诊时间、出院时间、冲突项目、最大涉案金额、最小涉案金额、不合规行为释义
        defaultSelected: [],
        selectField: [],
        allFieldData: [],
        paltFormDict: {}
      }
    },

    watch: {
      type: {
        immediate: true,
        handler(val) {
          if(val !== 'DWB'){
            return
          }
          this.allFieldData = this.allFieldDataMap[val]
          this.selectedData = this.defaultSelected.map(r => ({ ...r }))

        }
      },
      tables: {
        immediate: false,
        handler(val) {
          if(!val){
            return
          }
          console.log('tables', val)
          this.allFieldData = this.filterTables(val, this.type)
          this.selectedData = this.defaultSelected.map(r => ({...r}))
        }
      },
      selectedData(val){
        this.$emit('change', val)
      }
    },
    methods: {
      filterTables(tables, type){
        console.log('filterTables', tables, type)
        return this.allFieldDataMap[type].filter(r => {
          let table = r.tableName
          return !table.startsWith('DWS') && !table.startsWith('APP') || tables.indexOf(table) > -1
        })
      },
      // 加载配置数据
      loadData(configId){
        this.confirmLoading = true
        getAction(this.url.queryColByConfigId, { configId }).then(res => {
          if (res.success) {
            let data = res.result
            let colIdMap = this.allFieldData.reduce((prev, cur) => {
              prev[cur.colId] = cur
              return prev
            }, {})

            this.selectedData = data.map(r => {
              let obj = colIdMap[r.colId]
              if(obj){
                obj = {...obj}
                r.colCnname && (obj.editName = r.colCnname)
              }
              return obj
            }).filter(r => !!r)
          } else {
            this.$message.warning(res.message);
          }
        }).catch(e => {
          this.$message.error(e.message);
        }).finally(() => {
          this.confirmLoading = false
        })

      },

      // 编辑名称
      toEditName(index, edit){
        let item = this.selectedData[index]
        if(edit){
          this.$set(item, 'edit', false)
          // item.edit = false
        } else {
          this.$set(item, 'edit', true)
          if(!item.editName){
            this.$set(item, 'editName', item.colCnname)
          }
        }
      },
      // 重置回不编辑名称
      delEditName(index){
        let item = this.selectedData[index]
        this.$set(item, 'editName', undefined)
        this.$set(item, 'edit', false)
      },
      openSelect(){
        console.log('openSelect', this.allFieldData)
        this.$refs.selectModal.openSelect(this.allFieldData)
      },
      // 删除记录
      rmSelected(index) {
        this.selectedData.splice(index, 1)
      },
      // 加载必要的数据
      async initData() {
        let res = await getAction(this.url.listAllCol, {})
        if (res.success) {
          let data = res.result
          let defSelectedCols = []
          let dwsCols = []
          let commonCols = []
          data.forEach(r => {
            if (r.defSelect === '1') {
              defSelectedCols.push(r)
            } else if (r.dwsCol === '1') {
              dwsCols.push(r)
            } else {
              commonCols.push(r)
            }
          })
          this.allFieldDataMap = {
            'DWB': [...defSelectedCols, ...commonCols],
            'DWS': [...defSelectedCols, ...commonCols, ...dwsCols]
          }
          this.defaultSelected = defSelectedCols
        } else {
          this.$message.warning(res.message);
          return
        }

       /* let data = await this.$util.initDict('ACTION_FIELD_PALTFORM')
        this.paltFormDict = data.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})*/
      },
      getData() {
        return this.selectedData
      },
      // 固钉需要的相对父节点
      modalBody() {
        if(this.scrollDom){
          return this.scrollDom
        }
        let dom = this.$refs.rootDom.$el
        while(!dom.classList.contains('ant-drawer-wrapper-body')){
          dom = dom.parentElement
        }
        this.scrollDom = dom
        return dom
      },

    },
    computed: {}
  }
</script>
<style lang="less" scoped>
    .tag-style {
        margin-bottom: 5px;
        font-size: 14px;
        line-height: 26px;
    }

    .fieldset-box {
        min-height: 100px;
    }

    .title {
        line-height: 30px;
        background: #fafafa;
        border-top: 1px solid #e8e8e8;
        /*border-bottom: 1px solid #e8e8e8;*/

        /* div {
             padding: 0 5px;
         }*/
    }

    .list-item {
        &.ant-row {
            border-left: 1px solid #e8e8e8;
            border-bottom: 1px solid #e8e8e8;
            & > .ant-col {

                padding: 8px 8px!important;
                border-right: 1px solid #e8e8e8;
            }
        }
        &.disabled{
            background-color: #ddd;
        }
        /*border-bottom: 1px solid #e8e8e8;*/
    }
</style>

