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
            <a-col :md="24" :sm="24">
              <a-form-item
                :labelCol="labelCol2"
                :wrapperCol="wrapperCol2"
                label="序号">
                <a-input placeholder="请输入序号" v-decorator="['orderNum', validatorRules.orderNum]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="ATC药品编码">
                <a-input placeholder="请输入ATC药品编码" v-decorator="['code', validatorRules.code]" :readOnly="!!model.id"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="ATC药品名称">
                <a-input placeholder="请输入ATC药品名称" v-decorator="['name', validatorRules.name]" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="剂型">
                <other-dict-select-tag  placeholder="请选择剂型" v-model="dosageCodeSelect"  dictEname="DosageForm" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="规格">
                <other-dict-select-tag  placeholder="请选择规格" v-decorator="['specificaion', {}]"  dictEname="specificaion" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="处方药标志">
                <other-dict-select-tag  placeholder="请选择处方药标志" v-model="presdrugSignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="非处方药分类">
                <other-dict-select-tag  placeholder="请选择非处方药分类" v-model="nonrxtypecodeSelect"  dictEname="NONRxtype" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="毒性药品标志">
                <other-dict-select-tag  placeholder="请选择毒性药品标志" v-model="poisonousSignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="麻醉药品标志">
                <other-dict-select-tag  placeholder="请选择麻醉药品标志" v-model="narcoticSignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="一类精神药品标志">
                <other-dict-select-tag  placeholder="请选择一类精神药品标志" v-model="psych1SignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="二类精神药品标志">
                <other-dict-select-tag  placeholder="请选择二类精神药品标志" v-model="psych2SignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="三类精神药品标志">
                <other-dict-select-tag  placeholder="请选择三类精神药品标志" v-model="psych3SignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="生物制品标志">
                <other-dict-select-tag  placeholder="请选择生物制品标志" v-model="biologicSignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="血液制品类标志">
                <other-dict-select-tag  placeholder="请选择血液制品类标志" v-model="bloodprodSignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="放射性药品标志">
                <other-dict-select-tag  placeholder="请选择放射性药品标志" v-model="radioSignSelect"  dictEname="Yes_or_No" :labelInValue="true" :readOnly="readonly"/>
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
    name: "MedicalDrugPropertyModal",
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
          code:{rules: [{ required: true, message: '请输入ATC药品编码!' }]},
          name:{rules: [{ required: true, message: '请输入ATC药品名称!' }]},
          orderNum:{rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入正确的序号!' }]},
        },
        url: {
          add: "/config/medicalDrugProperty/add",
          edit: "/config/medicalDrugProperty/edit",
          isExistOrderNum: "/config/medicalDrugProperty/isExistOrderNum",
          del: "/config/medicalDrugProperty/delMedicalDrugProperty",
          delAll: "/config/medicalDrugProperty/delAllMedicalDrugProperty",
          getMaxOrderNum: "/config/medicalDrugProperty/getMaxOrderNum",
        },
        dosageCodeSelect:{},
        presdrugSignSelect:{},
        nonrxtypecodeSelect:{},
        poisonousSignSelect:{},
        narcoticSignSelect:{},
        psych1SignSelect:{},
        psych2SignSelect:{},
        psych3SignSelect:{},
        biologicSignSelect:{},
        bloodprodSignSelect:{},
        radioSignSelect:{},
      }
    },
    beforeMount(){

    },
    methods: {
      //字段赋值
      edit (record) {
        this.beforSetEdit(record);
        if(record.fntype==='add'){
          this.model = this.setCreatField(this.model);
          //获取最大序号
          getAction(this.url.getMaxOrderNum,{},'get').then((data) => {
            if (data.success) {
              this.model.orderNum = data.result
              this.form.setFieldsValue(pick(this.model,'orderNum'))
            }else{
              this.$message.warning(data.message);
            }
          })
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'orderNum','code','name','specificaion','state','auditResult','actionType','createStaff','createStaffName','createReason','updateStaff','updateStaffName','updateReason','deleteStaff','deleteStaffName','deleteReason','actionStaff','actionStaffName','auditStaff','auditStaffName','auditOpinion'))
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
            param.orderNum = that.form.getFieldValue('orderNum');
            param.id = that.model.id;
            getAction(this.url.isExistOrderNum,param,'get').then((data) => {
              if (data.success) {
                if(data.result){
                  that.$message.warning('该序号已存在，请修改为其他序号');
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
        this.presdrugSignSelect ={key:this.model.presdrugSign?this.model.presdrugSign:''};
        this.nonrxtypecodeSelect ={key:this.model.nonrxtypecode?this.model.nonrxtypecode:''};
        this.poisonousSignSelect ={key:this.model.poisonousSign?this.model.poisonousSign:''};
        this.narcoticSignSelect ={key:this.model.narcoticSign?this.model.narcoticSign:''};
        this.psych1SignSelect ={key:this.model.psych1Sign?this.model.psych1Sign:''};
        this.psych2SignSelect ={key:this.model.psych2Sign?this.model.psych2Sign:''};
        this.psych3SignSelect ={key:this.model.psych3Sign?this.model.psych3Sign:''};
        this.biologicSignSelect ={key:this.model.biologicSign?this.model.biologicSign:''};
        this.bloodprodSignSelect ={key:this.model.bloodprodSign?this.model.bloodprodSign:''};
        this.radioSignSelect ={key:this.model.radioSign?this.model.radioSign:''};
      },
      getSelectText(){
        if(this.dosageCodeSelect){
          this.model.dosageCode = this.dosageCodeSelect.key
          if(this.dosageCodeSelect.label){
            this.model.dosageName = this.dosageCodeSelect.label
          }
        }
        if(this.presdrugSignSelect){
          this.model.presdrugSign = this.presdrugSignSelect.key
          if(this.presdrugSignSelect.label){
            this.model.presdrugSignname = this.presdrugSignSelect.label
          }
        }
        if(this.nonrxtypecodeSelect){
          this.model.nonrxtypecode = this.nonrxtypecodeSelect.key
          if(this.nonrxtypecodeSelect.label){
            this.model.nonrxtypename = this.nonrxtypecodeSelect.label
          }
        }
        if(this.poisonousSignSelect){
          this.model.poisonousSign = this.poisonousSignSelect.key
          if(this.poisonousSignSelect.label){
            this.model.poisonousSignname = this.poisonousSignSelect.label
          }
        }
        if(this.narcoticSignSelect){
          this.model.narcoticSign = this.narcoticSignSelect.key
          if(this.narcoticSignSelect.label){
            this.model.narcoticSignname = this.narcoticSignSelect.label
          }
        }
        if(this.psych1SignSelect){
          this.model.psych1Sign = this.psych1SignSelect.key
          if(this.psych1SignSelect.label){
            this.model.psych1Signname = this.psych1SignSelect.label
          }
        }
        if(this.psych2SignSelect){
          this.model.psych2Sign = this.psych2SignSelect.key
          if(this.psych2SignSelect.label){
            this.model.psych2Signname = this.psych2SignSelect.label
          }
        }
        if(this.psych3SignSelect){
          this.model.psych3Sign = this.psych3SignSelect.key
          if(this.psych3SignSelect.label){
            this.model.psych3Signname = this.psych3SignSelect.label
          }
        }
        if(this.biologicSignSelect){
          this.model.biologicSign = this.biologicSignSelect.key
          if(this.biologicSignSelect.label){
            this.model.biologicSignname = this.biologicSignSelect.label
          }
        }
        if(this.bloodprodSignSelect){
          this.model.bloodprodSign = this.bloodprodSignSelect.key
          if(this.bloodprodSignSelect.label){
            this.model.bloodprodSignname = this.bloodprodSignSelect.label
          }
        }
        if(this.radioSignSelect){
          this.model.radioSign = this.radioSignSelect.key
          if(this.radioSignSelect.label){
            this.model.radioSignname = this.radioSignSelect.label
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