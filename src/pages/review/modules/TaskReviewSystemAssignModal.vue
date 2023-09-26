<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务名称">
          <a-input placeholder="请输入任务名称" v-decorator="['assignName', validatorRules.required]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务执行人">
          <a-input-search
            placeholder="点击右侧按钮选择任务执行人"
            v-decorator="['memberName', validatorRules.required]"
            readOnly
            @search="()=> $refs.userSelectRef.show()" v-if="!model.assignId">
            <a-button slot="enterButton" type="primary" icon="search">选择</a-button>
          </a-input-search>
          <a-input v-decorator="['memberName', validatorRules.required]" readOnly v-else>
          </a-input>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="剩余时间">
          <a-input-number :min="1" :max="999" :step="1"
                          v-decorator="['leftTime', {initialValue: 1,...validatorRules.requiredOnly}]"/>
          天
        </a-form-item>
        <a-form-item
          label="模型分配"
          :labelCol="labelCol"
          :wrapperCol="wrapperColWhole">

          <assign-case-select ref="modalSelectRef" :batchId="batchId" :ruleType="ruleType"
                              :userId="model.member"
                              :readOnly="readonly"></assign-case-select>

        </a-form-item>
      </a-form>
    </a-spin>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
    <user-list ref="userSelectRef" @ok="userSelected"></user-list>
  </a-drawer>
</template>

<script>
  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import AssignCaseSelect from "@/pages/review/plugins/AssignCaseSelect"
  import UserList from "@/pages/selectSingle/UserList"

  export default {
    name: "TaskReviewAssignModal",
    components: { UserList, AssignCaseSelect },
    props: {
      batchId: {
        type: String,
        required: true
      },
      ruleType: {
        type: String,
        required: true
      },
      step: {
        type: Number,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          // span: 24
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          // span: 24
          xs: { span: 24 },
          sm: { span: 16 },
        },
        wrapperColWhole: {
          // span: 24
          xs: { span: 24 },
          sm: { span: 20 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          add: "/task/taskReviewAssign/add",
          edit: "/task/taskReviewAssign/edit",
        },
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
      }
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        console.log('edit', record)
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'assignId', 'assignName', 'memberName', 'status'))
          //时间格式化
          this.form.setFieldsValue({ leftTime: this.model.endTime ? moment(this.model.endTime).diff(moment(), 'day') : null })
          this.$refs.modalSelectRef.loadRules()

        });

      },

      userSelected(obj) {
        console.log(obj.id,this.model.member)
        if(obj.id !== this.model.member){
          this.form.setFieldsValue({ memberName: obj.name })
          this.model.member = obj.id
          this.$refs.modalSelectRef.clear()
        }

      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.assignId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.endTime = moment().add(values.leftTime, 'days').format("YYYY-MM-DD HH:mm:ss")

            formData.batchId = this.batchId
            formData.step = this.step
            formData.caseIds = this.$refs.modalSelectRef.selectData.map(item => item.code);

            console.log(formData)

            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>
</style>
