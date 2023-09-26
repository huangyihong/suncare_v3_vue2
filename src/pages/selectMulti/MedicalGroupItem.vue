<template>
  <div>
    <template v-if="selectType === 'checkbox'">
      <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>
    </template>
    <a-row :gutter="10">
      <a-col :span="12">
        <medical-group-select ref="groupRef" selectType="radio" :kind="kind" @select="groupSelect"></medical-group-select>

      </a-col>
      <a-col :span="12">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="8">

              <a-col  :md="12" :xs="24">
                <a-form-item label="代码">
                  <j-input placeholder="请输入" v-model="queryParam.code" @change="searchQuery"></j-input>
                </a-form-item>
              </a-col>
              <a-col :md="12" :xs="24">
                <a-form-item label="名称">
                  <j-input placeholder="请输入" v-model="queryParam.value" @change="searchQuery"></j-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- table区域-begin -->
        <div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="itemId"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
            :scroll="{ x: scrollX, y: scrollY}"
            @change="handleTableChange">
            <template slot="title">
              {{labelName}}组：
                <span v-if="group">{{group.groupName}}({{group.groupCode}}) <a @click="clearSelect">清除</a></span>
                <span v-else>全部</span>
            </template>
          </a-table>
        </div>
        <!-- table区域-end -->

      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import MedicalGroupSelect from "@/pages/selectMulti/MedicalGroupMini"
  import debounce from 'lodash/debounce';

  export default {
    name: "MedicalDrugList",
    mixins: [JeecgListMixin, multiSelectMixin],
    components: {
      MedicalGroupSelect
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
        description: '医疗项目管理页面',
        // 表头
        columns: [
          {
            title: '编码',
            align: "left",
            dataIndex: 'code',
            width: 200
          },
          {
            title: '名称',
            align: "center",
            dataIndex: 'value',
            width: 200,
          },

        ],
        url: {
          list: "/config/medicalProjectGroupItem/list",
        },
        /* 排序参数 */
        isorter: {
          column: 'isOrder,code',
          order: 'asc,asc',
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: false,
          showSizeChanger: false,
          total: 0
        },
        initLoad:false,
        toggleSearchStatus: false,
        selectInfos: {
          '1': { tableNameUrl:'medicalProjectGroupItem',labelName:'医疗服务项目'},
          '5': { tableNameUrl:'medicalDiseaseGroupItem',labelName:'疾病项'},
          '7': { tableNameUrl:'medicalDrugGroupItem',labelName:'药品项'},
        },
        tableNameUrl:'medicalProjectGroupItem',
        labelName:'药品项',
        id: 'itemId',
        code: 'code',
        name: 'value',
        group: undefined
      }
    },
    beforeMount(){
      this.searchQuery = debounce(this.searchQuery, 1000);//消抖
    },
    watch: {
      kind:{
        immediate: true,
        handler(val) {
          if (val && val.length > 0) {
            this.kindChange(val)
            this.loadData();
          }
        },
      }
    },
    methods:{
      kindChange(kind){
        if (kind && kind.length > 0) {
          let info = this.selectInfos[kind]
          if (info) {
            this.tableNameUrl = info.tableNameUrl
            this.labelName = info.labelName
            this.url = {
              list: `/config/${this.tableNameUrl}/list`,
            };
            this.columns[0].title = this.labelName+'编码'
            this.columns[1].title = this.labelName+'名称'
          }
        }
      },
      groupSelect(groups){
        console.log('groups',groups)
        if(groups.length > 0){
          this.group = groups[0]
          this.fixedParam.groupId = groups[0].groupId
        } else{
          delete this.fixedParam.groupId
        }
        this.loadData()
      },
      clearSelect(){
        this.group = undefined
        this.$refs.groupRef.onClearSelected()
        this.onClearSelected()
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
