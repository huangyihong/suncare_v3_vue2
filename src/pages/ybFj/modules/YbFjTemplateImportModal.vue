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
          label="导入数据模板名称">
          <a-input placeholder="请输入导入数据模板名称" v-decorator="['importName', validatorRules.importName]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="可生成的文档类型">
          <a-select
            show-search
            allowClear
            mode="multiple"
            v-decorator="['templateCodes', validatorRules.templateCodes]"
            placeholder="请选择可生成的文档类型"
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option  v-for="(item,index) in templateExportList" :value="item.templateCode+''" :key="item.templateCode">{{item.templateName}}</a-select-option>
          </a-select>

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
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="模板可用状态">
            <a-switch checked-children="可用" un-checked-children="禁用" :checked="model.useStatus==='1'" @change="val=>model.useStatus=val?'1':'0'"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item id="filenames"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="导入数据模板文件">
            <j-upload :disabled="readonly" :multiple="false" :maxUploadFileCount="1" v-decorator="['importPath', {}]" bizPath="fjTemplate"></j-upload>
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

  export default {
    name: "YbFjTemplateModal",
    components: {
      JUpload
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
          importName: { rules: [{ required: true, message: '请输入导入文件模板名称!', validator: 'click' }, { validator: this.isExistName }] },
          templateCodes: { rules: [{ required: true, message: '请选择导出模板!' }] },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          add: "/ybFj/ybFjTemplateImport/add",
          edit: "/ybFj/ybFjTemplateImport/edit",
          isExistName:"/ybFj/ybFjTemplateImport/isExistName",
          templateExportList: "/ybFj/ybFjTemplateExport/list",
        },
        templateExportList:[],
      }
    },
    created () {
    },
    beforeMount() {
      this.getTemplateExportList()

    },
    methods: {
      getTemplateExportList(){
        this.templateExportList = []
        getAction(this.url.templateExportList, {pageSize:99999,useStatus:'1',column:'createTime',order: 'asc'}).then((res) => {
          if (res.success) {
            this.templateExportList = res.result.records
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      add () {
        this.edit({useStatus:'1'});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(this.model.templateCodes){
          this.model.templateCodes = this.model.templateCodes.split(',')
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'importName','templateCodes','remark','importPath'))
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
            if(!formData.importPath){
              that.$message.warning('请上传文件!');
              that.confirmLoading = false;
              return;
            }
            formData.templateCodes = formData.templateCodes&&formData.templateCodes.length>0?formData.templateCodes.join(','):''

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
        let param = {importName:value,id:this.model.id}
        getAction(this.url.isExistName,param,'get').then((res) => {
          if (res.success) {
            callback()
          } else {
            callback("导入文件模板名称已存在!")
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
