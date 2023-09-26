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

<!--          <a-col :xxl="6" :xs="8">-->
<!--            <a-form-item label="医疗机构编码">-->
<!--              <j-input placeholder="输入医疗机构编码模糊查询" v-model="queryParam.code"/>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :xxl="6" :xs="8">
            <a-form-item label="医疗机构名称">
              <j-input placeholder="输入医疗机构名称模糊查询" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
<!--          <a-col :xxl="6" :xs="8">-->
<!--            <a-form-item label="选中状态">-->
<!--              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">-->
<!--                <a-select-option value="">全部</a-select-option>-->
<!--                <a-select-option value="in">已选项</a-select-option>-->
<!--                <a-select-option value="not_in">未选项</a-select-option>-->
<!--              </a-select>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <template v-if="toggleSearchStatus">-->
<!--            <a-col :xxl="6" :xs="8">-->
<!--              <a-form-item label="卫生机构类别">-->
<!--                <j-input placeholder="模糊查询" v-model="queryParam.healthType"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col :xxl="6" :xs="8">-->
<!--              <a-form-item label="医疗机构级别">-->
<!--                <other-dict-select-tag  placeholder="请选择医疗机构级别" v-model="queryParam.orgLevelCode" dictEname="HospLevel"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col :xxl="6" :xs="8">-->
<!--              <a-form-item label="医疗机构等级">-->
<!--                <other-dict-select-tag  placeholder="请选择医疗机构等级" v-model="queryParam.orgClassCode" dictEname="HospGrade"/>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--          </template>-->
          <a-col :xxl="6" :xs="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>

<!--              <a @click="handleToggleSearch" class="m-l-6">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
<!--      <template v-if="selectType === 'checkbox'">-->
<!--        <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"-->
<!--                   v-on="selectActionOn"></selected-tag>-->
<!--      </template>-->
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
<!--        <span slot="title" slot-scope="text">-->
<!--          当前医疗机构来源：{{url.sourceName}}-->
<!--          <template v-for="(item,key) in urlInfo">-->
<!--            <a class="m-l-6" v-if="key !== sourceFrom" @click="changeSource(key)">切换为{{item.sourceName}}</a>-->
<!--          </template>-->

<!--        </span>-->
<!--        <span slot="remark" slot-scope="text">-->
<!--          <j-ellipsis :value="text" :length="20"/>-->
<!--        </span>-->
      </a-table>
    </div>
    <!-- table区域-end -->

    </a-col>

  </a-row>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import MasterOrgTree from '@/pages/config/modules/MasterOrgTree'
  import OtherDictOrgTree from '@/pages/config/modules/OtherDictOrgTree'
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin, multiSelectMixin,postListMixin],
    components: {
      MasterOrgTree,
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
      let urlInfo = this.urlInfo = {
        'DWB': {
          list: "/config/medicalOrgan/listInData",
          selectAll: "/config/medicalOrgan/selectAllInData",
          sourceName: '病例',
        },
        'DICT': {
          list: "/config/medicalOrgan/manageList",
          selectAll: "/config/medicalOrgan/selectAll",
          sourceName: '字典',
        }
      }
      return {
        description: '医疗机构信息管理页面',
        // 表头
        columns: [
          {
            title: '医疗机构名称',
            align: "center",
            dataIndex: 'name',
            width: '250px'
          },
          {
            title: '医院等级',
            align: "center",
            dataIndex: 'orgClass'
          },
          {
            title: '社会信用代码',
            align: "center",
            dataIndex: 'socialCode'
          },
          {
            title: '医院类别',
            align: "center",
            dataIndex: 'orgType'
          },
          {
            title: '经营性质',
            align: "center",
            dataIndex: 'businessNature'
          },
          {
            title: '医院地址',
            align: "center",
            dataIndex: 'address'
          },
          {
            title: '机构信息更新时间',
            align: "center",
            dataIndex: 'updateTime',
            width: '200px'
          },

        ],
        url: {
          list: "/config/medicalOrgan/manageList",
          selectAll: "/config/medicalOrgan/selectAll",
          sourceName: '字典',
        },
        /* 排序参数 */
        isorter: {
          column: '',
          order: '',
        },
        fixedParam:{},
        id: 'id',
        code: 'code',
        name: 'name',
        sideCollapsed: false,
        paramInId:'code',//已选中 未选中查询的参数
        sourceFrom: 'DWB',
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
      searchData(typeCode,nullField) {
        console.log('typeCode,nullField',typeCode,nullField)
        this.queryParam.typeCode = typeCode;
        this.queryParam.nullField = nullField;
        this.searchQuery();
      },
      searchQuery(){
        this.postloadData(1);
      },
      changeSource(key){
        this.sourceFrom = key
        this.url = this.urlInfo[key]
        this.searchData()

      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
