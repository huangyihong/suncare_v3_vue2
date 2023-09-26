<template>
  <a-modal
    v-model="visible"
    centered
    style="min-width: 0"
    width="250px"
    :bodyStyle="{padding: 0}"
    :closable="false"
    :maskClosable="false"
    :footer="null"
  >
    <a-result
      :status="status==='loading'?'error': status"
      :title="msg">
      <template #icon v-if="status==='loading'">
        <a-icon type="loading" />
      </template>

    </a-result>
  </a-modal>
</template>

<script>

  export default {
    name: 'LoadingModal',
    /*props:{
      status: {
        type: String,
        default: 'success'
      },
      msg: {
        type: String,
        default: '提示信息'
      }
    },*/
    components: {},
    data() {
      return {
        visible: false,
        status: 'success',
        msg: '提示信息',
      }
    },

    methods: {
      show(status, msg){
        this.status = status
        this.msg = msg
        this.visible = true
      },
      hide(){
        this.visible = false
      }

    },
    computed: {}
  }
</script>
<style scoped>

</style>
