<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :xs="12">
            <a-form-item label="收费项目">
              <j-input placeholder="请输入项目名称模糊查询" v-model="queryParam.chargeItems"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="限定范围">
              <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE"
                                     v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
              <m-multi-select-tag dictCode="LIMIT_SCOPE" v-model="queryParam.mLimitScope" :maxTagCount="2" :loaded="limitLoaded"></m-multi-select-tag>
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
              <a-form-item label="规则来源">
                <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE"
                                       v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
                <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
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
          <j-ellipsis :value="text" :length="20"/>
        </span>
        <span slot="codes" slot-scope="text">
          <j-ellipsis :value="text" :length="22"/>
        </span>
        <span slot="names" slot-scope="text">
          <j-ellipsis :value="text" :length="13"/>
        </span>
        <!-- <span slot="limitScope" slot-scope="text">
           <j-ellipsis :value="toLimitScopeShow(text)" :length="14"/>
         </span>-->
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
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import MDictSelectTagOP from "@/components/dict_medical/MDictSelectTagOP"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import {chargeLimitScope} from "@//pages/case/DrugRuleCommon"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { postListMixin } from '@/pages/selectMulti/postListMixin'
  export default {
    name: "MedicalTreatProjectList",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin,postListMixin],
    props: ['ruleSource'],
    components: {
      JEllipsis,
      MDictSelectTagOP,
      MMultiSelectTag,
      MDictSelectTag
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '收费项目',
            align: "center",
            dataIndex: 'chargeItems',
            width: 200,
            // fixed: true,
            ellipsis: true,
            // scopedSlots: { customRender: 'names' }
          }, {
            title: '收费分类',
            align: "center",
            dataIndex: 'chargeTypes_dictText',
            width: 200,
            // scopedSlots: { customRender: 'names' }
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 250,
            ellipsis: true,
            // scopedSlots: { customRender: 'message' }
          }, {
            title: '频率',
            align: "center",
            dataIndex: 'frequency',
            width: 120,
            customRender: (t, r, i) => {
              //字典值替换通用方法
              return `${r.compare || ''} ${r.frequency || ''}次`
            },
          }, {
            title: '就诊周期',
            align: "center",
            dataIndex: 'period',
            width: 250,
            /*  customRender: (text) => {
                //字典值替换通用方法
                return text?periodDict[text.toString()]:''
              },*/
          },
          {
            title: '限定范围',
            align: "center",
            dataIndex: 'limitScope_dictText',
            width: 200,
            ellipsis: true,
            // scopedSlots: { customRender: 'limitScope' }
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
        ],
        url: {
          list: "/medical/medicalDrugRule/list",
          postlist: "/medical/medicalDrugRule/postlist",
          selectAll: "/medical/medicalDrugRule/selectAll",
        },
        /* 排序参数 */
        isorter: {
          column: 'chargeItems',
          order: 'asc',
        },
        fixedParam: {
          ruleType: '2',
          // ruleSource: this.ruleSource && `*${this.ruleSource}*`
        },
        id: 'ruleId',
        code: 'chargeItemCodes',
        name: 'chargeItems',
        paramInId:'ruleId',//已选中 未选中查询的参数
      }
    },
    methods: {
      limitLoaded(data){
        let limitSet = new Set(chargeLimitScope.map(item => item.code))
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
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
