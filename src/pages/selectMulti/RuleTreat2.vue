<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :xs="12">
            <a-form-item label="不合规行为">
              <input-medical-action-dict v-model="queryParam.actionId" multi separator="," hideButton :maxTag="1"></input-medical-action-dict>
              <!--<m-dict-select-tag :dictCode="ruleLimitDictCode" v-model="queryParam.ruleLimit" search></m-dict-select-tag>-->
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="规则类别">
              <m-multi-select-tag :dictCode="ruleLimitDictCode" v-model="queryParam.ruleLimit" separator="," :maxTag="1"></m-multi-select-tag>
              <!--<m-dict-select-tag :dictCode="ruleLimitDictCode" v-model="queryParam.ruleLimit" search></m-dict-select-tag>-->
            </a-form-item>
          </a-col>
          <a-col :xl="6" :xs="12">
            <a-form-item label="项目名称">
              <j-input placeholder="模糊查询" v-model="queryParam.itemNames"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :xs="12">
              <a-form-item label="项目编码">
                <j-input placeholder="模糊查询" v-model="queryParam.itemCodes"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="所属地区">
                <!--<m-dict-select-tag-o-p dictCode="SOLR_DATA_SOURCE"
                                       v-model="queryParam.ruleSource" like></m-dict-select-tag-o-p>-->
                <j-input placeholder="多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="政策依据">
                <j-input placeholder="模糊查询" v-model="queryParam.ruleBasis"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="提示信息">
                <j-input placeholder="模糊查询" v-model="queryParam.message"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="修改时间">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.updateTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.updateTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="修改人">
                <j-input placeholder="模糊查询" v-model="queryParam.updateUsername"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="6" :md="12" :xs="24">
              <a-form-item label="创建时间">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.createTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.createTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="创建人">
                <j-input placeholder="模糊查询" v-model="queryParam.createUsername"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="规则级别">
                <a-select placeholder="请选择规则级别" v-model="queryParam.ruleGrade" :allowClear="true">
                  <a-select-option value="1级">1级</a-select-option>
                  <a-select-option value="2级">2级</a-select-option>
                  <a-select-option value="3级">3级</a-select-option>
                </a-select>
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
  import {chargeLimitScope} from "@//pages/case/DrugRuleCommon"
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import InputMedicalActionDict from "@/pages/selectInput/MedicalActionDict"

  export default {
    name: "MedicalTreatProjectList",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin],
    props: ['ruleSource'],
    components: {
      JEllipsis,
      MDictSelectTagOP,
      MMultiSelectTag,
      MDictSelectTag,
      InputMedicalActionDict,
    },
    data() {
      return {
        // 表头
        columns: [
          {
            title: '规则类别',
            align: "center",
            dataIndex: 'ruleLimit',
            width: 180,
            customRender: t => this.ruleLimitMap[t] || t
          },
          {
            title: '不合规行为',
            align: "center",
            dataIndex: 'actionName',
            width: 180,
          },
          {
            title: '项目名称',
            align: "center",
            dataIndex: 'itemNames',
            width: 200,
          },
          {
            title: '项目编码',
            align: "center",
            dataIndex: 'itemCodes',
            width: 200,
          },
          {
            title: '所属地区',
            align: "center",
            dataIndex: 'ruleSource',
            width: 80,
          },
          {
            title: '政策依据',
            align: "center",
            dataIndex: 'ruleBasis',
            width: 120,
          },
          {
            title: '适用时间',
            align: "center",
            dataIndex: 'startTime',
            width: 120,
            customRender: (text, record, index) => {
              return record.startTime + ' ~ ' + record.endTime;
            },
          },
          {
            title: '提示信息',
            align: "center",
            dataIndex: 'message',
            width: 180,
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'createUsername',
            width: 120,
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime',
            width: 120
          },
        ],
        url: {
          list: "/medical/medicalRuleConfig/list",
          selectAll: "/medical/medicalRuleConfig/selectAll",
        },
        /* 排序参数 */
        isorter: {
          column: 'updateTime,ruleLimit,itemCodes',
          order: 'desc,asc,asc',
        },
        fixedParam: {
          ruleType: 'TREAT', status: 'normal'
          // ruleSource: this.ruleSource && `*${this.ruleSource}*`
        },
        id: 'ruleId',
        code: 'itemCodes',
        name: 'itemNames',
        ruleLimitMap: {},
        ruleLimitDictCode: 'RULE_LIMIT_TREAT'
      }
    },
    beforeMount(){
      this.$util.initDict(this.ruleLimitDictCode).then(data => {
        this.ruleLimitMap = data.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
      })
    },
    methods: {
      /*getSelect() {
        return this.selectedRowRecords.map(record => {
          return {
            id: record[this.id],
            name: record[this.name],
            code: record[this.code]
          }
        })
      },*/
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
