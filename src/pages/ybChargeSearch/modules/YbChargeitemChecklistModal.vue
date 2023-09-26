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
          label="收费项目A编码">
          <a-input placeholder="请输入收费项目A编码" v-decorator="['itemCode1', validatorRules.required]" />
        </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="收费项目A名称">
            <a-input placeholder="请输入收费项目A名称" v-decorator="['packageItem1', validatorRules.required]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="收费项目A关键字">
            <a-input placeholder="请输入收费项目A关键字" v-decorator="['itemname', validatorRules.required]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
        <a-form-item
          :labelCol="labelCol2"
          :wrapperCol="wrapperCol2"
          label="收费项目B编码">
          <a-input placeholder="请输入收费项目B编码" v-decorator="['itemCode2', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="收费项目B名称">
            <a-input placeholder="请输入收费项目B名称" v-decorator="['packageItem2', {}]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="收费项目B关键字">
            <a-input placeholder="请输入收费项目B关键字" v-decorator="['itemname1', {}]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="收费项目名称类型" >
            <m-dict-select-tag placeholder="请选择收费项目名称类型" dictCode="ITEM_TYPE"  :required="true" v-decorator="['itemType', {}]"></m-dict-select-tag>

          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="重复收费类型">
            <m-dict-select-tag  placeholder="请选择重复收费类型" dictCode="ITEM1_TYPE"  v-decorator="['item1Type', {}]"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="收费项目B违规判断">
            <m-dict-select-tag  placeholder="请选择收费项目B违规判断" dictCode="ITEM1_WGTYPE"  v-decorator="['item1Wgtype', {}]"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="超量检查的类型">
            <m-dict-select-tag  placeholder="请选择超量检查的类型" dictCode="QTY_TYPE"  v-decorator="['qtyType', {}]"></m-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
        <a-form-item
          :labelCol="labelCol2"
          :wrapperCol="wrapperCol2"
          label="超量的数值(不含)">
          <a-input-number placeholder="超量的数值(不含)" class="number-input" v-decorator="[ 'qtyNum', {}]" />
        </a-form-item>
        </a-col>

        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="是否输出同一天的手术项目">
            <m-dict-select-tag placeholder="请选择是否输出同一天的手术项目" dictCode="YESNO"  :required="false" v-decorator="['isSameDay', {}]"></m-dict-select-tag>

          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="违规案例提示">
            <a-input placeholder="请输入违规案例提示" v-decorator="['wgCaseExample', {}]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-form-item
            :labelCol="labelCol2"
            :wrapperCol="wrapperCol2"
            label="整理人">
            <a-input placeholder="请输入整理人" v-decorator="['sorter', {}]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="24">
         <br>
        </a-col>

<!--        <a-col :md="24" :sm="24">-->
<!--          <a-form-item-->
<!--            :labelCol="labelCol2"-->
<!--            :wrapperCol="wrapperCol2"-->
<!--            label="审核状态">-->

<!--            <m-dict-select-tag dictCode="EXAMINE_STATUS" :required="false" class="loginList-select" v-decorator="['examineStatus', {}]" ></m-dict-select-tag>-->

<!--          </a-form-item>-->
<!--        </a-col>-->

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
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

  export default {
    name: "YbChargeitemChecklistModal",
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
          sm: { span: 16 },
        },
        labelCol2: {
          xs: {span: 24},
          sm: {span: 9},
        },
        wrapperCol2: {
          xs: {span: 24},
          sm: {span: 15},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: {rules: [{required: true, message: '这是必填项!'}, {whitespace: true, message: '值不能是空格!'}]},
          requiredOnly: {rules: [{required: true, message: '这是必填项!'}]},
        },
        url: {
          add: "/ybChargeSearch/ybChargeitemChecklist/add",
          edit: "/ybChargeSearch/ybChargeitemChecklist/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add(record) {
        let newRecord
        if (record) {
          newRecord = {...record}
          delete newRecord.itemname
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
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'itemCode1','packageItem1','itemname','itemCode2','packageItem2','itemname1','itemType','item1Type','item1Wgtype','qtyType','qtyNum','isSameDay','wgCaseExample','sorter'))
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
