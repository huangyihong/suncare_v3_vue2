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
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="问题类别">
              <a-input placeholder="请输入问题类别" v-decorator="['issueType', validatorRules.required]"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="问题类型">
              <a-input placeholder="请输入问题类型" v-decorator="['issueSubtype', validatorRules.required]"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="项目名称">
              <a-input placeholder="请输入项目名称" v-decorator="['clueName', validatorRules.required]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="问题情形描述">
              <a-input placeholder="请输入问题情形描述" v-decorator="['caseRemark', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="涉及数量">
              <a-input-number placeholder="请输入涉及数量" v-decorator="['caseAmount', {}]" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="涉及人次">
              <a-input-number placeholder="请输入涉及人次" v-decorator="['casePersonCnt', validatorRules.requiredOnly]" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="涉及金额(元)">
              <a-input-number placeholder="请输入涉及金额(元)" v-decorator="['caseFee', validatorRules.requiredOnly]" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="核减人次">
              <a-input-number placeholder="请输入核减人次" v-decorator="['cutPersonCnt', {}]" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="核减数量">
              <a-input-number placeholder="请输入核减数量" v-decorator="['cutAmount', {}]" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="核减金额">
              <a-input-number placeholder="请输入核减金额" v-decorator="['cutFee', {}]" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="项目支付类别">
              <a-input placeholder="请输入项目支付类别" v-decorator="['clueType', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="医保报销比例">
              <a-input-number  :min="0" :max="100"
                               :formatter="value => `${value}%`"
                               :parser="value => value.replace('%', '')"
                               v-decorator="['bxRate', {}]" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="涉及医保基金(元)">
              <a-input-number placeholder="请输入涉及医保基金(元)" v-decorator="['caseFundFee', validatorRules.requiredOnly]" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="问题认定依据">
              <a-input placeholder="请输入问题认定依据" v-decorator="['sureBasis', {}]"/>
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

import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

export default {
  name: "onsiteClueModal",
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
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: "/fj/clue/onsite/add",
        edit: "/fj/clue/onsite/edit",
      },


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
      this.selectData = []
      this.model = Object.assign({}, record);
      if(this.model.bxRate){
        this.model.bxRate = (this.model.bxRate*100).toFixed(2)
      }
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'issueType','issueSubtype','clueName',
          'caseRemark','caseAmount','casePersonCnt','caseFee',
          'cutPersonCnt','cutAmount','cutFee','clueType',
          'bxRate','caseFundFee','sureBasis'))
      });
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
          if(!this.model.projectId){
            httpurl+=this.url.add;
            method = 'post';
          }else{
            httpurl+=this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          if(formData.bxRate){
            formData.bxRate = (formData.bxRate/100).toFixed(4)
          }
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
