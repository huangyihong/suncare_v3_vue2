<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="收费项目A关键字">
              <j-input placeholder="请输入收费项目A关键字模糊查询" v-model="queryParam.itemname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="收费项目B关键字">
              <j-input placeholder="请输入收费项目B关键字模糊查询" v-model="queryParam.itemname1"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="审核状态">
              <m-dict-select-tag placeholder="请选择审核状态" dictCode="EXAMINE_STATUS"
                                 v-model="queryParam.examineStatus"></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目A编码">
                <j-input placeholder="请输入收费项目A编码" v-model="queryParam.itemCode1"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目A名称">
                <j-input placeholder="请输入收费项目A名称" v-model="queryParam.packageItem1"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目B编码">
                <j-input placeholder="请输入收费项目B编码" v-model="queryParam.itemCode2"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目B名称">
                <j-input placeholder="请输入收费项目B名称" v-model="queryParam.packageItem2"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="整理人">
                <j-input placeholder="请输入整理人" v-model="queryParam.sorter"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目名称类型">
                <m-dict-select-tag placeholder="请选择收费项目名称类型" dictCode="ITEM_TYPE"
                                   v-model="queryParam.itemType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="重复收费类型">
                <m-dict-select-tag placeholder="请选择重复收费类型" dictCode="ITEM1_TYPE"
                                   v-model="queryParam.item1Type"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目B违规判断">
                <m-dict-select-tag placeholder="请选择收费项目B违规判断" dictCode="ITEM1_WGTYPE"
                                   v-model="queryParam.item1Wgtype"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="超量检查的类型">
                <m-dict-select-tag placeholder="请选择超量检查的类型目" dictCode="QTY_TYPE"
                                   v-model="queryParam.qtyType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="超量的数值(不含)）">
                <a-input placeholder="超量的数值(不含)" v-model="queryParam.qtyNum"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否输出同一天的手术项目">
                <m-dict-select-tag placeholder="请选择是否输出同一天的手术项目" dictCode="YESNO"
                                   v-model="queryParam.isSameDay"></m-dict-select-tag>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="importPop" class="btn" type="primary">导入</a-button>
<!--      <a-button @click="getExamine" :disabled="hasExamine" v-has="'keyword:examine'" type="primary" icon="bulb">批量审核-->
<!--      </a-button>-->
      <a-button @click="getExamine"  type="primary" icon="bulb">批量审核
      </a-button>

      <a-button type="primary" @click="handleExportExcel" icon="download" class="m-l-6">导出</a-button>

      <!--      <a-button @click="update()" :disabled="hasSelected" type="primary" icon="edit">修改</a-button>-->
      <a-button @click="batchDel" type="primary" icon="delete">批量删除</a-button>

      <a-dropdown>
        <a-button class="ant-dropdown-link">更多
          <a-icon type="down"/>
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a @click="handleCopyAdd">
              <a-icon type="copy"/>
              复制新增
            </a>
          </a-menu-item>
          <!--          <a-menu-item>-->
          <!--            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
          <!--                      @change="handleImportExcel">-->
          <!--              <a>-->
          <!--                <a-icon type="import" /> 导入-->
          <!--              </a>-->
          <!--            </a-upload>-->
          <!--          </a-menu-item>-->
          <a-menu-item>
            <a icon="download" @click="downloadTemplate">
              <a-icon type="download"/>
              Excel模板下载</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>


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
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
<!--        <a @click="handleEdit(record)" :disabled="!record.isOperation">编辑</a>-->
          <a @click="handleEdit(record)" >编辑</a>
       </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <ybChargeitemChecklist-modal ref="modalForm" @ok="modalFormOk"></ybChargeitemChecklist-modal>

    <!--    导入对话框-->
    <import-excle-model ref="importExcleModel" :text="'关键字导入'" :importExcel="this.url.importExcelUrl"  @ok="refresh"></import-excle-model>

    <!--    批量审核确认框-->
    <confirm-model ref="examineModel" :num="num" @ok="batchExamine"></confirm-model>

  </a-card>
</template>

<script>
import YbChargeitemChecklistModal from './modules/YbChargeitemChecklistModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, deleteAction, getAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import {checklistCols} from '@/pages/ybChargeSearch/mixins/checklistCols'
import ImportExcleModel from './modules/ImportExcleModel'
import ConfirmModel from './modules/ConfirmModel'
import moment from "moment";

export default {
  name: "YbChargeitemChecklistList",
  mixins: [JeecgListMixin],
  components: {
    YbChargeitemChecklistModal,
    MDictSelectTag,
    ImportExcleModel,
    ConfirmModel
  },
  data() {
    return {
      description: '收费明细风控检查内容管理页面',
      examineTitle: "",
      num: 0,
      // 表头
      columns: [
        ...checklistCols,
        {
          title: '审核状态',
          align: "center",
          fixed:"right",
          dataIndex: 'examineStatus_dictText'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: {customRender: 'action'}
        }
      ],
      hasSelected: false,
      hasExamine: false,
      url: {
        list: "/ybChargeSearch/ybChargeitemChecklist/list",
        delete: "/ybChargeSearch/ybChargeitemChecklist/delete",
        deleteBatch: "/ybChargeSearch/ybChargeitemChecklist/deleteBatch",
        exportXlsUrl: "ybChargeSearch/ybChargeitemChecklist/exportXls",
        importExcelUrl: "ybChargeSearch/ybChargeitemChecklist/importExcel",
        batchExamine: "ybChargeSearch/ybChargeitemChecklist/batchExamine"
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  watch: {
    selectionRows: {
      handler(nv) {
        this.hasExamine = false
        this.hasSelected = false
        if (nv.length > 0) {
          //删改控制
          const arr = nv.filter(item => !item.isOperation);
          if (arr.length > 0) {
            this.hasSelected = true
          }

          //审核控制
          const hasPass = nv.filter(item => item.examineStatus == '1');
          if (hasPass.length > 0) {
            this.hasExamine = true
          }
          console.log("hasPass====", hasPass)
        }
        console.log("nv====", nv.length)
      },
      immediate: true,
      deep: true

    }
  },
  methods: {
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      let totalCount = this.ipagination.total;
      this.handleExportXls('检索关键字' + moment().format('YYYYMMDDHHmmss'))
    },
    getExamine() {
      if (this.selectionRows.length < 1) {
        this.$message.error("请选择1条记录!")
      } else {
        this.num = this.selectionRows.length
        this.$refs.examineModel.show();
      }
    },
    batchExamine(val) {
      console.log("examineStatus:",val)
      this.loading=true
      let ids = ''
      for (var a = 0; a < this.selectionRows.length; a++) {
        ids += this.selectionRows[a].id + ','

      }
      getAction(this.url.batchExamine, {ids: ids,examineStatus:val}).then(res => {
        if(res.success){
          this.$message.success("审核成功!");
          this.refresh()
        }else{
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.loading=false
      })


    },
    refresh() {
      this.loadData()
      this.onClearSelected()
    },
    importPop() {
      this.$refs.importExcleModel.show()
    },
    downloadTemplate() {
      window.open(this.$config['domianURL'] + "/sys/common/download/ybChargeitemChecklist.xlsx");
    },
    //修改
    update() {
      if (this.selectionRows.length !== 1) {
        this.$message.error("请选择1条记录!")
      } else {
        let data = this.selectionRows
        this.handleEdit(data[0])
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
          console.log("selectedRowKeys", this.selectedRowKeys[a])
          console.log("selectionRows", this.selectionRows[a])
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
