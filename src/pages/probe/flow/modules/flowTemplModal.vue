<template>
  <m-modal
    centered
    :title="title"
    :width="650"
    :visible="visible"
    @cancel="handleCancel"
    cancelText="关闭">
    <template slot="footer">
      <a-button @click="handleCancel">
        关闭
      </a-button>
      <a-button type="primary" @click="handleOk" style="margin-left: 15px">
        确定
      </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="节点编码">
          <a-input placeholder="请输入节点编码" v-decorator="['nodeCode', validatorRules.required]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="节点名称">
          <a-input placeholder="请输入节点名称" v-decorator="['name', validatorRules.required]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类">
          <m-dict-select-tag placeholder="选择节点分类" dictCode="FLOW_TEMPL_KIND" required
                             v-decorator="['nodeKind']"></m-dict-select-tag>
        </a-form-item>
      </a-form>
    </a-spin>
    <div style="color: #aaa;">注:探查模块中可以通过“导入节点” 的按钮导入当前保存的条件</div>
  </m-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { getProbeCaseCode } from '@/api-sv3/api-flow'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  export default {
    name: "flowTemplModal",
    components:{
      MDictSelectTag
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
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/probe/medicalFlowTempl/add",
          edit: "/probe/medicalFlowTempl/edit",
        },
        rules:[],

      }
    },
    beforeMount(){

    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.showResult = false;
        this.$nextTick(() => {
          this.form.setFieldsValue({
              ...pick(this.model,'nodeId','nodeCode','nodeName','nodeKind'),
            // nodeName 和选择框冲突
              name: this.model.nodeName
            }
          )
        });
        if(!this.model.nodeCode){
          getProbeCaseCode().then(res => {
            if (res.success) {
              this.model.nodeCode = res.result
              this.form.setFieldsValue({nodeCode: this.model.nodeCode})
            }
          })
        }

      },
      close () {
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
            if(!this.model.nodeId){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            // 名字字段转换
            formData.nodeName = formData.name
            delete formData.name
            formData.rules = this.rules
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok',res.result);
                that.close();
              }else{
                that.$message.warning(res.message);
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

      setNodeRules(rules){
        this.rules = rules
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
