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
          label="药品名称">
          <a-input placeholder="请输入药品名称" v-decorator="['drugName', validatorRules.required]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="限制类型">
          <m-dict-select-tag  placeholder="请输入限制类型" dictCode="DC_DRUG_LIMIT_TYPE"  v-decorator="['limitType', validatorRules.required]"></m-dict-select-tag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="限制内容">
          <a-input placeholder="请输入限制内容" v-decorator="['limitContent', validatorRules.required]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="药品分类">
          <a-input placeholder="请输入药品分类" v-decorator="['drugType', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="药品分类(小)">
          <a-input placeholder="请输入药品分类(小)" v-decorator="['drugTypeSmall', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="医保类别">
          <a-input placeholder="请输入医保类别" v-decorator="['funType', {}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="剂型">
          <a-input placeholder="请输入剂型" v-decorator="['dosageType', {}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入备注" v-decorator="['remark', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="整理人">
          <a-input placeholder="请输入整理人" v-decorator="['sorter', {}]"/>
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
import {httpAction} from '@/api/manage'
import pick from 'lodash/pick'
import moment from "moment"
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

export default {
  name: "YbChargeDrugModal",
  components: {
    MDictSelectTag
  },
  data() {
    return {
      title: "操作",
      visible: false,
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: "/ybChargeSearch/ybChargeDrugRule/add",
        edit: "/ybChargeSearch/ybChargeDrugRule/edit",
      },
      validatorRules: {
        required: {rules: [{required: true, message: '这是必填项!'}, {whitespace: true, message: '值不能是空格!'}]},
        requiredOnly: {rules: [{required: true, message: '这是必填项!'}]},
      },
    }
  },
  created() {
  },
  methods: {
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'createdBy', 'createdByName', 'dosageType', 'drugName', 'drugType', 'drugTypeSmall', 'examineStatus', 'funType', 'limitType','limitContent','remark', 'sorter', 'updatedBy', 'updatedByName'))
        //时间格式化
        this.form.setFieldsValue({createdTime: this.model.createdTime ? moment(this.model.createdTime) : null})
        this.form.setFieldsValue({updatedTime: this.model.updatedTime ? moment(this.model.updatedTime) : null})
      });

    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {

      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }

          let formData = Object.assign(this.model, values);
          console.log(formData)

          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })


        }
      })
    },
    handleCancel() {
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

.number-input {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}
</style>
