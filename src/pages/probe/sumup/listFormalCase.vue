<template>
  <div>

    <div class="table-operations" style="margin-bottom: 5px">
      <!--<a-button type="primary" style="margin-left: 8px" @click="submitCase">提交</a-button>-->
      <span v-has="'sumup:action'">
        <a-button type="primary" @click="handleImportExcel" v-has="'probe:import'">导入</a-button>
        <a-button type="primary" class="m-l-6" @click="handleExportFile('模型信息导出.xlsx', undefined, url.exportCaseInfo)" v-has="'probe:export'">导出</a-button>
        <a-button type="primary" class="m-l-6" @click="copyCreate" v-has="'probe:add'">复制新增</a-button>
        <a-button type="default" class="m-l-6" @click="batchDel" v-has="'probe:del'">删除</a-button>
      </span>
      <!--<a-button type="primary" style="margin-left: 8px" @click="loadData(1)">刷新</a-button>-->
   <!--   <div style="display: flex" class="m-t-6">
        <j-input
          placeholder="名称模糊查询"
          v-model="queryParam.caseName"
          @pressEnter="loadData"
          style="flex: auto" class="m-r-6"></j-input>
        <a-button
          type="primary"
          @click="loadData"
          icon="search"
          style="flex: none">查询</a-button>
      </div>-->
      <j-input-search placeholder="ID、名称、地区、不合规行为或类型模糊查询" class="m-t-6"
                      v-model="queryParam.searchCode"
                      @search="loadData(1)" />
    </div>
    <process-bar :data="statisticTotalInfo" @exec="execStatistic"></process-bar>
    <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
    <at-table
      size="middle"
      rowKey="caseId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :customRow="customRow"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange">
      <template slot="caseName" slot-scope="text,record,index">
        <a-tooltip placement="topLeft" >
          <template slot="title">
            <span>名称：{{record.caseName}}<br>地区：{{record.ruleSource}}</span>
          </template>
          {{ record.caseName | ellipsis(20) }}
        </a-tooltip>
      </template>
      <template slot="caseStatus" slot-scope="caseStatus, record">
        <span style="color: red" v-if="caseStatus === 'stop'">{{filterDictText(statusDictOptions, caseStatus)}}</span>
        <span v-else>{{filterDictText(statusDictOptions, caseStatus)}}</span>
      </template>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search"/>
    </at-table>
    <!--导入-->
    <import-modal ref="importModel" tip=""
                  @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </div>
</template>

<script>
  import { JeecgListMixin,ListMoreMixin } from '@/mixins/JeecgListMixin'
  import flowTrialMixin from '@/pages/probe/flowTrialMixin'
  import {  filterDictText } from '@/components/dict_medical/DictSelectUtil'
  import { getFormalCaseById, setFormalCaseSubmit } from '@/api-sv3/api-flow'
  import { postAction } from '@/api-sv3/manage'
  import JInputSearch from '@/components/jeecg/JInputSearch'
  import ImportModal from '@/components/ImportModal'

  export default {
    name: "index",
    mixins: [JeecgListMixin,ListMoreMixin, flowTrialMixin],
    components: {JInputSearch, ImportModal},
    data() {
      return {
        filterDictText,
        data: [],
        pagination: { simple: true },
        loading: false,
        columns: [
          {
            title: '模型名称',
            dataIndex: 'caseName',
            align: "center",
            width: '45%',
            scopedSlots: { customRender: 'caseName' },
          },
          {
            title: '创建人',
            dataIndex: 'createUsername',
            align: "center",
            width: '30%',
          },
          {
            title: '状态',
            dataIndex: 'caseStatus',
            scopedSlots: { customRender: 'caseStatus' },
            align:"center",
            width: '25%',
          },
        ],
        url: {
          list: "/formal/medicalFormalCase/list",
          delete: "/formal/medicalFormalCase/delete",
          deleteBatch: "/formal/medicalFormalCase/deleteBatch",
          importCaseInfo: "/formal/medicalFormalCase/importCaseInfo",
          exportCaseInfo: "/formal/medicalFormalCase/exportCaseInfo",
          copyAdd: "/formal/medicalFormalCase/copyAdd",
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: false,
          showQuickJumper: false,
          showLessItems: true,
          showTotal: (total, range) => {
            return total + '条'
          },
        },
        /* 排序参数 */
        isorter:{
          column: 'caseStatus,createTime,caseName',
          order: 'asc,desc,asc',
        },
        fixedParam:{
          caseClassify: '!*'
        },
        statusDictOptions:[],
        selectId: '',
      }
    },
    beforeMount(){
      this.getStatisticTotalView()
    },
    methods: {
      initDictConfig() {
        // console.log("--我才是真的方法!--")
        //初始化字典 - 状态
        this.$util.initDict('SWITCH_STATUS').then(data => {
          this.statusDictOptions = data
          this.setColFilter('caseStatus', data)
        })
      },
      /*submitCase(){
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('至少选择一条记录！');
          return
        }
        this.$emit('loading', true)
        setFormalCaseSubmit({ ids: this.selectedRowKeys.join(",") }).then((res) => {
          if (res.success) {
            this.loadData(1)
            this.$message.success(res.message);
            this.$emit('submit', this.selectedRowKeys)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.$emit('loading', false)
        })
      },*/
      customRow(record, index) {
        let style = {cursor:'pointer'}
        if (record.caseId === this.selectId) {
          style.backgroundColor = '#E6F7FF'
        }
        const that = this
        return ({
          style,
          // 事件
          on: {
            click: () => {
              that.loadCaseFlow(record.caseId)
            }
          }
        })
      },
      copyCreate(){
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('至少选择一条记录！');
          return
        }
        this.$confirm({
          title: '确认复制新增',
          content: `是否复制新增选中的${this.selectedRowKeys.length}条数据？名称上增加后缀“-复制”`,
          onOk: () => {
            this.loading = true
            let ids = this.selectedRowKeys.join(',')
            postAction(this.url.copyAdd, {ids}).then((res) => {
              if (res.success) {
                this.$message.success(res.result);
                this.onClearSelected()
                this.loadData(1)
              } else {
                this.loading = false
                this.$message.warning(res.message);
              }
            })
          }
        })

      },
      loadCaseFlow(id){
        this.selectId = id
        this.$emit('loading', true)
        getFormalCaseById({ id }).then((res) => {
          if (res.success) {
            let data = res.result
            this.$emit('loadData', data)
            this.getStatisticCaseView(id)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.$emit('loading', false)
        })
      },
      refresh(){
        this.loadData(1)
      },
      //导入
      handleImportExcel() {
        let param = {
          title: '批量导入更新',
          importUrl: this.url.importCaseInfo,
          actionType: 'add',
          uploadFileName: 'MEDICAL_FORMAL.xlsx'
        }
        this.$refs.importModel.loadData(param);
      },
    }
  }
</script>
<style scoped>

</style>
