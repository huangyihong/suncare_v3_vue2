<template>
  <m-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :closable="false">
    <template slot="footer">
      <a-button @click="handleCancel" v-if="closable">
        关闭
      </a-button>
      <a-button type="primary" @click="handleOk" style="margin-left: 15px" :loading="confirmLoading">
        确定
      </a-button>
    </template>
<!--<div style='height: 230px'>-->
  <a-spin :spinning="confirmLoading">
      <a-alert :message="tip" banner v-if="tip" style="margin: 0 0 5px 0"/>
      <a-form :form="form">
        <a-form-item>
          <!--<m-dict-select-tag :value="projectSource" dictCode="SOLR_DATA_SOURCE"
                             required class="loginList-select" v-model="projectSource"
                             @change="change"></m-dict-select-tag>-->
          <!--<a-select v-model="projectSource" class="loginList-select">
            <a-select-option v-for="(item, index) in dataSourceList" :key="item.code" :value="item.code" :title="item.name ">
              {{ item.name }}
            </a-select-option>
          </a-select>-->
          <a-radio-group v-model="projectSource" @change="onChange">
            <a-radio v-for="(item, index) in dataSourceList" :key="item.code" :value="item.code" style="width:200px;height: 30px;line-height: 30px;">
              {{ item.name }}
            </a-radio>
          </a-radio-group>

        </a-form-item>
      </a-form>
    </a-spin>
<!--</div>-->

  </m-modal>


</template>

<script>
  import moment from 'moment'
  moment.locale('zh-cn')
  import { ACCESS_TOKEN, ENCRYPTED_STRING, DATA_SOURCE } from '@/store/mutation-types'
  import { httpAction,putAction } from '@/api/manage'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
  import PageRouterTab from '@/components/page/PageRouterTab'
  import { queryDatasourceBySystemCode } from '@/api-sv3/api'
  import Vue from "vue";
  export default {
    components: {
      MDictSelectTag,
      PageRouterTab,
    },
    name: "ChangeProjectSource",
    data () {
      return {
        title:"切换项目地",
        projectSource:"",
        modalWidth:700,
        visible: false,
        confirmLoading: false,
        confirmDirty:false,
        value:"123",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        form:this.$form.createForm(this),
        tip: undefined,
        closable: true,
        url: {
          changeProjectSource: '/projectSource/change',
        },
      }
    },
    beforeMount() {
      //获取该系统的项目列表
      this.queryDatasource()
    },
    methods: {
      show(){
        this.form.setFieldsValue({dataSource:this.$store.state.user.info.dataSource});
        this.projectSource=this.$store.state.user.info.dataSource
        this.closable=true
        this.visible=true

      },
      handleCancel () {
        this.closable=false
        this.visible=false
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleOk () {
        this.confirmLoading=true
        httpAction(this.url.changeProjectSource,{dataSource:this.projectSource},"post").then((res)=>{
          if (res.success) {
            const result = res.result
            const userInfo = result.userInfo
            this.$ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            this.$ls.set(DATA_SOURCE, this.projectSource)
            this.$store.commit('SET_TOKEN', result.token)
            this.$store.dispatch('UpdateUser', userInfo)
            // this.$forceUpdate()
            this.$router.go(0)
            // this.$emit("freshtab")
            this.visible=false
            this.$message.success("切换项目地成功!");
          } else {
            this.$notification['error']({
              message: '切换项目地失败',
              description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
              duration: 4
            })
          }
        }).finally(() => {
          this.confirmLoading = false;
        })
      },


      change(val){
        this.projectSource=val

      },

      queryDatasource(){
        queryDatasourceBySystemCode({systemCode: this.$config.systemCode,username:this.$store.state.user.info.username}).then((res) => {
          if (res.success) {
            this.dataSourceList = res.result;
          }
        })
      },



    }
  }
</script>

<style lang="less">
.loginList-content {
  position: absolute;
  top: 50%;
  right: 15%;
  width: 480px;
  transition: all .3s;
  transform-origin: top right;

  .loginList {
    background-color: #1172a6;
    box-shadow: 1px 0 20px #7dbfdb;
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
      background-color: #2b98cb;
      border: none;

      &[disabled] {
        /*background-color: lightgray;*/
        background-color: rgb(105, 183, 255);

      }
    }
  }

}
</style>

