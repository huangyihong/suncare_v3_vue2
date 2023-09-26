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
          label="文档生成模板名称">
          <a-input placeholder="请输入文档生成模板名称" v-decorator="['templateName', validatorRules.templateName]"/>
         </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="调用python编码">
          <m-dict-select-tag-edit dictCode="FJ_FILE_TYPE" v-decorator="['pythonProcCode',validatorRules.pythonProcCode]" valueEqCode showKey :autoIncrease="false" search></m-dict-select-tag-edit>
        </a-form-item>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注" style="height:30px">
            <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" :rows="1"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item id="filenames"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="文档生成模板文件">
            <j-upload :disabled="readonly" :multiple="false" :maxUploadFileCount="1" v-decorator="['templatePath', {}]" bizPath="fjTemplate"></j-upload>
          </a-form-item>
        </a-col>


      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import JUpload from '@/components/jeecg/JUpload'
  import MDictSelectTagEdit from "@/components/dict_medical/MDictSelectTagEdit"

  export default {
    name: "YbFjTemplateExportModal",
    components: {
      JUpload,
      MDictSelectTagEdit,
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        validatorRules: {
          pythonProcCode: { rules: [{ required: true, message: '请选择python编码!', validator: 'click' }, { validator: this.isExistName }] },
          templateName:{ rules: [{ required: true, message: '请输入模板名称!' }] },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          add: "/ybFj/ybFjTemplateExport/add",
          edit: "/ybFj/ybFjTemplateExport/edit",
          isExistName:"/ybFj/ybFjTemplateExport/isExistName",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'pythonProcCode','templateName','remark','templatePath'))
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            /*if(!formData.templatePath){
              that.$message.warning('请上传文件!');
              that.confirmLoading = false;
              return;
            }*/

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },

      isExistName(rule, value, callback) {
        if(!value){
          callback()
        }
        let param = {templateName:value,id:this.model.id}
        getAction(this.url.isExistName,param,'get').then((res) => {
          if (res.success) {
            callback()
          } else {
            callback("生成文件模板名称已存在!")
          }
        })
      },

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
