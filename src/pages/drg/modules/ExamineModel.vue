<template>
  <div>
    <a-modal :visible="visible" title="审核确认" @ok="ack" @cancel="close">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="操作" class="m-b-10">
          <a-radio-group v-model="examineStatus" class="w-b-100">
            <a-radio value="1">审核通过</a-radio>
            <a-radio value="2">审核不通过</a-radio>
            <a-radio value="3">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数据范围" class="m-b-10">
          <a-radio-group v-model="assignType"  class="w-b-100">
            <a-radio value="SELECT">
              已选择的数据
            </a-radio>
            <a-radio value="ALL">
              当前查询条件下的全部数据
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="assignType=='SELECT'">
          <span v-if="examineStatus=='1'">
            即将审核通过<span style="color: red">{{ num }}</span>条数据
          </span>
            <span v-else-if="examineStatus=='2'">
            即将审核不通过<span style="color: red">{{ num }}</span>条数据
          </span>
            <span v-else>
            即将停用<span style="color: red">{{ num }}</span>条数据
          </span>
        </template>

      </a-form>

    </a-modal>
  </div>
</template>

<script>
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
export default {
  name: "ExamineModel",
  props: ['num'],
  components: {
    MDictSelectTag,
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      form: this.$form.createForm(this),
      examineStatus:'1',
      assignType:'SELECT',

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
      if (this.assignType === 'SELECT'&&this.num==0) {
        this.$message.warn("请至少勾选一条记录")
        return
      }
      this.$emit('ok',this.examineStatus,this.assignType)
      this.visible = false
    },

  }
}
</script>

<style scoped>

</style>