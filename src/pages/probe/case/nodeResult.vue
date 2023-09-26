<template>
  <div style="padding: 0 20px">
    <a-spin :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :xl="6" :xs="12" v-if="nodeName">
              <a-form-item label="节点" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                <a-input :value="nodeName" readOnly></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="nodeName?4:10" :xs="12">
              <a-form-item label="图表" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-select v-model="chartSelect">
                  <a-select-option :value="index" v-for="(item,index) in chartSelectDict" :key="index">{{item}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="统计字段" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <!--      <a-select v-model="groupBy" placeholder="请选择" @change="groupByChange" :disabled="echartLoading"
                                :dropdownMatchSelectWidth="false" showSearch :filterOption="filterOption">
                        <a-select-option :value="item.colName" v-for="(item,index) in groupByCols" :key="index">
                          {{`${item.colChnName}(${item.colName})`}}
                        </a-select-option>
                      </a-select>-->
                <a-input placeholder="请选择" @click="showGroupBySelect" :disabled="echartLoading"
                         :value="groupBy?`${groupByItem.colChnName}(${groupByItem.colName})`:''" allowClear
                         @change="clearGroupBy"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :xs="12">
              <a-button icon="setting" @click="showFieldSelect">展示</a-button>

              <!--<a-button type="primary" @click="handleExportXlsAsync" class="m-l-6" v-if="!isDWS">导出</a-button>-->
              <a-dropdown v-if="!isDWS" class="m-l-6" v-has="'probe:trialExport'">
                <a-menu slot="overlay" @click="handleExportMenu">
                  <!-- <a-menu-item key="CASE_ID"> 项目</a-menu-item>
                   <a-menu-item key="ORGID"> 医疗机构</a-menu-item>-->
                  <a-menu-item key="caseId"> 项目明细导出</a-menu-item>
                  <a-menu-item key="visitid"> 就诊明细导出</a-menu-item>
                </a-menu>
                <a-button>导出
                  <a-icon type="down"/>
                </a-button>
              </a-dropdown>
              <a-button type="primary" @click="trail" :loading="echartLoading" class="m-l-6">试算</a-button>
              <!--<a-button style="margin-left: 8px">导出</a-button>-->
            </a-col>

          </a-row>
        </a-form>
      </div>
      <div>
        <a-spin :spinning="echartLoading">
          <a-row v-if="echartOption" class="m-t-10">
            <a-col :xl="12" :xs="24">
              y轴值为<a>病例数量({{echartOption.count}})</a>，x轴值为<a>{{groupByItem.colChnName}}</a>的{{isNumGroupBy?'区间(点击可下钻)':'值'}}
            </a-col>
            <a-col :xl="12" :xs="24" class="t-r" v-if="isNumGroupBy">
              {{groupByItem.colChnName}}(
              平均值：<a>{{echartOption.avg | numberFix}}</a>
              <a-divider type="vertical"/>
              众数：<a>{{echartOption.mode | numberFix}}</a>
              <tempalte v-if="echartOption.median!==undefined && echartOption.median!==null">
                <a-divider type="vertical"/>
                中位数：<a>{{echartOption.median | numberFix}}</a>
              </tempalte>
              )
            </a-col>
            <a-col :xs="24" v-if="echartStack.length > 1">
              <a-breadcrumb @click="toOldEchartData(0)">
                <template v-for="(item,index) in echartStack">
                  <a-breadcrumb-item>
                    <a href="javascript:void(0)" @click="toOldEchartData(item,index)">{{item}}</a></a-breadcrumb-item>
                </template>
              </a-breadcrumb>
            </a-col>
            <a-col :xs="24" class="t-c m-t-10" v-if="isNumGroupBy">
              <a-radio-group defaultValue="eq" buttonStyle="solid" size="small"
                             v-model="gapType" @change="gapTypeChange">
                <a-radio-button value="eq">均等分布</a-radio-button>
                <a-radio-button value="avgLog">平均数lg分布</a-radio-button>
                <a-radio-button value="maxLog">最大值lg分布</a-radio-button>
              </a-radio-group>
              <a-tooltip style="margin-left: 10px">
                <div slot="title">
                  <p>均等分布：区间值相等</p>
                  <p>平均数lg分布：离平均数越远，区间值越大</p>
                  <p>最大值lg分布：离最大值越近，区间值越大</p>
                </div>
                <a>
                  <a-icon type="exclamation-circle"/>
                </a>
              </a-tooltip>
            </a-col>
          </a-row>

          <echart height="300px" :type="chartSelect" :option="echartOption" @click="echartClick"
                  v-show="echartOption"></echart>
        </a-spin>
        <a-row :gutter="18" class="m-b-20" v-if="!isDWS">
          <a-col :xl="8" :md="12" :xs="24" class="m-t-10">
            <mini-echart :params="params" :is-DWS="isDWS" field="ORGNAME" title="医疗机构分布"></mini-echart>
          </a-col>
          <a-col :xl="8" :md="12" :xs="24" class="m-t-10">
            <mini-echart :params="params" :is-DWS="isDWS" field="DISEASENAME" title="疾病名称分布"></mini-echart>
          </a-col>
          <a-col :xl="8" :xs="24" class="m-t-10">
            <mini-echart :params="params" :is-DWS="isDWS" field="TOTALFEE" title="医疗费用总金额"></mini-echart>
          </a-col>
        </a-row>
        <a-table
          size="middle"
          :bordered="false"
          :columns="columns"
          rowKey="jzid"
          :dataSource="data"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{  x:scrollX, y: 300 }"
          @change="handleTableChange">
          <!-- style="width: 55%;float: right;margin-top: 10px">-->
          <span slot="VISITID" slot-scope="text, record">
            <a @click="selectKey(record.VISITID)" style="word-break: break-all">{{text}}</a>
          </span>
        </a-table>

      </div>
    </a-spin>
    <review-detail-model ref="reviewDetailModel"></review-detail-model>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import echart from './echart'
  import MiniEchart from '@/pages/probe/case/resultPlugin/MiniEchart'
  import { getGroupByColConfig } from '@/api-sv3/api-flow'
  import ReviewDetailModel from "@/pages/review/modules/reviewDetailModel"
  import { getAction,postAction } from '@/api/manage'
  import moment from "moment"

  export default {
    name: "fillParams",
    components: {
      // RouteView
      echart,
      MiniEchart,
      ReviewDetailModel,
    },
    mixins: [JeecgListMixin],
    props: ['nodeName', 'nodeKey', 'nodeType', 'caseData', 'tableName', 'uniqueVal'],
    data() {
      return {
        initLoad: false,
        url:{
          trailExportThread: this.$suncare_v3 + '/engine/trailExportThread',
          trailExportMasterInfo: this.$suncare_v3 + '/engine/trailExportMasterInfo'
        },
        data: [],
        ipagination: {
          current: 1,
          pageSize: 50,
          total: 0,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
        },
        loading: false,
        columns: [],
        /*
                columnsRequire: [
                  {
                    title: '就诊ID',
                    dataIndex: 'VISITID',
                    width: 200,
                    scopedSlots: { customRender: 'VISITID' },
                  }, {
                    title: '姓名',
                    dataIndex: 'CLIENTNAME',
                    align: "center",
                    width: 80,
                  }, {
                    title: '性别',
                    dataIndex: 'SEX',
                    align: "center",
                    width: 80,
                  }, {
                    title: '年龄',
                    dataIndex: 'YEARAGE',
                    align: "center",
                    width: 80,
                  }, {
                    title: '医疗机构',
                    dataIndex: 'ORGNAME',
                    align: "center",
                    width: 150,
                  },
                ],
        */      isorter: {
          column: '',
          order: '',
        },
        chartSelectDict: {
          'bar': '柱状图',
          'line': '折线图',
          'pie': '饼状图'
        },
        chartSelect: 'bar',
        confirmLoading: false,
        echartLoading: false,
        params: null,
        groupByCols: [],
        groupByItem: {},
        echartOption: undefined,
        echartStack: [],
        echartOptionCache: {},
        gapType: 'eq',
        cacheData: {},
        cacheFields: ['chartSelect', 'groupByItem', 'echartOption', 'params', 'data', 'ipagination', 'ipagination'],
      }

    },
    computed: {
      scrollX() {
        return this.columns.reduce((prev, cur) => prev + (cur.width || 120), 20)
      },
      isNumGroupBy() {
        return this.groupByItem.dataType === 'NUMBER'
      },
      groupBy() {
        return this.groupByItem.colName
      },
      isDWS(){
        return this.nodeType && this.nodeType.indexOf("_dws") > -1
      }
    },
    beforeMount() {
      // this.loadData(1)
      // this.getGroupByColConfig()
    },
    watch: {
      caseData(val, oldVal) {
        if (val) {
          let { flowJson, rules, cols } = val
          // this.columnsStatic = isDWS?this.getColsByRule(cols): []
          this.setCols(cols)
          this.params = { rules: JSON.stringify(rules), cols: this.columns.map(item => item.dataIndex), isDWS:this.isDWS }
          if (flowJson) {
            this.params.flowJson = JSON.stringify(flowJson)
          }
          if (this.columns.length === 0) {
            this.$message.warn("请设置需要显示的字段")
            this.showFieldSelect()
          } else {
            // 设置排序字段，移除不存在的
            let { column, order } = this.isorter
            if (column.length > 0) {
              let orders = order.split(',')
              let columns = column.split(',')
              for (let i = 0, len = columns.length; i < len; i++) {
                let field = columns[i]
                if (!this.columns.some(item => item.dataIndex === field)) {
                  columns.splice(i, 1)
                  orders.splice(i, 1)
                  i--;
                  len--;
                }
              }
              this.isorter = {
                column: columns.join(','),
                order: orders.join(','),
              }
            } else {
              this.isorter = {
                column: '',
                order: ''
              }
            }
            this.$nextTick(() => {
              if (this.groupBy) {
                this.loadEchartData()
              }
              this.loadData(1)
            })
          }

        }
      },
      nodeKey(val, oldVal) {
        if (oldVal) {
          let obj = {}
          this.cacheData[oldVal] = obj
          for (let item of this.cacheFields) {
            obj[item] = this[item]
          }
        }
        if (val) {
          let obj = this.cacheData[val]
          if (obj) {
            for (let item of this.cacheFields) {
              this[item] = obj[item]
            }
          } else {
            this.init()
          }
        }


      }
    },
    methods: {
      reorderShow(callback) {

        callback()
      },
      getColsByRule(rules) {
        let result = []
        for (let rule of rules) {
          if (!res.has(rule.colName)) {
            res.set(rule.colName, 1)
            const col = this.colsObjDict[`${rule.tableName}:${rule.colName}`]
            if (col.isDisplayCol + '' === '1') {
              result.push({
                dataIndex: rule.colName,
                title: col.colChnName,
                orderBy: col.colOrder // 排序
              })
            }
          }
        }
        return result
      },
      setCols(cols) {
        cols.forEach(col => {
          if (col.dataIndex === 'VISITID') {
            col.width = 200
            col.scopedSlots = { customRender: 'VISITID' }
          } else {
            col.align = "center"
            col.width = 120
          }
        })
        cols.sort((a, b) => a.colOrder > b.colOrder)
        this.columns = [...cols]
        /*  if(this.isDWS){
     cols.sort((a,b) => a.colOrder > b.colOrder)
     this.columns = [...cols]
   } else {
     // cols.sort((a,b) => a.compareType === '=' && b.compareType !== '='?1:a.compareType !== '=' && b.compareType === '='?-1:0)
     cols.sort((a,b) => a.colOrder > b.colOrder)
     this.columns = [...this.columnsRequire, ...cols]
   }*/
      },
      showGroupBySelect() {
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          callback: col => {
            this.groupByItem = col
            if (this.params) {
              this.clearEchart()
              this.loadEchartData()
            }
          },
          tableName: this.tableName === 'DWB' ? 'DWB_MASTER_INFO' : this.tableName,
          selectedObj: this.groupByItem
        })
      },
      showFieldSelect() {
        // this.$emit('showSelect')
        let selectKeys = this.$ls.get('displayCol' + this.tableName)
        console.log('selectKeys', selectKeys)
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          mode: "multi",
          tip: '（提示：展示字段勾选只保存在本地缓存）',
          callback: keys => {
            this.$ls.set('displayCol' + this.tableName, keys)
            if (this.caseData) {
              /*  this.setCols(cols)
                this.params.cols = this.columns.map(item => item.dataIndex)
                this.loadData(1)*/
              this.trail()
            }
          },
          tableName: this.tableName,
          selected: selectKeys
        })
      },
      //点击就诊编号选中记录
      selectKey(visitid) {
        this.$refs.reviewDetailModel.title = '就诊记录详情';
        this.$refs.reviewDetailModel.loadData(visitid);
      },
      echartClick({ name }) {
        if (!this.isNumGroupBy)
          return
        this.loadEchartData(name)
      },
      toOldEchartData(name, index) {
        this.echartStack.splice(index, this.echartStack.length - index)
        this.loadEchartData(name)
      },
      init() {
        this.data = []
        this.ipagination = {
          current: 1,
          pageSize: 50,
          total: 0,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
        }
        this.chartSelect = 'bar'
        this.params = null
        this.groupByItem = {}
        this.echartOption = undefined
        this.clearEchart()
      },
      handleTableChange(pagination, filters = {}, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        let params = {}
        for (let i in filters) {
          params[i] = ',' + filters[i].join(",") + ','
        }
        this.filters = params
        this.ipagination = pagination;
        this.loadData();
      },
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.loading = true
        postAction(this.$suncare_v3 + "/engine/trail", {
          pageSize: this.ipagination.pageSize, pageNo: this.ipagination.current,
          ...this.params,
          ...this.isorter,
          // sortField: sorter.field,
          // sortOrder: sorter.order,
          // ...filters,

        }).then(res => {
          if (res.success) {
            this.data = res.result.records;
            this.ipagination.total = res.result.total;
          } else {
            this.$message.warning(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        }).finally(() => {
          this.loading = false;
        })
      },
      loadEchartData(name = '全部') {
        let data = this.echartOptionCache[name]
        if (data) {
          this.echartOption = data;
          this.echartStack.push(name)
          return
        }
        let min, max
        if (name !== '全部') {
          if (name.indexOf("~") === -1) {
            this.$message.warning('不能够下钻，已到最底部')
            return
          } else {
            [min, max] = name.split('~')
          }
        }
        this.echartLoading = true
        postAction(this.$suncare_v3 + "/engine/trail/echart", {
          ...this.params, facetField: this.groupByItem.colName, min, max,
          gapType: this.gapType, isDWS: this.isDWS
        }).then(res => {
          if (res.success) {
            this.echartStack.push(name)
            this.echartOptionCache[name] = this.echartOption = res.result;
          } else {
            this.$message.warning(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        }).finally(() => {
          this.echartLoading = false;
        })
      },

      // 获取分组字段列表
      getGroupByColConfig() {
        const that = this
        this.confirmLoading = true
        getGroupByColConfig().then((res) => {
          if (res.success) {
            this.groupByCols = res.result
            // this.groupBy = this.groupByCols[0].colName
          } else {
            that.$message.warning(res.message);
          }

        }).finally(() => {
          this.confirmLoading = false
        })
      },
      /* groupByChange(val){
         this.groupByItem  = this.groupByCols.find(item => item.colName === val)
         if (this.params) {
           this.clearEchart()
           this.loadEchartData()
         }
       },*/
      gapTypeChange(e) {
        this.echartOptionCache = {}
        if (this.params) {
          let name = this.echartStack.pop()
          this.loadEchartData(name)
        }
      },
      clearEchart() {
        this.echartStack = []
        this.echartOptionCache = {}
      },
      clearGroupBy() {
        this.groupByItem = {}
        this.echartOption = undefined
        this.clearEchart()
      },
      trail() {
        this.clearEchart()
        this.$emit('getParams', this.nodeKey)
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.indexOf(input) >= 0
      },
      handleExportMenu({ key, item }){
        if(key === 'caseId'){
          this.handleExportXlsAsync()
        } else if(key === 'visitid'){
          this.handleExportMasterInfo()
        }

      },
      handleExportXlsAsync() {
        let param = {
          ...this.params,
          ...this.isorter,
        };
        const that = this
        postAction(that.url.trailExportThread, param).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.$confirm({
              title: '打开导出记录界面?',
              content: '',
              onOk() {
                that.$util.openTab('/config/MedicalExportTaskList')
              },
            });
          } else {
            this.$message.warning(res.message);
          }
        })

      },
      handleExportMasterInfo() {
        let param = {
          ...this.params,
          ...this.isorter,
        };
        this.handleExportFile('试算结果导出' + moment().format('YYYYMMDDHHmmss') + '.xlsx'
                , {param: encodeURI(JSON.stringify(param))}
                , this.url.trailExportMasterInfo
                , 'post'
        )

      },

    }
  }
</script>
<style scoped>
  .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
    margin-bottom: 5px;
  }
</style>
