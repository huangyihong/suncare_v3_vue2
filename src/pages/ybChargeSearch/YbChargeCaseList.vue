<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="违规项目">
              <j-input placeholder="请输入违规项目" v-model="queryParam.wgItemName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目关键词">
              <j-input placeholder="请输入项目关键词" v-model="queryParam.itemname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="整理人">
              <j-input placeholder="请输入整理人" v-model="queryParam.sorter"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="违规类型">
                <j-input placeholder="请输入违规类型" v-model="queryParam.wgType"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="项目编码（国家码）">
                <j-input placeholder="请输入项目编码（国家码）" v-model="queryParam.itemCode"></j-input>
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
<!--      <a-button @click="getExamine"  v-has="'case:examine'" type="primary" icon="bulb">批量审核-->
<!--      </a-button>-->
      <a-button @click="batchDel" :disabled="hasSelected" type="primary" icon="delete">批量删除</a-button>

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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" :disabled="!record.isOperation">编辑</a>
       </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <ybChargeCase-modal ref="modalForm" @ok="modalFormOk"></ybChargeCase-modal>
    <!--    导入对话框-->
    <import-excle-model ref="importExcleModel" :text="'违规案例导入'" :importExcel="this.url.importExcelUrl"
                        @ok="refresh" @repeat="repeat"></import-excle-model>

    <!--    批量审核确认框-->
    <confirm-model ref="examineModel" :num="num" @ok="batchExamine"></confirm-model>

    <!--    导入重复确认-->
    <yb-charge-case-repeat-modal ref="repeatRef" ></yb-charge-case-repeat-modal>
  </a-card>
</template>

<script>
import YbChargeCaseModal from './modules/YbChargeCaseModal'
import YbChargeCaseRepeatModal from './modules/YbChargeCaseRepeatModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, deleteAction, getAction} from '@/api/manage'
import ImportExcleModel from './modules/ImportExcleModel'
import ConfirmModel from './modules/ConfirmModel'

export default {
  name: "YbChargeCaseList",
  mixins: [JeecgListMixin],
  components: {
    YbChargeCaseModal,
    ImportExcleModel,
    ConfirmModel,
    YbChargeCaseRepeatModal
  },
  data() {
    return {
      description: '违规案例库管理页面',
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
          title: '违规类型',
          align: "center",
          dataIndex: 'wgType'
        },
        {
          title: '项目编码（国家码）',
          align: "center",
          dataIndex: 'itemCode'
        },
        {
          title: '违规项目',
          align: "center",
          dataIndex: 'wgItemName'
        },
        {
          title: '项目关键词',
          align: "center",
          dataIndex: 'itemname'
        },
        {
          title: '违规描述',
          align: "center",
          dataIndex: 'wgDescription'
        },
        {
          title: '政策依据',
          align: "center",
          dataIndex: 'policyBasis'
        },
        {
          title: '所属地区',
          align: "center",
          dataIndex: 'region'
        },
        {
          title: '所属时间',
          align: "center",
          dataIndex: 'startdate',
          customRender: (text, record, index) => {
            let html = '';
            if(record.startdate){
              html =  record.startdate;
            }
            if(record.startdate || record.enddate) {
              html += '到';
            }
            if(record.enddate){
              html += record.enddate;
            }
            return html
          }
        },
        {
          title: '整理人',
          align: "center",
          dataIndex: 'sorter'
        },
        // {
        //   title: '审核状态',
        //   align: "center",
        //   dataIndex: 'examineStatus_dictText'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: {customRender: 'action'},
        }
      ],
      hasSelected: false,
      hasExamine: false,
      num:0,
      url: {
        list: "/ybChargeSearch/ybChargeCase/list",
        delete: "/ybChargeSearch/ybChargeCase/delete",
        deleteBatch: "/ybChargeSearch/ybChargeCase/deleteBatch",
        exportXlsUrl: "ybChargeSearch/ybChargeCase/exportXls",
        importExcelUrl: "ybChargeSearch/ybChargeCase/importExcel",
        batchExamine: "ybChargeSearch/ybChargeCase/batchExamine"
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

          // //审核控制
          // const hasPass = nv.filter(item => item.examineStatus == '1');
          // if (hasPass.length > 0) {
          //   this.hasExamine = true
          // }
          // console.log("hasPass====", hasPass)
        }
        console.log("nv====", nv.length)
      },
      immediate: true,
      deep: true

    }
  },
  methods: {
    //重复数据
    repeat(dataList){
      this.$refs.repeatRef.show(dataList)
    },
    getExamine() {
      if (this.selectionRows.length < 1) {
        this.$message.error("请选择1条记录!")
      } else {
        this.num = this.selectionRows.length
        this.$refs.examineModel.show();
      }
    },
    batchExamine() {
      this.loading = true
      let ids = ''
      for (var a = 0; a < this.selectionRows.length; a++) {
        ids += this.selectionRows[a].id + ','

      }
      getAction(this.url.batchExamine, {ids: ids}).then(res => {
        if (res.success) {
          this.$message.success("审核成功!");
          this.refresh()
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.loading = false
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
      window.open(this.$config['domianURL'] + "/sys/common/download/WgCaseModel.xlsx");
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
