<template>
  <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" :bordered="false">
    <div class="tabBox ">
      <div @click="tabCard(1)" :class="[isActive == 1 ? 'activeBtn' : 'tabBtn']">
        <div class="tabTitle"><a-icon type="check-square" class="m-r-6" />线索总览</div>
      </div>
      <div :class="[isActive == 2 ? 'activeBtn' : 'tabBtn']" @click="tabCard(2)" class="m-l-20">
        <div class="tabTitle"><a-icon type="pic-center" class="m-r-6" />现场材料管理</div>
      </div>
    </div>


    <div v-show="isActive== 1">

      <div class="m-t-10 m-b-10 disRow">
        <a-select v-model="searchField" style="width: 160px">
          <a-select-option value="issueType"> 问题类别 </a-select-option>
          <a-select-option value="issueSubtype"> 问题类型 </a-select-option>
          <a-select-option value="clueName"> 项目名称 </a-select-option>
        </a-select>
        <a-input-search class="m-l-10" style="width:250px" v-model="searchValue" @search="onSearch"></a-input-search>
      </div>
      <a-popconfirm title="确定根据当前列表数据或者选中的数据生成询问笔录+检查通知书进行下载?" @confirm="() => downloadNotice()">
        <a-button type="primary"  class="m-r-10">询问笔录+检查通知书</a-button>
      </a-popconfirm>
      <a-popconfirm title="确定根据当前列表数据或者选中的数据生成签字反馈表进行下载?" @confirm="() => downloadFeedback()">
      <a-button type="primary" class="m-r-10">签字反馈表</a-button>
      </a-popconfirm>

      <a-dropdown :trigger="['click']" v-model="templateVisible">
        <a-menu slot="overlay" @click="templateVisible=true">
          <a-menu-item key="1" >
            <a-checkbox-group v-model="templateCodeArr">
              <div v-for="(item,index) in templateExportList" :key="item.templateCode+''">
                <a-checkbox :value="item.templateCode+''">{{item.templateName}}</a-checkbox>
              </div>
            </a-checkbox-group>

          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2">
            <a-spin :spinning="templateLoading">
              <a-button type="primary" size="small" block @click="templateOut()">导出</a-button>
            </a-spin>
          </a-menu-item>
        </a-menu>
        <a-button>归档文件输出<a-icon type="down" /> </a-button>
      </a-dropdown>


      <a-button @click="editTableSave()" class="m-r-10" style="float: right">{{editTableFlag?`完成编辑`:`全表编辑`}}</a-button>
      <a-button @click="goBatchEdit()" class="m-r-10" style="float: right">上传覆盖</a-button>


      <div class="m-t-20 sumTip" v-if="statStepClueVo">
        当前线索实时汇总，线索类别   {{statStepClueVo.issueSubtypeCnt}}条，
        项目  {{statStepClueVo.clueNameCnt}}类，
        涉及总数量  {{statStepClueVo.caseAmount}}，
        涉及人次  {{statStepClueVo.casePersonCnt}}，
        线索总金额 {{statStepClueVo.caseFee&&statStepClueVo.caseFee>10000?(statStepClueVo.caseFee/10000).toFixed(2)+'（万元）':statStepClueVo.caseFee+'（元）'}}，
        涉及医保基金总金额 {{statStepClueVo.caseFundFee&&statStepClueVo.caseFundFee>10000?(statStepClueVo.caseFundFee/10000).toFixed(2)+'（万元）':statStepClueVo.caseFundFee+'（元）'}}
      </div>
      <!-- table区域-begin -->
      <div>
        <div v-show="editTableFlag">
          <j-editable-table ref="editableTable" :columns="editColumns" :dataSource="dataSource" :loading="!editTableFlag" />

        </div>



        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="clueId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          v-bind="tableAttrs"
          @change="handleTableChange" v-if="!editTableFlag">
          <span slot="action" slot-scope="text, record">
              <a  @click="showDtlList(record)">明细查看</a>
              <a-divider type="vertical"/>
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item key="1">
                    <a @click="handleEdit(record)">线索修改</a>
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a-popconfirm title="确定下载当前线索的所有附件?" @confirm="() => downloadZip(record.clueId)">
                      <a>附件下载</a>
                    </a-popconfirm>
                  </a-menu-item>
                  <a-menu-item key="5">
                    <a-popconfirm title="确定删除当前项目线索信息吗?" @confirm="() => handleDelete(record.clueId)">
                      <a size="small">删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
                <a-button type="primary">编辑<a-icon type="down" /> </a-button>
              </a-dropdown>
            </span>


        </a-table>
      </div>
      <!-- table区域-end -->

      <!--明细列表 -->
      <clue-dtl-list ref="dtlListRef"></clue-dtl-list>

      <!-- 表单区域 -->
      <onsite-clue-modal ref="modalForm" @ok="refreshData"></onsite-clue-modal>

      <!--批量修改-->
      <batch-edit-modal ref="batchEditModel" @ok="refreshData"></batch-edit-modal>

    </div>


    <template  v-if="isActive== 2">
      <clue-file ref="clueFileModel" :projectOrgId="$route.query.projectOrgId" processStep="onsite">
        <div slot="uploadFileBtn">

        </div>
      </clue-file>
    </template>

  </a-card>
</template>


<script>
import {getAction,putAction,httpAction,downFile} from '@/api/manage'
import Breadcrumb from '@/components/Breadcrumb'
import moment from "moment"
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import clueDtlList from './clueDtlList'
import onsiteClueModal from './modules/onsiteClueModal'
import batchEditModal from './modules/batchEditModal'
import clueFile from './plugin/clueFile'
import {FormTypes} from '@/utils/JEditableTableUtil'
import JEditableTable from '@/components/jeecg/JEditableTable'
export default {
  name: "processTask",
  mixins: [JeecgListMixin],
  components: {
    Breadcrumb,
    clueDtlList,
    onsiteClueModal,
    batchEditModal,
    clueFile,
    JEditableTable
  },
  data() {
    return {
      columns: [
        {
          title: '问题类别',
          align: "left",
          dataIndex: 'issueType',
          key: 'issueType',
          width: '120px',
        },{
          title: '问题类型',
          align: "left",
          dataIndex: 'issueSubtype',
          key: 'issueSubtype',
          width: '120px',
        },{
          title: '项目名称',
          align: "left",
          dataIndex: 'clueName',
          key: 'clueName',
          width: '200px',
        },{
          title: '问题情形描述',
          align: "left",
          dataIndex: 'caseRemark',
          key: 'caseRemark',
          width: '140px',
        },{
          title: '涉及数量',
          align: "left",
          dataIndex: 'caseAmount',
          key: 'caseAmount',
          width: '100px',
        },{
          title: '涉及人次',
          align: "left",
          dataIndex: 'casePersonCnt',
          key: 'casePersonCnt',
          width: '100px',
        },{
          title: '涉及金额(元)',
          align: "left",
          dataIndex: 'caseFee',
          key: 'caseFee',
          width: '120px',
        },{
          title: '核减人次',
          align: "left",
          dataIndex: 'cutPersonCnt',
          key: 'cutPersonCnt',
          width: '100px',
        },{
          title: '核减数量',
          align: "left",
          dataIndex: 'cutAmount',
          key: 'cutAmount',
          width: '100px',
        },{
          title: '核减金额',
          align: "left",
          dataIndex: 'cutFee',
          key: 'cutFee',
          width: '100px',
        },{
          title: '项目支付类别',
          align: "left",
          dataIndex: 'clueType',
          key: 'clueType',
          width: '140px',
        },{
          title: '医保报销比例',
          align: "left",
          dataIndex: 'bxRate',
          key: 'bxRate',
          width: '120px',
          customRender: t => (t*100).toFixed(2)+'%',
        },{
          title: '涉及医保基金(元)',
          align: "left",
          dataIndex: 'caseFundFee',
          key: 'caseFundFee',
          width: '140px',
        },{
          title: '问题认定依据',
          align: "left",
          dataIndex: 'sureBasis',
          key: 'sureBasis',
          width: '140px',
        },{
          title: '操作人',
          align: "left",
          dataIndex: 'createUsername',
          key: 'createUsername',
          fixed: 'right',
          width: '80px',
        },{
          title: '操作时间',
          align: "left",
          dataIndex: 'createTime',
          key: 'createTime',
          fixed: 'right',
          width: '160px',
        },{
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      editColumns: [
        {
          title: '主键',
          align: "left",
          dataIndex: 'clueId',
          key: 'clueId',
          width: '120px',
          type:FormTypes.hidden,
        },{
          title: '问题类别',
          align: "left",
          dataIndex: 'issueType',
          key: 'issueType',
          width: '120px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [{required: true, message: '${title}不能为空'}]
        },{
          title: '问题类型',
          align: "left",
          dataIndex: 'issueSubtype',
          key: 'issueSubtype',
          width: '120px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [{required: true, message: '${title}不能为空'}]
        },{
          title: '项目名称',
          align: "left",
          dataIndex: 'clueName',
          key: 'clueName',
          width: '200px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [{required: true, message: '${title}不能为空'}]
        },{
          title: '问题情形描述',
          align: "left",
          dataIndex: 'caseRemark',
          key: 'caseRemark',
          width: '140px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
        },{
          title: '涉及数量',
          align: "left",
          dataIndex: 'caseAmount',
          key: 'caseAmount',
          width: '100px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            { pattern: /^[1-9]+\d*$/,trigger: "blur", message: "只能输入整数"}
          ]
        },{
          title: '涉及人次',
          align: "left",
          dataIndex: 'casePersonCnt',
          key: 'casePersonCnt',
          width: '100px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            {required: true, message: '${title}不能为空'},
            { pattern: /^[1-9]+\d*$/,trigger: "blur", message: "只能输入整数"}
          ]
        },{
          title: '涉及金额(元)',
          align: "left",
          dataIndex: 'caseFee',
          key: 'caseFee',
          width: '120px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            {required: true, message: '${title}不能为空'},
            {pattern: /^(0|[1-9])+(\.[0-9]{1,2}){0,1}$/,trigger: "blur", message: "只能输入整数或小数,小数位数不超过2"}
          ]
        },{
          title: '核减人次',
          align: "left",
          dataIndex: 'cutPersonCnt',
          key: 'cutPersonCnt',
          width: '100px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            { pattern: /^[1-9]+\d*$/,trigger: "blur", message: "只能输入整数"}
          ]
        },{
          title: '核减数量',
          align: "left",
          dataIndex: 'cutAmount',
          key: 'cutAmount',
          width: '100px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            { pattern: /^[1-9]+\d*$/,trigger: "blur", message: "只能输入整数"}
          ]
        },{
          title: '核减金额',
          align: "left",
          dataIndex: 'cutFee',
          key: 'cutFee',
          width: '100px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            {pattern: /^(0|[1-9])+(\.[0-9]{1,2}){0,1}$/,trigger: "blur", message: "只能输入整数或小数,小数位数不超过2"}
          ]
        },{
          title: '项目支付类别',
          align: "left",
          dataIndex: 'clueType',
          key: 'clueType',
          width: '140px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
        },{
          title: '医保报销比例',
          align: "left",
          dataIndex: 'bxRate',
          key: 'bxRate',
          width: '120px',
          customRender: t => (t*100).toFixed(2)+'%',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            {pattern: /^(0|[1-9])+(\.[0-9]{1,4}){0,1}$/,trigger: "blur", message: "只能输入整数或小数,小数位数不超过4"}
          ]
        },{
          title: '涉及医保基金(元)',
          align: "left",
          dataIndex: 'caseFundFee',
          key: 'caseFundFee',
          width: '140px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [
            {required: true, message: '${title}不能为空'},
            {pattern: /^(0|[1-9])+(\.[0-9]{1,2}){0,1}$/,trigger: "blur", message: "只能输入整数或小数,小数位数不超过2"}
          ]
        },{
          title: '问题认定依据',
          align: "left",
          dataIndex: 'sureBasis',
          key: 'sureBasis',
          width: '140px',
          type:FormTypes.input,
          placeholder: '请输入${title}',
        }
      ],
      url: {
        list: "/fj/clue/onsite/list",
        delete: '/fj/clue/onsite/delete',
        deleteBatch: '/fj/clue/onsite/deleteBatch',
        downloadZip:'/fj/clue/onsite/downloadZip',
        clueDtlList:"/fj/clue/onsite/dtl/list",
        notice:'/fj/clue/onsite/download/notice',
        feedback:'/fj/clue/onsite/download/feedback',
        statClueInOnsite:"/fj/clue/onsite/statClueInOnsite",
        editBatch:"/fj/clue/onsite/editBatch",
        templateImport: "/ybFj/ybFjTemplateImport/queryById",
        templateExportList: "/ybFj/ybFjTemplateExport/list",
        templateOut:'/fj/clue/onsite/template/out',

      },
      initLoad:false,
      isActive: '1',
      searchField:'issueType',
      searchValue:'',
      editTableFlag:true,
      //统计结果
      statStepClueVo:undefined,
      //输出文档类型
      templateExportList:[],
      templateVisible:false,
      templateLoading:false,
      templateCodeArr:[],


    }
  },
  beforeMount() {
    this.fixedParam.projectId = this.$route.query.projectId
    this.fixedParam.projectOrgId = this.$route.query.projectOrgId
    this.onSearch()
    this.getTemplateExportList()
  },
  mounted() {
    this.editTableFlag = false
  },
  methods: {
    tabCard (v) {
      this.isActive = v
      if(v==1){
        this.onSearch()
      }
      this.$forceUpdate()
    },
    onSearch(){
      this.queryParam = {}
      if(this.searchValue){
        this.queryParam[this.searchField] = `${this.searchValue}`
      }
      this.loadData(1)
      this.getStatStepClueVo(this.$route.query.projectOrgId)
    },
    //获取统计数据
    getStatStepClueVo(projectOrgId){
      if(!projectOrgId){
        return
      }
      getAction(this.url.statClueInOnsite, { projectOrgId }).then(res => {
        if (res.success) {
          this.statStepClueVo = res.result
        } else {
          this.$message.warning(res.message);
        }
      })

    },
    showDtlList(record){
      this.$refs.dtlListRef.visible = true
      this.$refs.dtlListRef.initData(record,this.url.clueDtlList)
    },

    downloadFile(fileName,params,url){
      downFile(url, params, 'get').then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        const that = this
        if(data.size == 0 ){
          this.$message.warning('文件不存在')
          return
        }
        if (data.size < 2001) {
          let reader = new FileReader()
          reader.onload = function(event) {
            let result = JSON.parse(reader.result)
            if (!result.success) {
              that.$message.error(result.message)
            } else {
              that.$message.success(result.result || result.message)
            }
          }
          reader.readAsText(data)
        } else {
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('文件下载成功')
        }
      }).catch(e => {
        this.$message.error(e.message)
      }).finally(() => {
        if(url == this.url.templateOut){
          this.templateLoading = false
        }
      })
    },
    //附件下载
    downloadZip(clueId){
      let fileName = '线索附件.zip'
      let params = {clueId}
      let url = this.url.downloadZip
      this.downloadFile(fileName,params,url)
    },
    downloadQueryParams() {
      let params = {}
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        params['clueId'] = this.selectedRowKeys.join(',')
        params['projectOrgId'] = this.$route.query.projectOrgId
      } else {
        params = this.getQueryParams()
      }
      return params;
    },
    downloadNotice(){
      let fileName = '询问笔录+现场检查通知书.docx'
      let params = this.downloadQueryParams();
      let url = this.url.notice
      this.downloadFile(fileName,params,url)
    },
    downloadFeedback(){
      let fileName = '签字反馈表.xlsx'
      let params = this.downloadQueryParams();
      let url = this.url.feedback
      this.downloadFile(fileName,params,url)
    },
    goBatchEdit(){
     let clueId = ''
     let fnType = 'import'
     if(this.selectedRowKeys.length==1){
       clueId=this.selectedRowKeys[0]
       fnType = 'cover'
     }
      this.$refs.batchEditModel.loadData({fnType,clueId,projectOrgId:this.$route.query.projectOrgId,
        title:'上传覆盖',
        uploadFileName:'线索汇总及明细表.xlsx',
        templateUrl:'/fj/clue/onsite/download/clue',
        actionUrl:'/fj/clue/onsite/',
      });
    },

    //全表编辑
    editTableSave(){
      if(!this.editTableFlag){
        this.editTableFlag = true
      }else{
        this.$refs.editableTable.getValues((error, values) => {
          if (error === 0) {
            const that = this
            this.$confirm({
              title: '确认？',
              content: '是否批量保存全表编辑的内容?',
              onOk: function() {
                // 将通过后的数组提交到后台
                that.loading = true
                putAction(that.url.editBatch,values).then(res => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.editTableFlag = false
                    that.refreshData()
                  } else {
                    that.$message.warning(res.message);
                  }
                }).finally(()=>{
                  that.loading = false
                })
              },
              onCancel: () => {
                this.editTableFlag = false
              },
            })
          } else {
            this.$message.error('校验未通过')
          }
        })
      }

    },

    //刷新列表
    refreshData() {
      // 新增/修改 成功时，重载列表
      this.loadData()
      this.onClearSelected()
      //统计刷新
      this.getStatStepClueVo()
    },

    async getTemplateExportList(){
      this.templateExportList = []
      let res1 = await getAction(this.url.templateImport, {id: '1627952538791182337'})
      if (res1.success) {
        let exportBean = res1.result
        console.log(exportBean)
        if(exportBean&&exportBean.templateCodes){
          getAction(this.url.templateExportList, {templateCodes:exportBean.templateCodes,pageSize:99999,useStatus:'1',column:'createTime',order: 'asc'}).then((res) => {
            if (res.success) {
              this.templateExportList = res.result.records
            }else{
              this.$message.warning(res.message);
            }
          })
        }
      }

    },
    async templateOut(){
      if(!this.templateCodeArr&&this.templateCodeArr.length==0){
        this.$message.error('请选择文档类型')
        return
      }
      let fileName = '归档文件输出.zip'
      let params = this.downloadQueryParams();
      params.templateCode = this.templateCodeArr.join(',')
      let url = this.url.templateOut
      this.templateLoading = true
      await this.downloadFile(fileName,params,url)

    },



  }
}
</script>
<style lang="less" scoped>
  .topTab{
    /deep/.ant-tabs-bar{
      margin:0;
    }
  }
  .tabTitle{
    width: 100%;
    text-align: center;
  }
  .disRow {
    display: flex;
    flex-direction: row
  }

  .tabBox {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 400px;
    background: rgba(162,166,169,0.2);
    padding: 6px 10px;
    margin-top: 10px;
    border-radius: 5px
  }

  .tabBtn {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #333;
    border-radius: 5px;
    width: 48%;
    cursor: pointer;
    padding: 10px;
  }

  .activeBtn {
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #1890ff;
    background: #fff;
    padding: 10px;
    width: 48%;
    cursor: pointer;
  }
  .sumTip{
    background: #e4f0f9;
    color:#108EE9;
    padding:12px;
    font-weight: bold;
  }


</style>