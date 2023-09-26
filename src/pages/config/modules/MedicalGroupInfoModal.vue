<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="labelName+'组编码'">
          <a-input placeholder="请输入分组编码" v-decorator="['groupCode', validatorRules.required]"
                   :readOnly="!!model.groupId"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="labelName+'组名称'">
          <a-input placeholder="请输入分组名称" v-decorator="['groupName', validatorRules.required]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序号">
          <a-input-number :min="0" :max="1000" :step="1"
                          v-decorator="['isOrder', {initialValue: 1,...validatorRules.requiredOnly}]"/>
        </a-form-item>
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述">
        <a-input placeholder="请输入描述" v-decorator="['remark', {}]"/>
        </a-form-item>
      </a-form>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>

  export default {
    name: "MedicalGroupModal",
    components: {
    },
    props:['kind'],
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelColHalf: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperColHalf: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        wrapperCollHalf2: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {},
        selectData: [],
        selectInfos: {
          '1': { title: '医疗服务项目组(诊疗项目)', component: 'MedicalTreatProject', tableNameUrl:'medicalProjectGroup',labelName:'医疗服务项目' },
          '5': { title: '疾病组(疾病诊断)', component: 'MedicalDiseaseDiag', tableNameUrl:'medicalDiseaseGroup',labelName:'疾病' },
          '7': { title: '药品组(药品信息)', component: 'MedicalDrug', tableNameUrl:'medicalDrugGroup',labelName:'药品' },
        },
        selectInfo: {},
        tableNameUrl:'medicalDrugGroup',
        labelName:'药品组',
      }
    },
    watch:{
      kind:{
        immediate:true,
        handler(kind) {
          console.log('kind',kind)
          if (kind && kind.length > 0) {
            let info = this.selectInfos[kind]
            if (info) {
              this.selectInfo = info
              this.labelName = info.labelName
            }
          }
        }
      }
    },
    methods: {
      show(){
        this.visible = true;
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
            let formData = Object.assign(this.model, values);
            // 选择项
            // this.selectData = this.selectData.filter(item => !item.editable)
            // this.selectData = this.selectData.filter(item => !!item.code && !!item.name)
            this.$emit('ok',formData);

          }
        })
      },

    }
  }
</script>

<style lang="less" scoped>
  .title {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;

    div {
      padding: 0 5px;
    }
  }

  .list-item {
    border-bottom: 1px solid #e8e8e8;
  }
</style>