<template>
    <a-spin :spinning="confirmLoading" ref="rootDom">
        <div class="fr" style="margin-top: -55px">
            <a-button type="primary" @click="addDefCol">添加默认条件</a-button>
            <a-button type="primary" class="m-l-6" @click="clear">清空</a-button>
            <a-button type="primary" class="m-l-6" @click="openSelect">选择</a-button>
        </div>
        <a-affix :offset-top="0" :target="modalBody">
            <a-row class="title list-item" :gutter="8">
                <a-col :span="6">字段名称</a-col>
                <a-col :span="8">表名称(来源)</a-col>
                <a-col :span="6">字段英文名称(来源)</a-col>
                <!--<a-col :span="3" class="t-c">适用平台</a-col>-->
                <a-col :span="4" class="t-c">操作</a-col>
            </a-row>
        </a-affix>
        <template v-if="selectData.length === 0">
            <div class="p-t-50 p-b-50 t-c list-item">使用默认查询条件</div>
        </template>

        <draggable :options="{animation: 300}" v-model="selectData" handle=".move-item">
            <a-row v-for="(item,index) in selectData" :key="item.colId" :gutter="8" class="list-item"
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
                <!--<a-col :span="3" class="t-c">{{paltFormDict[item.platform] || item.platform}}</a-col>-->
                <a-col :span="4" class="t-c">
                    <a style="cursor: pointer" @click="rmSelected(index)" title="移除"><a-icon type="minus-circle" /></a>
                    <a-divider type="vertical"/>
                    <a style="cursor: pointer" class="move-item" title="拖动"><a-icon type="ordered-list"/></a>
                </a-col>
            </a-row>
        </draggable>


        <m-modal
                centered
                title="选择字段"
                :visible="selectVisible"
                @ok="handleSelectOk"
                @cancel="handleSelectClose"
                cancelText="关闭">
            <!--<task-action-field-col ref="selectRef" :selected="selectData" :param="{toSearch: '1'}"></task-action-field-col>-->
            <task-action-field-col ref="selectRef" :selected="selectData"></task-action-field-col>
        </m-modal>
    </a-spin>
</template>

<script>
  import { getAction } from '@/api/manage'

  import TaskActionFieldCol from '@/pages/selectMulti/TaskActionFieldCol'
  import draggable from 'vuedraggable'

  export default {
    name: 'TaskActionColSearch',
    components: {TaskActionFieldCol, draggable},
    props: ['configId'],
    data() {
      return {
        confirmLoading: false,
        selectVisible: false,
        selectData: [],
        defSelectData: undefined,
        url: {
          getDefSerCol: '/task/taskActionFieldCol/getDefSerCol',
          querySerColByConfigId: '/task/taskActionFieldCol/querySerByConfigId'
        },
        paltFormDict: {}
      }
    },
    beforeMount(){
      /*this.$util.initDict('ACTION_FIELD_PALTFORM').then(data => {
        this.paltFormDict = data.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
      })*/

    },
    watch: {
      configId: {
        immediate: true,
        handler(val) {
          console.log('configId', val)
          if (val) {
            this.loadData(val)
          } else {
            this.clear()
          }
        },
      },
      selectData(val){
        this.$emit('change', val)
      },
    },
    methods: {
      addDefCol(){
        let func = () => {
          this.selectData = [...this.selectData.filter(r => !this.defSelectData.some(r1 => r1.colId === r.colId)),
            ...this.defSelectData.map(r => ({...r}))]
        }
        if(!this.defSelectData){
          this.loadDefData(func)
        } else {
          func()
        }
      },
      // 加载配置数据
      loadData(configId){
        /*if(!configId){
          if(!this.defSelectData){
            this.loadDefData()
          } else {
            this.selectData = this.defSelectData.map(r => ({...r}))
          }
          return
        }*/
        this.confirmLoading = true
        getAction(this.url.querySerColByConfigId, { configId }).then(res => {
          if (res.success) {
            let data = res.result
            this.selectData = data
          } else {
            this.$message.warning(res.message);
          }
        }).catch(e => {
          this.$message.error(e.message);
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      loadDefData(callback){
        this.confirmLoading = true
        getAction(this.url.getDefSerCol, { }).then(res => {
          if (res.success) {
            let data = res.result
            this.defSelectData = data
            if(callback){
              callback()
            }
          } else {
            this.$message.warning(res.message);
          }
        }).catch(e => {
          this.$message.error(e.message);
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      clear(){
        this.selectData = []
      },
      // 编辑名称
      toEditName(index, edit){
        let item = this.selectData[index]
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
        let item = this.selectData[index]
        this.$set(item, 'editName', undefined)
        this.$set(item, 'edit', false)
      },
      // 删除记录
      rmSelected(index) {
        this.selectData.splice(index, 1)
      },
      getData(){
        return this.selectData
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
      openSelect() {
        this.selectVisible = true
      },
      handleSelectOk() {
        this.selectData.length = 0
        this.selectData.push(...this.$refs.selectRef.getSelect())
        this.handleSelectClose();
      },
      handleSelectClose() {
        this.selectVisible = false
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
