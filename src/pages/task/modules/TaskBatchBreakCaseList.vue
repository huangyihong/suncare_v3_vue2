<template>
  <a-popover trigger="click" placement="bottom" v-model="visible">
    <div slot="title" style="font-size: 16px;line-height: 32px">
      模型列表
    </div>
    <div slot="content" style="max-height: 300px;overflow: auto">
      <a-spin :spinning="confirmLoading">
        <template v-if="data">
          <a-empty v-if="data.length === 0"></a-empty>
          <template v-for="item in data">
            <a :title="item.caseName" class="line" @click="detail(item.caseId)">
              <!--{{item.caseName.length > 20?item.caseName.substring(0,8) + '...' :item.caseName}}</a>-->
            {{item.caseName}}
            </a>
          </template>
        </template>
      </a-spin>
    </div>
    <slot></slot>
    <case-detail-modal ref="caseModal" :batchId="batchId" :notHis="notHis"></case-detail-modal>
  </a-popover>

</template>

<script>
  import { querySimpleHisCaseByBusiId, querySimpleCaseByBusiId } from '@/api-sv3/api'
  import CaseDetailModal from '@/pages/probe/caseDetailModal'

  export default {
    name: 'TaskBatchBreakCaseList',
    components: {
      CaseDetailModal
    },
    props: {
      busiId: {
        type: String,
        required: true
      },
      batchId: String,
      notHis: Boolean
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        data: undefined,
      }
    },
    watch: {
      visible: {
        handler(val) {
          if (val === true && !this.data) {
            this.queryData()
          }
        },
      }
    },
    methods: {
      queryData() {
        this.confirmLoading = true
        let queryApi = !this.batchId || this.notHis ? querySimpleCaseByBusiId : querySimpleHisCaseByBusiId
        queryApi({ busiId: this.busiId, batchId: this.batchId }).then(res => {
          if (res.success) {
            this.data = res.result
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      detail(id) {
        this.visible = false
        this.$refs.caseModal.detail(id)
      },
    },
    computed: {}
  }
</script>
<style lang="less" scoped>
  .line {
    display: block;
    line-height: 32px;
    /*font-size: 16px;*/
    cursor: pointer;
    max-width: 30TaskBatchBreakRuleDelList0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
