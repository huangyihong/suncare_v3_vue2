<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称">
          <a-input placeholder="请输入角色名称" v-decorator="[ 'roleName', validatorRules.roleName]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色编码">
          <a-input placeholder="请输入角色编码" :disabled="roleDisabled" v-decorator="[ 'roleCode', validatorRules.roleCode]" />
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目地">

          <m-multi-select-tag placeholder="请选择项目地(多选)" mode="multiple" :options="dataSourceList" :required="false" class="loginList-select"
                             v-decorator="['dataSource', {}]"></m-multi-select-tag>

        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea :rows="5" placeholder="..." v-decorator="[ 'description', validatorRules.description ]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash/pick'
  import {addRole,editRole,duplicateCheck } from '@/api/api'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import { queryDatasourceBySystemCode } from '@/api-sv3/api'

  export default {
    name: "RoleModal",
    components: {
      MDictSelectTag,
      MMultiSelectTag,
    },
    data () {
      return {
        title:"操作",
        visible: false,
        roleDisabled: false,
        model: {},
        dataSourceList:[],
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
          roleName:{
            rules: [
              { required: true, message: '请输入角色名称!' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ]},
          roleCode:{
            rules: [
              { required: true, message: '请输入角色名称!'},
              { min: 0, max: 64, message: '长度不超过 64 个字符', trigger: 'blur' },
              { validator: this.validateRoleCode}
            ]},
          dataSource:{
            rules: [
              { required: true, message: '请选择项目地!'},
              { trigger: 'blur' },
            ]
          },
          description:{
            rules: [
              { min: 0, max: 126, message: '长度不超过 126 个字符', trigger: 'blur' }
            ]}
        },
      }
    },
    beforeMount() {
      //获取该系统的项目列表
      this.queryDatasource()
    },
    methods: {
      queryDatasource(){
        queryDatasourceBySystemCode({systemCode: this.$config.systemCode}).then((res) => {
          if (res.success) {
            this.dataSourceList = res.result.map(item => {
              return {
                code: item.code,
                value: item.name
              }
            })
          }
        })
      },

      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;

        //编辑页面禁止修改角色编码
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'roleName', 'description','roleCode','dataSource'))
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
          console.log(values)
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            let obj;
            if(!this.model.id){
              //默认添加的为当前系统角色
              formData.systemCode = this.$config.systemCode
              obj=addRole(formData);
            }else{
              obj=editRole(formData);
            }
            obj.then((res)=>{
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
      validateRoleCode(rule, value, callback){
        if(/[\u4E00-\u9FA5]/g.test(value)){
          callback("角色编码不可输入汉字!");
        }else{
          var params = {
            tableName: "sys_role",
            fieldName: "role_code",
            fieldVal: value,
            dataId: this.model.id,
          };
          duplicateCheck(params).then((res)=>{
            if(res.success){
              callback();
            }else{
              callback(res.message);
            }
          });
        }
      }

    }
  }
</script>

<style scoped>

</style>