<template>
  <div>
    不合规行为：
    <m-dict-select-tag placeholder="请选择"
                       v-model="actionId" :options="actionData" :loading="actionLoading"
                       search style="width: 250px" class="m-b-6"/>
    <a-button type="primary" @click="handleExportFile('白名单归因统计.xlsx')" class="fr">导出</a-button>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="val"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: scrollX,y: '300px'}"
      v-bind="tableAttrs">

    </a-table>
  </div>
</template>

<script>
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: 'StatisticModule4',
    mixins:[JeecgListMixin],
    components: {MDictSelectTag},
    props: {
      param: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      this.url = {
        termActionData: this.$suncare_v3 + '/apiReviewStatistic/termActionData',
        list: this.$suncare_v3 + '/apiReviewStatistic/module4',
        exportXlsUrl: this.$suncare_v3 + '/apiReviewStatistic/module4Export',
        oDictList: '/config/medicalOtherDict/getDictList',
      }
      this.commonColumns = [
        {
          title: '不合规行为',
          align: "center",
          width: 150,
          dataIndex: 'actionName'
        },
        {
          title: '就诊ID数',
          align: "center",
          width: 100,
          dataIndex: 'visitidCount'
        },
        {
          title: '记录数',
          align: "center",
          width: 100,
          dataIndex: 'count'
        },
        {
          title: '收费项目数',
          align: "center",
          width: 100,
          dataIndex: 'itemcodeCount'
        },
        {
          title: '违规金额',
          align: "center",
          width: 100,
          dataIndex: 'sumMinMoney',
          customRender: t => t.toFixed(2)
        },
        {
          title: '违规基金金额',
          align: "center",
          width: 100,
          dataIndex: 'sumActionMoney',
          customRender: t => t.toFixed(2)
        },
      ]
      return {
        tabs: [],
        activeKey: 'all',
        actionData: [],
        actionId: undefined,
        actionLoading: false,
        columns: [...this.commonColumns],
        initLoad: false,
        fixedParam: {...this.param},
        classifyData: []
      }
    },
    beforeMount() {
      this.loadActionData()
      this.loadClassifyDict()
    },
    watch: {
      actionId: {
        immediate: true,
        handler(val) {
          this.fixedParam.actionId = val
          this.loadData(1)
        }
      },
      dataSource: {
        handler(array) {
          this.initTitle()
        }
      },
    },
    methods: {
      loadActionData() {
        this.actionLoading = true
        getAction(this.url.termActionData, { ...this.param}).then(res => {
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
      loadClassifyDict(){
        getAction(this.url.oDictList, { dictEname: 'reasontype' }).then(res => {
          // 解析不合规行为
          if (res.success) {
            let data = res.result
            this.classifyData = data
            // 要是在列表后面加载完成， 重新初始化标题
            if(this.loadClassifyData){
              this.initTitle()
            }

          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.actionLoading = false
        })
      },
      initTitle(){
        this.columns = [...this.commonColumns]
        if(this.dataSource && this.dataSource.length > 0){
          if(this.classifyData.length === 0){
            this.loading = true
            this.loadClassifyData = true
            return
          }
          this.loading = false
          let fieldSet = new Set()
          this.dataSource.forEach(r => {
            Object.keys(r).forEach(r2 => fieldSet.add(r2))
          })
          console.log('fieldSet',fieldSet)
          for(let {code, value} of this.classifyData){
            console.log('code',code)
            if(!fieldSet.has(code)){
              continue
            }
            this.columns.push({
              title: value + '数量',
              align: "center",
              width: 100,
              dataIndex: code,
              customRender: (t, r, i) => {
                let val = r[code]
                return val?val + ' / ' + (val * 100.0 / r.totalCount).toFixed(2) + '%': 0
              },
            })
          }
        }
        this.columns.push({
          title: '不合规行为占比',
          align: "center",
          width: 100,
          // dataIndex: 'countRate',
          customRender: (t, r, i) => {
            return (r.count * 100.0 / r.totalCount).toFixed(2) + '%'
          },
        })
      }
    },
    computed: {}
  }
</script>
<style scoped>

</style>
