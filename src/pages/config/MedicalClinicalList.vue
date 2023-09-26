<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :lg="6" :sm="8">
            <a-form-item label="临床路径编码">
              <j-input placeholder="请输入临床路径编码模糊查询" v-model="queryParam.clinicalCode"></j-input>
            </a-form-item>
          </a-col>

          <a-col :lg="6" :sm="8">
            <a-form-item label="临床路径名称">
              <j-input placeholder="请输入临床路径名称模糊查询" v-model="queryParam.clinicalName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :lg="8" :xs="12">
              <a-form-item label="录入时间">
                <j-date class="search-divider-item" v-model="queryParam.createTime_begin" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" v-model="queryParam.createTime_end" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间"></j-date>
              </a-form-item>
            </a-col>

            <a-col :lg="8" :xs="12">
              <a-form-item label="修改时间">
                <j-date class="search-divider-item" v-model="queryParam.updateTime_begin" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" v-model="queryParam.updateTime_end" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间"></j-date>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" v-if="hasAdd">新增</a-button>
      <a-button @click="update()"  type="primary" icon="edit" v-if="hasAdd">修改</a-button>
      <a-button @click="handleImportExcel" type="primary" icon="import" v-if="hasImport">导入</a-button>
      <a-button type="primary" icon="download" @click="handleExportExcel()" v-if="hasExport">导出</a-button>
      <a-button @click="handleImportFiles" type="primary" icon="import" v-if="hasImport">批量导入附件</a-button>
      <a-button @click="handleImportAccessGroupExcel" type="primary" icon="import" v-if="hasImport">导入条件组</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0 && hasDel">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
          <a-menu-item key="2" @click="changeStatusBatch('1')">
            <a-icon type="check"/>
            启用
          </a-menu-item>
          <a-menu-item key="3" @click="changeStatusBatch('0')">
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
        rowKey="clinicalId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <a slot="clinicalName" slot-scope="text, record" @click="handleDetail(record,'1')">
          {{text}}
        </a>
        <template slot="dataStatus" slot-scope="status">
          <!-- <a-tag v-if="status ==='1'" color="green">有效</a-tag>
           <a-tag v-else-if="status ==='0'" color="volcano">无效</a-tag>-->
          <span v-if="status ==='1'">有效</span>
          <span v-else-if="status ==='0'" style="color: grey">无效</span>
        </template>
        <template slot="publicStatus" slot-scope="status, record, index">
          <!--  <a-tag v-if="status ==='1'" color="blue">发布</a-tag>
            <a-tag v-else-if="status ==='0'" color="volcano">未发布</a-tag>-->
          <!--<span v-if="status ==='1'">发布</span>
          <span v-else-if="status ==='0'" style="color: grey">未发布</span>-->
          <a-switch checked-children="开" un-checked-children="关" :checked="status === '1'"
                    :loading="record.statusLoading" @click="changeStatus(index)"/>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record,'1')">查看</a>
          <!--     <a-tag :color="primaryColor" @click="handleEdit(record,'2')">准入</a-tag>
               <a-tag :color="primaryColor" @click="handleEdit(record,'3')">药品</a-tag>
               <a-tag :color="primaryColor" @click="handleEdit(record,'4')">项目</a-tag>
               <a-tag :color="primaryColor" @click="handleEdit(record,'1','moreInfo')">资料</a-tag>-->
          <!--<template v-if="hasDel">-->
               <!--<a-divider type="vertical"/>-->
          <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.clinicalId)">-->
                  <!--<a>删除</a>-->
                <!--</a-popconfirm>-->
          <!--</template>-->
          <!--<a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medical-clinical-modal ref="modalForm" @ok="modalFormOk"></medical-clinical-modal>
    <!--导入-->
    <import-modal ref="importModel" tip="药品组与项目组中的临床路径编码需存在于第一个sheet页里，会先清空临床路径关联的所有药品组与项目组，已存在的临床路径准入条件不会被清除"
                  @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
    <!--导入-->
    <import-modal ref="importAccessGroupModel" tip="准入和排除分别存在于第一、二sheet页里，会分别清空准入和排除里的临床路径关联的条件组信息
    （如果只导入临床路径的准入条件组，那么不会删除排除条件组）"
    ></import-modal>
    <!--批量导入附件-->
    <import-multi-modal ref="importMultiModel"
                        tip="文件名需要以临床路径编码开头，编码后紧跟下划线。例：A15001_初治菌阳肺结核临床路径（2016年版）.docx（已存在的文件名不会被覆盖）"></import-multi-modal>
  </a-card>
</template>

<script>
  import MedicalClinicalModal from './modules/MedicalClinicalModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { mixin } from '@/utils/mixin'
  import ImportModal from '@/components/ImportModal'
  import ImportMultiModal from '@/components/ImportMultiModal'
  import { getAction } from '@/api/manage'
  import moment from 'moment'
  import JDate from '@/components/jeecg/JDate'
  import {hasPermission} from '@/utils/hasPermission'
  import { putAction } from '@/api-sv3/manage'

  moment.locale('zh-cn')
  export default {
    name: "MedicalClinicalList",
    mixins: [JeecgListMixin, mixin],
    components: {
      MedicalClinicalModal,
      ImportModal,
      ImportMultiModal,
      JDate,
    },
    data() {
      return {
        description: '临床路径主体管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            align: "center",
            dataIndex: 'orderNo'
          },

          {
            title: '临床路径编码',
            align: "center",
            dataIndex: 'clinicalCode'
          },
          {
            title: '临床路径名称',
            align: "center",
            dataIndex: 'clinicalName',
            scopedSlots: { customRender: 'clinicalName' }

          },
          {
            title: '公示年份',
            align: "center",
            dataIndex: 'publicYear'
          },
          {
            title: '录入时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername'
          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '修改人',
            align: "center",
            dataIndex: 'updateUsername'
          },
          {
            title: '修改原因',
            align: "center",
            dataIndex: 'updateReason',
            width: 120,
            ellipsis:true,
          },
          {
            title: '有效性',
            align: "center",
            dataIndex: 'dataStatus',
            scopedSlots: { customRender: 'dataStatus' },
          },
          {
            title: '发布状态',
            align: "center",
            dataIndex: 'publicStatus',
            scopedSlots: { customRender: 'publicStatus' }
          },
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
          list: "/medical/medicalClinical/list",
          delete: "/medical/medicalClinical/deleteClinical",
          deleteBatch: "/medical/medicalClinical/deleteClinicalBatch",
          exportXlsUrl: "/medical/medicalClinical/exportXls",
          exportExcelByThread: "/medical/medicalClinical/exportXlsThread",
          importExcelUrl: "/medical/medicalClinical/importExcel",
          importAccessGroupExcelUrl: "/medical/medicalClinicalAccessGroup/importExcel",
          importFileUrl: "/medical/medicalClinical/importFiles",
          changeStatus: "/medical/medicalClinical/changeStatus",
        },
        /* 排序参数 */
        isorter: {
          column: 'createTime,orderNo',
          order: 'desc,asc',
        },
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      },
      hasAdd(){
        return this.hasPermission('ruleConfig:add')
      },
      hasDel(){
        return this.hasPermission('ruleConfig:del')
      },
      hasExport(){
        return this.hasPermission('ruleConfig:export')
      },
      hasImport(){
        return this.hasPermission('ruleConfig:import')
      }
    },
    methods: {
      hasPermission,
      handleEdit: function(record, tabKey, scrollTo) {
        this.$refs.modalForm.edit(record, tabKey, scrollTo);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleDetail: function(record, tabKey, scrollTo) {
        this.$refs.modalForm.edit(record, tabKey, scrollTo);
        this.$refs.modalForm.title = "详情";
        this.$refs.modalForm.disableSubmit = true;
      },
      changeStatus(index) {
        let record = this.dataSource[index]
        let status = record.publicStatus === '1' ? '0' : '1'
        this.$set(record, 'statusLoading', true)
        putAction(this.url.changeStatus, { ids: record.clinicalId, status }).then((res) => {
          if (res.success) {
            this.$set(record, 'publicStatus', status)
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.$set(record, 'statusLoading', false)
        })

      },
      changeStatusBatch(status){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        }
        this.loading = true
        putAction(this.url.changeStatus, { ids: this.selectedRowKeys.join(','), status }).then((res) => {
          if (res.success) {
            let idSet = new Set(this.selectedRowKeys)
            this.dataSource.forEach(r => idSet.has(r.clinicalId) && (r.publicStatus = status))
            this.dataSource = [...this.dataSource]
            this.onClearSelected()
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
      //导入
      handleImportExcel() {
        let param = {
          title: '临床路径配置导入',
          importUrl: this.url.importExcelUrl,
          actionType: 'add',
          uploadFileName: 'MEDICAL_CLINICAL.xls'
        }
        this.$refs.importModel.loadData(param);
      },
      // 批量导入附件
      handleImportFiles() {
        let param = {
          title: '临床路径配置附件批量导入',
          importUrl: this.url.importFileUrl,
          actionType: 'add',
        }
        this.$refs.importMultiModel.loadData(param);
      },
      //导入
      handleImportAccessGroupExcel() {
        let param = {
          title: '临床路径条件组导入',
          importUrl: this.url.importAccessGroupExcelUrl,
          actionType: 'add',
          uploadFileName: 'MEDICAL_CLINICAL_ACCESS_GROUP.xls'
        }
        this.$refs.importAccessGroupModel.loadData(param);
      },
      //导出
      handleExportExcel() {
        if(this.ipagination.total === 0){
          this.$message.warn('没有需要导出的数据')
          return
        }
        let totalCount = this.ipagination.total;
        if (totalCount < 1000) {
          this.handleExportXls('临床路径配置' + moment().format('YYYYMMDDHHmmss'))
          return;
        }
        this.handleExportXlsAsync()

      },
      //修改
      update(){
        if (this.selectionRows.length !== 1) {
          this.$message.error("请选择1条记录!")
        } else {
          let data = this.selectionRows
          this.handleEdit(data[0],'1')
        }
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
