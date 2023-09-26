<template>
  <m-modal centered
           title="任务分配"
           ref="modal"
           :destroyOnClose="false"
           @cancel="onCancel"
           :visible="assignVisible"
           width="1000px"
           :footer="null">
    <a-list
      class="demo-loadmore-list"
      item-layout="horizontal"
      :data-source="data"
      :loading="confirmLoading.length > 0"
      bordered>
      <template slot="header" slot-scope="currentPageData">
        任务分配情况 <span class="fr">当前批次系统审核有 <a>{{totalData.caseCount}}</a> 个模型，生成数据 <a>{{totalData.recordNum}}</a> 条，
        已完成审核模型 <a>{{totalData.caseCountAudited}}</a> 个 ，总数据 <a>{{totalData.recordNumAudited}}</a> 条</span>
      </template>
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a slot="actions" @click="$refs.modalForm.edit(item)">编辑</a>
        <a-popconfirm slot="actions" title="确定删除吗?" @confirm="handleDelete(item.assignId)">
          <a >删除</a>
        </a-popconfirm>
        <a-list-item-meta>
          <div slot="description">
            <span>任务名称：<a>{{item.assignName}}</a></span>
            <span class="m-l-30">模型数量：<a>{{item.ruleCount}}</a></span>
            <span class="m-l-30">已审核：<a>{{item.ruleCountAudited}}</a></span>
          </div>
          <a slot="title">{{ item.memberName }}</a>
          <a-avatar slot="avatar" :src="getAvatarView(item.avatar)"/>
        </a-list-item-meta>
        <div>
          <span v-if="item.ruleCount === item.ruleCountAudited" style="color: green">已完成</span>
          <span v-else>未完成</span>

        </div>
      </a-list-item>

      <div slot="footer" slot-scope="currentPageData">
        <a-button type="dashed" style="width: 50%" @click="$refs.modalForm.add()">
          <a-icon type="plus"/>
          新 增 分 配
        </a-button>
      </div>
    </a-list>

    <!-- <a-table
       ref="table"
       size="middle"
       bordered
       rowKey="id"
       :columns="columns"
       :dataSource="dataSource"
       :pagination="ipagination"
       :loading="loading"
       :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
       v-bind="tableAttrs"
       :showHeader="false"
       @change="handleTableChange">
       <template slot="title" slot-scope="currentPageData">
         任务分配情况 <a class="fr">当前批次系统审核有  100  个模型，生成数据  23204  条，已完成审核模型  32 个  ，总数据  2008  条</a>
       </template>
       <template slot="footer" slot-scope="currentPageData">
         <div>
           <a-button type="dashed" style="width: 50%">
             <a-icon type="plus" /> 新 增 分 配
           </a-button>
         </div>

       </template>

       <span slot="action" slot-scope="text, record">
         <a @click="handleEdit(record)">编辑</a>

         <a-divider type="vertical"/>
         <a-dropdown>
           <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
           <a-menu slot="overlay">
             <a-menu-item>
               <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                 <a>删除</a>
               </a-popconfirm>
             </a-menu-item>
           </a-menu>
         </a-dropdown>
       </span>

     </a-table>-->

    <!-- table区域-end -->

    <!-- 表单区域 -->
    <taskReviewAssign-modal ref="modalForm" :batchId="batchId" :ruleType="ruleType" :step="step"
                            @ok="modalFormOk"></taskReviewAssign-modal>

  </m-modal>
</template>

<script>
  import TaskReviewAssignModal from './modules/TaskReviewSystemAssignModal'
  import { getAction, deleteAction } from '@/api/manage'

  export default {
    name: "TaskReviewAssignList",
    components: {
      TaskReviewAssignModal
    },
    data() {
      this.url = {
        list: "/task/taskReviewAssign/listBySelf",
        delete: "/task/taskReviewAssign/delete",
        total: "/task/taskReviewAssign/queryRuleResult",
        imgerver: this.$config['domianURL'] + "/sys/common/view",
      }
      return {
        confirmLoading: [],
        assignVisible: false,
        data: [],
        totalData: {},
        batchId: '',
        ruleType: '',
        step: 1,
        parentPageLoad: false,
      }
    },
    methods: {
      show(batchId, ruleType, step) {
        this.batchId = batchId
        this.ruleType = ruleType
        this.step = step
        this.assignVisible = true
        this.loadTotalData()
        this.loadListData()
      },
      loadTotalData() {
        this.confirmLoading.push(true)
        let {batchId,ruleType,step} = this
        getAction(this.url.total, {batchId,ruleType,step}).then(res => {
          if (res.success) {
            let [obj1, obj2] = res.result
            this.totalData = {
              caseCount: obj1.caseCount || 0,
              recordNum: obj1.caseCount || 0,
              caseCountAudited: obj2.caseCount || 0,
              recordNumAudited: obj2.recordNum || 0
            }
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading.pop()
        })
      },
      loadListData() {
        this.confirmLoading.push(true)
        let {batchId,ruleType,step} = this
        getAction(this.url.list, {batchId,ruleType,step}).then(res => {
          if (res.success) {
            this.data = res.result
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading.pop()
        })
      },
      handleDelete(id){
        this.confirmLoading.push(true)
        deleteAction(this.url.delete, {id}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadListData();
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading.pop()
        })
      },
      modalFormOk(){
        this.parentPageLoad = true
        this.loadListData()
      },
      getAvatarView: function (avatar) {
        return this.url.imgerver + "/" + avatar;
      },
      onCancel(){
        this.assignVisible = false
        if( this.parentPageLoad){
          this.$emit("reload", true)
        }
      }
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
