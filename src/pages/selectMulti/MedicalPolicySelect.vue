<template>
  <div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="政策编号">
              <j-input placeholder="请输入政策编号模糊查询" v-model="queryParam.policyCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="政策名称">
              <j-input placeholder="请输入政策名称模糊查询" v-model="queryParam.policyName"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="附件文件内容">
              <j-input placeholder="请输入附件文件模糊查询" v-model="queryParam.fileContent"></j-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="附件名称">
                <j-input placeholder="请输入附件名称模糊查询" v-model="queryParam.filenames"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="政策类型">
                <other-dict-select-tag  placeholder="请选择政策类型" v-model="queryParam.policyTypeCode"  dictEname="rule_sourcetype"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="文件用途分类">
                <other-dict-select-tag  placeholder="请选择政策类型" v-model="queryParam.policyServiceClassCode"  dictEname="service_class"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="发文机关">
                <j-input placeholder="请输入发文机关模糊查询" v-model="queryParam.issuingOffice"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="效力级别">
                <a-select placeholder="请选择效力级别" v-model="queryParam.effectLevelName">
                  <a-select-option value="">--请选择--</a-select-option>
                  <a-select-option value="宪法">宪法</a-select-option>
                  <a-select-option value="法律">法律</a-select-option>
                  <a-select-option value="行政法规">行政法规</a-select-option>
                  <a-select-option value="省,自治区,直辖市地方性法规">省,自治区,直辖市地方性法规</a-select-option>
                  <a-select-option value="设区的市地方性法规">设区的市地方性法规</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="适用地区">
                <j-input placeholder="请输入适用地区模糊查询" v-model="queryParam.applyArea"></j-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="适用开始时间范围">
                <a-date-picker placeholder="" v-model="queryParam.effectStartdate_begin" class="search-divider-item"></a-date-picker>
                <div  class="search-divider">~</div>
                <a-date-picker placeholder="" v-model="queryParam.effectStartdate_end" class="search-divider-item"></a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="适用结束时间范围">
                <a-date-picker placeholder="" v-model="queryParam.effectEnddate_begin" class="search-divider-item"></a-date-picker>
                <div  class="search-divider">~</div>
                <a-date-picker placeholder="" v-model="queryParam.effectEnddate_end" class="search-divider-item"></a-date-picker>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="适用人群">
                <j-input placeholder="请输入适用人群模糊查询" v-model="queryParam.applyPeople"></j-input>
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX,y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">
        <span slot="productEname" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>

        <span slot="approveNumber" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>

        <span slot="specification" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

        <span slot="enterprise" slot-scope="text">
          <j-ellipsis :value="text" :length="8"/>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectMixin } from '@/pages/selectMulti/commonMixin'
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  export default {
    name: "MedicalPolicySelect",
    mixins: [JeecgListMixin, multiSelectMixin, postListMixin],
    components: {
      OtherDictSelectTag,
    },
    data() {
      return {
        description: '政策选择',
        // 表头
        columns: [
          {
            title: '政策编号',
            width:150,
            align:"left",
            dataIndex: 'policyCode'
          },
          {
            title: '政策名称',
            width:150,
            align:"left",
            dataIndex: 'policyName'
          },
          {
            title: '政策类型',
            width:150,
            align:"left",
            dataIndex: 'policyTypeName'
          },
          {
            title: '政策用途分类',
            width:150,
            align:"left",
            dataIndex: 'policyServiceClassName'
          },
          {
            title: '效力级别',
            width:200,
            align:"left",
            dataIndex: 'effectLevelName'
          },
          {
            title: '政策文号',
            width:150,
            align:"left",
            dataIndex: 'policyDocNumber'
          },
          {
            title: '发文机关',
            width:100,
            align:"left",
            dataIndex: 'issuingOffice'
          },
          {
            title: '发文机关所属地区',
            width:100,
            align:"left",
            dataIndex: 'issuingOfficeArea'
          },
          {
            title: '发文时间',
            width:100,
            align:"left",
            dataIndex: 'issuingDate'
          },
          {
            title: '适用开始时间',
            width:150,
            align:"left",
            dataIndex: 'effectStartdate'
          },
          {
            title: '适用结束时间',
            width:150,
            align:"left",
            dataIndex: 'effectEnddate'
          },
          {
            title: '适用人群',
            width:100,
            align:"left",
            dataIndex: 'applyPeople'
          },
          {
            title: '适用地区',
            width:150,
            align:"left",
            dataIndex: 'applyArea'
          },
          {
            title: '相对应废止的政策文号',
            width:150,
            align:"left",
            dataIndex: 'policyDiscardDocNumber'
          },
          {
            title: '数据状态',
            width:150,
            align:"left",
            dataIndex: 'dataStatus'
          },
          {
            title: '创建人',
            align: "left",
            dataIndex: 'createUsername',
            width: 150,
          },
          {
            title: '创建时间',
            align: "left",
            dataIndex: 'createTime',
            width: 150,
          },
          {
            title: '修改人',
            align: "left",
            dataIndex: 'updateUsername',
            width: 150,
          },
          {
            title: '修改时间',
            align: "left",
            dataIndex: 'updateTime',
            width: 150,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed: 'right',
            width:200,
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          list: "/config/medicalPolicy/list",
          selectAll: "/config/medicalPolicy/list",
        },
        isorter:{
          column: 'policyCode',
          order: 'asc',
        },
        url2: {
          list: "/config/medicalDrug/list",
          selectAll: "/config/medicalDrug/selectAll",
        },
        paramInId:'code',//已选中 未选中查询的参数
      }
    },
    methods: {
      searchQuery(){
        this.postloadData(1);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
