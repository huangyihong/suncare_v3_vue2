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
          label="标签定义所属表">
          <m-dict-select-tag  placeholder="请选择标签所属表" :disabled="isEditValue || isEditStatus"  v-decorator="['ownTableName', validatorRules.ownTableName ]" dictCode="DATA_TAG_OWN_TABLE"  />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签英文名称">
          <a-input placeholder="请输入标签英文名称" v-decorator="['tagName', validatorRules.tagName ]" :readOnly="isEditValue || isEditStatus" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签中文名称">
          <a-input placeholder="请输入标签中文名称" v-decorator="['tagChnName', {}]" :readOnly="isEditStatus" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签详细说明">
          <a-input placeholder="请输入标签详细说明" v-decorator="['tagDesc', {}]"  :readOnly="isEditStatus"  />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签类型">
          <m-dict-select-tag  placeholder="请选择标签类型"  v-decorator="['tagType', validatorRules.tagType ]" dictCode="DATA_TAG_TYPE"  :disabled="isEditStatus"  />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标签状态">
          <m-dict-select-tag  placeholder="请选择标签状态"  v-decorator="['tagState', validatorRules.tagState ]" dictCode="DATA_TAG_STATUS"  :disabled="!isEditStatus"/>
        </a-form-item>

      </a-form>
    </a-spin>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "MedicalDataTagDefModal",
    components: {
      MDictSelectTag
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        isEditValue:false,
        isEditStatus:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          tagId:{rules: [{ required: true, message: '请输入唯一ID!' }]},
          ownTableName:{rules: [{ required: true, message: '请输入标签定义所属表!' }]},
          tagName:{rules: [{ required: true, message: '请输入标签英文名称!' }]},
          tagType:{rules: [{ required: true, message: '请输入标签类型（质控/业务）!' }]},
          tagState:{rules: [{ required: true, message: '请输入标签状态' }]},
        },
        url: {
          add: "/config/medicalDataTagDef/add",
          edit: "/config/medicalDataTagDef/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
        this.isEditValue =false;
        this.isEditStatus =false;
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({tagState:"0",tagType:"1"}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tagId','ownTableName','tagName','tagChnName','tagDesc','tagType','tagState','createUser','createUsername','updateUser','updateUsername'))
          //时间格式化
        });
        this.isEditValue =true;
        this.isEditStatus =false;
      },

      editStatus (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'tagId','ownTableName','tagName','tagChnName','tagDesc','tagType','tagState','createUser','createUsername','updateUser','updateUsername'))
          //时间格式化
        });
        this.isEditValue =false;
        this.isEditStatus =true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        //var  regForEnName = /(^_([a-zA-Z0-9]_?)*$)|(^[a-zA-Z](_?[a-zA-Z0-9])*_?$)/
        //let tagName = (this.form.getFieldValue('tagName'))
        //if(tagName !="" && !regForEnName.test(tagName)){
        //  this.$message.error("标签英文名称'" + tagName + "'格式不正确；提示：【首位可以是字母以及下划线。首位之后可以是字母，数字以及下划线。下划线后不能接下划线】")
        //  return ;
        //}

        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.tagId){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');

                if(that.isEditStatus){
                  that.$emit("statusOK")
                }
                that.close();
              }else{
                that.$message.error(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;

            })



          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>
</style>
