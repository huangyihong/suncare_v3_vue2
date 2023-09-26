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
        任务分配情况 <span class="fr">当前批次人工审核，生成数据 <a>{{totalData.total}}</a> 条，
                            已完成审核数据 <a>{{totalData.audited}}</a> 条，
                    </span>
      </template>
      <a-list-item slot="renderItem" slot-scope="item, index">
        <!--<a slot="actions" @click="$refs.modalForm.edit(item)">编辑</a>-->
        <a-popconfirm slot="actions" title="确定删除吗?" @confirm="handleDelete(item.assignId)">
          <a >删除</a>
        </a-popconfirm>
        <a-list-item-meta>
          <div slot="description">任务名称：<a>{{item.assignName}}</a>
            <span class="m-l-30">病例数量：<a>{{userTotal[item.member]}}</a></span>
            <span class="m-l-30">已审核：<a>{{userAuditedTotal[item.member]}}</a></span>
          </div>
          <a slot="title">{{ item.memberName }}</a>
          <a-avatar slot="avatar" :src="getAvatarView(item.avatar)"/>
        </a-list-item-meta>
        <div>
          <span v-if="userTotal[item.member] === userAuditedTotal[item.member]" style="color: green">已完成</span>
          <span v-else>未完成</span>

        </div>
      </a-list-item>

     <!-- <div slot="footer" slot-scope="currentPageData">
        <a-button type="dashed" style="width: 50%" @click="$refs.modalForm.add()">
          <a-icon type="plus"/>
          新 增 分 配
        </a-button>
      </div>-->
    </a-list>

    <!-- 表单区域 -->
    <!--<taskReviewAssign-modal ref="modalForm" :batchId="batchId" :ruleType="ruleType"
                            @ok="modalFormOk"></taskReviewAssign-modal>-->

  </m-modal>
</template>

<script>
  // import TaskReviewAssignModal from './modules/TaskReviewSystemAssignModal'
  import { getAction, deleteAction } from '@/api/manage'

  export default {
    name: "TaskReviewAssignList",
    components: {
      // TaskReviewAssignModal
    },
    data() {
      this.url = {
        list: "/task/taskReviewAssign/listBySelf",
        delete: "/task/taskReviewAssign/deleteManual",
        total: "/task/taskReviewAssign/queryManualResult",
        imgerver: this.$config['domianURL'] + "/sys/common/view",
      }
      return {
        confirmLoading: [],
        assignVisible: false,
        data: [],
        totalData: {},
        userTotal: {},
        userAuditedTotal: {},
        batchId: '',
        ruleType: '',
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
        getAction(this.url.total, {batchId: this.batchId}).then(res => {
          if (res.success) {
            let {total, audited, userMap, userAuditedMap} = res.result
            this.totalData = {
              total,
              audited,
            }
            this.userTotal = userMap
            this.userAuditedTotal = userAuditedMap
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
            this.parentPageLoad = true
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading.pop()
        })
      },
    /*  modalFormOk(){
        this.parentPageLoad = true
        this.loadListData()
      },*/
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
