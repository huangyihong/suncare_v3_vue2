<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item label="收费项目">
              <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.chargeItems"></j-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="提示信息">
              <j-input placeholder="请输入提示信息模糊查询" v-model="queryParam.message"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="8" :xs="12">
            <a-form-item label="试算状态">
              <m-dict-select-tag placeholder="请选择" dictCode="RUN_STATUS"
                                 v-model="queryParam.trailStatus"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="规则来源">
                <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE" class="loginList-select"
                                       v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
                <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :xs="12">
              <a-form-item label="限定范围">
                <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE"
                                       v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
                <m-multi-select-tag dictCode="LIMIT_SCOPE" v-model="queryParam.mLimitScope" :maxTagCount="2" :loaded="limitLoaded"></m-multi-select-tag>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="handleCopyAdd" type="primary" icon="copy">复制新增</a-button>
      <a-button type="primary" icon="import" @click="handleImportExcel()">导入</a-button>
      <a-button type="primary" icon="download" @click="handleExportExcel(`收费合规规则`)">导出</a-button>
      <a-button type="primary" icon="download" @click="handleExportLoseExcel(`药品合规规则编码失效明细`)">失效明细导出</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('药品合规规则')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
               <a-menu-item>
                <a @click="$refs.trailModal.show(record.ruleId)">试算</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.ruleId)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- 字符串超长截取省略号显示 -->
        <span slot="message" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>
        <span slot="codes" slot-scope="text">
          <j-ellipsis :value="text" :length="22"/>
        </span>
        <span slot="names" slot-scope="text">
          <j-ellipsis :value="text" :length="13"/>
        </span>
        <span slot="limitScope" slot-scope="text">
          <!--<j-ellipsis :value="toLimitScopeShow(text)" :length="14"/>-->
          <j-ellipsis :value="text" :length="14"/>
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

    <trail-drug-modal ref="trailModal" ruleType="2" @ok="modalFormOk"></trail-drug-modal>

    <!-- 表单区域 -->
    <medical-charge-rule-modal ref="modalForm" @ok="modalFormOk"></medical-charge-rule-modal>

    <!--导入-->
    <import-modal ref="importModel" @ok="modalFormOk"></import-modal>
  </a-card>
</template>

<script>
  import MedicalChargeRuleModal from './modules/MedicalChargeRuleModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import moment from "moment"
  import ImportModal from '@/components/ImportModal'
  import TrailDrugModal from '@/pages/case/plugin/TrailDrugModal'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  // import MDictSelectTagOP from "@/components/dict_medical/MDictSelectTagOP"
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'
  import { getAction } from '@/api/manage'
  import {chargeLimitScope} from "@//pages/case/DrugRuleCommon"

  /*
    const periodDict= {
      '1': '1次就诊',
      '2': '1日',
      '3': '1周',
      '4': '1月',
      '5': '1年',
      '6': '日均次',
      '8': '国家规定供暖期以外',
      '9': '国家规定暑期以外'
    }
    const limitDict = {
      '01': '年龄',
      '02': '性别',
      '03': '就医方式',
      '04': '参保类型',
      '05': '医院级别',
      '06': '科室',
      '07': '疗程用药剂量',
      '08': '年度用药剂量',
      '09': '治疗项目',
      '10': '治疗方式',
      '11': '重复用药',
      '12': '二线用药',
      '13': '适用症',
    }*/

  export default {
    name: "MedicalDrugRuleList",
    mixins: [JeecgListMixin],
    components: {
      MedicalChargeRuleModal,
      JEllipsis,
      ImportModal,
      TrailDrugModal,
      MDictSelectTag,
      MMultiSelectTag,
      // MDictSelectTagOP,
    },
    data() {
      return {
        description: '收费合规规则管理页面',
        // 表头
        columns: [
          {
            title: '收费项目',
            align: "center",
            dataIndex: 'chargeItems',
            width: 200,
            fixed: true,
            scopedSlots: { customRender: 'names' }
          }, {
            title: '收费分类',
            align: "center",
            dataIndex: 'chargeTypes_dictText',
            width: 200,
            scopedSlots: { customRender: 'names' }
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 250,
            scopedSlots: { customRender: 'message' }
          },
          {
            title: '规则来源',
            align: "center",
            dataIndex: 'ruleSource',
            width: 120
          },
          {
            title: '频率',
            align: "center",
            dataIndex: 'frequency',
            width: 120,
            customRender: (t, r, i) => {
              //字典值替换通用方法
              return `${r.compare || ''} ${r.frequency || ''}次`
            },
          }, {
            title: '就诊周期',
            align: "center",
            dataIndex: 'period_dictText',
            width: 250,
//            customRender: (text) => {
//              //字典值替换通用方法
//              return text?periodDict[text.toString()]:''
//            },
          },
          {
            title: '限定范围',
            align: "center",
            dataIndex: 'limitScope_dictText',
            width: 200,
            // scopedSlots: { customRender: 'limitScope' }
          },
          {
            title: '年龄',
            align: "center",
            dataIndex: 'age_dictText',
            width: 80
          },
          {
            title: '性别',
            align: "center",
            dataIndex: 'sex_dictText',
            width: 80
          },
          {
            title: '就医方式',
            align: "center",
            dataIndex: 'jzlx_dictText',
            width: 120
          },
          {
            title: '参保类型',
            align: "center",
            dataIndex: 'yblx_dictText',
            width: 120
          },
          {
            title: '试算状态',
            dataIndex: 'trailStatus',
            align: "center",
            fixed: 'right',
            width: 80,
            scopedSlots: { customRender: 'trailStatus' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: 'right',
            width: 150,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/medical/medicalDrugRule/list",
          delete: "/medical/medicalDrugRule/delete",
          deleteBatch: "/medical/medicalDrugRule/deleteBatch",
          exportXlsUrl: "/medical/medicalDrugRule/exportXls",
          exportExcelByThread: "/medical/medicalDrugRule/exportXlsThread",
          importExcelUrl: "/medical/medicalDrugRule/importExcel?ruleType=2",
          trailStatusList: "/medical/medicalDrugRule/trailStatusList",
          exportExcelLoseByThread: "/medical/medicalDrugRule/exportRuleLoseThread",
        },
        /* 排序参数 */
        isorter: {
          column: 'chargeItems',
          order: 'asc',
        },
        fixedParam: { ruleType: '2' },
        limitDict: {},
        runStatusDict: [],
        timer: undefined
      }
    },
    beforeMount() {
      /*  this.$util.initDict('LIMIT_SCOPE').then(data =>{
          for(let item of data){
            this.limitDict[item.code] = item.value
          }

        })*/
      this.$util.initDict('RUN_STATUS').then(data => {
        this.runStatusDict = data
      })
    },
    watch: {
      dataSource(data) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.loadTrailStatus()
      }
    },
    methods: {
      filterDictText,
      limitLoaded(data){
        let limitSet = new Set(chargeLimitScope.map(item => item.code))
        return data.filter(r => limitSet.has(r.code))
      },
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
        if(this.ipagination.total === 0){
          this.$message.warn('没有需要导出的数据')
          return
        }
        let totalCount = this.ipagination.total;
        if (totalCount < 100||(this.selectedRowKeys && this.selectedRowKeys.length > 0)) {
          this.handleExportFile(name + moment().format('YYYYMMDDHHmmss')+'.xlsx')
          return;
        }
        this.handleExportXlsAsync()

      },
      //导出
      handleExportLoseExcel(name) {
        if(this.ipagination.total === 0){
          this.$message.warn('没有需要导出的数据')
          return
        }
        this.handleExportXlsAsync(this.url.exportExcelLoseByThread)

      },
      //导入
      handleImportExcel() {
        let param = {
          title: '收费合规规则导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: 'MEDICAL_CHARGE_RULE.xls'
        }
        this.$refs.importModel.loadData(param);
      },
      gotoDrugView(ruleId) {
        this.$router.push({ path: '/review/reviewSystemCommonView', query: { ruleId, ruleType: 'CHARGE' } })
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
