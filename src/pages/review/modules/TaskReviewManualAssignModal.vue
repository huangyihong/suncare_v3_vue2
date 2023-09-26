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
          label="任务执行人">
          <a-input-search
            placeholder="点击右侧按钮选择任务执行人"
            v-decorator="['memberName', validatorRules.required]"
            readOnly
            @search="()=> $refs.userSelectRef.show()">
            <a-button slot="enterButton" type="primary" icon="search">选择</a-button>
          </a-input-search>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务名称">
          <a-input placeholder="请输入任务名称" v-decorator="['assignName', validatorRules.required]"
                   :disabled="memberExist"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="剩余时间">
          <a-input-number :min="1" :max="999" :step="1" :disabled="memberExist"
                          v-decorator="['leftTime', {initialValue: 1,...validatorRules.requiredOnly}]"/>
          天
        </a-form-item>
        <a-form-item
          label="病例分配"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-row :gutter="24">
            <a-col :md="12" :xs="24">
              <a-select v-model="assignType">
                <a-select-option value="ALL">当前条件全部(未分配)</a-select-option>
                <a-select-option value="SELECT">当前列表已选择</a-select-option>
                <a-select-option value="FREEDOM">自定义起始范围(未分配)</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="12" :xs="24" v-if="assignType === 'FREEDOM'">
              <a-input-number :min="1" :max="999999999" :step="1"
                              v-decorator="['rangeStart', {initialValue: 1,...validatorRules.requiredOnly}]"/>
              -
              <a-input-number :min="2" :max="999999999" :step="1"
                              v-decorator="['rangeEnd', {initialValue: 2,...validatorRules.requiredOnly}]"/>
            </a-col>
          </a-row>

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
  import UserList from "@/pages/selectSingle/UserList"

  export default {
    name: "TaskReviewAssignModal",
    components: { UserList },
    props: {
      batchId: {
        type: String,
        required: true
      },
      ruleType: {
        type: String,
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          add: "/task/taskReviewAssign/addManual",
          edit: "/task/taskReviewAssign/editManual",
          getOne: "/task/taskReviewAssign/queryByUserID",
        },
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        assignType: 'ALL',
        listParams: {},
        listSelectKeys: [],
        memberExist: false
      }
    },
    computed: {
    },
    methods: {
      add() {
        this.edit({});
      },
      assignData(record) {
        this.memberExist = !!record.assignId
        this.model = Object.assign(this.model, record);
        this.form.setFieldsValue(pick(this.model, 'assignId', 'assignName', 'memberName', 'status'))
        //时间格式化
        this.form.setFieldsValue({ leftTime: this.model.endTime ? moment(this.model.endTime).diff(moment(), 'day') : null })

      },
      show(listParams, selectKeys) {
        this.listParams = listParams;
        this.listSelectKeys = selectKeys;
        this.visible = true;
      /*  this.$nextTick(() => {
          this.assignData({
            member: 'e9ca23d68d884d4ebb19d07889727dae',
            memberName: 'admin',
            endTime: '2020-05-24 23:59:59',
            assignName: '23132'
          })
        })*/

      },

      userSelected(obj) {
        if (obj.id !== this.model.member) {
          this.model = { member: obj.id }
          this.form.resetFields();
          this.form.setFieldsValue({ memberName: obj.name })
          this.loadData(this.model.member, this.batchId)
        }

      },
      loadData(member, batchId) {
        this.confirmLoading = true;
        getAction(this.url.getOne, { member, batchId, step: 2 }).then(res => {
          if (res.success) {
            let data = res.result || {};
            this.assignData(data)
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false;
        })
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

            let httpurl = '';
            let method = '';
            // if (!this.model.assignId) {
              httpurl += this.url.add;
              method = 'post';
           /* } else {
              httpurl += this.url.edit;
              method = 'put';
            }*/
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.endTime = moment().add(values.leftTime, 'days').format("YYYY-MM-DD HH:mm:ss")
            formData.batchId = this.batchId
            formData.step = 2

            if (this.assignType === 'SELECT') {
              if (this.listSelectKeys.length === 0) {
                this.$message.warn("请至少勾选一条记录")
                return
              }
              formData.selectKeys = this.listSelectKeys
              delete formData.params
              delete formData.rangeStart
              delete formData.rangeEnd
            } else {
              if (this.assignType === 'ALL') {
                delete formData.rangeStart
                delete formData.rangeEnd
              }
              formData.params = this.listParams
            }

            that.confirmLoading = true;
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
                that.loadData(that.model.member, that.batchId)
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
