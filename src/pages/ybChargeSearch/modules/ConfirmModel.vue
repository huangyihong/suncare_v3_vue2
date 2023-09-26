<template>
  <div>
    <a-modal :visible="visible" title="审核确认" @ok="ack" @cancel="close">
      <a-radio-group name="radioGroup" v-model="examineStatus">
        <a-radio value="1">审核通过</a-radio>
        <a-radio value="2">审核不通过</a-radio>
        <a-radio value="3">停用</a-radio>
      </a-radio-group>
      <br>
      <br>
      <span v-if="examineStatus=='1'">
        即将审核通过<span style="color: red">{{ num }}</span>条数据
      </span>
      <span v-else-if="examineStatus=='2'">
        即将审核不通过<span style="color: red">{{ num }}</span>条数据
      </span>
      <span v-else>
        即将停用<span style="color: red">{{ num }}</span>条数据
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
      examineStatus:'1',

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