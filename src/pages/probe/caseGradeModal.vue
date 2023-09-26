<template>
  <m-modal centered
           title="模型评分"
           ref="detailModal"
           :destroyOnClose="false"
           @ok="handleOk"
           @cancel="hide"
           @max="$refs.caseDetail.refreshChart()"
           :visible="visible">
    <case-detail ref="caseDetail" :batchId="batchId" :notHis="false" :grade="true"
                 @max="isMax=>$refs.detailModal.max(isMax)"></case-detail>

  </m-modal>
</template>
<script>
  const CaseDetail = () => import('@/pages/probe/caseDetail')

  export default {
    name: 'caseDetailModal',
    components: {
      CaseDetail
    },
    props: {
      batchId: String,
    },
    data() {
      return {
        visible: false
      };
    },
    computed: {},
    methods: {
      detail(id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.caseDetail.loadData(id)
        })
      },
      hide() {
        this.visible = false
      },
      handleOk() {
        let grades = this.$refs.caseDetail.getGrade()
        if (grades) {
          this.$emit('grade', grades)
          this.hide()
        }
      }
    }
  }
</script>
<style scoped>
  .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
    margin-bottom: 0;
  }

  .ant-form-item {
    margin-bottom: 10px;
  }
</style>