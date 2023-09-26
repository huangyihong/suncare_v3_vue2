<template>
  <div>
    <a-table
      ref="table"
      size="middle"
      rowKey="batchId"
      :bordered="false"
      :showHeader="false"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :customRow="customRow"
      :loading="loading"
      :showOverflow="false"
      hideTools
      v-bind="tableAttrs">
      <tempalte slot="execBtn" slot-scope="text, record, index">
        <a-popconfirm title="确定执行吗?" @confirm="handleExec(record.batchId)"
                      :disabled="record.step1Status&&(record.step1Status.indexOf('running') > -1||record.step1Status.indexOf('wait') > -1) || record.step >2"
                      v-if="record.step === 0">
          <a-button type="primary">
            执行
          </a-button>
        </a-popconfirm>

        <a-button style="width: 100px;margin-right:4px;"
          v-else-if="record.step < 3&& record.ruleTypes !== '-1' && record.step1Status &&record.step1Status.indexOf('abnormal') > -1"
          :disabled="record.step1Status&&(record.step1Status.indexOf('running') > -1||record.step1Status.indexOf('wait') > -1)"
          @click="handleReExecConfirm(record.batchId, record.ruleTypes)">
          重跑
        </a-button>

        <a-popconfirm title="确定重跑吗?" @confirm="handleExec(record.batchId)"
                      v-else-if="record.step < 3 && record.ruleTypes !== '-1'"
                      :disabled="record.step1Status&&(record.step1Status.indexOf('running') > -1||record.step1Status.indexOf('wait') > -1)"
        >
          <a-button style="width: 100px;margin-right:4px;">
            重跑
          </a-button>
        </a-popconfirm>

        <!--合理用药08 合理诊疗10 药品合规12 -->
        <a-button @click="handleAiAudit(record.batchId)"
                  v-if="record.step < 3 && record.ruleTypes && (record.ruleTypes.indexOf('08')>-1||record.ruleTypes.indexOf('10')>-1||record.ruleTypes.indexOf('12')>-1)"
                  type="primary" style="margin-top:4px;width: 100px;white-space:nowrap;">
          AI辅助判定
        </a-button>


      </tempalte>

      <a-steps :current="text" size="small" class="min-step" labelPlacement="vertical" slot="step"
               slot-scope="text, record">
        <!--<template v-for="(item,index) in steps">&ndash;&gt;
          <a-step :class="{'ant-steps-item-process':text !== 0}" :title="item.value"
                  @click="gotoStepPage(text,item.code, record.batchId, record)"
          ></a-step>
        </template>-->
        <a-step @click="gotoStepPage(text,'0', record.batchId, record)">
          <template slot="title">
            <div class="step-text">
              创建<br>
              <span v-if="record.step !== 0 && facetObj" class="desc">
                    <!--<a-badge :count="record.dataCount" show-zero :overflow-count="999999999999" :number-style="{ backgroundColor: '#e2d075' }"/>-->
                总数：{{ facetObj[record.batchId].count }}
            </span>
            </div>

          </template>
        </a-step>
        <a-step :class="{'ant-steps-item-process':text !== 0}"
                @click="gotoStepPage(text,'1', record.batchId, record)">
          <template v-if="text === 1 && record.step1Status" slot="icon">
            <a-icon type="loading" v-if="record.step1Status.indexOf('running') > -1" style="width: 24px;height: 24px;"/>
            <a-icon type="exclamation-circle" v-else-if="record.step1Status.indexOf('abnormal') > -1"
                    style="width: 24px;height: 24px;color: #ffa91b"/>
            <a-icon type="clock-circle" v-else-if="record.step1Status.indexOf('wait') > -1"
                    style="width: 24px;height: 24px;"/>
          </template>
          <template slot="title">
            <div class="step-text">
              初审<br>
              <span v-if="record.step !== 0 && facetObj && facetObj[record.batchId].firstPushCount"
                    class="desc">
                    <!--<a-badge :count="record.dataCount" show-zero :overflow-count="999999999999" :number-style="{ backgroundColor: '#e2d075' }"/>-->
                已初审：{{ facetObj[record.batchId].firstPushCount.count }}
            </span>
            </div>

          </template>
        </a-step>
        <a-step :class="{'ant-steps-item-process':text !== 0}"
                @click="gotoStepPage(text,'2', record.batchId, record)">
          <template slot="title">
            <div class="step-text">
              复审<br>
              <span v-if="record.step !== 0 && facetObj && facetObj[record.batchId].pushDataCount"
                    class="desc">
                <!--<a-badge :count="record.pushDataCount" :overflow-count="999999999999" :number-style="{ backgroundColor: '#e2d075' }"/>-->
                <!--(已推送：{{facetObj[record.batchId].pushDataCount.count}})-->
                  已复审：{{ facetObj[record.batchId].pushDataCount.count }} 用户报告：{{ facetObj[record.batchId].newsHandleCount.count }}
                </span>
            </div>
          </template>
        </a-step>
      </a-steps>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-if="record.step === 0">编辑</a>
        <a @click="handleEdit(record)" v-else>查看</a>
         <a-divider type="vertical"/>
        <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.batchId)">
          <a>删除</a>
        </a-popconfirm>
        <a-divider type="vertical"/>
        <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="viewProgress(record.batchId)"
                   v-if="record.step !== 0 && record.ruleTypes.indexOf('11')==-1 && record.ruleTypes.indexOf('01')==-1">进度详情</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="changeAutoRerunStatus(record.batchId, 'stop')"
                   v-if="record.autoRerun && record.autoRerun === 'normal'">关闭自动重跑</a>
                <a @click="changeAutoRerunStatus(record.batchId,'normal')" v-else>开启自动重跑</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        <!-- <template>
         <a @click="handleEdit(record)" v-if="record.step === 0">编辑</a>
         <a @click="handleEdit(record)" v-else>详情</a>

         <a-divider type="vertical"/>
         <a-dropdown>
           <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
           <a-menu slot="overlay">
             <a-menu-item>
                 <a @click="gotoPath('/formal/modelConfig/behaviorModel/behaviorModelList',
                 {batchId:record.batchId})">不合规行为配置</a>
             </a-menu-item>
             <a-menu-item>
               <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.batchId)">
                 <a>删除</a>
               </a-popconfirm>
             </a-menu-item>
           </a-menu>
         </a-dropdown>
           </template>-->
      </span>

    </a-table>
    <task-project-batch-modal ref="modalForm" @ok="modalFormOk"></task-project-batch-modal>
    <select-modal ref="selectModal"></select-modal>
    <task-batch-break-rule-log-modal ref="progressModal"
                                     :progressBatchId="progressBatchId"></task-batch-break-rule-log-modal>

  </div>
</template>

<script>
import { postAction, getAction, putAction } from '@/api-sv3/manage'

import TaskProjectBatchModal from './modules/TaskProjectBatchModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import SelectModal from '@/components/SelectModal'
import TaskBatchBreakRuleLogModal from './modules/TaskBatchBreakRuleLogModal'

export default {
  name: 'TaskProjectBatchList',
  mixins: [JeecgListMixin],
  components: {
    TaskBatchBreakRuleLogModal,
    TaskProjectBatchModal,
    SelectModal
  },
  props: {
    projectId: String
  },
  data() {
    return {
      description: '任务项目批次管理页面',
      // 表头
      columns: [
        {
          title: '执行',
          width: 60,
          scopedSlots: { customRender: 'execBtn' }
        },
        {
          title: '步骤进度',
          dataIndex: 'step',
          width: 350,
          scopedSlots: { customRender: 'step' }
        },
        /* {
           title: '步度',
           dataIndex: 'step1Status',
           // width: 350,
           // scopedSlots: { customRender: 'step' },
         },*/
        {
          title: '任务批次',
          align: 'center',
          width: 120,
          dataIndex: 'batchName',
          customRender: (t, r, index) => this.colRender(t, r, index, '任务批次')
        },
        /*{
          title: '负责人',
          align: "center",
          width: 80,
          dataIndex: 'picId',
          customRender: (t, r, index) => this.colRender(t, r, index, '负责人')
        },
        {
          title: '风控月份',
          align: "center",
          width: 100,
          dataIndex: 'month',
          customRender: (t, r, index) => this.colRender(t, r, index, '风控月份')
        },*/
        {
          title: '创建人',
          align: 'center',
          width: 100,
          dataIndex: 'createUserName',
          customRender: (t, r, index) => this.colRender(t, r, index, '创建人')
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/task/taskProjectBatch/list',
        delete: this.$suncare_v3 + '/apiTask/taskProjectBatch/delete',
        edit: '/task/taskProjectBatch/editInfo',
        facetBatchCount: this.$suncare_v3 + this.$gp_database + '/apiTask/taskProjectBatch/facetBatchCount',
        aiAudit: this.$suncare_v3 + '/apiTask/taskProjectBatch/aiAudit',
        queryById: "/task/taskProjectBatch/queryById",
      },
      queryParam: {
        projectId: this.projectId
      },
      ipagination: {
        current: 1,
        pageSize: 9999999
      },
      /*  isorter: {
          column: 'month',
          order: 'asc',
        },*/
      steps: [
        { code: '0', value: '创建' },
        { code: '1', value: '初审' },
        { code: '2', value: '推送' }
      ],
      signBatchId: false,
      signBatchCacheKey: 'signBatchId',
      facetObj: undefined,
      progressBatchId: ''
    }
  },
  beforeMount() {
    /* this.$util.initDict('BATCH_STEP').then(data => {
       this.steps = data
     })*/
    this.signBatchId = this.$util.getCache(this.signBatchCacheKey)
    this.$util.setCache(this.signBatchCacheKey, undefined)
  },
  watch: {
    dataSource(array) {
      if (array && array.length > 0) {
        let batchIds = array.map(r => r.batchId).join(',')
        getAction(this.url.facetBatchCount, { batchIds }).then(res => {
          if (res.success) {
            this.facetObj = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      }

    }
  },
  methods: {
    customRow(record, index) {
      let style = {}
      if (record.batchId === this.signBatchId) {
        style.backgroundColor = '#E6F7FF'
      }
      return ({
        style
      })
    },
    edit(record) {
      console.log('this.$refs', this.$refs)
      handleEdit(record)
    },
    viewProgress(batchId) {
      this.progressBatchId = batchId
      this.$nextTick(() => {
        this.$refs.progressModal.query()
      })
    },
    colRender(t, r, index, title) {
      return<div>
        <div class="col-title">{title}</div>
        <div class="m-t-10">{t}</div>
      </div>
    },
    handleExec(batchId) {
      this.loading = true
      postAction(this.$suncare_v3 + '/apiTask/taskProjectBatch/execBatch', { batchId }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleReExec(batchId, ruleTypes) {
      this.loading = true
      postAction(this.$suncare_v3 + '/apiTask/taskProjectBatch/execReRun', { batchId, ruleTypes }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleReExecConfirm(batchId, ruleTypes) {
      let options = [
        { value: '全部规则', code: 'ALL' },
        { value: '失败规则', code: 'FAIL' }
      ]
      this.$refs.selectModal.loadData(options, 'value', item => {
        if (item) {
          if (item.code === 'ALL') {
            this.handleExec(batchId)
          } else if (item.code === 'FAIL') {
            this.handleReExec(batchId, ruleTypes)
          }
        }
      }, { title: '请选择重跑项' })
    },
    changeAutoRerunStatus(batchId, autoRerun) {
      this.loading = true
      putAction(this.url.edit, { batchId, autoRerun }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
          this.loading = false
        }
      })
    },
    gotoStepPage(cur, step, batchId, record) {
      /*if (cur < parseInt(step)) {
        return
      }*/
      if (step === '0') {
        this.handleEdit(record)
      } else if (step === '1') {
        this.gotoPath('/review/reviewSystemList', { batchId })
      } else if (step === '2') {
        this.gotoPath('/review/reviewList', { batchId })
      } else if (step === '3') {
        this.gotoPath('/review/reviewSecondList', { batchId })
      } else if (step === '4') {
        this.gotoPath('/review/reviewCustomList', { batchId })
      }
    },
    gotoPath(path, query) {
      this.$util.setCache('projectExpands', [this.projectId])
      this.$util.setCache(this.signBatchCacheKey, query.batchId)
      this.$router.push({ path, query })
    },
    /* handleDelete(id){
       this.handleDeleteAsync(id).then(()=>{
         this.$emit('delete')
       })
     }*/
    //ai辅助判定
    handleAiAudit(batchId){
      //获取库中批次信息最新状态
      getAction(this.url.queryById, {id:batchId}).then(res => {
        if(res.success){
          let record = res.result
          this.aiAuditFun(batchId,record)
        }else{
          this.$message.warning(res.message);
        }
      })
    },
    aiAuditFun(batchId,record){
      if(record.workflowState=='running'){
        this.$message.warning('后台正在进行ai辅助判定,请稍后操作')
        return
      }
      if(record.step1Status&&record.step1Status.indexOf('running') > -1){
        this.$message.warning('正在进行批次运算,请稍后')
        return
      }
      if(record.step1Status&&record.step1Status.indexOf('wait') > -1){
        this.$message.warning('正在等待进行批次运算,请稍后')
        return
      }
      const that = this
      this.$confirm({
        title: '确认AI辅助判定',
        content: '是否确定进行AI辅助判定吗?',
        onOk: function() {
          that.loading = true
          postAction(that.url.aiAudit, { batchId}).then(res => {
            if (res.success) {
              that.$message.success('操作成功，开始执行AI辅助判定！')
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.loading = false
          })
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.col-title {
  font-size: 14px;
  font-weight: bold;
  margin-top: -10px;
}

.ant-steps-item-process {
  cursor: pointer;
}

.step-text {
  transform: translateX(-50%);
  margin-left: 40px;
  min-width: 100px;
  white-space: nowrap;

  .desc {
    font-size: 12px;
    color: #b9c1d6;
  }
}

</style>
<style>
.ant-steps-small .ant-steps-item-custom .ant-steps-item-icon {
  height: 24px;
}
</style>
