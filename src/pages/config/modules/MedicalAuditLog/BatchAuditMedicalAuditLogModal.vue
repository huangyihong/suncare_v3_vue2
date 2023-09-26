<template>
  <m-modal centered
    :title="title"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭" :footer="null">

    <a-spin :spinning="confirmLoading">
      <a-card type="inner">
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

  </m-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import DetailList from '@/components/tools/DetailList'
  import { mapGetters } from 'vuex'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { BatchTaskMixin } from '@/pages/config/modules/MedicalAuditLog/BatchTaskMixin'

  const DetailListItem = DetailList.Item

  export default {
    name: "BatchAuditMedicalAuditLogModal",
    mixins:[BatchTaskMixin],
    components: {
      DetailList,
      DetailListItem
    },
    data () {
      return {
        title:'审核操作',
        visible: false,
        bean: {auditResult:1,auditOpinion:''},
        confirmLoading: false,
        url: {
          saveAuditMedicalAuditLog: "/config/medicalAuditLog/saveAuditMedicalAuditLog",
          saveAuditAll:'',
        },
        userInfoBean: null,
        fntype:'',
      }
    },
    beforeMount(){
      this.userInfoBean = this.userInfo()
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
        if(this.fntype==='batchAudit'&&!this.params.id){//全部审核
          this.saveAllAuditMedicalAuditLog();
        }else{
          this.saveAuditMedicalAuditLog();
        }
      },
      loadData (param) {
        const that = this;
        this.visible = true;
        this.fntype = param.fntype;
        this.params = param.params;
        that.bean = Object.assign(that.bean, param);
        console.dir(that.bean)
        that.bean.auditStaffName = that.userInfoBean.realname;
        that.bean.auditStaff = that.userInfoBean.id;
        that.bean.auditTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      },
      saveAuditMedicalAuditLog(){
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
      saveAllAuditMedicalAuditLog(){
        const that = this;
        that.confirmLoading = true;
        that.params.auditResult1 =that.bean.auditResult;
        that.params.auditOpinion1 =that.bean.auditOpinion;
        that.params.tableName1 =that.bean.tableName;
        getAction(that.url.saveAuditAll,that.params,'get').then((res)=>{
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

        //打开批量操作日志
        this.openImportTaskPage()
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