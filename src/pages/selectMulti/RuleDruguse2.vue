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
              <a-form-item label="政策依据">
                <j-input placeholder="模糊查询" v-model="queryParam.ruleBasis"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="适用时间(开始)">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.startTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.startTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="适用时间(结束)">
                <j-date class="search-divider-item" placeholder="开始时间"
                        v-model="queryParam.endTime_begin"></j-date>
                <span class="search-divider">~</span>
                <j-date class="search-divider-item" placeholder="结束时间"
                        v-model="queryParam.endTime_end"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="所属地区">
                <j-input placeholder="请输入多关键字查询(|为或 ,为且)" v-model="queryParam.ruleSource" type="more"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :xs="12">
              <a-form-item label="提示信息">
                <j-input placeholder="请输入提示信息模糊查询" v-model="queryParam.message"></j-input>
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
      </a-table>
    </div>
    <!-- table区域-end -->

    </div>
</template>

<script>
  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import moment from "moment"
  import ImportModal from '@/components/ImportModal'
  import TrailDrugModal from '@/pages/case/plugin/TrailDrugModal'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import { filterDictText } from '@/components/dict_medical/DictSelectUtil'
  import { getAction } from '@/api/manage'
  import MMultiSelectTag from "@/components/dict_medical/MMultiSelectTag"
  import InputMedicalActionDict from "@/pages/selectInput/MedicalActionDict"

  export default {
    name: "MedicalDrugRule2List",
    mixins: [JeecgListMixin, multiSelectIdMatchMixin],
    components: {
      JEllipsis,
      ImportModal,
      TrailDrugModal,
      MDictSelectTag,
      MMultiSelectTag,
      InputMedicalActionDict,
    },
    data() {
      return {
        description: '合理用药规则管理页面',
        // 表头
        columns: [
          {
            title: '规则类别',
            align: "center",
            dataIndex: 'ruleLimit',
            customRender: t => this.ruleLimitMap[t] || t,
            width: 180,
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
         /* {
            title: '项目编码',
            align: "center",
            dataIndex: 'itemCodes',
            width: 200,
          },*/
         // 所属地区】【政策依据】【适用时间】【提示信息
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
            width: 180,
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
        fixedParam: { ruleType: 'DRUGUSE', status: 'normal' },
        id: 'ruleId',
        code: 'itemCodes',
        name: 'itemNames',
        ruleLimitMap: {},
        ruleLimitDictCode: 'RULE_LIMIT_DRUGUSE',
      }
    },
    beforeMount() {
      this.$util.initDict(this.ruleLimitDictCode).then(data => {
        this.ruleLimitMap = data.reduce((prev, cur) => {
          prev[cur.code] = cur.value
          return prev
        }, {})
      })
    },
    methods: {
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
