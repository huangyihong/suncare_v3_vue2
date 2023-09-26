<template>
  <m-modal
    centered
    title="数据库连接"
    :width="1200"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :isMax="true"
    cancelText="关闭">
      <sys-database-list @reloadDb="reloadDb"></sys-database-list>
  </m-modal>
</template>

<script>
import SysDatabaseList from '../SysDatabaseList.vue'
export default {
  name: 'SysDatabaseListModal',
  components: {
    SysDatabaseList
  },
  data() {
    return {
      visible: false,
    }
  },
  beforeMount() {

  },
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    //刷新数据库下拉选择
    reloadDb(){
      this.$emit('reloadDb');
    }
  },
  computed: {}
}
</script>
<style lang="less" scoped>
</style>