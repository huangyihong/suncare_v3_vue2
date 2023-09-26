<template>
  <div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="账号">
              <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
              <j-input placeholder="输入账号模糊查询" v-model="queryParam.username"></j-input>
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="8" :sm="12">
            <a-form-item label="性别">
              <a-select v-model="queryParam.sex" placeholder="请选择性别查询">
                <a-select-option value="">请选择性别查询</a-select-option>
                <a-select-option value="1">男性</a-select-option>
                <a-select-option value="2">女性</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>


          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="邮箱">
                <a-input placeholder="请输入邮箱查询" v-model="queryParam.email"></a-input>
              </a-form-item>
            </a-col>

            <a-col :xl="6" :lg="8" :sm="12">
              <a-form-item label="手机号码">
                <a-input placeholder="请输入手机号码查询" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :xl="6" :lg="8" :sm="12">
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

    <!-- 操作按钮区域 -->
    <div>
      <template v-if="selectType === 'checkbox'">
        <selected-tag :selectedRowRecords="selectedRowRecords" :code="code" :name="name"
                      v-on="selectActionOn"></selected-tag>
      </template>
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys,...selectRowsEvent,...rowSelection,type:selectType}"
        :scroll="{ x: scrollX, y: scrollY}"
        v-bind="tableAttrs"
        @change="handleTableChange">
        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

      </a-table>
    </div>
  </div>
</template>

<script>
  import {putAction} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  import { multiSelectIdMatchMixin } from '@/pages/selectMulti/commonMixin'

  export default {
    name: "UserList",
    mixins: [JeecgListMixin,multiSelectIdMatchMixin],
    props:{
      selectType: {
        type: String,
        default: 'checkbox'
      },
    },
    components: {
    },
    data() {
      return {
        description: '这是用户管理页面',
        queryParam: {},
        columns: [
          {
            title: '用户账号',
            align: "center",
            dataIndex: 'username',
            width: 120
          },
          {
            title: '真实姓名',
            align: "center",
            width: 100,
            dataIndex: 'realname',
          },
          {
            title: '头像',
            align: "center",
            width: 120,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },

          {
            title: '性别',
            align: "center",
            width: 80,
            dataIndex: 'sex_dictText',
            sorter: true
          },
          /*{
            title: '生日',
            align: "center",
            width: 180,
            dataIndex: 'birthday'
          },*/
          {
            title: '手机号码',
            align: "center",
            width: 100,
            dataIndex: 'phone'
          },
          {
            title: '邮箱',
            align: "center",
            dataIndex: 'email'
          },

          /*{
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'status_dictText'
          },*/
         /* {
            title: '创建时间',
            align: "center",
            width: 150,
            dataIndex: 'createTime',
            sorter: true
          },*/

        ],
        url: {
          imgerver: this.$config['domianURL'] + "/sys/common/view",
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
        },
        /* 排序参数 */
        /*isorter: {
          column: 'drugNames',
          order: 'asc',
        },*/
        fixedParam: {status: '1'},
        name: 'realname',
        code: 'username',
      }
    },
    methods: {
      getAvatarView: function (avatar) {
        return this.url.imgerver + "/" + avatar;
      },
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
