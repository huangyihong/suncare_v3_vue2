<template>
  <div>
    <div class="table-operations" style="margin-bottom: 5px">
      <a-button type="primary" @click="submitCase" :disabled="submitDisabled">提交</a-button>
      <a-button style="margin-left: 8px" @click="copyCreate" v-has="'probe:add'">复制新增</a-button>
      <!--<a-button style="margin-left: 8px" @click="exportJson">导出</a-button>-->
      <a-button style="margin-left: 8px" @click="delCase" :disabled="submitDisabled" v-has="'probe:del'">删除</a-button>
      <j-input-search placeholder="输入名称或编码模糊查询" class="m-t-6"
                      v-model="queryParam.searchCode"
                      @search="loadData(1)" />
      </div>
      <process-bar :data="statisticTotalInfo" @exec="execStatistic" probe></process-bar>

      <at-table
      size="middle"
      rowKey="caseId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
      :customRow="rowClick"
      @change="handleTableChange">
      <template slot="main" slot-scope="text,record,index">
        <a-tooltip placement="topLeft" >
          <template slot="title">
            <span>编号：{{record.caseCode}}<br>名称：{{record.caseName}}</span>
          </template>
         {{ record.caseName || record.caseCode | ellipsis(20) }}
        </a-tooltip>
      </template>
      <template slot="caseStatus" slot-scope="caseStatus">
      <!--  <span style="color: red" v-if="caseStatus === 'reject'">{{filterDictText(statusDictOptions, caseStatus)}}</span>
        <span style="color: green" v-else-if="caseStatus === 'submited'">{{filterDictText(statusDictOptions, caseStatus)}}</span>
        <span v-else>{{filterDictText(statusDictOptions, caseStatus)}}</span>-->
        <a-icon type="close-circle" v-if="caseStatus === 'reject'" :style="{color:'#ff0000'}" :title="filterDictText(statusDictOptions, caseStatus)"/>
        <a-icon type="check-circle" v-else-if="caseStatus === 'submited'" :style="{color:'#009900'}" :title="filterDictText(statusDictOptions, caseStatus)"/>
        <a-icon type="clock-circle" v-else :style="{color:'#ccc'}" :title="filterDictText(statusDictOptions, caseStatus)"/>
      </template>
      <a-icon slot="filterIcon" slot-scope="filtered,column" type="search"/>
    <!--  <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px" >
        <j-input
          placeholder="备注或编码模糊查询"
          v-model="queryParam.caseName"
          @keyup.enter.native="()=>{loadData();confirm()}"
          style="width: 158px; margin-bottom: 8px; display: block;"></j-input>
        <a-button
          type="primary"
          @click="()=>{loadData();confirm()}"
          icon="search"
          size="small"
          style="width: 75px; margin-right: 8px">查询</a-button>
        <a-button @click="()=>{delete queryParam.caseName;loadData();confirm()}" size="small" style="width: 75px">重置</a-button>
      </div>-->
    </at-table>

  </div>
</template>

<script>
  import { JeecgListMixin,ListMoreMixin } from '@/mixins/JeecgListMixin'
  import flowTrialMixin from '@/pages/probe/flowTrialMixin'

  import {  filterDictText } from '@/components/dict_medical/DictSelectUtil'
  import { getProbeCaseById, setProbeCaseSubmit } from '@/api-sv3/api-flow'
  import pick from 'lodash/pick'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import JInputSearch from '@/components/jeecg/JInputSearch'

  export default {
    name: "index",
    mixins: [JeecgListMixin,ListMoreMixin, flowTrialMixin],
    components: {JEllipsis,JInputSearch},
    data() {
      return {
        filterDictText,
        data: [],
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: false,
          showQuickJumper: false,
          showLessItems: true,
          showTotal: (total, range) => {
            return '共' + total + '条'
          },
        },
        loading: false,
        columns: [
          {
            title: '流程',
            dataIndex: 'caseCode',
            align: "center",
            // sorter: true,
            scopedSlots: {
            /*  filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',*/
              customRender: 'main' },
            width: '65%',
          },
          {
            title: '创建人',
            dataIndex: 'createUsername',
            align: "center",
            width: '30%',
          },
          {
            // title: '状态',
            dataIndex: 'caseStatus',
            align: "center",
            scopedSlots: { customRender: 'caseStatus' },
            width: '5%',
          },
          /*{
            title: '状态',
            dataIndex: 'caseStatus',
            align: "center",
            scopedSlots: { customRender: 'caseStatus' },
            width: '35%',
          }*/
        ],
        url: {
          list: "/probe/medicalProbeCase/list",
          delete: "/probe/medicalProbeCase/delete",
          deleteBatch: "/probe/medicalProbeCase/deleteBatch",
        },
        /* 排序参数 */
        isorter:{
          column: '',
          order: '',
        },
        expandedRowKeys:[],
        statusDictOptions: [],
        submitDisabled: false,
      }
    },
    beforeMount(){
      this.getStatisticTotalView()
    },
    watch:{
    },
    methods: {
      rowClick(record, index) {
        const that = this
        return ({
          style: { cursor: 'pointer' },
          // 事件
          on: {
            click: () => {
              that.onSelectChange([record.caseId],[record])
            }
          }
        })
      },
      initDictConfig() {
        console.log("--我才是真的方法!--")
        //初始化字典 - 状态
        this.$util.initDict('SUBMIT_STATUS').then(data => {
          this.statusDictOptions = data
          this.setColFilter('caseStatus',data)
        })
      },
      loadCaseFlow(id){
        this.$emit('loading', true)
        getProbeCaseById({ id }).then((res) => {
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
      submitCase() {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('至少选择一条记录！');
          return
        }
        const that = this
        this.$confirm({
          title: "确认提交",
          content: "是否提交选中数据?",
          onOk: function () {
            that.$emit('loading', true)
            setProbeCaseSubmit({ ids: that.selectedRowKeys.join(",") }).then((res) => {
              if (res.success) {
                that.loadData(1)
                that.$message.success(res.message);
                that.$emit('submit',that.selectionRows[0].caseCode)
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.$emit('loading', false)
            })
          }
        });
      },
      copyCreate() {
        if (this.selectedRowKeys.length !== 1) {
          this.$message.warning('请选择一条记录！');
          return
        }
        const that = this
        that.$emit('loading', true)
        getProbeCaseById({ id: this.selectedRowKeys[0], copyCreate: '1' }).then((res) => {
          if (res.success) {
            let data = res.result
            delete data.caseId
            delete data.caseStatus
            that.$emit('loadData', data)
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.$emit('loading', false)
        })
      },
      // 没用到
      exportJson(){

          if (this.selectedRowKeys.length < 1) {
            this.$message.warning('请至少选择一条记录！');
            return
          }
          const that = this
          that.$emit('loading', true)
          getProbeCaseById({ id: this.selectedRowKeys[0], copyCreate: '1' }).then((res) => {
            if (res.success) {
              let data = res.result
              let exportData = pick(data,'caseCode','caseName', 'caseRemark','flowJson','rules')
              console.log('data',data)
              console.log('exportData',exportData)
              this.exportFile(JSON.stringify(exportData), `模型${data.caseCode}.json`)
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.$emit('loading', false)
          })

      },
      exportFile(data,fileName ){
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName)
        }else{
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      },
      delCase(){
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('至少选择一条记录！');
          return
        }
        const that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.handleDelete(that.selectedRowKeys[0]).then(()=>{
              that.$emit('loadData')
            })
          }
        });
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows
        this.submitDisabled = selectionRows[0].caseStatus === 'submited'
        this.loadCaseFlow(selectedRowKeys[0])
      }
    }
  }
</script>
<style scoped>

</style>
