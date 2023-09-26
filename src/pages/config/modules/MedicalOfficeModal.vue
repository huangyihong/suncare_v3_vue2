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
                label="所属科目名称">
                <j-tree-select
                  style="width:200px;"
                  v-decorator="['typeCode', validatorRules.typeCode]"
                  dict="medical_other_dict,value,code"
                  pid-field="parent_code" condition='{"dict_ename":"Department","state":"1"}'
                  showKey=true
                  placeholder="请选择所属科目" @change="selectTypeCode" v-if="!readonly">
                </j-tree-select>

                <a-input placeholder="请选择所属科目" v-decorator="['typeName', validatorRules.typeCode]" readOnly="true" v-if="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="所属科目编码">
                <a-input placeholder="请输入所属科目编码" v-decorator="['typeCodeText',{}]" readOnly="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="一级科目名称">
                <a-input v-decorator="['type1Name', validatorRules.type1Name]" readOnly="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="一级科目编码">
                <a-input v-decorator="['type1Code', {}]" readOnly="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="二级科目名称">
                <a-input v-decorator="['type2Name', {}]" readOnly="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="二级科目编码">
                <a-input v-decorator="['type2Code', {}]" readOnly="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="科室编码">
                <a-input placeholder="请输入科室编码" v-decorator="['code', validatorRules.code]" :readOnly="!!model.id"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="科室名称">
                <a-input placeholder="请输入科室名称" v-decorator="['name', validatorRules.name]" :readOnly="readonly"/>
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

  export default {
    name: "MedicalOfficeModal",
    mixins:[CommonAddEditMixin],
    components: {
      JTreeSelect,
      OtherDictSelectTag,
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
          code:{rules: [{ required: true, message: '请输入科室编码!' }]},
          name:{rules: [{ required: true, message: '请输入科室名称!' }]},
          typeCode:{rules: [{ required: true, message: '请选择所属科目!' }]},
          type1Name:{rules: [{ required: true, message: '请选择所属科目!' }]},
        },
        url: {
          add: "/config/medicalOffice/add",
          edit: "/config/medicalOffice/edit",
          isExistName: "/config/medicalOffice/isExistName",
          del: "/config/medicalOffice/delMedicalOffice",
          delAll: "/config/medicalOffice/delAllMedicalOffice",
          getTypeList: "/config/medicalOffice/getTypeList",
        },
        typeCodeText:'',
      }
    },
    beforeMount(){

    },
    methods: {
      //字段赋值
      edit (record) {
        this.beforSetEdit(record);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'code','name','typeName','type1Code','type1Name','type2Code','type2Name','remark','state','auditResult','actionType','createStaff','createStaffName','createReason','updateStaff','updateStaffName','updateReason','deleteStaff','deleteStaffName','deleteReason','actionStaff','actionStaffName','auditStaff','auditStaffName','auditOpinion'))
          if(this.model.typeCode){
            this.form.setFieldsValue({typeCodeText:this.model.typeCode});
            this.form.setFieldsValue({typeCode:this.model.typeCode});
          }
          //时间格式化
          this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
          this.form.setFieldsValue({deleteTime:this.model.deleteTime?moment(this.model.deleteTime).format("YYYY-MM-DD HH:mm:ss"):null})
        });
      },
      //保存
      saveOrUpdate(){
        const that = this;
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
                  that.$message.warning('该科室编码已存在，请重新输入');
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
      selectTypeCode(value,label){
        this.form.setFieldsValue({typeCodeText:value});
        this.model.typeName = label;
        this.getTypeCode(value);
      },
      getTypeCode(typeCode){
        let that = this;
        let param = {typeCode:typeCode};
        getAction(this.url.getTypeList,param,'get').then((data) => {
          if (data.success) {
            let typeList = data.result;
            for(let i=1;i<3;i++){
              that.model['type'+i+'Code']="";
              that.model['type'+i+'Name']="";
            }
            typeList.forEach(function(item,index,arr){
              that.model['type'+(index+1)+'Code']=item.CODE;
              that.model['type'+(index+1)+'Name']=item.VALUE;
            });
            this.form.setFieldsValue({type1Code:this.model.type1Code});
            this.form.setFieldsValue({type1Name:this.model.type1Name});
            this.form.setFieldsValue({type2Code:this.model.type2Code});
            this.form.setFieldsValue({type2Name:this.model.type2Name});
          }else{
            that.$message.warning(data.message);
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