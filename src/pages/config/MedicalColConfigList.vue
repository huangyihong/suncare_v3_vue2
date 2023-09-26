<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="editDictItem" type="primary">字段业务分类配置</a-button>
      <a-button type="primary"  icon="import" @click="handleImportExcel()">导入</a-button>
      <a-button type="primary"  icon="download" @click="handleExportExcel()">导出</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>

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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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
    <medicalColConfig-modal ref="modalForm" @ok="modalFormOk"></medicalColConfig-modal>

    <!-- 字段业务分类配置表单区域 -->
    <medical-drug-rule-group-modal ref="groupModalForm"></medical-drug-rule-group-modal>

    <!--导入-->
    <import-modal ref="importModel" @ok="modalFormOk"></import-modal>
  </a-card>
</template>

<script>
  import MedicalColConfigModal from './modules/MedicalColConfigModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { getAction } from '@/api/manage'
  import MedicalDrugRuleGroupModal from './modules/MedicalFieldTypeModal'

  import ImportModal from '@/components/ImportModal'

  export default {
    name: "MedicalColConfigList",
    mixins:[JeecgListMixin],
    components: {
      MedicalColConfigModal,MDictSelectTag,MedicalDrugRuleGroupModal,ImportModal
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
        colValueTypeDict: [],//字段分类的医疗字典数据
        colValueTypeDictTypes:['RULE_COL_VALUE_TYPE_WHERE','RULE_COL_VALUE_TYPE_HAVING'],
        dictRecord:{},//RULE_COL_VALUE_TYPE_WHERE字典对象数据
      }
    },
    beforeMount() {
      this.initDictConfig()
      this.initMedicalDictList();
    },
    methods: {
      //初始医疗字典数据
      initMedicalDictList(){
        this.$util.initDict(this.colValueTypeDictTypes).then(data => {
          let arr = [];
          for (let key of this.colValueTypeDictTypes) {
            for(let item of data[key]){
              arr.push(item.code)
            }
          }
          this.colValueTypeDict = Array.from(new Set(arr));

        }).finally(() => {
          this.confirmLoading = false
        })

      },
      initDictConfig() {
      },
      //编辑RULE_COL_VALUE_TYPE_WHERE字典项  字段业务分类配置
      editDictItem(){
        this.$refs.groupModalForm.title = '字段业务分类配置';
        this.$refs.groupModalForm.edit('RULE_COL_VALUE_TYPE_WHERE');
      },
      //导入
      handleImportExcel(){
        let param = {title:'数仓库表字段导入',importUrl:this.url.importExcelUrl,actionType:'update',uploadFileName:'MEDICAL_COL_CONFIG.xls'}
        this.$refs.importModel.loadData(param);
      },
      //导出
      handleExportExcel() {
        const that = this;
        let params = Object.assign({}, this.getQueryParams());
       /* delete params.column
        delete params.order*/
        let url = that.$config['domianURL'] + that.url.exportExcel+'?1=1';
        for(let key in params){
          url +='&'+key+'='+params[key];
        }
        window.open(url);
        return;
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
