<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="医疗机构">
              <j-input placeholder="请输入医疗机构名称" v-model="queryParam.orgName"></j-input>
            </a-form-item>
          </a-col>
          <!--                    <template v-if="toggleSearchStatus">-->

          <!--                    </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <!--                            <a @click="handleToggleSearch" class="m-l-6">-->
              <!--                              {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                              <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--                            </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button icon="plus" @click="handleAdd" type="primary">新增</a-button>
      <a-button @click="handleAddUserRole" type="primary" icon="plus" style="margin-top: 16px">授权医院用户</a-button>
      <a-button @click="dataimportGp" type="primary" v-if="!importGpState">同步GP</a-button>
      <a-button disabled type="primary" v-else>同步GP</a-button>
<!--      <a-button type="primary" icon="download" @click="handleExportXls('飞检机构信息')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
<!--                @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="importPop">
            <a-icon type="delete"/>
            批量导入
          </a-menu-item>
          <a-menu-item key="1" @click="getExamine">
            <a-icon type="delete"/>
            批量审核
          </a-menu-item>
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            批量删除
          </a-menu-item>
          <a-menu-item>
            <a icon="download" @click="downloadTemplate">
              <a-icon type="download"/>
              导入模板</a>
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
          <a @click="handleEdit(record)">修改</a>

          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
          </a-popconfirm>
          <!--          &lt;!&ndash;          <a-dropdown>&ndash;&gt;-->
          <!--          &lt;!&ndash;            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>&ndash;&gt;-->
          <!--          &lt;!&ndash;            <a-menu slot="overlay">&ndash;&gt;-->
          <!--          &lt;!&ndash;              <a-menu-item>&ndash;&gt;-->
          <!--          &lt;!&ndash;                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">&ndash;&gt;-->
          <!--          &lt;!&ndash;                  <a>删除</a>&ndash;&gt;-->
          <!--          &lt;!&ndash;                </a-popconfirm>&ndash;&gt;-->
          <!--          &lt;!&ndash;              </a-menu-item>&ndash;&gt;-->
          <!--          &lt;!&ndash;            </a-menu>&ndash;&gt;-->
          <!--          &lt;!&ndash;          </a-dropdown>&ndash;&gt;-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <ybFjOrg-modal ref="modalForm" @ok="modalFormOk"></ybFjOrg-modal>
    <!--    批量审核确认框-->
    <confirm-model ref="examineModel" :num="num" @ok="batchExamine"></confirm-model>
    <!--    导入-->
    <import-excle-model ref="importExcleModel" :text="'医疗机构信息导入'" :importExcel="this.url.importExcelUrl"  @ok="refresh"></import-excle-model>
    <!--  医院用户授权-->
    <Select-User-Modal ref="selectUserModal" @ok="refresh"></Select-User-Modal>
  </a-card>
</template>

<script>
import YbFjOrgModal from './modules/YbFjOrgModal'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import ConfirmModel from './modules/ConfirmModel'
import {getAction,postAction} from '@/api/manage'
import ImportExcleModel from '../ybChargeSearch/modules/ImportExcleModel'
import {mapState} from "vuex";
import SelectUserModal from "./modules/SelectUserModal";
export default {
  name: "YbFjOrgList",
  mixins: [JeecgListMixin],
  components: {
    YbFjOrgModal,
    ConfirmModel,
    ImportExcleModel,
    SelectUserModal
  },
  data() {
    return {
      description: '飞检机构信息管理页面',
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
          title: '医疗机构名称',
          align: "center",
          dataIndex: 'orgName'
        },
        {
          title: '医疗机构性质名称',
          align: "center",
          dataIndex: 'busstype_dictText'
        },
        {
          title: '统一社会信用代码',
          align: "center",
          dataIndex: 'socialCode'
        },
        {
          title: '卫生机构类别',
          align: "center",
          dataIndex: 'orgtype_dictText'
        },

        {
          title: '医疗机构级别',
          align: "center",
          dataIndex: 'hosplevel_dictText'
        },

        {
          title: '医疗机构等级',
          align: "center",
          dataIndex: 'hospgrade_dictText'
        },
        {
          title: '所有制形式',
          align: "center",
          dataIndex: 'ownershipCode_dictText'
        },
        {
          title: '医保负责人姓名',
          align: "center",
          dataIndex: 'responsible'
        },
        {
          title: '负责人联系方式',
          align: "center",
          dataIndex: 'responsiblePhone'
        },
        {
          title: '床位数',
          align: "center",
          dataIndex: 'bedAmount'
        },

        {
          title: '审核结果',
          align: "center",
          dataIndex: 'auditState_dictText'
        },


        {
          title: '操作人姓名',
          align: "center",
          dataIndex: 'updateUsername'
        },
        {
          title: '操作时间',
          align: "center",
          dataIndex: 'updateTime'
        },


        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: 'right',
          scopedSlots: {customRender: 'action'},
        }
      ],
      url: {
        list: "/fj/org/list",
        delete: "/fj/org/delete",
        deleteBatch: "/fj/org/deleteBatch",
        exportXlsUrl: "/fj/org/exportXls",
        importExcelUrl: "/fj/org/importExcel",
        batchExamine: "/fj/org/batchExamine",
        dataImportGp:"/fj/org/dataImportGp"
      },
      num:0
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    },
    ...mapState({
      importGpState: state => state.app.orgImportGp
    })
  },
  watch:{
    importGpState(val){
      console.log(val)
    }
  },
  methods: {
    handleAddUserRole() {
      if (this.selectionRows.length !== 1) {
        this.$message.error("请选择1家医院!")
      } else {
        this.$refs.selectUserModal.show(this.selectionRows)
      }
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
      this.loading=true
      let ids = ''
      for (var a = 0; a < this.selectionRows.length; a++) {
        ids += this.selectionRows[a].id + ','

      }
      getAction (this.url.batchExamine, {ids: ids,examineStatus:val}).then(res => {
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
    downloadTemplate() {
      window.open(this.$config['domianURL'] + "/sys/common/download/orgTemplate.xlsx");
    },
    importPop() {
      this.$refs.importExcleModel.show()
    },
    dataimportGp(){
      this.$store.commit('ORG_IMPORT_GP',true)
      getAction(this.url.dataImportGp, {}).then(res => {
        if (res.success) {
          this.$message.success(res.result)
        }else{
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.$store.commit('ORG_IMPORT_GP',false)
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less'
</style>
