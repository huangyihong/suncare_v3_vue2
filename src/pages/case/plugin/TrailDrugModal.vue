<template>
  <m-modal centered
           title="选择ETL数据源"
           ref="modal"
           width="200"
           @cancel="hide"
           @ok="handleSelectOk"
           :visible="visible">
    <a-spin :spinning="confirmLoading">
      <div class="t-c">
        <m-dict-select-tag dictCode="ETL_SOURCE" type="radio" required
                           v-model="etlSource"
                           :loaded="data => {data.unshift({code: 'none',value: '不限'}); return data}"></m-dict-select-tag>
        <p class="m-t-20">提示：会覆盖已生成的数据</p>
      </div>
    </a-spin>
  </m-modal>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { getAction } from '@/api/manage'

  export default {
    name: 'TrailDrugModal',
    props: ['ruleType'],
    components: {
      MDictSelectTag
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        etlSource: undefined,
        ruleId: undefined
      }
    },
    methods: {
      show(ruleId) {
        console.log('show')
        this.ruleId = ruleId
        this.visible = true
      },
      hide() {
        this.visible = false
      },
      handleSelectOk() {
        let param = { ruleId: this.ruleId, ruleType: this.ruleType }
        if (this.etlSource !== 'none') {
          param.etlSource = this.etlSource
        }
        this.confirmLoading = true
        getAction(this.$suncare_v3 + '/medical/medicalDrugRule/trail', param).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.hide()
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
    },
    computed: {}
  }
</script>
<style scoped>

</style>
