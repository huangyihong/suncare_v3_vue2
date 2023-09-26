<template>
  <a-drawer
    :title="title"
    :width="800"
     placement="right"
    :closable="false"
    @close="close"
    :visible="visible">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规名称">
          <a-input placeholder="请输入名称" v-decorator="['reviewName', validatorRules.required ]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="判定结果">
          <a-select placeholder="请选择判定结果" v-decorator="['firReviewStatus', validatorRules.required ]" >
            <a-select-option value="init">待处理</a-select-option>
            <a-select-option value="white">白名单</a-select-option>
            <a-select-option value="blank">黑名单</a-select-option>
            <a-select-option value="grey">灰名单</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否推送">
          <a-radio-group name=""  v-decorator="['pushStatus',{'initialValue':'0'} ]">
            <a-radio :value="'1'">是</a-radio>
            <a-radio :value="'0'">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入备注" v-decorator="['firReviewRemark', {} ]" />
        </a-form-item>
        <a-form-item
          label="推送范围"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-select v-model="assignType">
            <a-select-option value="ALL">条件全部</a-select-option>
            <a-select-option value="SELECT">已选择</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">保存</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction,putAction, getAction } from '@/api-sv3/manage'
  import pick from 'lodash/pick'
  import moment from "moment"

  export default {
    name: "reviewModal",
    props: {
      batchId: {
        type:String,
        required: true
      },
      isLoad: {
        type:Boolean,
        default: false
      },
      url: {
        type: Object,
        default: () => ({
          save: this.$suncare_v3 + "/reviewManual/pushReviews",
          query: this.$suncare_v3 +this.$gp_database + '/apiReviewFirst/queryReviewInfoById',
        })
      },
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
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] },
        },
        ids: [],
        listParams: [],
        assignType: 'SELECT',
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'reviewName','firReviewStatus','pushStatus','firReviewRemark'))
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

            // let formData = Object.assign(this.model, values);
            if(values.pushStatus==='1'){
              if(values.firReviewStatus==='init'){
                that.$message.warning("判定结果为待处理无法推送");
                return;
              }
              if(values.firReviewStatus==='white'){
                that.$message.warning("判定结果为白名单无需推送");
                return;
              }
            }
            let formData = {}
            formData.reviewInfo = JSON.stringify(values)

            if (this.assignType === 'SELECT') {
              if (this.ids.length === 0) {
                this.$message.warn("请至少勾选一条记录")
                return
              }
              formData.ids = this.ids.join(",");
            } else {
              Object.assign(formData,this.listParams)
            }

            formData.batchId = this.batchId
            console.log('formData',formData)

            that.confirmLoading = true;
            putAction(this.url.save,formData).then((res)=>{
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
      loadData (ids, params) {
        this.visible = true;
        this.ids = ids
        this.listParams = params
        if(!this.isLoad || ids.length !== 1){
          this.add()
          return
        }
        this.confirmLoading = true
        const that = this;
        getAction(this.url.query,{id: ids[0], batchId: this.batchId},'get').then((res) => {
          if (res.success) {
            let record = res.result;
            if(!record){
              record = {};
            }
            that.edit(record);
          }else{
            that.$message.warning(res.message);
          }
        }).finally(()=>{
          this.confirmLoading = false
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
