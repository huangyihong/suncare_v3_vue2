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
        <!--改为执行批次再备份，编辑不再不需要覆盖新旧版本-->
        <!--<template v-if="onBatch && !readonly && ruleType === '01'">
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
        </template>-->
        <template v-if="!readonly">
          <a-button type="primary" ghost @click="selectVisible=true" style="float: right" v-if="notHis">选择</a-button>
          <a-popconfirm title="确定清空吗?" class="fr m-r-6"  @confirm="clear" v-if="data.length > 0">
            <a-button>清空</a-button>
          </a-popconfirm>
          <a-button type="primary" class="fr m-r-6" @click="addSpecialRule('0001')" v-if="ruleType === '08'">添加重复用药</a-button>
        </template>
      </div>
      <a-empty v-show="data.length === 0"/>
      <!--药品合规等名字显示不全的-->
      <template v-if="ruleType === '01'">
        <task-batch-break-case-list v-for="(item,index) in pageData" :key="item.id"
                                    :busiId="item.id" :batchId="batchId" :notHis="notHis">
          <a-tag class="tag-select" :closable="!readonly" @close="removeSelect(index)"
                 :color="primaryColor">
            <!--<j-ellipsis :value="item.name" :length="10"/>-->
            <span>{{item.name}}</span>
          </a-tag>
        </task-batch-break-case-list>
      </template>
      <template v-else>
        <template v-for="(item,index) in pageData">
          <a-tag :key="item.id"
                 :closable="!readonly"
                 @click="itemDetail(item)"
                 @close="removeSelect(index)" :color="item.special?'blue':item.delete?undefined: primaryColor"
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
                 :selected="data"></component>
    </m-modal>
    <component :is="selectInfo.detailComponent" ref="detailRef" :notHis="notHis" :batchId="batchId"></component>
  </a-skeleton>
</template>

<script>
  const RuleModelBusi = () => import('@/pages/selectMulti/RuleModelBusi')
  const RuleCase = () => import('@/pages/selectMulti/MedicalFormalCase')
  const RuleDrug = () => import('@/pages/selectMulti/RuleDrug')
  const RuleCharge = () => import('@/pages/selectMulti/RuleCharge')
  const RuleTreat = () => import('@/pages/selectMulti/RuleTreat')
  const RuleClinical = () => import('@/pages/selectMulti/RuleClinical')
  const RuleDruguse2 = () => import('@/pages/selectMulti/RuleDruguse2')
  const RuleCharge2 = () => import('@/pages/selectMulti/RuleCharge2')
  const RuleTreat2 = () => import('@/pages/selectMulti/RuleTreat2')
  const RuleDrug2 = () => import('@/pages/selectMulti/RuleDrug2')

  const SelectMedicalClinical = () => import('@/pages/selectMulti/MedicalClinical')

  import { mixin } from '@/utils/mixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  const TaskBatchBreakCaseList = () => import('@/pages/task/modules/TaskBatchBreakCaseList')
  import { queryBatchRuleByType, queryBatchRuleInFormalByType } from '@/api-sv3/api'

  const MedicalClinicalModal = () => import('@/pages/config/modules/MedicalClinicalModal')
  const MedicalDrugRuleModal = () => import('@/pages/case/modules/MedicalDrugRuleModal')
  const MedicalChargeRuleModal = () => import('@/pages/case/modules/MedicalChargeRuleModal')
  const MedicalTreatRuleModal = () => import('@/pages/case/modules/MedicalTreatRuleModal')
  const MedicalDruguseRule2Modal = () => import('@/pages/case/modules/MedicalDruguseRule2Modal')
  const MedicalChargeRule2Modal = () => import('@/pages/case/modules/MedicalChargeRule2Modal')
  const MedicalTreatRule2Modal = () => import('@/pages/case/modules/MedicalTreatRule2Modal')
  const MedicalDrugRule2Modal = () => import('@/pages/case/modules/MedicalDrugRule2Modal')
  const CaseDetailModal = () => import('@/pages/probe/caseDetailModal')

  export default {
    name: "TaskBatchBreakRuleList",
    mixins: [mixin],
    components: {
      RuleModelBusi,
      RuleCase,
      RuleDrug,
      RuleCharge,
      RuleTreat,
      RuleClinical,
      RuleDruguse2,
      RuleCharge2,
      RuleTreat2,
      RuleDrug2,
      SelectMedicalClinical,
      JEllipsis,
      TaskBatchBreakCaseList,
      MedicalClinicalModal,
      MedicalDrugRuleModal,
      MedicalChargeRuleModal,
      MedicalTreatRuleModal,
      MedicalDruguseRule2Modal,
      MedicalChargeRule2Modal,
      MedicalTreatRule2Modal,
      MedicalDrugRule2Modal,
      CaseDetailModal
    },
    props: [
            'batchId', 'ruleType', 'readonly',
      // 是否是最新数据
      'notHis',
      // 没有选择其他批次，并且当前批次已创建
      // 'onBatch'
    ],
    data() {
      const userInfo = this.$store.getters.userInfo
      const ruleSource = userInfo.dataSource
      this.specialRuleMap = {
        '08': {
          '0001': '重复用药'
        }
      }[this.ruleType]
      return {
        description: '批次规则关联管理页面',
        confirmLoading: false,
        selectLoading: false,
        selectVisible: false,
        selectInfos: {
          '01': { title: '违规业务组', component: 'RuleModelBusi' },
          '11': {
            title: '违规模型',
            component: 'RuleCase',
            params: {},
            detailComponent: 'CaseDetailModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          /*'02': {
            title: '药品合规',
            component: 'RuleDrug',
            params: { ruleSource },
            detailComponent: 'MedicalDrugRuleModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },*/
          /*'03': {
            title: '收费合规',
            component: 'RuleCharge',
            params: { ruleSource },
            detailComponent: 'MedicalChargeRuleModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },*/
          /*'04': { title: '临床路径', component: 'RuleClinical' },
          '05': { title: '违反KPI', component: '' },*/
          '06': {
            title: '临床路径',
            component: 'SelectMedicalClinical',
            detailComponent: 'MedicalClinicalModal',
            tagText: item => `${item.name}(${item.code})`
          },
          /*'07': {
            title: '合理诊疗',
            component: 'RuleTreat',
            params: { ruleSource },
            detailComponent: 'MedicalTreatRuleModal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },*/
          '08': {
            title: '合理用药',
            component: 'RuleDruguse2',
            params: { ruleSource },
            detailComponent: 'MedicalDruguseRule2Modal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '09': {
            title: '收费合规',
            component: 'RuleCharge2',
            params: { ruleSource },
            detailComponent: 'MedicalChargeRule2Modal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '10': {
            title: '合理诊疗',
            component: 'RuleTreat2',
            params: { ruleSource },
            detailComponent: 'MedicalTreatRule2Modal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
          '12': {
            title: '药品合规',
            component: 'RuleDrug2',
            params: { ruleSource },
            detailComponent: 'MedicalDrugRule2Modal',
            tagText: item => `${item.name.length > 15?item.name.substring(0,15) + '...' :item.name}`
          },
        },
        pageNo: 1,
        pageSize: 35,
        data: [],
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
      data(val){
        this.$emit('change', val)
      }
    },
    methods: {
      // 选择历史批次加载，取最新版不取备份
      loadData(batchId) {
        if (!batchId || batchId.length === 0) {
          return
        }
        let params = {
          batchId: batchId,
          type: this.ruleType,
          // notHis: !!(!this.onBatch && this.notHis), // 是否存在于最新配置中  onBatch: true 肯定为历史
          notHis: this.notHis, // 是否存在于最新配置中  onBatch: true 肯定为历史
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
            //  处理维护界面不存在的特殊规则 或 被删除的规则
            let specialMap = this.specialRuleMap|| {}

            data.forEach(r => {
              if(!r.name){
                if(specialMap[r.id]){
                  r.code = r.id
                  r.name = specialMap[r.id]
                  r.special = true
                } else {
                  r.code = r.id
                  r.name = '不存在'
                  r.delete = true
                }
              }
            })
            /*if (this.onBatch && !this.notHis) {
              data.forEach(item => item.batchId = batchId)
            } else {
              this.selectData = data.map(r => ({...r}))
            }*/

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

      },
      itemDetail(item) {
        if(item.special || item.delete){
          return
        }
        this.$refs.detailRef.detail(item.id)
      },
      addSpecialRule(id){
        if(this.data.some(r => r.id === id)){
          return
        }
        let obj = {id, code: id, name: this.specialRuleMap[id], special: true}
        this.data.unshift(obj)
      },
      // 根据id获取维护界面最新的规则， 用于选择界面
      overrideSelectData() {
        if (this.data.length === 0) {
          this.selectVisible = true
          return
        }
        let ruleIdArray = this.data.map(item => item.id)
        let ruleIds = ruleIdArray.join(",")
        this.selectLoading = true
        queryBatchRuleInFormalByType({ ruleIds, type: this.ruleType, }).then(res => {
          if (res.success) {
            let data = this.data = res.result.map(item => {
              return {
                id: item.ruleId,
                code: item.code,
                name: item.name,
              }
            })
            // 这个方法现在只有模型才使用
            // 处理维护界面不存在的特殊规则 或 被删除的规则
            /*let specialMap = this.specialRuleMap || {}
            let existIdSet = new Set(data.map(r => r.id))
            ruleIdArray.forEach(id => {
              if(!existIdSet.has(id)){
                if(specialMap[id]){
                  data.unshift({id, code: id, name: specialMap[id]})
                } else {
                  data.unshift({id, code: id, name: '不存在'})
                }
              }
            })*/

            this.selectVisible = true
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.selectLoading = false
        })
      },
      handleSelectOk() {
        this.data = this.$refs.selectRef.getSelect()
        this.handleSelectClose()
      },
      handleSelectClose() {
        this.selectVisible = false
      },
      getData() {
        if (this.ruleType === '01' || this.ruleType === '06' || this.ruleType === '11') {
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
    padding: 8px 10px;
    margin-top: 5px;
    font-size: 13px;
    line-height: 13px;
    cursor: pointer;
  }
</style>
