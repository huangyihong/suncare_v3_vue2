<template>
  <!--loginContent begin-->
  <div class="wrapper1300 margin-center loginContentInsight">

    <!--login begin-->
    <div class="loginList-contentinsight" :style="loginStyle">
      <h5 class="m-b-30" style="direction: rtl ">
        <!--医保风控logo-->
<!--        <img src="~@/assets/image/login/logo.png" width="503"/> -->
        <div style='font-weight: 800;font-size: 45px'>线上医保基金核查系统</div>
      </h5>
      <div class="loginList">
        <ul class="p-t-30">
          <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
            <a-form-item>
              <a-input
                size="large"
                v-decorator="['username',validatorRules.username]"
                type="text"
                ref="username"
                placeholder="请输入用户名">
                <!--<a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-input
                v-decorator="['password',validatorRules.password]"
                size="large"
                type="password"
                ref="password"
                autocomplete="false"
                placeholder="请输入密码">
                <!--<a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
              </a-input>
            </a-form-item>
            <!--
            <a-form-item>
              <a-select v-decorator="['dataSource',{}]" class="loginList-select">
                <a-select-option v-for="(item, index) in dataSourceList" :key="item.code" :value="item.code" :title="item.name ">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            -->

            <a-form-item>
              <a-row :gutter="16">
                <a-col :span="16">
                  <a-input
                    v-decorator="['inputCode',validatorRules.inputCode]"
                    size="large"
                    type="text"
                    ref="code"
                    placeholder="请输入验证码">
                  </a-input>
                </a-col>
                <a-col :span="8" class="t-c" style="border: solid 1px #ddd;padding: 0;background: white">
                  <!--<j-graphic-code @success="generateCode" ref="jgraphicCodeRef" :contentHeight="50" :contentWidth="128"
                                  remote></j-graphic-code>-->
                  <div class="checkImg loading" :style="{backgroundImage: 'url(\'' + loadingGif + '\')'}" v-if="loadingCheckImg"></div>
                  <div class="checkImg" :style="{backgroundImage: 'url(\'' + checkImg + '\')'}" @click="loadCheckImg" v-else></div>
                  <!--<img width="128" height="50" :src="loadingGif" v-if="loadingCheckImg"/>-->
                  <!--<img width="128" height="50" :src="checkImg" @click="loadCheckImg" v-else/>-->

                </a-col>
              </a-row>
            </a-form-item>

            <a-button
              class="login-btn w-b-100"
              size="large"
              type="primary"
              htmlType="submit"
              :loading="loginBtn"
              @click.stop.prevent="handleSubmit"

            >登 录
            </a-button>
          </a-form>
        </ul>
      </div>

    </div>
    <!--loginContent end-->
  </div>


</template>

<script>
  //import md5 from "md5"
  import api from '@/api'
  // import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { mapActions } from 'vuex'
  import { timeFix } from '@/utils/util'
  import { ACCESS_TOKEN, ENCRYPTED_STRING, DATA_SOURCE } from '@/store/mutation-types'
  import JGraphicCode from '@/components/jeecg/JGraphicCode'
  import { putAction, postAction, getAction } from '@/api/manage'
  import { USER_INFO } from '@/store/mutation-types'
  import throttle from 'lodash/throttle'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
  import {rsaEncrypt} from '@/utils/utils-sv3'
  import { queryDatasourceBySystemCode } from '@/api-sv3/api'
  export default {
    components: {
      // TwoStepCaptcha,
      JGraphicCode,
      MDictSelectTag,
    },
    data() {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        encryptedString: {
          key: '',
          iv: ''
        },
        state: {
          time: 60,
          smsSendBtn: false
        },
        formLogin: {
          username: '',
          password: '',
          captcha: '',
          mobile: '',
          rememberMe: true
        },
        validatorRules: {
          username: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }, { validator: this.handleUsernameOrEmail }] },
          password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
          mobile: { rules: [{ validator: this.validateMobile }] },
          captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
          inputCode: { rules: [{ required: true, message: '请输入验证码!' }] }
        },
        verifiedCode: '',
        inputCodeContent: '',

        departList: [],
        departVisible: false,
        departSelected: '',
        currentUsername: '',
        validate_status: '',
        loginStyle: {},
        checkKey: undefined,
        checkImg: 'BUG',
        loadingCheckImg: true,
        loadingGif: require('@/assets/image/loading.gif'),
        canSendLoading: false,
        canSendSms: true,
        canSendSeconds: 60,
        smsTip: undefined,
        dataSourceList:[],
      }
    },
    beforeMount() {
      this.$ls.remove(ACCESS_TOKEN)
      this.getRouterData()

      this.setStyle = throttle(this.setStyle, 300)
      // 添加 resize 绑定事件
      window.addEventListener(
        'resize', this.setStyle, false
      )
      this.loadCheckImg()


    },
    mounted() {
      let dataSource = this.$ls.get(DATA_SOURCE)
      if (dataSource) {
        this.form.setFieldsValue({ dataSource: dataSource })
      }
      this.setStyle()
      this.$refs.code.focus()
    },
    beforeDestroy() {
      // 删除绑定的resize事件
      window.removeEventListener('resize', this.setStyle)
    },
    methods: {
      setStyle() {
        console.log('setStyle')
        let clientWidth = document.documentElement.clientWidth
        let ratio = clientWidth / 1920
        if (ratio < 0.7) {
          ratio = 0.7
        }
        this.loginStyle = { transform: `scale(${ratio}) translateY(-50%)` }
        // this.loginStyle = {}
      },
      ...mapActions(['Login', 'Logout', 'PhoneLogin']),
      // handler
      handleUsernameOrEmail(rule, value, callback) {
        console.log('handleUsernameOrEmail')
        /*if(value.indexOf(' ') > -1){
          callback("用户名不能存在空格!")
          return
        }*/
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        //获取该系统的项目列表
        if(value){
          this.queryDatasource(value)
        }
        callback()
      },
      handleTabClick(key) {
        this.customActiveKey = key
        // this.form.resetFields()
      },

      handleSubmit() {
        let loginParams = {
          remember_me: this.formLogin.rememberMe
        }
        // 使用账户密码登陆
        if (this.customActiveKey === 'tab1') {
          this.form.validateFields(['username', 'password', 'inputCode', 'dataSource'], { force: true }, (err, values) => {
            if (!err) {
              loginParams.username = values.username.trim()
              // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
              //loginParams.password = md5(values.password)
              //loginParams.password = encryption(values.password,that.encryptedString.key,that.encryptedString.iv)
              // 公钥加密
              loginParams.password = rsaEncrypt(values.password.trim())
              loginParams.dataSource = values.dataSource
              // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
              // let checkParams = this.$refs.jgraphicCodeRef.getLoginParam()
              loginParams.captcha = values.inputCode.toLowerCase()
              loginParams.systemCode = this.$config.systemCode
              loginParams.checkKey = this.checkKey

              this.loginBtn = true;
              this.Login(loginParams).then((res) => {
                if (res.success) {
                  const result = res.result
                  const userInfo = result.userInfo
                  this.$ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                  this.$ls.set(DATA_SOURCE, loginParams.dataSource)
                  this.$store.commit('SET_TOKEN', result.token)
                  this.$store.dispatch('UpdateUser', userInfo)
                  this.loginSuccess()
                 } else {
                  this.requestFailed(res)
                   // that.Logout();
                  this.loginBtn = false;
                 }
              }).catch((err) => {
                // this.loadCheckImg()
                this.requestFailed(err)
                this.loginBtn = false;
              })
            }
          })
          // 使用手机号登陆
        } else {
          this.form.validateFields(['mobile', 'captcha'], { force: true }, (err, values) => {
            if (!err) {
              loginParams.mobile = values.mobile
              loginParams.captcha = values.captcha
              this.PhoneLogin(loginParams).then((res) => {
                this.departConfirm(res)
              }).catch((err) => {
                this.requestFailed(err)
              })

            }
          })
        }
      },
      getCaptcha(e) {
        e.preventDefault()
        let that = this
        this.form.validateFields(['mobile'], { force: true }, (err, values) => {
            if (!values.mobile) {
              that.cmsFailed('请输入手机号')
            } else if (!err) {
              this.state.smsSendBtn = true
              let interval = window.setInterval(() => {
                if (that.state.time-- <= 0) {
                  that.state.time = 60
                  that.state.smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)

              const hide = this.$message.loading('验证码发送中..', 0)
              let smsParams = {}
              smsParams.mobile = values.mobile
              smsParams.smsmode = '0'
              postAction('/sys/sms', smsParams)
                .then(res => {
                  if (!res.success) {
                    setTimeout(hide, 0)
                    this.cmsFailed(res.message)
                  }
                  console.log(res)
                  setTimeout(hide, 500)
                })
                .catch(err => {
                  setTimeout(hide, 1)
                  clearInterval(interval)
                  that.state.time = 60
                  that.state.smsSendBtn = false
                  this.requestFailed(err)
                })
            }
          }
        )
      },
      stepCaptchaSuccess() {
        this.loginSuccess()
      },
      stepCaptchaCancel() {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      loginSuccess() {
        // update-begin- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
        // this.loginBtn = false
        // update-end- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
        let redirect = this.$route.query.redirect || '/'
        this.$router.push({ path: redirect })
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
          duration: 1
        })
      },
      cmsFailed(err) {
        this.$notification['error']({
          message: '登录失败',
          description: err,
          duration: 4
        })
      },
      requestFailed(err) {
        this.$notification['error']({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
          duration: 4
        })
        this.loginBtn = false
      },
      validateMobile(rule, value, callback) {
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          callback()
        } else {
          callback('您的手机号码格式不正确!')
        }

      },
      departConfirm(res) {
        if (res.success) {
          /*let multi_depart = res.result.multi_depart
          //0:无部门 1:一个部门 2:多个部门
          if (multi_depart == 0) {
            this.loginSuccess()
            this.$notification.warn({
              message: '提示',
              description: `您尚未归属部门,请确认账号信息`,
              duration: 3
            });
          } else if (multi_depart == 2) {
            this.departVisible = true
            this.currentUsername = this.form.getFieldValue("username")
            this.departList = res.result.departs
          } else {
            this.loginSuccess()
          }*/
          this.loginSuccess()
        } else {
          this.requestFailed(res)
          this.Logout()
        }
      },
      departOk() {
        if (!this.departSelected) {
          this.validate_status = 'error'
          return false
        }
        let obj = {
          orgCode: this.departSelected,
          username: this.form.getFieldValue('username')
        }
        putAction('/sys/selectDepart', obj).then(res => {
          if (res.success) {
            const userInfo = res.result.userInfo
            this.$ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
            this.$store.commit('SET_INFO', userInfo)
            //console.log("---切换组织机构---userInfo-------",store.getters.userInfo.orgCode);
            this.departClear()
            this.loginSuccess()
          } else {
            this.requestFailed(res)
            this.Logout().then(() => {
              this.departClear()
            })
          }
        })
      },
      departClear() {
        this.departList = []
        this.departSelected = ''
        this.currentUsername = ''
        this.departVisible = false
        this.validate_status = ''
      },
      departChange(value) {
        this.validate_status = 'success'
        this.departSelected = value
      },
      getRouterData() {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            'username': this.$route.params.username
          })
        })
      },
      //获取密码加密规则
      getEncrypte() {
        var encryptedString = this.$ls.get(ENCRYPTED_STRING)
        if (encryptedString == null) {
          getEncryptedString().then((data) => {
            this.encryptedString = data
          })
        } else {
          this.encryptedString = encryptedString
        }
      },
      // 获取验证码图片
      loadCheckImg() {
        this.loadingCheckImg = true
        this.form.setFieldsValue({ inputCode: '' })
        getAction('/sys/getCheckImg').then(res => {
          if (res.success) {
            this.checkKey = res.result.key
            this.checkImg = res.result.img
          } else {
            this.$message.error('生成验证码错误,请联系系统管理员')
            this.checkImg = 'BUG'
          }
        }).catch((e) => {
          this.$message.error('生成验证码连接服务器异常')
          this.checkImg = 'BUG'
        }).finally(() => {
          this.loadingCheckImg = false
        })
      },
      queryDatasource(username){
        queryDatasourceBySystemCode({systemCode: this.$config.systemCode,username}).then((res) => {
          if (res.success) {
            this.dataSourceList = res.result;
            let dataSource = this.$ls.get(DATA_SOURCE)
            if(dataSource&&this.dataSourceList.findIndex(function(item) {return item.code==dataSource;})!=-1){
              this.form.setFieldsValue({ dataSource: dataSource })
            }else if(this.dataSourceList.length>0) {
              this.form.setFieldsValue({ dataSource: this.dataSourceList[0].code })
            }else{
              this.form.setFieldsValue({ dataSource: '' })
            }
          }
        })
      },
    }
  }
</script>

<style lang="less">
  .loginContentInsight {
    width: 100%;
    height: 100%;
    position: relative;
    background: url("~@/assets/image/insight/login-bg-insight.png") top center no-repeat;
    background-size: cover;
    overflow: hidden;
  }

  .loginList-contentinsight {
    position: absolute;
    top: 50%;
    right: 15%;
    width: 480px;
    transition: all .3s;
    transform-origin: top right;

    .loginList {
      //background-color: #1172a6;
      //box-shadow: 1px 0 20px #7dbfdb;
      background-color: #88aee1;
      box-shadow: 1px 0 20px #c5dcfc;
      border-radius: 10px;
      padding: 30px;

      .loginList-select {

        font-size: 20px;

        .ant-select-selection {
          height: 50px;

          .ant-select-selection__rendered {
            line-height: 50px;
            text-indent: 0.8em;
          }
        }
      }

      .ant-form {
        width: 98%;
        margin: 0 auto;

        .ant-form-item {
          width: 100%;
          position: relative;
          .ant-form-explain{
            height: 40px;
            line-height: 40px;
            font-size: 18px;
          }

          input, input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
            height: 50px;
            font-size: 20px;
            border: none;
            overflow: hidden;
            text-indent: .8em;
            outline: none;
            display: inline-block;
            background-color: #fff;
            border-bottom: 1px solid #E2E2E2;
            border-radius: 4px;

          }
        }
      }

      .btn {
        height: 50px;
        line-height: 50px;
        font-size: 22px;
        text-align: center;
        border-radius: 4px;
        color: white;
        background-color: #cb676d;
        border: none;

        &[disabled] {
          /*background-color: lightgray;*/
          background-color: #999;

        }
      }

      .login-btn {
        height: 56px;
        line-height: 56px;
        font-size: 24px;
        text-align: center;
        border-radius: 4px;
        color: white;
        background-color: #5a8bcd;
        border: none;

        &[disabled] {
          /*background-color: lightgray;*/
          background-color: rgb(105, 183, 255);

        }
      }
    }

  }

  .checkImg {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    height: 48px;
    width: 100%;

    &.loading {
      background-size: contain;
    }
  }
</style>
