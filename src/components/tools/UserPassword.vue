<template>
  <m-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :closable="closable">
    <template slot="footer">
      <a-button @click="handleCancel" v-if="closable">
        关闭
      </a-button>
      <a-button type="primary" @click="handleOk" style="margin-left: 15px">
        确定
      </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-alert :message="tip" banner v-if="tip" style="margin: 0 0 5px 0"/>
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="旧密码">
          <a-input type="password" placeholder="请输入旧密码" v-decorator="[ 'oldpassword', validatorRules.oldpassword]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新密码">
          <a-input type="password" placeholder="请输入新密码" v-decorator="[ 'password', validatorRules.password]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="确认新密码">
          <a-input type="password" @blur="handleConfirmBlur" placeholder="请确认新密码" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </m-modal>
</template>

<script>
  import moment from 'moment'
  moment.locale('zh-cn')
  import { putAction } from '@/api/manage'

  export default {
    name: "UserPassword",
    data () {
      return {
        title:"修改密码",
        modalWidth:800,
        visible: false,
        confirmLoading: false,
        validatorRules:{
          oldpassword:{
            rules: [{
              required: true, message: '请输入旧密码!',
            }],
          },
          password:{
            rules: [{
              required: true, message: '请输入新密码!',
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword:{
            rules: [{
              required: true, message: '请确认新密码!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          }
        },
        confirmDirty:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        form:this.$form.createForm(this),
        url: "sys/user/updatePassword",
        username:"",
        tip: undefined,
        closable: true
      }
    },
    beforeMount(){
      const userInfo = this.$store.getters.userInfo
      let { updatePwdTime, username } = userInfo
      if(updatePwdTime == null){
        // 跳转到首次修改密码
        this.tip = "出于安全原因，您初次登陆系统（或解冻）需对密码进行修改"
        this.show(username, false)
      } else {
        let startTime = new Date(updatePwdTime); // 开始时间
        let endTime = new Date(); // 结束时间
        let days = Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24) // 相差天数
        if(days >= 160){
          let msg = `帐号“${username}”的密码已使用 ${days} 天（密码有效期为 180天）,请尽快修改。如未在过期前修改，账号将被冻结`
          this.$confirm({
            centered: true,
            title: '密码即将过期',
            content: msg,
            okText: '修改密码',
            cancelText: '稍后修改',
            onOk: () => {
              this.show(username)
            },
            onCancel: () => {
            }
          });
        }
      }
    },
    methods: {
      show(uname, closable = true){
        if(!uname){
          this.$message.warning("当前系统无登陆用户!");
          return
        }else{
          this.closable = closable
          this.username = uname
          this.form.resetFields();
          this.visible = true;
        }
      },
      handleCancel () {
        this.close()
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleOk () {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            let params = Object.assign({username:this.username},values)
            console.log("修改密码提交数据",params)
            putAction(this.url,params).then((res)=>{
              if(res.success){
                console.log(res)
                this.$message.success(res.message);
                const userInfo = this.$store.getters.userInfo
                userInfo.updatePwdTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.$store.dispatch('UpdateUser', userInfo)
                this.close();
              }else{
                this.$message.warning(res.message);
              }
            }).finally(() => {
              this.confirmLoading = false;
            })
          }
        })
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一样！');
        } else {
          callback()
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      }

    }
  }
</script>

<style scoped>

</style>

