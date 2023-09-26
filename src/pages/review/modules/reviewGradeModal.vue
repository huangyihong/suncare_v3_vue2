<template>
  <m-modal centered
           title="模型评分"
           ref="detailModal"
           :destroyOnClose="false"
           @ok="handleOk"
           @cancel="hide"
           @max="$refs.gradeRef.$refs.caseDetail.refreshChart()"
           :visible="visible">
    <review-grade ref="gradeRef" :batchId="batchId"
                  @max="isMax=>$refs.detailModal.max(isMax)"></review-grade>

  </m-modal>
</template>
<script>
  const reviewGrade = () => import('@/pages/review/modules/reviewGrade')

  export default {
    name: 'caseDetailModal',
    components: {
      reviewGrade
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
      detail() {
        this.visible = true
      },
      hide() {
        this.visible = false
      },
      handleOk() {
        let data = this.$refs.gradeRef.getData()
        if (data && data.grades) {
          this.$emit('ok', data)
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