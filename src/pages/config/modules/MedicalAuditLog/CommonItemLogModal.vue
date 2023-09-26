<template>
  <div>
    <detail-list size="small">
      <detail-list-item term="操作类型">{{logBean.actionType_dictText}}</detail-list-item>
      <detail-list-item term="操作人">{{logBean.actionStaffName}}</detail-list-item>
      <detail-list-item term="操作时间">{{logBean.actionTime}}</detail-list-item>
      <a-divider style="margin: 10px 0" />
    </detail-list>

    <detail-list size="small" :col="1">
      <detail-list-item term="操作原因">{{logBean.actionReason}}</detail-list-item>
      <a-divider style="margin: 10px 0" />
    </detail-list>


    <detail-list size="small" :col="1" v-show="logBean.actionType==='update'">
      <detail-list-item term="修改内容">
        <a-table
          :columns="updateColumns"
          :dataSource="logBean.actionContentJson"
          :pagination="false">
        </a-table>
      </detail-list-item>
      <a-divider style="margin: 10px 0" />
    </detail-list>
  </div>

</template>
<script>
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item;
  export default {
    components: {
      DetailList,
      DetailListItem
    },
    props: {
      logBean:{
        type:Object,
        required:true,
      },
    },
    data() {
      return {
        updateColumns: [
          {
            title: '信息字段',
            dataIndex: 'name',
            width: 200,
          },
          {
            title: '旧值',
            dataIndex: 'oldvalue',
            width: 200,
          },
          {
            title: '新值',
            dataIndex: 'newvalue'
          }
        ],
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
