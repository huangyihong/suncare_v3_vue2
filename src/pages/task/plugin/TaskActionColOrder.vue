<template>
    <a-spin :spinning="confirmLoading" ref="rootDom">
        <a-affix :offset-top="0">
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
                <!--<a-col :span="5">
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
                </a-col>-->
                <a-col :span="6">{{item.colCnname}}</a-col>
                <a-col :span="8" style="font-family: monospace">{{item.tableName}}</a-col>
                <a-col :span="6" style="font-family: monospace">{{item.colName}}</a-col>
                <!--<a-col :span="3" class="t-c">{{paltFormDict[item.platform]}}</a-col>-->
                <a-col :span="4" class="t-c">
                    <a style="cursor: pointer" @click="$refs.modalForm.edit(item.colId)" title="编辑">
                        <a-icon type="edit"/>
                    </a>
                    <a-divider type="vertical"/>
                    <a style="cursor: pointer" @click="rmSelected(index)" title="移除">
                        <a-icon type="minus-circle"/>
                    </a>
                    <a-divider type="vertical"/>
                    <a style="cursor: pointer" class="move-item" title="拖动">
                        <a-icon type="ordered-list"/>
                    </a>
                </a-col>
            </a-row>
        </draggable>
        <task-action-field-col-modal ref="modalForm" @ok="modalFormOk"></task-action-field-col-modal>
        <m-modal
                centered
                title="选择字段"
                :visible="selectVisible"
                @ok="handleSelectOk"
                @cancel="handleSelectClose"
                cancelText="关闭">
            <!--<task-action-field-col ref="selectRef" :selected="selectData" :param="{toSearch: '1'}"></task-action-field-col>-->
            <task-action-field-col ref="selectRef" :selected="selectedData"></task-action-field-col>
        </m-modal>
    </a-spin>
</template>

<script>
  import TaskActionFieldColModal from '@/pages/task/modules/TaskActionFieldColModal'
  import TaskActionFieldCol from '@/pages/selectMulti/TaskActionFieldCol'
  import draggable from 'vuedraggable'

  import { getAction, putAction } from '@/api/manage'

  export default {
    name: 'TaskActionColConfig',
    components: { draggable, TaskActionFieldColModal, TaskActionFieldCol },
    props: ['type'],
    data() {
      this.allFieldDataMap = {}
      return {
        confirmLoading: false,
        selectVisible: false,
        url: {
          list: '/task/taskActionFieldCol/listAll',
          save: '/task/taskActionFieldCol/updateOrder'
        },
        selectedData: [],
        deletedData: [],
        oldSelectData: [],
        paltFormDict: {}
      }
    },
    beforeMount() {
    /*  this.$util.initDict('ACTION_FIELD_PALTFORM').then(data => {
        this.paltFormDict = data.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
      })*/

    },
    watch: {
      confirmLoading(val) {
        this.$emit('loading', val)
      }
    },
    methods: {
      // 加载配置数据
      loadData() {
        this.confirmLoading = true
        this.orderCol = {
          'defSelect': 'orderNo',
          'defSearch': 'serOrderNo'
        }[this.type]

        getAction(this.url.list, { [this.type]: '1', column: this.orderCol, order: 'asc' }).then(res => {
          if (res.success) {
            let data = this.selectedData = res.result
            this.deletedData = []
            this.oldSelectData = [...data]
          } else {
            this.$message.warning(res.message);
          }
        }).catch(e => {
          this.$message.error(e.message);
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      save() {
        let selectedData = this.selectedData.map((r, index) => ({ colId: r.colId, [this.type]: '1', [this.orderCol]: index + 1 }))
        let deletedData = this.deletedData.map((r, index) => ({ colId: r.colId, [this.type]: '0' }))
          .filter(r => this.oldSelectData.some(r2 => r2.colId === r.colId))

        let list = [...deletedData, ...selectedData]
        this.confirmLoading = true
        // putAction(this.url.save, { colIds, type: this.type }).then(res => {
        putAction(this.url.save, list).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.deletedData = []
            this.oldSelectData = [...selectedData]
          } else {
            this.$message.warning(res.message);
          }
        }).catch(e => {
          this.$message.error(e.message);
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      // 删除记录
      rmSelected(index) {
        this.deletedData.push(...this.selectedData.splice(index, 1))
      },
      modalFormOk() {
        this.loadData()
      },
      handleSelectOk() {
        let selectData = this.$refs.selectRef.getSelect()
        let deleteData = this.selectedData.filter(r => !selectData.some(r2 => r2.colId === r.colId))
        this.deletedData.push(...deleteData)
        this.selectedData.length = 0
        this.selectedData.push(...selectData)
        this.handleSelectClose();
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      openSelect() {
        this.selectVisible = true
      },
      // 编辑名称
      toEditName(index, edit) {
        let item = this.selectedData[index]
        if (edit) {
          this.$set(item, 'edit', false)
          // item.edit = false
        } else {
          this.$set(item, 'edit', true)
          if (!item.editName) {
            this.$set(item, 'editName', item.colCnname)
          }
        }
      },
      // 重置回不编辑名称
      delEditName(index) {
        let item = this.selectedData[index]
        this.$set(item, 'editName', undefined)
        this.$set(item, 'edit', false)
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

                padding: 8px 8px !important;
                border-right: 1px solid #e8e8e8;
            }
        }

        &.disabled {
            background-color: #ddd;
        }

        /*border-bottom: 1px solid #e8e8e8;*/
    }
</style>

