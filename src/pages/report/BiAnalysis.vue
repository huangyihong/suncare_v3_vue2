<template>
  <div class="page-header-index-wide">
    <a-row>
      <a-col :span="24">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-card :bordered="false" size="small" title="查询条件" >
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="数据来源" style="width:100%">
                  <m-dict-select-tag placeholder="选择数据来源" dictCode="ETL_SOURCE"
                                     v-model="queryParam.etlSource" :disabled="nextSearch"></m-dict-select-tag>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="数据时间" style="width:100%">
                  <a-range-picker v-model="dataDateTimes" :allowClear="false" :disabled="nextSearch"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="机构选择" style="width:100%">
                  <input-medical-org-dwb multi :maxTag="50" v-model="queryParam.dataOrgFilter" :disable="nextSearch"></input-medical-org-dwb>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="12" v-for="(item,index) in selectParams" :key="index">
                <a-form-item :labelCol="labelCol2"
                             :wrapperCol="wrapperCol2"
                             :label="item.title" style="width:100%">
                  <a-input :value="item.value" readonly></a-input>
                </a-form-item>
              </a-col>

            </a-row>
          </a-card>

          <a-card :bordered="false" size="small" title="统计指标" :style="{ marginTop: '10px' }" v-if="!nextSearch">
            <a-row :gutter="24">
              <a-col :md="5" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="统计维度" style="width:100%">
                  <a-select placeholder="请选择统计维度"
                            v-model="queryParam.groupBy"
                            show-search
                            :filter-option="filterOption">
                    <a-select-option v-for="(item,key) in groupByCols" :key="key" :value="key">{{item}}({{key}})</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="5" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="统计指标" style="width:100%">
                  <a-select placeholder="请选择统计指标"
                            v-model="queryParam.aggregate"
                            show-search
                            :filter-option="filterOption">
                    <a-select-option value="COUNT">记录数</a-select-option>
                    <a-select-option v-for="(item,key) in aggregateCols" :key="key" :value="key">{{item}}({{key}})</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="5" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="排序" style="width:100%">
                  <a-select placeholder="请选择排序" v-model="queryParam.sort">
                    <a-select-option value="asc">升序</a-select-option>
                    <a-select-option value="desc">降序</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="5" :sm="8">
                <a-form-item :labelCol="labelCol"
                             :wrapperCol="wrapperCol"
                             label="Top" style="width:100%">
                  <a-select placeholder="请选择Top条数" v-model="queryParam.limit">
                    <a-select-option :value="10">Top10</a-select-option>
                    <a-select-option :value="20">Top20</a-select-option>
                    <a-select-option :value="50">Top50</a-select-option>
                    <a-select-option :value="100">Top100</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="4" :sm="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search">分析</a-button>
                </span>
              </a-col>

            </a-row>
          </a-card>

          <a-col :span="24">
            <a-card :bodyStyle="{ paddingBottom: '2px',paddingTop: '10px'}" :style="{ marginTop: '10px' }" :bordered="false" v-if="pathList.length>0">
              <a-breadcrumb style="display: inline-block;margin-bottom: 4px">
                <a-breadcrumb-item><a @click="goBack(-1)" style="color: #1890ff;">BI分析</a></a-breadcrumb-item>
                <a-breadcrumb-item v-for="(item,index) in pathList" :key="index">
                  <a @click="goBack(index)" v-if="index+1!==pathList.length" style="color: #1890ff;">{{groupByCols[item]}}</a>
                  <span v-else>{{groupByCols[item]}}</span>
                </a-breadcrumb-item>
              </a-breadcrumb>
              <a style="font-size: 12px" :style="{marginLeft:'10px'}" @click="goBack(pathList.length-2)">
                返回上一级
              </a>
            </a-card>
          </a-col>

          <a-col :span="16" v-if="nextSearch">
            <a-card :loading="loading" :bordered="false" size="small" title="请选择钻取数据条件" :style="{ marginTop: '10px'}" :headStyle="{fontWeight: 'bold'}">
              <ReportTable ref="tableRef" :dataSource="dataSource" :columns="columns" @onSelectChange="onSelectChange"></ReportTable>
            </a-card>
          </a-col>
          <a-col :span="8" v-if="nextSearch">
            <a-card :loading="loading" :bordered="false" size="small" title="请设置钻取统计参数" :style="{marginTop: '10px',marginLeft: '10px'}" :headStyle="{fontWeight: 'bold'}">
              <a-row :gutter="24">
                <a-col>
                  <a-form-item :labelCol="labelCol"
                               :wrapperCol="wrapperCol"
                               label="统计维度" style="width:100%">
                    <a-select placeholder="请选择统计维度"
                              v-model="queryParam.groupBy"
                              show-search
                              :filter-option="filterOption">
                      <a-select-option v-for="(item,key) in groupByCols" :key="key" :value="key" v-if="pathList.indexOf(key) === -1">{{item}}({{key}})</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col>
                  <a-form-item :labelCol="labelCol"
                               :wrapperCol="wrapperCol"
                               label="统计指标" style="width:100%">
                    <a-select placeholder="请选择统计指标"
                              v-model="queryParam.aggregate"
                              show-search
                              :filter-option="filterOption">
                      <a-select-option value="COUNT">记录数</a-select-option>
                      <a-select-option v-for="(item,key) in aggregateCols" :key="key" :value="key">{{item}}({{key}})</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col>
                  <a-form-item :labelCol="labelCol"
                               :wrapperCol="wrapperCol"
                               label="排序" style="width:100%">
                    <a-select placeholder="请选择排序" v-model="queryParam.sort">
                      <a-select-option value="asc">升序</a-select-option>
                      <a-select-option value="desc">降序</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col>
                  <a-form-item :labelCol="labelCol"
                               :wrapperCol="wrapperCol"
                               label="Top" style="width:100%">
                    <a-select placeholder="请选择Top条数" v-model="queryParam.limit">
                      <a-select-option :value="10">Top10</a-select-option>
                      <a-select-option :value="20">Top20</a-select-option>
                      <a-select-option :value="50">Top50</a-select-option>
                      <a-select-option :value="100">Top100</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col style="text-align: center;margin-top: 10px">
                  <span class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery" icon="search">钻取分析</a-button>
                  </span>
                </a-col>

              </a-row>
            </a-card>
          </a-col>


        </a-form>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import { getAction,postAction } from '@/api/manage'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import InputMedicalOrgDwb from "@/pages/selectInput/MedicalOrgDwb"
import ReportTable from "@/pages/report/plugin/ReportTable"
import moment from "moment"
moment.locale('zh-cn')
export default {
  name: "BiAnalysis",
  components: {
    MDictSelectTag,
    InputMedicalOrgDwb,
    ReportTable,
  },
  data(){
    return{
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
      loading: true,
      url: {
        colConfigList: "/config/medicalColConfig/list",
        list: this.$suncare_v3 +"/apiTask/top/report/analysis",
      },
      tableName: 'DWB_CHARGE_DETAIL',//统计表
      groupByCols:{},//维度字段
      aggregateCols:{},//指标字段
      dataDateTimes: [moment('2018-01-01'), moment('2018-12-31')],
//      queryParam:{sort:'desc',limit:10,etlSource:'A01',groupBy:'CHARGECLASS',aggregate:'COUNT',dataOrgFilter:'361100-1824'},
      queryParam:{sort:'desc',limit:10,etlSource:'A01',groupBy:'CHARGECLASS',aggregate:'COUNT'},
      dataSource:[],
      columns:[],
      nextSearch:false,//钻取
      selectionRows:[],//统计结果选中数据
      selectParams:[],//钻取参数
      pathList:[],//钻取指标路径
      prevQueryParam:{},//上次统计的参数
    }
  },
  beforeMount() {
    this.getColConfig()
  },
  methods:{
    searchQuery(){
      if(!this.queryParam.groupBy){
        this.$message.warning('请选择统计维度');
        return
      }
      if(!this.queryParam.aggregate){
        this.$message.warning('请选择统计指标');
        return
      }
      if(this.nextSearch&&this.selectionRows.length==0){
        this.$message.warning('请选择左侧钻取数据条件');
        return
      }
      this.nextSearch = true
      this.queryParam.dataStartTime = this.dataDateTimes[0].format("YYYY-MM-DD")
      this.queryParam.dataEndTime = this.dataDateTimes[1].format("YYYY-MM-DD")
      this.pathList.push(this.queryParam.groupBy)
      this.getTopReportResult()
    },
    // 获取字段列表
    async getColConfig() {
      let tableColDict = this.$util.getCache('tableColDict')
      if(tableColDict==null){
        tableColDict = {}
      }
      let cols = []
      if(!tableColDict[this.tableName]){
        await getAction(this.url.colConfigList,{tabName:this.tableName,pageSize:99999,column:'colOrder',order: 'asc'},'get').then((res) => {
          if (res.success) {
            cols = res.result.records
            if(cols.length>0){
              tableColDict[this.tableName]= cols
              this.$util.setCache('tableColDict', tableColDict)
            }
          } else {
            this.$message.warning(res.message);
          }
        })
      }else{
        cols = tableColDict[this.tableName]
      }
      this.groupByCols = {}
      this.aggregateCols = {}
      cols.filter(item => item.isGroupbyCol).forEach(item =>{
        this.groupByCols[item.colName]=item.colChnName
      })
      cols.filter(item => item.jklx==='1').forEach(item =>{
        this.aggregateCols[item.colName]=item.colChnName
      })
    },
    //获取分析结果
    getTopReportResult(){
      this.loading = true
      this.prevQueryParam = Object.assign({}, this.queryParam)
      this.getColumns()
      //获取结果
      let params = {...this.queryParam}
      let whereList= ['VISITDATE:['+this.dataDateTimes[0].format("YYYY-MM-DD")+' TO '+this.dataDateTimes[1].format("YYYY-MM-DD")+']']
      if(this.queryParam.etlSource){
        whereList.push('ETL_SOURCE:'+this.queryParam.etlSource)
      }
      if(this.queryParam.dataOrgFilter){
        whereList.push('ORGID:('+this.queryParam.dataOrgFilter.replaceAll(',',' OR ')+')')
      }
      this.selectParams.map(item => whereList.push(item.solrparam))
      params.whereList = whereList
      postAction(this.url.list,params).then((res) => {
        if (res.success) {
          this.dataSource = res.result
          this.selectionRows = []
          let defaultSelect = Object.keys(this.groupByCols).find(value => this.pathList.indexOf(value)<0)
          this.queryParam.groupBy = defaultSelect?defaultSelect:''
          this.loading = false
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    //获取表头
    getColumns(){
      this.columns = []
      this.columns.push({title:this.groupByCols[this.queryParam.groupBy], dataIndex:'field'})
      if(this.queryParam.aggregate==='COUNT'){
        this.columns.push({title:'记录数', dataIndex:'value',})
      }else{
        this.columns.push({title:this.aggregateCols[this.queryParam.aggregate], dataIndex:'value',})
      }
    },
    //分析结果记录选中
    onSelectChange(selectionRows){
      this.selectionRows = selectionRows
      let field = this.pathList[this.pathList.length-1]
      let title = this.groupByCols[field]
      let value = selectionRows.map(item => item.field).join(',')
      let solrparam = field+':('+value.replaceAll(',',' OR ')+')'
      this.$set(this.selectParams,this.pathList.length-1,{field,value,solrparam,title,queryParam:this.prevQueryParam})
    },
    //返回指定上一级
    goBack(index){
      this.pathList.splice(index+1)
      if(index>-1&&this.selectParams[index]&&this.selectParams[index].queryParam){
        this.queryParam = this.selectParams[index].queryParam
        this.selectParams.splice(index)
      }else{
        this.queryParam =  Object.assign({}, this.prevQueryParam)
        this.selectParams=[]
      }
      if(this.pathList.length==0){
        this.nextSearch = false
      }else{
        this.getTopReportResult()
      }
    },
    //统计维度选择筛选
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
}
</script>
<style lang="less" scoped>

  .breadcrumb-container{
    line-height: 40px;
    height: 40px;
    background:#fff;
  }
</style>

