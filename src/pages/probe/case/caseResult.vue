<template>
  <div style="padding: 0 20px">
    <a-spin :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="12">
            <a-col :xl="6" :xs="12" :xxl="3">
              <a-form-item label="运算" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                <a-select v-model="calMethod">
                  <a-select-option :value="item.value" v-for="(item,index) in calMethods" :key="item.key">{{item.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="9" :xs="12" :xxl="5">
              <a-form-item label="节点1" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                           :validate-status="validate['field1'].status"
                           :help="validate['field1'].message">
                <a-select v-model="field1" @change="validateField($event,'field1')" @focus="fieldFocus"
                          placeholder="请选择" :dropdownMatchSelectWidth="false" showSearch :filterOption="filterOption">
                  <a-select-option :value="item.key" v-for="(item,index) in selectNodes" :key="item.key">
                    {{item.text}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="9" :xs="12" :xxl="5">
              <a-form-item label="节点2" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                           :validate-status="validate['field2'].status"
                           :help="validate['field2'].message">
                <a-select v-model="field2" @change="validateField($event,'field2')" @focus="fieldFocus"
                          placeholder="请选择" :dropdownMatchSelectWidth="false" showSearch :filterOption="filterOption">
                  <a-select-option :value="item.key" v-for="(item,index) in selectNodes" :key="item.key">
                    {{item.text}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12" :xxl="3">
              <a-form-item label="图表" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                <a-select v-model="chartSelect">
                  <a-select-option :value="index" v-for="(item,index) in chartSelectDict" :key="index">{{item}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="12" :xs="12" :xxl="6">
              <a-form-item label="统计字段" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-input placeholder="请选择" @click="showGroupBySelect" :disabled="echartLoading"
                         :value="groupBy?`${groupByItem.colChnName}(${groupByItem.colName})`:''" allowClear
                         @change="clearGroupBy"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12" :xxl="2">
              <a-button type="primary" @click="trail" style="float: right">试算</a-button>
            </a-col>

          </a-row>
        </a-form>
      </div>
      <div>
        <a-spin :spinning="echartLoading">
          <a-row v-if="echartOption" class="m-t-10">
            <a-col :xl="12" :xs="24" >
              y轴值为<a>病例数量({{echartOption.count}})</a>，x轴值为<a>{{groupByItem.colChnName}}</a>的{{isNumGroupBy?'区间(点击可下钻)':'值'}}
            </a-col>
            <a-col :xl="12" :xs="24" class="t-r" v-if="isNumGroupBy">
              {{groupByItem.colChnName}}(
              平均值：<a>{{echartOption.avg | numberFix}}</a>
              <a-divider type="vertical" />
              众数：<a>{{echartOption.mode | numberFix}}</a>
              <tempalte v-if="echartOption.median!==undefined && echartOption.median!==null">
                <a-divider type="vertical" />
                中位数：<a>{{echartOption.median | numberFix}}</a>
              </tempalte>
              )
            </a-col>
            <a-col :xs="24" v-if="echartStack.length > 1" >
              <a-breadcrumb  @click="toOldEchartData(0)">
                <template v-for="(item,index) in echartStack">
                  <a-breadcrumb-item >
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
                <a><a-icon type="exclamation-circle" /></a>
              </a-tooltip>
            </a-col>
          </a-row>
          <echart height="300px" :type="chartSelect" @click="echartClick" :option="echartOption"></echart>
        </a-spin>
        <a-row :gutter="18" class="m-b-20">
          <a-col :xl="8" :md="12" :xs="24" class="m-t-10">
            <mini-echart :params="params" :is-DWS="false" field="ORGNAME" title="医疗机构分布"></mini-echart>
          </a-col>
          <a-col :xl="8" :md="12" :xs="24" class="m-t-10">
            <mini-echart :params="params" :is-DWS="false" field="DISEASENAME" title="疾病名称分布"></mini-echart>
          </a-col>
          <a-col :xl="8" :xs="24" class="m-t-10">
            <mini-echart :params="params" :is-DWS="false" field="TOTALFEE" title="医疗费用总金额"></mini-echart>
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
          :scroll="{ y: 300 }"
          @change="handleTableChange">
          <!-- style="width: 55%;float: right;margin-top: 10px">-->
          <span slot="jzid" slot-scope="text, record">
            <a @click="selectKey(record.jzid)" style="word-break: break-all">{{text}}</a>
          </span>
        </a-table>

      </div>
    </a-spin>
    <review-detail-model ref="reviewDetailModel"></review-detail-model>
  </div>
</template>

<script>
  import echart from './echart'
  import {getGroupByColConfig } from '@/api-sv3/api-flow'
  import { getAction,postAction} from '@/api/manage'

  import ReviewDetailModel from "@/pages/review/modules/reviewDetailModel.vue"
  import MiniEchart from '@/pages/probe/case/resultPlugin/MiniEchart'

  export default {
    name: "fillParams",
    components: {
      // RouteView
      echart,
      MiniEchart,
      ReviewDetailModel
    },
    props: ['nodes', 'keyPre', 'caseData', 'uniqueVal'],
    data() {
      return {
        data: [],
        ipagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
        },
        loading: false,
        columns: [
          {
            title: '就诊ID',
            dataIndex: 'jzid',
            width: '30%',
            scopedSlots: { customRender: 'jzid' },
          }, {
            title: '姓名',
            dataIndex: 'patientname',
            align: "center",
            width: '20%',
          }, {
            title: '性别',
            dataIndex: 'sex',
            align: "center",
            width: '10%',
          }, {
            title: '年龄',
            dataIndex: 'age',
            align: "center",
            width: '10%',
          }, {
            title: '医疗机构',
            dataIndex: 'orgname',
            align: "center",
            width: '30%',
          },
        ],
        chartSelectDict: {
          'bar': '柱状图',
          'line': '折线图',
          'pie': '饼状图'
        },
        chartSelect: 'bar',
        confirmLoading: false,
        echartLoading: false,
        validate: {
          field1: {},
          field2: {}
        },
        params: null,
        flowRuleData: {},
        groupByCols: [],
        groupByItem: {},
        calMethods: [
          { value: 'intersect', name: '交集' },
          { value: 'diff', name: '差集' },
          { value: 'union', name: '并集' },
          // { value: 'clientIntersect', name: '病人交集' },
        ],
        calMethod: 'intersect',
        echartOption: undefined,
        echartStack: [],
        echartOptionCache: {},
        gapType: 'eq',
        field1: '',
        field2: '',
        tableName: 'DWB_MASTER_INFO'

      }

    },

    beforeMount() {
      // this.loadData(1)
      // this.getGroupByColConfig()
    },
    watch: {
      caseData(val, oldVal) {
        if (val) {
          let obj1 = val[0]
          let obj2 = val[1]
          let colMap = new Map();
          for(let col of obj1.cols){
            colMap.set(col.dataIndex, col)
          }
          let cols = []
          colMap.forEach((col,key) => {
            if(col.dataIndex === 'VISITID'){
              col.width = 200
              col.scopedSlots = { customRender: 'VISITID' }
            } else {
              col.align = "center"
              col.width = 120
            }
            cols.push(col)
          })
          cols.sort((a,b) => a.colOrder > b.colOrder)
          // this.columns = [...cols]
          this.params = {
            flowJson: JSON.stringify(obj1.flowJson), rules: JSON.stringify(obj1.rules),
            compareFlowJson: JSON.stringify(obj2.flowJson), compareRules: JSON.stringify(obj2.rules),
            compareType: this.calMethod,
            cols: this.columns.map(item => item.dataIndex)
          }

          /*if(this.columns.length === 0){
            this.$message.warn("请设置需要显示的字段")
            this.showFieldSelect()
          } else {*/
            this.$nextTick(() => {
              if(this.groupBy){
                this.loadEchartData()
              }
              this.loadData(1)
            })
          // }
        }
      }
    },
    methods: {
      echartClick({name}){
        if(!this.isNumGroupBy)
          return
        this.loadEchartData(name)
      },
      toOldEchartData(name,index){
        this.echartStack.splice(index,this.echartStack.length - index)
        this.loadEchartData(name)
      },
      showGroupBySelect(){
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          callback: col => {
            this.groupByItem = col
            if (this.params) {
              this.clearEchart()
              this.loadEchartData()
            }
          },
          tableName: this.tableName,
          selectedObj: this.groupByItem})
      },
      showFieldSelect(){
        let selectKeys = this.$ls.get('displayCol' + this.tableName)
        console.log('selectKeys',selectKeys)
        this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
          mode: "multi",
          tip: '（提示：展示字段勾选只保存在本地缓存）',
          callback: keys => {
            this.$ls.set('displayCol' + this.tableName, keys)
            if(this.caseData){
              this.trail()
            }
          },
          tableName: this.tableName,
          selected: selectKeys})
      },
      fieldFocus(e) {
        this.$emit('getNodes')
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
        postAction(this.$suncare_v3 + "/engine/trail/compare",{
          pageSize: this.ipagination.pageSize, pageNo: this.ipagination.current,
          ...this.params
          // sortField: sorter.field,
          // sortOrder: sorter.order,
          // ...filters,

        }).then(res => {
          if (res.success) {
            this.data = res.result.records;
            this.ipagination.total = res.result.total;
            console.log('data', this.data)
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
        if(data){
          this.echartOption = data;
          this.echartStack.push(name)
          return
        }
        let min,max
        if(name!== '全部'){
          if(name.indexOf("~") === -1){
            this.$message.warning('不能够下钻，已到最底部')
            return
          } else {
            [min,max] = name.split('~')
          }
        }
        this.echartLoading = true
        postAction(this.$suncare_v3 + "/engine/trail/compare/echart",{ ...this.params, facetField: this.groupBy,min,max,gapType:this.gapType }).then(res => {
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
        this.$store.dispatch('GetCacheAsync', {
          key: 'trailGroupBy', func: resolve => {
            this.confirmLoading = true
            getGroupByColConfig().then((res) => {
              if (res.success) {
                this.groupByCols = res.result
                resolve(res.result)
              } else {
                this.$message.warning(res.message);
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        }).then((data) => {
          this.groupByCols = data
        })
      },
     /* groupByChange(val) {
        this.groupByItem = this.groupByCols.find(item => item.colName === val)
        if (this.params) {
          this.clearEchart()
          this.loadEchartData()
        }
      },*/
      gapTypeChange(e){
        this.echartOptionCache = {}
        if (this.params) {
          let name = this.echartStack.pop()
          this.loadEchartData(name)
        }
      },
      //点击就诊编号选中记录
      selectKey(visitid) {
        this.$refs.reviewDetailModel.title = '就诊记录详情';
        this.$refs.reviewDetailModel.loadData(visitid);
      },
      trail() {
        let hasNoError = true
        for (let field in this.validate) {
          console.log(field, this[field])

          if (!this[field] || this[field].length === 0) {
            this.$set(this.validate, field, { status: 'error', message: '请先选择' })
            hasNoError = false
          }
        }
        if (this.field1 === this.field2) {
          this.$set(this.validate, 'field2', { status: 'error', message: '不能选择相同的节点' })
          hasNoError = false
        }
        if (hasNoError) {
          this.clearEchart()
          this.$emit('getParams', [this.field1, this.field2])
        }
      },
      clearEchart(){
        this.echartStack =  []
        this.echartOptionCache = {}
      },
      clearGroupBy(){
        this.groupByItem = {}
        this.echartOption=undefined
        this.clearEchart()
      },
      validateField(val, field) {
        if (val && val.toString().length > 0) {
          this.$set(this.validate, field, {})
        }
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.indexOf(input) >= 0
      },
    },
    computed: {
      selectNodes() {
        return this.nodes.filter(node => node.category === 'rectangle' || node.category === 'end')
      },
      isNumGroupBy(){
        return this.groupByItem.dataType ==='NUMBER'
      },
      groupBy(){
        return this.groupByItem.colName
      }
    },
  }
</script>
<style scoped>
  .table-page-search-wrapper .ant-form-inline .ant-form-item, .table-page-search-wrapper .table-page-search-submitButtons {
    margin-bottom: 5px;
  }
</style>
