<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="规则类别">
              <m-dict-select-tag :dictCode="ruleLimitDictCode" v-model="queryParam.ruleLimit" search></m-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="项目名称">
              <j-input placeholder="模糊查询" v-model="queryParam.itemNames"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="项目编码">
              <j-input placeholder="模糊查询" v-model="queryParam.itemCodes"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="状态">
                <m-dict-select-tag placeholder="请选择状态" dictCode="SWITCH_STATUS"
                                   v-model="queryParam.status"/>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="政策依据">
                <j-input placeholder="模糊查询" v-model="queryParam.ruleBasis"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="适用时间(开始)">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.startTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.startTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="适用时间(结束)">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.endTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.endTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="所属地区">
                <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="提示信息">
                <j-input placeholder="请输入提示信息模糊查询" v-model="queryParam.message"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="修改时间">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.updateTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.updateTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="修改人">
                <j-input placeholder="模糊查询" v-model="queryParam.updateUsername"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="创建时间">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.createTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.createTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="创建人">
                <j-input placeholder="模糊查询" v-model="queryParam.createUsername"></j-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="试算状态">
                <m-dict-select-tag placeholder="请选择" dictCode="RUN_STATUS"
                                   v-model="queryParam.trailStatus"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="规则级别">
                <a-select placeholder="请选择规则级别" v-model="queryParam.ruleGrade" :allowClear="true">
                  <a-select-option value="1级">1级</a-select-option>
                  <a-select-option value="2级">2级</a-select-option>
                  <a-select-option value="3级">3级</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="6">
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
      <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasAdd">新增</a-button>
      <a-button @click="update()"  type="primary" icon="edit" v-if="hasAdd">修改</a-button>
      <a-button type="primary" icon="import" @click="handleImportExcel()" v-if="hasImport">导入</a-button>
      <a-button type="primary" icon="download" @click="handleExportExcel(`合理诊疗配置`)" v-if="hasExport">导出</a-button>
      <a-button type="primary" icon="download" @click="handleExportFile(`合理诊疗失效明细${moment().format('YYYYMMDDHHmmss')}.xlsx`,undefined, url.exportInvalidXls)" v-if="hasExport">导出失效明细</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel" v-if="hasDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
          <a-menu-item key="2" @click="changeStatusBatch(statusDict.normal)">
            <a-icon type="check"/>
            启用
          </a-menu-item>
          <a-menu-item key="3" @click="changeStatusBatch(statusDict.stop)">
            <a-icon type="close"/>
            禁用
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="ruleId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll="{ x: scrollX}"
        @change="handleTableChange"
        v-bind="tableAttrs">
         <span slot="status" slot-scope="text, record, index">
                  <a-switch checked-children="开" un-checked-children="关" :checked="record.status === 'normal'"
                            :loading="record.statusLoading" @click="changeStatus(index)"/>
                </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
<!--<template v-if="hasDel">
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
               &lt;!&ndash;<a-menu-item>
                <a @click="$refs.trailModal.show(record.ruleId)">试算</a>
              </a-menu-item>&ndash;&gt;
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.ruleId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
</template>-->
        </span>
        <!-- 字符串超长截取省略号显示 -->
        <span slot="message" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>
        <span slot="trailStatus" slot-scope="text, record">
          {{filterDictText(runStatusDict,text)}}
          <a class="block" @click="gotoDrugView(record.ruleId)" v-if="text === 'normal'">(查看)</a>
          <span class="block" @click="gotoDrugView(record.ruleId)" v-else-if="text === 'abnormal'">
            (<j-ellipsis :value="record.msg" :length="5"/>)
          </span>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <trail-drug-modal ref="trailModal" ruleType="CHARGE" @ok="modalFormOk"></trail-drug-modal>

    <!-- 表单区域 -->
    <medical-treat-rule2-modal ref="modalForm" @ok="modalFormOk"></medical-treat-rule2-modal>

    <!--导入-->
    <import-modal ref="importModel" @ok="modalFormOk" tip="请注意：文件的 “标签页” 名称为 “规则类型”  名称"></import-modal>
  </a-card>
</template>

<script>
  import MedicalTreatRule2Modal from './modules/MedicalTreatRule2Modal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MedicalRuleConfigMixin from '@/pages/case/MedicalRuleConfigMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import moment from "moment"
  import ImportModal from '@/components/ImportModal'
  import TrailDrugModal from '@/pages/case/plugin/TrailDrugModal'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'
  import { getAction } from '@/api/manage'

  export default {
    name: "MedicalDrugRule2List",
    mixins: [JeecgListMixin, MedicalRuleConfigMixin],
    components: {
      MedicalTreatRule2Modal,
      JEllipsis,
      ImportModal,
      TrailDrugModal,
      MDictSelectTag,
    },
    data() {
      return {
        description: '合理用药规则管理页面',
        // 表头
        columns: [
          {
            title: '规则类别',
            align: "center",
            dataIndex: 'ruleLimit',
            customRender: t => this.ruleLimitMap[t] || t,
            width: 180,
          },
          {
            title: '不合规行为',
            align: "center",
            dataIndex: 'actionName',
            width: 200,
          },
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'itemNames',
            width: 200,
          },
         /* {
            title: '项目编码',
            align: "center",
            dataIndex: 'itemCodes',
            width: 200,
          },*/
         // 所属地区】【政策依据】【适用时间】【提示信息
          {
            title: '所属地区',
            align: "center",
            dataIndex: 'ruleSource',
            width: 80,
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 350,
            // scopedSlots: { customRender: 'message' },
          },
          {
            title: '政策依据',
            align: "center",
            dataIndex: 'ruleBasis',
            width: 350,
            // scopedSlots: { customRender: 'message' },
          },
          {
            title: '适用时间',
            align: "center",
            dataIndex: 'startTime',
            width: 120,
            customRender: (text, record, index) => {
              return record.startTime + ' ~ ' + record.endTime;
            },
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '修改人',
            align: "center",
            dataIndex: 'updateUsername',
            width: 120,
          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'updateTime',
            width: 120
          },
          {
            title: '操作原因',
            align: "center",
            dataIndex: 'updateReason',
            width: 120,
            ellipsis:true,
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername',
            width: 120,
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime',
            width: 120
          },
         /* {
            title: '试算状态',
            dataIndex: 'trailStatus',
            align: "center",
            fixed: 'right',
            width: 80,
            scopedSlots: { customRender: 'trailStatus' },
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: 'right',
            width: 100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/medical/medicalRuleConfig/list",
          delete: "/medical/medicalRuleConfig/delete",
          deleteBatch: "/medical/medicalRuleConfig/deleteBatch",
          exportXlsUrl: "/medical/medicalRuleConfig/exportXls",
          importExcelUrl: "/medical/medicalRuleConfig/importExcel?ruleType=TREAT",
          trailStatusList: "/medical/medicalRuleConfig/trailStatusList",
          exportInvalidXls: "/medical/medicalRuleConfig/exportInvalidXls",

        },
        /* 排序参数 */
        isorter: {
          column: 'updateTime,ruleLimit,itemCodes',
          order: 'desc,asc,asc',
        },
        fixedParam: { ruleType: 'TREAT' },
        runStatusDict: [],
        ruleLimitMap: {},
        timer: undefined,
        ruleLimitDictCode: 'RULE_LIMIT_TREAT'
      }
    },
    beforeMount() {
      this.$util.initDict(['RUN_STATUS', this.ruleLimitDictCode]).then(data => {
        this.runStatusDict = data['RUN_STATUS']
        this.ruleLimitMap = data[this.ruleLimitDictCode].reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
      })
    },
    props: {
      fixedParam1: Object,
      groupCode:String,
      initLoad:{
        type: Boolean,
        default: true
      }
    },
    watch: {
      dataSource(data) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        // this.loadTrailStatus()
      },
      groupCode: {
        immediate: true,
        handler(val) {
          if(val){
            this.fixedParam = Object.assign(this.fixedParam, this.fixedParam1)
            this.searchQuery()
          }
        }
      },
    },
    methods: {
      moment,
      filterDictText,
      loadTrailStatus() {
        let thisData = this.dataSource
        let runObj = {}
        for (let item of thisData) {
          if (item.trailStatus === 'running' || item.trailStatus === 'wait') {
            runObj[item.ruleId] = item.trailStatus
          }
        }
        this.timer = setInterval(() => {
          let runIds = Object.keys(runObj)
          if (runIds.length === 0) {
            clearInterval(this.timer)
            this.timer = undefined
            return
          }
          getAction(this.url.trailStatusList, { ruleIds: runIds.join(',') }).then(res => {
            if (res.success) {
              // 页面刷新过则丢弃
              if (thisData !== this.dataSource) {
                console.log('页面刷新过则丢弃')
                return
              }
              let changeCount = 0
              for (let item of res.result) {
                let oldStatus = runObj[item.batchId]
                if (oldStatus !== item.status) {
                  let record = thisData.find(record => item.batchId === record.ruleId)
                  if (record) {
                    changeCount++
                    record.trailStatus = item.status
                  }
                  if (item.status !== 'running' && item.status !== 'wait') {
                    delete runObj[item.batchId]
                  }

                }
              }
              if (changeCount > 0) {
                this.dataSource = thisData = [...thisData]
              }
            } else {
              this.$message.warning(res.message);
            }
          })
        }, 5000)

      },
      //导出
      handleExportExcel(name) {
        this.handleExportFile(name + moment().format('YYYYMMDDHHmmss')+'.xlsx')
      },
      //导入
      handleImportExcel() {
        let param = {
          title: '合理诊疗规则导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: 'MEDICAL_TREAT_RULE2.xlsx'
        }
        this.$refs.importModel.loadData(param);
      },
      gotoDrugView(ruleId) {
        this.$router.push({ path: '/review/reviewSystemCommonView', query: { ruleId, ruleType: 'TREAT2' } })
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
