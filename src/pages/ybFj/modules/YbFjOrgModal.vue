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
          <a-input placeholder="请输入医疗机构名称" v-decorator="['orgName', validatorRules.required]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构性质名称">
          <m-dict-select-tag placeholder="请选择医疗机构性质名称" v-decorator="['busstype', validatorRules.required]"  dictCode="JGFLGLDM" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="统一社会信用代码">
          <a-input placeholder="请输入统一社会信用代码" v-decorator="['socialCode', validatorRules.required]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="卫生机构类别">
<!--          <m-dict-select-tag placeholder="请选择卫生机构类别" v-decorator="['orgtype', validatorRules.required]"  dictCode="JGLB" />-->
          <other-dict-select-tag  placeholder="请选择卫生机构类别" v-decorator="['orgtype', validatorRules.required]"   dictEname="Medical_Org_type" :labelInValue="true" :readOnly="readonly"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构级别">
          <m-dict-select-tag placeholder="请选择医疗机构级别" v-decorator="['hosplevel', {}]"  dictCode="YYJB" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构等级">
          <m-dict-select-tag placeholder="请选择医疗机构等级" v-decorator="['hospgrade', {}]"  dictCode="YYDJ" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所有制形式">
<!--          <m-dict-select-tag placeholder="请选择所有制形式" v-decorator="['ownershipCode', validatorRules.required]"  dictCode="JJLXBM" />-->
          <other-dict-select-tag  placeholder="请选择所有制形式" v-decorator="['ownershipCode', validatorRules.required]"  dictEname="ownType" :labelInValue="true" :readOnly="readonly"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医保负责人姓名">
          <a-input placeholder="请输入医保负责人姓名" v-decorator="['responsible', validatorRules.required]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="负责人联系方式">
          <a-input placeholder="请输入负责人联系方式" v-decorator="['responsiblePhone', validatorRules.required]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构编码">
          <a-input placeholder="请输入医疗机构编码" v-decorator="['orgId', validatorRules.required]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构曾用名">
          <a-input placeholder="请输入医疗机构曾用名" v-decorator="['orgUsedName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="法人姓名">
          <a-input placeholder="请输入法人姓名" v-decorator="['legalperson', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="法人联系方式">
          <a-input placeholder="请输入法人联系方式" v-decorator="['legalpersonPhone', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构地址">
          <other-dict-cascader placeholder="请选择所属医疗机构地址"  @change="onChangeTypeCode"  dictEname="region" :defaultValue="typeCode_arr"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医疗机构详细地址">
          <a-input placeholder="请输入医疗机构详细地址" v-decorator="['orgAddress', validatorRules.required]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="床位数">
          <a-input-number style="width: 100%" placeholder="请输入床位数" v-decorator="['bedAmount', {}]" />
        </a-form-item>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import OtherDictCascader from "@/pages/config/modules/OtherDictCascader"
  import OtherDictSelectTag from "./OtherDictSelectTag"
  export default {
    name: "YbFjOrgModal",
    components: {
      MDictSelectTag,
      OtherDictCascader,
      OtherDictSelectTag
    },
    data () {
      return {
        title:'新增医疗结构信息',
        visible: false,
        model: {},
        typeCode_arr:[],
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
          required: {rules: [{required: true, message: '这是必填项!'}, {whitespace: true, message: '值不能是空格!'}]},
          requiredOnly: {rules: [{required: true, message: '这是必填项!'}]},
        },
        url: {
          add: "/fj/org/add",
          edit: "/fj/org/edit",
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
        this.title='修改医疗结构信息'
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'orgName','busstype','socialCode','orgtype','hosplevel','hospgrade','ownershipCode','responsible','responsiblePhone','orgId','orgUsedName','legalperson','legalpersonPhone','orgAddress','orgAddress','bedAmount'))
          this.typeCode_arr = [this.model.provinceCode,this.model.cityCode,this.model.countyCode,this.model.townCode,this.model.villageCode];
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
      //修改医疗机构地址
      onChangeTypeCode(value,selectedOptions) {
        let that = this;
        that.model.provinceCode="";
        that.model.provinceName="";
        that.model.cityCode="";
        that.model.cityName="";
        that.model.countyCode="";
        that.model.countyName="";
        that.model.townCode="";
        that.model.townName="";
        that.model.villageCode="";
        that.model.villageName="";
        selectedOptions.forEach(function(item,index,arr){
          if(index===0){
            that.model.provinceCode=item.value;
            that.model.provinceName=item.label;
          }
          if(index===1){
            that.model.cityCode=item.value;
            that.model.cityName=item.label;
          }
          if(index===2){
            that.model.countyCode=item.value;
            that.model.countyName=item.label;
          }
          if(index===3){
            that.model.townCode=item.value;
            that.model.townName=item.label;
          }
          if(index===4){
            that.model.villageCode=item.value;
            that.model.villageName=item.label;
          }
        });
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

.drawer-bootom-button-left {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

</style>
