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
          label="项目地名称">
          <a-input placeholder="请输入项目地名称" v-decorator="['project', validatorRules.required]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="物价级别">
          <!--<a-input placeholder="请输入医院级别编码" v-decorator="['hoslevelCode', validatorRules.required]" />-->
          <other-dict-select-tag  placeholder="请选择物价级别" v-model="orgLevelCodeSelect"  dictEname="price_level"
                                  :labelInValue="true" :readOnly="readonly" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="报销比例">
          <a-input-number :step="1" :min="1" :max="100"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          v-decorator="['fundpayprop', validatorRules.requiredOnly]"></a-input-number>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="适用时间">
          <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
        </a-form-item>




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

  export default {
    name: "StdHoslevelFundpaypropModal",
    components: {
      OtherDictSelectTag
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
          required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/config/stdHoslevelFundpayprop/add",
          edit: "/config/stdHoslevelFundpayprop/edit",
        },
        orgLevelCodeSelect:{},
        dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
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
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.dateTimes =  [moment(record.startdate||'2000-01-01'), moment(record.enddate||'2099/12/31')]
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'project','hosplevel','hosplevelName','fundpayprop'))
          this.orgLevelCodeSelect ={key:this.model.hosplevel?this.model.hosplevel:''};
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
            //时间格式化
            formData.startdate = this.dateTimes[0].format("YYYY-MM-DD");
            formData.enddate = this.dateTimes[1].format("YYYY-MM-DD");
            this.getSelectText()
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

      getSelectText(){
        if(this.orgLevelCodeSelect){
          this.model.hosplevel = this.orgLevelCodeSelect.key
          if(this.orgLevelCodeSelect.label){
            this.model.hosplevelName = this.orgLevelCodeSelect.label
          }
        }
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