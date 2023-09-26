<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="字段名称">
              <j-input placeholder="请输入字段名称" v-model="queryParam.columnCnname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="字段英文名称">
              <j-input placeholder="请输入字段英文名称" v-model="queryParam.columnName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="表中文名称(来源)">
              <j-input placeholder="请输入字段来源表中文名称" v-model="queryParam.tableCnname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="表英文名称(来源)">
              <j-input placeholder="请输入字段来源表英文名称" v-model="queryParam.tableName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="不合规行为">
              <a-select placeholder="不合规行为"  mode="multiple"  autoIncrease search v-model="actionName">
                <a-select-option v-for="(item, index) in dictOptions" :key="index" :value="item.code" :title="item.name ">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="质控结果">
              <a-select v-model="queryParam.hasResult" placeholder="请选择质控结果">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="数据来源">
              <a-select v-model="queryParam.etlSource" placeholder="请选择数据来源" @select="etlSourceChange">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="A03">HIS</a-select-option>
                <a-select-option value="A01">医保</a-select-option>
                <a-select-option value="A01,A03">医保+HIS</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="机构选择">
              <a-select placeholder="机构选择" mode="multiple" autoIncrease search v-model="orgid">
                <a-select-option value="ALL">全部</a-select-option>
                <a-select-option v-for="(item, index) in orgOptions" :key="index" :value="item.code" :title="item.name ">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <a-select placeholder="项目名称" autoIncrease search v-model="queryParam.projectId" @select="projectIdChange">
                <a-select-option value="null">全部</a-select-option>
                <a-select-option v-for="(item, index) in taskProjectOptions" :key="index" :value="item.projectId" :title="item.projectName ">{{ item.projectName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQueryFn" icon="search">查询</a-button>
              <a-button type="primary" @click="searchResetFn" icon="reload" class="m-l-6">重置</a-button>

            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download"  @click="handleExportExcel()">导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
        @change="handleTableChange">

        <span slot="result" slot-scope="text">
          {{text}}<span v-if="text">%</span>
        </span>

        <span slot="hasResult" slot-scope="text, record">
          <span v-if="record.result">是</span>
          <span v-else>否</span>
        </span>

        <!--<span slot="etlSource" slot-scope="text">
          <span v-if="text=='A01'">医保</span>
          <span v-else-if="text=='A02'">农合</span>
          <span v-else-if="text=='A03'">HIS</span>
          <span v-else-if="text=='A04'">药店</span>
           <span v-else>{{text}}</span>
        </span>-->

      </a-table>
    </div>
    <!-- table区域-end -->


  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import moment from "moment"
import {getAction } from '@/api/manage'
import { querySysDictByType, querySysDictByTypes } from '@/api-sv3/api'

export default {
  name: "MedicalColumnQualityList",
  mixins: [JeecgListMixin],
  components: {
    moment
  },
  data() {
    return {
      description: '规则依赖字段质量表查询页面',
      // 表头
      columns: [
        {
          title: '字段名称',
          align:"center",
          width:220,
          dataIndex: 'columnCnname'
        },
        {
          title: '字段英文名称',
          align:"center",
          width:220,
          dataIndex: 'columnName'
        },
        {
          title: '表中文名称(来源)',
          align:"center",
          width:250,
          dataIndex: 'tableCnname'
        },
        {
          title: '表英文名称(来源)',
          align:"center",
          width:250,
          dataIndex: 'tableName'
        },
        {
          title: '数据来源',
          align:"center",
          width:150,
          dataIndex: 'etlSourceName',
          /*scopedSlots: { customRender: 'etlSource' },*/
        },
        {
          title: '机构名称',
          align:"center",
          width:220,
          dataIndex: 'orgname'
        },
        {
          title: '涉及不合规行为',
          align:"left",
          width:350,
          dataIndex: 'actionNames',
          ellipsis: true,
        },
        {
          title: '涉及不合规行为数量',
          align:"center",
          width:150,
          dataIndex: 'actionCnt'
        },
        {
          title: '所涉规则数量',
          align:"center",
          width:120,
          dataIndex: 'ruleCnt'
        },
        {
          title: '数据完整性',
          align:"center",
          width:120,
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' },
        },
        {
          title: '是否有质控结果',
          align:"center",
          width:120,
          dataIndex: 'hasResult',
          isSorter: false,
          /*scopedSlots: { customRender: 'hasResult' },*/
        },
        {
          title: '发布时间',
          align:"center",
          width:180,
          dataIndex: 'createdate'
        },
      ],
      url: {
        list: this.$suncare_v3 +"/api/medical/medicalColumnQuality/solrlist",
        exportExcelNew: this.$suncare_v3 +"/api/medical/medicalColumnQuality/exportExcelSolr",
        queryDwbDataqualityOrg:this.$suncare_v3 +"/api/medical/medicalColumnQuality/queryDwbDataqualityOrg",
        queryTaskProject:"/medical/medicalColumnQuality/queryTaskProject",
      },
      /* 排序参数 */
      isorter: {
        column: 'actionCnt,columnName',
        order: 'desc,desc'
      },
      queryParam:{
        etlSource:'A01,A03',
        orgid:'ALL',
        projectId:'null',
      },
      dictOptions: [],//字典数据
      orgOptions: [],//医疗数据
      actionName:[],//不合规行为选中
      orgid:['ALL'],//机构选中
      etlSourceName:'全部',
      projectName:'全部',
      taskProjectOptions: [],//项目数据
    }
  },
  computed: {
  },
  beforeMount () {
    this.initDictData()
    this.initOrgData()
    this.initTaskProjectData()
  },
  methods: {
    //字典数据
    initDictData() {
      //根据字典Code, 初始化字典数组
      this.confirmLoading = true
      this.$util.initDict('ACTION_LIST').then(data => {
        if(this.loaded){
          data = this.loaded(Array.from(data)) || data
          console.log('data',data)
        }
        this.dictOptions = data.map(item => {
          return { ...item, ...{ name: item.value, code: item.value} }
        })
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    //机构选择数据
    initOrgData(){
      getAction(this.url.queryDwbDataqualityOrg,{},'get').then((data) => {
        if (data.success) {
          this.orgOptions = data.result
        }else{
          this.$message.warning(data.message);
        }
      })
    },
    //项目名称选择数据
    initTaskProjectData(){
      getAction(this.url.queryTaskProject,{},'get').then((data) => {
        if (data.success) {
          this.taskProjectOptions = data.result
        }else{
          this.$message.warning(data.message);
        }
      })
    },
    //查询
    searchQueryFn(){
      this.queryParam.actionNames=this.actionName.length>0?this.actionName.join(","):'';
      this.queryParam.orgid=this.orgid.length>0?this.orgid.join(","):'';
      this.searchQuery()
    },
    //重置
    searchResetFn(){
      this.searchReset()
      this.actionName = []
      this.queryParam.etlSource = 'A01,A03'
      this.queryParam.projectId = 'null',
      this.orgid = ['ALL']
    },
    etlSourceChange(value, option){
      this.etlSourceName = option.componentOptions.children[0].text
    },
    projectIdChange(value, option){
      this.projectName = option.componentOptions.children[0].text
    },
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.url.exportXlsUrl=this.url.exportExcelNew
      this.handleExportFile(this.projectName+'_数据质量验证信息' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>