<template>
  <a-row :gutter="24">
    <a-col :span="4" style="overflow: auto" :style="{height:scrollH}">
      <other-dict-org-tree @selectNode="searchData" :showCode="false" ></other-dict-org-tree>
    </a-col>
    <a-col :span="20">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xxl="6" :xs="8">
              <a-form-item label="医疗机构编码">
                <j-input placeholder="输入医疗机构编码模糊查询" v-model="queryParam.orgId"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xs="8">
              <a-form-item label="医疗机构名称">
                <j-input placeholder="输入医疗机构名称模糊查询" v-model="queryParam.orgName"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
            </span>
            </a-col>

          </a-row>
        </a-form>
      </div>

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="small"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
          @change="handleTableChange">
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
import { postListMixin } from '@/pages/selectMulti/postListMixin'

export default {
  name: "MedicalDrugList",
  mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
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
          align: "center",
          dataIndex: 'orgId',
          width: '120px'
        },
        {
          title: '医疗机构名称',
          align: "center",
          dataIndex: 'orgName',
          width: '250px'
        },
        {
          title: '医院等级',
          align: "center",
          dataIndex: 'hospgrade_dictText',
          width: '100px'
        },
        {
          title: '社会信用代码',
          align: "center",
          dataIndex: 'socialCode',
          width: '100px'
        },
        {
          title: '医院类别',
          align: "center",
          dataIndex: 'orgtype',
          width: '100px'
        },
        {
          title: '经营性质',
          align: "center",
          dataIndex: 'businessNature',
          width: '100px'
        },
        {
          title: '医院地址',
          align: "center",
          dataIndex: 'orgAddress',
          width: '250px'
        },
        {
          title: '机构信息更新时间',
          align: "center",
          dataIndex: 'updateTime',
          width: '120px'
        },

      ],
      url: {
        list: "/fj/org/list",
      },
      /* 排序参数 */
      isorter: {
        column: '',
        order: '',
      },
      fixedParam:{},
      id: 'id',
      code: 'orgId',
      name: 'orgName',
      sideCollapsed: false,
    }
  },
  computed: {
    scrollH() {
      let height = parseFloat(this.scrollY.substring(0, this.scrollY.length - 2)) + 150 + 'px'
      return height
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
    }
  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
