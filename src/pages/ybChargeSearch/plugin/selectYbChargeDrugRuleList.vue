<template>
  <m-modal centered
           :title="title"
           width="80%"
           :visible="visible"
           :destroyOnClose="true"
           @cancel="handleCancel"
  >
    <!--@ok="handleSelectOk"-->
    <!--@cancel="handleCancel"-->
    <!--cancelText="关闭"-->
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button key="submit1" type="primary" @click="setExcelTable">
        导入条件进行编辑
      </a-button>
      <a-popconfirm title="确定要根据当前导入条件创建报表查询任务吗?" @confirm="handleOk">
        <a-button type="primary">直接创建下载任务</a-button>
      </a-popconfirm>
    </template>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="药品分类">
              <a-input placeholder="请输入药品分类" v-model="queryParam.drugType"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="药品名称">
              <a-input placeholder="请输入药品名称" v-model="queryParam.drugName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="药品分类(小)">
                <a-input placeholder="请输入药品分类(小)" v-model="queryParam.drugTypeSmall"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="医保类别">
                <a-input placeholder="请输入医保类别" v-model="queryParam.funType"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="剂型">
                <a-input placeholder="请输入剂型" v-model="queryParam.dosageType"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="限制类型">
                <m-dict-select-tag placeholder="请选择限制类型" dictCode="DC_DRUG_LIMIT_TYPE"
                                   v-model="queryParam.limitType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="限制内容">
                <a-input placeholder="请输入内容" v-model="queryParam.limitContent"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="整理人">
                <a-input placeholder="请输入整理人" v-model="queryParam.sorter"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="备注">
                <a-input placeholder="请输入备注" v-model="queryParam.remark"></a-input>
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
        @change="handleTableChange">

      </a-table>
    </div>
    <!-- table区域-end -->

  </m-modal>
</template>

<script>
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {getAction} from '@/api/manage'
import {multiSelectMixin} from '@/pages/selectMulti/commonMixin'
import MDictSelectTag from "@/components/dict_medical/MDictSelectTag"
import moment from "moment"
import {createStyle} from '@/api/optionStyle'

export default {
  name: "selectYbChargeDrugRuleList",
  mixins: [JeecgListMixin, multiSelectMixin],
  components: {MDictSelectTag},
  props: {
    param: {
      type: Object
    }
  },
  computed: {
    scrollY() {
      let y = this.$store.getters.height - 240
      return (y < 200 ? 200 : y) + 'px'
    },

  },
  data() {
    return {
      description: '药品规则页面',
      ipagination: {pageSize: 20},
      title: '从药品规则库中导入',
      // 表头
      columns: [
        {
          title: '药品分类',
          align: "center",
          dataIndex: 'drugType',
          width: 140,
        },
        {
          title: '药品分类(小)',
          align: "center",
          dataIndex: 'drugTypeSmall',
          width: 140,
        },
        {
          title: '医保类别',
          align: "center",
          dataIndex: 'funType'
        },
        {
          title: '药品名称',
          align: "center",
          dataIndex: 'drugName',
          width: 140,
        },
        {
          title: '剂型',
          align: "center",
          dataIndex: 'dosageType'
        },
        {
          title: '限制类型',
          align: "center",
          dataIndex: 'limitType_dictText'
        },
        {
          title: '限制内容',
          align: "center",
          dataIndex: 'limitContent'
        },
        {
          title: '备注',
          align: "center",
          dataIndex: 'remark',
          width: 140,
        },
        {
          title: '整理人',
          align: "center",
          dataIndex: 'sorter'
        },
      ],
      url: {
        list: "/ybChargeSearch/ybChargeDrugRule/drugRuleImportList",
      },
      id: 'id',
      code: 'id',
      name: 'drugName',
      visible: false,
      selectData: [],
      initLoad: false,
    }
  },
  watch: {
    param: {
      immediate: true,
      handler(val) {
        if (val) {
          Object.assign(this.fixedParam, val)
        }
      }
    }
  },
  methods: {
    show(record) {
      console.log("record", record)
      if (record.orgs) {
        record.orgs = record.orgs.join(",")
      }
      this.queryParam.orgs = record.orgs
      if (record.chargedateStartdate) {
        this.queryParam.chargedateStartdate = moment(record.chargedateStartdate).format("YYYY-MM-DD")
      }
      if (record.chargedateEnddate) {
        this.queryParam.chargedateEnddate = moment(record.chargedateEnddate).format("YYYY-MM-DD")
      }

      this.queryParam.etlSource = record.etlSource
      this.loadData(1)
      createStyle('.vxe-table--tooltip-content{font-size: 18px !important;}')
      this.visible = true
    },


    close() {
      createStyle('.vxe-table--tooltip-content{font-size: 12px !important;}')
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    handleOk() {
      this.getSelectData()
      this.$emit('saveTask', 'select')
    },
    setExcelTable() {
      this.getSelectData()
      console.log(this.selectData)
      this.$emit('setSelectTable')
    },
    getSelectData() {
      let datas = this.getSelect()
      this.selectData.length = 0
      datas.map(item => {
        let bean = Object.assign({}, item);
        this.selectData.push(bean)
      });
    },

  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-modal-footer {
  margin-top: -24px;
}

</style>
