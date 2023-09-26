<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical" :form="form" v-bind="formItemLayout">
          <a-form-item
            label="姓名">
            <a-input placeholder="给自己起个名字" v-decorator="['realname']"/>
          </a-form-item>
          <a-form-item
            label="性别">
            <a-radio-group v-decorator="['sex']">
              <a-radio value="1">
                男
              </a-radio>
              <a-radio value="2">
                女
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="生日">
            <a-date-picker v-decorator="['birthday']"></a-date-picker>
          </a-form-item>
          <a-form-item
            label="手机号"
            :required="false">
            <a-input placeholder="请输入电话号码" v-decorator="['phone',vlidators.phone]"></a-input>
          </a-form-item>
          <a-form-item
            label="电子邮件">
            <a-input placeholder="exp@admin.com" v-decorator="['email',{
            rules: [
              {
                type: 'email',
                message: '邮件格式不符合规范',
              }
            ],
          },]"></a-input>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" :loading="confirmLoading" @click="save">提交</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit()">
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus"/>
          </div>
          <img :src="$util.toImgPath(avatar)" alt="头像" @error="defImg"/>
        </div>
        <a-alert message="头像待提交后生效" type="warning" showIcon style="margin: 10px 20px" v-if="showAvatarAlert"></a-alert>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @sure="setUserAvatar">

    </avatar-modal>
  </div>
</template>

<script>
  import { isPhone } from '@/utils/validate'
  import { updateUserBaseInfo } from '@/api/api'
  import { USER_INFO } from "@/store/mutation-types"
  import AvatarModal from './AvatarModal'
  import pick from 'lodash/pick'
  import moment from 'moment'

  moment.locale('zh-cn')
  import { mapGetters } from 'vuex'

  export default {
    components: {
      AvatarModal
    },
    data() {
      return {
        vlidators:{
          phone: {
            rules: [{
              validator: (rule, value, callback) => {
                if (value.length > 0 && !isPhone(value)) {
                  callback('手机号格式不符合规范')
                } else {
                  callback()
                }
              },
            }],
          }
        },
        formItemLayout: {
          labelCol: {
            lg: { span: 24 },
            sm: { span: 24 },
          },
          wrapperCol: {
            lg: { span: 24 },
            sm: { span: 24 },
          },
        },
        form: this.$form.createForm(this, { name:'form-baseUserInfo'}),
        user: {},
        avatar: null,
        defaultImg: this.$config.publicPath + '/logo-256.png',
        showAvatarAlert: false,
        confirmLoading: false
      }
    },
    beforeMount() {
      this.user = this.userInfo()
      console.log('this.user',this.user)
      this.avatar = this.user.avatar
    },
    mounted() {
      let obj = pick(this.user, 'realname', 'sex', 'birthday', 'phone', 'email')
      if(obj.birthday)
        obj.birthday = moment(obj.birthday)
      if(obj.sex)
        obj.sex = obj.sex.toString()
      this.form.setFieldsValue(obj)
    },
    methods: {
      ...mapGetters(["userInfo"]),
      setUserAvatar(avatar) {
        this.avatar = avatar
        this.showAvatarAlert = true
        console.log('this.user', this.user)
      },
      defImg(e) {
        let img = e.target;
        img.src = this.defaultImg;
        img.onerror = null; //防止闪图
      },
      save() {
        this.form.validateFields((err, values) => {
          console.log(err, values)
          if (!err) {
            let params = { ...values }
            if (this.showAvatarAlert) {
              params.avatar = this.avatar
            }
            console.log('params', params)
            this.confirmLoading = true
            updateUserBaseInfo(params).then(res => {
              if(res.success){
                let userInfo = res.result
                this.$store.dispatch('UpdateUser', userInfo);
                this.showAvatarAlert = false
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            }).finally(()=>{
              this.confirmLoading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>