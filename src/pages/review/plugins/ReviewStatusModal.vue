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
        <a-form-item v-if="stepAi"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="Pr概率范围" class="m-b-10">
          <a-input-number placeholder="精确查询" v-model="probility_begin" :min="0" :max="1" class="search-divider-item"></a-input-number>
          <div class="search-divider">~</div>
          <a-input-number placeholder="精确查询" v-model="probility_end" :min="0" :max="1" class="search-divider-item"></a-input-number>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="stepAi?'AI打标结果':'判定结果'" class="m-b-10">
          <a-radio-group  @change="e => reviewStatus = e.target.value"
                          v-decorator="[step2?'secReviewStatus':stepAi?'predictLabel':'firReviewStatus', validatorRules.required]">
            <a-radio key="blank" value="blank">黑名单</a-radio>
            <a-radio key="white" value="white" v-if="!stepAi">白名单</a-radio>
            <a-radio key="grey" value="grey">灰名单</a-radio>
            <a-radio key="init" value="init">未判定</a-radio>
            <a-radio key="range" value="range" v-if="step2" style="margin-top: 6px">以初审判定结果作为复审判定的结果</a-radio>

          </a-radio-group>

        </a-form-item>
        <a-form-item v-if="!stepAi"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="判定数据范围"
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
        <a-form-item
        v-if="reviewStatus === 'white'&&!stepAi"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="白名单归因" class="m-b-10">
        <other-dict-select-tag  placeholder="请选择" dictEname="reasontype"
                                v-decorator="[step2?'secReviewClassify':'firReviewClassify', {}]"/>
      </a-form-item>
        <a-form-item v-if="!stepAi"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="判定理由" class="m-b-10">
          <a-textarea v-decorator="[step2?'secReviewRemark':'firReviewRemark', {}]"
                      :autosize="{ minRows: 3, maxRows: 8 }"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </m-modal>
</template>

<script>
  import pick from 'lodash/pick'
  import { putAction, getAction } from '@/api-sv3/manage'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  export default {
    name: 'ReviewStatusModal',
    props: {
      batchId: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      step2: {
        type: Boolean,
        required: false
      },
      stepAi: {
        type: Boolean,
        required: false
      }

    },
    components: {
      MDictSelectTag,
      OtherDictSelectTag,
    },
    data() {
      return {
        title: '初审判定',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          required: { rules: [{ required: true, message: '这是必填项!' }, { whitespace: true, message: '值不能是空格!' }] },
          requiredOnly: { rules: [{ required: true, message: '这是必填项!' }] }
        },
        ids: [],
        listParams: [],
        assignType: 'SELECT',
        validateStatus: undefined,
        help: undefined,
        havePushed: false,
        reviewStatus: undefined,
        copyReviewStatusUrl:this.$suncare_v3 +'/apiReviewSec/copyReviewStatus',
        probility_begin:0,
        probility_end:1,
      }
    },
    methods: {
      loadData(ids, params, records) {
        this.visible = true
        this.ids = ids
        if(ids.length>0){
          this.assignType = 'SELECT'
        }else{
          this.assignType = 'ALL'
        }
        this.listParams = params
        this.havePushed = records.some(r => r.pushStatus === '1')
        this.assignTypeChange(this.assignType)

        this.$nextTick(() => {
          let field = this.step2?'secReviewStatus':this.stepAi?'predictLabel':'firReviewStatus'
          this.form.setFieldsValue({[field]:'blank'})
        })

      },
      assignTypeChange(val) {
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
        this.visible = false
      },
      handleCancel() {
        this.close()
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err && this.validateStatus !== 'error') {
            let url = this.url
            if(this.reviewStatus !== 'white'&& !this.stepAi) {
              values[this.step2?'secReviewClassify':'firReviewClassify'] = ''
            }
            if(this.reviewStatus === 'range'){
              url = this.copyReviewStatusUrl
            }
            let formData = {}
            formData.reviewInfo = JSON.stringify(values)

            if (this.stepAi) {//AI结果打标
              if(this.probility_begin || this.probility_end){
                formData.probility_begin = this.probility_begin
                formData.probility_end = this.probility_end
              }else{
                this.$message.warn('Pr概率范围请至少填一个')
                return
              }
            }else{
              if (this.assignType === 'SELECT') {
                if (this.ids.length === 0) {
                  this.$message.warn('请至少勾选一条记录')
                  return
                }
                formData.ids = this.ids.join(',')
                if (this.listParams.groupBys) {
                  Object.assign(formData, this.listParams)
                }
              } else {
                Object.assign(formData, this.listParams)
              }
            }


            formData.batchId = this.batchId

            that.confirmLoading = true
            putAction(url, formData).then((res) => {
              if (res.success) {
                let msg = res.result
                that.$message.success(msg)
                that.$emit('ok', msg.endsWith('成功'))
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      }


    }
  }
</script>

<style lang="less" scoped>
</style>
