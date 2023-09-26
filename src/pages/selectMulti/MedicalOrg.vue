<template>
  <a-row :gutter="24">
    <a-col :span="4" style="overflow: auto" :style="{maxHeight:scrollH}">
      <other-dict-org-tree @selectNode="searchData" :showCode="false"></other-dict-org-tree>
    </a-col>
    <a-col :span="20">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xxl="6" :xs="8">
            <a-form-item label="医疗机构编码">
              <j-input placeholder="输入医疗机构编码模糊查询" v-model="queryParam.code"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :xs="8">
            <a-form-item label="医疗机构名称">
              <j-input placeholder="输入医疗机构名称模糊查询" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xxl="6" :xs="8">
              <a-form-item label="卫生机构类别">
                <j-input placeholder="模糊查询" v-model="queryParam.healthType"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xs="8">
              <a-form-item label="医疗机构级别">
                <other-dict-select-tag  placeholder="请选择医疗机构级别" v-model="queryParam.orgLevelCode" dictEname="HospLevel"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xs="8">
              <a-form-item label="医疗机构等级">
                <other-dict-select-tag  placeholder="请选择医疗机构等级" v-model="queryParam.orgClassCode" dictEname="HospGrade"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xxl="6" :xs="8">
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
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        @change="handleTableChange">
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
  import OtherDictOrgTree from '@/pages/config/modules/OtherDictOrgTree'
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin, multiSelectMixin],
    components: {
      OtherDictOrgTree,
      OtherDictSelectTag
    },
    props: {
      kind:String,
      selectType: {
        type: String,
        default: 'checkbox'
      },
    },
    data() {
      return {
        description: '医疗机构信息管理页面',
        // 表头
        columns: [
          {
            title: '医疗机构编码',
            width:200,
            align:"left",
            dataIndex: 'code',
            fixed: 'left',
          },
          {
            title: '医疗机构名称',
            width:200,
            align:"left",
            dataIndex: 'name',
            fixed: 'left',
          },
          {
            title: '医疗机构级别',
            width:120,
            align:"left",
            dataIndex: 'orgLevel',
          },
          {
            title: '医疗机构等级',
            width:120,
            align:"left",
            dataIndex: 'orgClass',
          },
          {
            title: '行政级别',
            width:150,
            align:"left",
            dataIndex: 'administrativeLevel',
          },
          {
            title: '医疗机构类型',
            width:150,
            align:"left",
            dataIndex: 'orgType',
          },
          {
            title: '卫生机构类别',
            width:150,
            align:"left",
            dataIndex: 'healthType',
          },
          {
            title: '经营性质',
            width:150,
            align:"left",
            dataIndex: 'businessNature',
          },
          {
            title: '所有制形式',
            width:100,
            align:"left",
            dataIndex: 'ownership',
          },
          {
            title: '新农合定点医疗机构标志',
            width:100,
            align:"left",
            dataIndex: 'xnhFlagName',
          },
          {
            title: '医保定点医疗机构标志',
            width:100,
            align:"left",
            dataIndex: 'ybFlagName',
          },
          {
            title: '工伤医疗机构标志',
            width:100,
            align:"left",
            dataIndex: 'gsFlagName',
          },
          {
            title: '职业病鉴定机构标志',
            width:100,
            align:"left",
            dataIndex: 'zybFlagName',
          },
          {
            title: '法人姓名',
            width:100,
            align:"left",
            dataIndex: 'legalName',
          },
          {
            title: '联系电话',
            width:100,
            align:"left",
            dataIndex: 'telephone',
          },
          {
            title: '描述',
            width:200,
            align:"center",
            dataIndex: 'remark',
            scopedSlots: { customRender: 'remark' },
          },

        ],
        url: {
          list: "/config/medicalOrgan/manageList",
          selectAll: "/config/medicalOrgan/selectAll",
        },
        /* 排序参数 */
        isorter: {
          column: 'code',
          order: 'asc',
        },
        fixedParam:{state: 1},
        id: 'id',
        code: 'code',
        name: 'name',
        sideCollapsed: false,
      }
    },
    computed: {
      scrollH() {
        let y = this.$store.getters.height * this.heightRatio - 50
        return (y < 300 ? 300 : y) + 'px'
      }
    },
    watch: {
      selectedRowRecords(val){
        this.$emit('select',val)
      }
    },
    methods:{
      sideCollapse() {
        this.sideCollapsed = !this.sideCollapsed
      },
      //左侧树点击查询
      searchData(typeCode) {
        this.queryParam.typeCode = typeCode;
        this.searchQuery();
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
