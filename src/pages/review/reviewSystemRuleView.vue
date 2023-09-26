<template>
    <div>
        <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" :bordered="false" class="m-b-6">
            <breadcrumb :parent="{path:'/task/taskProjectList'}" style="margin-bottom: 4px">
                <!--<a-popconfirm placement="bottomRight" slot="right" v-if="onStep"
                              title="确定通过并进入下一步?" @confirm="() => passToNextStep(batchId)">
                  <a-button type="primary" @click="searchQuery" :loading="tabStatusLoading" :disabled="!canGoToNext"
                            v-has="'reviewSystem:leader'">
                    审核并通过
                  </a-button>
                </a-popconfirm>-->
            </breadcrumb>
            <a-row :gutter="8" style="font-size: 15px;">
                <a-col :xs="8">
                    <span style="font-weight: bold">项目名称</span>：{{project.projectName}}
                </a-col>
                <a-col :xs="8">
                    <span style="font-weight: bold">任务批次</span>：{{projectBatch.batchName}}
                </a-col>
                <a-col :xs="8">
                    <span style="font-weight: bold">风控月份</span>：{{projectBatch.month}}
                    <a style="float: right" @click="$refs.modalForm.edit(projectBatch)">批次详情</a>
                </a-col>
            </a-row>
        </a-card>
        <review-system-common-view :ruleType="$route.query.ruleType" :onStep="onStep"></review-system-common-view>
        <task-project-batch-modal ref="modalForm"></task-project-batch-modal>
    </div>
</template>

<script>
  import reviewSystemCommonView from '@/pages/review/reviewSystemCommonView'
  import Breadcrumb from '@/components/Breadcrumb'

  import { reviewMixin } from './mixin'

  export default {
    name: "reviewSystemRuleView",
    mixins: [reviewMixin],
    components: {
      Breadcrumb,
      reviewSystemCommonView
    },
    data() {
      const { caseId, batchId, ruleType } = this.$route.query
      return {
        step: 1
      }
    },

    methods: {
    }
  }
</script>
<style lang="less" scoped>

</style>
