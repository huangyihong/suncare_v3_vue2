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
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="版本编号">
              <a-input placeholder="请输入版本编号" v-decorator="['versionCode', validatorRules.versionCode]" :readOnly="!!model.id"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="版本名称">
              <a-input placeholder="请输入版本名称" v-decorator="['versionName', validatorRules.required]"/>
            </a-form-item>
          </a-col>
          <a-col :md="model.catalogType=='DRG_V'?12:24" :sm="24">
            <a-form-item
              :labelCol="model.catalogType=='DRG_V'?labelCol2:labelCol"
              :wrapperCol="model.catalogType=='DRG_V'?wrapperCol2:wrapperCol"
              label="MDC目录版本" v-if="mdcCatalogVField.includes(model.catalogType)">
              <a-select
                show-search
                allowClear
                v-decorator="['mdcCatalogV', validatorRules.required]"
                placeholder="请选择MDC目录版本"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option  v-for="(item,index) in mdcCatalogList" :value="item.versionCode+''" :key="item.versionCode">{{item.versionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="model.catalogType=='DRG_V'?12:24" :sm="24">
            <a-form-item
              :labelCol="model.catalogType=='DRG_V'?labelCol2:labelCol"
              :wrapperCol="model.catalogType=='DRG_V'?wrapperCol2:wrapperCol"
              label="ADRG目录版本" v-if="adrgCatalogVField.includes(model.catalogType)">
              <a-select
                show-search
                allowClear
                v-decorator="['adrgCatalogV', validatorRules.required]"
                placeholder="请选择MDC目录版本"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option  v-for="(item,index) in adrgCatalogList" :value="item.versionCode+''" :key="item.versionCode">{{item.versionName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <templat v-if="model.catalogType=='DRG_V'">
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="MDC主诊表版本">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['mdcInfoV', validatorRules.required]"
                  placeholder="请选择MDC主诊表版本"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in otherCatalogList" :value="item.versionCode+''" :key="item.versionCode" v-if="item.catalogType=='MDC_INFO_V'">{{item.versionName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="ADRG列表版本">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['adrgListV', validatorRules.required]"
                  placeholder="请选择ADRG列表版本"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in otherCatalogList" :value="item.versionCode+''" :key="item.versionCode" v-if="item.catalogType=='ADRG_LIST_V'">{{item.versionName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="MCC版本">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['mccInfoV', validatorRules.required]"
                  placeholder="请选择MCC版本"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in otherCatalogList" :value="item.versionCode+''" :key="item.versionCode" v-if="item.catalogType=='MCC_INFO_V'">{{item.versionName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="CC版本">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['ccInfoV', validatorRules.required]"
                  placeholder="请选择CC版本"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in otherCatalogList" :value="item.versionCode+''" :key="item.versionCode" v-if="item.catalogType=='CC_INFO_V'">{{item.versionName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="排除表版本">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['excludeInfoV', validatorRules.required]"
                  placeholder="请选择排除表版本"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in otherCatalogList" :value="item.versionCode+''" :key="item.versionCode" v-if="item.catalogType=='EXCLUDE_INFO_V'">{{item.versionName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术室手术版本">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['surgeryInfoV', {}]"
                  placeholder="请选择手术室手术版本"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in otherCatalogList" :value="item.versionCode+''" :key="item.versionCode" v-if="item.catalogType=='SURGERY_INFO_V'">{{item.versionName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </templat>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="ICD10版本" v-if="icd10VField.includes(model.catalogType)">
              <m-dict-select-tag placeholder="请选择ICD10版本" dictCode="DRG_IDC_V"
                                 v-decorator="['icd10V', validatorRules.required]" ></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="ICD9版本" v-if="icd9VField.includes(model.catalogType)">
              <m-dict-select-tag placeholder="请选择ICD9版本" dictCode="DRG_IDC_V"
                                 v-decorator="['icd9V', validatorRules.required]" ></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="备注">
              <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>

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
import {catalogFieldConfig} from '@/pages/drg/mixins/catalogFieldConfig'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
export default {
  name: "DrgCatalogModal",
  mixins: [catalogFieldConfig],
  components: {
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
        sm: { span: 19 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        versionCode: { rules: [{ required: true, message: '请输入版本编号!', validator: 'click' }, { validator: this.isExistName }] },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: "/drg/drgCatalog/add",
        edit: "/drg/drgCatalog/edit",
        list: "/drg/drgCatalog/list",
        isExistName:"/drg/drgCatalog/isExistName",
      },
      mdcCatalogList:[],
      adrgCatalogList:[],
      otherCatalogList:[],

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
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'versionCode','versionName','remark'))
        if(this.mdcCatalogVField.includes(this.model.catalogType)) {
          this.form.setFieldsValue(pick(this.model, 'mdcCatalogV'))
        }
        if(this.adrgCatalogVField.includes(this.model.catalogType)) {
          this.form.setFieldsValue(pick(this.model, 'adrgCatalogV'))
        }
        if(this.icd10VField.includes(this.model.catalogType)) {
          this.form.setFieldsValue(pick(this.model, 'icd10V'))
        }
        if(this.icd9VField.includes(this.model.catalogType)) {
          this.form.setFieldsValue(pick(this.model, 'icd9V'))
        }
        if(this.model.catalogType=='DRG_V'){
          this.form.setFieldsValue(pick(this.model, 'mdcInfoV','adrgListV','mccInfoV','ccInfoV','excludeInfoV','surgeryInfoV'))
        }
      });

      if(this.mdcCatalogVField.includes(this.model.catalogType)) {
        this.getCatalogList('MDC_V')
      }
      if(this.adrgCatalogVField.includes(this.model.catalogType)) {
        this.getCatalogList('ADRG_V')
      }
      if(this.model.catalogType=='DRG_V') {
        this.getCatalogList('|MDC_INFO_V|ADRG_LIST_V|MCC_INFO_V|CC_INFO_V|EXCLUDE_INFO_V|SURGERY_INFO_V')
      }

    },
    //获取目录版本列表
    getCatalogList(catalogType){
      getAction(this.url.list, {catalogType,pageSize:99999,status:'1',column:'versionCode',order: 'desc'}).then((res) => {
        if (res.success) {
          if(catalogType=='MDC_V'){
            this.mdcCatalogList = res.result.records
          }else if(catalogType=='ADRG_V'){
            this.adrgCatalogList = res.result.records
          }else{
            this.otherCatalogList =  res.result.records
          }
        }else{
          this.$message.warning(res.message);
        }
      })
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
      let param = {versionCode:value,catalogType:this.model.catalogType,id:this.model.id}
      getAction(this.url.isExistName,param,'get').then((res) => {
        if (res.success) {
          callback()
        } else {
          callback("该版本编号已存在!")
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
