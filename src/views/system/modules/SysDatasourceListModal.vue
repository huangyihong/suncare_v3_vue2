<template>
  <m-modal
    centered
    title="项目地配置"
    :width="1200"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :isMax="true"
    cancelText="关闭">
    <sys-datasource-list></sys-datasource-list>
  </m-modal>
</template>

<script>
import sysDatasourceList from '../SysDatasourceList.vue'
export default {
  name: 'SysDatasourceListModal',
  components: {
    sysDatasourceList
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