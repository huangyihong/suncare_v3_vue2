<template>
  <m-modal centered
           :title="title"
           width="90%"
           :visible="visible"
           :destroyOnClose="true"
           @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button key="submit1" type="primary" @click="setExcelTable">
        导入选择的医院
      </a-button>
    </template>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="机构名称">
              <a-input placeholder="请输入机构名称" v-model="queryParam.orgname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="机构属性">
              <!--                          <a-input placeholder="请输入机构属性" v-model="queryParam.owntype"></a-input>-->
              <a-select allowClear v-model="queryParam.owntype" placeholder="全部">
<!--                <a-select-option value="''">全部</a-select-option>-->
                <a-select-option v-for="item in owntypeList" :value="item.VALUE" :key="item.VALUE">{{ item.VALUE }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="机构所在地">
              <!--                            <a-input placeholder="请输入机构所在地" v-model="queryParam.localTag"></a-input>-->
              <a-select allowClear v-model="queryParam.localTag" placeholder="全部">
<!--                <a-select-option value="">全部</a-select-option>-->
                <a-select-option v-for="item in localTagList" :value="item.VALUE" :key="item.VALUE">{{ item.VALUE }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="医院等级">
              <!--              <a-input placeholder="请输入医院等级" v-model="queryParam.hosplevel"></a-input>-->
              <a-select allowClear v-model="queryParam.hosplevel" placeholder="全部">
<!--                <a-select-option value="">全部</a-select-option>-->
                <a-select-option v-for="item in hosplevelList" :value="item.VALUE" :key="item.VALUE">{{ item.VALUE }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item label="年度基金支付合计金额 ">
              <div>
                <a-select style="width: 15%" v-model="queryParam.fundValType"
                          allow-clear :default-value="{ key: '>=' }">
                  <a-select-option value=">="> >=</a-select-option>
                  <a-select-option value=">"> ></a-select-option>
                  <a-select-option value="<="> <=</a-select-option>
                  <a-select-option value="<"> <</a-select-option>
                </a-select>
                <a-input style="margin-left:5%;width: 80%" placeholder="请输入年度基金支付合计金额" v-model="queryParam.maxAllfundPay" />
              </div>

<!--              <a-input-number style="width: 100%" placeholder="请输入最小基金支付金额" v-model="queryParam.maxFundpay" />-->
            </a-form-item>
          </a-col>

          <a-col :md="2" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
<!--              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
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
import {httpAction, deleteAction, getAction} from '@/api/manage'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { mapGetters } from 'vuex'

export default {
  name: "OdsCheckorgListForm",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis
  },
  data() {
    return {
      description: '医疗机构选择',
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
          title: '机构名称',
          align: "center",
          dataIndex: 'orgname'
        },
        {
          title: '机构属性',
          align: "center",
          dataIndex: 'owntype'
        },
        {
          title: '机构所在地',
          align: "center",
          dataIndex: 'localTag',
          width: 140,
        },
        {
          title: '医院等级',
          align: "center",
          dataIndex: 'hosplevel',
          width: 140,
        },
        {
          title: '年度基金支付合计金额',
          align: "center",
          dataIndex: 'maxAllfundPay',
          width: 140,
        }

      ],
      ipagination: {
        current: 1,
        pageSize: 50,
        pageSizeOptions: ['10', '20', '30', '50', '100','1000','10000','20000','50000'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      hasSelected: false,
      hasExamine: false,
      visible: false,
      title: '医疗机构选择',
      orgsData: [],
      owntypeList: [],//机构属性列表
      localTagList: [],//机构所在地列表
      hosplevelList: [],
      url: {
        list: "/apiYbChargeSearch/ybChargeSearchTask/getOrgPageList",
        getOrgList: this.$suncare_v3 + "/apiYbChargeSearch/ybChargeSearchTask/getOrgList",
      },
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    scrollY() {
      let y = this.$store.getters.height - 240
      return (y < 200 ? 200 : y) + 'px'
    },

  },
  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {
    show() {
      this.getOwntypeList()
      this.getLocalTagList()
      this.getHosplevelList()
      this.$set(this.queryParam ,'fundValType' ,'>=')
      this.$set(this.queryParam ,'maxAllfundPay' ,'2000000')
      this.ipagination.pageSize = 50;
      this.loadData()
      this.visible = true
    },
    close() {
      this.visible = false;
    },
    handleCancel() {
      this.close()
      this.queryParam = {}
    },

    setExcelTable() {
      this.orgsData = this.selectionRows
      this.$emit('setOrgsData')
      this.visible = false
    },
    //获取机构属性列表
    getOwntypeList() {
      this.owntypeList = []
      getAction(this.url.getOrgList, {
        dataSource: this.userInfo.dataSource,
        taskType: 'queryOwntypeList'
      }).then((res) => {
        if (res.success) {
          this.owntypeList = res.result.filter(item => item.VALUE != null && item.VALUE != '')
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    //获取机构所在地
    getLocalTagList() {
      this.localTagList = []
      getAction(this.url.getOrgList, {
        dataSource: this.userInfo.dataSource,
        taskType: 'queryLocalTagList'
      }).then((res) => {
        if (res.success) {
          this.localTagList = res.result.filter(item => item.VALUE != null && item.VALUE != '')
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    getHosplevelList() {
      this.hosplevelList = []
      getAction(this.url.getOrgList, {
        dataSource: this.userInfo.dataSource,
        taskType: 'queryHosplevelList'
      }).then((res) => {
        if (res.success) {
          this.hosplevelList = res.result.filter(item => item.VALUE != null && item.VALUE != '')
        } else {
          this.$message.warning(res.message);
        }
      })
    },

  },


}

</script>
<style lang="less">

/deep/ .ant-modal-footer {
  margin-top: -24px;
}

</style>
