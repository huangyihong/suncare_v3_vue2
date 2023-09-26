<template>
  <m-modal centered
    title="一键清理"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭" :footer="null">
    <a-spin :spinning="confirmLoading">
    <a-card type="inner">


      <detail-list size="small" :col="1">
        <detail-list-item term="一键清理原因">
          <a-textarea placeholder="请输入一键清理原因" :rows="3" v-model="bean.actionReason"/>
        </detail-list-item>
        <a-divider style="margin: 10px 0" />
      </detail-list>

      <detail-list size="small">
        <detail-list-item term="清理人">{{bean.actionStaffName}}</detail-list-item>
        <detail-list-item term="清理时间">{{bean.actionTime}}</detail-list-item>
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
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash/pick'
  import moment from "moment"
  import { mapGetters } from 'vuex'
  import DetailList from '@/components/tools/DetailList'
  import { BatchTaskMixin } from '@/pages/config/modules/MedicalAuditLog/BatchTaskMixin'

  const DetailListItem = DetailList.Item

  export default {
    name: "CleanMedicalAuditLogModal",
    mixins:[BatchTaskMixin],
    components: {
      DetailList,
      DetailListItem
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        url: "/config/medicalOtherDict/saveCleanMedicalOtherDict",
        bean: {actionReason1:''},
        userInfoBean: null,
        params:{},
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
        const that = this;
        that.confirmLoading = true;
        that.params.actionReason1 = that.bean.actionReason
        that.params.tableName1 = that.bean.tableName
        getAction(that.url,that.params,'get').then((res)=>{
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
      loadData (param) {
        const that = this;
        this.visible = true;
        that.params = param.params;
        that.bean.tableName = param.tableName;
        that.bean.actionStaffName = that.userInfoBean.realname;
        //that.bean.actionStaff1 = that.userInfoBean.id;
        that.bean.actionTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
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