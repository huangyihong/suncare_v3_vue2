<template>
  <!--loginContent begin-->
  <div class="wrapper1300 margin-center loginContentSearch">

    <!--login begin-->
    <div class="loginList-content" :style="loginStyle">


      <div class="loginList">
        <div class="welcomelogin">欢迎登录系统</div>
        <div class="sliceimg"><img src="~@/assets/image/login/slice.png"/></div>
        <ul class="p-t-30" style="text-align: center">
          <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
            <a-form-item>
              <img src="@/assets/image/login/user_icon.png" class="iconclass">
              <a-input class="input_1"
                       size="large"
                       v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
                       type="text"
                       ref="username"
                       placeholder="请输入用户名">
                <!--<a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
              </a-input>
            </a-form-item>

            <a-form-item>
              <img src="@/assets/image/login/passwordicon.png" class="iconclass">
              <a-input class="input_1"
                       v-decorator="['password',validatorRules.password]"
                       size="large"
                       type="password"
                       ref="password"
                       autocomplete="false"
                       placeholder="请输入密码">
                <!--<a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
              </a-input>
            </a-form-item>
            <a-form-item>
              <img src="@/assets/image/login/datasourceicon.png" class="iconclass">
              <a-select v-decorator="['dataSource',{}]" class="loginList-select " >
                <a-select-option v-for="(item, index) in dataSourceList" :key="item.code" :value="item.code" :title="item.name ">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item  >
              <img src="@/assets/image/login/verfycode.png" class="iconclass">
              <a-input class="input_2"
                       v-decorator="['inputCode',validatorRules.inputCode]"
                       size="large"
                       type="text"
                       ref="code"
                       placeholder="请输入验证码">
              </a-input>
              <div style="display: inline-block;">
                <img class="verifycodeclass"  :src="loadingGif"  v-if="loadingCheckImg"/>
                <img class="verifycodeclass"  :src="checkImg"  v-else @click="loadCheckImg" />

              </div>
            </a-form-item>

            <a-button
              class="btn w-b-100"
              size="large"
              type="primary"
              htmlType="submit"
              :loading="loginBtn"
              @click.stop.prevent="handleSubmit"

            >点击登录
            </a-button>
          </a-form>
        </ul>
      </div>

    </div>
    <!--loginContent end-->

    <login-sms-modal ref="sendSms" @ok="loginSuccess" @close="loadCheckImg"></login-sms-modal>

    <!-- 输入注册码 -->
    <m-modal centered
             title="输入注册码"
             :width="500"
             :visible="registrationCodeVisible"
             @ok="registrationCodeSave"
             @cancel="registrationCodeVisible=false"
             cancelText="关闭">
      <a-form>
        <a-form-item label="机器码">
          <a-textarea v-model="macCode" :rows="3" readOnly/>
        </a-form-item>
        <a-form-item label="注册码">
          <a-textarea v-model="registrationCode" :rows="3"/>
        </a-form-item>
      </a-form>
    </m-modal>

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
  import LoginSmsModal from '@/pages/user/LoginSmsModal'
  import {rsaEncrypt} from '@/utils/utils-sv3'
  import { queryDatasourceBySystemCode } from '@/api-sv3/api'
  export default {
    components: {
      // TwoStepCaptcha,
      JGraphicCode,
      MDictSelectTag,
      LoginSmsModal
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
        //输入注册码
        registrationCodeVisible:false,
        macCode:'',
        registrationCode:'',
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
      sendSms() {

        this.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
          if (!err) {
            const loginParams = {
              username: values.username,
              password: rsaEncrypt(values.password.trim())
            }
            this.tip = undefined
            this.canSendLoading = true
            postAction('/sys/sendSms', loginParams).then(res => {
              if(res.success){
                this.smsTip = res.result
                this.sendSmsCountDown(60)
              } else {
                this.smsTip = '发送失败：' + res.message
              }
            }).finally(() =>{
              this.canSendLoading = false
            })
          }
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
        //输入注册码
        if(err.code==501){
          this.registrationCodeVisible = true
          this.macCode = err.result
          this.registrationCode = ''
        }
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
      loadCheckImg(){
        this.loadingCheckImg = true
        this.form.setFieldsValue({inputCode: ''})
        getAction("/sys/getCheckImg").then(res=>{
          if(res.success){
            this.checkKey = res.result.key
            this.checkImg = res.result.img
          }else{
            this.$message.error("生成验证码错误,请联系系统管理员")
            this.checkImg = 'BUG'
          }
        }).catch((e)=>{
          this.$message.error("生成验证码连接服务器异常")
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

      //输入注册码
      registrationCodeSave(){
        if(!this.registrationCode){
          this.$message.error('请输入注册码')
          return;
        }
        if(!this.macCode){
          this.$message.error('未生成机器码')
          return;
        }
        getAction('/sys/registrationCodeSave',{registrationCode:this.registrationCode}).then(res => {
          if (res.success) {
            this.registrationCodeVisible = false
            this.$notification.success({
              message: '操作成功',
              description: `保存注册码成功,请重新登录`,
              duration: 4
            })
          } else {
            this.$message.error('保存注册码失败,请联系系统管理员')
          }
        })
      },
    }
  }
</script>

<style lang="less">
  .loginContentSearch {
    width: 100%;
    height: 100%;
    margin-left: 0px;
    background-image: url("~@/assets/image/loginSearch/bg.png");
    background-position: 0;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .loginContentSearch .loginList-content {
    position: absolute;
    top: 55%;
    right: calc(50% - 200px);
    width: 520px;
    text-align: center;
    transition: all .3s;
    transform-origin: top right;
    .welcomelogin{
      width: 100%;
      height: 26px;
      font-size: 28px;
      font-weight: 400;
      margin-top: 15px;
      color: #4B4C53;
    }
    .sliceimg{
      width: 100%;
      margin-top: 20px;
    }
    .iconclass{
      position: absolute;z-index:100;left: 19px;top: -2px;width: 24px;height: 24px
    }

    .input_1{
      padding-left: 53px;width: 386px;
      height:55px! important;
      border: 1px solid #CACFE2! important;
      border-radius: 8px! important;
    }
    .verifycodeclass{
      width: 128px;
      height: 55px;
      margin-left: 5px;
      border: 2px solid #CACFE2;
      border-radius: 8px
    }

    .input_2{
      padding-left: 50px;width: 254px;
      height:55px! important;
      border: 1px solid #CACFE2! important;
      border-radius: 8px! important;
    }
    .loginList {
     /* height: 553px;
      background: #FFFFFF;
      border: 1px solid #BBBBBB;
      box-shadow: 0px 3px 46px 0px rgba(24,62,97,0.13);
      border-radius: 15px;*/

      height: 553px;
      background: #eff7fd;
      border: 1px solid #bbb;
      box-shadow: 0 3px 46px 0 rgba(24,62,97,.13);
      border-radius: 15px;

      //background-color:rgba(0,0,0,0.2);
      .loginList-select{
        width: 386px;
        font-size: 20px;
        height: 53px;
        .ant-select-selection{
          height: 53px;
          .ant-select-selection__rendered{
            line-height: 50px;
            text-indent: 0.8em;
          }
        }
        .ant-select-selection-selected-value{
          padding-left: 40px;
        }
      }
      .ant-form {
        width: 98%;
        margin: 0 auto;

        .ant-form-item {
          width: 100%;
          position: relative;
          input,input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill{
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
        width: 384px;
        height: 52px;
        background: linear-gradient(270deg, #5B86F7, #6283F0);
        box-shadow: 0px 5px 8px 0px rgba(159,178,238,0.77);
        border-radius: 8px;

        font-size: 19px;
        color: white;
        &[disabled]{
          /*background-color: lightgray;*/
          background-color: rgb(105,183,255);

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
