<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="分组编码">
              <j-input placeholder="请输入分组编码模糊查询" v-model="queryParam.groupType"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="分组名称">
              <j-input placeholder="请输入分组名称模糊查询" v-model="queryParam.groupName"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="字典项代码">
              <j-input placeholder="请输入字典项代码模糊查询" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>

            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="字典项名称">
                <j-input placeholder="请输入字典项名称模糊查询" v-model="queryParam.value"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="8" :sm="12">
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
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectData.length}}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :bordered="false"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{x:scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <medical-drug-rule-group-del-list :groupId="record.id" :selected="selectData" @selectChange="selectChange(record.id, $event)" slot="expandedRowRender" slot-scope="record"></medical-drug-rule-group-del-list>
      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import MedicalDrugRuleGroupDelList from './tableItem/MedicalDrugRuleGroupDelList'

  export default {
    name: "MedicalDrugList",
    extends: JeecgListMixin,
    components: {
      MedicalDrugRuleGroupDelList
    },
    props:{
      kind:String,
      selected: Array
    },
    data() {
      return {
        description: '药品信息管理页面',
        // 表头
        columns: [
          {
            title: '分组编码',
            align: "center",
            dataIndex: 'groupType',
            width: '30%'
          },
          {
            title: '分组名称',
            align: "center",
            dataIndex: 'groupName',
            width: '30%'
          },
          {
            title: '字典类型',
            align: "center",
            dataIndex: 'kind_dictText',
            width:120
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark'
          },

        ],
        url: {
          list: "/medical/medicalDrugRuleGroup/list",
        },
        toggleSearchStatus: false,
        visible:false,
        selectData: []
      }
    },
    watch: {
      kind(val){
        if(val && val.length > 0){
          this.queryParam.kind = val
        }
      },
      selected:{
        immediate: true,
        handler(array) {
          this.selectData = array.map(item => {return {code:item.code, value: item.name}})
        }
      }
    },
    methods: {
      selectChange(parentId, {selected, initSelected}){
        this.selectData = this.selectData.filter(item => initSelected.indexOf(item.code) === -1)
        this.selectData.push(...selected)
        // console.log('selectData',this.selectData)
      },
      onClearSelected(){
        this.selectData = []
      },
      getSelect() {
        let data = this.selectData.map(item => {return {code:item.code, name: item.value}})
        return data
      },
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>