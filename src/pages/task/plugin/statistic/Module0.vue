<template>
  <div>
    <!--<a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Tab 1">
      </a-tab-pane>
    </a-tabs>-->
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-10"/>
    <a-button type="primary" @click="handleExportFile('全量统计.xlsx')" class="fr">导出</a-button>
    <!--<p class="m-b-6 m-l-6">初审已完成判定总记录数： 12312312312</p>-->
    <a-skeleton :loading="loading" active :paragraph="{rows: 2}">
      <a-descriptions title="" layout="vertical" size="small" bordered :column="3">
        <a-descriptions-item label="总记录数">
          {{dataSource.count || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="总就诊ID数">
          {{dataSource.visitidCount || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="总收费项目数">
          {{dataSource.itemcodeCount || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="总违规金额">
          {{dataSource.sumMinMoney && dataSource.sumMinMoney.toFixed(2) || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="总违规基金金额" :span="2">
          {{dataSource.sumActionMoney && dataSource.sumActionMoney.toFixed(2) || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="已初审记录数">
          {{dataSource.pushCount || 0}}
        </a-descriptions-item>
        <a-descriptions-item label="已复审记录数">
          {{dataSource.secPushCount || 0}}
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
  </div>
</template>

<script>
  import { getAction, downFile } from '@/api/manage'

  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

  export default {
    name: 'StatisticModule1',
    components: { MDictSelectTag },
    props: {
      param: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      this.url = {
        termActionData: this.$suncare_v3 + '/apiReviewStatistic/termActionData',
        list: this.$suncare_v3 + '/apiReviewStatistic/module0',
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatistic/module0Export'
      }
      return {
        tabs: [],
        activeKey: '1',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        loading: false,
        dataSource: {}
      }
    },
    beforeMount() {
      this.loadActionData()
    },
    watch: {
      actionId: {
        immediate: true,
        handler(val) {
          this.loadData(val)
        }
      }
    },
    methods: {
      loadActionData() {
        this.actionLoading = true
        getAction(this.url.termActionData, { ...this.param }).then(res => {
          // 解析不合规行为
          if (res.success) {
            let data = res.result
            this.actionData = data.map(item => ({
              code: item.val,
              value: `${item.name || item.actionName || item.val}(${item.count})`
            }))
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.actionLoading = false
        })
      },
      loadData(actionId) {
        this.loading = true
        getAction(this.url.list, { ...this.param, actionId }).then(res => {
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

</style>
