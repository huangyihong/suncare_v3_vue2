<template>
  <a-drawer
    :title="title"
    :width="1000"
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
              :label="`${titleBean.versionTitle}`" v-if="catalogBean.id">
              <a-input v-model="catalogBean.versionName" disabled />
            </a-form-item>
          </a-col>
          <a-col :md="catalogBean.catalogType=='DRG_V'?12:24" :sm="24">
            <a-form-item
              :labelCol="catalogBean.catalogType=='DRG_V'?labelCol2:labelCol"
              :wrapperCol="catalogBean.catalogType=='DRG_V'?wrapperCol2:wrapperCol"
              label="MDC目录版本" v-if="mdcCatalogVField.includes(catalogBean.catalogType)">
              <a-input v-model="catalogBean.mdcCatalogVText" disabled/>
            </a-form-item>
          </a-col>
          <a-col :md="catalogBean.catalogType=='DRG_V'?12:24" :sm="24">
            <a-form-item
              :labelCol="catalogBean.catalogType=='DRG_V'?labelCol2:labelCol"
              :wrapperCol="catalogBean.catalogType=='DRG_V'?wrapperCol2:wrapperCol"
              label="ADRG目录版本" v-if="adrgCatalogVField.includes(catalogBean.catalogType)">
              <a-input v-model="catalogBean.adrgCatalogVText" disabled/>
            </a-form-item>
          </a-col>
          <templat v-if="catalogBean.catalogType=='DRG_V'">
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="MDC主诊表版本">
                <a-input v-model="catalogBean.mdcInfoVText" disabled/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="ADRG列表版本">
                <a-input v-model="catalogBean.adrgListVText" disabled/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="MCC版本">
                <a-input v-model="catalogBean.mccInfoVText" disabled/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="CC版本">
                <a-input v-model="catalogBean.ccInfoVText" disabled/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="排除表版本">
                <a-input v-model="catalogBean.excludeInfoVText" disabled/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术室手术版本">
                <a-input v-model="catalogBean.surgeryInfoVText" disabled/>
              </a-form-item>
            </a-col>
          </templat>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="ICD10版本" v-if="icd10VField.includes(catalogBean.catalogType)">
              <a-input v-model="catalogBean.icd10V_dictText" disabled/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="ICD9版本" v-if="icd9VField.includes(catalogBean.catalogType)">
              <a-input v-model="catalogBean.icd9V_dictText" disabled/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="MDC目录" v-if="catalogBean.mdcCatalogV">
              <a-select
                show-search
                allowClear
                v-decorator="['mdcCatalogCode', validatorRules.required]"
                placeholder="请选择MDC目录"
                :filter-option="filterOption"
                :dropdownMatchSelectWidth="false"
                @change="selectMdcCatalogCode"
              >
                <a-select-option  v-for="(item,index) in mdcDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="ADRG目录" v-if="catalogBean.adrgCatalogV">
              <a-select
                show-search
                allowClear
                v-decorator="['adrgCatalogCode', validatorRules.required]"
                placeholder="请选择ADRG目录"
                :filter-option="filterOption"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option  v-for="(item,index) in adrgDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
          <template v-if="catalogBean.catalogType=='ADRG_LIST_V'">
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="关联诊断组1">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['diagGroupCode1', {}]"
                  placeholder="请选择关联诊断组1"
                  :filter-option="filterOption"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in mdcDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="疾病编码1">
                <a-input placeholder="请输入疾病编码1" v-decorator="['diagCode1', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="疾病名称1">
                <a-input placeholder="请输入疾病名称1" v-decorator="['diagName1', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="关联诊断组2">
                <a-select
                  show-search
                  allowClear
                  v-decorator="['diagGroupCode2', {}]"
                  placeholder="请选择关联诊断组2"
                  :filter-option="filterOption"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in mdcDetailList" :value="item.code" :key="item.code">({{item.code}}){{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="疾病编码2">
                <a-input placeholder="请输入疾病编码2" v-decorator="['diagCode2', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="疾病名称2">
                <a-input placeholder="请输入疾病名称2" v-decorator="['diagName2', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术或操作编码1">
                <a-input placeholder="请输入手术或操作编码1" v-decorator="['surgeryCode1', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术或操作名称1">
                <a-input placeholder="手术或操作名称1" v-decorator="['surgeryName1', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术或操作编码2">
                <a-input placeholder="请输入手术或操作编码2" v-decorator="['surgeryCode2', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术或操作名称2">
                <a-input placeholder="手术或操作名称2" v-decorator="['surgeryName2', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术或操作编码3">
                <a-input placeholder="请输入手术或操作编码3" v-decorator="['surgeryCode3', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="手术或操作名称3">
                <a-input placeholder="手术或操作名称3" v-decorator="['surgeryName3', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="分组条件">
                <a-select
                  show-search
                  allowClear
                  labelInValue
                  v-decorator="['conditionLabel', validatorRules.requiredOnly]"
                  placeholder="请选择分组条件"
                  :filter-option="filterOption"
                  :dropdownMatchSelectWidth="false"
                >
                  <a-select-option  v-for="(item,index) in conditionDetailList" :value="item.code" :key="item.code">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <template v-else>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :label="`${titleBean.codeNameTitle}编码`">
                <a-input placeholder="请输入编码" v-decorator="['code', validatorRules.required]" :readOnly="!!model.id"  @blur="(e)=>getDrgRuleLimitesByCode(e.target.value)"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :label="`${titleBean.codeNameTitle}名称`">
                <a-input placeholder="请输入名称" v-decorator="['name', validatorRules.required]"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="排除内容" v-if="excludeContentField.includes(catalogBean.catalogType)">
              <a-input placeholder="请输入排除内容" v-decorator="['excludeContent', {}]"/>
            </a-form-item>
          </a-col>
          <template v-if="catalogBean.catalogType=='DRG_V'">
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否判断次要诊断">
                <a-radio-group name=""  v-decorator="['validSecondDiag',{'initialValue':'0'} ]">
                  <a-radio :value="'1'">是</a-radio>
                  <a-radio :value="'0'">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否有效MCC">
                <a-radio-group name=""  v-decorator="['validMcc',{'initialValue':'0'} ]">
                  <a-radio :value="'1'">是</a-radio>
                  <a-radio :value="'0'">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否有效CC">
                <a-radio-group name=""  v-decorator="['validCc',{'initialValue':'0'} ]">
                  <a-radio :value="'1'">是</a-radio>
                  <a-radio :value="'0'">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="model.catalogType=='CONDITION_V'">

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="诊断数量">
                <a-input-number placeholder="请输入诊断数量" style="width: 200px" v-decorator="[ 'diagNum',validatorRules.initNumberReg]" max="3"/>
              </a-form-item>
            </a-col>


            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="手术1">
                <a-radio-group name=""  v-decorator="['validSurgery1',{'initialValue':'0'} ]" @change="changeValidSurgery1">
                  <a-radio :value="'1'">是</a-radio>
                  <a-radio :value="'0'">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="手术2">
                <a-radio-group name=""  v-decorator="['validSurgery2',{'initialValue':'0'} ]" @change="changeValidSurgery2">
                  <a-radio :value="'1'" :disabled="model.validSurgery1=='0'||!model.validSurgery1">是</a-radio>
                  <a-radio :value="'0'">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="手术3">
                <a-radio-group name=""  v-decorator="['validSurgery3',{'initialValue':'0'} ]">
                  <a-radio :value="'1'" :disabled="model.validSurgery1=='0'||!model.validSurgery1||model.validSurgery2=='0'||!model.validSurgery2">是</a-radio>
                  <a-radio :value="'0'">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="model.catalogType=='ADRG_V'||model.catalogType=='DRG_V'">
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="">
                <a-checkbox :checked="model.hasCondition=='1'" @change="checkHasCondition" style="padding-left: 60px">
                  分组条件限制
                </a-checkbox>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-spin :spinning="drgRuleLimitesLoading">
              <condition-form v-if="model.hasCondition=='1'" ref="conditionForm"></condition-form>
              </a-spin>
            </a-col>

          </template>
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
import { filterOption } from '../mixins/filterOption'

import ConditionForm from '../plugin/ConditionForm'
export default {
  name: "DrgCatalogDetailModal",
  mixins: [catalogFieldConfig],
  components: {
    ConditionForm
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
      labelCol3: {
        span:2
      },
      wrapperCol3: {
        span: 22
      },
      validatorRules: {
        required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
        requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        initNumberReg: { rules: [{ pattern: /^[1-9]+\d*$/,trigger: "blur", message: "只能输入整数"}] },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: "/drg/drgCatalogDetail/add",
        edit: "/drg/drgCatalogDetail/edit",
        list: "/drg/drgCatalogDetail/list",
        getCatalogBean: "/drg/drgCatalog/list",
        treeList:"/drg/drgCatalogDetail/getTreeList",
        drgRuleLimites:'/drg/drgRuleLimites/queryByCatalogCode',
      },
      catalogBean:{},
      titleBean:{},
      mdcDetailList:[],
      adrgDetailList:[],
      conditionDetailList:[],
      drgRuleLimitesLoading:false,

    }
  },
  created () {
  },
  methods: {
    filterOption,
    add () {
      this.edit({});
    },
    async edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      if(this.model.catalogId){
        await this.getCatalogBean(this.model.catalogId)
        await this.getMdcCatalogDetailList(this.catalogBean.mdcCatalogV)
        await this.getAdrgCatalogDetailList(this.catalogBean.adrgCatalogV,this.model.mdcCatalogCode)
        this.getconditionCatalogDetailList()
        this.model.catalogType = this.catalogBean.catalogType
      }

      if(this.model.id&&this.model.hasCondition=='1'&&(this.model.catalogType=='DRG_V'||this.model.catalogType=='ADRG_V')){
        this.getDrgRuleLimites(this.model.catalogType,this.model.code,this.catalogBean.versionCode)
      }
      if(!this.model.id){
        this.$set(this.model,'hasCondition','0')
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'code','name','mdcCatalogCode','adrgCatalogCode','remark'))
        if(this.model.catalogType=='ADRG_LIST_V'){
          this.model.conditionLabel = {key:this.model.conditionCode,label:this.model.conditionName}
          this.form.setFieldsValue(pick(this.model,'diagGroupCode1','diagCode1','diagName1'
            ,'diagGroupCode2','diagCode2','diagName2'
            ,'surgeryCode1','surgeryCode2','surgeryCode3'
            ,'surgeryName1','surgeryName2','surgeryName3'
            ,'conditionLabel'
          ))
        }
        if(this.model.catalogType=='DRG_V'){
          this.form.setFieldsValue(pick(this.model,'validSecondDiag','validMcc','validCc'))
        }
        if(this.model.catalogType=='CONDITION_V'){
          this.form.setFieldsValue(pick(this.model,'diagNum','validSurgery1','validSurgery2','validSurgery3'))
        }
        if(this.excludeContentField.includes(this.model.catalogType)) {
          this.form.setFieldsValue(pick(this.model, 'excludeContent'))
        }
      });
    },
    //获取目录版本
    async getCatalogBean(catalogId){
      this.catalogBean = {};
      await getAction(this.url.getCatalogBean, {id:catalogId}).then((res) => {
        if (res.success) {
          if(res.result.records.length>0){
            this.catalogBean = res.result.records[0]
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //获取目录列表
    async getMdcCatalogDetailList(mdcCatalogV){
      if(!mdcCatalogV){
        return
      }
      await getAction(this.url.treeList, {mdcCatalogV}).then((res) => {
        if (res.success) {
          this.mdcDetailList = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    async getAdrgCatalogDetailList(adrgCatalogV,mdcCatalogCode){
      if(!adrgCatalogV||!mdcCatalogCode){
        return
      }
      await getAction(this.url.treeList, {adrgCatalogV,mdcCatalogCode}).then((res) => {
        if (res.success) {
          this.adrgDetailList = res.result
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //获取条件信息
    getconditionCatalogDetailList(){
      getAction(this.url.list, {catalogType:'CONDITION_V',examineStatus:'1',pageSize:99999,}).then((res) => {
        if (res.success) {
          this.conditionDetailList = res.result.records
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    selectMdcCatalogCode(val){
      this.form.setFieldsValue({adrgCatalogCode:undefined})
      this.getAdrgCatalogDetailList(this.catalogBean.adrgCatalogV,val)
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
         // that.confirmLoading = true;
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
          formData.examineStatus = '0'
          if(formData.conditionLabel){
            formData.conditionName = formData.conditionLabel.label
            formData.conditionCode = formData.conditionLabel.key
          }
          if(this.model.hasCondition=='1'&&(this.model.catalogType=='ADRG_V'||this.model.catalogType=='DRG_V')){
            formData.hasCondition = '1'
            //分组条件
            if(this.$refs.conditionForm.validate()){
              return
            }
            let excelTableData = this.$refs.conditionForm.excelTableData
            excelTableData.forEach(function(vo,index){
              vo.seq = index+1
              vo.catalogCode = formData.code
              vo.catalogType = that.model.catalogType
              vo.versionCode = that.catalogBean.versionCode
            })
            formData.drgRuleLimites = JSON.stringify(excelTableData)
          }else{
            formData.hasCondition = '0'
          }

          console.log(formData)
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
    changeValidSurgery1(e){
      this.model.validSurgery1 = e.target.value
      if(this.model.validSurgery1=='0'){
        this.model.validSurgery2 = '0'
        this.model.validSurgery3 = '0'
        this.form.setFieldsValue({validSurgery2: '0',validSurgery3: '0'})
      }

    },
    changeValidSurgery2(e){
      this.model.validSurgery2 = e.target.value
      if(this.model.validSurgery2=='0'){
        this.model.validSurgery3 = '0'
        this.form.setFieldsValue({validSurgery3: '0'})
      }
    },

    //限制条件是否显示
    checkHasCondition(e){
      this.model.hasCondition = e.target.checked?'1':'0'

      let catalogCode = this.form.getFieldValue('code')
      this.getDrgRuleLimites(this.model.catalogType,catalogCode,this.catalogBean.versionCode)
    },

    //获取限制条件
    getDrgRuleLimites(catalogType,catalogCode,versionCode){
      if(catalogCode&&this.model.hasCondition=='1'&&(this.model.catalogType=='ADRG_V'||this.model.catalogType=='DRG_V')) {
        this.drgRuleLimitesLoading = true
        getAction(this.url.drgRuleLimites, {catalogType, catalogCode, versionCode}).then((res) => {
          if (res.success) {
            let drgRuleLimites = res.result
            if (drgRuleLimites.length > 0) {
              this.$refs.conditionForm.excelTableData = drgRuleLimites
            }else{
              this.$refs.conditionForm.clearExcelTable()
            }
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.drgRuleLimitesLoading = false;
        })
      }
    },
    getDrgRuleLimitesByCode(value) {
      let catalogCode = value
      this.getDrgRuleLimites(this.model.catalogType,catalogCode,this.catalogBean.versionCode)
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
