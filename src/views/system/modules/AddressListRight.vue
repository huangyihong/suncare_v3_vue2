<template>
  <a-card class="j-address-list-right-card-box" :loading="cardLoading" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">

          <a-col :md="6" :sm="12">
            <a-form-item label="姓名" style="margin-left:8px">
              <a-input placeholder="请输入姓名查询" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>


          <a-col :md="6" :sm="12">
            <a-form-item label="工号" style="margin-left:8px">
              <a-input placeholder="请输入工号查询" v-model="queryParam.workNo"></a-input>
            </a-form-item>
          </a-col>

          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
             <a-button type="primary" @click="searchQuery" icon="search" style="margin-left: 18px">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" class="m-l-6">重置</a-button>
              <reorder-btn :columns="columns" :isorter="isorter" class="m-l-6"
                    @ok="val => {isorter = val;loadData(1)}">排序</reorder-btn>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="userId"
      :pagination="ipagination"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      @change="handleTableChange"
      v-bind="tableAttrs">
    </a-table>

  </a-card>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'AddressListRight',
    mixins: [JeecgListMixin],
    components: {},
    props: ['value'],
    data() {
      return {
        description: '用户信息',
        cardLoading: true,
        positionInfo: {},
        columns: [
          {
            title: '#',
            key: 'rowIndex',
            dataIndex: '',
            width: 60,
            align: 'center',
            customRender: (t, r, i) => parseInt(i) + 1
          },
          {
            title: '部门',
            width: '20%',
            align: 'center',
            dataIndex: 'departName'
          },
          {
            title: '姓名',
            width: '15%',
            align: 'center',
            dataIndex: 'realname'
          },
          {
            title: '工号',
            width: '15%',
            align: 'center',
            dataIndex: 'workNo'
          },
          {
            title: '职务',
            width: '15%',
            align: 'center',
            dataIndex: 'post',
            customRender: (text) => (text || '').split(',').map(t => this.positionInfo[t] ? this.positionInfo[t] : t).join(',')
          },
          {
            title: '座机',
            width: '15%',
            align: 'center',
            dataIndex: 'telephone'
          },
          // {
          //   title: '手机号',
          //   width: '12%',
          //   align: 'center',
          //   dataIndex: 'phone'
          // },
          {
            title: '公司邮箱',
            width: '15%',
            align: 'center',
            dataIndex: 'email'
          }
        ],
        url: {
          list: '/sys/user/queryByOrgCodeForAddressList',
          listByPosition: '/sys/position/list'
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(orgCode) {
          this.dataSource = []
          this.loadData(1, orgCode)
        }
      },
    },
    beforeMount() {
      this.queryPositionInfo()
    },
    methods: {

      loadData(pageNum, orgCode) {
        if (!orgCode) {
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (pageNum === 1) {
          this.ipagination.current = 1
        }
        this.loading = true
        getAction(this.url.list, {
          orgCode,
          ...this.getQueryParams()
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
          this.cardLoading = false
        })
      },

      searchQuery() {
        this.loadData(1, this.value)
      },
      searchReset() {
        this.queryParam = {}
        this.loadData(1, this.value)
      },

      handleTableChange(pagination, filters, sorter) {
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadData(null, this.value)
      },

      // 查询职务信息
      queryPositionInfo() {
        getAction(this.url.listByPosition, { pageSize: 99999 }).then(res => {
          if (res.success) {
            let positionInfo = {}
            res.result.records.forEach(record => {
              positionInfo[record['code']] = record['name']
            })
            this.positionInfo = positionInfo
          }
        })
      }

    }
  }
</script>
<style>
  .j-address-list-right-card-box .ant-table-placeholder {
    min-height: 46px;
  }
</style>
<style scoped>
  .j-address-list-right-card-box {
    height: 100%;
    min-height: 300px;
  }
</style>