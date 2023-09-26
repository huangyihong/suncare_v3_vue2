<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQueryFn">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="账号">
              <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
              <j-input placeholder="输入账号模糊查询" v-model="queryParam.username"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="姓名">
              <j-input placeholder="输入姓名模糊查询" v-model="queryParam.realname"></j-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="用户状态">
              <a-select v-model="queryParam.status" placeholder="请选择用户状态查询">
                <a-select-option value="">请选择用户状态</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">解冻</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--
          <a-col :md="6" :sm="8">
            <a-form-item label="性别">
              <a-select v-model="queryParam.sex" placeholder="请选择性别查询">
                <a-select-option value="">请选择性别查询</a-select-option>
                <a-select-option value="1">男性</a-select-option>
                <a-select-option value="2">女性</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          -->

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="所属部门">
                <a-input-search
                  placeholder="点击右侧按钮选择部门"
                  v-model="checkedDepartNameString"
                  readOnly
                  @search="onSearch">
                  <a-button slot="enterButton" icon="search">选择</a-button>
                </a-input-search>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="所属角色">
                <a-select
                  mode="multiple"
                  style="width: 100%"
                  placeholder="请选择所属角色"
                  optionFilterProp = "children"
                  v-model="selectedRole">
                  <a-select-option v-for="(role,roleindex) in roleList" :key="roleindex.toString()"   :value="role.id">
                    {{ role.roleName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


<!--
            <a-col :md="6" :sm="8">
              <a-form-item label="手机号码">
                <a-input placeholder="请输入手机号码查询" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
-->


            <a-col :md="6" :sm="8">
              <a-form-item label="所属系统">
                <m-dict-select-tag placeholder="请选择所属系统" dictCode="SYSTEM_CODE" :showFirstAll="true" :required="false"  class="loginList-select"
                                   v-model="queryParam.querySystemCode"></m-dict-select-tag>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQueryFn" icon="search">查询</a-button>
              <a-button type="primary" @click="searchResetFn" icon="reload" class="m-l-6">重置</a-button>
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
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" v-has="'user:edit'" type="primary" icon="plus">添加用户</a-button>
      <a-button type="primary" icon="import"  @click="handleImportExcel()">导入</a-button>
      <a-button type="primary" icon="download"  @click="handleExportExcel()">导出</a-button>
      <!--
      <a-button type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            删除
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            冻结
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            解冻
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!--
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      -->
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        v-bind="tableAttrs"
        @change="handleTableChange">

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="handleChangePassword(record.username)">密码</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==1">
                <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.id,2,record.username)">
                  <a>冻结</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==2">
                <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.id,1,record.username)">
                  <a>解冻</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="handleAgentSettings(record.username)">代理人</a>
              </a-menu-item>

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <depart-window ref="departWindow" @ok="departModalFormOk"></depart-window>

    <!--导入-->
    <import-modal ref="importModel" @ok="()=>{expandedRowKeys = [];modalFormOk()}"></import-modal>
  </a-card>
</template>

<script>
import UserModal from './modules/UserModal'
import PasswordModal from './modules/PasswordModal'
import {putAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import SysUserAgentModal from "./modules/SysUserAgentModal";
import departWindow from './modules/DepartWindow'
import ImportModal from '@/components/ImportModal'
import moment from "moment"
import {queryall } from '@/api/api'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'

export default {
  name: "UserList",
  mixins: [JeecgListMixin],
  components: {
    SysUserAgentModal,
    MDictSelectTag,
    UserModal,
    PasswordModal,
    departWindow,
    ImportModal,
  },
  data() {
    return {
      description: '这是用户管理页面',
      queryParam: {delFlag:'0',querySystemCode:this.$config.systemCode},
      columns: [
        /*{
          title: '#',
          dataIndex: '',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },*/
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

        /*{
          title: '头像',
          align: "center",
          width: 100,
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
        {
          title: '生日',
          align: "center",
          width: 100,
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
          dataIndex: 'email',
          width: 100,
        },
        // {
        //   title: '所属部门',
        //   align: "left",
        //   dataIndex: 'departs',
        //   width: 200,
        //   ellipsis:true,
        // },
        {
          title: '所属角色',
          align: "left",
          dataIndex: 'roles',
          width: 250,
          ellipsis:true,
        },
        {
          title: '状态',
          align: "center",
          width: 80,
          dataIndex: 'status_dictText'
        },
        /* {
           title: '创建时间',
           align: "center",
           width: 150,
           dataIndex: 'createTime',
           sorter: true
         },*/
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          width: 150,
        }
      ],
      fixedParam:{
        //过滤显示当前系统角色
        querySystemCode:this.$config.systemCode,
      },
      url: {
        imgerver: this.$config['domianURL'] + "/sys/common/view",
        syncUser: "/process/extActProcess/doSyncUser",
        list: "/sys/user/list",
        delete: "/sys/user/delete",
        deleteBatch: "/sys/user/deleteBatch",
        exportXlsUrl: "/sys/user/exportXls",
        importExcelUrl: "sys/user/importExcel",
        importExcel: "sys/user/importExcelNew",
        exportExcel: "sys/user/exportExcelNew",
      },
      selectedDepartKeys:[], //保存用户选择部门id
      checkedDepartKeys:[],
      checkedDepartNames:[], // 保存部门的名称 =>title
      checkedDepartNameString:"", // 保存部门的名称 =>title
      roleList:[],//角色选项
      selectedRole:[],
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  beforeMount () {
    this.fixedParam={}
    this.initialRoleList()
  },
  methods: {
    getAvatarView: function (avatar) {
      return this.url.imgerver + "/" + avatar;
    },

    batchFrozen: function (status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return false;
      } else {
        let ids = "";
        let that = this;
        let isAdmin = false;
        that.selectionRows.forEach(function (row) {
          if (row.username == 'admin') {
            isAdmin = true;
          }
        });
        if (isAdmin) {
          that.$message.warning('管理员账号不允许此操作,请重新选择！');
          return;
        }
        that.selectedRowKeys.forEach(function (val) {
          ids += val + ",";
        });
        that.$confirm({
          title: "确认操作",
          content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
          onOk: function () {
            frozenBatch({ids: ids, status: status}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });
      }
    },
    handleMenuClick(e) {
      if (e.key == 1) {
        this.batchDel();
      } else if (e.key == 2) {
        this.batchFrozen(2);
      } else if (e.key == 3) {
        this.batchFrozen(1);
      }
    },
    handleFrozen: function (id, status, username) {
      let that = this;
      //TODO 后台校验管理员角色
      if ('admin' == username) {
        that.$message.warning('管理员账号不允许此操作！');
        return;
      }
      frozenBatch({ids: id, status: status}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleChangePassword(username) {
      this.$refs.passwordmodal.show(username);
    },
    handleAgentSettings(username){
      this.$refs.sysUserAgentModal.agentSettings(username);
      this.$refs.sysUserAgentModal.title = "用户代理人设置";
    },
    passwordModalOk() {
      //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
    },
    //初始获取角色数据
    initialRoleList(){
      queryall().then((res)=>{
        if(res.success){
          this.roleList = res.result;
          console.log('roleList',this.roleList)
        }else{
          console.log(res.message);
        }
      });
    },
    // 搜索用户对应的部门API
    onSearch(){
      console.log('onSearch')
      this.$refs.departWindow.add(this.checkedDepartKeys,'');
    },
    // 获取用户对应部门弹出框提交给返回的数据
    departModalFormOk (formData) {
      this.checkedDepartNames = [];
      this.selectedDepartKeys = [];
      this.checkedDepartNameString = '';
      for (let i = 0; i < formData.departIdList.length; i++) {
        this.selectedDepartKeys.push(formData.departIdList[i].key);
        this.checkedDepartNames.push(formData.departIdList[i].title);
        this.checkedDepartNameString = this.checkedDepartNames.join(",");
      }
      this.checkedDepartKeys = this.selectedDepartKeys  //更新当前的选择keys
    },
    //重写查询
    searchQueryFn(){
      this.queryParam.selecteddeparts = this.selectedDepartKeys.length>0?this.selectedDepartKeys.join(","):'';
      this.queryParam.selectedroles = this.selectedRole.length>0?this.selectedRole.join(","):'';
      this.searchQuery()
    },
    //重写重置
    searchResetFn(){
      //清空选择的所属部门
      this.checkedDepartNames = [];
      this.checkedDepartNameString='';
      this.checkedDepartKeys = [];
      this.selectedDepartKeys = [];
      //清空选择的所属角色
      this.selectedRole = [];
      this.searchReset()
    },
    //导出
    handleExportExcel() {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.url.exportXlsUrl=this.url.exportExcel
      this.handleExportFile('用户信息' + moment().format('YYYYMMDDHHmmss')+'.xlsx')
    },
    //导入
    handleImportExcel() {
      let param = {
        title: '用户信息导入',
        importUrl: this.url.importExcel,
        actionType: 'add',
        uploadFileName: 'SYS_USER.xlsx'
      }
      this.$refs.importModel.loadData(param);
    },

  }

}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
