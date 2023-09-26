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
          label="任务名称">
          <a-input placeholder="请输入任务名称" v-decorator="['taskName', validatorRules.required]"/>
        </a-form-item>


        <a-form-item id="filenames"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="待OCR识别图片">
          <j-upload :disabled="readonly" :multiple="false" :maxUploadFileCount="1"
                    v-decorator="['filePath', validatorRules.requiredOnly]" bizPath="fjTemplate"></j-upload>
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="生成的文档类型">
          <m-dict-select-tag-edit dictCode="FILE_TYPE" placeholder="请选择生成的文档类型" v-decorator="['exportType', {}]"/>
        </a-form-item>


        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注" style="height:30px">
            <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" :rows="1"/>
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
import {httpAction} from '@/api/manage'
import pick from 'lodash/pick'
import moment from "moment"
import MDictSelectTagEdit from "@/components/dict_medical/MDictSelectTagEdit"
import JUpload from '@/components/jeecg/JUpload'

export default {
  name: "YbFjOcrModal",
  components: {
    MDictSelectTagEdit,
    JUpload
  },
  data() {
    return {
      title: "操作",
      visible: false,
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        required: {rules: [{required: true, message: '这是必填项!'}, {whitespace: true, message: '值不能是空格!'}]},
        requiredOnly: {rules: [{required: true, message: '这是必填项!'}]},
      },
      url: {
        add: "/ybFj/ybFjOcr/add",
        edit: "/ybFj/ybFjOcr/edit",
      },
    }
  },
  created() {
  },
  methods: {
    add() {
      this.edit({exportType:'excel'});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'createUser', 'createUsername', 'exportName', 'exportPath', 'exportType', 'filePath', 'remark', 'taskDesc', 'taskName', 'taskStatus', 'updateUser', 'updateUsername'))
        //时间格式化
      });

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
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          //时间格式化

          console.log(formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
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
