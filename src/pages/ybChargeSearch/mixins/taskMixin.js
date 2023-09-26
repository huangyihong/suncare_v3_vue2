import {getAction } from '@/api/manage'
export const taskMixin = {
  components: {

  },
  data(){
    return {
      bean:{taskType:''},
      url: {
        getResultConfigMap: "/ybChargeSearch/ybChargeSearchTask/getResultConfigMap",
        getDatasourceAndDatabase: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getDatasourceAndDatabase",
      },
      resultConfigBean:{},
      resultConfigMap:{},
      datasourceAndDatabaseVO:null,
    }
  },
  methods:{
    //机构查询过滤
    filterOption(input, option) {
      let val = input
      let item = option.componentOptions.children[0].text

      if(val == item){//把value相同的搜索出来
        return true;
      }
      if(item.indexOf(val) != -1){//名称中包含的搜索出来
        return true;
      }
      if(val){
        val = val.replace(/，/ig,',');
        var valArr1 = val.split('#')
        for(var j = 0; j < valArr1.length; j++) {
          var flag = true;
          var valArr2 = valArr1[j].split(',')
          for(var i = 0; i < valArr2.length; i++) {
            if(item.indexOf(valArr2[i]) == -1){//不包含
              flag =  false
            }
          }
          if(flag){
            return true
          }
        }
        return false
      }
      return false;//不知道的就不管了
    },

    //获取配置信息
    loadResultConfigMap(){
      getAction(this.url.getResultConfigMap, {}).then((res) => {
        if (res.success) {
          this.resultConfigMap = res.result;
          this.resultConfigBean = Object.assign({}, this.resultConfigMap[this.bean.taskType]);
        }else{
          this.$message.warning(res.message);
        }
      })
    },

    //获取项目地和数据库配置信息
    getDatasourceAndDatabase(){
      getAction(this.url.getDatasourceAndDatabase, {}).then((res) => {
        if (res.success) {
          this.datasourceAndDatabaseVO = res.result;
          if(this.datasourceAndDatabaseVO&&this.datasourceAndDatabaseVO.sysDatasource&&this.datasourceAndDatabaseVO.sysDatasource.etlSource){
            let etlSource = this.datasourceAndDatabaseVO.sysDatasource.etlSource
            if(etlSource=='A01'){
              etlSource = 'yb'
            }else if(etlSource=='A03'){
              etlSource = 'his'
            }
            this.bean.etlSource = etlSource
            this.form.setFieldsValue({etlSource:etlSource})
          }
        }else{
          this.$message.warning(res.message);
        }
      })
    },


  }
}