<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="药品分类">
              <j-input placeholder="请输入药品分类" v-model="queryParam.drugType"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="药品名称">
              <a-input placeholder="请输入药品名称" v-model="queryParam.drugName"></a-input>
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
              <a-form-item label="药品分类(小)">
                <j-input placeholder="请输入药品分类(小)" v-model="queryParam.drugTypeSmall"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="医保类别">
                <j-input placeholder="请输入医保类别" v-model="queryParam.funType"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="剂型">
                <j-input placeholder="请输入剂型" v-model="queryParam.dosageType"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="整理人">
                <j-input placeholder="请输入整理人" v-model="queryParam.sorter"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="备注">
                <j-input placeholder="请输入备注" v-model="queryParam.remark"></j-input>
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
      <a-button @click="getExamine" v-has="'drugCase:examine'"  type="primary" icon="bulb">批量审核
      </a-button>
<!--      <a-button @click="getExamine" type="primary" icon="bulb">批量审核-->
<!--      </a-button>-->

      <a-button type="primary" @click="handleExportExcel" icon="download" class="m-l-6">导出</a-button>

      <a-button @click="batchDel" type="primary" icon="delete">批量删除</a-button>

      <a-dropdown>
        <a-button class="ant-dropdown-link">更多
          <a-icon type="down"/>
        </a-button>
        <a-menu slot="overlay">
<!--          <a-menu-item>-->
<!--            <a @click="handleCopyAdd">-->
<!--              <a-icon type="copy"/>-->
<!--              复制新增-->
<!--            </a>-->
<!--          </a-menu-item>-->
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

<!--          <a-divider type="vertical"/>-->
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
    <ybChargeDrug-modal ref="modalForm" @ok="modalFormOk"></ybChargeDrug-modal>
    <!--    导入对话框-->
    <import-excle-model ref="importExcleModel" :text="'药品案例库导入'" :importExcel="this.url.importExcelUrl"  @ok="refresh"></import-excle-model>

    <!--    批量审核确认框-->
    <confirm-model ref="examineModel" :num="num" @ok="batchExamine"></confirm-model>
  </a-card>
</template>

<script>
import YbChargeDrugModal from './modules/YbChargeDrugModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import moment from "moment";
import {httpAction, deleteAction, getAction} from '@/api/manage'
import ImportExcleModel from './modules/ImportExcleModel'
import ConfirmModel from './modules/ConfirmModel'
export default {
  name: "YbChargeDrugList",
  mixins: [JeecgListMixin],
  components: {
    YbChargeDrugModal,
    MDictSelectTag,
    ImportExcleModel,
    ConfirmModel
  },
  data() {
    return {
      description: '药品案例库管理页面',
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
          title: '药品分类',
          align: "center",
          dataIndex: 'drugType'
        },
        {
          title: '药品分类(小)',
          align: "center",
          dataIndex: 'drugTypeSmall'
        },
        {
          title: '医保类别',
          align: "center",
          dataIndex: 'funType'
        },
        {
          title: '药品名称',
          align: "center",
          dataIndex: 'drugName'
        },
        {
          title: '剂型',
          align: "center",
          dataIndex: 'dosageType'
        },
        {
          title: '备注',
          align: "center",
          dataIndex: 'remark'
        },
        {
          title: '整理人',
          align: "center",
          dataIndex: 'sorter'
        },
        {
          title: '审核状态',
          align: "center",
          fixed:"right",
          dataIndex: 'examineStatus_dictText'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: 'right',
          scopedSlots: {customRender: 'action'},
        }
      ],
      num: 0,
      url: {
        list: "/ybChargeSearch/ybChargeDrug/list",
        delete: "/ybChargeSearch/ybChargeDrug/delete",
        deleteBatch: "/ybChargeSearch/ybChargeDrug/deleteBatch",
        exportXlsUrl: "ybChargeSearch/ybChargeDrug/exportXls",
        importExcelUrl: "ybChargeSearch/ybChargeDrug/importExcel",
        batchExamine: "ybChargeSearch/ybChargeDrug/batchExamine"
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
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
      this.handleExportXls('药品案例库' + moment().format('YYYYMMDDHHmmss'))
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
      window.open(this.$config['domianURL'] + "/sys/common/download/ybDrugCase.xlsx");
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
