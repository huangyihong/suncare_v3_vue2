<template>
  <a-card :bordered="false" >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xs="8" >
            <a-form-item label="就诊ID">
              <a-input placeholder="输入就诊ID模糊查询" v-model="queryParam.DWB_MASTER_INFO·VISITID"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="8" >
            <a-form-item label="病人ID">
              <a-input placeholder="输入病人ID模糊查询" v-model="queryParam.DWB_MASTER_INFO·CLIENTID"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xs="8">
              <a-form-item label="病人姓名">
                <a-input placeholder="输入病人姓名模糊查询" v-model="queryParam.DWB_MASTER_INFO·CLIENTNAME"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item label="诊疗项目编码">
                <a-input placeholder="输入诊疗项目编码模糊查询" v-model="queryParam.DWB_CHARGE_DETAIL·ITEMCODE"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item label="诊疗项目名称">
                <a-input placeholder="输入诊疗项目名称模糊查询" v-model="queryParam.DWB_CHARGE_DETAIL·ITEMNAME"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item label="医院ID">
                <a-input placeholder="输入医院ID模糊查询" v-model="queryParam.DWB_MASTER_INFO·ORGID"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item label="医院名称">
                <a-input placeholder="输入医院姓名模糊查询" v-model="queryParam.DWB_MASTER_INFO·ORGNAME"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item label="科室ID">
                <a-input placeholder="输入科室ID模糊查询" v-model="queryParam.DWB_MASTER_INFO·DEPTID"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="8">
              <a-form-item label="科室名称">
                <a-input placeholder="输入科室姓名模糊查询" v-model="queryParam.DWB_MASTER_INFO·DEPTNAME"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :xs="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-show="selectedRowKeys.length > 0">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <span slot="VISITID" slot-scope="text, record">
          <a @click="selectKey(record.VISITID)" style="word-break: break-all">{{text}}</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <review-detail-model ref="reviewDetailModel"></review-detail-model>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { getAction,httpAction,postAction } from '@/api/manage'
  import moment from "moment"
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import ReviewDetailModel from "@/pages/review/modules/reviewDetailModel.vue"

  export default {
    name: "DwbMasterInfoList",
    mixins:[JeecgListMixin, multiSelectIdMatchMixin],
    components: {
      MDictSelectTag,
      ReviewDetailModel
    },
    data () {
      return {
        description: '就诊病例列表',
        // 表头
        columns: [
          {
            title: '就诊流水ID号',
            align:"left",
            dataIndex: 'VISITID',
            width: 300,
            fixed: 'left',
            scopedSlots: { customRender: 'VISITID' },
          },
          {
            title: '就诊机构',
            align: "left",
            dataIndex: 'ORGNAME',
            width: 200,
            //fixed: 'left',
          },
          /*{
            title: '就诊机构ID',
            align: "left",
            dataIndex: 'ORGID',
            width: 200,
            //fixed: 'left',
          },*/
          {
            title: '就诊科室',
            align: "center",
            dataIndex: 'DEPTNAME',
            width: 100,
          },
         /* {
            title: '就诊科室ID',
            align: "center",
            dataIndex: 'DEPTID',
            width: 100,
          },*/
          {
            title: '医生',
            align: "center",
            dataIndex: 'DOCTORNAME',
            width: 100,
          },
          {
            title: '诊断名称',
            align: "center",
            dataIndex: 'DISEASENAME',
            width: 180,
          },
          {
            title: '就诊类型',
            align: "center",
            dataIndex: 'VISITTYPE',
            width: 100,
          },
          {
            title: '参保人姓名',
            align: "center",
            dataIndex: 'CLIENTNAME',
            width: 100,
          },
          {
            title: '性别',
            align: "center",
            dataIndex: 'SEX',
            width: 100,
          },
          {
            title: '参保类型',
            align: "center",
            dataIndex: 'INSURANCETYPE',
            width: 100,
          },
          {
            title: '就诊日期',
            align: "center",
            dataIndex: 'VISITDATE',
            width: 100
          },
          {
            title: '出院日期',
            align: "center",
            dataIndex: 'LEAVEDATE',
            width: 100
          },
          {
            title: '总费用',
            align: "center",
            dataIndex: 'TOTALFEE',

          },
        ],
        url: {
          list: this.$suncare_v3 + "/engine/trail",
        },
        isorter: {
          column: 'VISITID',
          order: 'asc',
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 50,
          pageSizeOptions: ['10', '20', '30','50','100'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
      }
    },
    computed: {
    },
    beforeMount() {
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }

        let params = {}
        params.cols = this.getFieldCols()
        //固定为试算的第一个节点
        params.flowJson = '{"class":"GraphLinksModel","linkFromPortIdProperty":"fromPort","linkToPortIdProperty":"toPort","nodeDataArray":[{"category":"rectangle","text":"计算(ESjs-2)","type":"rect","key":-2,"loc":"-553.9826359480817 -173.97374523422164"}],"linkDataArray":[]}'
        params.isDWS = false
        params.pageSize = this.ipagination.pageSize
        params.pageNo = this.ipagination.current
        params.column = this.isorter.column
        params.order = this.isorter.order
        params.rules = JSON.stringify(this.getQueryParamValue())
        this.loading = true
        postAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      //列表字段
      getFieldCols(){
        let cols = []
        this.columns.forEach(function(value) {
          cols.push(value.dataIndex)
        })
        return cols
      },
      //根据查询条件构造查询rules
      getQueryParamValue(){
        let rules = []
        let orderNo =0
        //查询条件
        for(let key in this.queryParam){
          if(this.queryParam[key]){
            let rule = {"logic":"AND","compareType":"like","groupNo":0,"nodeCode":"-2"}
            rule.tableName = key.split("·")[0]
            rule.colName = key.split("·")[1]
            rule.compareValue =this.queryParam[key]
            rule.orderNo = orderNo++
            rules.push(rule)
          }
        }
        if(this.queryParam.DWB_CHARGE_DETAIL·ITEMCODE||this.queryParam.DWB_CHARGE_DETAIL·ITEMNAME){
          orderNo =0
          for(let key in this.queryParam){
            if(this.queryParam[key]){
              let rule = {"logic":"AND","compareType":"like","groupNo":1,"nodeCode":"-2"}
              rule.tableName = key.split("·")[0]
              if(rule.tableName=='DWB_CHARGE_DETAIL'){
                rule.tableName = 'DWB_ORDER'
              }
              rule.colName = key.split("·")[1]
              rule.compareValue =this.queryParam[key]
              rule.orderNo = orderNo++
              rules.push(rule)
            }
          }
        }
        return rules
      },
      //点击就诊编号选中记录
      selectKey(visitid) {
        this.$refs.reviewDetailModel.title = '就诊记录详情';
        this.$refs.reviewDetailModel.loadData(visitid);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
