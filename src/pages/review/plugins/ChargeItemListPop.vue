<template>
  <a-popover trigger="click" v-model="visible">
    <div slot="content">
      <a-table :columns="columns" :dataSource="data" :pagination="false" :loading="loading"
               :scroll="{y: '50px',x:true }" size="middle" bordered>
      </a-table>
    </div>
    <slot></slot>
  </a-popover>
</template>

<script>
  import { getAction,postAction} from '@/api-sv3/manage'

  export default {
    name: 'ChargeItemList',
    components: {},
    props: {
      data: Array
    },
    data() {
      return {
        visible: false,
        loading: false,
        loadDataSuc: false,
        columns: [
          {
            title: '标化亚信药品名称',
            dataIndex: 'value',
            width: 180
          },
          {
            title: '标化亚信药品名称',
            dataIndex: 'groupName',
            width: 180
          },
          {
            title: '就诊明细记录数',
            dataIndex: 'visitCount',
            width: 120
          },
        ]
      };
    },
    beforeMount() {

    },
    watch:{
      visible(val){
        if(val && !this.loadDataSuc){
          console.log('data',this.data)
          /*   let itemCodes = this.data.map(item => item.code)
             this.queryItemVisitCount(itemCodes.join(","))*/
        }
      },
    },
    methods: {
      queryItemVisitCount(itemCodes) {
        this.loading = true
        getAction(this.$suncare_v3 + "/review/queryVisitCountByChargeItemCodes",{itemCodes}).then(res => {
          if (res.success) {
            let data = res.result
            this.loadDataSuc = true
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
