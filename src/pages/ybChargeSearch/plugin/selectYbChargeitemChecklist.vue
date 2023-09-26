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
            <a-form-item label="收费项目A关键字">
              <a-input placeholder="请输入收费项目A关键字模糊查询" v-model="queryParam.itemname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="收费项目B关键字">
              <a-input placeholder="请输入收费项目B关键字模糊查询" v-model="queryParam.itemname1"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="整理人">
              <a-input placeholder="请输入整理人" v-model="queryParam.sorter"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目名称类型">
                <m-dict-select-tag placeholder="请选择收费项目名称类型" dictCode="ITEM_TYPE"
                                   v-model="queryParam.itemType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="重复收费类型">
                <m-dict-select-tag placeholder="请选择重复收费类型" dictCode="ITEM1_TYPE"
                                   v-model="queryParam.item1Type"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="收费项目B违规判断">
                <m-dict-select-tag placeholder="请选择收费项目B违规判断" dictCode="ITEM1_WGTYPE"
                                   v-model="queryParam.item1Wgtype"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="超量检查的类型">
                <m-dict-select-tag placeholder="请选择超量检查的类型目" dictCode="QTY_TYPE"
                                   v-model="queryParam.qtyType"></m-dict-select-tag>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="超量的数值(不含)）">
                <a-input placeholder="超量的数值(不含)" v-model="queryParam.qtyNum"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否输出同一天的手术项目">
                <m-dict-select-tag placeholder="请选择是否输出同一天的手术项目" dictCode="YESNO"
                                   v-model="queryParam.isSameDay"></m-dict-select-tag>
              </a-form-item>
            </a-col>

          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
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
import {checklistCols} from '@/pages/ybChargeSearch/mixins/checklistCols'
import moment from "moment"
import {createStyle} from '@/api/optionStyle'

export default {
  name: "selectYbChargeitemChecklist",
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
      description: '检索关键字页面',
      ipagination: {pageSize: 20},
      title: '从医院存在的收费项目中匹配关键字库的内容',
      // 表头
      columns: [
        ...checklistCols,

      ],
      url: {
        list: "/ybChargeSearch/ybChargeitemChecklist/keyWordsImportList",
      },
      id: 'id',
      code: 'id',
      name: 'itemname',
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
        bean.wgRemark = item.wgCaseExample
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
