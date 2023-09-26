<template>
  <m-modal centered
           :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核结果" class="m-b-10">
          <a-radio-group v-model="bean.auditState" class="w-b-100">
            <a-radio value="finish">通过</a-radio>
            <a-radio value="fail">不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核意见" class="m-b-10">
          <a-textarea placeholder="请输入审核意见" :rows="3" v-model="bean.auditOpinion"/>
        </a-form-item>

      </a-form>
      <br>
      <br>
      <br>
      <div class="drawer-bootom-button">
        <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
        <a-button  @click="handleCancel">取消</a-button>
      </div>
    </a-spin>


  </m-modal>
</template>

<script>
import { postAction} from '@/api-sv3/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
export default {
  name: "auditModel",
  components: {
    MDictSelectTag,
  },
  data() {
    return {
      title:'审核操作',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
      form: this.$form.createForm(this),
      confirmLoading:false,
      url: {
        audit: "/fj/clue/audit",
        auditBatch:"/fj/clue/auditBatch",
      },
      bean: {auditState:'finish',auditOpinion:''},
      params:{},
      fntype:'',

    }
  },
  methods: {
    close () {
      this.visible = false;
    },
    handleCancel () {
      this.close()
    },
    loadData (param) {
      this.form.resetFields();
      this.visible = true;
      this.fntype = param.fntype;
      this.params = param;
      this.bean = Object.assign({}, {auditState:'finish',auditOpinion:''});
    },
    handleOk () {
      let url = this.url.audit
      let params =Object.assign({},this.bean);
      if(this.fntype==='auditBatch'&&!this.params.clueId){//批量审核
        url = this.url.auditBatch
        params.clueIds = this.params.clueIds
      }else{
        params.clueId = this.params.clueId
      }
      console.log(params);
      postAction(url,params).then((res)=>{
        if(res.success){
          this.$message.success(res.message);
          this.$emit('ok');
          this.close();
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
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