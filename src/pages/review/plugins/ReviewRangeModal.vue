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
                        label="数据范围"
                        hasFeedback
                        :validateStatus="validateStatus"
                        :help="help"
                        class="m-b-10">
                    <a-radio-group v-model="assignType" class="w-b-100" @input="assignTypeChange">
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
                        label="判定理由" class="m-b-10">
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
    name: "ReviewStatusModal",
    props: {
      batchId: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
    },
    components: {
      MDictSelectTag
    },
    data() {
      return {
        title: "初审合格范围",
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
        help: undefined,
        havePushed: false
      }
    },
    methods: {
      loadData(ids, params, records) {
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
            putAction(this.url, formData).then((res) => {
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
