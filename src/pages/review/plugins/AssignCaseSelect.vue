<template>

  <a-spin :spinning="confirmLoading">
    <a-button type="primary" @click="openSelect" icon="search">选择</a-button>
    <a-row class="title">
      <a-col :span="8">模型名称</a-col>
      <a-col :span="8">业务组名称</a-col>
      <!--<a-col :span="4">状态</a-col>-->
      <a-col :span="4">操作</a-col>
    </a-row>
    <a-row v-for="(item,index) in selectData" :key="item.key" :gutter="8" class="list-item">
      <a-col :span="8">{{item.caseName}}</a-col>
      <a-col :span="8">{{item.busiName}}</a-col>
      <!--<a-col :span="4">{{item.status}}</a-col>-->
      <a-col :span="4">
        <a @click="rowDel(index)" v-if="item.status !== 'autited'">移除</a>
      </a-col>
    </a-row>


    <m-modal centered
             title="选择模型"
             :width="'80%'"
             :visible="selectVisible"
             @ok="handleSelectOk"
             @cancel="handleSelectClose"
             destroyOnClose
             cancelText="关闭">
      <task-batch-break-rule-del-list ref="selectRef" :selected="selectData" :batchId="batchId"
                     :reviewUserid="userId" :ruleType="ruleType"></task-batch-break-rule-del-list>
    </m-modal>

  </a-spin>
</template>

<script>
  import { getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import TaskBatchBreakRuleDelList from '@/pages/selectMulti/TaskBatchBreakRuleDelList'

  export default {
    name: 'AssignCaseSelect',
    components: { TaskBatchBreakRuleDelList },
    props: {
      batchId: {
        type: String,
        required: true
      },
      ruleType: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      /*readonly: {
        type:Boolean,
        default: false
      }*/
    },
    data() {
      this.url = {
        listRule: "/task/taskReviewAssign/listRuleByUserId",
      }
      return {
        selectVisible: false,
        confirmLoading: false,
        selectData: [],
      }
    },
    methods: {
      loadRules() {
        this.selectData = []
        if(!this.userId){
          return
        }
        this.confirmLoading = true
        let params = { batchId: this.batchId, ruleType: this.ruleType, userId: this.userId }
        getAction(this.url.listRule, params).then(res => {
          if (res.success) {
            this.selectData = res.result
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      openSelect() {
        this.selectVisible = true
      },
      handleSelectOk() {
        this.selectData = this.$refs.selectRef.getSelect()
        this.handleSelectClose();
      },
      clear(){
        this.selectData.length = 0
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      rowDel(index) {
        this.selectData.splice(index, 1);
      },
    }
  }
</script>

<style lang="less" scoped>
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    div {
      padding: 0 5px;
    }
  }

  .list-item {
    padding: 10px 0;
    line-height: 20px;
    border-bottom: 1px solid #e8e8e8;
  }
</style>