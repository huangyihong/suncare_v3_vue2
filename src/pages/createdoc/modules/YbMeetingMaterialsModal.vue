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
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医院名称">
          <a-input placeholder="请输入医院名称" v-decorator="['orgname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="行动名称">
          <a-input placeholder="请输入行动名称" v-decorator="['actionname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文书字号">
          <a-input placeholder="请输入文书字号" v-decorator="['codename', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="检查小组">
          <a-input placeholder="请输入检查小组" v-decorator="['groupTeam', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="调查开始时间">
          <a-input placeholder="请输入调查开始时间" v-decorator="['startdate', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="检查时间范围">
          <a-input placeholder="请输入检查时间范围" v-decorator="['timerange', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="问题类别(一级指标)">
          <a-input placeholder="请输入问题类别(一级指标)" v-decorator="['cat', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规项目">
          <a-input placeholder="请输入违规项目" v-decorator="['cat', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规情形描述">
          <a-input placeholder="请输入违规情形描述" v-decorator="['wgDesc', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规人次">
          <a-input placeholder="请输入违规人次" v-decorator="['pax', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规医保基金金额（元）">
          <a-input placeholder="请输入违规医保基金金额（元）" v-decorator="['fundAmt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="罚款倍数">
          <a-input placeholder="请输入罚款倍数" v-decorator="['penaltyN', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="罚款金额">
          <a-input placeholder="请输入罚款金额" v-decorator="['penaltyAmt', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规第几条">
          <a-input placeholder="请输入违规第几条" v-decorator="['clauseT', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="违规第几款">
          <a-input placeholder="请输入违规第几款" v-decorator="['clauseK', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="行政处罚事先告知书链接">
          <a-input placeholder="请输入行政处罚事先告知书链接" v-decorator="['xzcftzsUrl', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拟处理意见报告链接">
          <a-input placeholder="请输入拟处理意见报告链接" v-decorator="['nclyjbgUrl', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk" style="margin-right: .8rem" v-show="!disableSubmit">提交</a-button>
      <a-button @click="handleCancel" v-show="!disableSubmit">取消</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"

  export default {
    name: "YbMeetingMaterialsModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 19},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/ybChargeSearch/ybMeetingMaterials/add",
          edit: "/ybChargeSearch/ybMeetingMaterials/edit",
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
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'actionname','codename','groupTeam','orgname','timerange','startdate','cat','item','wgDesc','pax','fundAmt','penaltyN','penaltyAmt','clauseT','clauseK','xzcftzsUrl','nclyjbgUrl'))
		  //时间格式化
          this.form.setFieldsValue({startdate:this.model.startdate})
      //     this.form.setFieldsValue({createdTime:this.model.createdTime?moment(this.model.createdTime):null})
      //     this.form.setFieldsValue({startdate:this.model.startdate?moment(this.model.startdate):null})
      //     this.form.setFieldsValue({updatedTime:this.model.updatedTime?moment(this.model.updatedTime):null})
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
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            // formData.createdTime = formData.createdTime?formData.createdTime.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.startdate = formData.startdate?formData.startdate.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.updatedTime = formData.updatedTime?formData.updatedTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.startdate = formData.startdate
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

.drawer-bootom-button-left {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
