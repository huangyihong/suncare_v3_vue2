export const BatchTaskMixin = {
  components: {

  },
  data(){
    return {

    }
  },
  methods:{
    openImportTaskPage(){

      let that = this
      setTimeout(function(){
        if(that.confirmLoading){
          that.confirmLoading = false;
          that.$emit('ok');
          that.close();
          that.$confirm({
            title: '后台正在运行,打开批量操作日志记录界面查看进度?',
            content: '',
            onOk() {
              that.$util.openTab('/config/MedicalImportTaskList')
            }
          })
        }
      },3*60*1000);
    }
  }
}