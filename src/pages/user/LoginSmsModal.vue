<template>
    <m-modal title="短信验证码"
             :width="400"
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
                    <a-col :span="24">手机号：{{phone || '请联系管理员设置手机号'}}</a-col>
                    <a-col :span="20">
                        <a-input
                                v-decorator="['captcha',validatorRules.captcha]"
                                type="text"
                                placeholder="请输入短信验证码">
                            <!--<a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
                        </a-input>
                    </a-col>
                    <a-col :span="4">
                        <a-button type="primary" :loading="canSendLoading" :disabled="!canSendSms || !phone" @click="sendSms">
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
  import { ACCESS_TOKEN, DATA_SOURCE } from '@/store/mutation-types'

  export default {
    name: 'loginSms',
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
          loginSms: '/sys/loginSms',
          sendSms: '/sys/sendSms',
        },
        canSendLoading: false,
        canSendSms: true,
        canSendSeconds: 60,
        phone: undefined,
        token: undefined,
        tip: ''

      }
    },
    methods: {
      load({token, phone}, params){
        this.phone = phone
        this.token = token
        this.params = params
        this.visible = true
      },
      handleOk() {
        this.tip = undefined
        this.form.validateFields((err, values) => {
          if (!err) {
            let formData = Object.assign({}, values);
            formData.token = this.token
            console.log('formData',formData)
            this.loading = true
            postAction(this.url.loginSms, formData).then(res => {
              if(res.success){
                const result = res.result
                const userInfo = result.userInfo
                this.$ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                this.$ls.set(DATA_SOURCE, this.params.dataSource)
                this.$store.commit('SET_TOKEN', result.token)
                this.$store.dispatch('UpdateUser', userInfo)
                this.visible = false
                this.$emit('ok')
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
        postAction(this.url.sendSms, {token: this.token}).then(res => {
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
    computed: {}
  }
</script>
<style scoped>

</style>
