/**
 * 基础数据模块 通用替换功能js
 */
import {getAction } from '@/api/manage'
export const CommonReplaceDataMixin = {
  components: {

  },
  data(){
    return {
      selectVisible: false,//显示选择替换的窗口
      selectData: [],//选中替换成的数据
      replaceData:null,//需要替换的数据
    }
  },
  methods:{
    //替换
    handleReplaceData(){
      if(this.selectionRows.length!==1){
        this.replaceData = null
        this.$message.error("请选择1条记录进行替换!")
      }else {
        this.replaceData = this.selectionRows[0]
        this.selectVisible = true
        this.selectData = []
      }
    },
    //选择替换窗口确定
    handleSelectOk() {
      let selectData = this.$refs.selectRef.getSelect()
      let replaceCode = this.replaceData.code
      let replaceName = this.replaceData.name
      if(this.tableName=='MEDICAL_EQUIPMENT'){
        replaceCode = this.replaceData.productcode
        replaceName = this.replaceData.productname
      }else if(this.tableName=='MEDICAL_PROJECT_GROUP'||this.tableName=='MEDICAL_DISEASE_GROUP'||this.tableName=='MEDICAL_DRUG_GROUP'){
        replaceCode = this.replaceData.groupCode
        replaceName = this.replaceData.groupName
      }
      let contentStr = '是否确认将“'+replaceName+'('+replaceCode+')'+'”替换为“'+selectData[0].name+'('+selectData[0].code+')'+'”?'

      if (selectData.length ==1 ) {
        const that = this
        this.$confirm({
          title: '确认替换',
          content: contentStr,
          onOk: function() {
            that.setSelectObj(selectData[0])
          }
        })
      }
      this.handleSelectClose()
    },
    //关闭选择替换窗口
    handleSelectClose() {
      this.selectVisible = false
    },
    //选择替换提交
    setSelectObj(obj) {
      if (obj.code && obj.code.length > 0) {
        this.selectData = [obj]
      } else {
        this.selectData = []
      }
      let replaceCode = this.replaceData.code
      let replaceId =  this.replaceData.id
      if(this.tableName=='MEDICAL_EQUIPMENT'){
        replaceCode = this.replaceData.productcode
      }else if(this.tableName=='MEDICAL_PROJECT_GROUP'||this.tableName=='MEDICAL_DISEASE_GROUP'||this.tableName=='MEDICAL_DRUG_GROUP'){
        replaceCode = this.replaceData.groupCode
        replaceId =  this.replaceData.groupId
      }
      if(obj.code==replaceCode){
        this.$message.error("请选择不同的数据进行替换!")
        return
      }
      if(this.selectData.length ==1&&this.replaceData){
        this.loading = true
        //进行替换操作
        let param = {};
        param.code = obj.code
        param.id = replaceId
        getAction(this.url.replaceData,param,'get').then((data) => {
          this.loading = false
          if (data.success) {
            this.$message.success(data.message);
            this.onClearSelected()
            this.loadData()
          }else{
            this.$message.warning(data.message);
          }
        })
      }
    },
  }
}