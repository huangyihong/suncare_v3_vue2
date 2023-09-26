<template>
  <div>
    <a-tabs v-model="activeKey">
      <a-tab-pane key="all" tab="全量统计"/>
      <a-tab-pane key="blank" tab="黑名单"/>
      <a-tab-pane key="white" tab="白名单"/>
      <a-tab-pane key="grey" tab="灰名单"/>
      <a-button type="primary" @click="handleExportFile('复审实时-项目全量统计.xlsx')" slot="tabBarExtraContent">导出</a-button>
    </a-tabs>

    <a-skeleton :loading="loading" active :paragraph="{rows: 2}">
    <a-descriptions title="" layout="vertical" size="small" bordered :column="4">
      <a-descriptions-item label="就诊ID数">
        {{dataSource.count && dataSource.visitidCount || 0}}
      </a-descriptions-item>
      <a-descriptions-item label="记录数">
        {{dataSource.count || 0}}
      </a-descriptions-item>
      <a-descriptions-item label="收费项目数">
        {{dataSource.count && dataSource.itemcodeCount || 0}}
      </a-descriptions-item>
      <a-descriptions-item label="违规金额">
        {{dataSource.count && dataSource.sumMinMoney.toFixed(2) || 0}}
      </a-descriptions-item>
      <a-descriptions-item label="违规基金金额">
        {{dataSource.count && dataSource.sumActionMoney.toFixed(2) || 0}}
      </a-descriptions-item>
      <template v-if="activeKey !== 'all'">
        <a-descriptions-item label="就诊ID占比">
          {{dataSource.count && dataSource.visitidRatio || '0%'}}
        </a-descriptions-item>
        <a-descriptions-item label="记录占比">
          {{dataSource.count && dataSource.countRatio || '0%'}}
        </a-descriptions-item>
        <a-descriptions-item label="违规金额占比">
          {{dataSource.count && dataSource.sumMinMoneyRatio || '0%'}}
        </a-descriptions-item>
      </template>

    </a-descriptions>
    </a-skeleton>
  </div>
</template>

<script>
  import { getAction, downFile } from '@/api/manage'

  export default {
    name: 'StatisticModule2',
    components: {},
    props: {
      param: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      this.url = {
        list: this.$suncare_v3 + '/apiReviewStatistic/module2',
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatistic/module2Export',
      }
      return {
        tabs: [],
        activeKey: 'all',
        dataSource: {},
        loading: false
      }
    },
    watch: {
      activeKey: {
        immediate: true,
        handler(val) {
          this.loadData(val)
        }
      }
    },
    methods: {
      loadData(activeKey) {
        let param = { ...this.param, secReviewStatus: activeKey === 'all' ? undefined : activeKey }
        this.loading = true
        getAction(this.url.list, param).then(res => {
          // 解析不合规行为
          if (res.success) {
            let data = res.result
            this.dataSource = data
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })

      },
      handleExportFile(fileName
        , param = { ...this.param, secReviewStatus: this.activeKey === 'all' ? undefined : this.activeKey }
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

</style>
