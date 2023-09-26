<template>
  <div>
    <a-modal :visible="visible" title="审核确认" @ok="ack" @cancel="close">
      <a-radio-group name="radioGroup" v-model="examineStatus">
        <a-radio value="finish">审核通过</a-radio>
        <a-radio value="fail">审核不通过</a-radio>
      </a-radio-group>
      <br>
      <br>
      <span v-if="examineStatus=='finish'">
        即将审核通过<span style="color: red">{{ num }}</span>条数据
      </span>
      <span v-else-if="examineStatus=='fail'">
        即将审核不通过<span style="color: red">{{ num }}</span>条数据
      </span>

    </a-modal>
  </div>
</template>

<script>
export default {
  name: "ConfirmModel",
  props: ['num'],
  data() {
    return {
      visible: false,
      examineStatus:'finish',

    }
  },
  methods: {
    close() {
      this.visible = false
    },
    show() {
      this.visible = true
    },
    ack() {

      this.$emit('ok',this.examineStatus)
      this.visible = false
    },

  }
}
</script>

<style scoped>

</style>