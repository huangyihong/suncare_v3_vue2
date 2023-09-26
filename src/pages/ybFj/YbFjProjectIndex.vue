<template>
  <div>
    <a-row :gutter="16">
      <a-col :md="6" :sm="6" >
        <a-card  :bordered="false" style="margin-top:10px;min-height:800px;">
          <a-button type="primary" @click="handleAdd1" style="width:100%">新建线上检查管理</a-button>
          <div style="font-size:16px;font-weight:bold" class="m-t-20">已建立检查计划</div>
          <div class="m-t-10 disRow">
            <a-select v-model="searchField" style="width: 160px">
              <a-select-option value="projectName"> 检查名称 </a-select-option>
              <a-select-option value="projectNo"> 检查编号 </a-select-option>
              <a-select-option value="actionFzr"> 负责人 </a-select-option>
            </a-select>
            <a-input-search class="m-l-10" v-model="searchValue" @search="onSearch"></a-input-search>
          </div>

          <!-- 列表 -->
          <template v-for="(item,index) in projectList" >
            <a-divider dashed v-if="index>0" style="margin: 0"/>
            <div class="list-box m-t-10" :key="item.projectId" :class="[item.projectId == selectProjectId ? 'selectColor' : '']" @click="selectProject(item.projectId)">
              <div class="disCC  ">
                <span class="text-ellipsis">{{item.projectName}}</span>
                <span style="width:60px">{{item.projectState_dictText}} </span>
              </div>
              <div class="disCC  ">
                <span class="text-ellipsis">{{item.projectNo}}</span>
                <div style="width:160px">
                  <span class="m-r-20">{{item.actionFzr}}</span>
                  <span >{{item.createTime.substring(0,10)}}</span>
                </div>
              </div>
            </div>
          </template>
          <!-- 分页 -->
          <a-pagination size="small" :current="current" :total="totalPage" :page-size="10" @change="changePage" v-if="totalPage > 0" class="m-t-10 t-r" />
        </a-card>
      </a-col>
      <a-col :md="18" :sm="18" style="padding-left:0px">
        <a-card  :bordered="false" class="m-t-10"  v-if="selectProjectBean.projectId">
          <project-info :item="selectProjectBean">
            <div slot="eidtProjectBtn" style="display: flex" v-if="selectProjectBean.projectState!='finish'">
              <div class="m-t-10 ft-12 editBtn" @click="handleEdit1(item)">编辑</div>
              <a-popconfirm title="确定删除当前检查计划信息?" @confirm="() => handleDelete1(selectProjectBean.projectId)">
                <div class="m-t-10 m-l-10 ft-12 delBtn">删除</div>
              </a-popconfirm>
            </div>
          </project-info>
          <div style="float:right;" class="m-t-10">
            <a-button  @click="handleCopyAdd1(selectProjectBean)" class="m-r-10" >复制</a-button>
            <a-button  @click="selectStateVisible=true" class="m-r-10" >检查归档</a-button>

            <a-modal
              title="选择归档状态"
              width="400px"
              :visible="selectStateVisible"
              @ok="handleStateOk"
              @cancel="selectStateVisible=false"
              cancelText="关闭">
              <a-radio-group v-model="projectState" class="w-b-100">
                <a-radio value="finish" v-if="selectProjectBean.projectState!='finish'">归档</a-radio>
                <a-radio value="close" v-if="selectProjectBean.projectState!='close'">关闭</a-radio>
                <a-radio value="init" v-if="selectProjectBean.projectState=='close'">开启</a-radio>
              </a-radio-group>
            </a-modal>
          </div>

          <div class="tabBox" >
            <div @click="tabCard(1)" :class="[isActive == 1 ? 'activeBtn' : 'tabBtn']">
              <a-icon type="check-square" class="m-r-6" />医院检查
            </div>
            <div :class="[isActive == 2 ? 'activeBtn' : 'tabBtn']" @click="tabCard(2)" class="m-l-20">
              <a-icon type="folder-add" class="m-r-6" />文档管理
            </div>
          </div>


          <!-- 线索总量 -->
          <div v-if="isActive == 1">
            <a-spin :spinning="orgLoading">
              <div class="m-t-10 m-b-10" style="font-size: 12px;color: #989898;">当前共管理线索 {{projectClueAmount}} 条</div>
              <a-button type="primary" @click="handleEdit1(selectProjectBean)" class="m-r-10">添加医院</a-button>
              <a-dropdown>
                <a class="ant-dropdown-link">更多操作 <a-icon type="down" /></a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="batchChargeOrgState('finish')">批量归档</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="batchChargeOrgState('close')">批量关闭</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定批量删除选中的医院信息吗?" @confirm="batchDelOrg(selectProjectBean.projectId)">
                      <a>批量删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <div class="m-t-20"></div>
              <!-- 表格 -->
              <a-table rowKey="projectOrgId" :columns="columns" :data-source="selectData"
                       :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :showHeader="false"
                       :pagination="ipagination" class="orgTable" @expand="handleExpand">
              <span slot="orgName" slot-scope="text, record">
                <span style="font-size:16px;font-weight: bold">{{text}}</span><br>
                <span style="font-size:10px;color:grey">医院社会信用编码:{{record.socialCode}}</span>
              </span>
                <span slot="state" slot-scope="text, record">
                <span v-if="text=='init'"><a-badge status="processing"/> 待归档</span>
                <span v-else-if="text=='finish'"><a-badge status="success" /> 已归档</span>
                <span v-else-if="text=='close'"><a-badge status="default"/> 关闭</span>
              </span>
                <span slot="updateTime" slot-scope="text, record">
                 <span style="font-size:10px;color:grey">状态更新: {{text}}</span>
              </span>
                <span slot="action" slot-scope="text, record">
              <a-button type="primary" @click="goProcess(record.projectId,record.projectOrgId)" class="m-r-10">管理</a-button>
              <a-divider type="vertical" />
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item v-if="record.state!='finish'">
                    <a @click="chargeOrgState(record.projectOrgId,'finish')">归档</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.state!='close'">
                    <a @click="chargeOrgState(record.projectOrgId,'close')">关闭</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.state=='close'">
                    <a @click="chargeOrgState(record.projectOrgId,'init')">开启</a>
                  </a-menu-item>
                  <a-menu-item v-if="record.state!='finish'">
                    <a-popconfirm title="确定删除当前检查计划的医院信息吗?" @confirm="() => handleDeleteOrg(record.projectId,record.orgId)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
                <a> 更多 </a>
              </a-dropdown>
            </span>
                <div slot="expandedRowRender" slot-scope="record">
                  <a-spin :spinning="!record.innerData">
                    <a-table   :columns="innerColumns" :data-source="record.innerData?record.innerData:[]"
                               :pagination="false" :hideTools="true">
                    </a-table>
                  </a-spin>
                </div>


              </a-table>
            </a-spin>
          </div>

          <!-- 文档管理 -->
          <div v-if="isActive == 2" >
            <clueFile ref="clueFileModel" :projectId="selectProjectBean.projectId" processStep="project"></clueFile>

          </div>

        </a-card>
      </a-col>
    </a-row>

    <!-- 新建项目 -->
    <YbFjProjectModal ref="modalForm" @ok="modalFormOk"></YbFjProjectModal>
  </div>
</template>

<script>
import {getAction,httpAction,deleteAction  } from '@/api/manage'
import {postAction} from '@/api-sv3/manage'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import YbFjProjectModal from './modules/YbFjProjectModal'
import ProjectInfo from "./plugin/projectInfo";
import clueFile from "./plugin/clueFile";
export default {
  name: "YbFjProjectIndex",
  mixins: [JeecgListMixin],
  components: {
    ProjectInfo,
    YbFjProjectModal,
    clueFile
  },
  data () {
    return {
      description: '检查流程管理',
      // 表头
      columns: [
        {
          title: '',
          align: "left",
          dataIndex: 'orgName',
          scopedSlots: { customRender: 'orgName' },
        },
        {
          title: '',
          align: "center",
          dataIndex: 'state',
          width:'200px',
          scopedSlots: { customRender: 'state' },
        },
        {
          title: '',
          align: "center",
          fixed:'right',
          width:'100px',
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' },
        },

        {
          title: '',
          dataIndex: 'action',
          align: "center",
          fixed:'right',
          width:'100px',
          scopedSlots: { customRender: 'action' },
        },

      ],
      innerColumns: [
        { title: '线索条数', dataIndex: 'caseAmount',customRender: t => t?t:'---' },
        { title: '线索关联人次', dataIndex: 'casePersonCnt',customRender: t => t?t:'---' },
        { title: '线索总金额', dataIndex: 'caseFee',customRender: t => t?t:'---' },
        { title: '问题类型', dataIndex: 'issueSubtype',customRender: t => t?t:'---' },
        { title: '检查报告线索数', dataIndex: 'caseAmount2',customRender: t => t?t:'---'},
        { title: '医院已核减线索金额', dataIndex: 'cutFee' ,customRender: t => t?t:'---'},
        { title: '检查报告线索金额', dataIndex: 'caseFee2' ,customRender: t => t?t:'---'},

      ],

      url: {
        list: "/fj/project/list",
        orgList: "/fj/project/orgList",
        delete: "/fj/project/delete",
        removeOrg: "/fj/project/org/remove",
        chargeOrgState: "/fj/project/org/chargeState",
        chargeState: "/fj/project/chargeState",
        statProjectClueAmount: "/fj/clue/statProjectClueAmount",
        stat: "/fj/clue/stat",
      },
      totalPage: 0,
      current: 1,
      projectList:[],
      dictOptins:{},
      selectProjectId:'',//选中的检查项目
      selectProjectBean:{},
      isActive: 1,


      selectedRowKeys: [],
      initLoad: false,
      dataSource1: [],
      isChangeTab:1,
      selectData:[],//机构数据
      projectClueAmount:0,


      searchField:'projectName',
      searchValue:'',
      orgLoading:false,

      selectStateVisible:false,
      projectState:'',

    }
  },
  computed: {

  },
  beforeMount() {
    //获取检查列表
    this.getProjectList()
  },
  methods: {
    handleAdd1 () {
      this.handleAdd()
      this.$refs.modalForm.title = '新建检查计划'
    },
    handleEdit1 (item) {
      this.handleEdit(item)
      this.$refs.modalForm.title = '编辑检查计划'
    },
    handleDelete1(id){
      this.loading = true
      deleteAction(this.url.delete, { id: id }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.selectProjectId = ''
          this.selectProjectBean = {}
          this.getProjectList()
        } else {
          this.loading = false
          this.$message.warning(res.message)
        }
      })
    },
    handleDeleteOrg(projectId,orgIds){
      this.loading = true
      deleteAction(this.url.removeOrg, { projectId,orgIds}).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadOrgData(projectId)
          this.onClearSelected()
        } else {
          this.loading = false
          this.$message.warning(res.message)
        }
      })
    },
    batchDelOrg(projectId){
      if(this.selectedRowKeys.length===0){
        this.$message.error("请您至少选择一条记录进行操作")
        return
      }
      let orgIds = []
      this.selectionRows.forEach(item=>{
        orgIds.push(item.orgId)
      })
      this.handleDeleteOrg(projectId,orgIds.join(','))

    },
    handleCopyAdd1(item){
      let record = {...item}
      delete record.projectId
      delete record.createTime
      delete record.createUser
      delete record.createUsername
      delete record.updateTime
      delete record.updateUser
      delete record.updateUsername
      this.$refs.modalForm.readonly = false
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '复制新增'
      this.$refs.modalForm.loadOrgData(item.projectId)
    },
    //获取检查列表
    getProjectList(params){
      this.projectList = []
      if(!params){
        params = {}
      }
      params.pageNo = this.current
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.projectList = res.result.records
          this.totalPage = res.result.total
          if(!this.selectProjectId&&this.projectList.length>0){
            this.selectProject(this.projectList[0].projectId)
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    onSearch(){
      let params = {}
      if(this.searchValue){
        params[this.searchField] = `*${this.searchValue}*`
      }
      this.current = 1
      this.getProjectList(params)
    },

    changePage (v) {
      this.current = v
      this.getProjectList()
    },

    modalFormOk(){
      this.getProjectList()
      this.selectProject(this.selectProjectId)
    },

    tabCard (v) {
      this.isActive = v
      this.$forceUpdate()
    },

    selectProject(projectId){
      this.selectProjectId = projectId
      let selectArr = this.projectList.filter(t=>t.projectId==projectId)
      this.selectProjectBean = selectArr.length>0?selectArr[0]:{}
      this.loadOrgData(this.selectProjectId)
      //获取医院当前线索数
      this.getStatProjectClueAmount(this.selectProjectId)
    },

    loadOrgData(projectId) {
      if(!projectId){
        this.selectData = []
        return
      }
      this.orgLoading = true
      getAction(this.url.orgList, { projectId }).then(res => {
        if (res.success) {
          this.selectData = res.result.records
        } else {
          this.$message.warning(res.message);
        }
      }).finally(()=>{
        this.orgLoading = false
      })
    },
    getStatProjectClueAmount(projectId){
      this.projectClueAmount = 0
      if(!projectId){
        return
      }
      getAction(this.url.statProjectClueAmount, { projectId }).then(res => {
        if (res.success) {
          this.projectClueAmount = res.result
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded&&!record.innerData) {
        this.getInnerData(record.projectOrgId,record)
      }
    },
    getInnerData(projectOrgId,record){
      if(!projectOrgId){
        return
      }
      getAction(this.url.stat, { projectOrgId }).then(res => {
        if (res.success) {
          let data = {}
          if(res.result.submit){
            data = res.result.submit
          }
          if(res.result.onsite){
            data.caseAmount2=res.result.onsite.caseAmount
            data.cutFee=res.result.onsite.cutFee
            data.caseFee2=res.result.onsite.caseFee
          }
          record.innerData = [data]
          let selectIndex = 0
          this.selectData.forEach((item,index) =>{
            if(item.projectOrgId==record.projectOrgId){
              selectIndex = index
            }
          })
          this.$set(this.selectData,selectIndex,record)
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    //检查机构状态修改
    chargeOrgState(projectOrgIds,state){
      this.orgLoading = true
      postAction(this.url.chargeOrgState, { projectOrgIds,state }).then(res => {
        if (res.success) {
          this.loadOrgData(this.selectProjectId)
          this.$message.success('状态更改成功')
          this.onClearSelected()
        } else {
          this.$message.warning(res.message);
        }
        this.orgLoading = false
      })
    },
    batchChargeOrgState(state){
      if(this.selectedRowKeys.length===0){
        this.$message.error("请您至少选择一条记录进行操作")
        return
      }
      let projectOrgIds = []
      this.selectionRows.forEach(item=>{
        console.log('state',state)
        console.log('item.state',item.state)
        if(item.state!=state){
          projectOrgIds.push(item.projectOrgId)
        }
      })
      if(projectOrgIds.length==0){
        this.$message.error("没有需要改变状态的数据")
        return
      }
      this.chargeOrgState(projectOrgIds.join(','),state)

    },
    handleStateOk(){
      if(this.projectState){
        postAction(this.url.chargeState, { projectIds:this.selectProjectId,state:this.projectState }).then(res => {
          if (res.success) {
            this.selectStateVisible = false
            this.getProjectList()
            this.$message.success('状态更改成功')
          } else {
            this.$message.warning(res.message);
          }
        })
      }else{
        this.$message.warning('请选择状态');
      }
    },

    //检查全流程
    goProcess(projectId,projectOrgId){
      this.$router.push({ path:'/ybFjProject/process',query: {projectId,projectOrgId} })
    },


  }
}
</script>
<style lang="less" scoped>
  .disRow {
    display: flex;
    flex-direction: row
  }

  .disCC {
    display: flex;
    justify-content: space-between;
    align-items: center
  }

  .list-box {
    padding: 10px 10px;

  }

  .list-box:hover {
    background-color:#daeff97a;
    cursor: pointer;
  }

  .editBtn {
    color: #1890ff;
    cursor: pointer;
  }

  .delBtn {
    color: #f3191c;
    cursor: pointer;
  }


  .tabBox {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    width: 240px;
    background: rgba(162,166,169,0.2);
    padding: 6px 10px;
    margin-top: 10px;
    border-radius: 5px
  }

  .tabBtn {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #333;
    border-radius: 5px;
    width: 48%;
    cursor: pointer;
    padding: 10px;
  }

  .activeBtn {
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #1890ff;
    background: #fff;
    padding: 10px;
    width: 48%;
    cursor: pointer;

  }
  .changTabBox{

    cursor: pointer;
  }
  .changTab {
    line-height: 48px;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    background: rgba(187, 217, 239, 0.1);
  }
  .activeTab{

    line-height: 48px;
    text-align: center;
    border-bottom: 1px solid #dbdbdb;
    background: rgba(66, 170, 245, 1);
    color:#fff

  }
  .selectColor{
    background-color:#daeff97a;
  }
  .orgTable{
    /deep/ .vxe-body--row {
      height:70px;
    }
  }

  .text-ellipsis{
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }

</style>

