<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.projectName"></j-input>
            </a-form-item>
          </a-col>
          <!--<template v-if="toggleSearchStatus">-->
          <a-col :md="6" :sm="8">
            <a-form-item label="项目开始时间">
              <j-date placeholder="请选择" v-model="queryParam.startTime"></j-date>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="8">
             <a-form-item label="项目结束时间">
               <j-date placeholder="请选择" v-model="queryParam.endTime"></j-date>
             </a-form-item>
           </a-col>-->
          <!--</template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <!--  <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增项目</a-button>
      <a-button @click="$refs.statisticModal.show()" type="primary" icon="profile">项目批次审核统计</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('任务项目')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
    <!--  <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
         <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
         selectedRowKeys.length }}</a>项
         <a style="margin-left: 24px" @click="onClearSelected">清空</a>
       </div>-->

      <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
      <a-table
        ref="table"
        size="middle"
        :bordered="false"
        rowKey="projectId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 1000 }"
        :expandedRowKeys="expandedRowKeys"
        @expand="expandRow"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <template slot="expandedRowRender" slot-scope="record,index">
          <task-project-batch-list :key="expandVers[index]"
                                   :projectId="record.projectId"></task-project-batch-list>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="importMedicalUnreasonableAction(record)">特殊批次</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.projectId)">
                  <a>删除</a>
                </a-popconfirm>
          <a-divider type="vertical"/>
          <a @click="handleBatchAdd(record.projectId)">创建批次</a>

          <!-- <a-dropdown>
             <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
             <a-menu slot="overlay">
               <a-menu-item>
                 <a @click="handleBatchAdd(record.projectId)">新增批次</a>
               </a-menu-item>
               &lt;!&ndash;不存在批次可删除&ndash;&gt;
               <a-menu-item>
                 <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.projectId)">
                   <a>删除</a>
                 </a-popconfirm>
               </a-menu-item>
             </a-menu>
           </a-dropdown>-->
        </span>

        <span slot="progress" slot-scope="text, record">
          <a-progress :percent="text" size="small" status="active"/>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <taskProject-modal ref="modalForm" @ok="modalFormOk"></taskProject-modal>
    <task-project-batch-modal ref="batchModalForm" @ok="batchModalFormOk"></task-project-batch-modal>
    <!--批量新增 批量修改-->
    <import-modal ref="importModel" @ok="batchModalFormOk"></import-modal>
    <statistic-modal ref="statisticModal"></statistic-modal>
  </a-card>
</template>

<script>
  import TaskProjectModal from './modules/TaskProjectModal'
  import TaskProjectBatchModal from './modules/TaskProjectBatchModal'
  import TaskProjectBatchList from './TaskProjectBatchList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ImportModal from './ImportMedicalUnreasonableActionModal' //批量导入modal

  import JDate from '@/components/jeecg/JDate'
  import StatisticModal from '@/pages/task/plugin/StatisticModal'

  export default {
    name: "TaskProjectList",
    mixins: [JeecgListMixin],
    components: {
      TaskProjectModal,
      TaskProjectBatchModal,
      TaskProjectBatchList,
      JDate,
      ImportModal,
      StatisticModal
    },
    data() {
      return {
        description: '任务项目管理页面',
        // 表头
        columns: [
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'projectName'
          },
          {
            title: '客户',
            align: "center",
            // width:180,
            dataIndex: 'customer'
          },
          {
            title: '负责人',
            align: "center",
            dataIndex: 'createUserName'
          },
          {
            title: '开始时间',
            align: "center",
            dataIndex: 'startTime'
          },
          /* {
             title: '结束时间',
             align: "center",
             dataIndex: 'endTime'
           },
           {
             title: '进度',
             align: "center",
             dataIndex: 'schedule',
             width: 180,
             scopedSlots: { customRender: 'progress' },

           },
           {
             title: '项目地',
             align: "center",
             dataIndex: 'projectSite'
           },
           {
             title: '备注',
             align: "center",
             dataIndex: 'remark'
           },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 300,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/task/taskProject/list",
          delete: "/task/taskProject/delete",
          deleteBatch: "/task/taskProject/deleteBatch",
          exportXlsUrl: "task/taskProject/exportXls",
          importExcelUrl: "task/taskProject/importExcel",
          importMedicalUnreasonableActionUrl:this.$suncare_v3 +"/apiTask/taskProjectBatch/importMedicalUnreasonableAction",
        },
        expandedRowKeys: [],
        expandVers: []
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      },
      importMedicalUnreasonableActionUrl: function(){
        return `${this.$config['domianURL']}/${this.url.importMedicalUnreasonableActionUrl}`;
      }

    },
    watch: {
      dataSource(array) {
        this.expandVers = new Array(array.length).fill(1)
      }
    },
    methods: {
      handleBatchAdd(projectId) {
        this.$refs.batchModalForm.add(projectId);
        this.$refs.batchModalForm.title = "新增批次";
        this.$refs.batchModalForm.disableSubmit = false;
      },
      batchModalFormOk(projectId) {
        let index = this.dataSource.findIndex(item => item.projectId === projectId)
        this.expandVers.splice(index, 1, this.expandVers[index] + 1)
      },
      /*deleteBatch(index){
        this.expandVers[index] += 1
        this.expandVers = [...this.expandVers]
      },*/
      expandRow(expanded, record) {
        if (expanded) {
          this.expandedRowKeys.push(record.projectId)
          let index = this.dataSource.findIndex(r => r === record)
          console.log('index',index)
          this.expandVers.splice(index, 1, this.expandVers[index] + 1)
        } else {
          this.expandedRowKeys.splice(this.expandedRowKeys.indexOf(record.projectId), 1)
        }
      },
      //批量导入
      importMedicalUnreasonableAction(record){
        let param = {title:'特殊批次',importUrl:this.url.importMedicalUnreasonableActionUrl,uploadFileName:'MedicalUnreasonableAction_import.xlsx',param:{projectId:record.projectId}}
        this.$refs.importModel.loadData(param);
      },

    },
    beforeMount() {
      this.$util.getCacheAsync('projectExpands').then(data => {
        this.expandedRowKeys = data || []
      })
    },
  }
</script>
<style lang="less" scoped>

</style>
