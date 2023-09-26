<template>
  <div>

    <div class="table-operations m-b-6" >
      <!--<a-button type="primary" style="margin-left: 8px" @click="loadData(1)">刷新</a-button>-->
      <span v-has="'sumup:action'">
        <a-button type="danger" ghost  @click="rejectCase">驳回</a-button>
        <a-button @click="handleImportExcel" type="primary" class="m-l-6">导入转换</a-button>
      </span>

      <j-input-search placeholder="输入名称或编码模糊查询" class="m-t-6"
                      v-model="queryParam.searchCode"
                      @search="loadData(1)" />
    </div>
    <at-table
      size="middle"
      rowKey="caseId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :loading="loading"
      :customRow="rowClick"
      @change="handleTableChange">
      <template slot="main" slot-scope="text,record,index">
        <a-tooltip placement="topLeft" >
          <template slot="title">
            <span>编号：{{record.caseCode}}<br>名称：{{record.caseName}}<br>备注：{{record.caseRemark}}</span>
          </template>
          {{ record.caseName || record.caseCode | ellipsis(20) }}
        </a-tooltip>
      </template>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search"/>
    </at-table>
    <!--导入-->
    <import-modal ref="importModel" tip=""
                  @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import flowTrialMixin from '@/pages/probe/flowTrialMixin'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getProbeCaseByIds,setProbeCaseReject } from '@/api-sv3/api-flow'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import JInputSearch from '@/components/jeecg/JInputSearch'
  import ImportModal from '@/components/ImportModal'

  export default {
    name: "index",
    mixins: [JeecgListMixin, flowTrialMixin],
    components: {JEllipsis,JInputSearch,ImportModal},
    data() {
      return {
        data: [],
        pagination: { simple: true },
        loading: false,
        columns: [
          {
            title: '流程',
            dataIndex: 'caseCode',
            align: "center",
            scopedSlots: {
              customRender: 'main' },
            width: '45%',
          },
          {
            title: '提交人',
            dataIndex: 'updateUsername',
            align: "center",
            width: '25%',
          },
          {
            title: '提交时间',
            dataIndex: 'updateTime',
            align: "center",
            width: '30%',
          }
        ],
        url: {
          list: "/probe/medicalProbeCase/submitList",
          delete: "/probe/medicalProbeCase/delete",
          deleteBatch: "/probe/medicalProbeCase/deleteBatch",
          importExcelUrl: "/formal/medicalFormalCase/importCaseExcel"
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
          column: 'updateTime,createTime,caseName',
          order: 'desc,desc,asc',
        },
      }
    },
    methods: {
      initDictConfig() {
        console.log("--我才是真的方法!--")
        //初始化字典
      },
      rowClick(record,index){
        const that = this
        return ({
          style:{cursor:'pointer'},
          // 事件
          on: {
            click: () => {
              let rowKey = record.caseId
              let index = that.selectedRowKeys.indexOf(rowKey)
              if(index >= 0){
                this.$emit('cutCases', [rowKey])
                that.selectedRowKeys.splice(index, 1)
                that.selectionRows.splice(index, 1)
              } else {
                that.$emit('loading', true)
                getProbeCaseByIds({ ids: rowKey }).then((res) => {
                  if (res.success) {
                    let data = res.result
                    that.$emit('addCases', data)
                  } else {
                    that.$message.warning(res.message);
                  }
                }).finally(() => {
                  that.$emit('loading', false)
                })
                that.selectedRowKeys.push(rowKey)
                that.selectionRows.push(record)
              }
            }
          }
        })
      },
      rejectCase() {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('至少选择一条记录！');
          return
        }
        let selectedRowKeys = [...this.selectedRowKeys]
        const that = this
        this.$confirm({
          title: "确认驳回",
          content: "是否驳回选中数据?",
          onOk: async function () {
            that.loading = true
            let res = await setProbeCaseReject({ ids: selectedRowKeys.join(",") })
            if (res.success) {
              that.loadData(1)
              that.$message.success(res.message);
              that.$emit('cutCases', selectedRowKeys)
            } else {
              that.$message.warning(res.message);
              that.loading = false
            }
          }
        });
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        if (selectedRowKeys.length > this.selectedRowKeys.length) {
          let selectKeys = selectedRowKeys.filter(item => !this.selectedRowKeys.some(e => e === item));
          this.$emit('loading', true)
          getProbeCaseByIds({ ids: selectKeys.join(",") }).then((res) => {
            if (res.success) {
              let data = res.result
              this.$emit('addCases', data)
            } else {
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.$emit('loading', false)
          })
        } else {
          let unSelectKeys = this.selectedRowKeys.filter(item => !selectedRowKeys.some(e => e === item));
          this.$emit('cutCases', unSelectKeys)

        }
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      clearSelection(){
        this.selectedRowKeys = []
        this.selectionRows = []
      },
      //导入
      handleImportExcel() {
        let param = {
          title: '批量转换导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: 'MEDICAL_PROBE_TO_FORMAL.xlsx'
        }
        this.$refs.importModel.loadData(param);
      },
    }
  }
</script>
<style scoped>

</style>
