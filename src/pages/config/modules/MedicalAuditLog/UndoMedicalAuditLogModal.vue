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
      <template v-if="fntype!=='batchUndo'">
        <common-item-log-modal :logBean="bean"></common-item-log-modal>

      <detail-list size="small" :col="1">
        <detail-list-item term="审核结果">{{bean.auditResult_dictText}}</detail-list-item>
        <a-divider style="margin: 10px 0" />
      </detail-list>
      </template>

      <detail-list size="small" :col="1">
        <detail-list-item term="撤销原因">
          <a-textarea placeholder="请输入撤销原因" :rows="3" v-model="undoBean.actionReason"/>
        </detail-list-item>
        <a-divider style="margin: 10px 0" />
      </detail-list>
      <detail-list size="small">
        <detail-list-item term="撤销人">{{undoBean.actionStaffName}}</detail-list-item>
        <detail-list-item term="撤销时间">{{undoBean.actionTime}}</detail-list-item>
      </detail-list>
    </a-card>
    </a-spin>
    <br>
    <br>
    <div class="drawer-bootom-button">
      <a-button type="primary" @click="handleOk"  style="margin-right: .8rem">提交</a-button>
      <a-button  @click="handleCancel">取消</a-button>
    </div>

  </m-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api-sv3/manage'
  import pick from 'lodash/pick'
  import moment from "moment"

  import { mapGetters } from 'vuex'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import CommonItemLogModal from './CommonItemLogModal'
  import DetailList from '@/components/tools/DetailList'
  import { BatchTaskMixin } from '@/pages/config/modules/MedicalAuditLog/BatchTaskMixin'

  const DetailListItem = DetailList.Item

  export default {
    name: "UndoMedicalAuditLogModal",
    mixins:[BatchTaskMixin],
    components: {
      DetailList,
      DetailListItem,
      CommonItemLogModal
    },
    data () {
      return {
        title:'撤销操作',
        visible: false,
        confirmLoading: false,
        url: {
          showMedicalAuditLog: "/config/medicalAuditLog/showMedicalAuditLog",
          saveUndoMedicalAuditLog: "/config/medicalAuditLog/saveUndoMedicalAuditLog",
          saveUndoAllMedicalAuditLog: "/config/medicalOtherDict/saveUndoAllMedicalAuditLog",
        },
        bean: {},
        undoBean: {actionReason:''},
        userInfoBean: null,
        actionTypeOptions:[],
        auditResultOptions:[],
        fntype:'',
        params:{},
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
        console.dir(this.params)
        if(this.fntype==='batchUndo'&&!this.params.id){//全部撤销
          this.saveUndoAllMedicalAuditLog();
        }else{
          this.saveUndoMedicalAuditLog();
        }
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
        this.visible = true;
        this.fntype = param.fntype;
        if(this.fntype==='batchUndo'){
          this.params = param.params;
          this.undoBean.recordKey = param.id;
          this.undoBean.tableName = param.tableName;
          this.undoBean.actionStaffName = this.userInfoBean.realname;
          this.undoBean.actionStaff = this.userInfoBean.id;
          this.undoBean.actionTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        }else{
          this.getAuditLog(param);
        }
      },
      getAuditLog(param){
        const that = this;
        getAction(this.url.showMedicalAuditLog,param,'get').then((res) => {
          if (res.success) {
            let logList = res.result
            if(logList.length>0){
              let item = logList[0]
              if(item.actionContent){
                item.actionContentJson = JSON.parse(item.actionContent)
              }
              item.actionType_dictText = filterDictText(that.actionTypeOptions, item.actionType);
              item.auditResult_dictText = filterDictText(that.auditResultOptions, item.auditResult);
              that.bean = item;
              that.undoBean.id = that.bean.id;
              that.undoBean.recordKey = that.bean.recordKey;
              that.undoBean.tableName = that.bean.tableName;
              that.undoBean.actionStaffName = that.userInfoBean.realname;
              that.undoBean.actionStaff = that.userInfoBean.id;
              that.undoBean.actionTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            }else{
              that.$message.warning('操作异常，无操作记录');
            }
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      saveUndoMedicalAuditLog(){
        const that = this;
        that.confirmLoading = true;
        httpAction(that.url.saveUndoMedicalAuditLog,that.undoBean,'put').then((res)=>{
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
      saveUndoAllMedicalAuditLog(){
        const that = this;
        that.confirmLoading = true;
        that.params.tableName1 =that.undoBean.tableName;
        that.params.actionReason1 =that.undoBean.actionReason;
        getAction(that.url.saveUndoAllMedicalAuditLog,that.params,'get').then((res)=>{
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