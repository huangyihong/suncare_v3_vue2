<template>
  <div>
    <m-modal
      centered
      title="选择字段"
      width="80%"
      :visible="visible"
      @cancel="hide"
      @ok="handleSelectOk"
      @max="maxModal"
      :maskClosable="true"
      v-bind="isShowSelect?{}:{footer:null}">
      <span slot="title">
        选择字段
        <span v-if="isShowSelect" style="font-size: 14px">
          <span style="color: #999;font-size: 12px" class="m-l-10">{{tip}}</span>
          <span style="color: #999" class="m-l-10">已勾选({{selectKeys.length}})</span>
          <a class="m-l-10" @click="selectKeys = []">清除</a>
        </span>
        <a v-else-if="selectedObj" @click="fillQuery(selectedObj.tableName,selectedObj.colName)" style="font-size: 14px">
          （已选择：{{colDict[selectedObj.colId].colChnName}}）
        </a>
      </span>
      <a-spin :spinning="confirmLoading">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :md="6" :xs="8">
                <a-form-item label="所属表">
                  <m-dict-select-tag placeholder="选择所属表" dictCode="DATA" :filter="tableFilter" :loaded="setTableNameDict"
                                     showKey search v-model="queryParam.tabName" @change="searchChange"></m-dict-select-tag>
                </a-form-item>
              </a-col>
              <a-col :md="6" :xs="8">
                <a-form-item label="字段英文名称">
                  <a-input placeholder="模糊搜索" v-model="queryParam.colName" @change="searchChange"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :xs="8">
                <a-form-item label="字段中文名称">
                  <a-input placeholder="模糊搜索" v-model="queryParam.colChnName" @change="searchChange"></a-input>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="6" :xs="8">
                  <a-form-item label="字段类型">
                    <m-dict-select-tag placeholder="选择字段类型" dictCode="COL_TYPE"
                                       v-model="queryParam.colType" @change="searchChange"></m-dict-select-tag>
                  </a-form-item>
                </a-col>
              </template>

              <a-col :md="6" :xs="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <!--<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
                  <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-row style="display: flex">
            <a-col style="flex: 0 0 200px">
            <a-tabs v-bind="grid < 2?{tabPosition:'top'}:{tabPosition:'left',tabBarStyle:{height: tabHeight - 40 +'px'}}"
                    v-model="tabCode">
              <template v-for="(type,index) in colTypesShow">
                <a-tab-pane :key="type.code" :forceRender="false">
             <span slot="tab">
                {{type.value}}
                <a-badge :count="colsTypeObjShow[type.code].length" :overflow-count="999" :numberStyle="{backgroundColor: color} " showZero/>
              </span>
                </a-tab-pane>
              </template>
            </a-tabs>
            </a-col>
            <a-col style="flex:auto">
              <a-row :gutter="12"
                     ref="pageList"
                     style="overflow: auto;"
                     :style="{height: tabHeight+'px', transition: 'height ' + animTime + 'ms'}"
                     @scroll.native="doScroll">
                <a-checkbox-group :value="selectKeys" class="w-b-100" ref="checkboxGroup">
                  <template v-for="col in pageList">
                    <a-col :xs="12" :lg="8" :xxl="6" class="col-item">
                      <label>
                        <a-checkbox :value="col.colId" v-show="isShowSelect" :disabled="colSelectTableName&& col.tabName !== colSelectTableName" class="m-r-10" @change="onSelectChange"/>
                        <span @click="selectOK(col)" :title="`所属表：${col.tabName}\n所属表中文名：${tableNameObj[col.tabName]}\n字段名：${col.colName}\n分类：${col.typeName}`"
                        >{{col.colOrder}}. {{col.colChnName}}</span>
                      </label>
                      <a-icon type="edit" class="icon" :style="{color: color}" @click="edit(col.id)"/>
                    </a-col>
                  </template>
                  <!--</template>-->
                </a-checkbox-group>
              </a-row>
            </a-col>

          </a-row>
        </div>
      </a-spin>
    </m-modal>
    <!-- 表单区域 -->
    <medicalColConfig-modal ref="modalForm" @ok="modalFormOk"></medicalColConfig-modal>
  </div>
</template>

<script>
  import { getRuleColConfig,updateDisplayCol } from '@/api-sv3/api-flow'
  import { mapGetters } from 'vuex'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MedicalColConfigModal from '@/pages/config/modules/MedicalColConfigModal'
  import { queryColConfigById } from '@/api-sv3/api-flow'
  import debounce from 'lodash/debounce';
  export default {
    name: "fieldSelect",
    components: { MDictSelectTag, MedicalColConfigModal },
    props: ['uniqueVal'],
    data() {
      this.pageSize = 50
      this.animTime = 300
      return {
        visible: false,
        confirmLoading: false,
        toggleSearchStatus: false,
        heightRatio: 0.8,
        tip: undefined,
        tabCode: undefined,
        queryParam: {tabName:''},
        tableNames: [],
        tableNameObj: {},
        cols: [],
        types: [],
        tableColDict: {}, // 表 - 字段数组
        colTypes: [],
        colTypesShow: [],
        colsTypeObj: {}, // 全部 每个类型一个数组
        colsTypeObjShow: {}, // 过滤后
        // 搜索延后定时任务
        searchTimer: undefined,
        tableFilter: ()=> true,
        selectKeys: [],
        oldSelectKeys: [],
        isShowSelect: false,
        colSelectTableName: '',
        selectedObj: undefined,
        tableName: '',
        isWhereCol: undefined,
        callback:()=>{},
        disables:["DWB_MASTER_INFO:VISITID", "DWB_MASTER_INFO:CLIENTNAME", "DWB_MASTER_INFO:SEX", "DWB_MASTER_INFO:YEARAGE", "DWB_MASTER_INFO:ORGNAME"],
        pageList: []
      }
    },
    computed: {
      ...mapGetters(["grid", "color", "height","colDict"]),
      tabHeight() {
        let height = this.height * this.heightRatio - 160
        if(this.isShowSelect){
          height -= 54
        }
        return height < 200 ? 200 : height
      },
    },
    watch: {
      tabCode(val){
        this.initPage()
      },
      colsTypeObjShow(val){
        if(!this.colTypesShow.find(r => r.code === this.tabCode)) {
          this.tabCode = this.colTypesShow[0].code
        }
        this.initPage()
      }
    },
    beforeMount() {
      if(Object.keys(this.colDict).length === 0){
        this.getColConfig()
      } else {
        let colConfig = this.$store.state.cache.colConfig
        this.setColConfig(colConfig)
      }
      this.searchChange = debounce(this.searchChange, 500);//消抖
    },
    mounted(){
      this.$bus.$on('fieldSelectShow' + this.uniqueVal,
        ({mode, callback,tableName,selectedObj,selected,isWhereCol,tip, required = true}) => {
        // mode:multi'多选
        // callback 回调
        // tableName锁定表
        // selectedObj已选中字段对象
        // selected 多选默认勾选数组
        // isWhereCol 只显示是否作为过滤字段
        console.log('fieldSelectShow'+ this.uniqueVal,mode,tableName)
        let doActionFun = () => {
          if(this.tableName !== tableName || this.isWhereCol !== isWhereCol){
            this.tableName = tableName
            this.isWhereCol = isWhereCol
            this.tableNameChange(tableName, {isWhereCol})
          } else {
            // this.searchReset()
          }
        }
        if(this.confirmLoading){
          this.getCallback = [doActionFun]
        } else {
          doActionFun()
        }

        if(mode === 'multi'){
          this.isShowSelect = true
          if(this.confirmLoading){
            this.getCallback.push(()=>{this.showSelect(selected)})
          } else {
            this.showSelect(selected)
          }
        } else{
          this.isShowSelect = false
          this.selectedObj = selectedObj && selectedObj.colId ? selectedObj: undefined
        }
        this.tip = tip
        this.required = required
        this.visible = true
        this.callback = callback
      })
    },
    beforeDestroy(){
      this.$bus.$off('fieldSelectShow' + this.uniqueVal)
    },
    methods: {
      doScroll({target}){
        let {scrollTop, scrollHeight, clientHeight} = target
        if(this.pageNo < this.numPages && scrollHeight - scrollTop - clientHeight < 50){
          this.nextPage()
        }
        // console.log('mousewheel', e)
      },
      initPage(){
        let data = this.colsTypeObjShow[this.tabCode]
        this.pageNo = 0
        this.numPages = parseInt(data.length / this.pageSize) + (data.length % this.pageSize === 0?0:1)
        this.pageList = []
        this.nextPage()
        this.pageAdaptWin()
        this.$refs.pageList && (this.$refs.pageList.$el.scrollTop = 0)

      },
      // 当一页数量不支持滚动时再添加数据
      pageAdaptWin(){
        console.log('pageAdaptWin')
        this.$nextTick(() => {
          console.log('this.$refs.pageList',this.$refs.pageList)
          let {scrollHeight, clientHeight} = this.$refs.pageList.$el
          console.log(scrollHeight, clientHeight)
          if(scrollHeight === clientHeight && this.pageNo < this.numPages){
            this.nextPage()
            this.pageAdaptWin()
          }
        })
      },
      nextPage(){
        this.pageNo++
        let data = this.colsTypeObjShow[this.tabCode].slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
        this.pageList.push(...data)
      },
      // 获取字段列表
      getColConfig() {
        console.log('获取字段列表')
        this.confirmLoading = true
        getRuleColConfig().then((res) => {
          if (res.success) {
            let {types, cols} = res.result
            let tableColDict = {}
            for(let col of cols){
              let array = tableColDict[col.tabName]
              if(!array){
                array = tableColDict[col.tabName] = []
              }
              array.push(col)
            }
            let colConfig = {types, cols, tableColDict}

            this.setColConfig(colConfig)
            this.$store.commit('SET_COL_CONFIG', colConfig)
            if(this.getCallback && this.getCallback.length > 0){
              for(let fun of this.getCallback){
                fun()
              }
            }
          } else {
            this.$message.warning(res.message);
          }

        }).finally(() => {
          this.confirmLoading = false
        })
      },
      setColConfig(colConfig){
        let { types, cols, tableColDict } = colConfig
        this.types = [...types]
        // this.cols = [...cols]
        this.types.unshift({ code: 'ALL', value: '全部' })
        this.types.push({ code: 'OTHER', value: '其他' })
        this.tableColDict = tableColDict
      },
      tableNameChange(val, {reset = true, isWhereCol}){
        console.log('tableNameChange',val)
        let cols = []
        if(val && Array.isArray(val)){
          if(val.length > 0){
            this.tableFilter = item => val.indexOf(item.code) > -1
            for(let tableName of val){
              cols.push(...this.tableColDict[tableName])
            }
          } else {
            this.tableFilter = () => true
            for(let tableName in this.tableColDict){
              cols.push(...this.tableColDict[tableName])
            }
          }
        } else if(val && val.length > 0 && val !== 'DWB'){
          this.tableFilter = item => item.code === val
          cols = this.tableColDict[val]
          this.queryParam.tabName = val
        } else {
          this.tableFilter = item => !item.code.startsWith('DWS')
          for(let tableName in this.tableColDict){
            if(!tableName.startsWith('DWS')){
              cols.push(...this.tableColDict[tableName])
            }
          }
        }
        if(isWhereCol){
          cols = cols.filter(col => col.isWhereCol === 1)
        } else if(val && val!== 'DWB' && val.startsWith('DWB')){
          // DWB关联主表特殊处理字段只有规则过滤才是用
          // cols 来源于 this.tableColDict[val]
          cols = cols.filter(col => !(col.colType === 2 && (!col.colValueExpressionSolr || col.colValueExpressionSolr === 'VIRTUAL' || col.colValueExpressionSolr.toString().trim().length === 0)))
        }
        this.initData(Array.from(this.types), cols)
        if(reset){
          this.searchReset()
        } else {
          this.searchQuery()
        }
      },
      initData(types, cols){
        // 初始化每个类别数组
        let tempObj = {}
        let typeNameObj = {}
        for (let item of types) {
          tempObj[item.code] = []
          typeNameObj[item.code] = item.value
        }
        tempObj["ALL"] = cols
        // 归类
        for (let item of cols) {
          let colValueType = item.colValueType && tempObj[item.colValueType] ? item.colValueType : 'OTHER'
          tempObj[colValueType].push(item)
          item.typeName = typeNameObj[colValueType]
        }
        // 删除空类别
        for (let i = types.length - 1; i >= 0; i--) {
          let item = types[i]
          if (tempObj[item.code].length === 0 && item.code !== 'ALL') {
            delete tempObj[item.code]
            types.splice(i, 1);
          }
        }
        this.colTypes = types;
        this.colsTypeObj = tempObj;
      },
      onSelectChange(e) {
        let {checked, value} = e.target
        if(checked){
          this.selectKeys.push(value)
        } else {
          this.selectKeys.splice(this.selectKeys.indexOf(value),1)
        }
      },
      setTableNameDict(data) {
        let obj = {}
        for(let item of data){
          obj[item.code] = item.value
        }
        console.log('tableNameObj',obj)
        this.tableNameObj = obj
      },
      fillQuery(tabName, colName){
        this.queryParam = {
          tabName,
          colName
        }
        this.searchQuery()
      },
      hide(){
        this.visible = false
        // this.searchReset()
      },
      showSelect(keys) {
        // 已过滤table
        this.colSelectTableName = this.tableName === 'DWB'?'DWB_MASTER_INFO':this.tableName
        if(this.colSelectTableName && this.colSelectTableName !== this.queryParam.tabName){
          console.time('searchTable')
          this.searchTable(this.queryParam.tabName = this.colSelectTableName)
          // this.queryParam.tabName = this.colSelectTableName
          // this.searchQuery()
          console.timeEnd('searchTable')
        }
        if(keys){
          this.selectKeys = keys
        } else {
          this.selectKeys = this.colsTypeObj['ALL'].filter(col => col.isDisplayCol === 1).map(col => col.colId)
        }
      },
      handleSelectOk(){
        if(this.required && this.selectKeys.length === 0){
          this.$message.warn("请选择至少一个字段")
          return
        }
        // this.$emit('selected',this.selectKeys)
        let titles = this.selectKeys.map(r => this.colDict[r].colChnName)
        this.callback(this.selectKeys, titles)
        this.visible = false
        /*let oldSet = new Set(this.oldSelectKeys)
        let newSet = new Set(this.selectKeys)
        let delIds = oldSet.filter(item => !newSet.has(item))
        let addIds = newSet.filter(item => !oldSet.has(item))

        if(delIds.length > 0 || addIds.length > 0){
         updateDisplayCol({addIds:addIds.join(','),delIds:delIds.join(',')}).then(res => {
           if (res.success) {
             this.visible = false
           } else {
             this.$message.warning(res.message);
           }
         }).finally(() => {
           this.confirmLoading = false
         })
       }*/
      },
      add() {
        this.$refs.modalForm.add()
        this.$refs.modalForm.title = `新增字段`;
      },
      edit(id) {
        this.$refs.modalForm.edit(id);
      },
      modalFormOk() {
        this.getColConfig()
      },
      selectOK(col) {
        if(this.isShowSelect){

        } else {
          // this.$emit('ok', col)
          this.callback(col)
          this.hide()
        }
      },
      gotoMng() {
        this.hide()
        this.$util.openTab('/config/MedicalColConfig')
      },
      searchChange(){
        console.log('searchChange')
        this.searchQuery()
      },
      searchQuery() {
        let filter = {}
        for (let field in this.queryParam) {
          let val = this.queryParam[field]
          if (val && val.trim().length > 0) {
            filter[field] = val.trim().toUpperCase()
          }
        }
        if(Object.keys(filter) === 0){
          this.colTypesShow = this.colTypes;
          this.colsTypeObjShow = this.colsTypeObj
          return
        }
        let obj = {}
        for (let type in this.colsTypeObj) {
          let array = this.colsTypeObj[type].filter(col => {
            for (let field in filter) {
              if ((col[field]+'').toUpperCase().indexOf(filter[field]) < 0) {
                return false
              }
            }
            return true
          })
          if (array.length > 0 || type === 'ALL') {
            obj[type] = array
          }
        }
        this.colsTypeObjShow = obj
        this.colTypesShow = this.colTypes.filter(col => !!obj[col.code])
      },
      searchTable(tableName) {
        let obj = {}
        for (let type in this.colsTypeObj) {
          let array = this.colsTypeObj[type].filter(col => col.tabName === tableName)
          if (array.length > 0 || type === 'ALL') {
            obj[type] = array
          }
        }
        this.colsTypeObjShow = obj
        this.colTypesShow = this.colTypes.filter(col => !!obj[col.code])
      },
      searchReset() {
        this.queryParam = {}
        this.colTypesShow = this.colTypes;
        this.colsTypeObjShow = this.colsTypeObj
      },
      maxModal(isMax){
        if(isMax){
          this.heightRatio+=0.2
          setTimeout(()=> {
            this.pageAdaptWin()
          }, this.animTime + 50)
        } else {
          this.heightRatio-=0.2
        }
      }


    }
  }
</script>
<style lang="less" scoped>
  .col-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;

    font-size: 16px;
    line-height: 40px;

    span:hover {
      color: #007fe6;
      cursor: pointer;
    }

    .icon {
      display: none;
      margin-left: 10px;
      cursor: pointer;
    }

    &:hover .icon {
      display: inline-block;
      font-size: 18px;

    }


  }
</style>
