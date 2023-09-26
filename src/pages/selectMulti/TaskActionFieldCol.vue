<template>
  <div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="表名">
              <m-dict-select-tag placeholder="请选择表名" dictCode="DATA"
                                 v-model="queryParam.tableName" showKey search
                                 :loaded="data => {data.unshift({code: 'MEDICAL_UNREASONABLE_ACTION',value: '规则引擎结果表'}); return data}"
              ></m-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="字段名">
              <j-input placeholder="请输入字段名" v-model="queryParam.colName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="字段中文名">
              <j-input placeholder="请输入字段中文名" v-model="queryParam.colCnname"></j-input>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="8">
               <a-form-item label="适用平台">
                   <m-dict-select-tag placeholder="请选择适用平台" dictCode="ACTION_FIELD_PALTFORM"
                                      v-model="queryParam.platform"/>
               </a-form-item>
           </a-col>-->
          <template v-if="toggleSearchStatus">

            <a-col :md="6" :sm="8">
              <a-form-item label="是否DWS字段">
                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                   v-model="queryParam.dwsCol"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否默认字段">
                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                   v-model="queryParam.defSelect"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否默认查询条件">
                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                   v-model="queryParam.defSearch"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否配置查询条件">
                <m-dict-select-tag placeholder="请选择" dictCode="YESNO"
                                   v-model="queryParam.toSearch"/>
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
        rowKey="colId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        v-bind="tableAttrs"
        @change="handleTableChange">


      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

  export default {
    name: 'TaskActionFieldColList',
    mixins: [JeecgListMixin, multiSelectIdMatchMixin],
    components: { MDictSelectTag },
    props: {
      param: {
        type: Object
      }
    },
    data() {
      return {
        description: '不合规行为表字段信息配置管理页面',
        // 表头
        columns: [
          {
            title: '表名',
            align: 'center',
            dataIndex: 'tableName'
          },
          {
            title: '字段名',
            align: 'center',
            dataIndex: 'colName'
          },
          {
            title: '字段中文名',
            align: 'center',
            dataIndex: 'colCnname'
          },
          /*{
            title: '适用平台',
            align: "center",
            dataIndex: 'platform_dictText'
          },*/
          {
            title: '字段含义',
            align: 'center',
            dataIndex: 'colDesc',
            customRender: t => <j-ellipsis value={t} length={10}/>
          },
          {
            title: '默认字段',
            align: 'center',
            dataIndex: 'defSelect_dictText'
          }, {
            title: '查询条件',
            align: 'center',
            dataIndex: 'toSearch_dictText'
          }
        ],
        url: {
          list: '/task/taskActionFieldCol/list'
        },
        fixedParam: {
          status: 'normal'
        },
        id: 'colId',
        name: 'colCnname',
        code: 'colName'
      }
    },
    watch: {
      param: {
        immediate: true,
        handler(val) {
          if (val) {
            Object.assign(this.fixedParam, val)
          }

        }
      }
    },
    methods: {}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
