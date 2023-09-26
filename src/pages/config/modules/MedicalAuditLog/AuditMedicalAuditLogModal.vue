<template>
  <m-modal centered
    title="操作审核"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭" :footer="null">

    <a-tabs defaultActiveKey="2">
      <a-tab-pane tab="审核历史信息" key="1">
        <a-card type="inner" v-for="(logBean, index) in logList" :key="logBean.id">
          <common-log-modal :logBean="logBean"></common-log-modal>
        </a-card>
        <br>

        <div v-if="logList.length===0">
          暂无记录
        </div>
      </a-tab-pane>

      <a-tab-pane tab="操作审核" key="2">
        <a-spin :spinning="confirmLoading">
          <a-card type="inner">
            <common-item-log-modal :logBean="bean"></common-item-log-modal>

            <detail-list size="small" :col="1">
              <detail-list-item term="审核结果">
                <a-radio-group name="auditResult"  v-model="bean.auditResult" :defaultValue="1">
                  <a-radio :value="1">审核通过</a-radio>
                  <a-radio :value="2">审核不通过</a-radio>
                </a-radio-group>
              </detail-list-item>
              <a-divider style="margin: 10px 0" />
            </detail-list>
            <detail-list size="small" :col="1">
              <detail-list-item term="审核意见">
                <a-textarea placeholder="请输入审核意见" :rows="3" v-model="bean.auditOpinion"/>
              </detail-list-item>
              <a-divider style="margin: 10px 0" />
            </detail-list>
            <detail-list size="small">
              <detail-list-item term="审核人">{{bean.auditStaffName}}</detail-list-item>
              <detail-list-item term="审核时间">{{bean.auditTime}}</detail-list-item>
            </detail-list>
          </a-card>
        </a-spin>
        <br>
        <div class="drawer-bootom-button">
          <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
          <a-button  @click="handleCancel">取消</a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </m-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import DetailList from '@/components/tools/DetailList'
  import CommonLogModal from './CommonLogModal'
  import CommonItemLogModal from './CommonItemLogModal'

  const DetailListItem = DetailList.Item

  export default {
    name: "ShowMedicalAuditLogModal",
    components: {
      DetailList,
      DetailListItem,
      CommonLogModal,
      CommonItemLogModal
    },
    data () {
      return {
        visible: false,
        logList: [],
        bean: {auditOpinion:''},
        confirmLoading: false,
        url: {
          showMedicalAuditLog: "/config/medicalAuditLog/showMedicalAuditLog",
          saveAuditMedicalAuditLog: "/config/medicalAuditLog/saveAuditMedicalAuditLog",
        },
        userInfoBean: null,
        actionTypeOptions:[],
        auditResultOptions:[],
      }
    },
    beforeMount(){
      this.userInfoBean = this.userInfo()
      this.initDictConfig();
    },
    methods: {
      ...mapGetters(["userInfo"]),
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      handleOk () {
        const that = this;
        that.confirmLoading = true;
        httpAction(that.url.saveAuditMedicalAuditLog,that.bean,'put').then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.$emit('ok');
            that.close();
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })
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
      loadData (param) {
        const that = this;
        this.visible = true;
        getAction(this.url.showMedicalAuditLog,param,'get').then((res) => {
          if (res.success) {
            console.dir(res.result)
            that.logList = []
            res.result.forEach(function (item, index) {
              if(item.actionContent){
                item.actionContentJson = JSON.parse(item.actionContent)
              }
              item.actionType_dictText = filterDictText(that.actionTypeOptions, item.actionType);
              item.auditResult_dictText = filterDictText(that.auditResultOptions, item.auditResult);
              if(index===0){
                that.bean = item
                that.bean.auditResult = 1
                that.bean.auditStaffName = that.userInfoBean.realname;
                that.bean.auditStaff = that.userInfoBean.id;
                that.bean.auditTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              }else{
                that.logList.push(item)
              }
            })
          }else{
            that.$message.warning(res.message);
          }
        })
      }
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