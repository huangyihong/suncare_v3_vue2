import {getAction } from '@/api/manage'
import debounce from 'lodash/debounce'
import OdsCheckorgList from "@/pages/ybChargeSearch/plugin/OdsCheckorgListForm.vue"
export const orgSelectMixin = {
  components: {
    OdsCheckorgList
  },
  beforeMount() {

    this.getOrgList()

  },
  data(){
    this.lastFetchId = 0;
    this.fetchOrg = debounce(this.fetchOrg, 800);
    return {
      selectOrgsArr:[],//机构选中的数据
      selectOrgList:[],//机构下拉选项

      url: {
        getOrgPageList: this.$suncare_v3 +"/apiYbChargeSearch/ybChargeSearchTask/getOrgPageList",
      },
      orgs:[],
      fetching: false,
    }
  },
  methods:{
    fetchOrg(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.selectOrgList = [];
      this.fetching = true;
      getAction(this.url.getOrgPageList, {orgname:value,pageSize:50}).then((res) => {
        if (res.success) {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = res.result.records.map(item => ({
            text:item.orgname,
            value:item.orgid,
          }));
          this.selectOrgList = data;
          this.fetching = false;
        }else{
          this.$message.warning(res.message);
        }
      })

    },

    //获取机构列表
    getOrgList(){
      this.fetchOrg()
    },

    handleChangeOrg(value) {
      Object.assign(this, {
        selectOrgsArr:value,
        fetching: false,
      });
      let orgs = this.selectOrgsArr.map(t=>{
        return t.label
      })
      this.orgs = orgs
      this.form.setFieldsValue({orgs})
    },

    selectOrg(){
      this.$refs.odsCheckorgList.show()
    },
    setOrgsData(){
      this.orgsData=this.$refs.odsCheckorgList.orgsData
      this.setOrgsField()
    },
    setOrgsField(){
      var orgs = this.orgsData.map(function(obj,index){
        return obj.orgname;
      })
      this.orgs = orgs
      this.form.setFieldsValue({orgs:orgs})
      this.selectOrgsArr =this.orgsData.map(item => ({
        label: item.orgname,
        key: item.orgid,
      }))
    },
    //根据orgnames获取orgids
    getOrgids(orgs){
      let orgids = this.selectOrgsArr.map(t=>{
        return t.key
      })
      return orgids.join(',')
    },



  }
}