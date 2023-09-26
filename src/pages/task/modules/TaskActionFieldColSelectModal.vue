<template>
    <m-modal
            centered
            title="请选择展现字段"
            :visible="selectVisible"
            @ok="handleSelectOk"
            @cancel="handleSelectClose"
            cancelText="关闭">

            <!-- 查询区域 -->
            <div class="table-page-search-wrapper">
                <a-form layout="inline" >
                    <a-row :gutter="24">
                        <a-col :span="6">
                            <a-form-item label="所属表名">
                                <m-dict-select-tag placeholder="请选择表名" dictCode="DATA" :filter="tableFilter"
                                                   v-model="queryParam.tableName" showKey search
                                @change="searchQuery"></m-dict-select-tag>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="字段中文名">
                                <a-input placeholder="请输入字段中文名" v-model="queryParam.colCnname" @change="searchQuery"></a-input>
                            </a-form-item>
                        </a-col>
                         <a-col :span="6">
                             <a-form-item label="适用平台">
                                 <m-dict-select-tag placeholder="请选择适用平台" dictCode="ACTION_FIELD_PALTFORM"
                                                    v-model="queryParam.platform" @change="searchQuery"/>
                             </a-form-item>
                         </a-col>
                        <template v-if="toggleSearchStatus">
                            <a-col :span="6">
                                <a-form-item label="字段名">
                                    <a-input placeholder="请输入字段名" v-model="queryParam.colName" @change="searchQuery"></a-input>
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :span="6">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <!--<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
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
                <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                              v-on="selectActionOn"></selected-tag>
                <a-table
                        ref="table"
                        size="middle"
                        bordered
                        rowKey="colId"
                        :columns="columns"
                        :dataSource="dataShow"
                        :pagination="false"
                        :loading="loading"
                        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
                        :scroll="{ x: scrollX, y: scrollY}"
                        @change="handleTableChange">
                </a-table>
            </div>
            <!-- table区域-end -->
    </m-modal>
</template>

<script>
  import MedicalDictItemList from '@/pages/config/MedicalDictItemList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"

  import debounce from 'lodash/debounce';


  export default {
    name: "MedicalDictList",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin],
    components: {
      MedicalDictItemList,
      MDictSelectTag,
    },
    data() {
      const columns = [
        {
          title: '字段名称',
          align: "left",
          dataIndex: 'colCnname',
          // scopedSlots: { customRender: 'code' },
          width: 180,
        },
        {
          title: '表名称(来源)',
          align: "center",
          dataIndex: 'tableName',
          width: 200,
        },
        {
          title: '字段英文名称(来源)',
          align: "center",
          dataIndex: 'colName',
          width: 180,
        },
        {
          title: '适用平台',
          align: "center",
          dataIndex: 'platform',
          width: 120,
          customRender: text => this.paltFormDict[text]
        },
        {
          title: '状态',
          align: "center",
          dataIndex: 'status',
          width: 80,
          customRender: text => this.statusDict[text]
        },
      ]
      return {
        description: '动态表单字段选择',
        selectVisible: false,
        initLoad: false,
        tableMarginTop: 300,
        // 表头
        columns: columns,
        /* 排序参数 */
        isorter: {
          column: '',
          order: '',
        },
        id: 'colId',
        code: 'colName',
        name: 'colCnname',
        dataShow: [],
        tableFilter: undefined
      }
    },
    computed: {
      rowSelection() {
        return {
          getCheckboxProps: record => ({
            props: {
              disabled: record.status === 'stop', // Column configuration not to be checked
            },
          }),
        };
      },
    },
    beforeMount(){
      this.searchQuery = debounce(this.searchQuery, 500);//消抖
      this.$util.initDict(['ACTION_FIELD_PALTFORM', 'SWITCH_STATUS']).then(data => {
        this.paltFormDict = data.ACTION_FIELD_PALTFORM.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
        this.statusDict = data.SWITCH_STATUS.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
      })
    },
    methods: {
      orderData(){
        let {column, order} = this.isorter
        if(column.trim().length > 0){
          let cols = column.split(',').map(r => r.trim())
          let orderNums = order.split(',').map(r => r.trim() === 'asc'? 1: -1)
          this.dataShow.sort((r1, r2) => {
            for(let [index,col] of cols.entries()){
              let r1Val = r1[col].toUpperCase()
              let r2Val = r2[col].toUpperCase()
              if(r1Val > r2Val){
                return orderNums[index]
              }
              if(r1Val < r2Val){
                return 0 - orderNums[index]
              }
            }
          })

        }

      },
      openSelect(data) {
        this.dataSource = data
        this.dataShow = [...data]

        let tableSet = new Set(data.map(r => r.tableName))
        console.log('tableSet',tableSet)
        this.tableFilter = r => tableSet.has(r.code)
        this.orderData()
        this.selectVisible = true
      },
      handleSelectOk(){
        this.$emit('ok', this.getSelect())
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      searchReset(){
        this.queryParam = {}
        this.isorter = {
          column: '',
          order: '',
        }
        this.searchQuery()
        this.orderData()
      },
      searchQuery(){
        let queryFields = []
        let queryParam = this.queryParam
        for(let field in queryParam){
          let val = queryParam[field]
          if(val !== undefined && (val = val.trim()) !== ''){
            queryFields.push({
              field, val
            })
          }
        }
        this.dataShow = queryFields.length > 0?this.dataSource.filter(r => queryFields.filter(f => {
          return ((r[f.field] || '') + '').indexOf(f.val) > -1
        }).length === queryFields.length)
          :[...this.dataSource]
        this.orderData()
      }
    },
    watch: {}
  }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
