<template>
  <a-drawer
      :title="title"
      :maskClosable="true"
      :width="drawerWidth"
      placement="right"
      :closable="true"
      @close="visible = false"
      :visible="visible">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" >
        <a-row :gutter="24">
          <template v-if="model.fntype!=='batchDelete'">
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品代码">
                <a-input placeholder="请输入药品代码" v-decorator="['code', validatorRules.code]" :readOnly="!!model.id"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品名称">
                <a-input placeholder="请输入药品名称" v-decorator="['name', validatorRules.name]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品通用名编码" >
                <a-input placeholder="请输入药品通用名编码" v-decorator="['generalCode', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品通用名" >
                <a-input placeholder="请输入药品通用名" v-decorator="['generalName', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品商品名称" >
                <a-input placeholder="请输入药品商品名称" v-decorator="['productName', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药品英文名称" >
                <a-input placeholder="请输入药品英文名称" v-decorator="['productEname', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="批准文号" >
                <a-input placeholder="请输入批准文号" v-decorator="['approveNumber', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="剂型">
                <other-dict-select-tag  placeholder="请选择剂型" v-model="dosageCodeSelect"   dictEname="DosageForm" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="包装">
                <a-input placeholder="请输入包装" v-decorator="[ 'packageNum',{}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规格" >
                <a-input placeholder="请输入规格" v-decorator="['specification', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="最小包装单位">
                <other-dict-select-tag  placeholder="请选择最小包装单位" v-model="packageUnitCodeSelect"  dictEname="pack_unit" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="使用单位">
                <other-dict-select-tag  placeholder="请选择使用单位" v-model="useUnitCodeSelect"  dictEname="dosage_unit" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="包装使用转换率" >
                <a-input placeholder="请输入包装使用转换率" v-decorator="['packageUseRate', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="最小制剂单位">
                <other-dict-select-tag  placeholder="请选择最小制剂单位" v-model="preparationUnitCodeSelect"  dictEname="dosage_unit" :labelInValue="true" :readOnly="readonly"/>

              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="国家医保药品编码" >
                <a-input placeholder="请输入国家医保药品编码" v-decorator="['ybCode', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="国家医保药品名称" >
                <a-input placeholder="请输入国家医保药品名称" v-decorator="['ybName', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>


            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="生产企业名称">
                <!--<other-dict-select-tag  placeholder="请选择生产企业名称" v-model="enterpriseCodeSelect"  dictEname="manufactor" :labelInValue="true" :readOnly="readonly"/>-->
                <a-input-group compact>
                  <a-input v-model="enterpriseCodeAndName" style="width: calc(100% - 90px)"/>
                  <a-button type="primary" @click="openSelectOtherDict('enterprise')" icon="search">选择</a-button>
                </a-input-group>
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="药理级别">
                <other-dict-cascader  @change="onChangeTypeCode" placeholder="请选择药理级别" dictEname="pharm_level" :defaultValue="typeCode"/>
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="ATC药品级别">
                <std-atc-cascader  @change="onChangeActCode" placeholder="请选择ATC药品级别" state="1" :defaultValue="actCode"/>
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="国家医保分类">
                <other-dict-cascader  @change="onChangeMedicareCode" placeholder="请选择国家医保分类" dictCname="国家医保分类" :defaultValue="medicareCode"/>
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="剂型级别编码">
                <!--<other-dict-select-tag  placeholder="请选择剂型级别" v-model="dosageLevelCodeSelect"  dictEname="DosageForm_Level" :labelInValue="true" :readOnly="readonly"/>-->
                <a-input-group compact>
                <a-input v-model="dosageLevelCodeAndName" style="width: calc(100% - 90px)"/>
                <a-button type="primary" @click="openSelectStdAtc()" icon="search">选择</a-button>
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规格级别">
                <other-dict-select-tag  placeholder="请选择规格级别" v-model="specificationLevelCodeSelect"  dictEname="spec_level" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="厂家级别">
                <other-dict-select-tag  placeholder="请选择厂家级别" v-model="factoryLevelCodeSelect"  dictEname="factory_level" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="收费类别">
                <other-dict-select-tag  placeholder="请选择收费类别" v-model="chargeClassSelect"  dictEname="chargeClass" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="备注" style="height:30px">
                <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" :rows="3" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
          <template v-if="!disableSubmit">
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="新增原因" style="height:30px">
              <a-textarea placeholder="请输入新增原因" v-decorator="['createReason', {}]" :rows="3" :readOnly="!!model.id"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="新增人">
              <a-input placeholder="请输入新增人" v-decorator="['createStaffName', {}]" readOnly/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="新增时间">
              <a-input placeholder="请输入新增时间" v-decorator="['createTime', {}]" readOnly/>
            </a-form-item>
          </a-col>

          <template v-if="model.fntype==='update'">
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="修改原因" style="height:30px">
                <a-textarea placeholder="请输入修改原因" v-decorator="['updateReason', {}]" :rows="3"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="修改人">
                <a-input placeholder="请输入修改人" v-decorator="['updateStaffName', {}]" readOnly/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="修改时间">
                <a-input placeholder="请输入修改时间" v-decorator="['updateTime', {}]" readOnly/>
              </a-form-item>
            </a-col>
          </template>
          </template>
          </template>
          <template v-if="model.fntype==='delete'||model.fntype==='batchDelete'">
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="删除原因" style="height:30px">
                <a-textarea placeholder="请输入删除原因" v-decorator="['deleteReason', {}]" :rows="3"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="删除人">
                <a-input placeholder="请输入删除人" v-decorator="['deleteStaffName', {}]" readOnly/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="删除时间">
                <a-input placeholder="请输入删除时间" v-decorator="['deleteTime', {}]" readOnly/>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>

    <select-other-dict ref="selectOtherDictRef" @ok="selectOtherDict" :fixedParam="otherDictFilters"></select-other-dict>
    <select-std-atc ref="selectStdAtcRef" @ok="selectStdAtc" :fixedParam="stdAtcFilters"></select-std-atc>
  </a-drawer>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { CommonAddEditMixin } from './MedicalAuditLog/CommonAddEditMixin'
  import OtherDictSelectTag from "./OtherDictSelectTag"
  import OtherDictCascader from "./OtherDictCascader"
  import SelectOtherDict from "@/pages/selectSingle/MedicalOtherDict"
  import StdAtcCascader from "./StdAtcCascader"
  import SelectStdAtc from "@/pages/selectSingle/MedicalStdAtc"
  export default {
    name: "MedicalChineseDrugModal",
    mixins:[CommonAddEditMixin],
    components: {
      OtherDictSelectTag,
      OtherDictCascader,
      SelectOtherDict,
      StdAtcCascader,
      SelectStdAtc
    },
    data () {
      return {
        title:"操作",
        drawerWidth:800,
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

        validatorRules:{
          code:{rules: [{ required: true, message: '请输入药品代码!' }]},
          name:{rules: [{ required: true, message: '请输入药品名称!' }]},
        },
        url: {
          add: "/config/medicalDrug/add",
          edit: "/config/medicalDrug/edit",
          isExistName: "/config/medicalDrug/isExistName",
          del: "/config/medicalDrug/delMedicalDrug",
          delAll: "/config/medicalDrug/delAllMedicalDrug",
        },
        dosageCodeSelect:{},
//        enterpriseCodeSelect:{},
//        dosageLevelCodeSelect:{},
        packageUnitCodeSelect:{},
        useUnitCodeSelect:{},
        preparationUnitCodeSelect:{},
        specificationLevelCodeSelect:{},
        factoryLevelCodeSelect:{},
        typeCode:[],
        actCode:[],
        medicareCode:[],
        otherDictFilters:{dictEname:'DrugManufacturer',state:'1'},
        stdAtcFilters:{state:'1'},
        dosageLevelCodeAndName:'',//剂型级别名称和编码
        enterpriseCodeAndName:'',//生产企业名称和生产企业编码
        openSelectDictType:'dosageLevel',
        chargeClassSelect:{},
      }
    },
    beforeMount(){

    },
    methods: {
      //字段赋值
      edit (record) {
        this.beforSetEdit(record);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'code','name','generalCode','generalName','productName','productEname','approveNumber','packageNum','packageUseRate','ybCode','ybName','specification','dosageLevelCode','dosageLevel','remark','state','auditResult','actionType','createStaff','createStaffName','createReason','updateStaff','updateStaffName','updateReason','deleteStaff','deleteStaffName','deleteReason','actionStaff','actionStaffName','auditStaff','auditStaffName','auditOpinion'))
		      this.setSelectValue();
          //时间格式化
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({deleteTime:this.model.deleteTime?moment(this.model.deleteTime).format("YYYY-MM-DD HH:mm:ss"):null})
        });
        this.setDosageLevelCodeAndName()
        this.setEnterpriseCodeAndName()
        this.form.setFieldsValue({'dosageLevelCodeAndName':this.dosageLevelCodeAndName,'enterpriseCodeAndName':this.enterpriseCodeAndName})
        //this.form.setFieldsValue({'enterpriseCodeAndName':this.enterpriseCodeAndName})
      },
      //保存
      saveOrUpdate(){
        const that = this;
        this.getSelectText();
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            values.code = values.code.trim()
            values.name = values.name.trim()
            let param = {};
            param.code = that.form.getFieldValue('code').trim();
            param.id = that.model.id;
            getAction(this.url.isExistName,param,'get').then((data) => {
              if (data.success) {
                if(data.result){
                  that.$message.warning('该药品代码已存在，请修改为其他代码');
                }else{
                  that.save(values);
                }
              }else{
                that.$message.warning(data.message);
              }
            })
          }
        })
      },

      setSelectValue(){
        this.dosageCodeSelect ={key:this.model.dosageCode?this.model.dosageCode:''};
        //this.enterpriseCodeSelect ={key:this.model.enterpriseCode?this.model.enterpriseCode:''};
        //this.dosageLevelCodeSelect ={key:this.model.dosageLevelCode?this.model.dosageLevelCode:''};
        this.packageUnitCodeSelect ={key:this.model.packageUnitCode?this.model.packageUnitCode:''};
        this.useUnitCodeSelect ={key:this.model.useUnitCode?this.model.useUnitCode:''};
        this.preparationUnitCodeSelect ={key:this.model.preparationUnitCode?this.model.preparationUnitCode:''};
        this.specificationLevelCodeSelect ={key:this.model.specificationLevelCode?this.model.specificationLevelCode:''};
        this.factoryLevelCodeSelect ={key:this.model.factoryLevelCode?this.model.factoryLevelCode:''};
        this.typeCode = [this.model.type1Code,this.model.type2Code,this.model.type3Code,this.model.type4Code,this.model.type5Code];
        this.actCode = [this.model.act1Code,this.model.act2Code,this.model.act3Code,this.model.act4Code,this.model.act5Code];
        this.medicareCode = [this.model.medicare1Code,this.model.medicare2Code,this.model.medicare3Code,this.model.medicare4Code,this.model.medicare5Code];
        this.chargeClassSelect = {key:this.model.chargeClassCode?this.model.chargeClassCode:''}
      },
      getSelectText(){
        if(this.dosageCodeSelect){
          this.model.dosageCode = this.dosageCodeSelect.key
          if(this.dosageCodeSelect.label){
            this.model.dosage = this.dosageCodeSelect.label
          }
        }
        /*if(this.enterpriseCodeSelect){
          this.model.enterpriseCode = this.enterpriseCodeSelect.key
          if(this.enterpriseCodeSelect.label) {
            this.model.enterprise = this.enterpriseCodeSelect.label
          }
        }*/
        /*if(this.dosageLevelCodeSelect){
          this.model.dosageLevelCode = this.dosageLevelCodeSelect.key
          if(this.dosageLevelCodeSelect.label) {
            this.model.dosageLevel = this.dosageLevelCodeSelect.label
          }
        }*/
        if(this.packageUnitCodeSelect){
          this.model.packageUnitCode = this.packageUnitCodeSelect.key
          if(this.packageUnitCodeSelect.label){
            this.model.packageUnit = this.packageUnitCodeSelect.label
          }
        }
        if(this.useUnitCodeSelect){
          this.model.useUnitCode = this.useUnitCodeSelect.key
          if(this.useUnitCodeSelect.label){
            this.model.useUnit = this.useUnitCodeSelect.label
          }
        }
        if(this.preparationUnitCodeSelect){
          this.model.preparationUnitCode = this.preparationUnitCodeSelect.key
          if(this.preparationUnitCodeSelect.label){
            this.model.preparationUnit = this.preparationUnitCodeSelect.label
          }
        }
        if(this.specificationLevelCodeSelect){
          this.model.specificationLevelCode = this.specificationLevelCodeSelect.key
          if(this.specificationLevelCodeSelect.label) {
            this.model.specificationLevel = this.specificationLevelCodeSelect.label
          }
        }
        if(this.factoryLevelCodeSelect){
          this.model.factoryLevelCode = this.factoryLevelCodeSelect.key
          if(this.factoryLevelCodeSelect.label) {
            this.model.factoryLevel = this.factoryLevelCodeSelect.label
          }
        }
        if(this.chargeClassSelect){
          this.model.chargeClassCode = this.chargeClassSelect.key
          if(this.chargeClassSelect.label){
            this.model.chargeClassName = this.chargeClassSelect.label
          }
        }
      },
      onChangeTypeCode(value,selectedOptions) {
        let that = this;
        for(let i=1;i<6;i++){
          that.model['type'+i+'Code']="";
          that.model['type'+i+'Name']="";
        }
        selectedOptions.forEach(function(item,index,arr){
          that.model['type'+(index+1)+'Code']=item.value;
          that.model['type'+(index+1)+'Name']=item.label;
        });
      },
      onChangeActCode(value,selectedOptions) {
        let that = this;
        for(let i=1;i<6;i++){
          that.model['act'+i+'Code']="";
          that.model['act'+i+'Name']="";
        }
        selectedOptions.forEach(function(item,index,arr){
          that.model['act'+(index+1)+'Code']=item.value;
          that.model['act'+(index+1)+'Name']=item.label;
        });
      },
      onChangeMedicareCode(value,selectedOptions) {
        let that = this;
        for(let i=1;i<6;i++){
          that.model['medicare'+i+'Code']="";
          that.model['medicare'+i+'Name']="";
        }
        selectedOptions.forEach(function(item,index,arr){
          that.model['medicare'+(index+1)+'Code']=item.value;
          that.model['medicare'+(index+1)+'Name']=item.label;
        })
      },
      openSelectOtherDict(type) {
        this.openSelectDictType = type
        if(type=='enterprise'){
          this.otherDictFilters.dictEname = 'DrugManufacturer'
          this.$refs.selectOtherDictRef.show('选择药品生产企业')
        }
      },
      selectOtherDict({ code, name }) {
        if(this.openSelectDictType=='enterprise'){
          this.model.enterpriseCode = code
          this.model.enterprise = name
          this.setEnterpriseCodeAndName()
        }
      },
      openSelectStdAtc() {
        this.$refs.selectStdAtcRef.show('选择剂型级别')
      },
      selectStdAtc({ code, name }) {
        console.dir(name )
          this.model.dosageLevelCode = code
          this.model.dosageLevel = name
          this.setDosageLevelCodeAndName()
      },
      setDosageLevelCodeAndName(){
        if(this.model.dosageLevelCode){
          this.dosageLevelCodeAndName = this.model.dosageLevel+'('+this.model.dosageLevelCode+')'
        }
      },
      setEnterpriseCodeAndName(){
        if(this.model.enterprise){
          this.enterpriseCodeAndName = this.model.enterprise+'('+this.model.enterpriseCode+')'
        }
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