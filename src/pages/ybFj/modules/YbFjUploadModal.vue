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
          label="医疗机构名称">
          <a-input placeholder="请输入医疗机构名称" v-decorator="['orgName', validatorRules.required]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="生成的文档类型">
          <a-checkbox-group v-decorator="['templateCodes', validatorRules.requiredOnly]">
            <template v-for="templateImportBean in templateImportList">
               <a-checkbox style="padding:6px 0;" v-for="(item,index) in templateExportList"
                           :value="item.templateCode+''" :key="item.templateCode"
                           v-if="templateImportBean.templateCodes.includes(item.templateCode+'')"
                           @change="checkTemplateExport($event,templateImportBean.id)"
                           :disabled="templateImportBean.disableFlag">{{item.templateName}}</a-checkbox>
               <div style='border-bottom:1px solid #eff2f5;margin:10px 0;'></div>
            </template>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="导入数据模板类型" >
          <template v-if="templateImportBean.importPath">
            {{templateImportBean.importName}}
            <a-button @click="uploadFile(templateImportBean.importPath)" style="margin-left:10px">点击下载当前导入数据模板</a-button>
          </template>
        </a-form-item>


        <a-col :md="24" :sm="24">
          <a-form-item id="filenames"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="导入数据文件">
            <j-upload :disabled="readonly" :multiple="false" :maxUploadFileCount="1" v-decorator="['filePath', validatorRules.requiredOnly]" bizPath="fjTemplate"></j-upload>
          </a-form-item>
        </a-col>
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
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: "/ybFj/ybFjUpload/add",
        edit: "/ybFj/ybFjUpload/edit",
        templateExportList: "/ybFj/ybFjTemplateExport/list",
        templateImportList: "/ybFj/ybFjTemplateImport/list",
      },
      templateImportList:[],
      templateExportList:[],
      templateImportBean:{},
    }
  },
  created () {
  },
  beforeMount() {
    this.getTemplateImportList()
    this.getTemplateExportList()
  },
  methods: {

    getTemplateImportList(){
      this.templateImportList = []
      getAction(this.url.templateImportList, {pageSize:99999,useStatus:'1',column:'createTime',order: 'asc'}).then((res) => {
        if (res.success) {
          this.templateImportList = res.result.records
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    getTemplateExportList(){
      this.templateExportList = []
      this.form.setFieldsValue({templateCodes:undefined})
      getAction(this.url.templateExportList, {pageSize:99999,useStatus:'1',column:'templateCode',order: 'asc'}).then((res) => {
        if (res.success) {
          this.templateExportList = res.result.records
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    //选中templateExport
    checkTemplateExport(e,id){
      if(e.target.checked){
        this.templateImportList.filter(item => item.id==id).map(item => this.$set(item,'disableFlag',false))
        this.templateImportList.filter(item => item.id!=id).map(item => this.$set(item,'disableFlag',true))
        if(!this.templateImportBean||!this.templateImportBean.id){
          this.getTemplateImportBean(id)
        }
      }
      if(this.form.getFieldValue('templateCodes')&&this.form.getFieldValue('templateCodes').length==1&&!e.target.checked){
        this.templateImportList.filter(item => item.id!=id).map(item => this.$set(item,'disableFlag',false))
        this.templateImportBean = {}
      }
    },
    getTemplateImportBean(id){
      let selectList = this.templateImportList.filter(item=>item.id == id)
      if(selectList.length>0){
        this.templateImportBean = selectList[0]
      }else{
        this.templateImportBean = {}
      }
    },
    add () {
      this.edit({});
      this.model.title = "创建文档自动生成任务"
    },
    edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      if(this.model.templateCodes){
        this.model.templateCodes = this.model.templateCodes.split(',')
      }
      this.templateImportList.map(item => this.$set(item,'disableFlag',false))
      if(this.model.templateImportId){
        this.templateImportList.filter(item => item.id!=this.model.templateImportId).map(item => this.$set(item,'disableFlag',true))
        this.getTemplateImportBean(this.model.templateImportId)
      }
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'orgName','templateCodes','remark','filePath'))
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
          if(!formData.filePath){
            that.$message.warning('请上传文件!');
            that.confirmLoading = false;
            return;
          }
          formData.templateCodes = formData.templateCodes&&formData.templateCodes.length>0?formData.templateCodes.join(','):''
          formData.templateImportId = this.templateImportBean.id
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

    /* 模板下载 */
    uploadFile(filePath){
      window.open(this.$config['domianURL'] + "/sys/common/download/" + filePath);
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
