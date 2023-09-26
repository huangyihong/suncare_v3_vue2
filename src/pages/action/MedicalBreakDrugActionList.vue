<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :xs="8">
            <a-form-item label="规则编码">
              <j-input placeholder="请输入规则编码模糊查询" v-model="queryParam.ruleId"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="8">
            <a-form-item label="规则名称">
              <a-input placeholder="请输入规则名称模糊查询" v-model="queryParam.ruleName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xs="8">
            <a-form-item label="就诊流水号">
              <j-input placeholder="请输入就诊流水号模糊查询" v-model="queryParam.visitid"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :xs="8">
              <a-form-item label="就诊类型">
                <m-dict-select-tag placeholder="请选择就诊类型" dictCode="BM_JZBZ00" valueEqName
                                   v-model="queryParam.visittype"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="项目类别">
                <m-dict-select-tag placeholder="请选择项目类别" dictCode="BM_CFLB00" valueEqName
                                   v-model="queryParam.itemclass"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="项目编码">
                <j-input placeholder="请输入项目编码模糊查询" v-model="queryParam.itemcode"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="项目名称">
                <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.itemname"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="患者编号">
                <j-input placeholder="请输入患者编号模糊查询" v-model="queryParam.clientid"></j-input>
              </a-form-item>
            </a-col>


            <a-col :md="6" :xs="8">
              <a-form-item label="就诊机构名称">
                <j-input placeholder="请输入机构名称模糊查询" v-model="queryParam.orgname"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="就诊机构编码">
                <j-input placeholder="请输入机构编码模糊查询" v-model="queryParam.orgid"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :xs="8">
              <a-form-item label="开单时间">
                <j-date v-model="queryParam.prescripttime_begin" class="search-divider-item"/>
                <div class="search-divider"></div>
                <j-date v-model="queryParam.prescripttime_end" class="search-divider-item"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :xs="8">
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
    <slot name="tabs"></slot>

    <!-- 操作按钮区域 -->
   <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('不合规结果')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
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
    </div>-->

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="onStep">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        :scroll="{ x: scrollX}"
        @change="handleTableChange">
        <template slot="visitid" slot-scope="text, record">
          <a @click="selectKey(record)">{{text}}</a>
        </template>
        <span slot="ellipsis-10" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <!-- 字符串超长截取省略号显示 -->

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <review-detail-model ref="reviewDetailModel" :batchId="batchId" :showPush="false"
                         :pushed="false"></review-detail-model>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import ReviewDetailModel from "@/pages/review/modules/reviewDetailModel.vue"

  export default {
    name: "MedicalBreakDrugActionList",
    mixins: [JeecgListMixin],
    components: { JEllipsis,  MDictSelectTag,ReviewDetailModel,JDate },
    props: {
      ruleType: String,
      batchId: String,
      onStep: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        description: '不合规结果管理页面',
        // 表头
        columns: [
          /* {
                title: '批次ID',
                align:"center",
                dataIndex: 'batchId',
               },*/
          {
            title: '规则编码',
            align: "center",
            dataIndex: 'ruleId',
            width: 120,
            scopedSlots: { customRender: 'ellipsis-10' },
          },
          {
            title: '规则名称',
            align: "center",
            dataIndex: 'ruleName',
            width: 180
          },
          /* {
             title: '规则类型',
             align: "center",
             dataIndex: 'ruleType',
             width: 120
           },*/
          {
            title: '就诊流水号',
            align: "center",
            dataIndex: 'visitid',
            width: 120,
            scopedSlots: { customRender: 'visitid' },
          },
          {
            title: '就诊类型',
            align: "center",
            dataIndex: 'visittype',
            width: 120
          },
          {
            title: '项目编码',
            align: "center",
            dataIndex: 'itemcode',
            width: 120,
            scopedSlots: { customRender: 'ellipsis-10' },
          },
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'itemname',
            width: 180
          },
          {
            title: '项目类别',
            align: "center",
            dataIndex: 'itemclass',
            width: 120
          },
          /*  {
                 title: '项目类别编码',
                 align:"center",
                 dataIndex: 'itemclassid'
                },*/
          /*{
            title: '规格',
            align: "center",
            dataIndex: 'specificaion',
            width: 120
          },
          {
            title: '单位',
            align: "center",
            dataIndex: 'chargeunit',
            width: 120
          },*/
          {
            title: '患者编号',
            align: "center",
            dataIndex: 'clientid',
            width: 120,
            scopedSlots: { customRender: 'ellipsis-10' },
          },
          {
            title: '就诊机构编码',
            align: "center",
            dataIndex: 'orgid',
            width: 120,
            scopedSlots: { customRender: 'ellipsis-10' },
          },
          {
            title: '就诊机构名称',
            align: "center",
            dataIndex: 'orgname',
            width: 180
          }, {
            title: '处方日期',
            align: "center",
            dataIndex: 'prescripttime',
            width: 120
          },
          /*{
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
            width: 120
          }*/
        ],
        url: {
          list: "/action/medicalBreakDrugAction/list",
          delete: "/action/medicalBreakDrugAction/delete",
          deleteBatch: "/action/medicalBreakDrugAction/deleteBatch",
          exportXlsUrl: "action/medicalBreakDrugAction/exportXls",
          importExcelUrl: "action/medicalBreakDrugAction/importExcel",
        },
        fixedParam: {},
        initLoad: false,
        dateSolrBetween: ['','']
      }
    },
    watch: {
      ruleType: {
          immediate: true,
          handler(val) {
            this.fixedParam.ruleType = val
            this.fixedParam.batchId = this.batchId
            this.loadData(1)
          }
        }
    /*  onStep: {
        immediate: true,
        handler(val) {
          let col = {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' },
            width: 120
          }
          if (val) {
            this.columns.push(col)
          } else {
            let index = this.columns.findIndex(item => item.dataIndex === col.dataIndex)
            if (index >= 0) {
              this.columns.splice(index, 1)
            }
          }
        },
      },*/
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    beforeMount() {
      console.log('this.ruleType', this.ruleType)
    },
    methods: {
      //点击就诊编号选中记录
      selectKey(record) {
        // this.$refs.reviewDetailModel.title = '不合规行为详情';
        this.$refs.reviewDetailModel.loadData(record.visitid);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
