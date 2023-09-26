<template>
  <a-card :bordered="false" >
    <resize-division :px="true" :offset="300" :limit="200">
      <div slot="left" style="overflow: auto;">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="表名" key="1">
            <a-input-search style="margin-bottom: 8px" placeholder="查询表名" allowClear enter-button @change="onChange" />
            <!--<a-tree
              :tree-data="treeData"
              @select="onSelect" style="overflow: auto;" :style="{height: height+'px'}">
              <template slot="title" slot-scope="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>-->
            <a-menu style="overflow: auto;"
                    :style="{height: height+'px'}"
                    :default-selected-keys="defaultSelectedKeys">
              <a-menu-item style="display:none"></a-menu-item> <!--使第一个选中有背景色-->
              <a-menu-item v-for="item in treeData" :key="item.key"  @click="onSelectTable(item.key)">
                <span v-if="item.title.indexOf(searchValue) > -1">
                  {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
                </span>
                <span v-else>{{ item.title }}</span>
              </a-menu-item>
            </a-menu>
          </a-tab-pane>
          <a-tab-pane tab="保存的条件" key="2">
            <flow-templ-list @loadRules="loadRules" ref="flowTemplListRef"></flow-templ-list>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template  slot="right">
        <div>
          <div></div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> {{tableTitle}}
          </div>
          <rule-detail ref="ruleRef" :tableName="tableName" :uniqueVal="uniqueVal" :readOnly="readonly" @groupChange="ruleChange"></rule-detail>
          <a-row :gutter="12" style="margin: 0;padding:0 20px 10px 20px">
            <a-col class="t-r">
              <a-button @click="addGroup" v-if="!readonly">增加组</a-button>
              <a-button type="primary" @click="saveFlowTempl" class="m-l-6" v-if="!readonly">保存条件</a-button>
            </a-col>
          </a-row>
          <a-row style="margin: 0;padding:0 20px 10px 20px">
            <a-col :xs="12" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search" >查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
              <a-button icon="setting" @click="showFieldSelect" class="m-l-6">展示</a-button>

            </span>
            </a-col>
          </a-row>
        </div>
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
            :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent}"
            @change="handleTableChange"
            v-bind="tableAttrs">
            <span slot="VISITID" slot-scope="text, record">
              <a @click="selectKey(record.VISITID)" style="word-break: break-all">{{text}}</a>
            </span>
          </a-table>
        </div>
      </template>
    </resize-division>
    <!-- 就诊记录详情 -->
    <review-detail-model ref="reviewDetailModel"></review-detail-model>

    <!-- 节点编辑 -->
    <flowTempl-modal ref="flowTemplModal" @ok="flowTemplOk"></flowTempl-modal>
  </a-card>
</template>

<script>
import { getRuleColConfig,queryFlowTemplRulesById } from '@/api-sv3/api-flow'
import ResizeDivision from '@//components/ResizeDivision'
import RuleDetail from '@/pages/probe/case/caseRuleDetail'
import pick from 'lodash/pick'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ARow from "ant-design-vue/es/grid/Row";
import { getAction,httpAction,postAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import ReviewDetailModel from "@/pages/review/modules/reviewDetailModel"
import flowTemplList from "@/pages/probe/flow/flowTemplList"
import flowTemplModal from '@/pages/probe/flow/modules/flowTemplModal'
export default {
  name: 'chartSetting',
  mixins:[JeecgListMixin],
  components: {
    ARow,
    ResizeDivision,
    RuleDetail,
    ReviewDetailModel,
    flowTemplList,
    flowTemplModal
  },
  props: {

    readonly: {
      type: String,
      default: false
    },
    uniqueVal: {
      type: Number,
      default: new Date().getTime()
    }
  },
  data() {
    return {
      modalVisible: false,

      searchValue: '',
      treeData:[],
      tableNameData:[],
      defaultSelectedKeys:[],
      tableName: '',
      tableTitle:'',

      groups:[],
      nodeKey: '1',
      nodeRecord:{},

      // 表头
      columns: [],
      cols: [],
      url: {
        list: this.$suncare_v3 + "/engine/trail",
        colConfigList: "/config/medicalColConfig/list",
      },
      isorter: {
        column: 'id',
        order: 'asc',
      },
      initLoad:false,
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
    ...mapGetters(["height","colDict"]),
  },
  beforeMount() {
    this.initTableNameData()
  },
  mounted(){
    let ruleFunNames = [
      'addGroup',
      'clearRule',
      'deleteGroups',
      'setRules',
      'getRules',
      'addRules',
      'removeRules',
      'getCols',
      'showSelect']
    const that = this
    ruleFunNames.forEach(item => {
      that[item] = function(...arg) {
        return that.$refs.ruleRef[item](...arg)
      }
    })
    this.addGroup(false)
  },
  methods: {
    //选中左侧表
    onSelect(selectedKeys) {
      this.tableName = selectedKeys[0]
      this.tableTitle =  this.treeData.filter(item => item.key==this.tableName)[0].title
      this.searchReset()
    },
    onSelectTable(tableName){
      this.onSelect([tableName])
    },
    //查询左侧表
    onChange(e) {
      this.searchValue = e.target.value
      this.treeData = this.tableNameData.filter(item => {
        if(item.title.indexOf(this.searchValue) > -1||
          item.title.indexOf(this.searchValue.toLowerCase()) > -1||
          item.title.indexOf(this.searchValue.toUpperCase()) > -1){
          return item
        }
      })
    },
    //获取左侧列表数据
    initTableNameData() {
      console.dir(this.height)
      //根据字典Code, 初始化字典数组
      this.loading = true
      this.$util.initDict('DATA').then(data => {
        this.tableNameData =  data.map(item => {
          return {
            title: `${item.value}(${item.code})`,
            key: item.code,
            scopedSlots: { title: 'title' }
          }
        })
        this.treeData = this.tableNameData
        if(this.treeData&&this.treeData.length>0){
          this.tableName = this.treeData[0].key
          this.tableTitle = this.treeData[0].title
          this.defaultSelectedKeys.push(this.treeData[0].key)
          this.getColConfig()
        }
      }).finally(()=>{
        this.loading = false
      })

    },

    // 获取字段列表
    getColConfig() {
      let { tableColDict } = this.$store.state.cache.colConfig
      if(Object.keys(this.colDict).length === 0||!tableColDict[this.tableName]){
        getAction(this.url.colConfigList,{tabName:this.tableName,pageSize:99999,column:'colOrder',order: 'asc'},'get').then((res) => {
          if (res.success) {
            this.cols = res.result.records
            this.setColumns()
          } else {
            this.$message.warning(res.message);
          }
        })
      }else{
        this.cols = tableColDict[this.tableName]
        this.setColumns()
      }
    },

    setColumns(){
      //this.columns =  this.cols.filter(col => !(col.colType === 2 && (!col.colValueExpressionSolr || col.colValueExpressionSolr === 'VIRTUAL' || col.colValueExpressionSolr.toString().trim().length === 0)))
      if(this.cols){
        this.columns =  this.cols.filter(col => col.colType === 1).map(col => this.setCol(col))
      }else{
        this.columns=[]
      }
      if(this.columns.length>0){
        this.columns.sort((a, b) => a.colOrder > b.colOrder)
        this.loadData()
      }else{
        this.dataSource = []
        this.ipagination.total = 0
      }
      this.isorter= {
        column: 'id',
        order: 'asc',
      }
    },

    setCol(col) {
      col.colName = col.colName.toUpperCase()
      col.title= col.colChnName
      col.dataIndex= col.colName
      if (col.dataIndex === 'VISITID') {
        col.width = 200
        col.scopedSlots = { customRender: 'VISITID' }
      } else {
        col.align = "center"
        col.width = 120
      }
      return col
    },

    //点击就诊编号选中记录
    selectKey(visitid) {
      this.$refs.reviewDetailModel.title = '就诊记录详情';
      this.$refs.reviewDetailModel.loadData(visitid);
    },

    showFieldSelect() {
      let selectKeys = this.columns.map(item => this.tableName+":"+item.dataIndex)
      this.$bus.$emit('fieldSelectShow' + this.uniqueVal, {
        mode: "multi",
        tip: '（提示：展示字段勾选只保存在本地缓存）',
        callback: keys => {
          this.columns = this.cols.filter(item => {
            for (let key in keys) {
              let value = this.tableName+":"+item.colName
              if (value==keys[key]) {
                return true
              }
            }
            return false
          }).map(col => this.setCol(col))
          if(this.columns.length>0){
            this.columns.sort((a, b) => a.colOrder > b.colOrder)
          }
        },
        tableName: this.tableName,
        selected: selectKeys
      })
    },

    searchReset(){
      this.$refs.ruleRef.setRules([])
      this.$refs.ruleRef.nodeChange(this.nodeKey)
      this.addGroup(false)
      this.getColConfig()
      this.nodeRecord = {}
      if(this.$refs.flowTemplListRef){
        this.$refs.flowTemplListRef.onClearSelected()
      }
    },

    searchQuery(){
      this.loadData()
    },

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
      params.isDWS = true
      params.pageSize = this.ipagination.pageSize
      params.pageNo = this.ipagination.current
      params.column = this.isorter.column
      params.order = this.isorter.order
      params.rules = JSON.stringify(this.getGroupParamValue())
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
    //获取查询条件rules
    getGroupParamValue(){
      let tableName = this.tableName
      let rules = this.getGroupRules()
      if(rules.length==0){
        rules.push({"logic":"AND","tableName":tableName,"colName":"id","compareType":":","compareValue":"*","groupNo":0})
      }
      return rules
    },

    ruleChange(val){
      this.groups = val
    },

    getGroupRules(){
      let rules = []
      let groups = this.$refs.ruleRef.getAllGroup()
      let tableName = this.tableName
      groups.forEach(function(group,index){
        group.forEach(function(rule,ruleIndex){
          if(!rule.tableName){
            rule.tableName=tableName
          }
          if(rule.colName&&rule.compareValue){
            rule.groupNo = index
            rule.orderNo = ruleIndex
            rules.push(rule)
          }
        })
      })
      return rules
    },

    //点击右侧节点加载节点规则
    loadRules(record){
      queryFlowTemplRulesById({id:record.nodeId}).then(res => {
        if (res.success) {
          let data = res.result
          if(data.length>0){
            this.nodeRecord = record
            data.forEach(item => item.nodeCode = this.nodeKey)
            this.$refs.ruleRef.setRules(data)
            this.$refs.ruleRef.nodeChange(this.nodeKey)
            this.tableNameChange(data[0].tableName)
          }else{
            this.$message.warning('节点规则详情为空');
            this.$refs.flowTemplListRef.onClearSelected()
            if(this.nodeRecord&&this.nodeRecord.nodeId){
              this.$refs.flowTemplListRef.onSelectChange([this.nodeRecord.nodeId],[this.nodeRecord])
            }
          }
        } else {
          this.$message.warning(res.message);
        }
      })
    },

    //所属表改变
    tableNameChange(tableName){
      this.tableName = tableName
      let tableItem = this.tableNameData.filter(item => item.key === this.tableName)
      if(tableItem&&tableItem.length>0){
        this.tableTitle = tableItem[0].title
      }
      this.getColConfig()
    },

    //保存节点信息
    saveFlowTempl(){
      if(!this.$refs.ruleRef.validateData(this.nodeKey)){
        return
      }
      const rules = this.getGroupRules()
      this.$refs.flowTemplModal.title = '保存条件'
      this.$refs.flowTemplModal.setNodeRules(rules)
      this.$refs.flowTemplModal.edit(this.nodeRecord)
    },

    flowTemplOk(record){
      this.$refs.flowTemplListRef.loadCurrentPage()
      this.$refs.flowTemplListRef.onClearSelected()
      this.$refs.flowTemplListRef.onSelectChange([record.nodeId],[record])
    },


  },
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
