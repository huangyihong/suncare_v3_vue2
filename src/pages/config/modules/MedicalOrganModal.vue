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
                label="医疗机构编码">
                <a-input placeholder="医疗机构编码" v-decorator="['code', validatorRules.code]" :readOnly="!!model.id"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="组织机构代码">
                <a-input placeholder="请输入组织机构代码" v-decorator="['orgCode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗机构名称">
                <a-input placeholder="请输入医疗机构名称" v-decorator="['name', validatorRules.name]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医保定点编号">
                <a-input placeholder="请输入医保定点编号" v-decorator="['ybDdbh', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗机构曾用名">
                <a-input placeholder="请输入医疗机构曾用名 " v-decorator="['orgUsedName', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="隶属关系">
                <other-dict-select-tag  placeholder="请选择隶属关系" v-model="membershipCodeSelect"  dictEname="StartupCorp" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="设置/主办单位类别">
                <other-dict-select-tag  placeholder="请选择设置/主办单位类别" v-model="organiserTypeCodeSelect"  dictEname="startupCorp_Catalog" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="上级机构">
                <a-input placeholder="请输入上级机构" v-decorator="['parentId', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="主管单位名称">
                <a-input placeholder="请输入主管单位名称" v-decorator="['competentUnitCode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗机构级别">
                <other-dict-select-tag  placeholder="请选择医疗机构级别" v-model="orgLevelCodeSelect"  dictEname="HospLevel" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗机构等级">
                <other-dict-select-tag  placeholder="请选择医疗机构等级" v-model="orgClassCodeSelect"  dictEname="HospGrade" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗机构行政级别">
                <other-dict-select-tag  placeholder="请选择医疗机构行政级别" v-model="administrativeLevelCodeSelect"  dictCname="医疗机构行政级别" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <!--<a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医疗机构类型">
                <other-dict-select-tag  placeholder="请选择医疗机构类型" v-model="orgTypeCodeSelect"  dictCname="医疗机构类型" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>-->
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="卫生机构类别">
                <other-dict-select-tag  placeholder="请选择卫生机构类别" v-model="healthTypeCodeSelect"  dictEname="Medical_Org_type" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="经营性质">
                <other-dict-select-tag  placeholder="请选择经营性质" v-model="businessNatureCodeSelect"  dictEname="BussType" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="所有制形式">
                <other-dict-select-tag  placeholder="请选择所有制形式" v-model="ownershipCodeSelect"  dictEname="ownType" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="物价级别">
                <other-dict-select-tag  placeholder="请选择物价级别" v-model="priceLevelCodeSelect"  dictEname="price_level" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="邮政编码">
                <a-input placeholder="请输入邮政编码" v-decorator="['postcode', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="联系电话">
                <a-input placeholder="请输入联系电话" v-decorator="['telephone', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="所属行政区域">
                <other-dict-cascader  @change="onChangeTypeCode" placeholder="请选择所属行政区域" dictEname="region" :defaultValue="typeCode_arr"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="医疗机构地址">
                <a-input placeholder="请输入医疗机构地址" v-decorator="['address', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="经纬度">
                <a-input placeholder="请输入经纬度" v-decorator="['latLon', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="新农合定点医疗机构标志">
                <other-dict-select-tag  placeholder="请选择新农合定点医疗机构标志" v-model="xnhFlagCodeSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="医保定点医疗机构标志">
                <other-dict-select-tag  placeholder="请选择医保定点医疗机构标志" v-model="ybFlagCodeSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="工伤医疗机构标志">
                <other-dict-select-tag  placeholder="请选择工伤医疗机构标志" v-model="gsFlagCodeSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="职业病鉴定机构标志">
                <other-dict-select-tag  placeholder="请选择职业病鉴定机构标志" v-model="zybFlagCodeSelect" dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="批准床位数">
                <a-input-number placeholder="请输入批准床位数" v-decorator="['approveBedNum', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="实际开放床位数">
                <a-input-number placeholder="请输入实际开放床位数" v-decorator="['openBedNum', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="法人证件类型">
                <other-dict-select-tag style="width:40%" placeholder="请选择证件类型" v-model="legalIdType"  dictEname="IdentifyType" :readOnly="readonly"/>
                <a-input style="width:60%"  placeholder="请输入法人身份证件号码" v-decorator="[ 'legalIdNo',{}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="法人姓名">
                <a-input placeholder="请输入法人姓名" v-decorator="['legalName', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="法人联系地址">
                <a-input placeholder="请输入法人联系地址" v-decorator="['legalAddress', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="法人联系电话">
                <a-input placeholder="请输入法人联系电话" v-decorator="['legalpersonPhone', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="所属医保机构">
                <a-input placeholder="请输入所属医保机构" v-decorator="['insuranceOrgname', {}]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="描述" style="height:30px">
                <a-textarea placeholder="请输入描述" v-decorator="['remark', {}]" :rows="3" :readOnly="readonly"/>
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
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  import OtherDictSelectTag from "./OtherDictSelectTag"
  import OtherDictCascader from "./OtherDictCascader"

  export default {
    name: "MedicalOfficeModal",
    mixins:[CommonAddEditMixin],
    components: {
      JTreeSelect,
      OtherDictSelectTag,
      OtherDictCascader,
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
          code:{rules: [{ required: true, message: '请输入医疗机构编码!' }]},
          name:{rules: [{ required: true, message: '请输入医疗机构名称!' }]},
        },
        url: {
          add: "/config/medicalOrgan/add",
          edit: "/config/medicalOrgan/edit",
          isExistName: "/config/medicalOrgan/isExistName",
          del: "/config/medicalOrgan/delMedicalOrgan",
          delAll: "/config/medicalOrgan/delAllMedicalOrgan",
          getParentAllList: "/config/medicalOtherDict/getParentAllList",
        },
        membershipCodeSelect:{},
        organiserTypeCodeSelect:{},
        competentUnitCodeSelect:{},
        orgLevelCodeSelect:{},
        orgClassCodeSelect:{},
        administrativeLevelCodeSelect:{},
//        orgTypeCodeSelect:{},
        healthTypeCodeSelect:{},
        businessNatureCodeSelect:{},
        ownershipCodeSelect:{},
        priceLevelCodeSelect:{},
        xnhFlagCodeSelect:{},
        ybFlagCodeSelect:{},
        gsFlagCodeSelect:{},
        zybFlagCodeSelect:{},
        legalIdType:'',
        typeCode_arr:[],
      }
    },
    beforeMount(){

    },
    methods: {
      //字段赋值
      edit (record) {
        this.beforSetEdit(record);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'code','name','orgCode','orgUsedName','parentId','ybDdbh','postcode','telephone','address','latLon','approveBedNum','openBedNum','legalName','legalIdType','legalIdNo','legalAddress','legalpersonPhone','insuranceOrgname','remark','state','auditResult','actionType','createStaff','createStaffName','createReason','updateStaff','updateStaffName','updateReason','deleteStaff','deleteStaffName','deleteReason','actionStaff','actionStaffName','auditStaff','auditStaffName','auditOpinion'))
          if(this.model.typeCode){
            //赋值省市县乡镇
            this.getParentAllList(this.model.typeCode)
          }
          this.setSelectValue();
          //时间格式化
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({deleteTime:this.model.deleteTime?moment(this.model.deleteTime).format("YYYY-MM-DD HH:mm:ss"):null})
        });
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
                  that.$message.warning('该医疗机构代码已存在，请重新输入');
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
        this.membershipCodeSelect ={key:this.model.membershipCode?this.model.membershipCode:''};
        this.organiserTypeCodeSelect ={key:this.model.organiserTypeCode?this.model.organiserTypeCode:''};
        this.competentUnitCodeSelect ={key:this.model.competentUnitCode?this.model.competentUnitCode:''};
        this.orgLevelCodeSelect ={key:this.model.orgLevelCode?this.model.orgLevelCode:''};
        this.orgClassCodeSelect ={key:this.model.orgClassCode?this.model.orgClassCode:''};
        this.administrativeLevelCodeSelect ={key:this.model.administrativeLevelCode?this.model.administrativeLevelCode:''};
       // this.orgTypeCodeSelect ={key:this.model.orgTypeCode?this.model.orgTypeCode:''};
        this.healthTypeCodeSelect ={key:this.model.healthTypeCode?this.model.healthTypeCode:''};
        this.businessNatureCodeSelect ={key:this.model.businessNatureCode?this.model.businessNatureCode:''};
        this.ownershipCodeSelect ={key:this.model.ownershipCode?this.model.ownershipCode:''};
        this.priceLevelCodeSelect ={key:this.model.priceLevelCode?this.model.priceLevelCode:''};
        this.xnhFlagCodeSelect ={key:this.model.xnhFlagCode?this.model.xnhFlagCode:''};
        this.ybFlagCodeSelect ={key:this.model.ybFlagCode?this.model.ybFlagCode:''};
        this.gsFlagCodeSelect ={key:this.model.gsFlagCode?this.model.gsFlagCode:''};
        this.zybFlagCodeSelect ={key:this.model.zybFlagCode?this.model.zybFlagCode:''};
        this.legalIdType = this.model.legalIdType;
        this.typeCode_arr = [this.model.provinceCode,this.model.cityCode,this.model.countyCode,this.model.townCode,this.model.villageCode];
      },
      getSelectText(){
        if(this.membershipCodeSelect){
          this.model.membershipCode = this.membershipCodeSelect.key
          if(this.membershipCodeSelect.label){
            this.model.membership = this.membershipCodeSelect.label
          }
        }
        if(this.organiserTypeCodeSelect){
          this.model.organiserTypeCode = this.organiserTypeCodeSelect.key
          if(this.organiserTypeCodeSelect.label){
            this.model.organiserType = this.organiserTypeCodeSelect.label
          }
        }
        if(this.competentUnitCodeSelect){
          this.model.competentUnitCode = this.competentUnitCodeSelect.key
          if(this.competentUnitCodeSelect.label){
            this.model.competentUnit = this.competentUnitCodeSelect.label
          }
        }
        if(this.orgLevelCodeSelect){
          this.model.orgLevelCode = this.orgLevelCodeSelect.key
          if(this.orgLevelCodeSelect.label){
            this.model.orgLevel = this.orgLevelCodeSelect.label
          }
        }
        if(this.orgClassCodeSelect){
          this.model.orgClassCode = this.orgClassCodeSelect.key
          if(this.orgClassCodeSelect.label){
            this.model.orgClass = this.orgClassCodeSelect.label
          }
        }
        if(this.administrativeLevelCodeSelect){
          this.model.administrativeLevelCode = this.administrativeLevelCodeSelect.key
          if(this.administrativeLevelCodeSelect.label){
            this.model.administrativeLevel = this.administrativeLevelCodeSelect.label
          }
        }
        /*if(this.orgTypeCodeSelect){
          this.model.orgTypeCode = this.orgTypeCodeSelect.key
          if(this.orgTypeCodeSelect.label){
            this.model.orgType = this.orgTypeCodeSelect.label
          }
        }*/
        if(this.healthTypeCodeSelect){
          this.model.healthTypeCode = this.healthTypeCodeSelect.key
          if(this.healthTypeCodeSelect.label){
            this.model.healthType = this.healthTypeCodeSelect.label
          }
        }
        if(this.businessNatureCodeSelect){
          this.model.businessNatureCode = this.businessNatureCodeSelect.key
          if(this.businessNatureCodeSelect.label){
            this.model.businessNature = this.businessNatureCodeSelect.label
          }
        }
        if(this.ownershipCodeSelect){
          this.model.ownershipCode = this.ownershipCodeSelect.key
          if(this.ownershipCodeSelect.label){
            this.model.ownership = this.ownershipCodeSelect.label
          }
        }
        if(this.priceLevelCodeSelect){
          this.model.priceLevelCode = this.priceLevelCodeSelect.key
          if(this.priceLevelCodeSelect.label){
            this.model.priceLevel = this.priceLevelCodeSelect.label
          }
        }
        if(this.xnhFlagCodeSelect){
          this.model.xnhFlagCode = this.xnhFlagCodeSelect.key
          if(this.xnhFlagCodeSelect.label){
            this.model.xnhFlagName = this.xnhFlagCodeSelect.label
          }
        }
        if(this.ybFlagCodeSelect){
          this.model.ybFlagCode = this.ybFlagCodeSelect.key
          if(this.ybFlagCodeSelect.label){
            this.model.ybFlagName = this.ybFlagCodeSelect.label
          }
        }
        if(this.gsFlagCodeSelect){
          this.model.gsFlagCode = this.gsFlagCodeSelect.key
          if(this.gsFlagCodeSelect.label){
            this.model.gsFlagName = this.gsFlagCodeSelect.label
          }
        }
        if(this.zybFlagCodeSelect){
          this.model.zybFlagCode = this.zybFlagCodeSelect.key
          if(this.zybFlagCodeSelect.label){
            this.model.zybFlagName = this.zybFlagCodeSelect.label
          }
        }
        if(this.legalIdType){
          this.model.legalIdType = this.legalIdType
        }
      },
      //修改所属行政区域
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
      //获取省市县乡镇信息
      getParentAllList(code){
        let that = this;
        var param = {dictCname:'区域目录',code:code}
        getAction(this.url.getParentAllList,param,'get').then((res) => {
          if (res.success) {
            let children = [];
            for(let i=res.result.length-1;i>=0;i--){
              children.push(res.result[i].code);
            }
            that.typeCode_arr = children;
          }else{
            that.$message.warning(res.message);
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