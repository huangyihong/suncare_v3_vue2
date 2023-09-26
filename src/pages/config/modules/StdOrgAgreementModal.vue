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
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="医疗机构">
            <a-input-group compact>
              <a-input  v-decorator="['orgidAndName', validatorRules.required]" style="width: calc(100% - 90px)"/>
              <a-button type="primary" @click="openSelectOrg()" icon="search">选择</a-button>
            </a-input-group>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="医疗保险类别">
            <other-dict-select-tag  placeholder="请选择医疗保险类别" v-model="surancetypecodeSelect"  dictEname="medinsuranceType"
                                    :labelInValue="true" :readOnly="readonly" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="均次住院天数">
            <a-input-number :step="1" :min="1" v-decorator="['pertimeZydays', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="单病种结算率">
            <a-input-number :step="1" :min="0" :max="100"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')"
                            v-decorator="['drgsettleRatio', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="均次住院费用">
            <a-input-number :step="1" :min="0" v-decorator="['zypertimeAmt', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="床日费用">
            <a-input-number :step="1" :min="0" v-decorator="['zyDayavgAmt', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="药费占住院费用比例">
            <a-input-number :step="1" :min="0" :max="100"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')"
                            v-decorator="['medFeeratio', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="百人门诊住院率">
            <a-input-number :step="1" :min="0" :max="100"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')"
                            v-decorator="['outConvertInRatio', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="实际报销比例">
            <a-input-number :step="1" :min="0" :max="100"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')"
                            v-decorator="['fundpayRatio', {}]"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="适用时间">
            <a-range-picker v-model="dateTimes" :allowClear="false" :disabled="readonly"/>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="政策依据" style="height:30px">
            <a-textarea placeholder="请输入政策依据" v-decorator="['policybasis', {}]" :rows="3" :readOnly="readonly"/>
          </a-form-item>
        </a-col>



      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>

    <select-org ref="selectOrgRef" @ok="selectOrg" :fixedParam="orgFilters"></select-org>

  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import OtherDictSelectTag from "./OtherDictSelectTag"
  import SelectOrg from "@/pages/selectSingle/MedicalOrg"

  export default {
    name: "stdOrgAgreement",
    components: {
      OtherDictSelectTag,
      SelectOrg
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
          add: "/config/stdOrgAgreement/add",
          edit: "/config/stdOrgAgreement/edit",
        },
        surancetypecodeSelect:{},
        dateTimes: [moment('2000-01-01'), moment('2099-12-31')],
        orgFilters:{state:'1'},
        orgidAndName:'',//医疗机构
      }
    },
    beforeMount () {
    },
    methods: {
      add (record) {
        let newRecord
        if (record) {
          newRecord = { ...record }
          delete newRecord.id
        } else {
          newRecord = {}
        }
        this.edit(newRecord);
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.dateTimes =  [moment(record.startdate||'2000-01-01'), moment(record.enddate||'2099/12/31')]
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'orgid','orgname','surancetypecode','surancetypename','pertimeZydays',
            'drgsettleRatio','zypertimeAmt','zyDayavgAmt','medFeeratio','outConvertInRatio','fundpayRatio','policybasis'))
          this.surancetypecodeSelect ={key:this.model.surancetypecode?this.model.surancetypecode:''};
        });
        this.setOrgidAndName()

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

      getSelectText(){
        if(this.surancetypecodeSelect){
          this.model.surancetypecode = this.surancetypecodeSelect.key
          if(this.surancetypecodeSelect.label){
            this.model.surancetypename = this.surancetypecodeSelect.label
          }
        }
      },

      openSelectOrg() {
        this.$refs.selectOrgRef.show('选择医疗机构')
      },

      selectOrg({ code, name }) {
        console.dir(name )
        this.model.orgid = code
        this.model.orgname = name
        this.setOrgidAndName()
      },

      setOrgidAndName(){
        if(this.model.orgid){
          this.orgidAndName = this.model.orgname+'('+this.model.orgid+')'
          this.form.setFieldsValue({'orgidAndName':this.orgidAndName})
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