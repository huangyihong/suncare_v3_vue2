<template>
  <a-card :bordered="false">
    <div v-show="!showDetail">
      <a-spin :spinning="confirmLoading">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
      </div>



      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button @click="handleAddFn()" type="primary" icon="plus">新增</a-button>

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
          :scroll="{ x: scrollX, y: 'calc(100vh - 250px)' }"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          v-bind="tableAttrs"
          @change="handleTableChange">
          <span slot="startdate" slot-scope="text, record">
            {{record.startdate}}至{{record.enddate}}
          </span>
          <span slot="groupNum" slot-scope="text, record">
            <a  @click="showVisitDrgList(record,true)" v-if="record.status=='normal'">{{text}}</a>
          </span>
          <span slot="nogroupNum" slot-scope="text, record">
            <a  @click="showVisitDrgList(record,false)" v-if="record.status=='normal'">{{text}}</a>
          </span>
          <span slot="rate" slot-scope="text, record">
            <span v-if="record.status=='normal'">{{(text*100).toFixed(2)}}%</span>
          </span>
          <span slot="status" slot-scope="text, record, index">
            <span v-if="text=='running'"><a-badge status="processing"/> 进行中</span>
            <span v-else-if="text=='normal'"><a-badge status="success" /> 正常</span>
            <span v-else-if="text=='abnormal'"><a-badge status="red"/> 异常</span>
            <span v-else-if="text=='init'"><a-badge status="default"/> 待处理</span>
            <span v-else><a-badge status="default"/> 等待</span>
          </span>
          <span slot="action" slot-scope="text, record">
            <template v-if="record.status=='abnormal'||record.status=='normal'|record.status=='init'">
            <a @click="handleEditFn(record)">编辑</a>
            <a-divider type="vertical"/>
            </template>
            <template v-if="record.status!='running'">
            <a-popconfirm title="确定删除当前分组任务 吗?" @confirm="() => handleDelete(record.id)">
              <a size="small">删除</a>
            </a-popconfirm>
            </template>
            <template v-if="record.status=='abnormal'||record.status=='normal'">
              <a-divider type="vertical"/>
              <a-popconfirm title="确定重跑吗?" @confirm="() => handleReRun(record)">
                 <a>重跑</a>
             </a-popconfirm>
            </template>
            <template v-else-if="record.status=='init'">
              <a-divider type="vertical"/>
              <a-popconfirm title="确定运行吗?" @confirm="() => handleReRun(record)">
                 <a>运行</a>
             </a-popconfirm>
            </template>

          </span>

        </a-table>
      </div>
      <!-- table区域-end -->

      <!-- 表单区域 -->
      <DrgTaskModal  ref="modalForm" @ok="modalFormOk"></DrgTaskModal>
      </a-spin>
    </div>

    <div v-if="showDetail">
      <a  @click="showDetail=false">
        <span class="ft-16"><</span> 返回
      </a>
      <VisitDrgList ref="visitDrgList" style="margin-top: 10px"></VisitDrgList>
    </div>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {httpAction, getAction, putAction} from '@/api/manage'
import MDictSelectTag from '@/components/dict_medical/MDictSelectTag'
import DrgTaskModal from './modules/DrgTaskModal'
import VisitDrgList from './plugin/VisitDrgList'
import { chatWebSocketMixin } from '@/mixins/webSocket/chatWebSocketMixin'

export default {
  name: "DrgTaskList",
  mixins: [JeecgListMixin,chatWebSocketMixin],
  components: {
    MDictSelectTag,
    DrgTaskModal,
    VisitDrgList
  },
  data() {
    return {
      description: 'DRG分组任务管理',
      // 表头
      columns: [
         {title: '批次号',
          align: "center",
          dataIndex: 'batchId',
          width: '180px'
        },{
          title: '分组数据入院日期',
          align: "center",
          dataIndex: 'startdate',
          width: '190px',
          scopedSlots: {customRender: 'startdate'}
        },{
          title: 'DRG目录版本',
          align: "center",
          dataIndex: 'drgCatalogVText',
          width: '200px'
        },{
          title: 'DRG分组逻辑版本',
          align: "center",
          dataIndex: 'logicV_dictText',
          width: '150px'
        },{
          title: '医疗机构数量',
          align: "center",
          dataIndex: 'orgs',
          width: '120px',
          customRender: t => t?t.split(',').length:'全部'
        },{
          title: '入组病历数量',
          align: "center",
          dataIndex: 'groupNum',
          width: '120px',
          scopedSlots: {customRender: 'groupNum'}
        },{
          title: '未入组病历数量',
          align: "center",
          dataIndex: 'nogroupNum',
          width: '120px',
          scopedSlots: {customRender: 'nogroupNum'}
        },{
          title: '总体病例入组率',
          align: "center",
          dataIndex: 'rate',
          width: '120px',
          scopedSlots: {customRender: 'rate'},
          customRender: t => (t*100).toFixed(2)+'%',
        },{
          title: '运行状态',
          align: "center",
          dataIndex: 'status',
          width: '120px',
          scopedSlots: {customRender: 'status'}
        },{
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: '200px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      url: {
        list: "/drg/drgTask/list",
        delete: '/drg/drgTask/delete',
        edit: "/drg/drgTask/edit",
      },
      initLoad:false,
      showDetail:false,
      confirmLoading:false,

    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  beforeMount() {
    this.fixedParam.dataSource = this.userInfo.dataSource
    this.loadData(1)
    this.initWebSocket();
    this.heartCheckFun();
  },

  methods: {
    handleAddFn(){
      this.handleAdd()
      this.$refs.modalForm.title='新建DRG分组任务'
    },
    handleEditFn(record){
      this.handleEdit(record)
      this.$refs.modalForm.title='编辑DRG分组任务'
    },
    showVisitDrgList(record,isDrg){
      this.showDetail = true
      this.$nextTick(() => {
        this.$refs.visitDrgList.showData(record,isDrg)
      })
    },
    handleReRun(record){
      this.confirmLoading = true;
      httpAction(this.url.edit,{id:record.id,isRun:1},'put').then((res)=>{
        if(res.success){
          this.modalFormOk()
          this.$message.success(res.message);
        }else{
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },
    //websocket获取信息
    websocketonmessage: function(e) {
      var data = eval("(" + e.data + ")"); //解析对象
      if (data.cmd === 'drg') {
        let batchId = data.batchId
        if(this.dataSource.filter(t=>t.batchId==batchId).length>0){
          this.loadData()
        }
      }
      //心跳检测重置
      this.heartCheck.reset().start();
    },


  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
