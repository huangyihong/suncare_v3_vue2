<template>
  <a-skeleton :loading="confirmLoading" active :paragraph="{rows: 5}">
    <div style="min-height: 300px">
      <div style="height: 40px">
        <span v-if="data.length > 0">
          <a-button size="small" type="primary" @click="pageNo-=1" :disabled="pageNo === 1">
            <a-icon type="left"></a-icon> </a-button>
          <a-button size="small" type="primary" @click="pageNo+=1" style="margin-left: 5px"
                    :disabled="pageNo === lastPageNo"> <a-icon type="right"/> </a-button>
        {{pageNo}}-{{lastPageNo}} 共{{data.length}}条
        </span>
        <template v-if="onBatch && !readonly && ruleType === '01'">
          <a-popconfirm placement="left" @confirm="overrideSelectData">
            <template slot="title">
              <p>如果对模型列表重新选择，</p>
              <p>系统将用最新的配置数据覆盖当前数据，</p>
              <a>是否继续？</a>
            </template>
            <a-button type="primary" ghost style="float: right" :loading="selectLoading">选择</a-button>
          </a-popconfirm>
          <a-popconfirm title="确定清空吗?" @confirm="clear" style="float: right;margin-right: 15px" v-if="data.length > 0">
            <a-button>清空</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="!readonly">
          <a-button type="primary" ghost @click="selectVisible=true" style="float: right" v-if="notHis">选择</a-button>
          <a-popconfirm title="确定清空吗?" @confirm="clear" style="float: right;margin-right: 15px" v-if="data.length > 0">
            <a-button>清空</a-button>
          </a-popconfirm>
        </template>
      </div>
      <a-empty v-show="data.length === 0"/>
      <!--药品合规等名字显示不全的-->
      <template v-if="ruleType === '01'">
        <task-batch-break-case-list v-for="(item,index) in pageData" :key="item.id"
                                    :busiId="item.id" :batchId="item.batchId" :notHis="!item.batchId">
          <a-tag class="tag-select" :closable="!readonly" @close="removeSelect(index)"
                 :color="primaryColor">
            <!--<j-ellipsis :value="item.name" :length="10"/>-->
            <span>{{item.name}}</span>
          </a-tag>
        </task-batch-break-case-list>
      </template>
      <template v-else>
        <template v-for="(item,index) in pageData">
          <a-tag :key="index"
                 :closable="!readonly"
                 @click="itemDetail(item.id)"
                 @close="removeSelect(index)" :color="primaryColor"
                 class="tag-select" :title="`${item.name}\n(${item.code})`">
            {{selectInfo.tagText(item)}}
          </a-tag>
        </template>
      </template>

    </div>
    <m-modal
      :title="'选择'+ selectInfo.title"
      :visible="selectVisible"
      @ok="handleSelectOk"
      @cancel="handleSelectClose"
      v-if="!readonly">
      <component :is="selectInfo.component" ref="selectRef" v-bind="selectInfo.params||{}"
                 :selected="selectData"></component>
    </m-modal>
    <component :is="selectInfo.detailComponent" ref="detailRef"></component>
  </a-skeleton>
</template>

<script>
  const RuleModelBusi = () => import('@/pages/selectMulti/RuleModelBusi')
  const CaseDetailModal = () => import('@/pages/probe/caseDetailModal')
  const RuleDrug = () => import('@/pages/selectMulti/RuleDrug')
  const RuleCharge = () => import('@/pages/selectMulti/RuleCharge')
  const RuleTreat = () => import('@/pages/selectMulti/RuleTreat')
  const RuleClinical = () => import('@/pages/selectMulti/RuleClinical')
  const RuleDruguse = () => import('@/pages/selectMulti/RuleDruguse')
  const RuleCharge2 = () => import('@/pages/selectMulti/RuleCharge2')
  const SelectMedicalClinical = () => import('@/pages/selectMulti/MedicalClinical')

  import { mixin } from '@/utils/mixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  const TaskBatchBreakCaseList = () => import('@/pages/task/modules/TaskBatchBreakCaseList')
  import { queryBatchRuleByType, queryBatchRuleInFormalByType } from '@/api-sv3/api'

  const MedicalClinicalModal = () => import('@/pages/config/modules/MedicalClinicalModal')
  const MedicalDrugRuleModal = () => import('@/pages/case/modules/MedicalDrugRuleModal')
  const MedicalChargeRuleModal = () => import('@/pages/case/modules/MedicalChargeRuleModal')
  const MedicalTreatRuleModal = () => import('@/pages/case/modules/MedicalTreatRuleModal')
  const MedicalDruguseModal = () => import('@/pages/case/modules/MedicalDruguseModal')
  const MedicalChargeRule2Modal = () => import('@/pages/case/modules/MedicalChargeRule2Modal')

  export default {
    name: "TaskBatchBreakRuleList",
    mixins: [mixin],
    components: {
      RuleModelBusi,
      RuleDrug,
      RuleCharge,
      RuleTreat,
      RuleClinical,
      RuleDruguse,
      RuleCharge2,
      SelectMedicalClinical,
      JEllipsis,
      TaskBatchBreakCaseList,
      MedicalClinicalModal,
      MedicalDrugRuleModal,
      MedicalChargeRuleModal,
      MedicalTreatRuleModal,
      MedicalDruguseModal,
      MedicalChargeRule2Modal
    },
    props: ['batchId', 'ruleType', 'readonly',
      // 是否是最新数据
      'notHis',
            // 没有选择其他批次，并且当前批次已创建
      'onBatch'],
    data() {
      const userInfo = this.$store.getters.userInfo
      const ruleSource = userInfo.dataSource
      return {
        description: '批次规则关联管理页面',
        confirmLoading: false,
        selectLoading: false,
        selectVisible: false,
        selectInfos: {
          '01': { title: '违规模型', component: 'CaseDetailModal' },
          '02': {
            title: '药品不合规',
            component: 'RuleDrug',
            params: { ruleSource },
            detailComponent: 'MedicalDrugRuleModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '03': {
            title: '收费不合规',
            component: 'RuleCharge',
            params: { ruleSource },
            detailComponent: 'MedicalChargeRuleModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '04': { title: '临床路径不合规', component: 'RuleClinical' },
          '05': { title: '违反KPI', component: '' },
          '06': {
            title: '临床路径',
            component: 'SelectMedicalClinical',
            detailComponent: 'MedicalClinicalModal',
            tagText: item => `${item.name}(${item.code})`
          },
          '07': {
            title: '诊疗不合理',
            component: 'RuleTreat',
            params: { ruleSource },
            detailComponent: 'MedicalTreatRuleModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '08': {
            title: '用药不合理',
            component: 'RuleDruguse',
            params: { ruleSource },
            detailComponent: 'MedicalDruguseModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '09': {
            title: '收费不合规-测试',
            component: 'RuleCharge2',
            params: { ruleSource },
            detailComponent: 'MedicalChargeRule2Modal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
        },
        pageNo: 1,
        pageSize: 35,
        data: [],
        selectData: [],
      }
    },
    beforeMount() {
    },
    watch: {
      batchId: {
        immediate: true,
        handler(val) {
          this.loadData(val)
        },
      },
      notHis(val, oldVal) {
        this.loadData(this.batchId)
      },
    },
    methods: {
      loadData(batchId) {
        if (!batchId || batchId.length === 0) {
          return
        }
        let params = {
          batchId: batchId,
          type: this.ruleType,
          notHis: !!(!this.onBatch && this.notHis), // 是否存在于最新配置中  onBatch: true 肯定为历史
        }
        this.confirmLoading = true
        queryBatchRuleByType(params).then(res => {
          if (res.success) {
            this.clear()
            let data = res.result.map(item => {
              return {
                id: item.ruleId,
                code: item.code,
                name: item.name,
              }
            })
            if (this.onBatch && !this.notHis) {
              data.forEach(item => item.batchId = batchId)
            } else {
              this.selectData = data
            }
            // console.log('this.onBatch', this.onBatch)
            // console.log('this.notHis', this.notHis)
            this.data = data
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      removeSelect(index) {
        let item = this.data.splice(index, 1)[0]
        console.log('removeSelect', item)

        if (!item.batchId) {
          let index = this.selectData.indexOf(item)
          this.selectData.splice(index, 1)
        }
      },
      itemDetail(id) {
        this.$refs.detailRef.detail(id)
      },
      overrideSelectData() {
        if (this.data.length === 0) {
          this.selectVisible = true
          return
        }
        let ruleIds = this.data.map(item => item.id).join(",")
        this.selectLoading = true
        queryBatchRuleInFormalByType({ ruleIds, type: this.ruleType, }).then(res => {
          if (res.success) {
            this.selectData = res.result.map(item => {
              return {
                id: item.ruleId,
                code: item.code,
                name: item.name,
              }
            })
            this.selectVisible = true
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.selectLoading = false
        })
      },
      handleSelectOk() {
        this.selectData = this.$refs.selectRef.getSelect()
        this.data = [...this.data.filter(item => item.batchId), ...this.selectData]
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      getData() {
        if (this.ruleType === '01' || this.ruleType === '06') {
          return this.data.map(item => {
            return {
              ruleId: item.id,
              ruleName: item.name,
              ruleType: this.ruleType,
              batchId: item.batchId
            }
          })
        } else {
          return this.data.map(item => {
            return {
              ruleId: item.id,
              ruleType: this.ruleType,
              batchId: item.batchId
            }
          })
        }

      },
      clear() {
        this.selectData = []
        this.data = []
      }
    },
    computed: {
      selectInfo() {
        return this.selectInfos[this.ruleType] || {}
      },
      pageData() {
        let lastIndex = this.pageSize * this.pageNo
        if (lastIndex > this.data.length) {
          lastIndex = this.data.length
        }
        console.log('this.data', this.data)
        console.log('lastIndex', lastIndex)
        console.log('this.pageSize * (this.pageNo - 1)', this.pageSize * (this.pageNo - 1))
        return this.data.slice(this.pageSize * (this.pageNo - 1), lastIndex);
      },
      lastPageNo() {
        if (this.data.length % this.pageSize === 0) {
          return this.data.length / this.pageSize
        } else {
          return parseInt(this.data.length / this.pageSize) + 1
        }
      }
    }
  }
</script>
<style lang="less" scoped>

  .tag-select {
    height: auto;
    padding: 5px 10px;
    margin-top: 5px;
    font-size: 13px;
    cursor: pointer;
  }
</style>
