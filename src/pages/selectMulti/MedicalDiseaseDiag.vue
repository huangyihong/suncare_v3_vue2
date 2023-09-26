<template>
  <a-row :gutter="24">
    <a-col :span="6" style="overflow: auto" :style="{maxHeight:scrollH}">
      <other-dict-tree @selectNode="searchData" dictEname="STD_ICDClassify" :showCode="true"></other-dict-tree>
    </a-col>
    <a-col :span="18">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="疾病编码">
              <j-input placeholder="请输入疾病编码模糊查询(,代表与|代表或)" type="more" v-model="queryParam.code"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="疾病名称">
              <j-input placeholder="请输入疾病名称模糊查询(,代表与|代表或)" type="more" v-model="queryParam.name"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="父级分类编码">
                <a-input placeholder="输入父级分类编码模糊查询" v-model="queryParam.typeCode"/>
              </a-form-item>
            </a-col>

            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="父级分类名称">
                <j-input placeholder="输入父级分类名称模糊查询" v-model="queryParam.typeName"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="8" :sm="12">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search" title="查询"></a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6" title="重置"></a-button>

              <a @click="handleToggleSearch" class="m-l-6" :title="toggleSearchStatus ? '收起' : '展开'">
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
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="name" slot-scope="text, record">
          <j-ellipsis :value="text" :length="12"/>
        </span>

        <span slot="typeName" slot-scope="text">
          <j-ellipsis :value="text" :length="12"/>
        </span>

        <span slot="remark" slot-scope="text">
          <j-ellipsis :value="text" :length="20"/>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    </a-col>

  </a-row>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import OtherDictTree from '@/pages/config/modules/OtherDictTree'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin,multiSelectMixin,postListMixin],
    components: {
      OtherDictTree
    },
    data() {
      return {
        description: '疾病信息管理页面',
        // 表头
        columns: [
          {
            title: '疾病编码',
            width:150,
            align:"left",
            dataIndex: 'code',
          },
          {
            title: '疾病名称',
            width:200,
            align:"left",
            dataIndex: 'name',
            // scopedSlots: { customRender: 'name' },
          },
          {
            title: '父级分类编码',
            width:150,
            align:"left",
            dataIndex: 'typeCode',
          },
          {
            title: '父级分类名称',
            width:200,
            align:"left",
            dataIndex: 'typeName',
            // scopedSlots: { customRender: 'typeName' },
          },
          {
            title: '描述',
            width:200,
            align:"left",
            dataIndex: 'remark',
            scopedSlots: { customRender: 'remark' },
          },

        ],
        isorter: {
          column: 'code',
          order: 'asc',
        },
        url: {
          list: "/config/medicalDiseaseDiag/list",
          selectAll: "/config/medicalDiseaseDiag/selectAll",
        },
        fixedParam: {
          state: '1'
        },
        sideCollapsed: false,
        paramInId:'code',//已选中 未选中查询的参数
      }
    },
    computed: {
      scrollH() {
        let y = this.$store.getters.height * this.heightRatio - 150
        return (y < 300 ? 300 : y) + 'px'
      }
    },
    beforeMount() {

    },
    methods: {
      sideCollapse() {
        this.sideCollapsed = !this.sideCollapsed
      },
      //左侧树点击查询
      searchData(typeCode){
        this.queryParam.typeCode_1 = typeCode;
        this.searchQuery();
      },

      getSelect() {
        let data = this.selectedRowRecords.map(record => {
          return {code: record.code, name: record.name}
        })
        return data
      },
      searchQuery() {
        this.postloadData(1);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
