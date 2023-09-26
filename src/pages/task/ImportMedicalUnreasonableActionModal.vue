<template>
  <m-modal centered
           :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">

    <div>
      <a-spin :spinning="confirmLoading">
        <a-alert :message="tip" banner v-if="tip" style="margin: 0 0 5px 0"/>
        <a-form :form="form" >
          <a-row :gutter="24">
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="批次名称">
                <a-input placeholder="请输入批次名称" v-decorator="['batchName', validatorRules.required]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="风控月份">
                <a-month-picker placeholder="选择月份" v-decorator="[ 'month', validatorRules.requiredOnly]" style="width: 100%"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="创建人">
                <a-input readOnly :value="nickname"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-upload-dragger
          name="file"
          :showUploadList="false"
          accept=".xls,.xlsx"
          :multiple="false"
          :headers="tokenHeader"
          :beforeUpload="beforeUpload"
          :action="importExcelUrl"
          :data="param"
          @change="handleImportExcel">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox"/>
          </p>
          <p class="ant-upload-text">点击选择或拖动文件到此处</p>
          <p class="ant-upload-hint" style="width: 100%" v-if="uploadFileName">
            <a @click="uploadFile">Excel模板下载</a>
          </p>
        </a-upload-dragger>

        <br>
        <div :style="messageStyle">
          <pre>{{message}}</pre>
        </div>
      </a-spin>
    </div>
    <br>
  </m-modal>
</template>

<script>
import pick from 'lodash/pick'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import moment from "moment"
import { mapGetters } from 'vuex'

moment.locale('zh-cn')
export default {
  name: "ImportModal",
  props: {
    tip: String
  },
  components: {},
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      title: '导入',
      visible: false,
      confirmLoading: false,
      importUrl: '',
      param: undefined,
      actionType: 'add',
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      uploadFileName: undefined,
      successStyle: 'color:blue;',
      errorStyle: 'color:red;',
      messageStyle: '',
      message: '',
      form: this.$form.createForm(this),
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
      },
    }
  },
  computed: {
    ...mapGetters(["nickname", "grid"]),
    importExcelUrl: function() {
      if(!this.importUrl.startsWith('http')){
        return `${this.$config['domianURL']}/${this.importUrl}`
      }
      return this.importUrl;
    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    loadData(param) {
      const that = this;
      this.visible = true;
      this.title = param.title;
      this.importUrl = param.importUrl;
      this.actionType = param.actionType;
      this.uploadFileName = param.uploadFileName;
      this.param = param.param;
      this.message = '';
      this.form.resetFields();
      this.$nextTick(() => {
        let obj = {}
        obj.month = moment(obj.month)
        this.form.setFieldsValue(obj)
        //时间格式化
      });
      console.dir(this.importUrl)
      console.dir(this.importExcelUrl)
    },
    /* 导入 */
    handleImportExcel(info) {
      if (info.file.status !== 'uploading') {
        //console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.message = info.file.response.result
          this.messageStyle = this.successStyle;
          this.$emit('ok', this.param.projectId);
        } else {
          this.message = info.file.response.message
          this.messageStyle = this.errorStyle;
        }
        this.confirmLoading = false;
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `);
        this.confirmLoading = false;
      }
    },
    /* 文件下载 */
    uploadFile() {
      window.open(this.$config['domianURL'] + "/sys/common/download/" + this.uploadFileName);
    },
    beforeUpload() {
      const that = this
      let flag = true
      this.form.validateFields((err, values) => {
        console.log(err,values)
        if (!err) {
          that.confirmLoading = true
          Object.assign(that.param, values)
          that.param.month = that.param.month.format("YYYY-MM");
        }else{
          flag = false;
        }
      })
      return flag
    }

  }
}
</script>

<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>
