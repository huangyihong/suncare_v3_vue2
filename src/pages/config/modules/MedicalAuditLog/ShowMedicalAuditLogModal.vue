<template>
  <m-modal centered
    title="审核信息查看"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭" :footer="null">

    <a-card type="inner" v-for="(logBean, index) in logList" :key="logBean.id" style="margin-bottom: 10px">
      <common-log-modal :logBean="logBean"></common-log-modal>
    </a-card>
    <br>
    <div v-if="logList.length===0">
      暂无记录
    </div>

  </m-modal>
</template>

<script>
  import { getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import CommonLogModal from './CommonLogModal'

  export default {
    name: "ShowMedicalAuditLogModal",
    components: {
      CommonLogModal,
    },
    data () {
      return {
        visible: false,
        logList: [],
        confirmLoading: false,
        url: {
          showMedicalAuditLog: "/config/medicalAuditLog/showMedicalAuditLog",
        },
        actionTypeOptions:[],
        auditResultOptions:[],
      }
    },
    beforeMount(){
      this.initDictConfig();
    },
    methods: {
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      initDictConfig() {
        //初始化字典
        initDictOptions('audit_actionType').then((res) => {
          if (res.success) {
            this.actionTypeOptions = res.result;
          }
        });
        initDictOptions('base_auditResult').then((res) => {
          if (res.success) {
            this.auditResultOptions = res.result;
          }
        });
      },
      //初始加载审核日志信息
      loadData (param) {
        const that = this;
        this.visible = true;
        getAction(this.url.showMedicalAuditLog,param,'get').then((res) => {
          if (res.success) {
            that.logList = []
            res.result.forEach(function (item) {
              if(item.actionContent){//修改内容
                item.actionContentJson = JSON.parse(item.actionContent)
              }
              item.actionType_dictText = filterDictText(that.actionTypeOptions, item.actionType);
              item.auditResult_dictText = filterDictText(that.auditResultOptions, item.auditResult);
              that.logList.push(item)
            })
          }else{
            that.$message.warning(res.message);
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>

</style>