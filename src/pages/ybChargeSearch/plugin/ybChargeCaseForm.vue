<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="项目关键词">
              <a-input placeholder="请输入项目关键词" v-model="queryParam.itemname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目编码（国家码）">
              <j-input placeholder="请输入项目编码（国家码）" v-model="queryParam.itemCode"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="整理人">
              <j-input placeholder="请输入整理人" v-model="queryParam.sorter"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="违规项目">
                <j-input placeholder="请输入违规项目" v-model="queryParam.wgItemName"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="违规类型">
                <j-input placeholder="请输入违规类型" v-model="queryParam.wgType"></j-input>
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
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        v-bind="tableAttrs"
        @change="handleTableChange">
      </a-table>

    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>

import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, deleteAction, getAction} from '@/api/manage'
import JEllipsis from '@/components/jeecg/JEllipsis'
import {createStyle} from '@/api/optionStyle'
export default {
  name: "ybChargeCaseForm",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis
  },
  props: ['paramData'],
  data() {
    return {
      description: '违规案例库管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
        {
          title: '违规类型',
          align: "center",
          dataIndex: 'wgType'
        },
        {
          title: '项目编码（国家码）',
          align: "center",
          dataIndex: 'itemCode'
        },
        {
          title: '违规项目',
          align: "center",
          dataIndex: 'wgItemName',
          width: 140,
        },
        {
          title: '项目关键词',
          align: "center",
          dataIndex: 'itemname',
          width: 140,
        },
        {
          title: '违规描述',
          align: "center",
          dataIndex: 'wgDescription',
          width: 140,
        },
        {
          title: '政策依据',
          align: "center",
          dataIndex: 'policyBasis'
        },
        {
          title: '所属地区',
          align: "center",
          dataIndex: 'region'
        },
        {
          title: '所属时间',
          align: "center",
          dataIndex: 'startdate',
          customRender: (text, record, index) => {
            let html = '';
            if(record.startdate){
              html =  record.startdate;
            }
            if(record.startdate || record.enddate) {
              html += '到';
            }
            if(record.enddate){
              html += record.enddate;
            }
            return html
          }
        },
        {
          title: '整理人',
          align: "center",
          dataIndex: 'sorter'
        },

      ],
      hasSelected: false,
      hasExamine: false,
      visible: false,
      title: '项目相关案例',
      url: {
        list: "/ybChargeSearch/ybChargeCase/list",
        delete: "/ybChargeSearch/ybChargeCase/delete",
        deleteBatch: "/ybChargeSearch/ybChargeCase/deleteBatch",
        exportXlsUrl: "ybChargeSearch/ybChargeCase/exportXls",
        importExcelUrl: "ybChargeSearch/ybChargeCase/importExcel",
        batchExamine: "ybChargeSearch/ybChargeCase/batchExamine"
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    let itemname = ''
    this.paramData.filter(item => item.itemname)
      .forEach(val => {
        if (itemname) {
          itemname = itemname + "#" + val.itemname
        } else {
          itemname = val.itemname
        }

      })
    this.queryParam.itemname = itemname
    console.log("this.queryParam.itemname==", this.queryParam.itemname)

  },
  mounted() {
    createStyle('.vxe-table--tooltip-content{font-size: 18px !important;}')
    this.$forceUpdate()
  },
  methods: {
    close() {
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },

  },
  beforeDestroy() {
    createStyle('.vxe-table--tooltip-content{font-size: 12px !important;}')
    this.$forceUpdate()
  }


}

</script>
<style lang="less">

/deep/ .ant-modal-footer {
  margin-top: -24px;
}

</style>
