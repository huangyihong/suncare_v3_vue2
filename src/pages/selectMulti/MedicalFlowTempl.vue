<template>
  <div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :lg="6" :xs="8">
            <a-form-item label="节点编码">
              <j-input placeholder="请输入节点编码模糊查询" v-model="queryParam.nodeCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :xs="8">
            <a-form-item label="节点名称">
              <j-input placeholder="请输入节点名称模糊查询" v-model="queryParam.nodeName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :xs="8">
            <a-form-item label="分类">
              <m-dict-select-tag placeholder="选择节点分类" dictCode="FLOW_TEMPL_KIND"
                                 v-model="queryParam.nodeKind"></m-dict-select-tag>
            </a-form-item>
          </a-col>

          <a-col :lg="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
              <a @click="$util.openTab('/probe/flowTempl')" class="m-l-6">
                去配置
              </a>
             <!--
              <a @click="handleToggleSearch" class="m-l-6">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
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
        rowKey="nodeId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <template slot="nodeName" slot-scope="text, record">
          <a @click="detail(record)">{{text}}</a>
        </template>
       <span slot="action" slot-scope="text, record">
         <a-radio-group v-model="record.type" defaultValue="rect">
          <a-radio value="rect">计算</a-radio>
          <a-radio value="diam">条件</a-radio>
        </a-radio-group>
       </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <medical-flow-templ-modal ref="modalForm" @ok="modalFormOk"></medical-flow-templ-modal>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import RouteView from '../../components/layouts/RouteView'
  import MedicalFlowTemplModal from '@/pages/probe/flow/modules/MedicalFlowTemplModal'

  export default {
    name: "MedicalFlowTemplList",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin, MedicalFlowTemplModal],
    props: ['nodeTypeSelect'],
    components: {
      MedicalFlowTemplModal,
      RouteView,
      MDictSelectTag
    },
    data() {
      return {
        description: '节点模板管理页面',
        // 表头
        columns: [
          {
            title: '节点编码',
            align: "left",
            width: 100,
            dataIndex: 'nodeCode'
          },
          {
            title: '节点名称',
            align: "left",
            dataIndex: 'nodeName',
            width: 180,
            scopedSlots: { customRender: 'nodeName' },
          },
          {
            title: '分类',
            align: "center",
            width: 100,
            dataIndex: 'nodeKind_dictText'
          },
          {
            title: '更新时间',
            align: "center",
            width: 120,
            dataIndex: 'updateTime'
          },
          {
            title: '创建时间',
            align: "center",
            width: 120,
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
            align: "center",
            width: 100,
            dataIndex: 'createUsername'
          },
        ],
        url: {
          list: "/probe/medicalFlowTempl/list",
        },
        id: 'nodeId',
        code: 'nodeCode',
        name: 'nodeName',
        isorter:{
          column: 'updateTime,createTime,nodeCode',
          order: 'desc,desc,asc',
        },

      }
    },
    watch:{
      nodeTypeSelect:{
        immediate:true,
        handler(val) {
          if(val){
            this.columns.push({
              title: '选择节点类型',
              dataIndex: 'action',
              align: "center",
              width: 180,
              scopedSlots: { customRender: 'action' },
            })
          } else {
            let index = this.columns.findIndex(r => r.dataIndex === 'action')
            if(index > -1){
              this.columns.splice(index, 1)
            }

          }

        },
      },
    },
    methods: {
      detail(record){
        this.$refs.modalForm.detail(record);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
