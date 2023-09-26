import { mapGetters } from 'vuex'
import {getAction } from '@/api/manage'
import ImportModal from '@/components/ImportModal' //批量导入modal
import ShowMedicalAuditLogModal from './ShowMedicalAuditLogModal'//查看日志
import UndoMedicalAuditLogModal from './UndoMedicalAuditLogModal'//撤销操作modal
import AuditMedicalAuditLogModal from './AuditMedicalAuditLogModal'//审核操作modal
import BatchAuditMedicalAuditLogModal from './BatchAuditMedicalAuditLogModal'//批量审核操作modal
import CleanMedicalAuditLogModal from './CleanMedicalAuditLogModal'//一键清理modal
import JEllipsis from '@/components/jeecg/JEllipsis'
import moment from "moment"


export const MedicalAuditLogListMixin = {
  components: {
    ImportModal,
    ShowMedicalAuditLogModal,
    UndoMedicalAuditLogModal,
    AuditMedicalAuditLogModal,
    BatchAuditMedicalAuditLogModal,
    CleanMedicalAuditLogModal,
    JEllipsis,
  },
  data(){
    return {
      userInfoBean: null,//登录用户
      searchQueryParams:{},//查询参数,不包含order
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${this.$config['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  beforeMount(){
    this.userInfoBean = this.userInfo()
  },
  methods:{
    ...mapGetters(["userInfo"]),
    //转换时间格式
    formateDate(datetime) {
      function addDateZero(num) {
        return (num < 10 ? "0" + num : num);
      }
      if(!datetime){
        return '';
      }
      let d = new Date(datetime);
      let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
      return formatdatetime;
    },
    setParamDate(){
      delete this.queryParam.createTime_begin
      delete this.queryParam.createTime_end
      delete this.queryParam.updateTime_begin
      delete this.queryParam.updateTime_end
      delete this.queryParam.deleteTime_begin
      delete this.queryParam.deleteTime_end
      delete this.queryParam.actionTime1
      delete this.queryParam.actionTime2
      if(this.queryParam.actionType=='edit'){
        this.queryParam.updateTime_begin = this.formateDate(this.queryParam.time1)
        this.queryParam.updateTime_end = this.formateDate(this.queryParam.time2)
      }else if(this.queryParam.actionType=='add'){
        this.queryParam.createTime_begin = this.formateDate(this.queryParam.time1)
        this.queryParam.createTime_end = this.formateDate(this.queryParam.time2)
      }else if(this.queryParam.actionType=='delete'){
        this.queryParam.deleteTime_begin = this.formateDate(this.queryParam.time1)
        this.queryParam.deleteTime_end = this.formateDate(this.queryParam.time2)
      }else{
        this.queryParam.actionTime1 = this.formateDate(this.queryParam.time1);
        this.queryParam.actionTime2 = this.formateDate(this.queryParam.time2);
      }
    },
    //查询
    searchQueryFn() {
      this.setParamDate()
      this.searchQuery();
      let params = Object.assign({}, this.getQueryParams());
      params.column = '';
      params.order = '';
      this.searchQueryParams = params;
    },
    //批量导入
    importAll(){
      let param = {title:'批量导入',importUrl:this.url.importExcelUrl,uploadFileName:this.tableName+'_import.xls'}
      this.$refs.importModel.loadData(param);
    },
    //批量新增
    importAdd(){
      let param = {title:'批量新增',importUrl:this.url.importExcelUrl,actionType:'add',uploadFileName:this.tableName+'_add.xls'}
      this.$refs.importModel.loadData(param);
    },
    //批量修改
    importUpdate(){
      let param = {title:'批量修改',importUrl:this.url.importExcelUrl,actionType:'update',uploadFileName:this.tableName+'_update.xls'}
      this.$refs.importModel.loadData(param);
    },
    //查看审核日志
    showMedicalAuditLog(record) {
      let param = {id:record[this.keyFiled],tableName:this.tableName}
      this.$refs.showMedicalAuditLogModel.loadData(param);
    },
    myModalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData();
      this.onClearSelected();
    },
    //修改
    update(){
      if(this.selectionRows.length!==1){
        this.$message.error("请选择1条记录!")
      }else{
        let data = this.selectionRows;
        let state = data[0].state
        if(state==='2'){
          this.$message.error("该记录的数据状态为无效，请勿进行修改");
          return;
        }
        let auditResult = data[0].auditResult
        let actionType = data[0].actionType
        if(auditResult==='0'){
          let actionStaff = data[0].actionStaff;
          let userId = this.userInfoBean.id;
          if(actionType==='delete'){
            this.$message.error("该记录正在删除审核中，请勿进行修改");
            return;
          }else if(actionType==='add'&&userId!==actionStaff){
            this.$message.error("该记录为其他用户新增 ,待审核中，请勿进行修改");
            return;
          }else if(actionType==='update'&&userId!==actionStaff){
            this.$message.error("该记录其他用户正在修改 ,待审核中，请勿进行修改");
            return;
          }
        }
        if(auditResult==='0'&&actionType==='add'){//新增待审核状态，进行修改
          data[0].fntype = 'add'
        }else{
          data[0].fntype = 'update'
        }
        this.handleEdit(data[0]);
      }
    },
    //删除
    del(){
      if(this.selectionRows.length===0){
        this.$message.error("请您选择至少一条记录进行删除")
      }else{
        let data = this.selectionRows;
        let ids="";
        for(let i=0;i<data.length;i++){
          let state = data[i].state
          if(state==='2'){
            this.$message.error("请勿删除无效的数据");
            return;
          }
          let auditResult = data[i].auditResult
          if(auditResult==='0'){
            this.$message.error("请勿删除正在审核中的数据");
            return;
          }
          ids += data[i][this.keyFiled]+",";
        }
        ids = ids.substring(0, ids.length - 1);
        if(data.length===1){
          data[0].fntype = 'delete'
          this.$refs.modalForm.title = "删除";
          this.$refs.modalForm.disableSubmit = false;
          this.$refs.modalForm.edit(data[0]);
        }else{
          let param = {id:ids,tableName:this.tableName,fntype:'batchDelete'}
          this.$refs.modalForm.title = "删除";
          this.$refs.modalForm.disableSubmit = false;
          this.$refs.modalForm.edit(param);
        }
      }
    },
    //全部删除
    deleteAll(){
      this.selectAll();
      let totalCount = this.ipagination.total;
      if(totalCount==0){
        this.$message.error("当前页面未查询出记录，请重新查询");
        return;
      }
      //获取查询条件 中的数据状态
      let state = this.searchQueryParams.state;
      if(state&&state!=='1'){
        this.$message.error("请查询数据状态为“有效”的记录进行全部删除");
        return;
      }else{
        //判断全部数据中是否包含待生效或者有效的数据
        let params = Object.assign({}, this.searchQueryParams);//查询条件
        params.state = '2';//无效
        let that = this;
        getAction(that.url.getDataCount,params,'get').then((res) => {
          if (res.success) {
            let count =res.result;
            if(count>0&&state!=='1'){
              this.$message.error("当前页面的查询数据中包含“无效”数据，无法进行全部删除");
              return;
            }else{
              //获取查询条件 中的审核状态
              let params2 = Object.assign({}, that.searchQueryParams);//查询条件
              var auditResult = params2.auditResult;
              if(!auditResult){
                //判断全部数据中是否包含待审核的数据
                params2.auditResult = '0';//待审核
                getAction(that.url.getDataCount,params2,'get').then((res2) => {
                  if (res2.success) {
                    let count2 =res2.result
                    if(count2>0){
                      that.$message.error("当前页面的查询数据中包含“待审核”数据，无法进行全部删除");
                      return;
                    }else{
                      let param = {tableName:that.tableName,fntype:'batchDelete',params:that.searchQueryParams}
                      that.$refs.modalForm.title = "全部删除";
                      that.$refs.modalForm.disableSubmit = false;
                      that.$refs.modalForm.edit(param);
                    }
                  }else{
                    that.$message.warning(data.message);
                  }
                })
              }else if(auditResult=='0'){
                this.$message.error("请查询审核状态为“审核通过”或者“审核不通过”的记录进行全部删除");
                return;
              }else{
                let param = {tableName:that.tableName,fntype:'batchDelete',params:that.searchQueryParams}
                that.$refs.modalForm.title = "全部删除";
                that.$refs.modalForm.disableSubmit = false;
                that.$refs.modalForm.edit(param);
              }
            }
          }else{
            that.$message.warning(data.message);
          }
        })
      }
    },
    //撤销
    undo(){
      if(this.selectionRows.length===0){
        this.$message.error("请您选择至少一条记录进行撤销操作")
      }else{
        let data = this.selectionRows;
        let ids="";
        for(let i=0;i<data.length;i++){
          let auditResult = data[i].auditResult
          let actionType = data[i].actionType
          if(auditResult!=='0'){
            this.$message.error("仅允许撤销“待审核”的操作");
            return;
          }else{
            let actionStaff = data[0].actionStaff;
            let userId = this.userInfoBean.id;
            if((actionType==='add'&&userId===actionStaff)||
              (actionType==='update'&&userId===actionStaff)||
              (actionType==='delete'&&userId===actionStaff)){
              ids += data[i][this.keyFiled]+",";
            }else{
              this.$message.error("仅允许撤销当前用户的“待审核”的操作");
              return;
            }
          }
        }
        ids = ids.substring(0, ids.length - 1);
        let param = {id:ids,tableName:this.tableName}
        if(data.length>1){
          param.fntype='batchUndo'
        }else{
          param.fntype='undo'
        }
        this.$refs.undoMedicalAuditLogModal.loadData(param);
        this.$refs.undoMedicalAuditLogModal.title = '撤销操作';
      }
    },
    //全部撤销
    undoAll(){
      debugger
      this.selectAll();
      let totalCount = this.ipagination.total;
      if(totalCount==0){
        this.$message.error("当前页面未查询出记录，请重新查询");
        return;
      }
      //获取查询条件 中的数据状态
      let auditResult = this.searchQueryParams.auditResult;
      if(auditResult&&auditResult!=='0'){
        this.$message.error("请查询审核状态为“待审核”的记录进行全部撤回");
        return;
      }else if(auditResult==='0') {
        let param = {tableName:this.tableName,fntype:'batchUndo',params:this.searchQueryParams}
        this.$refs.undoMedicalAuditLogModal.loadData(param);
        this.$refs.undoMedicalAuditLogModal.url.saveUndoAllMedicalAuditLog = this.url.saveUndoAllMedicalAuditLog
        this.$refs.undoMedicalAuditLogModal.title = '撤销操作';
      }else{
        //判断全部数据中是否包含审核通过、审核不审核的数据
        let params = Object.assign({}, this.searchQueryParams);//查询条件
        params.auditResult = '1,2';//审核通过、审核不审核
        let that = this;
        getAction(this.url.getDataCount,params,'get').then((res) => {
          if (res.success) {
            let count =res.result;
            if(count>0){
              this.$message.error("当前页面的查询数据中包含“审核通过”或者“审核不通过”数据，无法进行全部撤销");
              return;
            }else{
              //获取查询条件 中的审核状态
              let params2 = Object.assign({}, that.searchQueryParams);//查询条件
              var userId = this.userInfoBean.id;
              getAction(this.url.getDataCount,params2,'get').then((res2) => {
                if (res2.success) {
                  let count2 =res2.result
                  if(count2!==totalCount){
                    this.$message.error("仅允许撤销当前用户的“待审核”的操作");
                    return;
                  }else{
                    let param = {tableName:that.tableName,fntype:'batchUndo',params:that.searchQueryParams}
                    this.$refs.undoMedicalAuditLogModal.loadData(param);
                    this.$refs.undoMedicalAuditLogModal.url.saveUndoAllMedicalAuditLog = this.url.saveUndoAllMedicalAuditLog
                    this.$refs.undoMedicalAuditLogModal.title = '撤销操作';
                  }
                }else{
                  that.$message.warning(data.message);
                }
              })
            }
          }else{
            that.$message.warning(data.message);
          }
        })
      }
    },
    //审核
    audit(){
      if(this.selectionRows.length===0){
        this.$message.error("请您选择至少一条记录进行审核操作")
      }else{
        let data = this.selectionRows;
        let ids="";
        for(let i=0;i<data.length;i++){
          let auditResult = data[i].auditResult
          if(auditResult!=='0'){
            this.$message.error("请选择待审核的数据进行操作");
            return;
          }
          ids += data[i][this.keyFiled]+",";
        }
        ids = ids.substring(0, ids.length - 1);

        if(data.length>1){
          let param = {recordKey:ids,tableName:this.tableName}
          this.$refs.batchAuditMedicalAuditLogModal.loadData(param);
          this.$refs.batchAuditMedicalAuditLogModal.title = '审核操作';
        }else{
          let param = {id:ids,tableName:this.tableName}
          this.$refs.auditMedicalAuditLogModal.loadData(param);
        }
      }
    },
    //全部审核
    auditAll(){
      this.selectAll();
      let totalCount = this.ipagination.total;
      if(totalCount==0){
        this.$message.error("当前页面未查询出记录，请重新查询");
        return;
      }
      //获取查询条件 中的数据状态
      let auditResult = this.searchQueryParams.auditResult;
      if(auditResult&&auditResult!=='0'){
        this.$message.error("请查询审核状态为“待审核”的记录进行全部审核");
        return;
      }else{
        //判断全部数据中是否包含待生效或者有效的数据
        let params = Object.assign({}, this.searchQueryParams);//查询条件
        if(auditResult!=='0'){
          params.auditResult = '1,2';//审核通过，审核不通过
        }
        let that = this;
        getAction(this.url.getDataCount,params,'get').then((res) => {
          if (res.success) {
            let count =res.result;
            if(auditResult!=='0'&&count>0){
              this.$message.error("当前页面的查询数据中包含“审核通过”或者“审核不通过”数据，无法进行全部审核");
              return;
            }else if(auditResult&&count!==totalCount){
              this.$message.error("当前页面的查询数据中包含“审核通过”或者“审核不通过”数据，无法进行全部审核");
              return;
            }else{
              let param = {tableName:that.tableName,fntype:'batchAudit',params:that.searchQueryParams}
              this.$refs.batchAuditMedicalAuditLogModal.loadData(param);
              this.$refs.batchAuditMedicalAuditLogModal.url.saveAuditAll = this.url.saveAuditAll
              this.$refs.batchAuditMedicalAuditLogModal.title = '全部审核';
            }
          }else{
            that.$message.warning(data.message);
          }
        })
      }
    },

    //一键清理
    clean(){
      this.selectAll();
      let totalCount = this.ipagination.total;
      if(totalCount==0){
        this.$message.error("当前页面未查询出记录，请重新查询");
        return;
      }
      //获取查询条件 中的数据状态
      let state = this.searchQueryParams.state;
      if(state&&state!=='2'){
        this.$message.error("请查询数据状态为“无效”的记录进行一键清理");
        return;
      }else{
        //判断全部数据中是否包含待生效或者有效的数据
        let params = Object.assign({}, this.searchQueryParams);//查询条件
        if(state!=='2'){
          params.state = '0,1';//待生效、有效
        }
        let that = this;
        getAction(this.url.getDataCount,params,'get').then((res) => {
          if (res.success) {
            let count =res.result;
            if(state!=='2'&&count>0){
              this.$message.error("当前页面的查询数据中包含“有效”或者“待生效”数据，无法进行一键清理");
              return;
            }else if(state&&count!==totalCount){
              this.$message.error("当前页面的查询数据中包含“有效”或者“待生效”数据，无法进行一键清理");
              return;
            }else{
              let param = {tableName:that.tableName,params:that.searchQueryParams}
              this.$refs.cleanMedicalAuditLogModal.loadData(param);
              this.$refs.cleanMedicalAuditLogModal.url = this.url.saveClean;
            }
          }else{
            that.$message.warning(res.message);
          }
        })
      }
    },

    //导出
    handleExportExcel(name) {
      if(this.ipagination.total === 0){
        this.$message.warn('没有需要导出的数据')
        return
      }
      this.url.exportXlsUrl=this.url.exportExcel
      let totalCount = this.ipagination.total;
      if (totalCount < 5000||(this.selectedRowKeys && this.selectedRowKeys.length > 0)) {
        this.handleExportFile(name + moment().format('YYYYMMDDHHmmss')+'.xlsx')
        return;
      }
      this.handleExportXlsAsync()

    },
    //全部选中
    selectAll(){
      this.selectedRowKeys = [];
      this.selectionRows = [];
      this.selectedRowRecords = [];
      let that = this;
      this.dataSource.forEach(function (record) {
        that.selectedRowRecords.push(record);
        that.selectionRows.push(record);
        that.selectedRowKeys.push(record[that.keyFiled]);
      });
    },
    //打开其他字典
    openOtherDictTab(dictEname){
      this.$util.openTab('/config/MedicalOtherDictList?dictEname='+dictEname)
    },
    //同步到Hive
    dataimportHive(tableName){
      let params = {tableName: tableName}
      this.loading = true
      getAction(this.$suncare_v3+"/config/medicalHive/updateStdToHiveConfig", params).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
        }else{
          this.$message.warning(res.message);
        }
      }).catch(e => {
        this.$message.error(e.message);
      }).finally(() => {
        this.loading = false
      })
    },

  }
}