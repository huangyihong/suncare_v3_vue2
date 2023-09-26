<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="行动名称">
              <a-input placeholder="请输入行动名称" v-model="queryParam.actionname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="文书字号">
              <a-input placeholder="请输入文书字号" v-model="queryParam.codename"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="问题类别(一级指标)">
                <a-input placeholder="请输入问题类别(一级指标)" v-model="queryParam.cat"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="违规情形描述">
                <a-input placeholder="请输入违规情形描述" v-model="queryParam.wgDesc"></a-input>
              </a-form-item>
            </a-col>
          </template>
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
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--      <a-button type="primary" icon="download" @click="handleExportXls('上会材料主表')">导出</a-button>-->
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button @click="batchDel" type="primary" icon="delete">删除</a-button>
<!--      <a-button type="primary" icon="import" @click="importBtn">导入</a-button>-->
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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="downLoad(record.xzcftzsUrl)">告知书下载</a>
          <a-divider type="vertical"/>
          <a @click="downLoad(record.nclyjbgUrl)">报告下载</a>
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

    <!-- 表单区域 -->
    <ybMeetingMaterials-modal ref="modalForm" @ok="modalFormOk"></ybMeetingMaterials-modal>
  </a-card>
</template>

<script>
import YbMeetingMaterialsModal from './modules/YbMeetingMaterialsModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, deleteAction, getAction} from '@/api/manage'

export default {
  name: "YbMeetingMaterialsList",
  mixins: [JeecgListMixin],
  components: {
    YbMeetingMaterialsModal
  },
  data() {
    return {
      description: '上会材料管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
         },
        {
          title: '医院名称',
          align: "center",
          width: 200,
          dataIndex: 'orgname'
        },
        {
          title: '行动名称',
          align: "center",
          width: 200,
          dataIndex: 'actionname'
        },
        {
          title: '文书字号',
          align: "center",
          width: 200,
          dataIndex: 'codename'
        },
        {
          title: '检查小组',
          align: "center",
          width: 200,
          dataIndex: 'groupTeam'
        },
        {
          title: '调查开始时间',
          align: "center",
          width: 200,
          dataIndex: 'startdate'
        },
        {
          title: '检查时间范围',
          align: "center",
          width: 200,
          dataIndex: 'timerange'
        },
        {
          title: '问题类别(一级指标)',
          align:"center",
          width: 200,
          dataIndex: 'cat'
        },
        {
          title: '违规项目',
          align:"center",
          width: 200,
          dataIndex: 'item'
        },
        {
          title: '违规情形描述',
          align:"center",
          width: 200,
          dataIndex: 'wgDesc'
        },
        {
          title: '违规人次',
          align:"center",
          width: 200,
          dataIndex: 'pax'
        },
        {
          title: '违规医保基金金额（元）',
          align:"center",
          width: 200,
          dataIndex: 'fundAmt'
        },
        {
          title: '罚款倍数',
          align:"center",
          width: 200,
          dataIndex: 'penaltyN'
        },
        {
          title: '罚款金额',
          align:"center",
          width: 200,
          dataIndex: 'penaltyAmt'
        },

        {
          title: '违规第几条',
          align:"center",
          width: 200,
          dataIndex: 'clauseT'
        },
        {
          title: '违规第几款',
          align:"center",
          width: 200,
          dataIndex: 'clauseK'
        },
        {
          title: '行政处罚事先告知书链接',
          align:"center",
          width: 200,
          dataIndex: 'xzcftzsUrl'
        },
        {
          title: '拟处理意见报告链接',
          align:"center",
          width: 200,
          dataIndex: 'nclyjbgUrl'
        },

        {
          title: '创建人名称',
          align: "center",
          width: 200,
          dataIndex: 'createdByName'
        },
        {
          title: '创建时间',
          align: "center",
          width: 200,
          dataIndex: 'createdTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: 'right',
          width: 300,
          scopedSlots: {customRender: 'action'},
        }
      ],
      url: {
        list: "/ybChargeSearch/ybMeetingMaterials/list",
        delete: "/ybChargeSearch/ybMeetingMaterials/delete",
        deleteBatch: "/ybChargeSearch/ybMeetingMaterials/deleteBatch",
        exportXlsUrl: "ybChargeSearch/ybMeetingMaterials/exportXls",
        importExcelUrl: "ybChargeSearch/ybMeetingMaterials/importExcel",
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
    importBtn(){
      this.$refs.importExcel.show()
    },
    downLoad(url){
      if(url !=='' && url !== undefined && url !==null){
        window.open(url)
      }else{
        this.$message.error("下载链接不存在")
      }

    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        let ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectionRows[a].id + ','
        }
        console.log("ids", ids)
        const that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            that.loading = true
            deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.loading = false
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
