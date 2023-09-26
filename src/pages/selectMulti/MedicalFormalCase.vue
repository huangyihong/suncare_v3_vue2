<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="模型名称">
              <j-input placeholder="输入模型名称模糊查询" v-model="queryParam.caseName"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="所属地区">
              <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
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
          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="是否特殊模型">
              <!--<m-dict-select-tag placeholder="请选择状态" dictCode="SWITCH_STATUS" v-model="queryParam.caseStatus"/>-->
              <a-select placeholder="请选择" v-model="queryParam.caseClassify" allowClear>
                <a-select-option value="*">是</a-select-option>
                <a-select-option value="!*">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          <a-col :xxl="8" :lg="12" :sm="12">
            <a-form-item label="适用时间(开始)">
              <j-date class="search-divider-item" placeholder="开始时间"
                      v-model="queryParam.startTime_begin"></j-date>
              <span class="search-divider">~</span>
              <j-date class="search-divider-item" placeholder="结束时间"
                      v-model="queryParam.startTime_end"></j-date>
            </a-form-item>
          </a-col>
          <a-col :xxl="8" :xl="12" :sm="12">
            <a-form-item label="适用时间(结束)">
              <j-date class="search-divider-item" placeholder="开始时间"
                      v-model="queryParam.endTime_begin"></j-date>
              <span class="search-divider">~</span>
              <j-date class="search-divider-item" placeholder="结束时间"
                      v-model="queryParam.endTime_end"></j-date>
            </a-form-item>
          </a-col>
          <a-col :xxl="8" :xl="12" :sm="12">
            <a-form-item label="规则级别">
              <a-select placeholder="请选择规则级别" v-model="queryParam.ruleGrade" :allowClear="true">
                <a-select-option value="1级">1级</a-select-option>
                <a-select-option value="2级">2级</a-select-option>
                <a-select-option value="3级">3级</a-select-option>
              </a-select>
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
      <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                    v-on="selectActionOn"></selected-tag>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="caseId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,getCheckboxProps}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <template slot="caseName" slot-scope="text, record">
          <a @click="caseDetail(record.caseId)">{{text}}</a>
        </template>
        <template slot="status" slot-scope="text, record">
          <span style="color: red" v-if="record.caseStatus === 'stop'">{{text}}</span>
          <span v-else>{{text}}</span>
        </template>
      </a-table>
    </div>

    <case-detail-modal ref="caseModal"></case-detail-modal>
    <!-- table区域-end -->
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import CaseDetailModal from '@/pages/probe/caseDetailModal'
  import { postListMixin } from '@/pages/selectMulti/postListMixin'


  export default {
    name: "MedicalFormalCase",
    mixins: [JeecgListMixin,multiSelectIdMatchMixin, postListMixin],
    components: {
      JEllipsis,
      MDictSelectTag,
      CaseDetailModal
    },
    props: {
      batchId: {
        default: '',
        type: String
      },
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '模型名称',
            align:"center",
            dataIndex: 'caseName',
            scopedSlots: { customRender: 'caseName' },
            width: 180,
          },
          /*{
            title: '状态',
            align:"center",
            dataIndex: 'caseStatus_dictText',
            scopedSlots: { customRender: 'status' },
            width: 80,
          },*/
          {
            title: '地区',
            align:"center",
            dataIndex: 'ruleSource',
            width: 80,
          },
          {
            title: '适用时间',
            align:"center",
            dataIndex: 'startTime',
            width: 120,
            customRender: (text, record, index) => {
              return record.startTime + ' ~ ' + record.endTime;
            },
          },
          {
            title: '备注',
            align:"center",
            dataIndex: 'caseRemark',
            width: 180,
          },
          {
            title: '创建人',
            align:"center",
            dataIndex: 'createUsername',
            width: 120,
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime',
            width: 180,
          },
        ],
        url: {
          list: "/formal/medicalFormalCase/list",
        },
        fixedParam: {
         caseStatus: 'normal'
         //  batchId:this.batchId
        },
        /* 排序参数 */
        isorter:{
          column: 'caseStatus,createTime',
          order: 'asc,desc',
        },
        id: 'caseId',
        code: 'caseId',
        name: 'caseName',
      }
    },
    watch: {
      batchId: {
        immediate: true,
        handler(val) {
          this.fixedParam.batchId=val
        }
      }
    },
    methods:{
      getCheckboxProps: record => ({
        props: {
          disabled: record.caseStatus === 'stop', // Column configuration not to be checked
          // name: record.name,
        },
      }),
      caseDetail(id){
        this.$refs.caseModal.detail(id)
      },
      searchQuery(){
        this.postloadData(1);
      },
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
