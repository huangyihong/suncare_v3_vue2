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

        <a-col :md="disableSubmit?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="医保药品代码">
            <a-input placeholder="请输入医保药品代码" v-decorator="['drugcodeYbregister', validatorRules.required]"  :readOnly="!!model.id"/>
          </a-form-item>
        </a-col>
        <a-col :md="disableSubmit?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="注册药品名称">
            <a-input placeholder="请输入注册药品名称" v-decorator="['drugnameYbregister', validatorRules.required]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="disableSubmit?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药监药品本位码">
            <a-input placeholder="请选择" v-decorator="['drugcode869', validatorRules.required]"  readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="disableSubmit?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药监药品名称">
            <a-input placeholder="请选择" v-decorator="['drugname869', validatorRules.required]" readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="4" :xs="24" class="t-r" v-show="!disableSubmit">
          <a-button type="primary" @click="selectDrugInfoVisible = true">选择药品
          </a-button>
        </a-col>

        <a-col :md="disableSubmit?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="亚信药品编码">
            <a-input placeholder="请选择" v-decorator="['drugcode', {}]" readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="disableSubmit?12:10" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="亚信药品名称">
            <a-input placeholder="请选择" v-decorator="['drugname', {}]" readOnly/>
          </a-form-item>
        </a-col>
        <a-col :md="4" :xs="24" class="t-r" v-show="!disableSubmit">
          <a-button type="primary" @click="selectACTVisible = true">选择ATC
          </a-button>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="亚信药品收费类别">
            <other-dict-select-tag  placeholder="请选择亚信药品收费类别" v-model="chargeclassSelect"  dictEname="chargeClass" :labelInValue="true" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="医保目录编码">
            <a-input placeholder="请输入医保目录编码" v-decorator="['drugcodeSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="医保药品名称(原始)">
            <a-input placeholder="请输入医保药品名称(原始)" v-decorator="['drugnameSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="剂型名称(原始)">
            <a-input placeholder="请输入剂型名称(原始)" v-decorator="['dosageNameSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="规格">
            <a-input placeholder="请输入规格" v-decorator="['specificaion', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="最小包装数量">
            <a-input placeholder="请输入最小包装数量" v-decorator="[ 'packageNum',{}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="最小制剂单位">
            <other-dict-select-tag  placeholder="请选择最小制剂单位" v-decorator="[ 'preparationUnit',{}]" dictEname="dosage_unit" :valueEqName="true" :readOnly="readonly"/>

          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="最小包装单位">
            <other-dict-select-tag  placeholder="请选择最小包装单位" v-decorator="[ 'packageUnit',{}]" dictEname="pack_unit" :valueEqName="true" :readOnly="readonly"/>

          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="包装材质">
            <a-input placeholder="请输入包装材质" v-decorator="[ 'packMaterial',{}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药品生产企业编码">
            <a-input placeholder="请输入药品生产企业编码" v-decorator="['manufactorCode', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药品生产企业名称">
            <a-input placeholder="请输入药品生产企业名称" v-decorator="['manufactor', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药品父级编码">
            <a-input placeholder="请输入药品父级编码" v-decorator="['parentcode', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药品父级名称">
            <a-input placeholder="请输入药品父级名称" v-decorator="['parentname', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="收费药品等级名称(原始)">
            <a-input placeholder="请输入收费药品等级名称(原始)" v-decorator="['chargeattriSrc', {}]" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="收费药品等级(映射后)">
            <other-dict-select-tag  placeholder="请选择收费药品等级" v-model="chargeattricodeSelect"  dictEname="ChargeAttri" :labelInValue="true" :readOnly="readonly"/>
          </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="备注">
            <a-textarea placeholder="请输入备注" v-decorator="['itemnote', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="适用地">
            <other-dict-tree-select  placeholder="请选择适用地" dictEname="region" :defaultValue="model.projectArea" @select="onSelectProjectArea"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="所有制形式">
            <other-dict-select-tag  placeholder="请选择所有制形式" v-model="owntypeSelect"  mode="multiple" dictEname="ownType" :labelInValue="true" :readOnly="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="有效起始日期">
            <a-range-picker v-model="dateTimes" :allowClear="false"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="医保目录版本">
            <a-textarea placeholder="请输入医保目录版本" v-decorator="['fileName', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
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
        <template v-if="model.id">
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
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="修改原因">
              <a-textarea placeholder="请输入修改原因" v-decorator="['updateReason', {}]" :auto-size="{ minRows: 2, maxRows: 20 }" :readOnly="readonly"/>
            </a-form-item>
          </a-col>
        </template>
        <a-col :md="24" :sm="24" style="margin-bottom: 30px"></a-col>

      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>
    <m-modal centered
             title="选择ATC药品信息"
             width="80%"
             :visible="selectACTVisible"
             @ok="handleSelecACTOk"
             @cancel="handleSelectACTClose"
             cancelText="关闭">
      <select-medical-std-atc ref="selectRef" :selected="selectData" selectType="radio"
                                              :fixedParam="{ state: '1' }"></select-medical-std-atc>
    </m-modal>

    <m-modal centered
             title="选择药品信息"
             width="80%"
             :visible="selectDrugInfoVisible"
             @ok="handleSelecDrugOk"
             @cancel="handleSelectDrugClose"
             cancelText="关闭">
      <SelectMedicalDrug ref="selectDrugRef" :selected="selectData" selectType="radio"
                              :fixedParam="{ state: '1' }"></SelectMedicalDrug>
    </m-modal>

  </a-drawer>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import ACol from "ant-design-vue/es/grid/Col";
  const SelectMedicalStdAtc = () => import("@/pages/selectMulti/MedicalStdAtc")
  const SelectMedicalDrug = () => import("@/pages/selectMulti/MedicalDrug")
  import OtherDictTreeSelect from "./OtherDictTreeSelect"
  import OtherDictSelectTag from "./OtherDictSelectTag"

  export default {
    name: "stdYbDrugcatalog",
    components: {
      ACol,
      SelectMedicalStdAtc,
      SelectMedicalDrug,
      OtherDictTreeSelect,
      OtherDictSelectTag,
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' },{whitespace: true, message: '值不能是空格!'}] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        url: {
          add: "/config/stdYbDrugcatalog/add",
          edit: "/config/stdYbDrugcatalog/edit",
        },
        readonly:false,//只读
        userInfoBean: null,//登录用户信息
        selectACTVisible: false,//显示ACT选择药品窗口
        selectDrugInfoVisible:false,//显示药品选择窗口
        selectData: [],//选中药品值
        chargeattricodeSelect:{},
        chargeclassSelect:{},
        owntypeSelect:[],
        dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
      }
    },
    beforeMount(){
      this.userInfoBean = this.userInfo()
    },
    methods: {
      ...mapGetters(["userInfo"]),
      //设置新增字段信息
      setCreatField(record){
        record.createStaffName = this.userInfoBean.realname;
        record.createStaff = this.userInfoBean.id;
        record.createTime = new Date();
        return record;
      },
      add (record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.id
          delete newRecord.updateStaffName
          delete newRecord.updateStaff
          delete newRecord.updateTime
        } else {
          newRecord = {}
        }
        newRecord = this.setCreatField(newRecord)
        this.edit(newRecord);
      },
      edit (record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.dateTimes =  [moment(record.startdate||'2000-01-01'), moment(record.enddate||'2099/12/31')]
        this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'drugcode','drugname','drugcodeSrc','drugnameSrc','dosageNameSrc',
              'specificaion','manufactorCode','manufactor','parentcode','parentname','chargeattriSrc','itemnote',
              'fileName','createStaffName','updateStaffName','updateReason','drugcode869','drugname869','drugcodeYbregister','drugnameYbregister',
              'packageNum','packageUnit','preparationUnit','packMaterial'))
            //时间格式化
            this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime).format("YYYY-MM-DD HH:mm:ss"):null})
            this.form.setFieldsValue({updateTime:this.model.updateTime?moment(this.model.updateTime).format("YYYY-MM-DD HH:mm:ss"):null})
        });
        this.setSelectValue();
      },
      setSelectValue(){
        this.chargeclassSelect = {key:this.model.chargeclassId?this.model.chargeclassId:''}
        this.chargeattricodeSelect ={key:this.model.chargeattricode?this.model.chargeattricode:''}
        this.owntypeSelect = []
        let that = this
        if(this.model.owntype){
          this.model.owntype.split(',').forEach(function(val,index){
            that.owntypeSelect[index] = {key:val}
          });
        }
        if(this.model.owntypeName){
          this.model.owntypeName.split(',').forEach(function(val,index){
            let drug = {}
            if(that.owntypeSelect[index]){
              drug = that.owntypeSelect[index]
            }
            drug.label = val
            that.owntypeSelect[index] = drug
          });
        }
      },
      getSelectText() {
        if(this.chargeclassSelect){
          this.model.chargeclassId = this.chargeclassSelect.key
          if(this.chargeattricodeSelect.label){
            this.model.chargeclass = this.chargeclassSelect.label
          }
        }
        if(this.chargeattricodeSelect){
          this.model.chargeattricode = this.chargeattricodeSelect.key
          if(this.chargeattricodeSelect.label){
            this.model.chargeattriname = this.chargeattricodeSelect.label
          }
        }
        let owntype = []
        let owntypeName = []
        this.owntypeSelect.forEach(function(val,index){
          owntype.push(val.key)
          owntypeName.push(val.label)
        });
        this.model.owntype = owntype.join(',')
        this.model.owntypeName = owntypeName.join(',')
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
            delete formData.createStaff
            delete formData.createStaffName
            delete formData.createTime
            delete formData.updateStaff
            delete formData.updateStaffName
            delete formData.updateTime
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
      //选择act药品确定
      handleSelecACTOk() {
        let selectData = this.$refs.selectRef.getSelect()
        if (selectData.length > 0) {
          this.setSelectATCObj(selectData[0])
        }
        this.handleSelectACTClose()
      },
      //关闭选择ATC药品
      handleSelectACTClose() {
        this.selectACTVisible = false
      },

      //选择drug药品确定
      handleSelecDrugOk() {
        let selectData = this.$refs.selectDrugRef.getSelect()
        if (selectData.length > 0) {
          this.setSelectDrugObj(selectData[0])
        }
        this.handleSelectDrugClose()
      },
      //关闭选择drug药品
      handleSelectDrugClose() {
        this.selectDrugInfoVisible = false
      },

      //选择ATC药品
      setSelectATCObj(obj) {
        if (obj.code && obj.code.length > 0) {
          this.selectData = [obj]
        } else {
          this.selectData = []
        }
        this.form.setFieldsValue({ drugcode: obj.code, drugname: obj.name })
      },
      //选择drug药品
      setSelectDrugObj(obj) {
        if (obj.code && obj.code.length > 0) {
          this.selectData = [obj]
        } else {
          this.selectData = []
        }
        this.form.setFieldsValue({ drugcode869: obj.code, drugname869: obj.name })
      },
      //选中适用地
      onSelectProjectArea(value, obj){
        this.model.projectArea = obj.value;
        this.model.projectAreaId = obj.id;
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