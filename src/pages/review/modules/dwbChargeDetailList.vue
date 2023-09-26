<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xxl="6" :xs="12">
            <a-form-item label="项目名称">
              <j-input placeholder="输入项目名称模糊查询" v-model="queryParam.itemname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :xs="12">
            <a-form-item label="项目编码">
              <j-input placeholder="输入项目编码模糊查询" v-model="queryParam.itemcode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xxl="6" :xs="8">
            <a-form-item label="项目收费等级">
              <other-dict-select-tag placeholder="请选择项目收费等级" dictEname="ChargeAttri"
                                      v-model="queryParam.chargeattriId"/>

            </a-form-item>
          </a-col>


          <template v-if="toggleSearchStatus">
            <a-col :xxl="6" :xs="8">
              <a-form-item label="规格">
                <j-input placeholder="输入规格模糊查询" v-model="queryParam.specificaion"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xxl="12" :xs="16">
              <a-form-item label="收费日期范围">
                <j-date v-model="queryParam.chargedate_begin" class="search-divider-item"/>
                <div class="search-divider">~</div>
                <j-date v-model="queryParam.chargedate_end" class="search-divider-item"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xxl="6" :xs="12">
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

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX, y:300 }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        v-bind="tableAttrs">

        <span slot="visitid" slot-scope="text, record">
          <a @click="selectKey(record)">{{text}}</a>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
  import OtherDictSelectTag from "@/pages/config/modules/OtherDictSelectTag"

  import { querySysDictByType, querySysDictByTypes } from '@/api-sv3/api'

  import { getAction, httpAction } from '@/api/manage'

  export default {
    name: "DwbChargeDetailList",
    mixins: [JeecgListMixin],
    props: ['visitid'],
    components: {
      MDictSelectTag,
      OtherDictSelectTag
    },
    data() {
      return {
        description: '收费明细列表',
        // 表头
        columns: [
          /*{
            title: '项目编码',
            align: "left",
            dataIndex: 'itemcode',
            width: 120,
            // fixed: 'left'
          },*/
          {
            title: '项目名称',
            align: "left",
            dataIndex: 'itemname',
            width: 120,
          },
         /* {
            title: '医保项目编码_src',
            align: "left",
            dataIndex: 'itemcodeSrc',
            width: 120,
            // fixed: 'left'
          },*/
          {
            title: '医保项目名称_src',
            align: "left",
            dataIndex: 'itemnameSrc',
            width: 120,
          },
          {
            title: '医院项目名称_src',
            align: "left",
            dataIndex: 'hisItemnameSrc',
            width: 120,
          },{
            title: '项目收费等级',
            align: "left",
            dataIndex: 'chargeattri',
            width: 80,
          },
          {
            title: '规格',
            align: "left",
            dataIndex: 'specificaion',
            width: 120,
          },
          {
            title: '数量',
            align: "left",
            dataIndex: 'amount',
            width: 100,
            //fixed: 'left',
          },
          {
            title: '计价单位',
            align: "left",
            dataIndex: 'chargeunit',
            width: 80,
          },
          {
            title: '单价',
            align: "left",
            dataIndex: 'itemprice',
            width: 80,
          },
          {
            title: '总金额',
            align: "left",
            dataIndex: 'fee',
            width: 120,
          },
          {
            title: '自付比例',
            align: "left",
            dataIndex: 'selfpayProp',
            width: 180,
          },
          {
            title: '处方日期',
            align: "left",
            dataIndex: 'prescripttime',
            width: 180,
          },
          {
            title: '收费日期',
            align: "left",
            dataIndex: 'chargedate',
            width: 180,
          },

        ],
        url: {
          list: this.$suncare_v3 +this.$gp_database+ "/review/dwbChargeDetailList",
        },
        ipagination: {
          current: 1,
          pageSize: 50,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0
        },
        initLoad: false,
        /* 排序参数 */
        isorter: {
          column: 'chargedate,fee',
          order: 'asc,desc'
        },
      }
    },
    watch: {
      visitid: {
        immediate: true,
        handler: function(val) {
          if (val) {
            this.fixedParam.visitid = val;
            this.loadData(1);
          }
        }
      }
    },
    methods: {}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
