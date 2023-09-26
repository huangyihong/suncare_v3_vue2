import {
  taskProjectBatchNextStep,
  taskProjectBatchLastStep,
  taskProjectBatch3rdStep,
  queryStepItemByBatchStep,
  queryBatchAndProjectById,
} from '@/api-sv3/api'
import TaskProjectBatchModal from '@/pages/task/modules/TaskProjectBatchModal'
import RuleActionPop from '@/pages/review/plugins/RuleActionPop'
import SelectModal from '@/components/SelectModal'
import { getAction, postAction } from '@/api/manage'

export const reviewMixin = {
  components: { TaskProjectBatchModal },
  data() {
    return {
      projectBatch: {},
      project: {},
      projectInfo: undefined,
      step: -1,
      onStep: false,
      loadProjectInfo: true
    }
  },
  computed: {
    batchId() {
      return this.$route.query.batchId
    }
  },
  beforeMount: function() {
    if (this.loadProjectInfo) {
      this.getTaskProjectBatch(this.batchId)
    }

  },
  methods: {
    //获取项目批次信息
    getTaskProjectBatch(id) {
      queryBatchAndProjectById({ id }).then((res) => {
        if (res.success) {
          let { project = {}, projectBatch = {} } = res.result
          this.project = project
          this.projectBatch = projectBatch
          this.projectInfo = `${project.projectName}-${projectBatch.batchName}-${projectBatch.month}`
          this.onStep = projectBatch.step === this.step
          console.log(' this.onStep', this.onStep)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    passToNextStep(batchId) {
      taskProjectBatchNextStep({ batchId }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.onStep = false
          this.gotoNextStepPage(true, this.batchId)
        } else {
          if (res.result === 3) {
            // 去配置不合规行为
            const that = this
            this.$confirm({
              title: '是否去配置?',
              content: res.message,
              onOk() {
                that.gotoPath('/formal/modelConfig/behaviorModel/behaviorModelList', { batchId })
              },
              onCancel() {
              }
            })
          } else {
            this.$message.warning(res.message)
          }
        }
      })
    },
    passTo3rdStep(batchId) {
      taskProjectBatch3rdStep({ batchId }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.onStep = false
          // this.gotoNextStepPage(true, this.batchId)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    turnToLastStep(batchId) {
      taskProjectBatchLastStep({ batchId }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.onStep = false
          this.gotoNextStepPage(false, this.batchId)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    gotoNextStepPage(next, batchId) {
      let step = this.step + (next ? 1 : -1) + ''
      console.log('gotoNextStepPage', step)
      if (step === '0') {
        this.handleEdit(record)
      } else if (step === '1') {
        this.replacePath('/review/reviewSystemList', { batchId })
      } else if (step === '2') {
        this.replacePath('/review/reviewList', { batchId })
      } else if (step === '3') {
        this.replacePath('/review/reviewSecondList', { batchId })
      } else if (step === '4') {
        this.replacePath('/review/reviewCustomList', { batchId })
      }
    },
    replacePath(path, query) {
      this.$router.replace({ path, query })
    },
    gotoPath(path, query) {
      this.$router.push({ path, query })
    }
  }
}

const customRenderMap = {
  NUMBER: (text, record, index) => {
    if (text && typeof text === 'number' && !isNaN(text)) {
      return text.toFixed(2)
    }
    return text
  },
  DATE: (text, record, index) => {
    if (text && typeof text === 'string') {
      return text.replace(' 00:00:00', '')
    }
    return text
  },
  DICT: (text, record, index) => {
    return text
  }
}
const joinCustomRender = (text, record, index) => {
  if (text) {
    return text.join(',')
  }
  return text
}

import ImportModal from '@/components/ImportModal'
import AsyncLogModalButton from '@/pages/task/plugin/AsyncLogModalButton'

const jsxTemp = {
  props: ['jsx'],
  render() {
    return (
      this.jsx
    )
  }
}

export const reviewDynamicColMixin = {
  components: { SelectModal, RuleActionPop, ImportModal, AsyncLogModalButton, jsxTemp },
  data() {
    const that = this
    this.defaultCols = []
    // 合并字段特殊属性
    this.assignColProp = {
      VISITID: {
        // align: 'left',
        // width: 200,
        customRender: function(text, record, index) {
          return <a onClick={e => that.selectVisit(text)}>{text}</a>
        }
      },
      ZY_ID_THIS: {
        // align: 'left',
        // width: 200,
        customRender: function(text, record, index) {
          return <a onClick={e => that.selectVisit(text)}>{text}</a>
        }
      },
      ZY_ID_ONE: {
        // align: 'left',
        // width: 200,
        customRender: function(text, record, index) {
          return <a onClick={e => that.selectVisit(text)}>{text}</a>
        }
      },
      ZY_ID_LAST: {
        // align: 'left',
        // width: 200,
        customRender: function(text, record, index) {
          return <a onClick={e => that.selectVisit(text)}>{text}</a>
        }
      },
      DAYAGE: {
        customRender: (text, record, index) => {
          return record.YEARAGE > 0 ? record.YEARAGE + '岁'
            : record.MONTHAGE > 0 ? `${record.MONTHAGE}月/${record.DAYAGE}天`
              : `${record.DAYAGE}天`
        },
        relate: ['YEARAGE', 'MONTHAGE']
      },
      //冲突项目
      MUTEX_ITEM_NAME: {
        customRender: (value, record, index) => {
          if (record.MUTEX_ITEM_NAME) {
            if(!(value instanceof Array)){
              value = [record.MUTEX_ITEM_NAME]
            }
            let tags = value.map(r => {
              let [name, code] = r.split('::')
              return <p>{name}({code})</p>
            })
            return <div>{tags}</div>
          }
          return ''
        }
      },
      // 违反限定范围
      RULE_SCOPE_NAME: {
        customRender: joinCustomRender
      },
      // 项目
      CASE_NAME: {
        // width: 150,
        relate: ['CASE_ID']
      },
      // 不合规行为释义
      ACTION_DESC: {
        // align: 'left',
        // width: 180,
        /*customRender: function(text, record, index) {
          if(!text || text.length < 15){
            return text
          }
          return <j-ellipsis value={text} length={15}/>
        }*/
      },
      // 政策依据
      RULE_BASIS: {
        // align: 'left',
        // width: 180,
       /* customRender: function(text, record, index) {
          if(!text || text.length < 15){
            return text
          }
          return <j-ellipsis value={text} length={15}/>
        }*/
      },
      // 原始就诊ID
      HIS_VISITID: {
        // align: 'left',
        // width: 180
      },
      // 历史就诊记录链接
      HIS_VISIT_RECORD: {
        // width: 100,
        customRender: function(text, record, index) {
          return <a onClick={e => that.selectVisit(record.VISITID, '3')}>查看</a>
        }
      },
      // 疾病诊断名称
      DISEASENAME: {
        // align: 'left',
        // width: 180
      },
      'DWS_PATIENT_1VISIT_ITEMSUM.ITEMNAME': {
        /*customRender: function(text, record, index) {
          if(!text || text.length < 15){
            return text
          }
          return <j-ellipsis value={text} length={15}/>
        }*/
      }

    }

    this.groupByCols = [
      /*{
        title: '统计维度',
        align: 'center',
        dataIndex: 'val',
        width: 100
      },*/
      {
        title: '数量',
        align: 'center',
        dataIndex: 'count(*)',
        // width: 100,
        scopedSlots: { customRender: 'groupByCount' }
      },
      {
        title: '最小基金支出总金额',
        align: 'center',
        dataIndex: 'sum(ACTION_MONEY)',
        // width: 100,
        customRender: (text, record, index) => text && text.toFixed(2)
      },
      {
        title: '最大基金支出总金额',
        align: 'center',
        dataIndex: 'sum(MAX_ACTION_MONEY)',
        // width: 100,
        customRender: (text, record, index) => text && text.toFixed(2)
      },
      {
        title: '最小违规总金额',
        align: 'center',
        dataIndex: 'sum(MIN_MONEY)',
        // width: 100,
        customRender: (text, record, index) => text && text.toFixed(2)
      }, {
        title: '最大违规总金额',
        align: 'center',
        dataIndex: 'sum(MAX_MONEY)',
        // width: 100,
        customRender: (text, record, index) => text && text.toFixed(2)
      }
    ]

    // this.termActionNameUrl = this.$suncare_v3 + '/apiReviewFirst/termActionName'
    this.termActionDataUrl = this.$suncare_v3 + this.$gp_database +'/apiReviewFirst/termActionData'
    this.facetFieldsUrl = this.$suncare_v3 + this.$gp_database + '/apiReviewFirst/facetFields'
    this.getDefSelectColUrl = '/task/taskActionFieldCol/getDefSelectCol'
    this.getDefSerColUrl = '/task/taskActionFieldCol/getDefSerCol'
    this.listFieldConfigByActionUrl = '/task/taskActionFieldConfig/listFieldConfigByAction'
    if (this.rightCols == null) {
      this.rightCols = [
      ]
    }

    return {
      searchBtnLoading: false,
      actionLoading: false,
      initLoad: false,
      isActionField: false,
      actionData: [],
      groupby: [],
      groupbyIndex: -1,
      sortToLowercase: true,
      columns: [
        ...this.rightCols
      ],
      hisItemLoading: false,
      itemNameOption: [],
      hisItemOption: [],
      tableFooterJsx: <div class="t-c p-t-20 p-b-20 t-grey-666" >正在加载...</div>,
      rowKey: 'id',
      queryParam: {
        dynamicSearch: {},
        actionName: undefined
      },
      dynamicSearchs: []
    }
  },
  beforeMount() {
    for (let key in this.url) {
      let url = this.url[key]
      if (url && url.length > 0) {
        this.url[key] = this.$suncare_v3 + url
      }
    }
    if (this.onStep && this.step === 1 && (this.ruleType === 'DRUG' || this.ruleType === 'CHARGE' || this.ruleType === 'TREAT'
      || this.ruleType === 'DRUGUSE' || this.ruleType === 'CLINICAL')) {
      this.assignColProp.CASE_NAME.customRender = (text, record, index) => {
        return <rule-action-pop value={text} code={record.CASE_ID}
                                batchId={this.batchId} ruleType={this.ruleType} ruleIds={record.RULE_ID} actionTypeId={record.ACTION_TYPE_ID}
                                onRefresh={this.refreshPage}
        />
      }
    }
    this.actionLoading = true
    Promise.all([
      // 获取默认字段与搜索条件
      this.initDefData(),
      // 获取不合规行为
      getAction(this.termActionDataUrl, { ...this.fixedParam, fields: undefined, fieldTitles: undefined })
    ]).then(([res1, res]) => {
      // 解析不合规行为
      if (res.success) {
        let data = res.result
        let actionData = this.actionData = data.map(item => ({
          code: item.val,
          value: `${item.name || item.actionName || item.val}(${item.count})`
        }))
        if (actionData.length === 1) {
          let actionId = actionData[0].code
          this.$set(this.queryParam, 'actionId', actionId)
          this.loadActionFieldConfig(actionId)
          // this.loadActionFieldConfig(this.queryParam.actionId = actionId)
        } else {
          // 设置默认字段与搜索条件
          this.resetCols(this.defaultCols)
          this.resetSearchArea(this.defaultSers)
          this.loadPageData()
        }
      } else {
        this.$message.warning(res.message)
      }
    }).finally(() => {
      this.actionLoading = false
    })
  },
  methods: {
    async initDefData(){
      let responses = await Promise.all([
        getAction(this.getDefSelectColUrl, { platform: 'service' })
      ,getAction(this.getDefSerColUrl, { platform: 'service' })
      ])
      let [colRes, serRes] = responses
      if(!colRes.success){
        this.$message.warn(colRes.message)
      } else {
        this.defaultCols = colRes.result.map(r => this.getCol(r))
      }
      if(!serRes.success){
        this.$message.warn(serRes.message)
      } else {
        this.defaultSers = serRes.result
      }
      return {}
    },
    loadFacetFieldsData() {
      getAction(this.facetFieldsUrl, {
        ...this.getQueryParams(),
        fields: undefined,
        fieldTitles: undefined
      }).then(res => {
        if (res.success) {
          let facetObj = res.result
          // console.log('facetObj',facetObj)
          this.tableFooterJsx =
            <a-row class="t-c" style="line-height:20px">
              {/*<a-col xs={12} lg={6} xl={2}>
                <a-card-grid class="w-b-100 p-12" style="line-height:40px">总计：</a-card-grid>
              </a-col>*/}
              <a-col xs={12} lg={6} xl={3}>
                <a-card-grid class="w-b-100 p-12">记录数<br/>{facetObj['count'] || 0}</a-card-grid>
              </a-col>
              <a-col xs={12} lg={6} xl={3}>
                <a-card-grid class="w-b-100 p-12">病例数<br/>{facetObj['unique(VISITID)'] || 0}</a-card-grid>
              </a-col>
              <a-col xs={12} lg={6} xl={5}>
                <a-card-grid class="w-b-100 p-12">最小基金支出金额(总)<br/>{(facetObj['sum(ACTION_MONEY)'] || 0).toFixed(2)}
                </a-card-grid>
              </a-col>
              <a-col xs={12} lg={6} xl={5}>
                <a-card-grid class="w-b-100 p-12">最大基金支出金额(总)<br/>{(facetObj['sum(MAX_ACTION_MONEY)'] || 0).toFixed(2)}
                </a-card-grid>
              </a-col>
              <a-col xs={12} lg={6} xl={4}>
                <a-card-grid class="w-b-100 p-12">最小违规金额(总)<br/>{(facetObj['sum(MIN_MONEY)'] || 0).toFixed(2)}</a-card-grid>
              </a-col>
              <a-col xs={12} lg={6} xl={4}>
                <a-card-grid class="w-b-100 p-12">最大违规金额(总)<br/>{(facetObj['sum(MAX_MONEY)'] || 0).toFixed(2)}</a-card-grid>
              </a-col>
            </a-row>
        } else {
          this.$message.warning(res.message)
          this.tableFooterJsx = <div class="t-c p-t-20 p-b-20 t-grey-666">查询失败<br/>{res.message}</div>
        }
      })
    },
    /*loadTermHisItem() {
      this.hisItemLoading = true
      getAction(this.url.termHisItem, { ...this.fixedParam, fields: undefined, fieldTitles: undefined }).then(res => {
        if (res.success) {
          let { CASE_NAME, HIS_ITEMNAME } = res.result
          this.itemNameData = CASE_NAME ? CASE_NAME.buckets.map(r => ({
            code: r.val, value: `${r.val}(${r.count})`
            , link: r.HIS_ITEMNAME.buckets
          })) : []
          this.hisItemData = HIS_ITEMNAME ? HIS_ITEMNAME.buckets.map(r => ({
            code: r.val, value: `${r.val}(${r.count})`
            , link: r.CASE_NAME.buckets
          })) : []
          this.filterHisItem()
          this.filterCaseItem()

        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.hisItemLoading = false
      })
    },
    setFilterHisItemOption(data, val) {
      return data.map(r => {
        let item = r.link.find(s => s.val === val)
        if (item) {
          return {
            code: r.code,
            value: `${r.code}(${item.count})`
          }
        }
      }).filter(r => !!r)
    },
    filterHisItem(val) {
      this.hisItemOption = val && val.length > 0 ?
        this.setFilterHisItemOption(this.hisItemData, val)
        : this.hisItemData
    },
    filterCaseItem(val) {
      this.itemNameOption = val && val.length > 0 ?
        this.setFilterHisItemOption(this.itemNameData, val)
        : this.itemNameData
    },*/
    //点击就诊编号选中记录
    selectVisit(visitid, tabKey) {
      this.$refs.reviewDetailModel.title = '就诊记录详情'
      this.$refs.reviewDetailModel.loadData(visitid, tabKey)
    },
    searchQuery() {
      if (this.groupbyIndex > -1) {
        if (this.queryParam.actionId === this.actionIdSearch) {
          this.loadPageData()
          return
        } else {
          this.resetToNotGroupBy()
        }
      }
      if (this.queryParam.actionId && this.queryParam.actionId.length > 0 ) {
        if(this.actionIdSearch !== this.queryParam.actionId){
          this.loadActionFieldConfig(this.queryParam.actionId)
        } else {
          this.loadPageData()
        }
      } else {
        this.resetCols(this.defaultCols)
        this.resetSearchArea(this.defaultSers)
        this.loadPageData()
      }
    },
    loadActionFieldConfig(actionId) {
      this.selectActionName = this.actionData.find(r => r.code === actionId).value
      this.searchBtnLoading = true
      getAction(this.listFieldConfigByActionUrl, { actionId
        , batchId:this.batchId }).then(res => {
        if (res.success) {
          let data = res.result
          if (data && Object.keys(data).length > 0) {
            let { groupFields, colConfigs, serConfigs } = data
            this.setColsByActionConfig(groupFields, colConfigs, serConfigs)
          } else {
            // 设置默认字段与搜索条件
            this.resetCols(this.defaultCols)
            this.resetSearchArea(this.defaultSers)
          }
          this.actionIdSearch = actionId
          this.loadPageData()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.searchBtnLoading = false

      })
    },
    resetCols(leftCols) {
      this.isActionField = leftCols !== this.defaultCols
      this.columns = [
        ...leftCols,
        ...this.rightCols
      ]
      Object.assign(this.fixedParam, this.getFields())
      this.fixedParam.field = undefined
    },
    resetSearchArea(data){
      console.log('resetSearchArea', this.resetSearchData, data)
      if(this.resetSearchData === data){
        return
      }
      this.resetSearchData = data
      this.queryParam.dynamicSearch = {}
      this.dynamicSearchs = data.map(r => this.getSearch(r))
    },
   /* onActionFieldChange(e) {
      if (e.target.value && (!this.queryParam.actionId || this.queryParam.actionId.length === 0)) {
        this.$message.warn('请选择不合规行为并查询')
        this.$nextTick(() => {
          this.isActionField = false
        })
        return
      }
      this.resetCols(e.target.value ? this.actionFields : this.defaultCols)
      this.loadData(this.ipagination.current)
    },*/
    resetToActionFields() {
      let oldGroupIndex = this.groupbyIndex
      this.resetToNotGroupBy()
      this.resetCols(this.actionFields)
      this.loadData(1)
      if(oldGroupIndex > 0){
        this.loadFacetFieldsData()
      }
    },
    refreshPage() {
      this.$emit('refresh')
      this.loadPageData()
    },
    loadPageData(){
      this.loadData(1)
      this.loadFacetFieldsData()
    },
    searchReset() {
      if (this.groupbyIndex === -1) {
        this.resetCols(this.defaultCols)
      }
      this.queryParam = {dynamicSearch:{}}
      this.loadPageData()
    },
    getDynamicParams(){
      let param = this.getQueryParams()
      console.log('param.dynamicSearch',param.dynamicSearch)
      console.log('typeof param.dynamicSearch',typeof param.dynamicSearch)
      if(param.dynamicSearch && typeof param.dynamicSearch == 'object'){
        param.dynamicSearch = JSON.stringify(param.dynamicSearch)
      }
      return param
    },
    setColsByActionConfig(groupFields, cols, sers) {
      if(!sers || sers.length === 0){
        sers = this.defaultSers
      } else {
        // sers = sers.filter(r => r.configId === item.id)
      }
      this.resetSearchArea(sers)
      if(!cols || cols.length === 0) {
        this.actionFields =  this.defaultCols
      } else {
        this.actionFields = cols
        // .filter(r => r.configId === item.id)
          .map((r, index) => this.getCol(r))
      }
      if (groupFields && groupFields !== '[]') {
        this.groupbyCols(JSON.parse(groupFields))
      } else {
        this.groupby = []
        this.groupbyIndex = -1
        this.resetCols(this.actionFields)
      }

    },
    getCol({ tableName, colName, colCnname, colDesc, colWidth = 80,colAlign = 'left', whereInputType, dataType = 'VARCHAR', selectType }) {
      // let [tabName, colName] = field.split('.')
      // 是否是主表字段
      let isMainTable = tableName === 'MEDICAL_UNREASONABLE_ACTION'
      let colDescComp = colDesc?<span>注释：{colDesc}<br/></span>:undefined
      let col = {
        tableName,
        colName,
        dataIndex: isMainTable?colName:`${tableName}.${colName}`, //this.toHump(colName),
        title: colCnname,
        desc: <span>{colDescComp}表名：{tableName}<br/>字段名：{colName}</span>,
        align: colAlign,
        width: colWidth,
        isSorter: isMainTable
      }
      // 合并自定义扩展属性
      let extraProp = this.assignColProp[`${tableName}.${colName}`] || this.assignColProp[colName]
      if (extraProp) {
        Object.assign(col, extraProp)
      }
      if (whereInputType === '1') {
        dataType = 'DICT'
        col.dictCode = selectType
      }
      col.dataType = dataType
      if (!col.customRender) {
        col.customRender = customRenderMap[dataType]
      }


      return col
    },
    getSearch({ tableName, colName, colCnname, serInputType, serSelectType, serDataType = 'VARCHAR' }) {
      let component = ''
      let param = {}
      console.log(colCnname, serInputType, serSelectType, serDataType)
      if(!serInputType || serInputType === '0' || serInputType === '2'){
        if(serDataType === 'DATE'){
         /* <j-date class="search-divider-item" v-model="queryParam.createTime_begin" :showTime="true"
        date-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"></j-date>*/
          component = 'JDate'
        } else if(serDataType === 'NUMBER'){
          component = 'AInput'
          param = {placeholder: '精确查询'}
        } else {
          component = 'JInput'
          param = {placeholder: '模糊查询'}
        }
      } else if(serInputType === '1'){
        let codeOrName = serSelectType.charAt(0)
        serSelectType = serSelectType.substring(2)
        let dictCode = serSelectType.substring(2)
        if(serSelectType.startsWith('m')){
          /*<m-dict-select-tag dictCode="FIRST_REVIEW_STATUS"/>*/
          component = 'MDictSelectTag'
          param = {dictCode, search: true, valueEqName: codeOrName === '1'}
        } else if(serSelectType.startsWith('o')){
          {/*<input-medical-other-dict placeholder="请选择所属地区"
                                    v-decorator="['ruleSourceCode', requireRule]"
                                    dict="region"
                                    hideButton
        ></input-medical-other-dict>*/}
          component = 'InputMedicalOtherDict'
          param = {dict: dictCode, hideButton: true, valueEqName: codeOrName === '1'}
        }
      }
      return {field: tableName + "." + colName, title: colCnname, component, param, inputType: serInputType}
    },
    getFields(columns = this.columns, groupBy) {
      let cols = columns.filter(r => r.dataIndex && r.dataIndex !== 'action' && r.tableName !== 'action')
      let fields = []
      let titles = []
      for (let col of cols) {
        let tableName = col.tableName || 'MEDICAL_UNREASONABLE_ACTION'
        // fields.push(tableName + '.' + col.dataIndex)
        fields.push(col.dataIndex)
        titles.push(col.title)
        if (col.relate) {
          fields.push(...col.relate.map(r => tableName + '.' + r))
          titles.push(...(new Array(col.relate.length).fill('')))
        }
      }
      return { fieldTitles: groupBy?titles.join(','):undefined, fields: fields.join(',') }
    },
    groupbyCols(data) {
      if (data.length > 0) {
        this.groupby = data.map(obj => {
          if(obj.data){
            return {
              data: obj.data.map(r => ({ ...r, humpCode: this.toHump(r.code) })),
              fields: obj.fields
            }
          } else {
            //  兼容旧数据
            return {
              data: [{ ...obj, humpCode: this.toHump(obj.code) }],
              field: obj.fields
            }
          }
        })
        this.groupbyIndex = 0
        this.addGroupFields(this.groupbyIndex)
      } else if (this.groupby.length > 0) {
        this.resetToNotGroupBy()
      }
      this.onClearSelected()
    },
    resetToNotGroupBy() {
      for (let i = 0, len = this.groupby.length; i < len; i++) {
        this.groupby[i].data.forEach(r => delete this.fixedParam[r.humpCode])
      }
      this.sortToLowercase = true
      this.isorter = { column: 'caseName', order: 'asc' }
      delete this.fixedParam.groupBys

      this.groupby = []
      this.groupbyIndex = -1
    },
    toNextDetail(id) {
      let vals = id.split('::')
      let oldGroupItems = this.groupby[this.groupbyIndex].data
      // 设置导航标题为值
      if(!id.startsWith("row_")){
        oldGroupItems.forEach((r, index) => this.fixedParam[r.humpCode] = vals[index])
      }

      this.groupbyIndex++
      if (this.groupbyIndex < this.groupby.length) {
        this.addGroupFields(this.groupbyIndex)
      } else {
        delete this.fixedParam.groupBys
        this.sortToLowercase = true
        this.isorter = { column: 'caseName', order: 'asc' }
        this.resetCols(this.actionFields)
      }
      this.onClearSelected()
      this.searchQuery()

    },
    toLastDetail(index) {
      for (let i = index, len = this.groupby.length; i < len; i++) {
        this.groupby[i].data.forEach(r => delete this.fixedParam[r.humpCode])
      }

      this.groupbyIndex--
      if (this.groupbyIndex < this.groupby.length) {
        this.addGroupFields(this.groupbyIndex = index)
      }
      this.onClearSelected()
      this.searchQuery()
    },
    addGroupFields(index) {
      let groupBy = this.groupby[index]
      let columns = groupBy.data.map(r => ({
        title: r.value,
        align: 'center',
        dataIndex: r.code,
        width: 350
      }))
      columns.push(...this.groupByCols)
      let fields = groupBy.fields
      if (fields) {
        columns.push(...fields.map(r => {
          let [table, col] = r.code.split(':')
          let isMainTable = table === 'MEDICAL_UNREASONABLE_ACTION'
          return {
            tableName: table,
            title: r.value,
            align: 'center',
            dataIndex: isMainTable?col: `${table}.${col}`,
            width: 180,
            isSorter: false,
          }
        }))
      }
      Object.assign(this, {
        fixedParam: { ...this.fixedParam, ...this.getFields(columns, groupBy), groupBys: groupBy.data.map(r => r.code).join(',') },
        isorter: { column: 'count(*)', order: 'desc' },
        columns: columns,
        sortToLowercase: false
      })
    },
    toHump(col) {
      let array = col.split('_')
      for (let i = 1; i < array.length; i++) {
        let item = array[i].trim()
        if (item.length === 0)
          continue
        array[i] = item.charAt(0) + item.substring(1, item.length).toLowerCase()
      }
      array[0] = array[0].toLowerCase()
      return array.join('')
    },
    //导入普通审核记录
    handleImportReviewExcel() {
      let param = {
        title: '批量导入审核记录',
        importUrl: this.url.importReviewExcelUrl,
        actionType: 'add',
        param: {
          ...this.getDynamicParams(),
          fields: undefined,
          fieldTitles: undefined
        }
      }
      this.$refs.importModel.loadData(param)
    },
    //导入分组统计审核
    handleImportGroupReviewExcel() {
      let param = {
        title: '批量导入分组统计审核记录',
        importUrl: this.url.importGroupReviewExcel,
        actionType: 'add',
        param: {
          ...this.getDynamicParams(),
          fields: undefined,
          fieldTitles: undefined
        }
      }
      this.$refs.importModel.loadData(param)
    }
  }
}



