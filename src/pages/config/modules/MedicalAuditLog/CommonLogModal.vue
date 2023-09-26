<template>
  <div>
    <common-item-log-modal :logBean="logBean"></common-item-log-modal>
    <detail-list size="small" :col="1">
      <detail-list-item term="审核结果">{{logBean.auditResult_dictText}}</detail-list-item>
      <a-divider style="margin: 10px 0" v-show="logBean.auditResult!=='0'"/>
    </detail-list>
    <detail-list size="small" :col="1" v-show="logBean.auditResult!=='0'">
      <detail-list-item term="审核意见">{{logBean.auditOpinion}}</detail-list-item>
      <a-divider style="margin: 10px 0" />
    </detail-list>
    <detail-list size="small" v-show="logBean.auditResult!=='0'">
      <detail-list-item term="审核人">{{logBean.auditStaffName}}</detail-list-item>
      <detail-list-item term="审核时间">{{logBean.auditTime}}</detail-list-item>
    </detail-list>
  </div>

</template>
<script>
  import CommonItemLogModal from './CommonItemLogModal'
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item;
  export default {
    components: {
      DetailList,
      DetailListItem,
      CommonItemLogModal,
    },
    props: {
      logBean:{
        type:Object,
        required:true,
      },
    },
    data() {
      return {
      }
    },
    beforeMount() {
    },
    methods: {

    }
  }
</script>
<style scoped>
</style>
