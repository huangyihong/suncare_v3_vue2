<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8" v-if="!tableName">
            <a-form-item label="归属表名">
              <m-dict-select-tag placeholder="请选择表名" dictCode="DATA"
                                 v-model="queryParam.tabName" showKey search></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="字段名">
              <j-input placeholder="请输入字段名模糊查询" v-model="queryParam.colName"></j-input>
            </a-form-item>
          </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="字段类型">
                <m-dict-select-tag placeholder="请选择字段类型" dictCode="COL_TYPE"
                                   v-model="queryParam.colType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="输入方式">
                <m-dict-select-tag placeholder="请选择输入方式" dictCode="WHERE_INPUT_TYPE"
                                   v-model="queryParam.whereInputType" ></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="字段中文名">
                <j-input placeholder="请输入字段中文名模糊查询" v-model="queryParam.colChnName"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="字段分类">
                <a-select placeholder="请选择字段分类" v-model="queryParam.colValueType">

                  <template v-for="item in colValueTypeDict">
                    <a-select-option  :value="item">{{item}}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8" >
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
    <!-- table区域-begin -->
    <div>
      <template v-if="selectType === 'checkbox'">
        <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                      v-on="selectActionOn"></selected-tag>
      </template>
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
        @change="handleTableChange"
        v-bind="tableAttrs">

        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <medicalColConfig-modal ref="modalForm" @ok="modalFormOk"></medicalColConfig-modal>

  </a-card>
</template>

<script>
  import MedicalColConfigModal from '@/pages/config/modules/MedicalColConfigModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"


  export default {
    name: "MedicalColConfigList",
    mixins:[JeecgListMixin, multiSelectMixin],
    props: {
      tableName: String
    },
    components: {
      MedicalColConfigModal,MDictSelectTag
    },
    data () {
      return {
        description: '表字段配置管理页面',
        // 表头
        columns: [
          {
            title: '归属表名',
            align:"center",
            dataIndex: 'tabName'
          },
          {
            title: '字段名',
            align:"center",
            dataIndex: 'colName'
          },
          {
            title: '字段中文名',
            align:"center",
            dataIndex: 'colChnName'
          },
          {
            title: '字段详细描述',
            align:"center",
            dataIndex: 'colDesc'
          },
          {
            title: '字段类型',
            align:"center",
            dataIndex: 'colType_dictText'
          },
          {
            title: '字段分类',
            align:"center",
            dataIndex: 'colValueType'
          },
          {
            title: '下拉字典项',
            align:"center",
            dataIndex: 'selectType'
          },
          {
            title: '序号',
            align:"center",
            dataIndex: 'colOrder'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/config/medicalColConfig/list",
          delete: "/config/medicalColConfig/delete",
          deleteBatch: "/config/medicalColConfig/deleteBatch",
          exportXlsUrl: "config/medicalColConfig/exportXls",
          importExcelUrl: "/config/medicalColConfig/importExcel",
          exportExcel: "/config/medicalColConfig/exportExcel",
        },
        /* 排序参数 */
        isorter:{
          column: 'tabName,colOrder,colName',
          order: 'asc,asc,asc',
        },
        id: 'id',
        code: 'colName',
        name: 'colChnName',
      }
    },
    beforeMount() {

    },
    methods: {

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
