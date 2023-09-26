<template>
  <a-drawer
    title="任务批次进度"
    :width="1200"
    placement="right"
    :closable="false"
    @close="close"
    :destroyOnClose="true"
    :visible="visible">
    <a-spin :spinning="confirmLoading" class="p-b-50">
      <a-card :bodyStyle="{ paddingBottom: '10px',paddingTop: '10px'}" class="m-b-6">
        <a-row :gutter="8" style="font-size: 15px;">
          <a-col :xs="8">
            <span style="font-weight: bold">项目名称</span>：{{project.projectName}}
          </a-col>
          <a-col :xs="8">
            <span style="font-weight: bold">任务批次</span>：{{projectBatch.batchName}}
          </a-col>
          <a-col :xs="8">
            <span style="font-weight: bold">风控月份</span>：{{projectBatch.month}}
          </a-col>
        </a-row>
      </a-card>
    <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">
                    <a-col :md="6" :sm="8" v-if="engineList.length>1">
                      <a-form-item label="引擎类型">
                        <a-select v-model="queryParam.itemType" @change="handleEngine">
                          <a-select-option v-for="(item, index) in engineList" :key="index" :value="item.ITEM_TYPE">{{item.ITEM_TYPE_NAME}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="项目名称">
                            <j-input placeholder="请输入(模糊查询)" v-model="queryParam.itemName"></j-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                        <a-form-item label="状态">
                          <a-select v-model="queryParam.status" default-value="">
                            <a-select-option value="">--全部--</a-select-option>
                            <a-select-option value="normal">正常</a-select-option>
                            <a-select-option value="abnormal">异常</a-select-option>
                            <a-select-option value="running">运行中</a-select-option>
                            <a-select-option value="wait">等待</a-select-option>
                          </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8" v-if="ruleLimitList.length>1">
                      <a-form-item label="规则类型">
                        <a-select v-model="queryParam.ruleLimit" default-value="">
                          <a-select-option value="">--全部--</a-select-option>
                          <a-select-option v-for="(item, index) in ruleLimitList" :key="index" :value="item.RULE_LIMIT">{{item.RULE_LIMIT_NAME}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8" v-if="toggleSearchStatus && actionList.length>1">
                      <a-form-item label="不合规行为">
                        <a-select v-model="queryParam.actionId" default-value="">
                          <a-select-option value="">--全部--</a-select-option>
                          <a-select-option v-for="(item, index) in actionList" :key="index" :value="item.ACTION_ID">{{item.ACTION_NAME}}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="8">
                      <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                        <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                        <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
                        <a @click="handleToggleSearch" class="m-l-6">
                        {{ toggleSearchStatus ? '收起' : '展开' }}
                        <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                        </a>
                      </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <a-button v-if="selectedRowKeys.length > 0" @click="handleReRunBatch" type="primary" icon="redo">批量重跑</a-button>
        </div>

        <!-- table区域-begin -->
        <div>
            <!--  <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
                <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
                <a style="margin-left: 24px" @click="onClearSelected">清空</a>
              </div>-->
            <a-table
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="logId"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="ipagination"
                    :loading="loading"
                    :scroll="{x:true}"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    v-bind="tableAttrs"
                    @change="handleTableChange">

          <span slot="itemName" slot-scope="text,record">
            <a class="pointer" @click="itemDetail(record)" v-if="record.itemType=='NEWDRUG'||record.itemType=='NEWCHARGE'||record.itemType=='NEWTREAT'||record.itemType=='DRUGUSE'||record.itemType=='DRUGREPEAT'">
            {{text}}
            </a>
            <span v-else>{{text}}</span>
          </span>
         <span slot="action" slot-scope="text, record" v-if="record.status=='abnormal'||record.status=='normal'">
           <a-popconfirm title="确定重跑吗?" @confirm="() => handleReRun(record)">
               <a>重跑</a>
           </a-popconfirm>
        </span>

            </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <groupby-modal ref="groupbyModal"></groupby-modal>
        <!--<medical-drug-rule2-modal ref="drugModalForm" @ok="modalFormOk"></medical-drug-rule2-modal>-->
        <component :is="detailComponent" ref="detailRef"></component>
    </a-card>
    </a-spin>
    <div class="drawer-bottom">
      <a-button @click="handleCancel">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { postAction, putAction, getAction } from '@/api-sv3/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import GroupbyModal from '@/pages/task/plugin/GroupbyModal'
  import moment from 'moment'
  const MedicalDrugRuleModal = () => import('@/pages/case/modules/MedicalDrugRuleModal')
  const MedicalChargeRuleModal = () => import('@/pages/case/modules/MedicalChargeRuleModal')
  const MedicalTreatRuleModal = () => import('@/pages/case/modules/MedicalTreatRuleModal')
  const MedicalDruguseRule2Modal = () => import('@/pages/case/modules/MedicalDruguseRule2Modal')
  const MedicalChargeRule2Modal = () => import('@/pages/case/modules/MedicalChargeRule2Modal')
  const MedicalTreatRule2Modal = () => import('@/pages/case/modules/MedicalTreatRule2Modal')
  const MedicalDrugRule2Modal = () => import('@/pages/case/modules/MedicalDrugRule2Modal')
  const MedicalYbDrugModal = () => import('@/pages/config/modules/MedicalYbDrugModal')

  export default {
    name: "TaskBatchBreakRuleLogModal",
    mixins: [JeecgListMixin],
    components: {
      MDictSelectTag,
      GroupbyModal,
      MedicalDrugRuleModal,
      MedicalChargeRuleModal,
      MedicalTreatRuleModal,
      MedicalDruguseRule2Modal,
      MedicalChargeRule2Modal,
      MedicalTreatRule2Modal,
      MedicalDrugRule2Modal,
      MedicalYbDrugModal
    },
    props: ['progressBatchId'],
    data() {
      return {
        visible: false,
        queryParam:{itemType:"",status:"",ruleLimit:"",actionId:""},
        ruleLimitList:[],
        actionList:[],
        engineList:[],
        projectBatch: {},
        project: {},
        description: '批次任务运行日志',
        initLoad: false,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function(t, r, index) {
              return parseInt(index) + 1;
            },
            fixed: 'left'
          },
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'itemName',
            scopedSlots: { customRender: 'itemName' },
            fixed: 'left'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            width: 60,
            fixed: 'left',
            customRender: (text, row, index) => {
              if(text==='normal') {
                return <span style="color: green">正常</span>
              } else if(text==='abnormal') {
                return <span style="color:orange">异常</span>
              } else if(text==='running') {
                return <span style="color:deepskyblue">运行中</span>
              } else if(text==='wait') {
                return <span style="color:grey">等待</span>
              }
              return text
            }
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime',
            customRender: (text, row, index) => {
              return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            }
          },
          {
            title: '开始时间',
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '结束时间',
            align: "center",
            dataIndex: 'endTime'
          },
          {
            title: '异常信息',
            width: 150,
            align: "left",
            dataIndex: 'message',
          },
          {
            title: '规则类型',
            align: "center",
            dataIndex: 'ruleLimit',
          },
          {
            title: '不合规行为编码',
            align: "center",
            dataIndex: 'actionId',
          },
          {
            title: '不合规行为名称',
            align: "center",
            dataIndex: 'actionName',
          },
          {
            title: '规则来源',
            align: "center",
            dataIndex: 'ruleSource',
          },
          {
            title: '政策依据',
            align: "left",
            dataIndex: 'ruleBasis',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 60,
            align: "center",
            scopedSlots: { customRender: 'action' },
            fixed: 'right'
          }
        ],
        url: {
          list: "/task/taskBatchBreakRuleLog/logList"
        },
        fixedParam: {
          batchId: ''
        },
        batchId: ''
      }
    },
    beforeMount() {

    },
    computed: {
      detailComponent() {
        let itemType = this.queryParam.itemType;
        if(itemType=="NEWDRUG") {
          return 'MedicalDrugRule2Modal';
        } else if(itemType=="NEWCHARGE") {
          return 'MedicalChargeRule2Modal';
        } else if(itemType=="NEWTREAT") {
          return 'MedicalTreatRule2Modal';
        } else if(itemType=="DRUGUSE") {
          return 'MedicalDruguseRule2Modal';
        } else if(itemType=="DRUGREPEAT") {
          return 'MedicalYbDrugModal';
        }/* else if(itemType=="drug") {
          return 'MedicalDrugRuleModal';
        } else if(itemType=='charge') {
          return 'MedicalChargeRuleModal';
        } else if(itemType=='treat') {
          return 'MedicalTreatRuleModal';
        }*/
        return null;
      }
    },
    methods: {
      query() {
        this.visible = true;
        this.batchId = this.progressBatchId
        this.fixedParam.batchId = this.progressBatchId;
        this.$nextTick(() => {
          this.asyncLoadData()
        })
      },
      async asyncLoadData() {
        this.confirmLoading = true
        postAction("/task/taskBatchBreakRuleLog/logInit",{ batchId: this.batchId }).then(res => {
          if (res.success) {
            this.project = res.result.project;
            this.projectBatch = res.result.batch;
            this.engineList = res.result.engineList;
            if(this.engineList.length>0) {
              this.queryParam.itemType = this.engineList[0].ITEM_TYPE;
            }
            this.initActionData();
            this.loadData(1)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      initActionData() {
        postAction("/task/taskBatchBreakRuleLog/logInit/action",{ batchId: this.batchId, itemType: this.queryParam.itemType }).then(res => {
          if (res.success) {
            this.ruleLimitList = res.result.ruleLimitList;
            this.actionList = res.result.actionList;
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {

        })
      },
      handleEngine() {
        postAction("/task/taskBatchBreakRuleLog/logInit/action",{ batchId: this.batchId, itemType: this.queryParam.itemType }).then(res => {
          if (res.success) {
            this.ruleLimitList = res.result.ruleLimitList;
            this.actionList = res.result.actionList;
            this.loadData(1);
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {

        })
      },
      handleReRun(item) {
        this.loading = true
        let that = this
        postAction(that.$suncare_v3 + "/apiTask/taskProjectBatch/execDrug",{ batchId: item.batchId, ruleType: item.itemType.toUpperCase(), itemCode: item.itemId}).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData(1)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
      handleReRunBatch() {
        let items = [];
        for (let i = 0; i < this.selectionRows.length; i++) {
          let item = this.selectionRows[i];
          if(item.status=='running'||item.status=='wait') {
            this.$message.warning('选中的记录中包含等待或者正在运行的规则！')
            return
          }
          items.push({ batchId: item.batchId, itemType: item.itemType.toUpperCase(), itemId: item.itemId});
        }
        let that = this
        this.$confirm({
          title: '确认重跑',
          content: '确认重跑选中的数据?',
          onOk: function() {
            //console.log(items);
            that.loading = true
            postAction(that.$suncare_v3 + "/apiTask/taskProjectBatch/batchExecDrug",{ dataJson: JSON.stringify(items)}).then(res => {
              if (res.success) {
                that.$message.success(res.message);
                that.onClearSelected()
                that.loadData(1)
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false
            })
          }
        })
      },
      searchReset() {
        this.queryParam = {status:"",ruleLimit:"",actionId:""};
        if(this.engineList.length>0) {
          this.queryParam.itemType = this.engineList[0].ITEM_TYPE;
        }
        this.initActionData();
        this.loadData(1);
      },
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      itemDetail(record) {
        this.$refs.detailRef.detail(record.itemId)
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
