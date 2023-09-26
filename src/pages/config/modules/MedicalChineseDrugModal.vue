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
                label="中草药编码">
                <a-input placeholder="请输入中草药编码" v-decorator="['code', validatorRules.code]" :readOnly="!!model.id"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="中草药名称">
                <a-input placeholder="请输入中草药名称" v-decorator="['name', validatorRules.name]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="国家医保编码">
                <a-input placeholder="请输入国家医保编码" v-decorator="['ybCode', {}]" :readOnly="readonly" :maxLength="50"/>
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="饮片名" >
                <a-input placeholder="请输入饮片名" v-decorator="['pieceName', {}]" :readOnly="readonly" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="饮片规格">
                <other-dict-select-tag  placeholder="请选择饮片规格" v-model="pieceSizeCodeSelect"  dictEname="yp_specicode" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="剂型">
                <other-dict-select-tag  placeholder="请选择剂型" v-model="dosageTypeCodeSelect"   dictEname="DosageForm" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="来源">
                <other-dict-select-tag  placeholder="请选择来源" v-model="sourceCodeSelect"  dictEname="herb_source" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="产地">
                <other-dict-select-tag  placeholder="请选择产地" v-model="placeCodeSelect"  dictEname="place" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="药用部位">
                <other-dict-select-tag  placeholder="请选择药用部位" v-model="medicalPartCodeSelect"  dictEname="herb_part" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="炮制方法">
                <other-dict-select-tag  placeholder="请选择炮制方法" v-model="methodCodeSelect"  dictEname="makemethod" :labelInValue="true" :readOnly="readonly"/>
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
                label="常用处方名" >
                <a-input placeholder="请输入常用处方名" v-decorator="['prescription', {}]" :readOnly="readonly" />
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
  import OtherDictSelectTag from "./OtherDictSelectTag"

  export default {
    name: "MedicalChineseDrugModal",
    mixins:[CommonAddEditMixin],
    components: {
      OtherDictSelectTag
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
          code:{rules: [{ required: true, message: '请输入中草药编码!' }]},
          name:{rules: [{ required: true, message: '请输入中草药名称!' }]},
        },
        url: {
          add: "/config/medicalChineseDrug/add",
          edit: "/config/medicalChineseDrug/edit",
          isExistName: "/config/medicalChineseDrug/isExistName",
          del: "/config/medicalChineseDrug/delMedicalChineseDrug",
          delAll: "/config/medicalChineseDrug/delAllMedicalChineseDrug",
        },
        pieceSizeCodeSelect:{},
        dosageTypeCodeSelect:{},
        sourceCodeSelect:{},
        placeCodeSelect:{},
        medicalPartCodeSelect:{},
        methodCodeSelect:{},
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
          this.form.setFieldsValue(pick(this.model,'code','name','ybCode','pieceName','prescription','remark','state','auditResult','actionType','createStaff','createStaffName','createReason','updateStaff','updateStaffName','updateReason','deleteStaff','deleteStaffName','deleteReason','actionStaff','actionStaffName','auditStaff','auditStaffName','auditOpinion'))
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
                  that.$message.warning('该中草药编码已存在，请修改为其他中草药编码');
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
        this.pieceSizeCodeSelect ={key:this.model.pieceSizeCode?this.model.pieceSizeCode:''};
        this.dosageTypeCodeSelect ={key:this.model.dosageTypeCode?this.model.dosageTypeCode:''};
        this.sourceCodeSelect ={key:this.model.sourceCode?this.model.sourceCode:''};
        this.placeCodeSelect ={key:this.model.placeCode?this.model.placeCode:''};
        this.medicalPartCodeSelect ={key:this.model.medicalPartCode?this.model.medicalPartCode:''};
        this.methodCodeSelect ={key:this.model.methodCode?this.model.methodCode:''};
        this.chargeClassSelect = {key:this.model.chargeClassCode?this.model.chargeClassCode:''}
      },
      getSelectText(){
        if(this.pieceSizeCodeSelect){
          this.model.pieceSizeCode = this.pieceSizeCodeSelect.key
          if(this.pieceSizeCodeSelect.label){
            this.model.pieceSize = this.pieceSizeCodeSelect.label
          }
        }
        if(this.dosageTypeCodeSelect){
          this.model.dosageTypeCode = this.dosageTypeCodeSelect.key
          if(this.dosageTypeCodeSelect.label){
            this.model.dosageType = this.dosageTypeCodeSelect.label
          }
        }
        if(this.sourceCodeSelect){
          this.model.sourceCode = this.sourceCodeSelect.key
          if(this.sourceCodeSelect.label){
            this.model.source = this.sourceCodeSelect.label
          }
        }
        if(this.placeCodeSelect){
          this.model.placeCode = this.placeCodeSelect.key
          if(this.placeCodeSelect.label){
            this.model.place = this.placeCodeSelect.label
          }
        }
        if(this.medicalPartCodeSelect){
          this.model.medicalPartCode = this.medicalPartCodeSelect.key
          if(this.medicalPartCodeSelect.label){
            this.model.medicalPart = this.medicalPartCodeSelect.label
          }
        }
        if(this.methodCodeSelect){
          this.model.methodCode = this.methodCodeSelect.key
          if(this.methodCodeSelect.label){
            this.model.method = this.methodCodeSelect.label
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
</style>