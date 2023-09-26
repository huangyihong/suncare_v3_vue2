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
                label="流水ID">
                <a-input-number :min="0" :step="1" v-decorator="['orderId', {initialValue: 1,...validatorRules.orderId}]"  />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品编码">
                <a-input placeholder="请输入产品编码" v-decorator="['productcode', validatorRules.productcode]" :readOnly="!!model.id"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品名称">
                <a-input placeholder="请输入产品名称" v-decorator="['productname', validatorRules.productname]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="商品名称">
                <a-input placeholder="请输入商品名称" v-decorator="['brandname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规则型号编码">
                <a-input placeholder="请输入规则型号编码" v-decorator="['specificaioncode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规则型号">
                <a-input placeholder="请输入规则型号" v-decorator="['specificaion', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否为包类/组套类产品">
                <other-dict-select-tag  placeholder="请选择是否为包类/组套类产品" v-model="isPackageSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="产品描述" style="height:30px">
                <a-textarea placeholder="请输入产品描述" v-decorator="['productdiscription', {}]" :rows="3" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品父级分类编码">
                <a-input placeholder="请输入产品父级分类编码" v-decorator="['equipmentParentcode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品父级分类名称">
                <a-input placeholder="产品父级分类名称" v-decorator="['equipmentParentname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="预期用途">
                <a-input placeholder="请输入预期用途" v-decorator="['intendeduse', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品货号或编号">
                <a-input placeholder="产品货号或编号" v-decorator="['productArtno', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗器械唯一标识编码体系名称">
                <a-input placeholder="医疗器械唯一标识编码体系名称" v-decorator="['codingsyetemname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="最小销售单元中使用单元的数量">
                <a-input-number :min="0" :step="1" placeholder="请输入最小销售单元中使用单元的数量" v-decorator="['unitsnumber', {initialValue: 1}]"  />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否有本体直接标识">
                <other-dict-select-tag  placeholder="请选择是否有本体直接标识" v-model="isDirectIdentifySelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="本体产品标识与最小销售单元产品标识是否一致">
                <other-dict-select-tag  placeholder="请选择本体产品标识与最小销售单元产品标识是否一致" v-model="isSameSaleIdentifySelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="本体产品标识">
                <a-input placeholder="本体产品标识" v-decorator="['directIdentifyCode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="器械类别">
                <a-select placeholder="请选择器械类别" v-decorator="['equipmentclassification', {} ]" >
                  <a-select-option value="器械">器械</a-select-option>
                  <a-select-option value="体外诊断试剂">体外诊断试剂</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="原分类编码">
                <a-input placeholder="请输入原分类编码" v-decorator="['equipmentClassOldcode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="原分类名称">
                <a-input placeholder="请输入原分类名称" v-decorator="['equipmentClassOldname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="分类编码">
                <a-input placeholder="请输入分类编码" v-decorator="['equipmentClassCode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="分类名称">
                <a-input placeholder="请输入分类名称" v-decorator="['equipmentClassName', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗器械注册人/备案人编码">
                <a-input placeholder="请输入医疗器械注册人/备案人编码" v-decorator="['registrantcode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗器械注册人/备案人名称">
                <a-input placeholder="请输入医疗器械注册人/备案人名称" v-decorator="['registrantname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗器械注册人/备案人英文名称">
                <a-input placeholder="请输入医疗器械注册人/备案人英文名称" v-decorator="['registrantenglishname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="注册证编号或者备案凭证编号">
                <a-input placeholder="请输入注册证编号或者备案凭证编号" v-decorator="['sfdaNo', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产品类别">
                <other-dict-select-tag  placeholder="请选择产品类别" v-model="productClassSelect"  dictEname="Product_Class" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否标记为一次性使用">
                <other-dict-select-tag  placeholder="请选择是否标记为一次性使用" v-model="isDisposableSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="最大重复使用次数">
                <a-input-number :min="0" :step="1" placeholder="请输入最大重复使用次数" v-decorator="['maxreusetimes', {}]"  />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="是否为无菌包装">
                <other-dict-select-tag  placeholder="请选择是否为无菌包装" v-model="isSterilepackageSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医保编码">
                <a-input placeholder="请输入医保编码" v-decorator="['medicalinsurancecode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="特殊储存或操作条件" style="height:30px">
                <a-textarea placeholder="请输入特殊储存或操作条件" v-decorator="['storageOperateDescrip', {}]" :rows="3" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="特殊尺寸说明" style="height:30px">
                <a-textarea placeholder="请输入特殊尺寸说明" v-decorator="['sizedescrip', {}]" :rows="3" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="主键编号">
                <a-input placeholder="请输入主键编号" v-decorator="['primarykeycode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="公开的版本号">
                <a-input placeholder="请输入公开的版本号" v-decorator="['publicversionno', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="NMPA版本的发布时间">
                <!--<a-input placeholder="请输入NMPA版本的发布时间"  v-decorator="['nmpaversiontime', {}]" readOnly/>-->
                <a-date-picker placeholder="请输入NMPA版本的发布时间" show-time
                               format="YYYY-MM-DD HH:mm:ss" v-decorator="['nmpaversiontime', {}]"  :readOnly="readonly"/>
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
                <a-textarea placeholder="请输入备注" v-decorator="['commentnote', {}]" :rows="3" :readOnly="readonly"/>
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
  </a-drawer>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { CommonAddEditMixin } from './MedicalAuditLog/CommonAddEditMixin'
  import OtherDictSelectTag from "./OtherDictSelectTag"

  export default {
    name: "MedicalEquipmentModal",
    mixins:[CommonAddEditMixin],
    components: {
      OtherDictSelectTag
    },
    data () {
      return {
        title:"操作",
        drawerWidth:1000,
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
          orderId:{rules: [{ required: true, message: '请输入流水Id!' }]},
          productcode:{rules: [{ required: true, message: '请输入产品编码!' }]},
          productname:{rules: [{ required: true, message: '请输入产品名称!' }]},
        },
        url: {
          add: "/config/medicalEquipment/add",
          edit: "/config/medicalEquipment/edit",
          isExistName: "/config/medicalEquipment/isExistName",
          del: "/config/medicalEquipment/delMedicalEquipment",
          delAll: "/config/medicalEquipment/delAllMedicalEquipment",
        },
        isPackageSelect:{},
        isDirectIdentifySelect:{},
        isSameSaleIdentifySelect:{},
        productClassSelect:{},
        isDisposableSelect:{},
        isSterilepackageSelect:{},
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
          this.form.setFieldsValue(pick(this.model,'orderId','productcode','productname','brandname','specificaioncode','specificaion','productdiscription','equipmentParentcode','equipmentParentname','intendeduse','productArtno','codingsyetemname','unitsnumber',
            'directIdentifyCode','equipmentclassification','equipmentClassOldcode','equipmentClassOldname','equipmentClassCode','equipmentClassName','registrantcode','registrantname','registrantenglishname','sfdaNo','maxreusetimes','medicalinsurancecode',
            'storageOperateDescrip','sizedescrip','primarykeycode','publicversionno','commentnote',
            'state','auditResult','actionType','createStaff','createStaffName','createReason','updateStaff','updateStaffName','updateReason','deleteStaff','deleteStaffName','deleteReason','actionStaff','actionStaffName','auditStaff','auditStaffName','auditOpinion'))
		      this.setSelectValue();
          //时间格式化
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({deleteTime:this.model.deleteTime?moment(this.model.deleteTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({nmpaversiontime:this.model.nmpaversiontime?moment(this.model.nmpaversiontime):null})
        });
      },
      //保存
      saveOrUpdate(){
        const that = this;
        this.getSelectText();
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            values.productcode = values.productcode.trim()
            values.productname = values.productname.trim()
            let param = {};
            param.productcode = that.form.getFieldValue('productcode').trim();
            param.id = that.model.id;
            values.nmpaversiontime = values.nmpaversiontime?values.nmpaversiontime.format("YYYY-MM-DD HH:mm:ss"):null
            getAction(this.url.isExistName,param,'get').then((data) => {
              if (data.success) {
                if(data.result){
                  that.$message.warning('该产品编码已存在，请修改为其他产品编码');
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
        this.isPackageSelect = {key:this.model.isPackageCode?this.model.isPackageCode:''}
        this.isDirectIdentifySelect = {key:this.model.isDirectIdentifyCode?this.model.isDirectIdentifyCode:''}
        this.isSameSaleIdentifySelect = {key:this.model.isSameSaleIdentifyCode?this.model.isSameSaleIdentifyCode:''}
        this.productClassSelect = {key:this.model.productClassCode?this.model.productClassCode:''}
        this.isDisposableSelect = {key:this.model.isDisposableCode?this.model.isDisposableCode:''}
        this.isSterilepackageSelect = {key:this.model.isSterilepackageCode?this.model.isSterilepackageCode:''}
        this.chargeClassSelect = {key:this.model.chargeClassCode?this.model.chargeClassCode:''}
      },
      getSelectText(){
        if(this.isPackageSelect){
          this.model.isPackageCode = this.isPackageSelect.key
          if(this.isPackageSelect.label){
            this.model.isPackageName = this.isPackageSelect.label
          }
        }
        if(this.isDirectIdentifySelect){
          this.model.isDirectIdentifyCode = this.isDirectIdentifySelect.key
          if(this.isDirectIdentifySelect.label){
            this.model.isDirectIdentifyName = this.isDirectIdentifySelect.label
          }
        }
        if(this.isSameSaleIdentifySelect){
          this.model.isSameSaleIdentifyCode = this.isSameSaleIdentifySelect.key
          if(this.isSameSaleIdentifySelect.label){
            this.model.isSameSaleIdentifyName = this.isSameSaleIdentifySelect.label
          }
        }
        if(this.productClassSelect){
          this.model.productClassCode = this.productClassSelect.key
          if(this.productClassSelect.label){
            this.model.productClassName = this.productClassSelect.label
          }
        }
        if(this.isDisposableSelect){
          this.model.isDisposableCode = this.isDisposableSelect.key
          if(this.isDisposableSelect.label){
            this.model.isDisposableName = this.isDisposableSelect.label
          }
        }
        if(this.isSterilepackageSelect){
          this.model.isSterilepackageCode = this.isSterilepackageSelect.key
          if(this.isSterilepackageSelect.label){
            this.model.isSterilepackageName = this.isSterilepackageSelect.label
          }
        }
        if(this.chargeClassSelect){
          this.model.chargeClassCode = this.chargeClassSelect.key
          if(this.chargeClassSelect.label){
            this.model.chargeClassName = this.chargeClassSelect.label
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
  .ant-input-number{
    width:100%
  }
</style>