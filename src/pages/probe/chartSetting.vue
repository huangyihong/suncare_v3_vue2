<template>
  <m-modal centered
    title="流程图设置"
    v-model="modalVisible"
    @ok="save"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="鼠标滚轮缩放">
        <a-switch v-model="settingData.mouseWheelBehavior"/>
      </a-form-item>
      <a-form-item label="节点间连线直线">
        <a-switch v-model="settingData.lineToNode"/>
      </a-form-item>
      <a-form-item label="网格背景">
        <a-switch v-model="settingData.grid"/>
      </a-form-item>
    </a-form>
  </m-modal>
</template>

<script>

  export default {
    name: 'chartSetting',
    components: {},
    props: {
      setting: {
        type: Object,
        default: {
          mouseWheelBehavior: false,
          lineToNode: false
        }
      }
    },
    data() {
      return {
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        modalVisible: false,
        settingData: {},

      }
    },
    beforeMount() {
    },
    methods: {
      show() {
        this.settingData = { ...this.setting }
        this.modalVisible = true
      },
      save() {
      //  let haveDiff = false
     //   let settingObj = {}
        for (let field in this.settingData) {
          let value = this.settingData[field]
          /*if (value !== this.setting[field]) {
            settingObj[field] = value
            haveDiff = true
          }*/
          this.setting[field] = value
        }
      //  if (haveDiff) {
          this.$ls.set('flowChartSetting', this.settingData)
          this.$emit('updateSetting', {...this.settingData, primaryColor: this.primaryColor})
      //  }
        this.modalVisible = false

      }
    },
    watch:{
      primaryColor(val){
        this.$emit('updateSetting', {...this.setting, primaryColor: val})
      }
    },
    computed: {
      primaryColor(){
        return this.$store.getters.color
      }
    }
  }
</script>
<style scoped>

</style>
