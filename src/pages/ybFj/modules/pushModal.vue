<template>
  <m-modal centered
           :title="title"
           :width="500"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleOk"
           @cancel="handleCancel"
           cancelText="取消" okText="提交">

    <div>
      <a-spin :spinning="confirmLoading">
        <div class="table-page-search-wrapper">
          <a-form :form="form">
            <!--<a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="推送数据">
              <a-select v-model="assignType" >
                <a-select-option value="SELECT">已选择的数据</a-select-option>
                <a-select-option value="ALL">当前查询条件下的全部数据</a-select-option>
              </a-select>
            </a-form-item>-->
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="推送环节">
              <a-select v-model="step" >
                <a-select-option value="hosp" v-if="currStep=='submit'">医院复核</a-select-option>
                <a-select-option value="cut" v-if="currStep=='submit'||currStep=='hosp'">线上核减</a-select-option>
                <a-select-option value="onsite">现场检查</a-select-option>
              </a-select>
            </a-form-item>

          </a-form>
        </div>
      </a-spin>
    </div>
  </m-modal>
</template>

<script>
import pick from 'lodash/pick'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import { postAction} from '@/api-sv3/manage'

export default {
  name: "pushModal",
  components: {
    MDictSelectTag
  },
  props:['currStep'],
  data() {
    return {
      title: '推送其他环节',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      url: {
        push: "/fj/clue/push"
      },
      assignType:'SELECT',
      step:'onsite',
      clueIds: [],
      listParams: [],

    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    loadData(clueIds, params) {
      this.visible = true;
      this.clueIds = clueIds
    },
    handleOk(){
      if(!this.assignType){
        this.$message.warning('请选择推送数据范围')
        return
      }
      if(!this.step){
        this.$message.warning('请选择推送环节')
        return
      }
      let url = ''
      let params = {step:this.step}
      if (this.assignType === 'SELECT') {
        if (!this.clueIds||this.clueIds.length === 0) {
          this.$message.warn("请至少勾选一条记录")
          return
        }
        url = this.url.push
        params.clueIds = this.clueIds.join(",")
      }
      this.confirmLoading = true
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
