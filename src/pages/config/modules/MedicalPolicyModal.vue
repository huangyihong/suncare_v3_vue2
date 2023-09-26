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
      <a-form :form="form" >
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="政策编号">
            <a-input placeholder="请输入政策编号" v-decorator="['policyCode', validatorRules.required]" :readOnly="readonly || readonly2"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="政策名称">
            <a-input placeholder="请输入名称" v-decorator="['policyName', validatorRules.required]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="政策类型">
            <other-dict-select-tag  placeholder="请选择政策类型" v-model="policyTypeSelect"  dictEname="rule_sourcetype" :labelInValue="true" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="政策用途分类">
            <other-dict-select-tag  placeholder="请选择政策用途分类" v-model="policyServiceClassSelect"  dictEname="service_class" :labelInValue="true" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="效力级别">
            <a-input placeholder="请输入效力级别" v-decorator="['effectLevelName', {}]" :readOnly="readonly"/>

          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="政策文号">
            <a-input placeholder="请输入政策文号" v-decorator="['policyDocNumber', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="发文时间">
            <a-date-picker placeholder="请选择发文时间" v-decorator="['issuingDate', {}]" :readOnly="readonly" />
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="废止的政策文号">
            <a-input placeholder="请输入废止的政策文号" v-decorator="['policyDiscardDocNumber', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="发文机关" style="height:30px">
            <a-textarea placeholder="请输入发文机关" v-decorator="['issuingOffice', {}]" :rows="1" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="适用地区">
            <other-dict-tree-select  placeholder="请选择适用地区" dictEname="region" :defaultValue="model.applyArea" @select="onSelectApplyArea"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="适用人群" style="height:30px">
            <a-textarea placeholder="请输入适用人群" v-decorator="['applyPeople', {}]" :rows="1" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="适用时间">
            <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="网址" style="height:30px">
            <a-textarea placeholder="请输入网址" v-decorator="['docOriginalUrl', {}]" :rows="1" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="备注" style="height:30px">
            <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" :rows="1" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item id="filenames"
                       :labelCol="labelCol2"
                       :wrapperCol="wrapperCol2"
                       label="附件">
            <j-upload :disabled="readonly" :multiple="false" :maxUploadFileCount="1" v-decorator="['filenames', {}]" bizPath="medicalPolicy"></j-upload>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <span> <br/><br/></span>
        </a-col>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>

  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import OtherDictSelectTag from "./OtherDictSelectTag"
  import JUpload from '@/components/jeecg/JUpload'
  import OtherDictTreeSelect from "./OtherDictTreeSelect"

  export default {
    name: "medicalPolicyModal",
    components: {
      OtherDictSelectTag,
      OtherDictTreeSelect,
      JUpload
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/config/medicalPolicy/add",
          edit: "/config/medicalPolicy/edit",
        },
        disableSubmit:false,
        readonly:false,//只读
        readonly2:false,
        dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
        policyTypeSelect:{},
        policyServiceClassSelect:{}
      }
    },
    beforeMount () {
    },
    methods: {
      add (record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.id
        } else {
          newRecord = {}
        }
        this.edit(newRecord);

        this.readonly=false;
        this.readonly2=false;
      },
      edit (record) {
        this.readonly=false;
        this.readonly2=true;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.dateTimes =  [moment(record.effectStartdate||'2000-01-01'), moment(record.effectEnddate||'2099/12/31')]
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'policyCode','effectLevelName','policyName','policyNumber','issuingOffice',
            'applyArea','applyPeople','remark','filenames','issuingDate','policyDocNumber',
            'docOriginalUrl','policyDiscardDocNumber'))
          this.policyTypeSelect ={key:this.model.policyTypeCode?this.model.policyTypeCode:''};
          this.policyServiceClassSelect ={key:this.model.policyServiceClassCode?this.model.policyServiceClassCode:''};
        });


      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;

        //校验政策编码格式 SD-JN-0001-ZW
        let poclicyCode = that.form.getFieldValue('policyCode').trim();
        let tempArray = poclicyCode.split("-")
        if(tempArray.length!=4){
          that.$message.error("政策编号格式不合法，需要由四部分组成，中间用-分割，如 SD-JN-0001-ZW");
          return;
        }

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
            //时间格式化
            formData.effectStartdate = this.dateTimes[0].format("YYYY-MM-DD");
            formData.effectEnddate = this.dateTimes[1].format("YYYY-MM-DD");
            this.getSelectText()
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
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

      getSelectText(){
        if(this.policyTypeSelect){
          this.model.policyTypeCode = this.policyTypeSelect.key
          if(this.policyTypeSelect.label){
            this.model.policyTypeName = this.policyTypeSelect.label
          }
        }

        if(this.policyServiceClassSelect){
          this.model.policyServiceClassCode = this.policyServiceClassSelect.key
          if(this.policyServiceClassSelect.label){
            this.model.policyServiceClassName = this.policyServiceClassSelect.label
          }
        }
      },

      //选中项目地
      onSelectApplyArea(value, obj){
        this.model.applyArea = obj.value;
        this.model.applyAreaId = obj.id;
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