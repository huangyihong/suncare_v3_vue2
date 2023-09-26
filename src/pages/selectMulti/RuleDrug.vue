<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :xs="12">
            <a-form-item label="药品编码">
              <j-input placeholder="请输入药品编码模糊查询" v-model="queryParam.drugCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="药品名称">
              <j-input placeholder="请输入药品名称模糊查询" v-model="queryParam.drugNames"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="选中状态">
              <a-select placeholder="选择选中状态" v-model="queryParam.queryType">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="in">已选项</a-select-option>
                <a-select-option value="not_in">未选项</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :xs="12">
              <a-form-item label="提示信息">
                <j-input placeholder="请输入提示信息模糊查询" v-model="queryParam.message"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="规则来源">
                <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE"
                                       v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
                <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="限定范围">
                <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE"
                                       v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
                <m-multi-select-tag dictCode="LIMIT_SCOPE" v-model="queryParam.mLimitScope" :maxTagCount="2" :loaded="limitLoaded"></m-multi-select-tag>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :xs="12">
              <a-form-item label="修改时间">
                <j-date class="search-divider-item" v-model="queryParam.updateTime_begin" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" v-model="queryParam.updateTime_end" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :xs="12">
              <a-form-item label="创建时间">
                <j-date class="search-divider-item" v-model="queryParam.createTime_begin" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" v-model="queryParam.createTime_end" :showTime="true"
                        date-format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间"></j-date>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :xs="12">
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
        rowKey="ruleId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection}"
        :scroll="{ x: scrollX, y: scrollY}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <!-- 字符串超长截取省略号显示 -->
        <span slot="message" slot-scope="text">
          <j-ellipsis :value="text" :length="15"/>
        </span>
        <span slot="codes" slot-scope="text">
          <j-ellipsis :value="text" :length="22"/>
        </span>
        <span slot="names" slot-scope="text">
          <j-ellipsis :value="text" :length="13"/>
        </span>
        <span slot="limitScope" slot-scope="text">
          <j-ellipsis :value="text" :length="14"/>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import JDate from '@/components/jeecg/JDate'
  import MDictSelectTagOP from "@/components/dict_medical/MDictSelectTagOP"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import {drugLimitScope} from "@//pages/case/DrugRuleCommon"
  import { postListMixin } from '@/pages/selectMulti/postListMixin'

  const limitDict = {
    '01': '年龄',
    '02': '性别',
    '03': '就医方式',
    '04': '参保类型',
    '05': '医院级别',
    '06': '科室',
    '07': '疗程用药剂量',
    '08': '年度用药剂量',
    '09': '治疗项目',
    '10': '治疗方式',
    '11': '重复用药',
    '12': '二线用药',
    '13': '适用症',
    '14': '治疗用药',
  }
  export default {
    name: "MedicalTreatProjectList",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin,postListMixin],
    props: ['ruleSource'],
    components: {
      JDate,
      MDictSelectTagOP,
      MMultiSelectTag
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '药品编码',
            align: "center",
            dataIndex: 'drugCode',
            width: 200,
            fixed: true,
            scopedSlots: { customRender: 'codes' }
          }, {
            title: '药品名称',
            align: "center",
            dataIndex: 'drugNames',
            width: 220,
            fixed: true,
            scopedSlots: { customRender: 'names' }
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 250,
            scopedSlots: { customRender: 'message' }
          },
          {
            title: '规则来源',
            align: "center",
            dataIndex: 'ruleSource',
            width: 120
          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '修改人',
            align: "center",
            dataIndex: 'updateUsername'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername'
          },
          /*{
            title: '药品编码',
            align: "center",
            dataIndex: 'drugCode',
            width: 200,
            fixed: true,
            scopedSlots: { customRender: 'codes' }
          }, {
            title: '药品名称',
            align: "center",
            dataIndex: 'drugNames',
            width: 200,
            fixed: true,
            scopedSlots: { customRender: 'names' }
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 250,
            scopedSlots: { customRender: 'message' }
          },
          {
            title: '限定范围',
            align: "center",
            dataIndex: 'limitScope',
            width: 200,
            scopedSlots: { customRender: 'limitScope' }
          },
          {
            title: '年龄',
            align: "center",
            dataIndex: 'age_dictText',
            width: 80
          },
          {
            title: '性别',
            align: "center",
            dataIndex: 'sex_dictText',
            width: 80
          },
          {
            title: '就医方式',
            align: "center",
            dataIndex: 'jzlx_dictText',
            width: 120
          },
          {
            title: '参保类型',
            align: "center",
            dataIndex: 'yblx_dictText',
            width: 120
          },
          {
            title: '医院级别',
            align: "center",
            dataIndex: 'yyjb_dictText',
            width: 120
          },
          {
            title: '疗程用药剂量',
            align: "center",
            dataIndex: 'courseDose',
            width: 120
          },
          {
            title: '年度用药剂量',
            align: "center",
            dataIndex: 'yearDose',
            width: 120
          },*/
        ],
        url: {
          list: "/medical/medicalDrugRule/list",
          selectAll: "/medical/medicalDrugRule/selectAll",
        },
        /* 排序参数 */
        isorter: {
          column: 'drugNames',
          order: 'asc',
        },
        fixedParam: {
          ruleType: '1',
          // ruleSource: this.ruleSource && `*${this.ruleSource}*`
        },
        id: 'ruleId',
        name: 'drugNames',
        code: 'drugCode',
        paramInId:'ruleId',//已选中 未选中查询的参数
      }
    },
    methods: {
      limitLoaded(data){
        let limitSet = new Set(drugLimitScope.map(item => item.code))
        return data.filter(r => limitSet.has(r.code))
      },
      toLimitScopeShow(limitScope) {
        return limitScope.trim().split(",").map(item => limitDict[item.toString()]).join(",")
      },
      /*getSelect() {
        return this.selectedRowRecords.map(record => {
          return {
            id: record[this.id],
            name: record[this.name],
            code: record[this.code]
          }
        })
      },*/
      searchQuery(){
        this.postloadData(1);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
