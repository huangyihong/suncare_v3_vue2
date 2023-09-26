<template>
  <m-modal centered
           :title="title"
           width="80%"
           :visible="visible"
           @cancel="handleCancel"
           cancelText="关闭" :footer="null">

    <div>
      <div style="text-align: center;font-size: 22px;padding-bottom: 10px">
        <span>{{resultTitle}}</span>
      </div>
      <a-tabs v-model="activeKey">
        <a-tab-pane key="1" tab="查询结果预览">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :scroll="{ x: scrollX, y: 'calc(100vh - 280px)' }"
            v-bind="tableAttrs"
            @change="handleTableChange"></a-table>
          <div style="color: darkgrey;padding-top: 10px; margin-bottom: -4px;" >
            注：<span v-if="model.isFundpay!='1'">不包含自费病人数据; </span>默认预览前50条记录。
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="查询条件预览" v-if="model.taskType=='search'">
          <a-table bordered
                   :columns="columns2"
                   :dataSource="dataSource2"
                   :pagination="ipagination2"
                   :scroll="{ x: scrollX, y: 'calc(100vh - 260px)' }"
                   size="middle" hideTools>

            <span slot="item1Type" slot-scope="text, record, index">
              {{filterDictText(dictOptins.ITEM1_TYPE, text)||'同一天'}}
            </span>
            <span slot="item1Wgtype" slot-scope="text, record, index">
              {{filterDictText(dictOptins.ITEM1_WGTYPE, text)||'B项目存在违规(重复收费)'}}
            </span>
            <span slot="qtyType" slot-scope="text, record, index">
              {{filterDictText(dictOptins.QTY_TYPE, text)||'一天超量'}}
            </span>
            <span slot="isSameDay" slot-scope="text, record, index">
              {{filterDictText(dictOptins.YESNO, text)||'否'}}
            </span>

          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="查询条件预览" v-else-if="model.taskType=='drugRuleStatistics'">
          <a-table bordered
                   :columns="columns2"
                   :dataSource="dataSource2"
                   :pagination="ipagination2"
                   :scroll="{ x: scrollX, y: 'calc(100vh - 260px)' }"
                   size="middle" hideTools>

            <span slot="limitType" slot-scope="text, record, index">
              {{filterDictText(dictOptins.DC_DRUG_LIMIT_TYPE, text)||''}}
            </span>


          </a-table>
        </a-tab-pane>
        <a-tab-pane v-for="(item,index) in sqlList" :key="index+3" :tab="`SQL语句预览${sqlList.length>1?index+1:''}`" >
          <a-textarea v-model="item.querySql" style="min-height: calc(100vh - 260px);" />
        </a-tab-pane>
      </a-tabs>
      <div style="text-align: right;;margin-top:4px;">
        <a-button type="primary" @click="toRunAgain">任务重跑</a-button>
      </div>
    </div>
  </m-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {getAction } from '@/api/manage'
import { filterDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "searchPreview",
    mixins:[JeecgListMixin],
    components: {},
    data() {
      return {
        title: '查询结果预览',
        visible: false,
        loading: false,
        url:{
          list:'',
          getSqlByTask:'/ybChargeSearch/ybChargeSearchTask/getSqlByTask',
          runAgain:this.$suncare_v3 +'/apiYbChargeSearch/ybChargeSearchTask/runAgain',
        },
        model:{},
        columns:[],
        dataSource:[],
        initLoad:false,
        sqlList:[],
        //条件预览

        searchColumns:[
        {dataIndex: 'itemname', title: '收费项目名称A',width: '220px',ellipsis:true, customRender: (text, record, index) => {
          if (record.hisItemName) {
            return record.hisItemName;
          }
          return record.itemname
        }
        }
        ,{dataIndex: 'itemname1', title: '收费项目名称B',width: '220px',ellipsis:true, customRender: (text, record, index) => {
          if (record.hisItemName1) {
            return record.hisItemName1;
          }
          return record.itemname1
        }
        }
        ,{dataIndex: 'itemType', title: '收费项目名称类型', width: '140px', customRender: (text, record, index) => {
          if (record.itemType=='his') {
            return 'HIS收费项目名称';
          }else if(record.itemType=='yb'){
            return '医保收费项目名称';
          }else if (record.itemname) {
            return '医保收费项目名称';
          } else if (record.hisItemName) {
            return 'HIS收费项目名称';
          }
          return '医保收费项目名称'
        }
        }
        ,{dataIndex: 'item1Type', title: '重复收费类型', width: '130px', scopedSlots: { customRender: 'item1Type' } }
        ,{dataIndex: 'item1Wgtype', title: '收费项目B违规判断', width: '200px', scopedSlots: { customRender: 'item1Wgtype' } }
        ,{dataIndex: 'qtyType', title: '超量检查的类型', width: '120px', scopedSlots: { customRender: 'qtyType' } }
        ,{dataIndex: 'qtyNum', title: '超量的数值(不含)', width: '140px',}
        ,{dataIndex: 'isSameDay', title: '是否输出同一天的手术项目', width: '200px',scopedSlots: { customRender: 'isSameDay' } }
        ,{dataIndex: 'wgRemark', title: '违规案例提示',width: '200px',ellipsis:true}
        ,{dataIndex: 'chargedateStartdate', title: '收费开始时间',width: '120px',}
        ,{dataIndex: 'chargedateEnddate', title: '收费结束时间',width: '120px',}
        ,{
          dataIndex: 'visittype', title: '就诊类型', width: '100px', customRender: (text, record, index) => {
            let html = text;
            if (html) {
              html = html.replace("ZY", "住院")
              html = html.replace("MM", "门诊")
              html = html.replace("GY", "购药")
            } else {
              html = ''
            }
            return html
          }
        }
        ,{dataIndex: 'visitid', title: '就诊号',width: '200px',ellipsis:true}
        ,{dataIndex: 'clientname', title: '患者姓名',width: '200px',ellipsis:true}
        ,{dataIndex: 'itemChargedate', title: '收费日期', width: '120px',}
        ,{dataIndex: 'caseId', title: '病案号', width: '200px',ellipsis:true}
      ],
        drugRuleColumns:[
          {
            title: '药品名称',
            align: "center",
            dataIndex: 'drugName'
          },{
          title: '药品大类',
          align: "center",
          dataIndex: 'drugType'
        },
          {
            title: '药品小类',
            align: "center",
            dataIndex: 'drugTypeSmall'
          },
          {
            title: '限制类型',
            align: "center",
            dataIndex: 'limitType',
            scopedSlots: { customRender: 'limitType' }
          },
          {
            title: '限制内容',
            align: "center",
            dataIndex: 'limitContent'
          }
          ,{title: '备注',align: "center",dataIndex: 'remark' }
          ,{dataIndex: 'chargedateStartdate', title: '收费开始时间',width: '120px',}
          ,{dataIndex: 'chargedateEnddate', title: '收费结束时间',width: '120px',}
          ,{
            dataIndex: 'visittype', title: '就诊类型', width: '100px', customRender: (text, record, index) => {
              let html = text;
              if (html) {
                html = html.replace("ZY", "住院")
                html = html.replace("MM", "门诊")
                html = html.replace("GY", "购药")
              } else {
                html = ''
              }
              return html
            }
          }
          ,{dataIndex: 'visitid', title: '就诊号',width: '200px',ellipsis:true}
          ,{dataIndex: 'clientname', title: '患者姓名',width: '200px',ellipsis:true}
          ,{dataIndex: 'leavedate', title: '出院时间', width: '120px',}
          ,{dataIndex: 'caseId', title: '病案号', width: '200px',ellipsis:true}
          ],
        columns2:[],
        dataSource2:[],
        ipagination2:{},

        taskId:'',
        resultTitle:'',
        activeKey:'1',
        dictOptins:{},
      }
    },
    computed: {

    },
    beforeMount() {
      let keys = ['ITEM_TYPE', 'ITEM1_TYPE', 'ITEM1_WGTYPE', 'YESNO','QTY_TYPE','DC_DRUG_LIMIT_TYPE']
      this.$util.initDict(keys).then(obj => {
        this.dictOptins = obj
        for (let key in this.dictOptins){
          this.dictOptins[key] = this.dictOptins[key].map(item =>{
            return {
              text: item.value,
              value: item.code
            }
          })
        }
      })
    },
    methods: {
      filterDictText,
      close() {
        this.visible = false;
      },
      handleCancel() {
        this.close()
      },
      initData(record){
        this.activeKey = '1'
        this.model = Object.assign({}, record)
        this.taskId = record.id
        this.queryParam.taskId = record.id
        this.loadData(1)
        this.getSqlByTask(record.id);
        if(record.taskType=='search'||record.taskType=='drugRuleStatistics'){
          this.dataSource2 = JSON.parse(record.jsonStr)
          this.ipagination2 = Object.assign({}, this.ipagination)
          this.ipagination2.total = this.dataSource2.length
          if(record.taskType=='search'){
            this.columns2 = this.searchColumns
          }else{
            this.columns2 = this.drugRuleColumns
          }
        }
      },
      getSqlByTask(id){
        getAction(this.url.getSqlByTask, {id}).then((res) => {
          if (res.success) {
            this.sqlList = res.result.filter(item=>!item.isMonth)
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      toRunAgain(){
        let that = this
        this.$confirm({
          title: '任务重跑',
          content: '确定重新运行该查询任务吗?',
          onOk: function() {
            that.loading = true
            getAction(that.url.runAgain, {id:that.taskId}).then((res) => {
              if(res.success){
                that.$success({
                  title: '操作成功',
                  content: '文件下载任务已经创建，生成下载文件需要点时间，请耐心等候',
                });
                that.loading = false
                that.$emit('reloadTaskList');
                that.close()
              }else{
                that.$message.warning(res.message);
              }
            })
          }
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
