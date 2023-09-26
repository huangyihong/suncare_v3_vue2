<template>
  <m-modal
    ref="modal"
    centered
    :title="title"
    :bodyStyle="{padding: '10px 24px 0 24px'}"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    destroyOnClose
    @cancel="handleCancel"
    @max="isMax=> {isMax? heightRatio+=0.2: heightRatio-=0.2}"
    :footer="null">
    <a-layout >
      <a-layout-sider style="background-color: white">
        <a-anchor class="m-t-20" :affix="false" showInkInFixed :getContainer="modalBody" @click="handleClick">
          <a-anchor-link href="#patientInfo" title="患者个人信息"/>
          <a-anchor-link href="#patientInfo2" title="住院信息"/>
          <a-anchor-link href="#patientInfo3" title="医保结算信息"/>
          <a-anchor-link href="#patientInfo4" title="住院诊断服务明细"/>

        </a-anchor>
      </a-layout-sider>
      <a-layout-content id="content"  style="background: #f0f2f5;overflow: auto" :style="{height:tabHeight}">
        <div id="patientInfo" class="content-item">
          <a-card hoverable title="患者个人信息"  :loading="clientBeanLoading">
            <detail-list col="4">
              <detail-list-item term="医保个人编号">{{clientBean.clientid}}</detail-list-item>
              <detail-list-item term="姓名">{{clientBean.clientname}}</detail-list-item>
              <detail-list-item term="性别">{{clientBean.sex}}</detail-list-item>
              <detail-list-item term="出生时间">{{clientBean.birthday}}</detail-list-item>
              <detail-list-item term="出生体重(婴儿)"></detail-list-item>
              <detail-list-item term="身份证号">{{clientBean.idNo}}</detail-list-item>
              <detail-list-item term="参保类型">{{clientBean.insurancetype}}</detail-list-item>
              <detail-list-item term="住址">{{clientBean.address}}</detail-list-item>
              <detail-list-item term="联系电话">{{clientBean.clientphone}}</detail-list-item>
            </detail-list>
          </a-card>
        </div>
        <div id="patientInfo2" class="content-item">
          <a-card hoverable title="住院信息">
            <detail-list col="4">
              <detail-list-item term="住院唯一识别号"></detail-list-item>
              <detail-list-item term="住院号"></detail-list-item>
              <detail-list-item term="医保住院登记号"></detail-list-item>
              <detail-list-item term="医疗机构"></detail-list-item>
              <detail-list-item term="住院类型"></detail-list-item>
              <detail-list-item term="入院日期"></detail-list-item>
              <detail-list-item term="出院日期"></detail-list-item>
              <detail-list-item term="住院天数"></detail-list-item>
              <detail-list-item term="结算日期"></detail-list-item>
              <detail-list-item term="入院科室"></detail-list-item>
              <detail-list-item term="出院科室"></detail-list-item>
              <detail-list-item term="入院途径"></detail-list-item>
              <detail-list-item term="离院方式"></detail-list-item>
              <detail-list-item term="入院诊断"></detail-list-item>
              <detail-list-item term="入院诊断编码"></detail-list-item>
            </detail-list>
            <detail-list col="2">
              <detail-list-item term="抢救次数"></detail-list-item>
              <detail-list-item term="抢救成功次数"></detail-list-item>
            </detail-list>
            <detail-list col="2">
              <detail-list-item term="是否有出院31天再入院计划"></detail-list-item>
              <detail-list-item term="出院31天再入院计划目的"></detail-list-item>
            </detail-list>
            <detail-list col="4">
              <detail-list-item term="是否实行临床路径管理"></detail-list-item>
              <detail-list-item term="是否完成临床路径管理"></detail-list-item>
              <detail-list-item term="是否日间手术"></detail-list-item>
            </detail-list>
            <detail-list col="2">
              <detail-list-item term="医疗总费用"></detail-list-item>
              <detail-list-item term="分类医疗费用信息"></detail-list-item>
            </detail-list>
            <detail-list col="1">
              <detail-list-item term="出院主要诊断编码"></detail-list-item>
              <detail-list-item term="出院主要诊断"></detail-list-item>
              <detail-list-item term="出院次要诊断编码1"></detail-list-item>
              <detail-list-item term="出院次要诊断1"></detail-list-item>
              <detail-list-item term="出院次要诊断编码2"></detail-list-item>
              <detail-list-item term="出院次要诊断2"></detail-list-item>
              <detail-list-item term="主要手术和操作编码"></detail-list-item>
              <detail-list-item term="主要手术和操作名称"></detail-list-item>
              <detail-list-item term="主要手术和操作时间"></detail-list-item>
              <detail-list-item term="主要手术和操作编码1"></detail-list-item>
              <detail-list-item term="主要手术和操作名称1"></detail-list-item>
              <detail-list-item term="主要手术和操作时间1"></detail-list-item>
            </detail-list>
          </a-card>
        </div>
        <div id="patientInfo3" class="content-item">
          <a-card hoverable title="医保结算信息" :loading="settlementBeanLoading">
            <detail-list col="4">
              <detail-list-item term="住院唯一识别号">{{settlementBean.settlementid}}</detail-list-item>
              <detail-list-item term="医保病人登记号">{{settlementBean.clientid}}</detail-list-item>
              <detail-list-item term="住院总费用">{{settlementBean.totalfee}}</detail-list-item>
              <detail-list-item term="起付线"></detail-list-item>
              <detail-list-item term="报销比例">{{settlementBean.fundProp}}</detail-list-item>
              <detail-list-item term="列入报销范围费用">{{settlementBean.fundCover}}</detail-list-item>
              <detail-list-item term="基本医保补偿金额">{{settlementBean.allfundPay}}</detail-list-item>
              <detail-list-item term="患者自付金额">{{settlementBean.selfpay}}</detail-list-item>
              <detail-list-item term="不予报销金额">{{settlementBean.refuseFee}}</detail-list-item>
              <detail-list-item term="大病保险补偿金额">{{settlementBean.seriousillCover}}</detail-list-item>
              <detail-list-item term="其他补偿金额">{{settlementBean.otherPay}}</detail-list-item>
              <detail-list-item term="单病种编码"></detail-list-item>
              <detail-list-item term="单病种名称"></detail-list-item>
              <detail-list-item term="单病种补偿标准"></detail-list-item>
            </detail-list>
          </a-card>
        </div>
        <div id="patientInfo4" class="content-item">
          <a-card hoverable title="住院诊断服务明细">
            <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="false"
              :loading="loading"
              :scroll="{ x: scrollX}"
              @change="handleTableChange"
              v-bind="tableAttrs">

            </a-table>
          </a-card>
        </div>
      </a-layout-content>
    </a-layout>
  </m-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: "visitInfoModal",
  mixins:[JeecgListMixin],
  components: {
    DetailList,
    DetailListItem
  },
  data() {
    return {
      title: "病历详情",
      visible: false,
      model: {},
      confirmLoading: false,
      heightRatio: 0.8,
      // 表头

      columns: [
        {
          title: '服务项目代码',
          align:"left",
          dataIndex: 'diseasecode1',
          width:120,
        },{
          title: '服务项目名称',
          align:"left",
          dataIndex: 'diseasecode2',
          width:120,
        },{
          title: '服务项目类别',
          align:"left",
          dataIndex: 'diseasecode3',
          width:120,
        },{
          title: '使用数量',
          align:"left",
          dataIndex: 'diseasecode4',
          width:100,
        },{
          title: '计价单位',
          align:"left",
          dataIndex: 'diseasecode5',
          width:100,
        },{
          title: '单价',
          align:"left",
          dataIndex: 'diseasecode6',
          width:100,
        },{
          title: '剂型',
          align:"left",
          dataIndex: 'diseasecode7',
          width:100,
        },{
          title: '规格',
          align:"left",
          dataIndex: 'diseasecode',
          width:100,
        },{
          title: '费用小计',
          align:"left",
          dataIndex: 'diseasecode8',
          width:100,
        },{
          title: '医保报销目录类别',
          align:"left",
          dataIndex: 'diseasecode9',
          width:140,
        },{
          title: '医保政策支付比例',
          align:"left",
          dataIndex: 'diseasecode10',
          width:140,
        },{
          title: '医保政策支付金额',
          align:"left",
          dataIndex: 'diseasecode11',
          width:140,
        }
      ],
      url: {
        list: '',
        queryClientById:'/drg/drgTask/queryClientById',
        getSrcYbSettlementById:'/drg/drgTask/getSrcYbSettlementById',
      },
      initLoad: false,
      clientBean:{},
      clientBeanLoading:false,
      settlementBean:{},
      settlementBeanLoading:false,
    }
  },
  computed: {
    ...mapGetters(["height"]),
    tabHeight() {
      let y = this.height * this.heightRatio - 111
      return (y < 200 ? 200 : y) + 'px'
    }
  },
  methods: {
    modalBody() {
      return document.getElementById('content');
    },
    handleClick(e, link) {
      e.preventDefault();
    },
    close() {
      this.$emit('close');

      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    loadData(record){
      this.visible = true;
      this.loadClientBean(record.clientid)
      this.loadSettlementBean(record.clientid,record.visitid)

    },
    loadClientBean(clientid){
      this.clientBeanLoading = true
      getAction(this.url.queryClientById, {clientid}).then((res) => {
        if (res.success) {
          this.clientBean = res.result
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.clientBeanLoading = false;
      })
    },
    loadSettlementBean(clientid,visitid){
      this.settlementBeanLoading = true
      getAction(this.url.getSrcYbSettlementById, {clientid,visitid}).then((res) => {
        if (res.success) {
          this.settlementBean = res.result
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.settlementBeanLoading = false;
      })
    },
  }
}
</script>
<style lang="less" scoped>
  .content-item {
    padding: 10px 10px 0 10px;
    .ant-card-hoverable{
      cursor: auto;
    }
  }
  .content-item:last-child {
    padding: 10px 10px 10px 10px;
  }
</style>