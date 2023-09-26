<template>
  <a-skeleton :loading="loading" active :paragraph="{rows: 2}">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" v-bind="formItemLayoutHalf">
        <a-row :gutter="24">
          <a-col :lg="8" :md="8" :sm="24">
            <a-form-item label="项目" v-bind="formItemLayout">
              <tag-input :value="projectNames" readOnly :loading="projectBatchLoading"></tag-input>
            </a-form-item>
          </a-col>
          <a-col :lg="16" :md="16" :sm="24">
            <a-form-item label="批次" v-bind="formItemLayout">
              <tag-input :value="batchNames" readOnly :loading="projectBatchLoading"></tag-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="m-t-20">
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索就诊ID数(去重)">
              <a-input :value="dataSource.visitidCount || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="4" :md="8" :sm="12">
            <a-form-item label="线索记录数">
              <a-input :value="dataSource.count || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索收费项目数(去重)">
              <a-input :value="dataSource.itemcodeCount || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索违规总金额">
              <a-input :value="dataSource.sumMinMoney && dataSource.sumMinMoney.toFixed(2) || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索基金总金额">
              <a-input :value="dataSource.sumActionMoney && dataSource.sumActionMoney.toFixed(2) || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="m-t-10">
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="总就诊ID数(去重)">
              <a-input :value="dataSource.dwbMasterInfo.count || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="4" :md="8" :sm="12">
            <a-form-item label="收费记录总数">
              <a-input :value="dataSource.dwbChargeDetail.count || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="收费项目总数(去重)">
              <a-input :value="dataSource.dwbChargeDetail.itemcodeCount || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="医疗费用总金额">
              <a-input :value="dataSource.dwbMasterInfo.sumTotalfee && dataSource.dwbMasterInfo.sumTotalfee.toFixed(2) || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="基金总金额">
              <a-input :value="dataSource.dwbMasterInfo.sumFundpay && dataSource.dwbMasterInfo.sumFundpay.toFixed(2) || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="m-t-10">
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索就诊ID数占比">
              <a-input :value="dataSource.dwbMasterInfo.count && dataSource.visitidCount && (dataSource.visitidCount*100/dataSource.dwbMasterInfo.count).toFixed(2)+'%' || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="4" :md="8" :sm="12">
            <a-form-item label="线索记录数占比">
              <a-input :value="dataSource.dwbChargeDetail.count && dataSource.count && (dataSource.count*100/dataSource.dwbChargeDetail.count).toFixed(2)+'%' || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索收费项目数占比">
              <a-input :value="dataSource.dwbChargeDetail.itemcodeCount && dataSource.itemcodeCount && (dataSource.itemcodeCount*100/dataSource.dwbChargeDetail.itemcodeCount).toFixed(2)+'%' || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="违规金额占比">
              <a-input :value="dataSource.dwbMasterInfo.sumTotalfee && dataSource.sumMinMoney && (dataSource.sumMinMoney*100/dataSource.dwbMasterInfo.sumTotalfee).toFixed(2)+'%' || 0" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="5" :md="8" :sm="12">
            <a-form-item label="线索基金金额占比">
              <a-input :value="dataSource.dwbMasterInfo.sumFundpay && dataSource.sumActionMoney && (dataSource.sumActionMoney*100/dataSource.dwbMasterInfo.sumFundpay).toFixed(2)+'%' || 0" readOnly></a-input>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>
  </a-skeleton>
</template>

<script>
  import { getAction, downFile } from '@/api/manage'

  import TagInput from '@/pages/selectInput/TagInput'

  export default {
    name: 'StatisticModule0',
    components: { TagInput },
    props: {
      param: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      this.url = {
        queryProjectBatchName: '/task/taskProjectBatch/queryProjectBatchName',
        list: this.$suncare_v3 +this.$gp_database+ '/apiReviewStatisticNew/module0',
        exportXlsUrl: this.$suncare_v3  + '/apiReviewStatisticNew/module0Export'
      }
      this.formItemLayout = {
        labelCol: {
          sm: { span: 4 },
        },
        wrapperCol: {
          sm: { span: 20 },
        },
      }
      this.formItemLayoutHalf = {
        labelCol: {
          sm: { span: 8 },
        },
        wrapperCol: {
          sm: { span: 16 },
        },
      }
      return {
        tabs: [],
        loading: false,
        projectBatchLoading: false,
        dataSource: {dwbMasterInfo:{},dwbChargeDetail:{},dwbMasterInfo:{}},
        projectNames: undefined,
        batchNames: undefined,
      }
    },
    beforeMount(){
      this.loadData()
    },
    watch: {
      param: {
        immediate: true,
        handler(val) {
          let {projectIds, batchIds} = val
          this.queryProjectBatchName(projectIds, batchIds)
        }
      }
    },
    methods: {
      queryProjectBatchName(projectIds, batchIds){
        let param = {}
        if(projectIds && projectIds.length > 0){
          this.projectNames = projectIds.split(',').fill('加载中').join(',')
          param.projectIds = projectIds
        }
        if(batchIds && batchIds.length > 0){
          this.batchNames = batchIds.split(',').fill('加载中').join(',')
          param.batchIds = batchIds
        }
        if(Object.keys(param).length === 0){
          this.projectNames = '全部'
          this.batchNames = '全部'
          return
        }
        this.projectBatchLoading = true
        getAction(this.url.queryProjectBatchName, param).then(res => {
          // 解析不合规行为
          if (res.success) {
            let {projectNames, batchNames} = res.result
            this.projectNames = projectNames || '全部'
            this.batchNames = batchNames || '全部'
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.projectBatchLoading = false
        })
      },
      loadData(actionId) {
        this.loading = true
        getAction(this.url.list, { ...this.param, actionId }).then(res => {
          // 解析不合规行为
          if (res.success) {
            let data = res.result
            this.dataSource = data
            this.$bus.$emit("project-dataSource",data)
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      handleExportFile(fileName
        , param = { ...this.param, actionId: this.actionId }
        , url = this.url.exportXlsUrl
        , method = 'get'
      ) {
        downFile(url, param, method).then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
          this.$message.success('文件下载成功')
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    },
    computed: {}
  }
</script>
<style scoped>
  .table-page-search-wrapper .ant-form-inline .ant-form-item{
    margin-bottom: 0;
  }
</style>
