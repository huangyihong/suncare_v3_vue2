<template>
    <m-modal centered
             :title="title"
             :visible="visible"
             :width="650"
             class="min-width-0"
             @cancel="handleCancel"
             @ok="handleOk">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="操作" class="m-b-10">
                    <m-dict-select-tag :options="[{code: '1', value: '初审通过'}, {code: '0', value: '撤销初审通过'}]" type="radio" required
                                       v-decorator="['pushStatus', {}]"   @change="selectChange"></m-dict-select-tag>
                </a-form-item>
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="初审数据范围"
                        hasFeedback
                        :validateStatus="validateStatus"
                        :help="help"
                        class="m-b-10">
                    <a-radio-group v-model="assignType"  class="w-b-100" @input="assignTypeChange">
                        <a-radio value="SELECT">
                            已选择的数据
                        </a-radio>
                        <a-radio value="ALL">
                            当前查询条件下的全部数据
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <!--<a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="备注" class="m-b-10">
                    <a-textarea v-decorator="['firReviewRemark', {}]" :autosize="{ minRows: 3, maxRows: 8 }"/>
                </a-form-item>-->
            </a-form>
        </a-spin>
    </m-modal>
</template>

<script>
  import pick from 'lodash/pick'
  import { putAction, getAction } from '@/api-sv3/manage'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  export default {
    name: "ReviewPushModal",
    props: {
      batchId: {
        type: String,
        required: true
      },
      url: {
        type: Object,
        default: () => ({
          save: this.$suncare_v3 + "/reviewManual/pushReviews",
          query: this.$suncare_v3 + '/apiReviewFirst/queryReviewInfoById',
        })
      },
      curPushStatus:''
    },
    components: {
      MDictSelectTag
    },
    data() {
      return {
        title: "初审通过/撤销",
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
        validateStatus: undefined,
        help: '只针对初审状态为黑名单和灰名单的数据进行操作，该操作将把数据状态重置为未推送到用户报告',
        havePushed: false
      }
    },

    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({pushStatus: '1'}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'pushStatus'
            // ,'firReviewRemark'
          ))
        });

      },
      selectChange(data) {
        let obj = data.length > 0 ? data[0] : {}
        if(obj =='0'){
          this.help="撤销初审通过操作，只针对初审状态为通过的数据进行操作"
        }
        else if(obj=='1'){
          this.help="初审通过操作，只针对初审判定状态为黑名单和灰名单的数据进行操作，同时，该操作会将数据状态重置为未推送到用户报告"
        }
      },
      loadData(ids, params, records = []) {
        this.visible = true;
        this.ids = ids
        if(ids.length>0){
          this.assignType = 'SELECT'
        }else{
          this.assignType = 'ALL'
        }
        this.listParams = params
        this.havePushed = records.some(r => r.pushStatus === '1')
        this.assignTypeChange(this.assignType)
        if(ids.length !== 1){
          this.add()
          return
        }
        /*this.confirmLoading = true
        getAction(this.url.query,{id: ids[0], batchId: this.batchId},'get').then((res) => {
          if (res.success) {
            let record = res.result;
            if(!record){
              record = {};
            }
            this.edit(record);
          }else{
            this.$message.warning(res.message);
          }
        }).finally(()=>{
          this.confirmLoading = false
        })*/
      },
      assignTypeChange(val){
        /*if(val === 'SELECT'){
          if(this.havePushed){
            this.validateStatus = 'error'
            this.help = '选中记录中包含已推送记录'
          } else {
            this.validateStatus = this.help = undefined
          }
        } else {
          this.validateStatus = undefined
          this.help = "只会修改未推送记录"
        }*/
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err && this.validateStatus !== 'error') {
            let formData = {}
            formData.reviewInfo = JSON.stringify(values)
            if (this.assignType === 'SELECT') {
              if (this.ids.length === 0) {
                this.$message.warn("请至少勾选一条记录")
                return
              }
              formData.ids = this.ids.join(",");
              if(this.listParams.groupBys){
                Object.assign(formData, this.listParams)
              }
            } else {
              Object.assign(formData, this.listParams)
            }

            formData.batchId = this.batchId
            console.log('formData', formData)
            that.confirmLoading = true;
            putAction(this.url.save, formData).then((res) => {
              if (res.success) {
                let msg = res.result
                that.$message.success(msg);
                that.$emit('ok',msg.endsWith('成功'));
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


    }
  }
</script>

<style lang="less" scoped>

</style>
