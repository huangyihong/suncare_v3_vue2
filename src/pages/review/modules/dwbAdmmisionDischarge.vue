<template>
  <div>
    <div style="padding:10px 10px;">
      <a-select placeholder="请选择字段名称" style="width: 200px" v-model="fieldName">
        <a-select-option value="">全字段搜索</a-select-option>
        <a-select-option v-for="(item,index) in fieldList" :value="item.field" :key="index">{{item.title}}</a-select-option>
      </a-select>
      <a-input placeholder="病历内容搜索" v-model.trim="fieldValue" style="width: 300px"></a-input>
      <a-button type="primary" class="m-l-6" @click="fieldNameScroll('highlights')"><a-icon type="search"/></a-button>
    </div>

    <a-skeleton active :loading="dwbAdmmisionLoading&&dwbAdmmisionLoading">
      <a-descriptions title="" bordered size="default" column="1">
        <a-descriptions-item :span="3" v-for="(item,index) in fieldList" :key="index" :label="item.title">
          <span :class="item.field" v-html="highlights(dwbAdmmisionDischargeVo[item.table][item.field],item.field,fieldValue)">
          {{dwbAdmmisionDischargeVo[item.table][item.field]}}
          </span>
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>

  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  export default {
    name: 'dwbAdmmisionDischarge',
    components: {},
    props: {
      visitid: String,
    },
    data() {
      return {
        url: {
          queryDwbDischargeByVisitid: this.$suncare_v3 + '/review/queryDwbDischargeByVisitid',
          queryDwbAdmmisionByVisitid: this.$suncare_v3 + '/review/queryDwbAdmmisionByVisitid',
        },
        dwbDischargeLoading: false,
        dwbAdmmisionLoading: false,
        fieldName:'',//搜索字段名
        fieldValue:'',//搜索字段值
        fieldList:[
          {field:'complain', title:'主诉', table:'dwbAdmmisionVo'},
          {field:'diseaseprocedure', title:'现病史', table:'dwbAdmmisionVo'},
          {field:'diseasehistory', title:'疾病史（含外伤史）', table:'dwbAdmmisionVo'},
          {field:'surgeryHis', title:'手术史', table:'dwbAdmmisionVo'},
          {field:'porsonHis', title:'个人史', table:'dwbAdmmisionVo'},
          {field:'birthHis', title:'婚育史', table:'dwbAdmmisionVo'},
          {field:'menstruationHis', title:'月经史', table:'dwbAdmmisionVo'},
          {field:'familyHis', title:'家族史', table:'dwbAdmmisionVo'},
          {field:'generalCheck', title:'一般状况检查结果', table:'dwbAdmmisionVo'},
          {field:'specialCheck', title:'专科情况', table:'dwbAdmmisionVo'},
          {field:'assistCheck', title:'辅助检查结果', table:'dwbAdmmisionVo'},
          {field:'admDiseasestatus', title:'入院情况', table:'dwbDischargeVo'},
          {field:'admitdisease', title:'入院诊断名称', table:'dwbDischargeVo'},
          {field:'leavedisease', title:'出院诊断-西医诊断名称', table:'dwbDischargeVo'},
          {field:'leaveDescribe', title:'出院情况', table:'dwbDischargeVo'},
          {field:'leaveorder', title:'出院医嘱', table:'dwbDischargeVo'},
        ],
        dwbAdmmisionDischargeVo:{},
      }
    },
    beforeMount() {

    },
    watch: {
      fieldName: {
        immediate: true,
        handler(val) {
          this.fieldNameScroll(val)
        }
      },
      visitid: {
        immediate: true,
        handler(val) {
          if (val) {
            this.loadDwbDischargeVo(val)
            this.loadDwbAdmmisionVo(val)
          }

        },
      },
    },
    methods: {
      loadDwbDischargeVo(visitid) {
        this.dwbDischargeLoading = true;
        let param = { visitid: visitid };
        getAction(this.url.queryDwbDischargeByVisitid, param, 'get').then((res) => {
          if (res.success) {
            let record = res.result
            this.dwbAdmmisionDischargeVo.dwbDischargeVo = record || {}
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbDischargeLoading = false;
        })
      },
      loadDwbAdmmisionVo(visitid) {
        this.dwbAdmmisionLoading = true;
        let param = { visitid: visitid };
        getAction(this.url.queryDwbAdmmisionByVisitid, param, 'get').then((res) => {
          if (res.success) {
            let record = res.result
            this.dwbAdmmisionDischargeVo.dwbAdmmisionVo = record || {}
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
          this.dwbAdmmisionLoading = false;
        })
      },
      //高亮
      highlights(val,field,key){
        const Reg = new RegExp(key,'g')
        if(val&&(!this.fieldName||this.fieldName==field)){
          return val.replace(Reg,`<span style="color:#ff5134" class="highlights">${key}</span>`)
        }
        return val
      },
      //滚动
      fieldNameScroll(fieldName){
        if(fieldName){
          console.log('fieldName::::::',fieldName)
          //this.$el.querySelector("."+fieldName).scrollIntoView()
          document.getElementsByClassName(fieldName)[0].scrollIntoView();
        }
      }
    },
    computed: {}
  }
</script>
<style scoped>
  /deep/.ant-descriptions-item-label{
    width: 150px;
}
</style>
