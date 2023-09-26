<template>
  <m-modal title="短信验证码"
           :width="440"
           :visible="visible"
           :maskClosable="false"
           @ok="handleOk"
           @cancel="handleClose">
    <template slot="footer">
      <a-button key="back" @click="handleClose">
        关闭
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        提交
      </a-button>
    </template>
    <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol" @keyup.enter.native="handleOk">
      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="24">手机号：{{userInfo.phone || '请在账户设置中设置手机号或联系管理员'}}</a-col>
          <a-col :span="20">
            <a-input
              v-decorator="['captcha',validatorRules.captcha]"
              type="text"
              placeholder="请输入短信验证码">
            </a-input>
          </a-col>
          <a-col :span="4">
            <a-button type="primary" :loading="canSendLoading" :disabled="!canSendSms || !userInfo.phone" @click="sendSms">
              {{canSendSms?'发送验证码': `(${canSendSeconds}) 已发送`}}
            </a-button>
          </a-col>

        </a-row>
      </a-form-item>
    </a-form>
    <p class="t-red fl" style="margin-top: -10px">{{tip}}</p>
  </m-modal>
</template>

<script>
import { postAction } from '@/api-sv3/manage'
import { mapGetters } from 'vuex'
import { CHECK_SMS_DONLOAD } from '@/store/mutation-types'

export default {
  name: 'sendSmsDownload',
  components: {},
  data() {
    return {
      loading: false,
      visible: false,
      form: this.$form.createForm(this),
      validatorRules:{
        captcha: { rules: [{ required: true, message: '请输入手机收到的验证码' }, { whitespace: true, message: '值不能是空格!' }]},
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      url: {
        checkSms: '/ybChargeSearch/ybChargeSearchTask/checkSms',
        sendSmsDonload: '/ybChargeSearch/ybChargeSearchTask/sendSmsDonload',
      },
      canSendLoading: false,
      canSendSms: true,
      canSendSeconds: 60,
      tip: '',
      record:'',

    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    load(record){
      this.visible = true
      this.record = record
    },
    handleOk() {
      this.tip = undefined
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign({}, values);
          formData.phone= this.userInfo.phone
          formData.captcha = formData.captcha.toLowerCase()
          this.loading = true
          postAction(this.url.checkSms, formData).then(res => {
            if(res.success){
              this.$ls.set(CHECK_SMS_DONLOAD, 1, 24 * 60 * 60 * 1000)

              this.visible = false
              this.$emit('ok',this.record)
            } else {
              this.tip = res.message
            }
          }).finally(() =>{
            this.loading = false
          })
        }
      });
    },
    handleClose() {
      this.visible = false
      this.$emit('close')
    },
    sendSms(e){
      e.preventDefault();
      this.tip = undefined
      this.canSendLoading = true
      postAction(this.url.sendSmsDonload, {phone:this.userInfo.phone}).then(res => {
        if(res.success){
          this.sendSmsCountDown(60)
        } else {
          this.tip = res.message
        }
      }).finally(() =>{
        this.canSendLoading = false
      })
    },
    sendSmsCountDown(seconds){
      this.canSendSms = false
      this.canSendSeconds = seconds;
      let interval = setInterval(() => {
        if (this.canSendSeconds-- <= 1) {
          this.canSendSms = true;
          clearInterval(interval);
        }
      }, 1000);
    }
  },
}
</script>
<style scoped>

</style>
