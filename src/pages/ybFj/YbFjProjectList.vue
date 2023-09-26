<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <j-input placeholder="请输入项目名称" v-model="queryParam.projectName"></j-input>
            </a-form-item>
          </a-col>
          <!--          <template v-if="toggleSearchStatus">-->
          <!--            <a-col :md="6" :sm="8">-->
          <!--              <a-form-item label="检查小组数量">-->
          <!--                <a-input placeholder="请输入检查小组数量" v-model="queryParam.checkTeamNum"></a-input>-->
          <!--              </a-form-item>-->
          <!--            </a-col>-->
          <!--          </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <!--              <a @click="handleToggleSearch" class="m-l-6">-->
              <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary">新增项目信息</a-button>
      <!--      <a-button type="primary" icon="download" @click="handleExportXls('飞检项目信息')">导出</a-button>-->
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
      <!--                @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--        <a-menu slot="overlay">-->
      <!--          <a-menu-item key="1" @click="batchDel">-->
      <!--            <a-icon type="delete"/>-->
      <!--            删除-->
      <!--          </a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style="margin-left: 8px"> 批量操作-->
      <!--          <a-icon type="down"/>-->
      <!--        </a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        @change="handleTableChange">
        <span slot="checkStartdate" slot-scope="text, record">
          {{ dateFormat(record.checkStartdate, 'YYYY年MM月DD日') }}<span v-if="record.checkStartdate && record.checkEnddate">至</span>{{ dateFormat(record.checkEnddate, 'YYYY年MM月DD日') }}
        </span>
        <span slot="orgNum" slot-scope="text, record">
          {{record.codes.length}}
        </span>

        <span slot="action" slot-scope="text, record">
           <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"/>
           <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
             <a>删除</a>
           </a-popconfirm>
          <!--          <a-dropdown>-->
          <!--            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>-->
          <!--            <a-menu slot="overlay">-->
          <!--              <a-menu-item>-->
          <!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
          <!--                  <a>删除</a>-->
          <!--                </a-popconfirm>-->
          <!--              </a-menu-item>-->
          <!--            </a-menu>-->
          <!--          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <ybFjProject-modal ref="modalForm" @ok="modalFormOk"></ybFjProject-modal>
  </a-card>
</template>

<script>
import YbFjProjectModal from './modules/YbFjProjectModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import moment from 'moment'

export default {
  name: "YbFjProjectList",
  mixins: [JeecgListMixin],
  components: {
    YbFjProjectModal
  },
  data() {
    return {
      description: '飞检项目信息管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '项目名称',
          align: "center",
          dataIndex: 'projectName',
          width: '200px'
        },
        {
          title: '调查开始日期',
          align: "center",
          dataIndex: 'surveyStartdate',
          width: '120px'
        },
        {
          title: '检查时间范围',
          align: "center",
          dataIndex: 'checkStartdate',
          width: '250px',
          scopedSlots: {customRender: 'checkStartdate'},

        },
        {
          title: '医疗机构数量',
          align: "center",
          dataIndex: 'orgNum',
          width: '120px',
          scopedSlots: {customRender: 'orgNum'},
        },
        {
          title: '检查小组数量',
          align: "center",
          dataIndex: 'checkTeamNum',
          width: '120px'
        },
        {
          title: '项目信息更新时间',
          align: "center",
          dataIndex: 'updateTime',
          width: '200px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          width: '200px',
          scopedSlots: {customRender: 'action'},
        }
      ],
      url: {
        list: "/ybFj/ybFjProject/list",
        delete: "/ybFj/ybFjProject/delete",
        deleteBatch: "/ybFj/ybFjProject/deleteBatch",
        exportXlsUrl: "ybFj/ybFjProject/exportXls",
        importExcelUrl: "ybFj/ybFjProject/importExcel",
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    dateFormat(date, format) {
      if(date){
        return moment(date).format(format)
      }else{
        return ''
      }

    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
