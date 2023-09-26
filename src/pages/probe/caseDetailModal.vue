<template>
  <m-modal centered
           ref="detailModal"
           :destroyOnClose="false"
           @cancel="hide"
           @max="$refs.caseDetail.refreshChart()"
           :visible="visible"
           :footer="null">
    <div slot="title">
      模型详情
      <a class="m-l-10" style="font-size: 14px" @click="toEdit">
        <a-icon type="edit"/>
        编辑
      </a>
    </div>
    <case-detail ref="caseDetail" :batchId="batchId" :notHis="notHis"
                 @max="isMax=>$refs.detailModal.max(isMax)"></case-detail>
  </m-modal>
</template>
<script>
  const CaseDetail  = ()=> import('@/pages/probe/caseDetail')

  export default {
    name: 'caseDetailModal',
    components: {
      CaseDetail
    },
    props: {
      batchId: String,
      notHis: Boolean
    },
    data() {
      return {
        visible: false,
        caseId: undefined,
        caseClassify: undefined
      };
    },
    computed: {},
    methods: {
      detail(id, caseClassify) {
        this.visible = true
        this.caseClassify = caseClassify
        this.$nextTick(() => {
          this.$refs.caseDetail.loadData(this.caseId = id)
        })
      },
      hide(){
        this.visible = false
      },
      toEdit(){
        if(this.caseClassify){
          this.$util.openTab('/probe/case/caseIndexClassify?caseId=' + this.caseId)
        } else {
          this.$util.openTab('/probe/sumupIndex?caseId=' + this.caseId)
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
