<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xs="8">
            <a-form-item :label="searchName">
              <j-input :placeholder="`请输入${searchName}模糊查询`" v-model="queryParam.targetName"></j-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="6" :sm="8">
            <a-form-item label="不合规行为23ID">
              <a-input placeholder="请输入不合规行为23ID" v-model="queryParam.ba23Id"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="不合规行为23病例数">
                <a-input placeholder="请输入不合规行为23病例数" v-model="queryParam.ba23CaseNum"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="不合规行为23涉及金额">
                <a-input placeholder="请输入不合规行为23涉及金额" v-model="queryParam.ba23CasePay"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="不合规行为24ID">
                <a-input placeholder="请输入不合规行为24ID" v-model="queryParam.ba24Id"></a-input>
              </a-form-item>
            </a-col>
          </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div>
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-button type="primary" icon="download" @click="handleExportXls('不合规行为结果')" style="float: left">导出</a-button>
      <div class="table-page-search-wrapper" style=";padding-left: 100px">
        <a-form layout="inline">
          <a-form-item label="请选择您关注的不合规行为">
            <a-select mode="tags" style="width: 100%" v-model="actionColSelected" @change="colSelectChange">
              <a-select-option v-for="col in actionCols" :key="col.key">
                {{col.title}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
    </div>
    <slot name="tabs"></slot>
    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->


      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX }"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

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
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { listBreakBehaviorForCol } from '@/api-sv3/api'


  const typeObj = {
    '2': {
      infos: [{
        name: '身份证号码',
        field: 'idNo'
      }, {
        name: '参保类型',
        field: 'insurancetype'
      }],
      name: '参保人姓名'
    },
    '3': {
      infos: [{
        name: '身份证号码',
        field: 'idNo'
      }, {
        name: '医疗机构',
        field: 'orgname'
      }],
      name: '医生姓名'
    },
    '5': {
      infos: [],
      name: '医疗机构名称'
    }
  }

  export default {
    name: "MedicalBreakBehaviorResultList",
    mixins: [JeecgListMixin],
    props: {
      batchId: String,
      type: String
    },
    components: {},
    data() {
      return {
        description: '不合规行为结果管理页面',
        // 表头
        columns: [{
          title: '',
          dataIndex: 'targetName',
          align: "center",
          width: 120,
        }],
        actionColSelected: [],
        commonCols: [],
        actionCols: [],
        /*{
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: { customRender: 'action' },
        }*/
        url: {
          list: "/action/medicalBreakBehaviorResult/list",
          delete: "/action/medicalBreakBehaviorResult/delete",
          deleteBatch: "/action/medicalBreakBehaviorResult/deleteBatch",
          exportXlsUrl: "action/medicalBreakBehaviorResult/exportXls",
          importExcelUrl: "action/medicalBreakBehaviorResult/importExcel",
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30','50','100'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        initLoad: false,
        searchName: ''
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    watch: {
      type: {
        immediate: true,
        handler(val) {
          this.searchName = this.columns[0].title = typeObj[val].name
          this.fixedParam.targetType = this.type
          this.fixedParam.batchId = this.batchId
          this.loadBreakActions()
          this.loadData(1)
        }
      }
    },
    beforeMount() {
    },
    methods: {
      loadBreakActions() {
        listBreakBehaviorForCol({ batchId: this.batchId, type: this.type }).then(res => {
          if (res.success) {
            let cols = res.result
            this.commonCols = [this.columns[0]]
            typeObj[this.type].infos.forEach(info => {
              this.commonCols.push({
                title: info.name,
                dataIndex: info.field,
                align: "center",
                width: 120,
              })
            })
            let index = 1
            this.actionCols = []
            for (let col of cols) {
              this.actionCols.push({
                key: col.id,
                title: col.actionName,
                width: 240,
                children: [
                  {
                    title: '病例数量（个）',
                    dataIndex: `ba${index}CaseNum`,
                    align: "center",
                    width: 120,
                  },
                  {
                    title: '涉及金额（元）',
                    dataIndex: `ba${index}CasePay`,
                    align: "center",
                    width: 120,
                  },
                ],
              })
              index++
            }
            this.colSelectChange(this.actionColSelected = [])
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      colSelectChange(keys) {
        let cols = keys.length === 0 ? this.actionCols : this.actionCols.filter(col => keys.indexOf(col.key) >= 0)
        this.columns = [...this.commonCols, ...cols]

      }
    },

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
